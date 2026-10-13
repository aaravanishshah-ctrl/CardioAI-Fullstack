from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI(
    title="CardioAI API",
    description="Clinical + Genomic Cardiovascular Risk Prediction",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# LOAD MODELS
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

try:
    gene_pipeline = joblib.load(os.path.join(MODELS_DIR, "cardio_pipeline.pkl"))
    encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
    gene_columns = joblib.load(os.path.join(MODELS_DIR, "gene_columns.pkl"))
    clinical_columns = joblib.load(os.path.join(MODELS_DIR, "clinical_columns.pkl"))
    clinical_model = joblib.load(os.path.join(MODELS_DIR, "clinical_only_model.pkl"))
    clinical_features = joblib.load(os.path.join(MODELS_DIR, "clinical_feature_names.pkl"))
    print("✅ All 6 models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    raise

# --------------------------------------------------
# CLINICAL CONVERSION HELPERS
# --------------------------------------------------
def chol_to_cat(mgdl: float) -> int:
    if mgdl < 200: return 1
    if mgdl < 240: return 2
    return 3

def gluc_to_cat(mgdl: float) -> int:
    if mgdl < 100: return 1
    if mgdl < 126: return 2
    return 3

def htn_staging(sys: float, dia: float):
    if sys < 120 and dia < 80:
        return 5, "Normal BP (<120/<80 mmHg)"
    if sys < 130 and dia < 80:
        return 25, "Elevated BP (120-129/<80 mmHg)"
    if (130 <= sys < 140) or (80 <= dia < 90):
        return 55, "Stage 1 Hypertension (130-139/80-89 mmHg)"
    if sys >= 140 or dia >= 90:
        if sys >= 180 or dia >= 120:
            return 95, "Hypertensive Crisis (≥180/≥120 mmHg)"
        return 80, "Stage 2 Hypertension (≥140/≥90 mmHg)"
    return 10, "Normal BP"

def met_syndrome_score(bmi, sys, dia, gluc, chol):
    criteria = 0
    if bmi >= 30: criteria += 1
    if sys >= 130 or dia >= 85: criteria += 1
    if gluc >= 100: criteria += 1
    if chol >= 200: criteria += 1
    pct = min(100, criteria * 25)
    if criteria >= 3:
        label = "High Risk — Meets Metabolic Syndrome Threshold"
    elif criteria == 2:
        label = "Moderate Risk — 2 Risk Factors Present"
    else:
        label = "Low Risk"
    return pct, label, criteria

def cad_risk_calc(age, gender, chol, sys, cigs, bmi):
    score = 0
    if age >= 45 and gender == 2: score += 15
    if age >= 55 and gender == 1: score += 15
    if chol >= 240: score += 20
    elif chol >= 200: score += 10
    if sys >= 140: score += 15
    if cigs > 0: score += 20
    if bmi >= 30: score += 10
    return min(100, score)

def stroke_risk_calc(age, sys, cigs, gluc):
    score = 0
    if age >= 55: score += 20
    if age >= 65: score += 15
    if sys >= 140: score += 25
    if sys >= 160: score += 15
    if cigs > 0: score += 15
    if gluc >= 126: score += 10
    return min(100, score)

# --------------------------------------------------
# REQUEST / RESPONSE SCHEMAS
# --------------------------------------------------
class ClinicalInput(BaseModel):
    age: float
    gender: str                    # "Female" or "Male"
    height_cm: float
    weight_kg: float
    systolic_bp: float
    diastolic_bp: float
    total_cholesterol: float
    fasting_glucose: float
    cigarettes_per_day: float = 0
    drinks_per_week: float = 0
    exercise_min_per_week: float = 150

# --------------------------------------------------
# ENDPOINTS
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "CardioAI API is running", "version": "1.0.0"}

@app.post("/api/predict/clinical")
def predict_clinical(data: ClinicalInput):
    try:
        gender = 1 if data.gender.lower() == "female" else 2
        bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
        cholesterol = chol_to_cat(data.total_cholesterol)
        gluc = gluc_to_cat(data.fasting_glucose)
        smoke = 1 if data.cigarettes_per_day > 0 else 0
        alco = 1 if data.drinks_per_week >= 7 else 0
        active = 1 if data.exercise_min_per_week >= 150 else 0

        pulse_pressure = data.systolic_bp - data.diastolic_bp
        map_val = (data.systolic_bp + 2 * data.diastolic_bp) / 3
        bp_stage = 0 if (data.systolic_bp < 120 and data.diastolic_bp < 80) else (
            1 if data.systolic_bp < 130 and data.diastolic_bp < 80 else (
                2 if data.systolic_bp < 140 or data.diastolic_bp < 90 else 3
            )
        )
        bmi_cat = 0 if bmi < 18.5 else (1 if bmi < 25 else (2 if bmi < 30 else 3))
        age_group = 0 if data.age < 40 else (1 if data.age < 50 else (2 if data.age < 60 else (3 if data.age < 70 else 4)))
        n_risk = int(cholesterol > 1) + int(gluc > 1) + int(smoke == 1) + int(active == 0) + int(bmi >= 30) + int(data.systolic_bp >= 140) + int(data.age >= 55)
        female_postmeno = int(gender == 1 and data.age >= 55)

        full_feats = {
            "age_years": data.age, "gender": gender, "bmi": bmi,
            "ap_hi": data.systolic_bp, "ap_lo": data.diastolic_bp,
            "cholesterol": cholesterol, "gluc": gluc,
            "smoke": smoke, "alco": alco, "active": active,
            "pulse_pressure": pulse_pressure, "map": map_val,
            "bp_stage": bp_stage, "bmi_cat": bmi_cat, "age_group": age_group,
            "age_x_bmi": data.age * bmi, "age_x_sys": data.age * data.systolic_bp,
            "bmi_x_chol": bmi * cholesterol, "smoke_x_age": smoke * data.age,
            "active_x_bmi": active * bmi, "chol_x_gluc": cholesterol * gluc,
            "pp_x_age": pulse_pressure * data.age,
            "n_risk_factors": n_risk, "female_postmeno": female_postmeno,
            "height": data.height_cm, "weight": data.weight_kg,
        }

        try:
            clin_input = pd.DataFrame([full_feats])[clinical_features]
        except KeyError:
            clin_input = pd.DataFrame([{
                "age_years": data.age, "gender": gender, "bmi": bmi,
                "ap_hi": data.systolic_bp, "ap_lo": data.diastolic_bp,
                "cholesterol": cholesterol, "gluc": gluc,
                "smoke": smoke, "alco": alco, "active": active,
            }])[clinical_features]

        prob = clinical_model.predict_proba(clin_input)[0]
        overall_risk = float(prob[1] * 100)

        if overall_risk < 30:
            overall_level = "Low Risk"
        elif overall_risk < 60:
            overall_level = "Moderate Risk"
        else:
            overall_level = "High Risk"

        htn_pct, htn_label = htn_staging(data.systolic_bp, data.diastolic_bp)
        ms_pct, ms_label, ms_crit = met_syndrome_score(bmi, data.systolic_bp, data.diastolic_bp, data.fasting_glucose, data.total_cholesterol)
        cad_pct = cad_risk_calc(data.age, gender, data.total_cholesterol, data.systolic_bp, data.cigarettes_per_day, bmi)
        stroke_pct = stroke_risk_calc(data.age, data.systolic_bp, data.cigarettes_per_day, data.fasting_glucose)

        factors = []
        if data.age > 55: factors.append(f"Age {int(data.age)} (higher risk threshold)")
        if bmi >= 30: factors.append(f"BMI {bmi:.1f} (Obese range)")
        elif bmi >= 25: factors.append(f"BMI {bmi:.1f} (Overweight range)")
        if data.systolic_bp >= 140 or data.diastolic_bp >= 90:
            factors.append(f"Blood Pressure {int(data.systolic_bp)}/{int(data.diastolic_bp)} mmHg (Stage 2 Hypertension)")
        elif data.systolic_bp >= 130 or data.diastolic_bp >= 80:
            factors.append(f"Blood Pressure {int(data.systolic_bp)}/{int(data.diastolic_bp)} mmHg (Elevated/Stage 1)")
        if data.total_cholesterol >= 240: factors.append(f"Total Cholesterol {int(data.total_cholesterol)} mg/dL (High ≥240)")
        elif data.total_cholesterol >= 200: factors.append(f"Total Cholesterol {int(data.total_cholesterol)} mg/dL (Borderline 200-239)")
        if data.fasting_glucose >= 126: factors.append(f"Fasting Glucose {int(data.fasting_glucose)} mg/dL (Diabetic range ≥126)")
        elif data.fasting_glucose >= 100: factors.append(f"Fasting Glucose {int(data.fasting_glucose)} mg/dL (Prediabetic 100-125)")
        if data.cigarettes_per_day > 0: factors.append(f"Tobacco use ({int(data.cigarettes_per_day)} cigarettes/day)")
        if data.drinks_per_week >= 7: factors.append(f"Alcohol consumption ({int(data.drinks_per_week)} drinks/week)")
        if data.exercise_min_per_week < 150: factors.append(f"Physical activity ({int(data.exercise_min_per_week)} min/week — below WHO 150 min guideline)")

        return {
            "overall_risk_pct": round(overall_risk, 1),
            "overall_level": overall_level,
            "hypertension_score": htn_pct,
            "hypertension_label": htn_label,
            "metabolic_score": ms_pct,
            "metabolic_label": ms_label,
            "metabolic_criteria": ms_crit,
            "cad_score": cad_pct,
            "stroke_score": stroke_pct,
            "bmi": round(bmi, 1),
            "contributing_factors": factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/genomic")
async def predict_genomic(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file, index_col=0)
        results = []

        for idx in df.index:
            gene_vector = pd.Series(0.0, index=gene_columns)
            for gene in gene_columns:
                if gene in df.columns:
                    gene_vector[gene] = df.loc[idx, gene]

            clin_vector = pd.Series(0.0, index=clinical_columns)
            X_input = pd.DataFrame([pd.concat([gene_vector, clin_vector])])

            probs = gene_pipeline.predict_proba(X_input)[0]
            class_probs = [
                {"class": cls.replace("_", " "), "probability": round(float(p) * 100, 1)}
                for cls, p in zip(encoder.classes_, probs)
            ]
            class_probs.sort(key=lambda x: x["probability"], reverse=True)

            results.append({
                "sample_id": str(idx),
                "predictions": class_probs
            })

        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

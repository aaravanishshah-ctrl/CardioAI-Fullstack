'use client';

import React, { useState } from 'react';
import { 
  Dna, 
  CheckCircle, 
  AlertTriangle, 
  Activity
} from 'lucide-react';

export default function ScreeningPage() {
  const [inputMode, setInputMode] = useState<'clinical' | 'genomic'>('clinical');
  
  // Clinical Form Inputs
  const [age, setAge] = useState<number>(50);
  const [gender, setGender] = useState<string>('Female');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [cholesterol, setCholesterol] = useState<number>(180);
  const [glucose, setGlucose] = useState<number>(95);
  const [cigs, setCigs] = useState<number>(0);
  const [drinks, setDrinks] = useState<number>(0);
  const [exercise, setExercise] = useState<number>(150);

  // Genomic Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for Results
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clinicalResult, setClinicalResult] = useState<any>(null);
  const [genomicResult, setGenomicResult] = useState<any>(null);

  const bmi = (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);

  // Handle Clinical Submit
  const handleClinicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setClinicalResult(null);

    try {
      const response = await fetch('https://cardioai-backend-3knn.onrender.com/api/predict/clinical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(age),
          gender,
          height_cm: Number(heightCm),
          weight_kg: Number(weightKg),
          systolic_bp: Number(systolicBp),
          diastolic_bp: Number(diastolicBp),
          total_cholesterol: Number(cholesterol),
          fasting_glucose: Number(glucose),
          cigarettes_per_day: Number(cigs),
          drinks_per_week: Number(drinks),
          exercise_min_per_week: Number(exercise),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction from FastAPI backend');
      }

      const data = await response.json();
      setClinicalResult(data);
    } catch (err: any) {
      setError(err.message || 'Could not connect to FastAPI backend on port 8000');
    } finally {
      setLoading(false);
    }
  };

  // Handle Genomic Submit
  const handleGenomicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a gene expression CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setGenomicResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://cardioai-backend-3knn.onrender.com/api/predict/genomic', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process genomic dataset');
      }

      const data = await response.json();
      setGenomicResult(data.results);
    } catch (err: any) {
      setError(err.message || 'Genomic assessment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-widest block mb-1">
          Screening Tool
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Begin assessment.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Enter quantitative clinical vitals or upload blood transcriptomic profiles for automated evaluation.
        </p>
      </div>

      {/* MODE TOGGLE */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div className="bg-slate-200 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => setInputMode('clinical')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
              inputMode === 'clinical' 
                ? 'bg-white text-blue-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical &amp; Vitals Mode
          </button>
          <button
            onClick={() => setInputMode('genomic')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
              inputMode === 'genomic' 
                ? 'bg-white text-blue-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Genomic Profiling Mode
          </button>
        </div>
      </div>

      {/* FORM AREA */}
      {inputMode === 'clinical' ? (
        <form onSubmit={handleClinicalSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* DEMOGRAPHICS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider text-blue-800 border-b pb-2">
                1. Demographics
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Age (years)</label>
                <input 
                  type="number" 
                  min="18" 
                  max="100" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Height (cm)</label>
                  <input 
                    type="number" 
                    value={heightCm} 
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weightKg} 
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                Calculated BMI: <span className="font-bold text-blue-800">{bmi} kg/m²</span>
              </div>
            </div>

            {/* VITALS & LABS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider text-blue-800 border-b pb-2">
                2. Vitals &amp; Lab Measurements
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Systolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    value={systolicBp} 
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Diastolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    value={diastolicBp} 
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Cholesterol (mg/dL)</label>
                <input 
                  type="number" 
                  value={cholesterol} 
                  onChange={(e) => setCholesterol(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fasting Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  value={glucose} 
                  onChange={(e) => setGlucose(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>
            </div>

            {/* LIFESTYLE */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider text-blue-800 border-b pb-2">
                3. Lifestyle &amp; Habits
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cigarettes per day</label>
                <input 
                  type="number" 
                  value={cigs} 
                  onChange={(e) => setCigs(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alcoholic drinks / week</label>
                <input 
                  type="number" 
                  value={drinks} 
                  onChange={(e) => setDrinks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Exercise (min / week)</label>
                <input 
                  type="number" 
                  value={exercise} 
                  onChange={(e) => setExercise(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm" 
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition shadow-sm"
          >
            {loading ? 'Evaluating Model...' : 'Calculate Cardiovascular Risk Profile →'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleGenomicSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="max-w-xl mx-auto text-center py-6">
            <Dna className="w-12 h-12 text-blue-800 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-slate-900 mb-1">Blood Transcriptomic File Upload</h3>
            <p className="text-xs text-slate-500 mb-6">
              Upload a CSV file containing normalized gene expression values (e.g. TP53, IL6, AOAH).
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 mb-4 hover:border-blue-600 transition">
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-800 file:text-white hover:file:bg-blue-900 cursor-pointer"
              />
              {selectedFile && (
                <div className="mt-3 text-xs font-medium text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Selected: {selectedFile.name}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition shadow-sm"
            >
              {loading ? 'Running Genomic Classifier...' : 'Run 6-Class Genomic Profiling →'}
            </button>
          </div>
        </form>
      )}

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CLINICAL RESULTS RENDER */}
      {clinicalResult && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Machine Learning Probability
            </span>
            <div className="text-4xl font-extrabold text-blue-900 mt-1 mb-1">
              {clinicalResult.overall_risk_pct}%
            </div>
            <div className="text-lg font-semibold text-slate-800 mb-3">
              {clinicalResult.overall_level}
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  clinicalResult.overall_risk_pct < 30 
                    ? 'bg-emerald-600' 
                    : clinicalResult.overall_risk_pct < 60 
                    ? 'bg-amber-500' 
                    : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(100, clinicalResult.overall_risk_pct)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Trained on 70,000 patient records (Kaggle Cardiovascular Cohort).
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-xs text-slate-700 leading-relaxed">
            <strong className="text-blue-900 font-semibold block mb-1">💡 Clinical Staging vs. Probability Notice</strong>
            <strong>Overall Risk</strong> (above) is a statistical Machine Learning probability. 
            <strong>Specific Condition Profiles</strong> (below) represent <strong>AHA/ACC &amp; Framingham Guideline Staging Scores (0–100)</strong> to indicate clinical criteria severity, <em>not an immediate probability of an event</em>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">Hypertension Staging</h4>
                  <p className="text-xs text-slate-500">{clinicalResult.hypertension_label}</p>
                </div>
                <span className="text-xl font-extrabold text-blue-900">{clinicalResult.hypertension_score}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-800 h-full" style={{ width: `${clinicalResult.hypertension_score}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">Metabolic Syndrome</h4>
                  <p className="text-xs text-slate-500">{clinicalResult.metabolic_label}</p>
                </div>
                <span className="text-xl font-extrabold text-blue-900">{clinicalResult.metabolic_score}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-800 h-full" style={{ width: `${clinicalResult.metabolic_score}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">Coronary Artery Disease (CAD)</h4>
                  <p className="text-xs text-slate-500">Framingham Risk Factor Score</p>
                </div>
                <span className="text-xl font-extrabold text-blue-900">{clinicalResult.cad_score}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-800 h-full" style={{ width: `${clinicalResult.cad_score}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">Stroke Risk</h4>
                  <p className="text-xs text-slate-500">Hypertension &amp; Lifestyle Score</p>
                </div>
                <span className="text-xl font-extrabold text-blue-900">{clinicalResult.stroke_score}/100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-800 h-full" style={{ width: `${clinicalResult.stroke_score}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Contributing Factors Breakdown</h4>
            {clinicalResult.contributing_factors.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-600">
                {clinicalResult.contributing_factors.map((factor: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-blue-800 font-bold">•</span> {factor}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-700">No major clinical risk factors identified.</p>
            )}
          </div>
        </div>
      )}

      {/* GENOMIC RESULTS RENDER */}
      {genomicResult && (
        <div className="space-y-6">
          {genomicResult.map((sample: any, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-4 border-b pb-2">
                Sample ID: {sample.sample_id}
              </h3>

              <div className="space-y-3">
                {sample.predictions.map((pred: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-semibold text-slate-800 text-sm">{pred.class}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pred.class === 'Healthy' ? 'bg-emerald-600' : 'bg-blue-800'}`}
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 w-12 text-right">{pred.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

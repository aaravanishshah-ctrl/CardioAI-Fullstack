export default function ForCliniciansPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-widest block mb-1">
          For Clinicians
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Methodology &amp; model architecture.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
          Technical documentation on how CardioAI&apos;s models are trained, validated, and intended to be used in decision-support workflows.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Model Architecture</h3>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              <strong>Clinical Model (XGBoost)</strong> — Trained on the Kaggle Cardiovascular Disease dataset (n=70,000). Features include age, gender, BMI, systolic/diastolic BP, cholesterol, glucose, smoking, alcohol, and physical activity.
            </p>
            <p>
              <strong>Genomic Model (Multi-Class Ensemble)</strong> — Trained on NCBI GEO series (GSE20680, GSE20681, GSE59867, GSE79768, GSE7531, GSE58294). Employs control-relative log2 normalization, within-cohort contrastive biomarker selection (~800 genes), and a soft-voting ensemble (XGBoost, ExtraTrees, Random Forest, HistGradientBoosting).
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">Performance Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Model Modality</th>
                  <th className="p-3">Test Accuracy</th>
                  <th className="p-3">Primary Evaluation Cohort</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium">Clinical (XGBoost)</td>
                  <td className="p-3">~73.0% (ROC AUC 0.80)</td>
                  <td className="p-3">13,919 held-out patient records</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Genomic 6-Class Ensemble</td>
                  <td className="p-3">85.1% Multiclass Accuracy</td>
                  <td className="p-3">194 held-out RNA-Seq transcriptomic samples</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Intended Use &amp; Limitations</h3>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 leading-relaxed">
            <li>Designed solely as a clinical decision-support adjunct.</li>
            <li>Not intended as a standalone diagnostic device or emergency triage tool.</li>
            <li>Models were trained on adult non-pregnant populations.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

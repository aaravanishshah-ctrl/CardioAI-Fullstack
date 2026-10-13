export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-widest block mb-1">
          About
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About CardioAI.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
          A clinical decision-support project exploring the integration of blood gene expression profiling with quantitative lifestyle risk modeling.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">The Project</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            CardioAI demonstrates an end-to-end biomedical AI workflow — from raw data ingestion (NCBI GEO), through cross-platform microarray normalization and multi-class ensemble training, to a modern full-stack web application.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Technology Stack</h3>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li><strong>Frontend:</strong> Next.js (React), Tailwind CSS, Lucide Icons</li>
            <li><strong>Backend API:</strong> Python, FastAPI, Uvicorn</li>
            <li><strong>Machine Learning:</strong> Scikit-Learn, XGBoost, Joblib, Pandas</li>
            <li><strong>Data Provenance:</strong> NCBI Gene Expression Omnibus (GEO), Kaggle</li>
          </ul>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Disclaimer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            CardioAI is a research and educational demonstration project. It is not a licensed medical device and should not be used as the sole basis for clinical diagnosis or treatment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}

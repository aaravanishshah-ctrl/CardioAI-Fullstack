import Link from 'next/link';
import { Activity, ArrowRight, BarChart3, Dna, FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* HERO SECTION */}
      <section className="py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Activity className="w-3.5 h-3.5" /> Clinical Decision Support System
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Cardiovascular risk<br />
          prediction, <span className="text-blue-800">refined.</span>
        </h1>
        <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed mb-8">
          An AI-powered clinical decision support tool combining lifestyle risk modeling with blood-based gene expression profiling — built for clinicians and researchers who need precision, speed, and clarity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/screening"
            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            Begin Assessment <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/clinical-reference"
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3 rounded-lg font-semibold text-sm transition shadow-sm flex items-center justify-center"
          >
            Explore Clinical Reference
          </Link>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-200">
          <div>
            <div className="text-3xl font-extrabold text-blue-800">17.9M</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Annual CVD deaths worldwide (WHO)</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-800">70,000+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Patients in clinical training cohort</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-800">85.1%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Multiclass accuracy on genomic test cohort</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-800">6 Classes</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Diagnostic conditions evaluated via RNA-Seq</div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-8">
        <div className="mb-8">
          <span className="text-xs font-semibold text-blue-800 uppercase tracking-widest block mb-1">
            System Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            A faster path to clinical clarity on heart risk
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-800 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Risk Stratification</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Composite 0–100 risk score weighted across demographics, vitals, labs, and lifestyle — with guideline-based staging breakdowns.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-800 mb-4">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Genomic Profiling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Classifies blood samples across 6 classes: CAD, Heart Failure, AFib, Hypertension, Ischemic Stroke, or Healthy using NCBI GEO transcriptomics.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-blue-800 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Evidence-Grounded</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Grounded in ACC/AHA guidelines and peer-reviewed cardiology research. Designed as a clinical decision-support adjunct.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

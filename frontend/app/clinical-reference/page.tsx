export default function ClinicalReferencePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-widest block mb-1">
          Clinical Reference
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Understanding cardiovascular disease.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
          A concise overview of the conditions evaluated by CardioAI — Coronary Artery Disease, Heart Failure, Stroke, Hypertension, and Atrial Fibrillation — grounded in primary literature.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Coronary Artery Disease (CAD)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Coronary Artery Disease is caused by the buildup of atherosclerotic plaque inside the coronary arteries. Over time, plaques narrow the artery walls, reducing oxygen delivery and potentially leading to angina, myocardial infarction, or sudden cardiac death [2]. Blood-based gene expression profiling identifies inflammatory and immune-cell transcriptional signatures that distinguish CAD patients from healthy controls [4][5].
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Heart Failure (HF)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Heart Failure is a chronic, progressive condition affecting over 64 million people globally [6]. It results from structural or functional cardiac abnormalities. The GSE59867 dataset used in CardioAI tracks post-STEMI patients across four timepoints to identify transcriptomic signatures predicting progression to HF versus recovery [8].
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Cerebrovascular &amp; Arrhythmic Subtypes</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            CardioAI additionally incorporates peripheral blood transcriptomic panels for <strong>Ischemic Stroke</strong> (GSE58294), <strong>Atrial Fibrillation</strong> (GSE79768), and <strong>Essential Hypertension</strong> (GSE7531), capturing acute ischemic cascades and atrial remodeling signatures.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="font-bold text-slate-900 text-sm mb-3">Works Cited</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>[1] World Health Organization. (2021). <i>Cardiovascular diseases (CVDs)</i>.</p>
            <p>[2] Libby, P., et al. (2019). Atherosclerosis. <i>Nature Reviews Disease Primers</i>, 5(1), 56.</p>
            <p>[3] Arnett, D. K., et al. (2019). 2019 ACC/AHA Guideline on Primary Prevention of CVD. <i>Circulation</i>, 140(11), e596–e646.</p>
            <p>[4] Elashoff, M. R., et al. (2011). Blood-based gene expression algorithm for CAD. <i>BMC Medical Genomics</i>, 4, 26.</p>
            <p>[5] Sinnaeve, P. R., et al. (2009). Peripheral blood gene expression and CAD extent. <i>PLoS ONE</i>, 4(9), e7037.</p>
            <p>[6] Groenewegen, A., et al. (2020). Epidemiology of heart failure. <i>European Journal of Heart Failure</i>, 22(8), 1342–1356.</p>
            <p>[7] McDonagh, T. A., et al. (2021). 2021 ESC Guidelines for heart failure. <i>European Heart Journal</i>, 42(36), 3599–3726.</p>
            <p>[8] Maciejak, A., et al. (2015). Gene expression profiling in HF progression. <i>Genome Medicine</i>, 7, 26.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-navy-900 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold tracking-wider text-slate-100 mb-2">CARDIOAI</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              An advanced machine learning system for cardiovascular risk prediction based on patient data.
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-2 max-w-md">
              <strong>DISCLAIMER:</strong> CardioAI is an educational/research machine-learning prototype. Its predictions are based on the dataset and trained model and are not a medical diagnosis. Users should consult qualified healthcare professionals for medical decisions.
            </p>
            <p className="text-sm text-slate-400">© 2026 CardioAI Project</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

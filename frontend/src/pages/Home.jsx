import Hero from '../components/Hero';
import WorkflowTimeline from '../components/WorkflowTimeline';
import CorrelationHeatmap from '../components/CorrelationHeatmap';
import ModelMetrics from '../components/ModelMetrics';
import FeatureImportance from '../components/FeatureImportance';
import Background3D from '../components/Background3D';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Background3D />
      <Hero />
      <WorkflowTimeline />
      <CorrelationHeatmap />
      
      {/* Model Performance Section Groups Metrics and Feature Importance */}
      <section className="py-12 bg-slate-50 dark:bg-navy-900 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <ModelMetrics />
        <FeatureImportance />
      </section>

      {/* Multi-Disease Extension Section */}
      <section id="about" className="py-24 bg-slate-100/50 dark:bg-navy-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Advanced <span className="text-gradient">Research Scope</span>
          </motion.h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 text-lg transition-colors duration-300">
            CardioAI is currently trained specifically on predicting general heart disease risk based on a targeted dataset.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Cardiovascular Disease', 'Coronary Artery Disease', 'Stroke', 'Heart Failure'].map((disease, i) => (
              <motion.div 
                key={disease}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 dark:bg-navy-800/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-xl p-6 rounded-2xl border-dashed opacity-70 hover:opacity-100 transition-all duration-300"
              >
                <div className="text-xs text-cyan-500 font-bold mb-2 uppercase tracking-wider">Planned Extension</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{disease}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Requires appropriately labeled training data for this specific condition.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Project */}
      <section className="py-24 bg-slate-50 dark:bg-navy-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Technology Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'FastAPI', 'React', 'Tailwind', 'Framer Motion', 'Three.js'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

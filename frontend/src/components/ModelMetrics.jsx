import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMetrics } from '../services/api';
import { Activity, Target, Crosshair, BarChart, Percent } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl flex items-center gap-6 group hover:border-cyan-500/50 transition-colors"
  >
    <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all">
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{(value * 100).toFixed(1)}%</h3>
    </div>
  </motion.div>
);

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMetrics()
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading model metrics...</div>;
  if (!metrics) return null;

  return (
    <section id="model" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How The <span className="text-gradient">Model Performs</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            These are the actual mathematical evaluation metrics from our trained Logistic Regression model against the test dataset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard title="ROC-AUC Score" value={metrics.roc_auc} icon={Activity} delay={0.1} />
          <MetricCard title="Accuracy" value={metrics.accuracy} icon={Target} delay={0.2} />
          <MetricCard title="Precision" value={metrics.precision} icon={Crosshair} delay={0.3} />
          <MetricCard title="Recall" value={metrics.recall} icon={BarChart} delay={0.4} />
          <MetricCard title="F1 Score" value={metrics.f1_score} icon={Percent} delay={0.5} />
        </div>
      </div>
    </section>
  );
};

export default ModelMetrics;

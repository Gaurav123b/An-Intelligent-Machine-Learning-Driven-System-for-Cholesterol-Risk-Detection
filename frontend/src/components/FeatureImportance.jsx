import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeatureImportance } from '../services/api';

const FeatureImportance = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatureImportance()
      .then(data => {
        setFeatures(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!features.length) return null;

  // Normalize importance values for the bar widths
  const maxImportance = Math.max(...features.map(f => f.importance));

  return (
    <section className="py-16 relative bg-navy-800/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Feature <span className="text-gradient">Importance</span></h3>
          <p className="text-slate-400">The top 10 most influential features driving the model's predictions.</p>
        </div>

        <div className="space-y-6">
          {features.map((feat, index) => {
            const widthPercent = (feat.importance / maxImportance) * 100;
            const displayName = feat.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <motion.div 
                key={feat.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col gap-2"
              >
                <div className="flex justify-between text-sm font-medium text-slate-300">
                  <span>{displayName}</span>
                  <span className="text-cyan-400">{feat.importance.toFixed(3)}</span>
                </div>
                <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${widthPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.05), ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureImportance;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCorrelation } from '../services/api';

const CorrelationHeatmap = () => {
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCorrelation()
      .then(data => {
        setCorrelation(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !correlation) return null;

  // We have the correlation matrix (list of dicts). 
  // Let's extract the columns for the grid.
  const cols = Object.keys(correlation[0]).filter(k => k !== 'name');

  const getColor = (value) => {
    // value is between -1 and 1
    // negative = cool, positive = warm
    if (value > 0.8) return 'bg-cyan-500';
    if (value > 0.4) return 'bg-cyan-600';
    if (value > 0) return 'bg-cyan-800';
    if (value > -0.4) return 'bg-navy-700';
    if (value > -0.8) return 'bg-navy-600';
    return 'bg-navy-500';
  };

  return (
    <section id="correlation" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Discover the <span className="text-gradient">Relationships</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Correlation describes statistical association between the top 10 features and the target outcome. It does not establish causation.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 rounded-3xl overflow-x-auto"
        >
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="flex mb-2">
              <div className="w-48 shrink-0"></div>
              {cols.map(col => (
                <div key={col} className="w-24 shrink-0 text-xs font-medium text-slate-400 text-center transform -rotate-45 origin-bottom-left ml-4 mb-2 truncate">
                  {col.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
            
            {/* Matrix Rows */}
            {correlation.map((row, i) => (
              <div key={row.name} className="flex items-center mb-1">
                <div className="w-48 shrink-0 text-xs font-medium text-slate-300 truncate pr-4 text-right">
                  {row.name.replace(/_/g, ' ')}
                </div>
                {cols.map((col, j) => {
                  const val = row[col];
                  return (
                    <motion.div
                      key={col}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.05) + (j * 0.05) }}
                      className={`w-24 h-12 shrink-0 m-[1px] flex items-center justify-center text-xs font-medium ${getColor(val)} hover:opacity-80 transition-opacity cursor-pointer group relative`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {val.toFixed(2)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CorrelationHeatmap;

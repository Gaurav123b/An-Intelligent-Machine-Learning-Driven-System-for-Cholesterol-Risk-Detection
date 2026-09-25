import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'DATA', desc: 'Ingesting patient vitals and lipid profiles.' },
  { num: '02', title: 'CLEANING', desc: 'Handling missing values and encoding categories.' },
  { num: '03', title: 'CORRELATION', desc: 'Analyzing feature relationships.' },
  { num: '04', title: 'TRAINING', desc: 'Training the Logistic Regression model.' },
  { num: '05', title: 'EVALUATION', desc: 'Measuring ROC-AUC against test data.' },
  { num: '06', title: 'PREDICTION', desc: 'Serving real-time inferences.' },
];

const WorkflowTimeline = () => {
  return (
    <section className="py-24 relative bg-slate-50 dark:bg-navy-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How It <span className="text-gradient">Works</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-200 dark:bg-navy-800 rounded-full" />
          
          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.num} className={`flex items-center w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`w-5/12 bg-white/60 dark:bg-navy-800/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-xl p-6 rounded-2xl relative group hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-colors ${isEven ? 'text-right' : 'text-left'}`}
                  >
                    {/* Connecting Dot */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] ${isEven ? '-right-[calc(10%_+_3.5rem)]' : '-left-[calc(10%_+_3.5rem)] md:-left-[calc(8.33%_+_1.5rem)] lg:-left-[calc(10%_+_1rem)]'}`} style={{
                      [isEven ? 'right' : 'left']: 'calc(-10% - 1.25rem)' // Adjust dynamically based on layout, simplified here via absolute classes
                    }} />
                    
                    <h4 className="text-cyan-500 font-bold text-xl mb-1">{step.num}</h4>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;

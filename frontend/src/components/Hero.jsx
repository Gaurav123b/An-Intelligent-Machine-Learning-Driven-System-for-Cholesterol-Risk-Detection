import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// AnimatedSphere moved to Background3D.jsx

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background is now handled globally by Background3D */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Understand your <br/>
              <span className="text-gradient">cardiovascular risk</span> <br/>
              through data.
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed"
          >
            An explainable machine-learning system analyzing comprehensive patient data including lipid profiles, vitals, and lifestyle metrics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link to="/predict" className="bg-cyan-500 hover:bg-cyan-400 text-white dark:text-navy-900 px-8 py-4 rounded-full font-bold text-center transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transform hover:-translate-y-1">
              Analyze My Profile
            </Link>
            <a href="#model" className="bg-white/10 dark:bg-navy-800/60 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/30 dark:hover:bg-white/10 px-8 py-4 rounded-full font-bold text-center transition-all transform hover:-translate-y-1 border border-black/10 dark:border-white/20">
              Explore Model
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

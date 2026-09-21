import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to access your patient dashboard</p>
        </div>

        <form className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Email Address</label>
            <input type="email" placeholder="dr.smith@hospital.com" className="glass-input" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Password</label>
            <input type="password" placeholder="••••••••" className="glass-input" />
          </div>

          <button type="button" className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] mt-4">
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Don't have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Contact IT Support</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

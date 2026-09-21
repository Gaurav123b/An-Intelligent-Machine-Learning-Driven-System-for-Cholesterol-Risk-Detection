import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error: resetError } = await resetPassword(email, redirectUrl);
      if (resetError) throw resetError;
      
      setSuccessMsg('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative"
      >
        <Link to="/login" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="text-center mb-8 mt-4">
          <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-slate-400">
            Enter your email to receive a recovery link
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleReset}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="dr.smith@hospital.com" 
                className="glass-input pl-12 w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loadingLocal || !!successMsg}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 py-3.5 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingLocal && <Loader2 className="animate-spin w-5 h-5" />}
            {loadingLocal ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

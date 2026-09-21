import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);
    setError(null);
    setSuccessMsg(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoadingLocal(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoadingLocal(false);
      return;
    }

    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) throw updateError;
      
      setSuccessMsg('Password updated successfully!');
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
        className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Set New Password</h2>
          <p className="text-slate-400">
            Create a new password for your account
          </p>
        </div>

        {!successMsg ? (
          <form className="space-y-6" onSubmit={handleUpdate}>
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
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="glass-input pl-12 w-full" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="glass-input pl-12 w-full" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loadingLocal}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 py-3.5 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] mt-4 flex items-center justify-center gap-2"
            >
              {loadingLocal && <Loader2 className="animate-spin w-5 h-5" />}
              {loadingLocal ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm"
            >
              {successMsg}
            </motion.div>
            <button 
              onClick={() => navigate('/predict')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-900 py-3.5 rounded-xl font-bold transition-all"
            >
              Continue to CardioAI
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;

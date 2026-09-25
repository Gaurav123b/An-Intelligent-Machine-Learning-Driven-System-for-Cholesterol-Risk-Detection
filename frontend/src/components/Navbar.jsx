import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut, User, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Nav links shown to all or specific users based on logic
  const authLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Analysis', path: '/#analysis' }
  ];

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Model & Data', path: '/#model' },
    { name: 'About', path: '/#about' }
  ];

  const linksToShow = session ? authLinks : publicLinks;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="w-8 h-8 text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" />
          <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-slate-100">CARDIOAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {linksToShow.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300'}`}
            >
              {link.name}
            </Link>
          ))}
          
          {session ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User className="w-4 h-4 text-cyan-400" />
                <span>{session.user?.email}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-slate-300 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign Up
              </Link>
            </div>
          )}

          {!session && (
            <Link to="/predict" className="bg-cyan-500 hover:bg-cyan-400 text-white dark:text-navy-900 px-6 py-2.5 rounded-full font-semibold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5">
              Analyze Now
            </Link>
          )}

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="text-slate-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-navy-800 border-b border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 shadow-xl"
        >
          {linksToShow.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-black/10 dark:border-white/10" />
          
          {session ? (
            <div className="flex flex-col gap-4">
              <div className="text-sm text-cyan-400 break-words">{session.user?.email}</div>
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-slate-300 hover:text-red-400 text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-cyan-400">
                Sign Up
              </Link>
              <Link to="/predict" onClick={() => setMobileMenuOpen(false)} className="bg-cyan-500 text-center text-navy-900 px-6 py-3 rounded-full font-semibold mt-2">
                Analyze Now
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

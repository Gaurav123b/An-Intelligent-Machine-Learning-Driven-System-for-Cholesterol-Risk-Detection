import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Model & Data', path: '/#model' },
    { name: 'About', path: '/#about' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-xl font-bold tracking-wider text-slate-100">CARDIOAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/predict" className="bg-cyan-500 hover:bg-cyan-400 text-navy-900 px-6 py-2.5 rounded-full font-semibold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5">
            Analyze Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-navy-800 border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10" />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">
            Login
          </Link>
          <Link to="/predict" onClick={() => setMobileMenuOpen(false)} className="bg-cyan-500 text-center text-navy-900 px-6 py-3 rounded-full font-semibold mt-2">
            Analyze Now
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

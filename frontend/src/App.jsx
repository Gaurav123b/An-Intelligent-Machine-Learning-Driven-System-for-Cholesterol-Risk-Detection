import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { session } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/predict" 
            element={
              <ProtectedRoute>
                <Predict />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={session ? <Navigate to="/predict" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={session ? <Navigate to="/predict" replace /> : <Signup />} 
          />
          <Route 
            path="/forgot-password" 
            element={session ? <Navigate to="/predict" replace /> : <ForgotPassword />} 
          />
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // NEW: Imported your ThemeProvider

// Lazy load pages to drastically reduce the initial JavaScript bundle size
const Home = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const ReportCase = lazy(() => import('./pages/ReportCase.jsx'));
const MapView = lazy(() => import('./pages/MapView.jsx'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard.jsx'));
const NGODashboard = lazy(() => import('./pages/NGODashboard.jsx'));

export default function App() {
  return (
    // NEW: Wrapped the entire app in the ThemeProvider so Navbar can read it!
    <ThemeProvider>
      <AuthProvider>
        <Router>
          
          <Navbar />
          
          <Suspense fallback={
            <div className="flex h-[75vh] items-center justify-center bg-[#e2e8f0] dark:bg-[#0f172a] transition-colors duration-300">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/report" element={<ReportCase />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/ngo" element={<NGODashboard />} />
            </Routes>
          </Suspense>
          
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
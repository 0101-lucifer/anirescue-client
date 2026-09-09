import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx'; 

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🍃', color: 'bg-emerald-500' },
    { name: 'Report', path: '/report', icon: '🚨', color: 'bg-rose-500' },
    { name: 'Map', path: '/map', icon: '🗺️', color: 'bg-blue-500' },
  ];

  if (user) {
    if (user.role === 'admin') {
      navLinks.push({ name: 'Admin', path: '/ngo', icon: '🏢', color: 'bg-purple-500' });
    } else {
      navLinks.push({ name: 'Hub', path: '/volunteer', icon: '🦺', color: 'bg-amber-500' });
    }
  }

  const getThemeIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '💻';
  };

  return (
    <div className="flex justify-center mt-6 mb-8 px-4 relative z-50">
      <div className="flex items-center gap-4">
        
        <nav className="flex items-center gap-2 p-2 rounded-full bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[6px_6px_12px_#cbd5e1,_-6px_-6px_12px_#f8fafc] dark:shadow-[6px_6px_12px_#070a13,_-6px_-6px_12px_#172441] transition-colors duration-300">
          
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              // Added select-none to prevent text highlighting on rapid clicks
              <Link key={link.name} to={link.path} className="relative group block select-none">
                
                {/* THE GLOW */}
                {isActive && (
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-3 ${link.color} blur-md rounded-full opacity-80 dark:opacity-100 transition-all duration-300`}></div>
                )}
                
                {/* THE BUTTON - Now with hover float and active soft bounce */}
                <div className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 ${
                  isActive 
                    ? 'bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.4)]' 
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}>
                  <span>{link.icon}</span>
                  <span className="hidden md:inline">{link.name}</span>
                </div>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>

          {user ? (
            <button onClick={handleLogout} className="relative group block select-none focus:outline-none">
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-3 bg-rose-500 blur-md rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
               {/* Logout button pop and bounce */}
               <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-rose-500 transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0.5">
                <span>🚪</span>
                <span className="hidden md:inline">Logout</span>
              </div>
            </button>
          ) : (
            <Link to="/login" className="relative group block select-none">
              {location.pathname === '/login' && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-3 bg-indigo-500 blur-md rounded-full opacity-80 dark:opacity-100 transition-all duration-300"></div>
              )}
               {/* Login button pop and bounce */}
              <div className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 ${
                location.pathname === '/login'
                  ? 'bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_15px_rgba(0,0,0,0.4)]'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}>
                <span>👤</span>
                <span className="hidden md:inline">Login</span>
              </div>
            </Link>
          )}

        </nav>

        <button
          onClick={cycleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-full text-xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[6px_6px_12px_#cbd5e1,_-6px_-6px_12px_#f8fafc] dark:shadow-[6px_6px_12px_#070a13,_-6px_-6px_12px_#172441] transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:active:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] select-none"
          aria-label="Toggle Theme"
        >
          {getThemeIcon()}
        </button>

      </div>
    </div>
  );
}
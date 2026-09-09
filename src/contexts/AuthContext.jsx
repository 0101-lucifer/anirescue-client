import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // The Auto-Login Engine: Runs once every time the app opens or refreshes
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('anirescue_token');
      
      if (token) {
        try {
          // Verify the token silently with the backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            // Token is valid! Log them in automatically.
            setUser({
              id: data.user.id,
              email: data.user.email,
              name: data.user.full_name,
              role: data.user.role
            });
          } else {
            // Token expired or invalid. Wipe it.
            localStorage.removeItem('anirescue_token');
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
        }
      }
      
      // Stop the loading spinner and show the app
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('anirescue_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitializing }}>
      {/* Wait until we've checked the token before rendering the main app pages */}
      {!isInitializing ? children : (
        <div className="flex h-screen items-center justify-center bg-[#e2e8f0] dark:bg-[#0f172a]">
          <div className="font-bold text-gray-500 animate-pulse">Authenticating Secure Session...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
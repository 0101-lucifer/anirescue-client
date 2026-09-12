import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const Login = () => {
  // Use the custom hook exported from your context
  const { login } = useAuth(); 
  
  // Toggles between Login (false) and Register (true) modes
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Smart Routing: Pick the exact endpoint based on the form mode
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    // Smart Payload: Only send the 'name' field if they are creating an account
    const payload = isRegistering 
      ? { name, email, password } 
      : { email, password };

    try {
      const response = await fetch(`https://anirescue-api.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error. Please try again.');
      }

      // CRITICAL FIX: Save the token using the exact name your AuthContext expects
      localStorage.setItem('anirescue_token', data.token);
      
      // Update global state so the app knows who is logged in
      if (login) {
         login(data.user); 
      }
      
      // Navigate to your protected map/dashboard route
      navigate('/map'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120]">
      <div className="bg-[#111827] p-8 rounded-xl shadow-2xl w-full max-w-md text-white border border-gray-800">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-3xl">🐾</span>
          </div>
          <h2 className="text-2xl font-bold">
            {isRegistering ? 'Create Account' : 'System Access'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isRegistering ? 'Join our volunteer response network' : 'Sign in to manage rescue operations'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0b1120] border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="Full Name"
                required={isRegistering}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b1120] border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b1120] border border-gray-700 rounded p-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black border border-gray-700 hover:border-cyan-400 text-white font-bold py-3 px-4 rounded transition-all mt-4"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(''); // Clear any errors when switching modes
            }}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {isRegistering ? 'Sign In' : 'Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
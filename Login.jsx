import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { MilitaryButton, TacticalCard } from './military-theme';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials against hardcoded values
    if (username === 'bravo' && password === 'bravo@$345') {
      // Call the onLogin function passed from parent
      onLogin();
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div 
        className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('/src/assets/military-background.png')`
        }}
      >
        <TacticalCard className="w-full max-w-md" status="active">
          <div className="flex flex-col items-center mb-6">
            <Shield className="w-16 h-16 text-green-400 mb-2" />
            <h1 className="text-green-400 font-bold text-2xl">BRAVO MIND</h1>
            <p className="text-slate-400">AI Battle Buddy</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-400 text-sm font-bold mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border-2 border-green-400 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-green-400 text-sm font-bold mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border-2 border-green-400 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded">
                {error}
              </div>
            )}
            
            <MilitaryButton 
              type="submit" 
              variant="primary" 
              size="lg"
              className="w-full mt-6"
            >
              SECURE LOGIN
            </MilitaryButton>
          </form>
          
          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Authorized Personnel Only</p>
            <p className="text-xs mt-1">SECURITY LEVEL: CONFIDENTIAL</p>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};

export default Login;
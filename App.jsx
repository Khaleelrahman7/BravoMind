import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Shield, MessageCircle, Target, Users, Settings, Bell, Activity, Brain } from 'lucide-react';
import { MilitaryButton, TacticalCard, StatusIndicator, MilitaryBadge } from './military-theme';
import { mockUser, mockMissions, mockBiometricData, getRandomAIResponse, formatMilitaryTime } from './utils';
import AIChat from './AIChat';
import MissionCenter from './Missions';
import BiometricDashboard from './BiometricDashboard';
import RallyPoint from './RallyPoint';
import Login from './Login';
import Games from './Games';
import './App.css';

// Header Component
const Header = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b-2 border-green-400 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/src/assets/bravo-mind-logo.png" 
            alt="Bravo Mind" 
            className="w-10 h-10"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-green-400 font-bold text-xl">BRAVO MIND</h1>
            <p className="text-slate-400 text-sm">AI Battle Buddy</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-green-400 font-mono text-lg">
              {formatMilitaryTime(currentTime)}
            </div>
            <div className="text-slate-400 text-sm">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
          
          <MilitaryBadge 
            rank={user.rank}
            branch={user.serviceBranch}
          />
          
          <StatusIndicator status="online" label="ONLINE" />
          
          <Bell className="text-green-400 w-6 h-6 cursor-pointer hover:text-green-300" />
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Shield },
    { id: 'missions', label: 'Mission Center', icon: Target },
    { id: 'chat', label: 'AI Companion', icon: MessageCircle },
    { id: 'rally', label: 'Rally Point', icon: Users },
    { id: 'games', label: 'Mental Games', icon: Brain },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <nav className="bg-slate-800 border-r-2 border-green-400 w-64 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              activeTab === id 
                ? 'bg-green-400 text-slate-900 font-bold' 
                : 'text-green-400 hover:bg-slate-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="uppercase tracking-wide text-sm">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Dashboard Component
const Dashboard = ({ user, missions, setActiveTab }) => {
  const [aiMessage, setAiMessage] = useState("");
  const activeMissions = missions.filter(m => m.status === 'active');
  const completedToday = missions.filter(m => m.status === 'completed').length;
  const totalPoints = missions.reduce((sum, m) => sum + (m.status === 'completed' ? m.points : 0), 0);
  
  useEffect(() => {
    // Simulate proactive AI check-in
    const timer = setTimeout(() => {
      setAiMessage(getRandomAIResponse());
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TacticalCard title="Mission Status" status="active" className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-2xl text-white">
              Welcome back, {user.rank} {user.name}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">{activeMissions.length}</div>
                <div className="text-slate-400 text-sm">Active Missions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">{completedToday}</div>
                <div className="text-slate-400 text-sm">Completed Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
                <div className="text-slate-400 text-sm">Total Points</div>
              </div>
            </div>
          </div>
        </TacticalCard>
        
        <TacticalCard title="System Status" status="active">
          <div className="space-y-3">
            <StatusIndicator status="online" label="AI Companion" />
            <StatusIndicator status="online" label="Monitoring" />
            <StatusIndicator status="online" label="Rally Point" />
            <StatusIndicator status="warning" label="Sleep Tracking" />
          </div>
        </TacticalCard>
      </div>

      {/* AI Companion Message */}
      {aiMessage && (
        <TacticalCard title="AI Battle Buddy Check-in" status="active">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-slate-900" />
            </div>
            <div className="flex-1">
              <p className="text-white">{aiMessage}</p>
              <div className="flex gap-2 mt-3">
                <MilitaryButton size="sm" variant="secondary">
                  Roger That
                </MilitaryButton>
                <MilitaryButton size="sm" variant="primary">
                  Let's Talk
                </MilitaryButton>
              </div>
            </div>
          </div>
        </TacticalCard>
      )}

      {/* Active Missions */}
      <TacticalCard title="Active Missions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMissions.map(mission => (
            <div key={mission.id} className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-green-400 font-bold">{mission.title}</h3>
                <span className="text-yellow-400 text-sm">{mission.progress}%</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{mission.description}</p>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <MilitaryButton size="sm" variant="primary" className="w-full">
                Continue Mission
              </MilitaryButton>
            </div>
          ))}
        </div>
      </TacticalCard>

      {/* Quick Actions */}
      <TacticalCard title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/" onClick={() => setActiveTab('missions')} className="w-full">
            <MilitaryButton variant="secondary" className="flex flex-col items-center gap-2 h-20 w-full">
              <Target className="w-6 h-6" />
              <span>New Mission</span>
            </MilitaryButton>
          </Link>
          <Link to="/" onClick={() => setActiveTab('chat')} className="w-full">
            <MilitaryButton variant="secondary" className="flex flex-col items-center gap-2 h-20 w-full">
              <MessageCircle className="w-6 h-6" />
              <span>Chat AI</span>
            </MilitaryButton>
          </Link>
          <Link to="/" onClick={() => setActiveTab('rally')} className="w-full">
            <MilitaryButton variant="secondary" className="flex flex-col items-center gap-2 h-20 w-full">
              <Users className="w-6 h-6" />
              <span>Find Buddy</span>
            </MilitaryButton>
          </Link>
          <Link to="/" onClick={() => setActiveTab('games')} className="w-full">
            <MilitaryButton variant="secondary" className="flex flex-col items-center gap-2 h-20 w-full">
              <Brain className="w-6 h-6" />
              <span>Mental Games</span>
              <div className="absolute top-0 right-0 bg-green-400 text-slate-900 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">NEW</div>
            </MilitaryButton>
          </Link>
        </div>
      </TacticalCard>

      {/* Biometric Dashboard */}
      <TacticalCard title="Health Monitoring" status="active">
        <BiometricDashboard />
      </TacticalCard>

      {/* Daily Challenges */}
      <TacticalCard title="Daily Stability Challenges" status="active">
        <div className="space-y-4">
          <p className="text-slate-300">Complete these challenges to improve mental resilience and stability.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-green-400 font-bold">Mindfulness Exercise</h3>
                <span className="bg-yellow-400 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">+15 pts</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">Complete a 5-minute guided breathing exercise to reduce stress.</p>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all duration-200">
                Start Exercise
              </button>
            </div>
            
            <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-green-400 font-bold">Gratitude Journal</h3>
                <span className="bg-yellow-400 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">+10 pts</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">Record three things you're grateful for today to improve outlook.</p>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all duration-200">
                Open Journal
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-2">
            <Link to="/" onClick={() => setActiveTab('games')} className="w-full max-w-md">
              <MilitaryButton variant="primary" className="w-full">
                <span>View More Challenges</span>
                <Brain className="w-4 h-4 ml-2" />
              </MilitaryButton>
            </Link>
          </div>
        </div>
      </TacticalCard>
    </div>
  );
};

// Placeholder components for other tabs
const AICompanion = () => (
  <div className="p-6">
    <TacticalCard title="AI Companion Chat" status="active">
      <AIChat />
    </TacticalCard>
  </div>
);

const RallyPointPage = () => <RallyPoint />;

const GamesPage = () => <Games />;

const Profile = () => (
  <div className="p-6">
    <TacticalCard title="Profile & Settings" status="active">
      <p className="text-white">Profile settings coming soon...</p>
    </TacticalCard>
  </div>
);

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user] = useState(mockUser);
  const [missions] = useState(mockMissions);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} missions={missions} setActiveTab={setActiveTab} />;      case 'missions':
        return <MissionCenter />;      case 'chat':
        return <AICompanion />;      case 'rally':
        return <RallyPointPage />;      case 'games':
        return <GamesPage />;      case 'profile':
        return <Profile />;      default:
        return <Dashboard user={user} missions={missions} />;    }  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
          <Route path="/*" element={
            isAuthenticated ? (
              <div 
                className="min-h-screen bg-cover bg-center bg-fixed"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('/src/assets/military-background.png')`
                }}
              >
                <Header user={user} />
                <div className="flex">
                  <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                  <main className="flex-1">
                    {renderContent()}
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


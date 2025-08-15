import React, { useState, useEffect } from 'react';
import { Target, Heart, MessageCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { MilitaryButton, TacticalCard, TacticalProgress } from './military-theme';

// Gratitude Targets Mission
const GratitudeTargets = ({ onComplete }) => {
  const [targets, setTargets] = useState(['', '', '']);
  const [completed, setCompleted] = useState(false);

  const handleTargetChange = (index, value) => {
    const newTargets = [...targets];
    newTargets[index] = value;
    setTargets(newTargets);
  };

  const handleSubmit = () => {
    const filledTargets = targets.filter(target => target.trim().length > 0);
    if (filledTargets.length === 3) {
      setCompleted(true);
      onComplete && onComplete({
        type: 'gratitude',
        data: targets,
        points: 10
      });
    }
  };

  const progress = (targets.filter(t => t.trim().length > 0).length / 3) * 100;

  return (
    <TacticalCard title="Mission: 3 Gratitude Targets" status={completed ? "completed" : "active"}>
      <div className="space-y-4">
        <p className="text-slate-300">
          Identify three things you're grateful for today. This helps build mental resilience and positive thinking patterns.
        </p>
        
        <TacticalProgress value={progress} max={100} label="Mission Progress" />
        
        <div className="space-y-3">
          {targets.map((target, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-slate-900 font-bold">
                {index + 1}
              </div>
              <input
                type="text"
                value={target}
                onChange={(e) => handleTargetChange(index, e.target.value)}
                placeholder={`Gratitude target ${index + 1}...`}
                className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                disabled={completed}
              />
              {target.trim() && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
          ))}
        </div>
        
        {!completed ? (
          <MilitaryButton 
            onClick={handleSubmit}
            disabled={progress < 100}
            className="w-full"
          >
            Complete Mission (+10 Points)
          </MilitaryButton>
        ) : (
          <div className="text-center p-4 bg-green-400/20 rounded-lg border border-green-400">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold">Mission Accomplished!</p>
            <p className="text-slate-300 text-sm">+10 points earned</p>
          </div>
        )}
      </div>
    </TacticalCard>
  );
};

// Tactical Breathing Mission
const TacticalBreathing = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && !completed) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else if (phase === 'exhale') {
              setPhase('pause');
              return 2;
            } else {
              // Complete cycle
              const newCycle = cycle + 1;
              setCycle(newCycle);
              if (newCycle >= totalCycles) {
                setCompleted(true);
                setIsActive(false);
                onComplete && onComplete({
                  type: 'breathing',
                  data: { cycles: newCycle },
                  points: 15
                });
              } else {
                setPhase('inhale');
                return 4;
              }
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, cycle, completed, onComplete, totalCycles]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-400';
      case 'hold': return 'text-yellow-400';
      case 'exhale': return 'text-green-400';
      case 'pause': return 'text-slate-400';
      default: return 'text-white';
    }
  };

  const progress = (cycle / totalCycles) * 100;

  return (
    <TacticalCard title="Mission: Tactical Breathing Drill" status={completed ? "completed" : "active"}>
      <div className="space-y-6 text-center">
        <p className="text-slate-300">
          Complete 5 cycles of tactical breathing (4-4-4-2 pattern). This technique is used by military personnel to manage stress and maintain focus.
        </p>
        
        <TacticalProgress value={progress} max={100} label={`Cycle ${cycle}/${totalCycles}`} />
        
        <div className="relative">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
            isActive ? 'border-green-400 scale-110' : 'border-slate-600'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getPhaseColor()}`}>
                {count}
              </div>
              <div className={`text-sm ${getPhaseColor()}`}>
                {getPhaseInstruction()}
              </div>
            </div>
          </div>
        </div>
        
        {!completed ? (
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <MilitaryButton onClick={startBreathing} className="px-6">
                Start Breathing Exercise
              </MilitaryButton>
            ) : (
              <MilitaryButton onClick={stopBreathing} variant="danger" className="px-6">
                Stop Exercise
              </MilitaryButton>
            )}
          </div>
        ) : (
          <div className="text-center p-4 bg-green-400/20 rounded-lg border border-green-400">
            <Heart className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold">Mission Accomplished!</p>
            <p className="text-slate-300 text-sm">+15 points earned</p>
          </div>
        )}
      </div>
    </TacticalCard>
  );
};

// Comms Check Mission
const CommsCheck = ({ onComplete }) => {
  const [selectedContact, setSelectedContact] = useState('');
  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const contacts = [
    { id: 'buddy1', name: 'Battle Buddy Mike', lastContact: '2 weeks ago' },
    { id: 'buddy2', name: 'Sergeant Johnson', lastContact: '1 month ago' },
    { id: 'family1', name: 'Family Member', lastContact: '3 days ago' },
    { id: 'friend1', name: 'Civilian Friend', lastContact: '1 week ago' }
  ];

  const handleSubmit = () => {
    if (selectedContact && message.trim()) {
      setCompleted(true);
      onComplete && onComplete({
        type: 'comms',
        data: { contact: selectedContact, message },
        points: 25
      });
    }
  };

  return (
    <TacticalCard title="Mission: Comms Check" status={completed ? "completed" : "active"}>
      <div className="space-y-4">
        <p className="text-slate-300">
          Reach out to someone in your support network. Maintaining connections is crucial for mental health and resilience.
        </p>
        
        <div>
          <label className="block text-green-400 font-bold mb-2">Select Contact:</label>
          <div className="space-y-2">
            {contacts.map(contact => (
              <label key={contact.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                <input
                  type="radio"
                  name="contact"
                  value={contact.id}
                  checked={selectedContact === contact.id}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  className="text-green-400"
                  disabled={completed}
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{contact.name}</div>
                  <div className="text-slate-400 text-sm">Last contact: {contact.lastContact}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-green-400 font-bold mb-2">Message to send:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hey, just checking in. How are you doing?"
            className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 resize-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            rows="3"
            disabled={completed}
          />
        </div>
        
        {!completed ? (
          <MilitaryButton 
            onClick={handleSubmit}
            disabled={!selectedContact || !message.trim()}
            className="w-full"
          >
            Send Message (+25 Points)
          </MilitaryButton>
        ) : (
          <div className="text-center p-4 bg-green-400/20 rounded-lg border border-green-400">
            <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold">Mission Accomplished!</p>
            <p className="text-slate-300 text-sm">+25 points earned</p>
          </div>
        )}
      </div>
    </TacticalCard>
  );
};

// Main Mission Center Component
const MissionCenter = () => {
  const [activeMission, setActiveMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const availableMissions = [
    {
      id: 'gratitude',
      title: '3 Gratitude Targets',
      description: 'Identify three things you\'re grateful for today',
      difficulty: 'Easy',
      points: 10,
      icon: Star,
      component: GratitudeTargets
    },
    {
      id: 'breathing',
      title: 'Tactical Breathing Drill',
      description: 'Complete a 5-minute guided breathing exercise',
      difficulty: 'Easy',
      points: 15,
      icon: Heart,
      component: TacticalBreathing
    },
    {
      id: 'comms',
      title: 'Comms Check',
      description: 'Reach out to a battle buddy or support contact',
      difficulty: 'Medium',
      points: 25,
      icon: MessageCircle,
      component: CommsCheck
    }
  ];

  const handleMissionComplete = (missionData) => {
    setCompletedMissions(prev => [...prev, { ...missionData, completedAt: new Date() }]);
    setTotalPoints(prev => prev + missionData.points);
    setActiveMission(null);
  };

  const startMission = (mission) => {
    setActiveMission(mission);
  };

  if (activeMission) {
    const MissionComponent = activeMission.component;
    return (
      <div className="p-6">
        <div className="mb-4">
          <MilitaryButton 
            onClick={() => setActiveMission(null)}
            variant="secondary"
            size="sm"
          >
            ← Back to Mission Center
          </MilitaryButton>
        </div>
        <MissionComponent onComplete={handleMissionComplete} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Mission Stats */}
      <TacticalCard title="Mission Statistics" status="active">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-400">{completedMissions.length}</div>
            <div className="text-slate-400 text-sm">Missions Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{totalPoints}</div>
            <div className="text-slate-400 text-sm">Total Points</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">{availableMissions.length}</div>
            <div className="text-slate-400 text-sm">Available Missions</div>
          </div>
        </div>
      </TacticalCard>

      {/* Available Missions */}
      <TacticalCard title="Available Missions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableMissions.map(mission => {
            const Icon = mission.icon;
            const isCompleted = completedMissions.some(cm => cm.type === mission.id);
            
            return (
              <div key={mission.id} className={`border rounded-lg p-4 transition-all duration-200 ${
                isCompleted 
                  ? 'border-green-400 bg-green-400/10' 
                  : 'border-slate-600 bg-slate-800/50 hover:border-green-400'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-400 text-slate-900' : 'bg-slate-700 text-green-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-400 font-bold text-sm">{mission.title}</h3>
                    <p className="text-slate-300 text-xs">{mission.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    mission.difficulty === 'Easy' 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-yellow-400 text-sm font-bold">+{mission.points} pts</span>
                </div>
                
                <MilitaryButton
                  onClick={() => startMission(mission)}
                  disabled={isCompleted}
                  size="sm"
                  className="w-full"
                  variant={isCompleted ? "success" : "primary"}
                >
                  {isCompleted ? "Completed" : "Start Mission"}
                </MilitaryButton>
              </div>
            );
          })}
        </div>
      </TacticalCard>

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <TacticalCard title="Mission History" status="completed">
          <div className="space-y-3">
            {completedMissions.map((mission, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-green-400/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Mission: {mission.type}</div>
                    <div className="text-slate-400 text-sm">
                      Completed: {mission.completedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">+{mission.points} pts</div>
              </div>
            ))}
          </div>
        </TacticalCard>
      )}
    </div>
  );
};

export default MissionCenter;


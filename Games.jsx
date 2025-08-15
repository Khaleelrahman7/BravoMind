import React, { useState } from 'react';
import { Brain, Target, Clock, Award, RefreshCw } from 'lucide-react';
import { MilitaryButton, TacticalCard } from './military-theme';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  
  // Game definitions
  const games = [
    {
      id: 'memory',
      title: 'Memory Training',
      description: 'Test and improve your short-term memory with this sequence recall challenge.',
      icon: Brain,
      difficulty: 'Medium',
      benefits: ['Cognitive Function', 'Focus', 'Memory Retention']
    },
    {
      id: 'reaction',
      title: 'Reaction Time',
      description: 'Measure and improve your reaction time with this rapid response exercise.',
      icon: Clock,
      difficulty: 'Easy',
      benefits: ['Alertness', 'Motor Skills', 'Response Time']
    },
    {
      id: 'precision',
      title: 'Precision Targeting',
      description: 'Enhance your focus and accuracy with this precision targeting challenge.',
      icon: Target,
      difficulty: 'Hard',
      benefits: ['Concentration', 'Fine Motor Control', 'Patience']
    }
  ];
  
  // Simple memory game implementation
  const MemoryGame = () => {
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [gameState, setGameState] = useState('ready'); // ready, showing, input, success, failed
    const [level, setLevel] = useState(1);
    
    const startGame = () => {
      // Generate random sequence based on level
      const newSequence = Array(level + 2).fill(0).map(() => Math.floor(Math.random() * 4));
      setSequence(newSequence);
      setUserSequence([]);
      setGameState('showing');
      
      // Show sequence to user
      let i = 0;
      const intervalId = setInterval(() => {
        if (i >= newSequence.length) {
          clearInterval(intervalId);
          setGameState('input');
          return;
        }
        // This would highlight the button in a real implementation
        i++;
      }, 1000);
    };
    
    const handleButtonPress = (buttonIndex) => {
      if (gameState !== 'input') return;
      
      const newUserSequence = [...userSequence, buttonIndex];
      setUserSequence(newUserSequence);
      
      // Check if user made a mistake
      if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
        setGameState('failed');
        setScore(Math.max(0, score - 5)); // Penalty for failure
        return;
      }
      
      // Check if user completed the sequence
      if (newUserSequence.length === sequence.length) {
        setGameState('success');
        setScore(score + (level * 10)); // Award points based on level
        setLevel(level + 1); // Increase difficulty
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-green-400 font-bold text-xl">Memory Training</h3>
          <div className="text-yellow-400 font-mono">Level: {level}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => handleButtonPress(index)}
              disabled={gameState !== 'input'}
              className={`h-24 rounded-lg transition-all duration-200 ${[
                'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'
              ][index]} hover:opacity-80 disabled:opacity-50`}
            />
          ))}
        </div>
        
        <div className="text-center text-white">
          {gameState === 'ready' && 'Press Start to begin the memory challenge'}
          {gameState === 'showing' && 'Watch the sequence carefully...'}
          {gameState === 'input' && 'Now repeat the sequence!'}
          {gameState === 'success' && 'Great job! Ready for the next level?'}
          {gameState === 'failed' && 'Incorrect sequence. Try again!'}
        </div>
        
        <div className="flex justify-center gap-4">
          <MilitaryButton 
            onClick={startGame} 
            disabled={gameState === 'showing'}
            variant={gameState === 'ready' || gameState === 'success' || gameState === 'failed' ? 'primary' : 'secondary'}
          >
            {gameState === 'ready' ? 'Start Game' : 'Try Again'}
          </MilitaryButton>
          
          <MilitaryButton 
            onClick={() => setActiveGame(null)}
            variant="secondary"
          >
            Exit Game
          </MilitaryButton>
        </div>
      </div>
    );
  };
  
  // Placeholder for other games
  const GamePlaceholder = ({ game }) => (
    <div className="space-y-4">
      <h3 className="text-green-400 font-bold text-xl">{game.title}</h3>
      <p className="text-white">{game.description}</p>
      <div className="flex justify-center">
        <game.icon className="w-24 h-24 text-green-400 opacity-50" />
      </div>
      <p className="text-center text-yellow-400">Coming Soon</p>
      <div className="flex justify-center">
        <MilitaryButton 
          onClick={() => setActiveGame(null)}
          variant="secondary"
        >
          Back to Games
        </MilitaryButton>
      </div>
    </div>
  );
  
  // Render active game or game selection
  const renderContent = () => {
    if (activeGame === 'memory') {
      return <MemoryGame />;
    } else if (activeGame) {
      const game = games.find(g => g.id === activeGame);
      return <GamePlaceholder game={game} />;
    }
    
    // Game selection screen
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white font-bold">Mental Fitness Games</h2>
          <div className="flex items-center gap-2">
            <Award className="text-yellow-400 w-5 h-5" />
            <span className="text-yellow-400 font-mono text-lg">{score} pts</span>
          </div>
        </div>
        
        <p className="text-slate-300">
          These games are designed to improve cognitive function, focus, and mental resilience.
          Regular practice can help maintain peak mental performance under stress.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map(game => (
            <div 
              key={game.id}
              className="border border-slate-600 rounded-lg p-4 bg-slate-800/50 hover:border-green-400 transition-all duration-200 cursor-pointer"
              onClick={() => setActiveGame(game.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-green-400 font-bold">{game.title}</h3>
                <div className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">
                  {game.difficulty}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <game.icon className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-slate-300 text-sm">{game.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {game.benefits.map(benefit => (
                  <span 
                    key={benefit} 
                    className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <TacticalCard title="Mental Fitness Center" status="active">
        {renderContent()}
      </TacticalCard>
    </div>
  );
};

export default Games;
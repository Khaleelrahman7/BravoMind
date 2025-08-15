import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Shield, Star, Clock, Send, UserCheck, UserX } from 'lucide-react';
import { MilitaryButton, TacticalCard, StatusIndicator, MilitaryBadge } from './military-theme';
import { formatMilitaryTime } from './utils';

const RallyPoint = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [connections, setConnections] = useState([]);
  const [availablePeers, setAvailablePeers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Generate mock peer data
    const mockPeers = [
      {
        id: 'peer-001',
        callSign: 'Alpha-7',
        branch: 'army',
        rank: 'Staff Sergeant',
        deployments: ['Afghanistan 2019-2020', 'Iraq 2021'],
        interests: ['Fitness', 'Photography', 'Hiking'],
        lastActive: new Date(Date.now() - 300000), // 5 minutes ago
        status: 'online',
        compatibility: 92,
        sharedExperiences: ['Combat Deployment', 'Leadership Role']
      },
      {
        id: 'peer-002',
        callSign: 'Bravo-3',
        branch: 'marines',
        rank: 'Corporal',
        deployments: ['Syria 2020', 'Afghanistan 2018-2019'],
        interests: ['Music', 'Cooking', 'Gaming'],
        lastActive: new Date(Date.now() - 900000), // 15 minutes ago
        status: 'online',
        compatibility: 87,
        sharedExperiences: ['Combat Deployment', 'PTSD Recovery']
      },
      {
        id: 'peer-003',
        callSign: 'Charlie-9',
        branch: 'navy',
        rank: 'Petty Officer',
        deployments: ['Persian Gulf 2019-2021'],
        interests: ['Reading', 'Fishing', 'Meditation'],
        lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
        status: 'away',
        compatibility: 78,
        sharedExperiences: ['Deployment Stress', 'Family Separation']
      },
      {
        id: 'peer-004',
        callSign: 'Delta-5',
        branch: 'airforce',
        rank: 'Technical Sergeant',
        deployments: ['Qatar 2020-2021', 'Germany 2018-2020'],
        interests: ['Technology', 'Aviation', 'Fitness'],
        lastActive: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'offline',
        compatibility: 85,
        sharedExperiences: ['Technical Role', 'Overseas Assignment']
      }
    ];

    setAvailablePeers(mockPeers);

    // Mock existing connections
    setConnections([
      {
        id: 'peer-005',
        callSign: 'Echo-2',
        branch: 'army',
        rank: 'Sergeant',
        status: 'online',
        lastMessage: 'Thanks for the support yesterday!',
        lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
        unreadCount: 0
      }
    ]);

    // Mock chat messages
    setChatMessages({
      'peer-005': [
        {
          id: 1,
          sender: 'peer-005',
          content: 'Hey battle buddy, how are you holding up today?',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          id: 2,
          sender: 'me',
          content: 'Doing better, thanks for checking in. The breathing exercises really helped.',
          timestamp: new Date(Date.now() - 7000000)
        },
        {
          id: 3,
          sender: 'peer-005',
          content: 'That\'s great to hear! I\'ve been using those too. Want to try a group session sometime?',
          timestamp: new Date(Date.now() - 6800000)
        }
      ]
    });
  }, []);

  const handleConnect = (peerId) => {
    const peer = availablePeers.find(p => p.id === peerId);
    if (peer) {
      const newConnection = {
        id: peer.id,
        callSign: peer.callSign,
        branch: peer.branch,
        rank: peer.rank,
        status: peer.status,
        lastMessage: 'Connection established',
        lastMessageTime: new Date(),
        unreadCount: 0
      };
      setConnections(prev => [...prev, newConnection]);
      setAvailablePeers(prev => prev.filter(p => p.id !== peerId));
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      sender: 'me',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), message]
    }));

    setNewMessage('');

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Roger that, I understand what you're going through.",
        "Thanks for sharing that with me. You're not alone in this.",
        "I've been there too. It gets better with time and support.",
        "That's a tough situation. Have you tried talking to a counselor?",
        "I appreciate you opening up. Want to grab coffee sometime?",
        "Stay strong, battle buddy. We've got each other's backs."
      ];

      const response = {
        id: Date.now() + 1,
        sender: activeChat,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), response]
      }));
    }, 2000 + Math.random() * 3000);
  };

  const PeerCard = ({ peer, onConnect }) => (
    <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50 hover:border-green-400 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-slate-900 font-bold">
            {peer.callSign.split('-')[0][0]}
          </div>
          <div>
            <h3 className="text-green-400 font-bold">{peer.callSign}</h3>
            <MilitaryBadge rank={peer.rank} branch={peer.branch} className="text-xs" />
          </div>
        </div>
        <StatusIndicator status={peer.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-sm font-medium">Compatibility:</span>
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${peer.compatibility}%` }}
            />
          </div>
          <span className="text-green-400 text-sm font-bold">{peer.compatibility}%</span>
        </div>

        <div>
          <span className="text-slate-400 text-sm">Shared Experiences:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {peer.sharedExperiences.map((exp, index) => (
              <span key={index} className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded-full">
                {exp}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-sm">Interests:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {peer.interests.map((interest, index) => (
              <span key={index} className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <MilitaryButton 
        onClick={() => onConnect(peer.id)}
        className="w-full"
        size="sm"
      >
        <UserCheck className="w-4 h-4 mr-2" />
        Connect
      </MilitaryButton>
    </div>
  );

  const ConnectionCard = ({ connection, onClick }) => (
    <div 
      className="border border-slate-600 rounded-lg p-4 bg-slate-800/50 hover:border-green-400 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(connection.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-slate-900 font-bold">
            {connection.callSign.split('-')[0][0]}
          </div>
          <div>
            <h3 className="text-green-400 font-bold">{connection.callSign}</h3>
            <MilitaryBadge rank={connection.rank} branch={connection.branch} className="text-xs" />
          </div>
        </div>
        <div className="text-right">
          <StatusIndicator status={connection.status} />
          {connection.unreadCount > 0 && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
              {connection.unreadCount}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-slate-300 text-sm truncate mb-1">
        {connection.lastMessage}
      </div>
      <div className="text-slate-500 text-xs">
        {formatMilitaryTime(connection.lastMessageTime)}
      </div>
    </div>
  );

  const ChatInterface = ({ chatId, onClose }) => {
    const messages = chatMessages[chatId] || [];
    const connection = connections.find(c => c.id === chatId);

    return (
      <div className="flex flex-col h-[500px]">
        {/* Chat Header */}
        <div className="bg-slate-800 border-b-2 border-green-400 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-slate-900 font-bold">
                {connection?.callSign.split('-')[0][0]}
              </div>
              <div>
                <h3 className="text-green-400 font-bold">{connection?.callSign}</h3>
                <StatusIndicator status={connection?.status} label={connection?.status} />
              </div>
            </div>
            <MilitaryButton onClick={onClose} variant="secondary" size="sm">
              Close
            </MilitaryButton>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-green-100 border border-green-400/30'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatMilitaryTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-800 border-t-2 border-green-400 rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
            />
            <MilitaryButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </MilitaryButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <TacticalCard title="Rally Point - Peer Support Network" status="active">
        <div className="flex gap-4 mb-4">
          <MilitaryButton
            onClick={() => setActiveTab('discover')}
            variant={activeTab === 'discover' ? 'primary' : 'secondary'}
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Discover Peers
          </MilitaryButton>
          <MilitaryButton
            onClick={() => setActiveTab('connections')}
            variant={activeTab === 'connections' ? 'primary' : 'secondary'}
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            My Connections ({connections.length})
          </MilitaryButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{availablePeers.length}</div>
            <div className="text-slate-400 text-sm">Available Peers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{connections.length}</div>
            <div className="text-slate-400 text-sm">Active Connections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {availablePeers.filter(p => p.status === 'online').length}
            </div>
            <div className="text-slate-400 text-sm">Online Now</div>
          </div>
        </div>
      </TacticalCard>

      {/* Content */}
      {activeChat ? (
        <TacticalCard title="Secure Chat" status="active">
          <ChatInterface chatId={activeChat} onClose={() => setActiveChat(null)} />
        </TacticalCard>
      ) : (
        <>
          {activeTab === 'discover' && (
            <TacticalCard title="Discover Compatible Peers" status="active">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePeers.map(peer => (
                  <PeerCard key={peer.id} peer={peer} onConnect={handleConnect} />
                ))}
              </div>
            </TacticalCard>
          )}

          {activeTab === 'connections' && (
            <TacticalCard title="Your Connections" status="active">
              {connections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.map(connection => (
                    <ConnectionCard 
                      key={connection.id} 
                      connection={connection} 
                      onClick={setActiveChat}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No connections yet. Start by discovering compatible peers!</p>
                  <MilitaryButton 
                    onClick={() => setActiveTab('discover')}
                    className="mt-4"
                  >
                    Discover Peers
                  </MilitaryButton>
                </div>
              )}
            </TacticalCard>
          )}
        </>
      )}
    </div>
  );
};

export default RallyPoint;


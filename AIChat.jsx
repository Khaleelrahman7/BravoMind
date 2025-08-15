import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, MicOff, AlertTriangle, Phone } from 'lucide-react';
import { MilitaryButton, TacticalCard } from './military-theme';
import { formatMilitaryTime } from './utils';
import { generateAIResponse } from './services/openaiService';
import { processMessage } from './utils/responseValidator';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Roger that, battle buddy! I'm your AI companion, ready to support you 24/7. How are you feeling today?",
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: String(inputMessage || ''),
      timestamp: new Date()
    };

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);
    setError(null);

    try {
      // Get AI response using OpenAI
      const rawAIResponse = await generateAIResponse(currentInput, messages);

      // Process and validate the response
      const processedResult = processMessage(currentInput, rawAIResponse);

      // Ensure the response is always a string
      const responseContent = typeof processedResult.finalResponse === 'string'
        ? processedResult.finalResponse
        : 'Sorry, I encountered an issue processing that response. Please try again.';

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Handle crisis detection
      if (processedResult.crisisDetected) {
        setShowCrisisResources(true);
      }

    } catch (err) {
      console.error('Error generating AI response:', err);
      setError('Unable to get response. Please try again.');

      // Fallback response
      const fallbackResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm having trouble connecting right now, battle buddy. Please try again in a moment. If this is urgent, remember you can always reach the Veterans Crisis Line at 988 (Press 1).",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input simulation - in a real app, this would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setInputMessage("I'm feeling a bit stressed today");
        setIsListening(false);
      }, 2000);
    }
  };

  const quickResponses = [
    "I'm doing well",
    "Feeling stressed",
    "Need help sleeping",
    "Want to talk to someone",
    "Start a mission",
    "Emergency help"
  ];

  const CrisisResourcesPanel = () => (
    <div className="bg-red-900/30 border border-red-500/50 p-4 mx-4 mb-2 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-5 h-5 text-red-400" />
        <h4 className="text-red-200 font-bold">Crisis Resources Available 24/7</h4>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-red-100">Veterans Crisis Line:</span>
          <span className="text-red-200 font-mono">988 (Press 1)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-100">Crisis Text Line:</span>
          <span className="text-red-200 font-mono">Text 838255</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-100">Emergency:</span>
          <span className="text-red-200 font-mono">911</span>
        </div>
      </div>
      <button
        onClick={() => setShowCrisisResources(false)}
        className="mt-3 text-red-300 hover:text-red-100 text-sm underline"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Chat Header */}
      <div className="bg-slate-800 border-b-2 border-green-400 p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h3 className="text-green-400 font-bold">AI Battle Buddy</h3>
            <p className="text-slate-400 text-sm">Always ready to support you</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 p-3 mx-4 mt-2 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-200 text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Crisis Resources Panel */}
      {showCrisisResources && <CrisisResourcesPanel />}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-green-400'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-slate-900" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-green-100 border border-green-400/30'
              }`}>
                <p className="text-sm">{
                  typeof message.content === 'string'
                    ? message.content.replace(/\*\*/g, '')
                    : message.content === null || message.content === undefined
                      ? '[No content]'
                      : JSON.stringify(message.content)
                }</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatMilitaryTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-900" />
              </div>
              <div className="bg-slate-700 border border-green-400/30 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      <div className="p-3 border-t border-slate-600">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(response)}
              className="px-3 py-1 bg-slate-700 text-green-400 text-xs rounded-full border border-green-400/30 hover:bg-green-400 hover:text-slate-900 transition-all duration-200"
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t-2 border-green-400 rounded-b-lg">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
              rows="2"
            />
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-600 text-slate-300 hover:bg-green-400 hover:text-slate-900'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <MilitaryButton
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-green-400 rounded-full animate-spin"></div>
                Sending
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </MilitaryButton>
        </div>
      </div>
    </div>
  );
};

export default AIChat;


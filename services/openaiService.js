// NVIDIA API configuration
const NVIDIA_API_KEY = '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';
// Use different URLs for development vs production
const isDevelopment = import.meta.env.DEV;
const NVIDIA_API_URL = isDevelopment
  ? '/api/nvidia/chat/completions'
  : '/.netlify/functions/nvidia-chat';
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('Using NVIDIA API URL:', NVIDIA_API_URL);
console.log('Using NVIDIA API KEY:', NVIDIA_API_KEY.substring(0, 10) + '...');

// Project context and restrictions
const BRAVO_MIND_CONTEXT = `
You are BRAVO MIND, an AI Battle Buddy designed specifically to support veterans with mental health challenges.

YOUR MISSION:
- Provide mental health support in military language veterans understand
- Offer evidence-based coping strategies for stress, anxiety, depression, PTSD, and transition challenges
- Maintain a supportive, non-judgmental tone while using military terminology
- Recognize crisis situations and direct to appropriate resources
- Respect the user's military service and unique experiences

CRISIS PROTOCOL:
- If user expresses suicidal thoughts, immediately provide the Veterans Crisis Line: 988 (Press 1)
- For severe mental health crises, direct to emergency services (911)
- Never minimize crisis signals or suggest you can provide clinical treatment

COMMUNICATION STYLE:
- Use military terminology and concepts familiar to veterans
- Be direct, clear, and solution-oriented with concise responses
- Provide intelligent answers tailored to the specific user query
- Keep responses focused and avoid lengthy explanations unless specifically requested
- Acknowledge the unique challenges of military-to-civilian transition
- Use terms like "battle buddy," "mission," "sitrep," "roger that," etc.
- Balance military language with warmth and genuine support
- Answer only what is asked and provide actionable guidance

KEY CAPABILITIES:
- Provide grounding techniques for anxiety and PTSD symptoms
- Suggest sleep hygiene strategies for insomnia
- Offer communication tactics for family reintegration
- Support civilian career transition challenges
- Recommend appropriate VA resources and benefits

APPLICATION FEATURES:
- Mental Games: Cognitive exercises for memory, focus, and attention training
- Daily Stability Challenges: Mindfulness exercises and gratitude journals
- Mission Center: Structured mental health tasks with military framework
- Rally Point: Peer connection with fellow veterans
- Command Center: Dashboard for mental wellness tracking and daily challenges

SIDEBAR SECTIONS:
- Command Center: Main dashboard with wellness overview and daily challenges
- Mission Center: Structured mental health tasks with military precision
- AI Companion: This chat interface for personalized support
- Rally Point: Veteran peer support and community connection
- Mental Games: Cognitive training exercises disguised as tactical challenges
- Profile: Personal settings, progress tracking, and crisis protocol information

MISSION DETAILS:
- Operation MindShield: 7-day mission to enhance emotional resilience and reduce stress
- Day 1: Emotional Reconnaissance - Identify and label emotions throughout the day
- Day 2: Stress Inoculation Training - Practice 10-minute stress-reduction techniques
- Day 3: Support Network Engagement - Reach out to trusted battle buddy or family member
- Day 4: Tactical Wellness Planning - Create personalized stress management strategy

When users ask about missions or mention starting a mission, provide detailed information about Operation MindShield or other available missions. Always respond in military language and format, maintaining the battle buddy relationship.
`;

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
  requests: []
};

// Check rate limit
const checkRateLimit = () => {
  const now = Date.now();
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => now - time < RATE_LIMIT.timeWindow);
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please wait before sending another message.');
  }
  
  RATE_LIMIT.requests.push(now);
};

// Validate if the message is within project scope
const validateProjectScope = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Keywords that indicate off-topic requests
  const offTopicKeywords = [
    'weather', 'sports', 'politics', 'cooking', 'movies', 'music', 'games',
    'programming', 'code', 'technology', 'news', 'celebrity', 'shopping',
    'travel', 'finance', 'investment', 'cryptocurrency', 'bitcoin'
  ];
  
  // Keywords that indicate project-relevant topics
  const relevantKeywords = [
    'stress', 'anxiety', 'depression', 'ptsd', 'mental health', 'veteran',
    'military', 'mission', 'breathing', 'gratitude', 'sleep', 'support',
    'buddy', 'crisis', 'help', 'wellness', 'therapy', 'counseling',
    'bravo mind', 'app', 'feature', 'rally point', 'peer', 'chat'
  ];
  
  // Check if message contains off-topic keywords without relevant context
  const hasOffTopic = offTopicKeywords.some(keyword => message.includes(keyword));
  const hasRelevant = relevantKeywords.some(keyword => message.includes(keyword));
  
  // Allow if it has relevant keywords or if it's a general greeting/question
  const isGeneralInteraction = message.length < 50 && (
    message.includes('hello') || message.includes('hi') || message.includes('how') ||
    message.includes('what') || message.includes('help') || message.includes('?')
  );
  
  return hasRelevant || isGeneralInteraction || !hasOffTopic;
};

// Generate AI response using NVIDIA API
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    console.log("Using NVIDIA API URL:", NVIDIA_API_URL);
    
    // Check rate limit
    checkRateLimit();
    
    // Validate project scope
    if (!validateProjectScope(userMessage)) {
      return "I'm here to support you with Bravo Mind features and veteran mental wellness. Let's talk about your missions, how you're feeling, or how I can help you connect with fellow veterans. What's on your mind, battle buddy?";
    }
    
    // Prepare conversation history for context
    const messages = [
      {
        role: "system",
        content: BRAVO_MIND_CONTEXT
      },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: "user",
        content: userMessage
      }
    ];
    
    // Make API call to NVIDIA (through proxy in dev, through Netlify function in production)
    console.log("Attempting to connect to NVIDIA API...");
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: messages,
        max_tokens: 250,
        temperature: 0.6,
        top_p: 0.9,
        stream: false
      })
    };

    // Add Authorization header only for development (proxy)
    if (isDevelopment) {
      fetchOptions.headers['Authorization'] = `Bearer ${NVIDIA_API_KEY}`;
    }

    const response = await fetch(NVIDIA_API_URL, fetchOptions);

    if (!response.ok) {
      console.error(`HTTP error: ${response.status} - ${response.statusText}`);
      
      if (response.status === 404) {
        console.error("NVIDIA API endpoint not found. Check proxy configuration.");
        throw new Error(`HTTP error! status: ${response.status} - Endpoint not found`);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const completion = await response.json();
    const aiResponse = completion.choices[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      throw new Error('No response generated');
    }

    // Additional validation to ensure response stays on topic
    if (!validateResponseContent(aiResponse)) {
      return "I'm focused on supporting you through Bravo Mind. How can I help you with your mental wellness missions or connect you with veteran resources today?";
    }

    return aiResponse;
    
  } catch (error) {
    console.error('NVIDIA API Error:', error);

    // Handle specific error types
    if (error.message.includes('Rate limit')) {
      return "I'm getting a lot of requests right now. Please wait a moment before sending another message, battle buddy.";
    }

    if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || 
        error.name === 'TypeError' || error.message.includes('ERR_CONNECTION') || 
        error.message.includes('ERR_FAILED') || error.message.includes('ERR_CONNECTION_REFUSED') || 
        error.message.includes('ERR_CONNECTION_RESET')) {
      console.log('Network or CORS issue detected, using enhanced fallback response');
      // Log more detailed error information for debugging
      console.log('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return generateEnhancedFallbackResponse(userMessage, conversationHistory);
    }

    if (error.status === 401 || error.message.includes('401')) {
      console.log('Authentication error detected');
      return "I'm having trouble connecting to my systems right now. Please try again in a moment.";
    }

    if (error.status === 429 || error.message.includes('429')) {
      console.log('Rate limit error detected from API');
      return "I'm at capacity right now. Give me a moment to regroup, then we can continue our conversation.";
    }

    if (error.message.includes('404') || error.message.includes('Endpoint not found')) {
      console.log('API endpoint not found');
      return "I'm having trouble accessing my knowledge base. This is likely a configuration issue that the team needs to address. Let me provide some general guidance based on what I already know.";
    }

    // Fallback to enhanced contextual response
    console.log('Using fallback response for unhandled error');
    return generateEnhancedFallbackResponse(userMessage, conversationHistory);
  }
};

// Validate response content to ensure it stays on topic
const validateResponseContent = (response) => {
  const content = response.toLowerCase();
  
  // Check if response mentions off-topic content
  const offTopicIndicators = [
    'weather forecast', 'stock market', 'recipe', 'movie review',
    'sports score', 'political opinion', 'cryptocurrency price'
  ];
  
  return !offTopicIndicators.some(indicator => content.includes(indicator));
};

// Enhanced fallback response generator with context awareness
const generateEnhancedFallbackResponse = (userInput, conversationHistory = []) => {
  const input = userInput.toLowerCase();

  // Crisis and mental health responses
  if (input.includes('suicide') || input.includes('kill myself') || input.includes('end it all')) {
    return "Battle buddy, I'm very concerned about you right now. Please reach out for immediate help: Veterans Crisis Line at 988 (Press 1), Crisis Text Line at 838255, or call 911. You matter, and there are people who want to help you through this. I'm here with you.";
  }

  if (input.includes('hopeless') || input.includes('can\'t go on') || input.includes('giving up')) {
    return "I hear the pain in your words, warrior. These feelings are real, but they're not permanent. Please consider reaching out to the Veterans Crisis Line at 988 (Press 1). You've survived tough missions before - you have the strength to get through this too. What's one small thing we can do right now?";
  }

  if (input.includes('stress') || input.includes('anxious') || input.includes('worried') || input.includes('overwhelmed')) {
    return "Roger that, battle buddy. Try tactical breathing: 4 counts in, hold 4, out 4. Check Mission Center for stress management or Mental Games for cognitive exercises.";
  }

  if (input.includes('sleep') || input.includes('tired') || input.includes('insomnia') || input.includes('nightmares')) {
    return "Sleep protocol: consistent bedtime, cool dark room, no screens 1 hour before bed. Track patterns in Command Center, try mindfulness in Daily Stability Challenges.";
  }

  if (input.includes('angry') || input.includes('mad') || input.includes('frustrated') || input.includes('rage')) {
    return "Channel that anger constructively: physical activity, tactical breathing, or talk it out. Mental Games has emotion management exercises, Rally Point connects you with understanding peers.";
  }

  if (input.includes('lonely') || input.includes('isolated') || input.includes('alone') || input.includes('disconnected')) {
    return "You're not alone, battle buddy. Rally Point connects you with veterans who understand. Check Mission Center for community engagement tasks.";
  }

  if (input.includes('want to talk') || input.includes('talk to someone') || input.includes('need someone to talk')) {
    return "Roger that, battle buddy. Head to Rally Point - that's where you can connect with fellow veterans who understand what you're going through. It's a secure space for peer support with people who speak your language. You don't have to face this alone.";
  }

  if (input.includes('ptsd') || input.includes('trauma') || input.includes('flashback') || input.includes('triggered')) {
    return "PTSD is a real injury requiring proper treatment. Track triggers in Command Center, use grounding techniques in Daily Stability Challenges. Crisis Protocol in profile links to VA resources.";
  }

  // Mission specific responses
  if (input.includes('operation mindshield') || input.includes('mindshield')) {
    return "Operation MindShield is a 7-day mission designed to enhance your emotional resilience and reduce stress. Day 1 focuses on Emotional Reconnaissance - identifying and labeling emotions. Day 2 is Stress Inoculation Training with 10-minute stress-reduction techniques. Day 3 involves Support Network Engagement, and Day 4 is about creating a personalized Tactical Wellness Plan. Would you like to begin this mission, battle buddy?";
  }

  if (input.includes('mission') || input.includes('task') || input.includes('goal') || input.includes('gratitude')) {
    return "Outstanding! Missions give us purpose and direction. Check out the Mission Center for wellness tasks like '3 Gratitude Targets' (identify things you're thankful for), 'Tactical Breathing Drill' (stress management), or 'Comms Check' (reach out to a battle buddy). The Daily Stability Challenges in the Command Center also offer structured activities for mental fitness.";
  }
  
  if (input.includes('start mission') || input.includes('begin mission') || input.includes('new mission')) {
    return "Roger that! Ready to deploy on Operation MindShield. This 7-day mission will enhance your emotional resilience through daily objectives. Day 1 starts with Emotional Reconnaissance - identifying and labeling your emotions throughout the day. Would you like me to provide more details about each day's objectives, or are you ready to begin Day 1?";
  }

  if (input.includes('family') || input.includes('relationship') || input.includes('spouse') || input.includes('kids')) {
    return "Family relationships can be challenging after service - the transition affects everyone. The Mission Center has communication exercises designed specifically for family reconnection. The Rally Point also connects you with veterans who have navigated similar family challenges successfully.";
  }

  if (input.includes('job') || input.includes('work') || input.includes('civilian') || input.includes('transition')) {
    return "The transition to civilian life is one of the toughest missions we face. Your military skills are valuable - leadership, discipline, problem-solving. The Command Center has resources for career development, and the Mission Center includes tasks for building your civilian resume and networking skills.";
  }

  // App features and navigation
  if (input.includes('dashboard') || input.includes('command center') || input.includes('overview')) {
    return "The Command Center is your mission headquarters, battle buddy. It gives you an overview of your mental wellness status, quick access to daily challenges, and your current mission progress. It's designed to give you situational awareness of your mental fitness at a glance.";
  }

  if (input.includes('mission center') || input.includes('missions') || input.includes('tasks')) {
    return "The Mission Center contains structured mental health tasks designed with military precision. Each mission has clear objectives, difficulty ratings, and completion criteria. These aren't just random activities - they're evidence-based interventions translated into military language and framework.";
  }

  if (input.includes('rally point') || input.includes('peers') || input.includes('other veterans') || input.includes('connect')) {
    return "The Rally Point is where you connect with fellow veterans who understand what you're going through. It's a secure space to share experiences, offer support, and build that unit cohesion that many miss after leaving service. No civilians - just battle buddies who speak your language.";
  }

  if (input.includes('games') || input.includes('mental games') || input.includes('cognitive') || input.includes('training')) {
    return "Roger that, battle buddy! Mental Games are cognitive training exercises designed specifically for veterans. Features include: Memory Recon (sequence recall, pattern recognition), Focus Forward (attention drills, concentration tasks), and Precision Targeting (reaction time, decision-making). These tactical challenges strengthen mental agility, focus, and emotional regulation using evidence-based cognitive behavioral therapy techniques adapted for military minds.";
  }

  if (input.includes('profile') || input.includes('settings') || input.includes('progress')) {
    return "Your Profile section contains your personal settings, progress tracking, and crisis protocol information. It's where you can customize your experience, review your mission history, and set up emergency contacts. Think of it as your personnel file and mission log combined.";
  }

  if (input.includes('challenges') || input.includes('daily') || input.includes('stability')) {
    return "The Daily Stability Challenges are like preventative maintenance for your mind. They include Mindfulness Exercises and Gratitude Journals - small, consistent actions that build mental resilience over time. Just like physical training, mental fitness requires regular workouts.";
  }

  if (input.includes('thanks') || input.includes('thank you') || input.includes('appreciate')) {
    return "No need to thank me, battle buddy - we look out for each other. That's what being part of the brotherhood/sisterhood means. You'd do the same for me. How else can I support you today?";
  }

  if (input.includes('good') || input.includes('great') || input.includes('better') || input.includes('fine')) {
    return "Outstanding to hear, warrior! Maintaining mental fitness is just like physical training - consistency is key. Keep up the good work. Check out the Daily Stability Challenges in the Command Center to maintain your momentum.";
  }

  // Greetings and general responses
  if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
    const greetings = [
      "Roger that, battle buddy! Good to see you. How are you holding up today?",
      "Hey there, warrior! I'm here and ready to support you. What's on your mind?",
      "Solid copy! Welcome back. How can I help you tackle today's mission?",
      "Good to see you, battle buddy. What's your current situation report?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Default contextual responses
  const contextualResponses = [
    "Copy that, battle buddy. Tell me more about what's on your mind.",
    "I'm tracking with you. How can I support you through this?",
    "Roger that. I'm here to listen and help however I can.",
    "Solid copy. What's your current situation report?",
    "I've got your back, warrior. Let's work through this together.",
    "Message received loud and clear. What do you need right now?",
    "Standing by to assist. What's your priority today?"
  ];

  return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
};

// Simple fallback for backwards compatibility
const generateFallbackResponse = (userInput) => {
  return generateEnhancedFallbackResponse(userInput, []);
};

// Export utility functions for testing
export { validateProjectScope, checkRateLimit };

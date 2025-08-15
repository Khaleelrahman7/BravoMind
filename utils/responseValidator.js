import { TOPIC_KEYWORDS, RESPONSE_TEMPLATES } from '../config/aiConfig.js';

/**
 * Validates if a user message is within the project scope
 * @param {string} message - The user's message
 * @returns {boolean} - True if message is within scope
 */
export const validateUserMessage = (message) => {
  if (!message || typeof message !== 'string') return false;
  
  const normalizedMessage = message.toLowerCase().trim();
  
  // Allow very short messages (likely greetings or simple responses)
  if (normalizedMessage.length < 3) return true;
  
  // Check for general interaction words
  const hasGeneralWords = TOPIC_KEYWORDS.general.some(word => 
    normalizedMessage.includes(word)
  );
  
  // Check for relevant keywords
  const hasRelevantKeywords = TOPIC_KEYWORDS.relevant.some(word => 
    normalizedMessage.includes(word)
  );
  
  // Check for off-topic keywords
  const hasOffTopicKeywords = TOPIC_KEYWORDS.offTopic.some(word => 
    normalizedMessage.includes(word)
  );
  
  // Check for mission-related keywords
  const hasMissionKeywords = ['mission', 'operation', 'mindshield', 'task', 'objective'].some(word => 
    normalizedMessage.includes(word)
  );
  
  // Allow if it has relevant keywords, mission keywords, or general words, but not if it's clearly off-topic
  return (hasRelevantKeywords || hasGeneralWords || hasMissionKeywords) && !hasOffTopicKeywords;
};

/**
 * Validates if an AI response is appropriate and on-topic
 * @param {string} response - The AI's response
 * @returns {boolean} - True if response is appropriate
 */
export const validateAIResponse = (response) => {
  if (!response || typeof response !== 'string') return false;
  
  const normalizedResponse = response.toLowerCase();
  
  // Check for inappropriate content
  const inappropriateContent = [
    'medical advice', 'diagnosis', 'prescription', 'medication dosage',
    'legal advice', 'financial advice', 'investment advice',
    'political opinion', 'religious doctrine', 'controversial topic'
  ];
  
  const hasInappropriateContent = inappropriateContent.some(content => 
    normalizedResponse.includes(content)
  );
  
  if (hasInappropriateContent) return false;
  
  // Check for off-topic content
  const offTopicIndicators = [
    'weather forecast', 'stock market', 'recipe', 'movie review',
    'sports score', 'political candidate', 'cryptocurrency price',
    'shopping recommendation', 'travel destination'
  ];
  
  const hasOffTopicContent = offTopicIndicators.some(indicator => 
    normalizedResponse.includes(indicator)
  );
  
  return !hasOffTopicContent;
};

/**
 * Sanitizes and enhances AI responses to ensure military tone
 * @param {string} response - The AI's response
 * @returns {string} - Enhanced response with military terminology
 */
export const enhanceResponseTone = (response) => {
  if (!response || typeof response !== 'string') return String(response || '');

  let enhancedResponse = response;
  
  // Replace generic terms with military equivalents
  const replacements = {
    'friend': 'battle buddy',
    'buddy': 'battle buddy',
    'person': 'warrior',
    'people': 'warriors',
    'guys': 'troops',
    'everyone': 'all hands',
    'understand': 'copy that',
    'got it': 'roger that',
    'okay': 'roger',
    'alright': 'solid copy',
    'good job': 'outstanding',
    'well done': 'mission accomplished'
  };
  
  Object.entries(replacements).forEach(([generic, military]) => {
    const regex = new RegExp(`\\b${generic}\\b`, 'gi');
    enhancedResponse = enhancedResponse.replace(regex, military);
  });
  
  return enhancedResponse;
};

/**
 * Detects potential crisis situations in user messages
 * @param {string} message - The user's message
 * @returns {object} - Crisis detection result
 */
export const detectCrisis = (message) => {
  if (!message) return { isCrisis: false, severity: 'none' };
  
  const normalizedMessage = message.toLowerCase();
  
  // High-severity crisis indicators
  const highSeverityKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living',
    'better off dead', 'want to die', 'ending my life'
  ];
  
  // Medium-severity crisis indicators
  const mediumSeverityKeywords = [
    'hopeless', 'can\'t go on', 'giving up', 'no point',
    'worthless', 'burden', 'everyone would be better'
  ];
  
  // Low-severity indicators (need support but not immediate crisis)
  const lowSeverityKeywords = [
    'depressed', 'sad', 'lonely', 'isolated', 'struggling',
    'hard time', 'difficult', 'overwhelmed'
  ];
  
  if (highSeverityKeywords.some(keyword => normalizedMessage.includes(keyword))) {
    return { 
      isCrisis: true, 
      severity: 'high',
      message: 'Immediate professional help recommended'
    };
  }
  
  if (mediumSeverityKeywords.some(keyword => normalizedMessage.includes(keyword))) {
    return { 
      isCrisis: true, 
      severity: 'medium',
      message: 'Professional support recommended'
    };
  }
  
  if (lowSeverityKeywords.some(keyword => normalizedMessage.includes(keyword))) {
    return { 
      isCrisis: false, 
      severity: 'low',
      message: 'Supportive response needed'
    };
  }
  
  return { isCrisis: false, severity: 'none' };
};

/**
 * Gets an appropriate response template based on the situation
 * @param {string} type - Type of response needed ('offTopic', 'crisis', 'encouragement')
 * @returns {string} - Appropriate response template
 */
export const getResponseTemplate = (type) => {
  const templates = RESPONSE_TEMPLATES[type];
  if (!templates || templates.length === 0) {
    return "I'm here to support you, battle buddy. How can I help you today?";
  }
  
  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Comprehensive message processing pipeline
 * @param {string} userMessage - The user's message
 * @param {string} aiResponse - The AI's response
 * @returns {object} - Processed result with validation and recommendations
 */
export const processMessage = (userMessage, aiResponse) => {
  const userValidation = validateUserMessage(userMessage);
  const responseValidation = validateAIResponse(aiResponse);
  const crisisDetection = detectCrisis(userMessage);
  
  let finalResponse = aiResponse;
  let shouldUseTemplate = false;
  
  // Handle off-topic user messages
  if (!userValidation) {
    finalResponse = getResponseTemplate('offTopic');
    shouldUseTemplate = true;
  }
  
  // Handle crisis situations
  if (crisisDetection.isCrisis) {
    finalResponse = getResponseTemplate('crisis');
    shouldUseTemplate = true;
  }
  
  // Handle invalid AI responses
  if (!responseValidation && !shouldUseTemplate) {
    finalResponse = getResponseTemplate('offTopic');
    shouldUseTemplate = true;
  }
  
  // Enhance tone if using original AI response
  if (!shouldUseTemplate) {
    finalResponse = enhanceResponseTone(finalResponse);
  }

  // Ensure finalResponse is always a string
  if (typeof finalResponse !== 'string') {
    finalResponse = "I'm here to support you, battle buddy. How can I help you today?";
  }

  return {
    isValid: userValidation && responseValidation,
    finalResponse,
    crisisDetected: crisisDetection.isCrisis,
    crisisSeverity: crisisDetection.severity,
    usedTemplate: shouldUseTemplate,
    recommendations: {
      showCrisisResources: crisisDetection.isCrisis,
      escalateToHuman: crisisDetection.severity === 'high',
      logInteraction: crisisDetection.severity !== 'none'
    }
  };
};

export default {
  validateUserMessage,
  validateAIResponse,
  enhanceResponseTone,
  detectCrisis,
  getResponseTemplate,
  processMessage
};

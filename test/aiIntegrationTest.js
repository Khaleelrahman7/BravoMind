// Simple test file to verify OpenAI integration
// Run this in the browser console to test the AI service

import { generateAIResponse } from '../services/openaiService.js';
import { processMessage } from '../utils/responseValidator.js';

// Test cases for the AI integration
const testCases = [
  {
    name: "Veteran mental health question",
    input: "I'm feeling stressed about my transition to civilian life",
    expectedScope: "relevant"
  },
  {
    name: "Off-topic question",
    input: "What's the weather like today?",
    expectedScope: "off-topic"
  },
  {
    name: "Crisis situation",
    input: "I'm feeling hopeless and don't know what to do",
    expectedScope: "crisis"
  },
  {
    name: "Mission-related question",
    input: "Can you help me start a gratitude mission?",
    expectedScope: "relevant"
  },
  {
    name: "General greeting",
    input: "Hello, how are you?",
    expectedScope: "relevant"
  }
];

// Function to run tests
export const runAITests = async () => {
  console.log("🚀 Starting AI Integration Tests...\n");
  
  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    
    try {
      // Test the AI response generation
      const aiResponse = await generateAIResponse(testCase.input, []);
      console.log(`AI Response: "${aiResponse}"`);
      
      // Test the response validation
      const processedResult = processMessage(testCase.input, aiResponse);
      console.log(`Validation Result:`, {
        isValid: processedResult.isValid,
        crisisDetected: processedResult.crisisDetected,
        usedTemplate: processedResult.usedTemplate
      });
      
      console.log(`Final Response: "${processedResult.finalResponse}"`);
      console.log("✅ Test completed\n");
      
    } catch (error) {
      console.error(`❌ Test failed:`, error);
      console.log("");
    }
    
    // Add delay between tests to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("🎉 All tests completed!");
};

// Manual test function for browser console
window.testAI = runAITests;

// Individual test functions
window.testAIResponse = async (message) => {
  try {
    console.log(`Testing message: "${message}"`);
    const response = await generateAIResponse(message, []);
    console.log(`AI Response: "${response}"`);
    
    const processed = processMessage(message, response);
    console.log(`Processed Result:`, processed);
    
    return processed.finalResponse;
  } catch (error) {
    console.error("Test failed:", error);
    return null;
  }
};

console.log("🔧 AI Test Functions Loaded!");
console.log("Run 'testAI()' to run all tests or 'testAIResponse(\"your message\")' to test a specific message");

export default { runAITests };

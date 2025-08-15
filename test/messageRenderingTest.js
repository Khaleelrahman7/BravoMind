// Test to verify that message content is always rendered as strings
import { processMessage } from '../utils/responseValidator.js';

// Test cases for different types of content that might cause React error #130
const testCases = [
  {
    name: 'Normal string response',
    userMessage: 'Hello',
    aiResponse: 'Hello there, battle buddy!',
    expected: 'string'
  },
  {
    name: 'Object response (should be handled)',
    userMessage: 'Hello',
    aiResponse: { message: 'Hello there, battle buddy!' },
    expected: 'string'
  },
  {
    name: 'Null response (should be handled)',
    userMessage: 'Hello',
    aiResponse: null,
    expected: 'string'
  },
  {
    name: 'Undefined response (should be handled)',
    userMessage: 'Hello',
    aiResponse: undefined,
    expected: 'string'
  },
  {
    name: 'Number response (should be handled)',
    userMessage: 'Hello',
    aiResponse: 123,
    expected: 'string'
  },
  {
    name: 'Array response (should be handled)',
    userMessage: 'Hello',
    aiResponse: ['Hello', 'there'],
    expected: 'string'
  }
];

// Run tests
console.log('Testing message processing to prevent React error #130...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  try {
    const result = processMessage(testCase.userMessage, testCase.aiResponse);
    const responseType = typeof result.finalResponse;
    
    if (responseType === testCase.expected) {
      console.log(`✅ PASS - finalResponse is ${responseType}: "${result.finalResponse}"`);
    } else {
      console.log(`❌ FAIL - Expected ${testCase.expected}, got ${responseType}: ${result.finalResponse}`);
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
  }
  
  console.log('');
});

console.log('Test completed. All finalResponse values should be strings to prevent React error #130.');

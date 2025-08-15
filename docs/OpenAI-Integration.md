# NVIDIA API Integration for Bravo Mind

## Overview
The Bravo Mind application now includes NVIDIA's Llama-3.1-Nemotron-70B-Instruct model integration for the AI Battle Buddy chat feature. The integration uses the OpenAI SDK with NVIDIA's API endpoint and includes strict content filtering to ensure responses stay within the project scope and maintain appropriate military-friendly tone.

## API Key Configuration
The NVIDIA API key is configured in the `.env` file:
```
VITE_OPENAI_API_KEY=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
```

⚠️ **Security Note**: In production, API calls should go through a backend server to protect the API key.

## Model Information
- **Provider**: NVIDIA
- **Model**: nvidia/llama-3.1-nemotron-70b-instruct
- **Endpoint**: https://integrate.api.nvidia.com/v1
- **SDK**: OpenAI SDK (compatible with NVIDIA's API)

## Features

### 1. Content Restrictions
The AI is restricted to respond only about:
- Bravo Mind project features
- Veteran mental health support
- Military-related wellness topics
- Crisis support resources

### 2. Response Validation
- **Input Validation**: Checks if user messages are within project scope
- **Output Validation**: Ensures AI responses stay on-topic
- **Crisis Detection**: Identifies potential mental health crises
- **Tone Enhancement**: Maintains military-friendly language

### 3. Rate Limiting
- Maximum 10 requests per minute per user
- Automatic fallback to pre-written responses if rate limit exceeded

### 4. Error Handling
- Graceful degradation when API is unavailable
- Fallback responses maintain the military theme
- User-friendly error messages

## File Structure

```
├── services/
│   └── openaiService.js          # Main OpenAI integration
├── utils/
│   └── responseValidator.js      # Response validation and filtering
├── config/
│   └── aiConfig.js              # Configuration and prompts
├── test/
│   └── aiIntegrationTest.js     # Testing utilities
└── docs/
    └── OpenAI-Integration.md    # This documentation
```

## Key Components

### OpenAI Service (`services/openaiService.js`)
- Handles API communication with OpenAI
- Implements rate limiting
- Provides fallback responses
- Validates message scope

### Response Validator (`utils/responseValidator.js`)
- Validates user input and AI responses
- Detects crisis situations
- Enhances military tone
- Provides response templates

### AI Configuration (`config/aiConfig.js`)
- System prompts and context
- Topic keywords for validation
- Military terminology
- Response templates

## Usage Examples

### Basic Chat Integration
```javascript
import { generateAIResponse } from './services/openaiService';

const response = await generateAIResponse(userMessage, conversationHistory);
```

### With Validation
```javascript
import { processMessage } from './utils/responseValidator';

const rawResponse = await generateAIResponse(userMessage, history);
const processed = processMessage(userMessage, rawResponse);

if (processed.crisisDetected) {
  // Show crisis resources
}
```

## Testing

### Browser Console Testing
1. Open the application in browser
2. Open developer console
3. Run test functions:
   ```javascript
   // Test all scenarios
   testAI()
   
   // Test specific message
   testAIResponse("I'm feeling stressed")
   ```

### Test Scenarios
- ✅ Veteran mental health questions
- ✅ Mission-related queries
- ✅ Crisis situation detection
- ✅ Off-topic question filtering
- ✅ General greetings and interactions

## Crisis Detection

The system automatically detects potential crisis situations and:
1. Shows crisis resources panel
2. Provides appropriate response templates
3. Includes emergency contact information

### Crisis Resources Displayed
- Veterans Crisis Line: 988 (Press 1)
- Crisis Text Line: Text 838255
- Emergency: 911

## Customization

### Adding New Keywords
Edit `config/aiConfig.js` to add relevant or off-topic keywords:
```javascript
export const TOPIC_KEYWORDS = {
  relevant: [..., 'new-keyword'],
  offTopic: [..., 'restricted-keyword']
};
```

### Modifying System Prompt
Update the `SYSTEM_PROMPT` in `config/aiConfig.js` to adjust AI behavior.

### Adding Response Templates
Add new templates in `config/aiConfig.js`:
```javascript
export const RESPONSE_TEMPLATES = {
  newCategory: [
    "Template response 1",
    "Template response 2"
  ]
};
```

## Monitoring and Analytics

### Recommended Tracking
- Response validation failures
- Crisis detection events
- Rate limit hits
- API error rates
- User satisfaction with responses

### Logging
The system logs:
- Invalid responses
- Crisis situations
- API errors
- Rate limit violations

## Security Considerations

1. **API Key Protection**: Move to backend in production
2. **Input Sanitization**: All user inputs are validated
3. **Output Filtering**: All AI responses are checked
4. **Rate Limiting**: Prevents abuse
5. **Crisis Escalation**: Serious situations are flagged

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Check `.env` file configuration
   - Verify API key is correct

2. **Rate Limit Exceeded**
   - Wait 1 minute before retrying
   - Check rate limiting configuration

3. **Off-topic Responses**
   - Review system prompt
   - Update keyword filters
   - Check response validation

4. **Crisis Detection Not Working**
   - Review crisis keywords
   - Test with known crisis phrases
   - Check response templates

## Future Enhancements

1. **Backend Integration**: Move API calls to secure backend
2. **Advanced Analytics**: Track conversation quality
3. **Personalization**: Adapt responses to user preferences
4. **Multi-language Support**: Support for different languages
5. **Voice Integration**: Add speech-to-text capabilities

## Support

For issues with the OpenAI integration:
1. Check browser console for errors
2. Verify API key configuration
3. Test with provided test functions
4. Review response validation logs

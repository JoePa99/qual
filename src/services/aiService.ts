// Get configuration from localStorage or environment variables
const getConfig = () => {
  // First check sessionStorage (set by the Settings component)
  const sessionProvider = window.sessionStorage.getItem('VITE_API_PROVIDER');
  const sessionApiUrl = window.sessionStorage.getItem('VITE_API_URL');
  const sessionApiKey = window.sessionStorage.getItem('VITE_API_KEY');
  const sessionClaudeModel = window.sessionStorage.getItem('VITE_CLAUDE_MODEL');

  // Then check localStorage
  const localProvider = localStorage.getItem('apiProvider');
  const localApiKey = localProvider === 'anthropic' 
    ? localStorage.getItem('claudeApiKey') 
    : localStorage.getItem('openaiApiKey');
  const localClaudeModel = localStorage.getItem('claudeModel');

  // Finally fall back to environment variables
  const envProvider = import.meta.env.VITE_API_PROVIDER;
  const envApiUrl = import.meta.env.VITE_API_URL;
  const envApiKey = import.meta.env.VITE_API_KEY;
  const envClaudeModel = import.meta.env.VITE_CLAUDE_MODEL;

  // Use the first available value in the priority order
  const provider = sessionProvider || localProvider || envProvider || 'anthropic';
  const apiKey = sessionApiKey || localApiKey || envApiKey || '';
  const claudeModel = sessionClaudeModel || localClaudeModel || envClaudeModel || 'claude-3-sonnet-20240229';
  
  // Determine API URL based on provider if not explicitly set
  const apiUrl = sessionApiUrl || (provider === 'anthropic' 
    ? 'https://api.anthropic.com/v1' 
    : 'https://api.openai.com/v1');

  return { provider, apiUrl, apiKey, claudeModel };
};

// API configuration
let config = getConfig();
let API_PROVIDER = config.provider;
let API_URL = config.apiUrl;
let API_KEY = config.apiKey;
let CLAUDE_MODEL = config.claudeModel;

// Helper function to refresh the configuration (used when settings are updated)
const refreshConfig = () => {
  config = getConfig();
  API_PROVIDER = config.provider;
  API_URL = config.apiUrl;
  API_KEY = config.apiKey;
  CLAUDE_MODEL = config.claudeModel;
  console.log('AI service configuration refreshed');
  return config;
};

interface AIResponse {
  status: 'success' | 'error';
  data?: any;
  error?: string;
}

interface SegmentRequest {
  researchData: string;
  approach: 'behavioral' | 'attitudinal' | 'needs-based' | 'custom';
  segmentCount: number;
  customPrompt?: string;
}

interface StimulusRequest {
  segmentId: number;
  segmentName: string;
  stimulus: string;
}

interface FocusGroupRequest {
  segmentId: number;
  segmentName: string;
  participants: Array<{
    id: number;
    name: string;
    age: number;
    location: string;
    occupation: string;
  }>;
  question: string;
}

/**
 * Service for communicating with AI APIs
 */
export const AIService = {
  // Refresh configuration (used when settings change)
  refreshConfig,
  /**
   * Generate segments based on research data
   */
  async generateSegments(request: SegmentRequest): Promise<AIResponse> {
    try {
      if (!API_KEY) {
        return simulateSegmentGeneration(request);
      }

      if (API_PROVIDER === 'anthropic') {
        // Anthropic Claude API call
        const response = await fetch(`${API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 4000,
            system: `You are an expert market researcher and customer insights analyst. Your task is to identify ${request.segmentCount} customer segments from the provided research data using a ${request.approach} approach. Return results in JSON format.`,
            messages: [
              {
                role: 'user',
                content: `Generate ${request.segmentCount} customer segments based on this research data: ${request.researchData} ${request.customPrompt ? `\n\nAdditional instructions: ${request.customPrompt}` : ''}\n\nReturn the results in the following JSON format: { "segments": [ { "id": 1, "name": "Segment Name", "description": "Segment description", "size": 30, "characteristics": ["trait 1", "trait 2"], "affinities": ["affinity 1", "affinity 2"], "painPoints": ["pain point 1", "pain point 2"] }, ... ] }`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract content from Claude's response
        let contentStr = data.content[0].text;
        // Find JSON in the response
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          contentStr = jsonMatch[0];
        }
        
        const segments = JSON.parse(contentStr);
        
        return {
          status: 'success',
          data: segments
        };
      } else {
        // OpenAI API call
        const response = await fetch(`${API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an expert market researcher and customer insights analyst. Your task is to identify ${request.segmentCount} customer segments from the provided research data using a ${request.approach} approach.`
              },
              {
                role: 'user',
                content: `Generate ${request.segmentCount} customer segments based on this research data: ${request.researchData} ${request.customPrompt ? `\n\nAdditional instructions: ${request.customPrompt}` : ''}`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Process the response into our expected segment format
        const segments = JSON.parse(data.choices[0].message.content);
        
        return {
          status: 'success',
          data: segments
        };
      }
    } catch (error) {
      console.error('Error generating segments:', error);
      
      // Fall back to simulated response if API call fails
      return simulateSegmentGeneration(request);
    }
  },

  /**
   * Generate responses to a stimulus for a specific segment
   */
  async getSegmentResponse(request: StimulusRequest): Promise<AIResponse> {
    try {
      if (!API_KEY) {
        return simulateStimulusResponse(request);
      }

      if (API_PROVIDER === 'anthropic') {
        // Anthropic Claude API call
        const response = await fetch(`${API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: `You are simulating the responses of customers in the "${request.segmentName}" segment. Generate 5 different realistic responses to the stimulus, reflecting how people in this segment would respond. Return results in JSON format.`,
            messages: [
              {
                role: 'user',
                content: `Generate 5 different realistic responses to this prompt: "${request.stimulus}"\n\nThese responses should reflect how people in the "${request.segmentName}" segment would respond.\n\nReturn the results in the following JSON format: { "responses": ["response 1", "response 2", "response 3", "response 4", "response 5"] }`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract content from Claude's response
        let contentStr = data.content[0].text;
        // Find JSON in the response
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          contentStr = jsonMatch[0];
        }
        
        const content = JSON.parse(contentStr);
        
        return {
          status: 'success',
          data: content.responses || []
        };
      } else {
        // OpenAI API call
        const response = await fetch(`${API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are simulating the responses of customers in the "${request.segmentName}" segment. Generate 5 different realistic responses to the stimulus, reflecting how people in this segment would respond.`
              },
              {
                role: 'user',
                content: `Generate responses to this prompt: "${request.stimulus}"`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Process the response into our expected format
        const content = JSON.parse(data.choices[0].message.content);
        
        return {
          status: 'success',
          data: content.responses || []
        };
      }
    } catch (error) {
      console.error('Error generating stimulus responses:', error);
      
      // Fall back to simulated response if API call fails
      return simulateStimulusResponse(request);
    }
  },

  /**
   * Generate focus group responses from virtual participants
   */
  async getFocusGroupResponses(request: FocusGroupRequest): Promise<AIResponse> {
    try {
      if (!API_KEY) {
        return simulateFocusGroupResponses(request);
      }

      if (API_PROVIDER === 'anthropic') {
        // Anthropic Claude API call
        const response = await fetch(`${API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 3000,
            system: `You are simulating a focus group discussion with participants from the "${request.segmentName}" segment. Each participant has a specific persona. Generate personalized responses for each participant to the discussion question. Return results in JSON format.`,
            messages: [
              {
                role: 'user',
                content: `Generate responses to this question: "${request.question}" for these participants: ${JSON.stringify(request.participants)}\n\nReturn the results in the following JSON format: { "responses": [{ "participantId": 1, "response": "participant's response" }, { "participantId": 2, "response": "another participant's response" }, ...] }`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract content from Claude's response
        let contentStr = data.content[0].text;
        // Find JSON in the response
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          contentStr = jsonMatch[0];
        }
        
        const content = JSON.parse(contentStr);
        
        return {
          status: 'success',
          data: content.responses || []
        };
      } else {
        // OpenAI API call
        const response = await fetch(`${API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are simulating a focus group discussion with participants from the "${request.segmentName}" segment. Each participant has a specific persona. Generate personalized responses for each participant to the discussion question.`
              },
              {
                role: 'user',
                content: `Generate responses to this question: "${request.question}" for these participants: ${JSON.stringify(request.participants)}`
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Process the response into our expected format
        const content = JSON.parse(data.choices[0].message.content);
        
        return {
          status: 'success',
          data: content.responses || []
        };
      }
    } catch (error) {
      console.error('Error generating focus group responses:', error);
      
      // Fall back to simulated response if API call fails
      return simulateFocusGroupResponses(request);
    }
  }
};

// Fallback simulation functions (same as our current mock data)

function simulateSegmentGeneration(request: SegmentRequest): AIResponse {
  // This would use our existing mock segment generation code
  console.log('Using simulated segment generation for:', request);
  
  // Return mock segments based on the segment approach
  return {
    status: 'success',
    data: {
      segments: [
        {
          id: 1,
          name: 'Digital Enthusiasts',
          description: 'Early adopters who embrace new technologies and digital channels for all interactions.',
          size: 28,
          characteristics: [
            'Tech-savvy consumers',
            'Prefer self-service options',
            'Research extensively online',
            'High digital engagement'
          ],
          affinities: [
            'Mobile app experiences',
            'Digital payment methods',
            'Personalized recommendations',
            'Cutting-edge features'
          ],
          painPoints: [
            'Slow digital interfaces',
            'Limited self-service options',
            'Having to use traditional channels',
            'Generic, non-personalized experiences'
          ]
        },
        // Add other mock segments...
      ]
    }
  };
}

function simulateStimulusResponse(request: StimulusRequest): AIResponse {
  console.log('Using simulated stimulus response for:', request);

  // Generate different responses based on segment
  let responses: string[] = [];
  
  if (request.segmentId === 1) { // Young Professionals
    responses = [
      `As a young professional, I think about ${request.stimulus} quite often. I'd say my approach is digital-first and efficiency-oriented.`,
      `When it comes to ${request.stimulus}, I'm looking for solutions that save me time and integrate with my existing tech ecosystem.`,
      `${request.stimulus} matters to me, but I need it to be accessible on-the-go. I make most decisions on my phone while commuting or between meetings.`,
      `I value brands that understand ${request.stimulus} should be part of a seamless experience that respects my time and offers personalization.`,
      `For ${request.stimulus}, I'm willing to pay more for quality and convenience. I often ask my network for recommendations before making decisions.`
    ];
  } else if (request.segmentId === 2) { // Suburban Families
    responses = [
      `As a parent, ${request.stimulus} is something I consider carefully because it affects the whole family. Safety and reliability are my top priorities.`,
      `When we discuss ${request.stimulus} in our household, we're always thinking about value and durability - will this last through multiple kids?`,
      `I research ${request.stimulus} extensively online, reading reviews from other parents before making any decisions. Word-of-mouth from other families also matters a lot.`,
      `For our family, ${request.stimulus} has to fit within our budget but still meet quality standards. We're willing to invest more in things we use daily.`,
      `With ${request.stimulus}, I'm looking for family-friendly options that consider the needs of different age groups and make our busy lives easier.`
    ];
  }
  // Add other segments...
  
  return {
    status: 'success',
    data: responses
  };
}

function simulateFocusGroupResponses(request: FocusGroupRequest): AIResponse {
  console.log('Using simulated focus group responses for:', request);
  
  // Create response array matching participant IDs
  const responses = request.participants.map(participant => {
    // Generate a response specific to this participant and segment
    let response = '';
    
    if (request.segmentId === 1) { // Young Professionals
      const options = [
        `As someone working in ${participant.occupation}, I approach ${request.question} with a focus on efficiency and innovation. I'm always looking for digital solutions that integrate with my workflow.`,
        `Living in ${participant.location}, I find that ${request.question} is something I deal with mostly through my smartphone, often while commuting or between meetings.`,
        `I'd say that ${request.question} is important to me, but only if it saves me time and enhances my experience. I'm willing to pay more for convenience.`,
        `My perspective on ${request.question} is shaped by my fast-paced lifestyle. I need solutions that understand my time is valuable and offer personalization.`
      ];
      response = options[Math.floor(Math.random() * options.length)];
    } else if (request.segmentId === 2) { // Suburban Families
      const options = [
        `As a ${participant.age}-year-old parent, ${request.question} is something I consider carefully in terms of how it affects our family budget and daily routine.`,
        `Living in ${participant.location} with a family means ${request.question} needs to be practical, durable, and offer good value for money.`,
        `My approach to ${request.question} involves extensive research and often consulting with other parents in similar situations before making decisions.`,
        `When it comes to ${request.question}, safety and reliability are my top priorities, followed by affordability. I'm willing to pay more for things we use daily.`
      ];
      response = options[Math.floor(Math.random() * options.length)];
    }
    // Add other segments...
    
    return {
      participantId: participant.id,
      response
    };
  });
  
  return {
    status: 'success',
    data: responses
  };
}
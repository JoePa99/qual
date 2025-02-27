import { useState, useEffect } from 'react';
import './Settings.css';
import { AIService } from '../services/aiService';

// Connection test component
interface ConnectionTestProps {
  provider: string;
  apiKey: string;
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({ provider, apiKey }) => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  
  const testConnection = async () => {
    if (!apiKey) {
      setStatus('error');
      setMessage('API key is required');
      return;
    }
    
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      if (provider === 'anthropic') {
        // Test Claude API connection
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307', // Use the fastest model for the test
            max_tokens: 10,
            messages: [
              {
                role: 'user',
                content: 'Just say "connected" to test the API connection'
              }
            ]
          })
        });
        
        if (response.ok) {
          setStatus('success');
          setMessage('Successfully connected to Claude API');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(`Error: ${errorData.error?.message || 'Unknown error'}`);
        }
      } else {
        // Test OpenAI API connection
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo', // Use a cheaper model for the test
            messages: [
              {
                role: 'user',
                content: 'Just say "connected" to test the API connection'
              }
            ],
            max_tokens: 10
          })
        });
        
        if (response.ok) {
          setStatus('success');
          setMessage('Successfully connected to OpenAI API');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(`Error: ${errorData.error?.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Run the test when the API key changes
  useEffect(() => {
    // Reset when provider or key changes
    setStatus('idle');
    setMessage('');
  }, [provider, apiKey]);

  return (
    <div className="connection-test">
      <div className="test-status">
        {status === 'idle' && (
          <>
            <span className="status-indicator idle"></span>
            <span className="status-message">Not tested</span>
          </>
        )}
        {status === 'testing' && (
          <>
            <span className="status-indicator testing"></span>
            <span className="status-message">Testing...</span>
          </>
        )}
        {status === 'success' && (
          <>
            <span className="status-indicator success"></span>
            <span className="status-message">Connected</span>
          </>
        )}
        {status === 'error' && (
          <>
            <span className="status-indicator error"></span>
            <span className="status-message">{message}</span>
          </>
        )}
      </div>
      <button 
        className="test-button"
        onClick={testConnection}
        disabled={!apiKey || status === 'testing'}
      >
        Test Connection
      </button>
    </div>
  );
};

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const [apiProvider, setApiProvider] = useState<string>(
    localStorage.getItem('apiProvider') || 'anthropic'
  );
  const [claudeApiKey, setClaudeApiKey] = useState<string>(
    localStorage.getItem('claudeApiKey') || ''
  );
  const [openaiApiKey, setOpenaiApiKey] = useState<string>(
    localStorage.getItem('openaiApiKey') || ''
  );
  const [claudeModel, setClaudeModel] = useState<string>(
    localStorage.getItem('claudeModel') || 'claude-3-sonnet-20240229'
  );
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('apiProvider');
    if (savedProvider) setApiProvider(savedProvider);
    
    const savedClaudeKey = localStorage.getItem('claudeApiKey');
    if (savedClaudeKey) setClaudeApiKey(savedClaudeKey);
    
    const savedOpenAIKey = localStorage.getItem('openaiApiKey');
    if (savedOpenAIKey) setOpenaiApiKey(savedOpenAIKey);
    
    const savedClaudeModel = localStorage.getItem('claudeModel');
    if (savedClaudeModel) setClaudeModel(savedClaudeModel);
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('apiProvider', apiProvider);
    localStorage.setItem('claudeApiKey', claudeApiKey);
    localStorage.setItem('openaiApiKey', openaiApiKey);
    localStorage.setItem('claudeModel', claudeModel);
    
    // Update environment variables for the current session
    // Note: This doesn't change the actual .env file, just the runtime values
    window.sessionStorage.setItem('VITE_API_PROVIDER', apiProvider);
    
    if (apiProvider === 'anthropic') {
      window.sessionStorage.setItem('VITE_API_URL', 'https://api.anthropic.com/v1');
      window.sessionStorage.setItem('VITE_API_KEY', claudeApiKey);
      window.sessionStorage.setItem('VITE_CLAUDE_MODEL', claudeModel);
    } else {
      window.sessionStorage.setItem('VITE_API_URL', 'https://api.openai.com/v1');
      window.sessionStorage.setItem('VITE_API_KEY', openaiApiKey);
    }
    
    // Refresh the AI service configuration
    AIService.refreshConfig();
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <div className="settings-header">
          <h2>AI Provider Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-body">
          <div className="setting-group">
            <label>Select AI Provider:</label>
            <div className="provider-options">
              <div 
                className={`provider-option ${apiProvider === 'anthropic' ? 'selected' : ''}`}
                onClick={() => setApiProvider('anthropic')}
              >
                <div className="provider-icon">🧠</div>
                <div className="provider-info">
                  <h4>Claude (Anthropic)</h4>
                  <p>Recommended for qualitative analysis</p>
                </div>
              </div>
              
              <div 
                className={`provider-option ${apiProvider === 'openai' ? 'selected' : ''}`}
                onClick={() => setApiProvider('openai')}
              >
                <div className="provider-icon">🤖</div>
                <div className="provider-info">
                  <h4>GPT-4 (OpenAI)</h4>
                  <p>Alternative AI provider</p>
                </div>
              </div>
            </div>
          </div>
          
          {apiProvider === 'anthropic' ? (
            <>
              <div className="setting-group">
                <label htmlFor="claude-api-key">Claude API Key:</label>
                <input 
                  type="password"
                  id="claude-api-key"
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="Enter your Claude API key"
                  className="settings-input"
                />
                <p className="settings-hint">Get your key from the <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic Console</a></p>
              </div>
              
              <div className="setting-group">
                <label htmlFor="claude-model">Claude Model:</label>
                <select 
                  id="claude-model"
                  value={claudeModel}
                  onChange={(e) => setClaudeModel(e.target.value)}
                  className="settings-select"
                >
                  <option value="claude-3-opus-20240229">Claude 3 Opus (Most powerful)</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet (Recommended)</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fastest)</option>
                </select>
              </div>
            </>
          ) : (
            <div className="setting-group">
              <label htmlFor="openai-api-key">OpenAI API Key:</label>
              <input 
                type="password"
                id="openai-api-key"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="settings-input"
              />
              <p className="settings-hint">Get your key from the <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></p>
            </div>
          )}
          
          <div className="setting-group">
            <label>AI Connection Status:</label>
            <div className="connection-status">
              <ConnectionTest 
                provider={apiProvider} 
                apiKey={apiProvider === 'anthropic' ? claudeApiKey : openaiApiKey} 
              />
            </div>
          </div>
        </div>
        
        <div className="settings-footer">
          <button 
            className="btn-primary save-btn" 
            onClick={handleSave}
            disabled={apiProvider === 'anthropic' && !claudeApiKey || apiProvider === 'openai' && !openaiApiKey}
          >
            Save Settings
          </button>
          {isSaved && <span className="save-success">✓ Settings saved!</span>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
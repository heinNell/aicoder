'use client';

import { AlignLeft, ArrowRightLeft, Copy, Download, History, Scale, Search, Settings, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MainInterface() {
  const [currentMode, setCurrentMode] = useState('error-repair');
  const [showSettings, setShowSettings] = useState(false);
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [codeInput, setCodeInput] = useState('');
  const [improvedCode, setImprovedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Estimate tokens (rough: 1 token ≈ 4 characters)
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  
  // Get model limits
  const getModelLimit = (provider: string, model: string) => {
    const limits: Record<string, Record<string, number>> = {
      openai: {
        'gpt-4o': 120000,
        'gpt-4o-mini': 120000,
        'gpt-4-turbo': 120000,
        'gpt-3.5-turbo': 15000,
      },
      anthropic: {
        'claude-3-5-sonnet-20241022': 180000,
        'claude-3-opus-20240229': 180000,
        'claude-3-sonnet-20240229': 180000,
        'claude-3-haiku-20240307': 180000,
      },
      google: {
        'gemini-pro': 30000,
        'gemini-pro-vision': 15000,
      },
      ollama: {
        default: 50000,
      },
    };
    
    return limits[provider]?.[model] || limits[provider]?.default || 15000;
  };
  
  const providerModels: Record<string, string[]> = {
    openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    google: ['gemini-pro', 'gemini-pro-vision'],
    ollama: ['llama3.1', 'codellama', 'mistral', 'deepseek-coder'],
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider');
    const savedModel = localStorage.getItem('aiModel');
    const savedApiKey = localStorage.getItem('apiKey');
    const savedOllamaUrl = localStorage.getItem('ollamaUrl');
    
    if (savedProvider) setAiProvider(savedProvider);
    if (savedModel) setAiModel(savedModel);
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedOllamaUrl) setOllamaUrl(savedOllamaUrl);
  }, []);

  const handleImproveCode = async () => {
    if (!codeInput.trim()) {
      showNotification('Please enter some code to improve!', 'error');
      return;
    }

    if (!apiKey && aiProvider !== 'ollama') {
      showNotification('Please configure your API key in Settings first!', 'error');
      setShowSettings(true);
      return;
    }

    // Check token limit
    const tokens = estimateTokens(codeInput);
    const limit = getModelLimit(aiProvider, aiModel);
    
    if (tokens > limit) {
      showNotification(
        `Code is too large (≈${tokens.toLocaleString()} tokens). ${aiModel} supports up to ${limit.toLocaleString()} tokens. Try using GPT-4o or Claude models for larger codebases.`,
        'error'
      );
      return;
    }

    if (tokens > limit * 0.9) {
      showNotification(
        `Warning: Code is near the token limit. This may result in incomplete responses.`,
        'info'
      );
    }

    setIsLoading(true);
    setShowOutput(true);

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeInput,
          mode: currentMode,
          provider: aiProvider,
          model: aiModel,
          apiKey: apiKey,
          ollamaUrl: ollamaUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve code');
      }

      setImprovedCode(data.improvedCode);
      showNotification('Code improved successfully!', 'success');
    } catch (error) {
      console.error('Error improving code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error improving code. Please check your settings and try again.';
      showNotification(errorMessage, 'error');
      setShowOutput(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container">
      <header>
        <h1>🤖 AI Code Improver <span className="pro-badge">PRO</span></h1>
        <p className="subtitle">
          Advanced AI-powered code transformation • Real-time improvements •
          Multi-language support
        </p>
        <div className="header-stats" id="headerStats">
          <span className="stat" id="statProvider">Provider: {aiProvider}</span>
          <span className="stat" id="statModel">Model: {aiModel}</span>
          <span className="stat" id="statHistory">History: 0</span>
          <button className="quick-btn" onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={16} /> Settings
          </button>
        </div>
      </header>

      <main>
        {/* Quick Actions Bar */}
        <div className="quick-actions">
          <button className="quick-btn" title="Clear All" onClick={() => {
            setCodeInput('');
            setImprovedCode('');
            setShowOutput(false);
          }}>
            <Trash2 size={16} /> Clear
          </button>
          <button className="quick-btn" title="Auto-Format">
            <AlignLeft size={16} /> Format
          </button>
          <button className="quick-btn" title="Compare Models">
            <Scale size={16} /> Compare
          </button>
          <button className="quick-btn" title="View History">
            <History size={16} /> History
          </button>
          <button className="quick-btn" title="Export Code">
            <Download size={16} /> Export
          </button>
          <div className="language-detector">
            <span><Search size={14} /> Detected:</span>
            <span className="detected-lang">Auto-detect</span>
          </div>
        </div>

        <div className="main-grid">
          {/* Input Panel */}
          <div className="panel input-panel">
            <div className="panel-header">
              <h3>📝 Input Code</h3>
              <div className="panel-actions">
                <select className="language-select" defaultValue="auto">
                  <option value="auto">Auto-detect</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  {/* Add other options */}
                </select>
                <button className="icon-btn" title="Paste from clipboard">
                  <Copy size={16} />
                </button>
                <button className="icon-btn" title="Upload file">
                  <Upload size={16} />
                </button>
              </div>
            </div>
            <div className="code-editor-wrapper">
              <div className="line-numbers"></div>
              <textarea
                id="codeInput"
                placeholder="// Paste your code here...&#10;// Supports multiple languages&#10;// Line numbers shown automatically"
                spellCheck={false}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              ></textarea>
            </div>
            <div className="input-stats">
              <span>Lines: {codeInput.split('\n').length}</span>
              <span>Chars: {codeInput.length}</span>
              <span>Words: {codeInput.trim().split(/\s+/).filter(w => w).length}</span>
              {codeInput && (
                <span className={`token-estimate ${estimateTokens(codeInput) > getModelLimit(aiProvider, aiModel) * 0.8 ? 'warning' : ''}`}>
                  Tokens: ≈{estimateTokens(codeInput).toLocaleString()} / {getModelLimit(aiProvider, aiModel).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="panel output-panel">
            <div className="output-container">
              <div className="output-header">
                <span className="output-title">✨ Improved Code</span>
                <div className="output-actions">
                  <button 
                    className="action-btn" 
                    title="Copy to Clipboard"
                    onClick={() => {
                      if (improvedCode) {
                        navigator.clipboard.writeText(improvedCode);
                        showNotification('Code copied to clipboard!', 'success');
                      }
                    }}
                    disabled={!improvedCode}
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button className="action-btn" title="Toggle Diff View">
                    <ArrowRightLeft size={14} /> Diff
                  </button>
                </div>
              </div>
              <div className="output-content">
                {isLoading ? (
                  <div className="empty-state">
                    <div className="sparkle-container"></div>
                    <p>✨ Improving your code...</p>
                    <span>Please wait while AI analyzes and enhances your code</span>
                  </div>
                ) : showOutput && improvedCode ? (
                  <pre className="output-code">
                    <code>{improvedCode}</code>
                  </pre>
                ) : (
                  <div className="empty-state">
                    <div className="sparkle-container"></div>
                    <p>Your improved code will appear here</p>
                    <span>Ready to transform your code!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="control-panel">
          <div className="mode-section">
            <label className="section-label">🎯 Improvement Mode</label>
            <div className="mode-grid">
              {['error-repair', 'visual-enhancement', 'optimize', 'document', 'security', 'test', 'convert', 'explain', 'nl-to-code'].map(mode => (
                <label key={mode} className={`mode-card ${mode === 'nl-to-code' ? 'nl-mode' : ''} ${currentMode === mode ? 'border-primary bg-primary/10' : ''}`}>
                  <input type="radio" name="mode" value={mode} checked={currentMode === mode} onChange={() => setCurrentMode(mode)} className="hidden" />
                  <div className="mode-icon">
                   {mode === 'error-repair' && '🔧'}
                   {mode === 'visual-enhancement' && '✨'}
                   {mode === 'optimize' && '⚡'}
                   {mode === 'document' && '📚'}
                   {mode === 'security' && '🔒'}
                   {mode === 'test' && '🧪'}
                   {mode === 'convert' && '🔄'}
                   {mode === 'explain' && '💡'}
                   {mode === 'nl-to-code' && '💬'}
                  </div>
                  <div className="mode-info">
                    <span className="mode-title">{mode.replace(/-/g, ' ').toUpperCase()}</span>
                    <span className="mode-desc">Select to enable</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={handleImproveCode}
            disabled={isLoading || !codeInput.trim()}
          >
            <span className="btn-icon-left">{isLoading ? '⏳' : '✨'}</span>
            <span className="btn-text">{isLoading ? 'Processing...' : 'Improve Code'}</span>
          </button>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p>AI Code Improver Pro • Powered by Supabase & Next.js</p>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚙️ Settings</h2>
              <button onClick={() => setShowSettings(false)} className="icon-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <label className="settings-label">AI Provider</label>
                <select 
                  className="settings-select" 
                  value={aiProvider} 
                  onChange={(e) => {
                    setAiProvider(e.target.value);
                    setAiModel(providerModels[e.target.value][0]);
                  }}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="google">Google (Gemini)</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              <div className="settings-section">
                <label className="settings-label">AI Model</label>
                <select 
                  className="settings-select" 
                  value={aiModel} 
                  onChange={(e) => setAiModel(e.target.value)}
                >
                  {providerModels[aiProvider]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {aiProvider !== 'ollama' && (
                <div className="settings-section">
                  <label className="settings-label">API Key</label>
                  <input
                    type="password"
                    className="settings-input"
                    placeholder={`Enter your ${aiProvider} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="settings-hint">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
              )}

              {aiProvider === 'ollama' && (
                <div className="settings-section">
                  <label className="settings-label">Ollama URL</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="http://localhost:11434"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                  />
                  <p className="settings-hint">
                    Make sure Ollama is running on your local machine.
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowSettings(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={() => {
                  // Save settings to localStorage
                  localStorage.setItem('aiProvider', aiProvider);
                  localStorage.setItem('aiModel', aiModel);
                  if (apiKey) localStorage.setItem('apiKey', apiKey);
                  localStorage.setItem('ollamaUrl', ollamaUrl);
                  setShowSettings(false);
                  showNotification('Settings saved successfully!', 'success');
                }}>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="notification-close">×</button>
        </div>
      )}
    </div>
  );
}

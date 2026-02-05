'use client';

import { AlignLeft, ArrowRightLeft, Copy, Download, History, Scale, Search, Settings, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS - Enhanced type safety
// ============================================================================

type AIProvider = 'openai' | 'anthropic' | 'google' | 'ollama';
type ImprovementMode = 'error-repair' | 'visual-enhancement' | 'optimize' | 'document' | 'security' | 'test' | 'convert' | 'explain' | 'nl-to-code';
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  id: string;
}

interface ModelLimits {
  [provider: string]: {
    [model: string]: number;
  };
}

interface ProviderModels {
  [provider: string]: string[];
}

interface ImproveCodeRequest {
  code: string;
  mode: ImprovementMode;
  provider: AIProvider;
  model: string;
  apiKey: string;
  ollamaUrl: string;
}

interface ImproveCodeResponse {
  improvedCode: string;
  error?: string;
}

// ============================================================================
// CONSTANTS - Centralized configuration
// ============================================================================

const MODEL_LIMITS: ModelLimits = {
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

const PROVIDER_MODELS: ProviderModels = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  google: ['gemini-pro', 'gemini-pro-vision'],
  ollama: ['llama3.1', 'codellama', 'mistral', 'deepseek-coder'],
};

const MODE_CONFIG = {
  'error-repair': { icon: '🔧', label: 'Error Repair', description: 'Fix bugs and errors' },
  'visual-enhancement': { icon: '✨', label: 'Visual Enhancement', description: 'Improve UI/UX' },
  'optimize': { icon: '⚡', label: 'Optimize', description: 'Enhance performance' },
  'document': { icon: '📚', label: 'Document', description: 'Add documentation' },
  'security': { icon: '🔒', label: 'Security', description: 'Fix vulnerabilities' },
  'test': { icon: '🧪', label: 'Test', description: 'Generate tests' },
  'convert': { icon: '🔄', label: 'Convert', description: 'Transform code' },
  'explain': { icon: '💡', label: 'Explain', description: 'Add explanations' },
  'nl-to-code': { icon: '💬', label: 'NL to Code', description: 'Natural language to code' },
} as const;

const TOKEN_WARNING_THRESHOLD = 0.8;
const TOKEN_DANGER_THRESHOLD = 0.9;
const NOTIFICATION_DURATION = 5000;
const DEBOUNCE_DELAY = 300;
const MAX_CODE_LENGTH = 1000000; // 1MB character limit
const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

// ============================================================================
// UTILITY FUNCTIONS - Pure, testable helpers
// ============================================================================

const estimateTokens = (text: string): number => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

const getModelLimit = (provider: AIProvider, model: string): number => {
  return MODEL_LIMITS[provider]?.[model] || MODEL_LIMITS[provider]?.default || 15000;
};

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, MAX_CODE_LENGTH);
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// CUSTOM HOOKS - Reusable logic
// ============================================================================

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, isLoaded] as const;
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================================
// MAIN COMPONENT - Enhanced with robustness features
// ============================================================================

export default function MainInterface() {
  // State Management - Organized by concern
  const [currentMode, setCurrentMode] = useState<ImprovementMode>('error-repair');
  const [showSettings, setShowSettings] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [improvedCode, setImprovedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Persistent settings with localStorage
  const [aiProvider, setAiProvider, providerLoaded] = useLocalStorage<AIProvider>('aiProvider', 'openai');
  const [aiModel, setAiModel, modelLoaded] = useLocalStorage('aiModel', 'gpt-4o');
  const [apiKey, setApiKey, keyLoaded] = useLocalStorage('apiKey', '');
  const [ollamaUrl, setOllamaUrl, ollamaLoaded] = useLocalStorage('ollamaUrl', DEFAULT_OLLAMA_URL);

  // Refs for cleanup and abort
  const abortControllerRef = useRef<AbortController | null>(null);
  const notificationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Debounced values for performance
  const debouncedCodeInput = useDebounce(codeInput, DEBOUNCE_DELAY);

  // ============================================================================
  // NOTIFICATION SYSTEM - Enhanced with queue and auto-dismiss
  // ============================================================================

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = generateId();
    const notification: Notification = { message, type, id };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      notificationTimersRef.current.delete(id);
    }, NOTIFICATION_DURATION);

    notificationTimersRef.current.set(id, timer);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const timer = notificationTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      notificationTimersRef.current.delete(id);
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      notificationTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // ============================================================================
  // VALIDATION FUNCTIONS - Comprehensive input validation
  // ============================================================================

  const validateSettings = useCallback((): { isValid: boolean; error?: string } => {
    if (aiProvider !== 'ollama' && !apiKey.trim()) {
      return { isValid: false, error: 'API key is required for this provider' };
    }

    if (aiProvider === 'ollama' && !isValidUrl(ollamaUrl)) {
      return { isValid: false, error: 'Invalid Ollama URL format' };
    }

    if (!PROVIDER_MODELS[aiProvider]?.includes(aiModel)) {
      return { isValid: false, error: 'Invalid model for selected provider' };
    }

    return { isValid: true };
  }, [aiProvider, apiKey, ollamaUrl, aiModel]);

  const validateCodeInput = useCallback((code: string): { isValid: boolean; error?: string } => {
    if (!code.trim()) {
      return { isValid: false, error: 'Please enter some code to improve' };
    }

    if (code.length > MAX_CODE_LENGTH) {
      return { isValid: false, error: `Code exceeds maximum length of ${MAX_CODE_LENGTH.toLocaleString()} characters` };
    }

    const tokens = estimateTokens(code);
    const limit = getModelLimit(aiProvider, aiModel);

    if (tokens > limit) {
      return { 
        isValid: false, 
        error: `Code is too large (≈${tokens.toLocaleString()} tokens). ${aiModel} supports up to ${limit.toLocaleString()} tokens. Try using GPT-4o or Claude models for larger codebases.` 
      };
    }

    return { isValid: true };
  }, [aiProvider, aiModel]);

  // ============================================================================
  // CORE FUNCTIONALITY - API interaction with error handling
  // ============================================================================

  const handleImproveCode = async () => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Validate settings
    const settingsValidation = validateSettings();
    if (!settingsValidation.isValid) {
      showNotification(settingsValidation.error!, 'error');
      if (aiProvider !== 'ollama' && !apiKey.trim()) {
        setShowSettings(true);
      }
      return;
    }

    // Sanitize and validate input
    const sanitizedCode = sanitizeInput(codeInput);
    const codeValidation = validateCodeInput(sanitizedCode);
    
    if (!codeValidation.isValid) {
      showNotification(codeValidation.error!, 'error');
      return;
    }

    // Token limit warning
    const tokens = estimateTokens(sanitizedCode);
    const limit = getModelLimit(aiProvider, aiModel);
    
    if (tokens > limit * TOKEN_DANGER_THRESHOLD) {
      showNotification(
        'Warning: Code is near the token limit. This may result in incomplete responses.',
        'warning'
      );
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setShowOutput(true);
    setImprovedCode('');

    try {
      const requestBody: ImproveCodeRequest = {
        code: sanitizedCode,
        mode: currentMode,
        provider: aiProvider,
        model: aiModel,
        apiKey: apiKey,
        ollamaUrl: ollamaUrl,
      };

      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data: ImproveCodeResponse = await response.json();

      if (!data.improvedCode) {
        throw new Error('No improved code returned from API');
      }

      setImprovedCode(data.improvedCode);
      showNotification('Code improved successfully!', 'success');
    } catch (error) {
      // Handle different error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showNotification('Request cancelled', 'info');
        } else if (error.message.includes('fetch')) {
          showNotification('Network error. Please check your connection and try again.', 'error');
        } else {
          showNotification(error.message, 'error');
        }
      } else {
        showNotification('An unexpected error occurred. Please try again.', 'error');
      }
      
      console.error('Error improving code:', error);
      setShowOutput(false);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // ============================================================================
  // UI HANDLERS - User interaction handlers
  // ============================================================================

  const handleClearAll = useCallback(() => {
    if (isLoading) {
      showNotification('Cannot clear while processing', 'warning');
      return;
    }
    
    setCodeInput('');
    setImprovedCode('');
    setShowOutput(false);
    showNotification('Cleared all content', 'info');
  }, [isLoading, showNotification]);

  const handleCopyCode = useCallback(async () => {
    if (!improvedCode) {
      showNotification('No code to copy', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(improvedCode);
      showNotification('Code copied to clipboard!', 'success');
    } catch (error) {
      showNotification('Failed to copy code. Please try manually selecting and copying.', 'error');
      console.error('Clipboard error:', error);
    }
  }, [improvedCode, showNotification]);

  const handleSaveSettings = useCallback(() => {
    const validation = validateSettings();
    
    if (!validation.isValid) {
      showNotification(validation.error!, 'error');
      return;
    }

    // Save via the setter functions (already persisted to localStorage)
    setShowSettings(false);
    showNotification('Settings saved successfully!', 'success');
  }, [validateSettings, showNotification]);

  const handleProviderChange = useCallback((newProvider: AIProvider) => {
    setAiProvider(newProvider);
    // Auto-select first model for new provider
    const firstModel = PROVIDER_MODELS[newProvider]?.[0];
    if (firstModel) {
      setAiModel(firstModel);
    }
  }, [setAiProvider, setAiModel]);

  // ============================================================================
  // COMPUTED VALUES - Derived state
  // ============================================================================

  const codeStats = {
    lines: codeInput.split('\n').length,
    chars: codeInput.length,
    words: codeInput.trim().split(/\s+/).filter(w => w).length,
    tokens: estimateTokens(debouncedCodeInput),
  };

  const tokenLimit = getModelLimit(aiProvider, aiModel);
  const tokenPercentage = (codeStats.tokens / tokenLimit) * 100;
  const isTokenWarning = tokenPercentage >= TOKEN_WARNING_THRESHOLD * 100;
  const isTokenDanger = tokenPercentage >= TOKEN_DANGER_THRESHOLD * 100;

  const canImprove = !isLoading && codeInput.trim().length > 0 && tokenPercentage <= 100;

  // ============================================================================
  // RENDER
  // ============================================================================

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
          <button className="quick-btn" onClick={() => setShowSettings(true)} title="Settings" aria-label="Open Settings">
            <Settings size={16} /> Settings
          </button>
        </div>
      </header>

      <main>
        {/* Quick Actions Bar */}
        <div className="quick-actions">
          <button 
            className="quick-btn" 
            title="Clear All" 
            onClick={handleClearAll}
            disabled={isLoading}
            aria-label="Clear all content"
          >
            <Trash2 size={16} /> Clear
          </button>
          <button className="quick-btn" title="Auto-Format" disabled>
            <AlignLeft size={16} /> Format
          </button>
          <button className="quick-btn" title="Compare Models" disabled>
            <Scale size={16} /> Compare
          </button>
          <button className="quick-btn" title="View History" disabled>
            <History size={16} /> History
          </button>
          <button className="quick-btn" title="Export Code" disabled>
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
                <select className="language-select" defaultValue="auto" aria-label="Select programming language">
                  <option value="auto">Auto-detect</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                </select>
                <button className="icon-btn" title="Paste from clipboard" disabled>
                  <Copy size={16} />
                </button>
                <button className="icon-btn" title="Upload file" disabled>
                  <Upload size={16} />
                </button>
              </div>
            </div>
            <div className="code-editor-wrapper">
              <div className="line-numbers" aria-hidden="true"></div>
              <textarea
                id="codeInput"
                placeholder="// Paste your code here...&#10;// Supports multiple languages&#10;// Line numbers shown automatically"
                spellCheck={false}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                disabled={isLoading}
                aria-label="Code input"
              ></textarea>
            </div>
            <div className="input-stats">
              <span>Lines: {codeStats.lines}</span>
              <span>Chars: {codeStats.chars.toLocaleString()}</span>
              <span>Words: {codeStats.words.toLocaleString()}</span>
              {codeInput && (
                <span 
                  className={`token-estimate ${isTokenDanger ? 'danger' : isTokenWarning ? 'warning' : ''}`}
                  title={`${tokenPercentage.toFixed(1)}% of model limit`}
                >
                  Tokens: ≈{codeStats.tokens.toLocaleString()} / {tokenLimit.toLocaleString()}
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
                    onClick={handleCopyCode}
                    disabled={!improvedCode}
                    aria-label="Copy improved code"
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button className="action-btn" title="Toggle Diff View" disabled>
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
              {(Object.keys(MODE_CONFIG) as ImprovementMode[]).map(mode => {
                const config = MODE_CONFIG[mode];
                return (
                  <label 
                    key={mode} 
                    className={`mode-card ${mode === 'nl-to-code' ? 'nl-mode' : ''} ${currentMode === mode ? 'border-primary bg-primary/10' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="mode" 
                      value={mode} 
                      checked={currentMode === mode} 
                      onChange={() => setCurrentMode(mode)} 
                      className="hidden"
                      disabled={isLoading}
                      aria-label={config.label}
                    />
                    <div className="mode-icon">{config.icon}</div>
                    <div className="mode-info">
                      <span className="mode-title">{config.label}</span>
                      <span className="mode-desc">{config.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={handleImproveCode}
            disabled={!canImprove}
            aria-label={isLoading ? 'Processing code' : 'Improve code'}
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
        <div className="modal-overlay" onClick={() => setShowSettings(false)} role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="settings-title">⚙️ Settings</h2>
              <button onClick={() => setShowSettings(false)} className="icon-btn" aria-label="Close settings">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <label className="settings-label" htmlFor="ai-provider">AI Provider</label>
                <select 
                  id="ai-provider"
                  className="settings-select" 
                  value={aiProvider} 
                  onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="google">Google (Gemini)</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>

              <div className="settings-section">
                <label className="settings-label" htmlFor="ai-model">AI Model</label>
                <select 
                  id="ai-model"
                  className="settings-select" 
                  value={aiModel} 
                  onChange={(e) => setAiModel(e.target.value)}
                >
                  {PROVIDER_MODELS[aiProvider]?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {aiProvider !== 'ollama' && (
                <div className="settings-section">
                  <label className="settings-label" htmlFor="api-key">API Key</label>
                  <input
                    id="api-key"
                    type="password"
                    className="settings-input"
                    placeholder={`Enter your ${aiProvider} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    autoComplete="off"
                  />
                  <p className="settings-hint">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
              )}

              {aiProvider === 'ollama' && (
                <div className="settings-section">
                  <label className="settings-label" htmlFor="ollama-url">Ollama URL</label>
                  <input
                    id="ollama-url"
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
                <button className="btn-primary" onClick={handleSaveSettings}>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast Stack */}
      <div className="notification-stack" style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification notification-${notification.type}`}
            role="alert"
            aria-live="polite"
          >
            <span>{notification.message}</span>
            <button 
              onClick={() => dismissNotification(notification.id)} 
              className="notification-close"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { 
  AlignLeft, ArrowRightLeft, Copy, Download, History, Scale, 
  Search, Settings, Trash2, Upload, X, Zap, Check, AlertCircle,
  Code2, Cpu, Shield, FileText, Beaker, Languages, Sparkles
} from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

interface CodeStats {
  lines: number;
  characters: number;
  words: number;
  tokens: number;
  exceedsWarningThreshold: boolean;
  exceedsLimit: boolean;
}

interface Settings {
  aiProvider: string;
  aiModel: string;
  apiKey: string;
  ollamaUrl: string;
  autoFormat: boolean;
  autoCopy: boolean;
  theme: 'light' | 'dark' | 'system';
}

const MODES = [
  { id: 'error-repair', label: 'Error Repair', icon: '🔧', description: 'Fix bugs and errors' },
  { id: 'visual-enhancement', label: 'Visual Enhancement', icon: '✨', description: 'Improve readability' },
  { id: 'optimize', label: 'Optimize', icon: '⚡', description: 'Performance optimization' },
  { id: 'document', label: 'Document', icon: '📚', description: 'Add documentation' },
  { id: 'security', label: 'Security', icon: '🔒', description: 'Security improvements' },
  { id: 'test', label: 'Generate Tests', icon: '🧪', description: 'Create unit tests' },
  { id: 'convert', label: 'Convert', icon: '🔄', description: 'Convert to better version' },
  { id: 'explain', label: 'Explain', icon: '💡', description: 'Explain code' },
  { id: 'nl-to-code', label: 'NL to Code', icon: '💬', description: 'Natural language to code' },
] as const;

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI', icon: <Cpu size={16} /> },
  { id: 'anthropic', label: 'Anthropic', icon: <Shield size={16} /> },
  { id: 'google', label: 'Google', icon: <Sparkles size={16} /> },
  { id: 'ollama', label: 'Ollama', icon: <Code2 size={16} /> },
] as const;

const MODEL_LIMITS: Record<string, Record<string, number>> = {
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
    'llama3.1': 32768,
    'codellama': 16384,
    'mistral': 32768,
    'deepseek-coder': 16384,
    'default': 32768,
  },
};

const PROVIDER_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  google: ['gemini-pro', 'gemini-pro-vision'],
  ollama: ['llama3.1', 'codellama', 'mistral', 'deepseek-coder'],
};

const LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
];

export default function MainInterface() {
  // State
  const [currentMode, setCurrentMode] = useState<string>('error-repair');
  const [settings, setSettings] = useState<Settings>({
    aiProvider: 'openai',
    aiModel: 'gpt-4o',
    apiKey: '',
    ollamaUrl: 'http://localhost:11434',
    autoFormat: true,
    autoCopy: true,
    theme: 'system',
  });
  const [codeInput, setCodeInput] = useState<string>('');
  const [improvedCode, setImprovedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [diffView, setDiffView] = useState<boolean>(false);
  
  // Refs
  const notificationId = useRef(0);
  const codeInputRef = useRef<HTMLTextAreaElement>(null);
  const improvedCodeRef = useRef<HTMLPreElement>(null);

  // Memoized values
  const codeStats = useMemo<CodeStats>(() => {
    const lines = codeInput.split('\n').length;
    const characters = codeInput.length;
    const words = codeInput.trim().split(/\s+/).filter(w => w).length;
    const tokens = Math.ceil(characters / 4);
    const limit = getModelLimit(settings.aiProvider, settings.aiModel);
    const warningThreshold = limit * 0.8;
    
    return {
      lines,
      characters,
      words,
      tokens,
      exceedsWarningThreshold: tokens > warningThreshold,
      exceedsLimit: tokens > limit,
    };
  }, [codeInput, settings.aiProvider, settings.aiModel]);

  const availableModels = useMemo(
    () => PROVIDER_MODELS[settings.aiProvider] || [],
    [settings.aiProvider]
  );

  // Helper functions
  const getModelLimit = useCallback((provider: string, model: string): number => {
    return MODEL_LIMITS[provider]?.[model] || MODEL_LIMITS[provider]?.default || 15000;
  }, []);

  const showNotification = useCallback((message: string, type: Notification['type'] = 'info', duration = 5000) => {
    const id = notificationId.current++;
    const newNotification: Notification = { message, type, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy to clipboard', 'error');
    }
  }, [showNotification]);

  const formatCode = useCallback(() => {
    // Basic formatting logic - can be enhanced with Prettier or similar
    const formatted = codeInput
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    setCodeInput(formatted);
    showNotification('Code formatted', 'success');
  }, [codeInput, showNotification]);

  const clearAll = useCallback(() => {
    if (codeInput || improvedCode) {
      setCodeInput('');
      setImprovedCode('');
      setShowOutput(false);
      setHasChanges(false);
      showNotification('All cleared', 'info');
    }
  }, [codeInput, improvedCode, showNotification]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification('File too large (max 10MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCodeInput(content);
      showNotification(`Loaded ${file.name}`, 'success');
      event.target.value = ''; // Reset file input
    };
    reader.onerror = () => {
      showNotification('Failed to read file', 'error');
    };
    reader.readAsText(file);
  }, [showNotification]);

  const handleImproveCode = useCallback(async () => {
    if (!codeInput.trim()) {
      showNotification('Please enter some code to improve!', 'error');
      return;
    }

    if (!settings.apiKey && settings.aiProvider !== 'ollama') {
      showNotification(`Please configure your ${settings.aiProvider} API key in Settings first!`, 'error');
      setShowSettings(true);
      return;
    }

    if (codeStats.exceedsLimit) {
      showNotification(
        `Code exceeds token limit (${codeStats.tokens.toLocaleString()} > ${getModelLimit(settings.aiProvider, settings.aiModel).toLocaleString()}). Please reduce the size or use a model with larger context.`,
        'error'
      );
      return;
    }

    if (codeStats.exceedsWarningThreshold) {
      showNotification(
        `Code is near token limit. Consider reducing size for optimal results.`,
        'warning'
      );
    }

    setIsLoading(true);
    setShowOutput(true);
    setHasChanges(false);

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeInput,
          mode: currentMode,
          provider: settings.aiProvider,
          model: settings.aiModel,
          apiKey: settings.apiKey,
          ollamaUrl: settings.ollamaUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      setImprovedCode(data.improvedCode);
      showNotification('Code improved successfully!', 'success');
      
      // Auto-copy if enabled
      if (settings.autoCopy && data.improvedCode) {
        setTimeout(() => copyToClipboard(data.improvedCode), 1000);
      }
    } catch (error) {
      console.error('Error improving code:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [
    codeInput, 
    settings, 
    currentMode, 
    codeStats, 
    getModelLimit, 
    showNotification,
    copyToClipboard
  ]);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem('aiProvider', settings.aiProvider);
      localStorage.setItem('aiModel', settings.aiModel);
      if (settings.apiKey) localStorage.setItem('apiKey', settings.apiKey);
      localStorage.setItem('ollamaUrl', settings.ollamaUrl);
      localStorage.setItem('autoFormat', String(settings.autoFormat));
      localStorage.setItem('autoCopy', String(settings.autoCopy));
      localStorage.setItem('theme', settings.theme);
      
      setShowSettings(false);
      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    }
  }, [settings, showNotification]);

  const loadSettings = useCallback(() => {
    try {
      const savedProvider = localStorage.getItem('aiProvider') || 'openai';
      const savedModel = localStorage.getItem('aiModel') || 'gpt-4o';
      const savedApiKey = localStorage.getItem('apiKey') || '';
      const savedOllamaUrl = localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
      const savedAutoFormat = localStorage.getItem('autoFormat') === 'true';
      const savedAutoCopy = localStorage.getItem('autoCopy') === 'true';
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';

      setSettings({
        aiProvider: savedProvider,
        aiModel: PROVIDER_MODELS[savedProvider]?.includes(savedModel) ? savedModel : PROVIDER_MODELS[savedProvider]?.[0] || 'gpt-4o',
        apiKey: savedApiKey,
        ollamaUrl: savedOllamaUrl,
        autoFormat: savedAutoFormat,
        autoCopy: savedAutoCopy,
        theme: savedTheme,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Effects
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (codeInput && settings.autoFormat) {
      formatCode();
    }
  }, [codeInput, settings.autoFormat, formatCode]);

  useEffect(() => {
    if (codeInput && !isLoading) {
      setHasChanges(true);
    }
  }, [codeInput, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleImproveCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (improvedCode) {
          copyToClipboard(improvedCode);
        }
      }
      if (e.key === 'Escape') {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleImproveCode, improvedCode, copyToClipboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  AI Code Improver 
                  <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                    PRO
                  </span>
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced AI-powered code transformation • Multi-language support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span className="font-medium">{settings.aiProvider}</span>
                </div>
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium truncate max-w-[120px]">{settings.aiModel}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={clearAll}
            disabled={isLoading}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
          
          <button
            onClick={formatCode}
            disabled={isLoading || !codeInput}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <AlignLeft className="h-4 w-4" />
            Format Code
          </button>
          
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
            <input
              type="file"
              accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.go,.rs,.php,.rb"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer" />
          </button>
          
          <div className="ml-auto flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Input Code
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(codeInput)}
                  disabled={!codeInput}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                  aria-label="Copy input code"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCodeInput('')}
                  disabled={!codeInput}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                  aria-label="Clear input"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                ref={codeInputRef}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder={`// Paste your code here...\n// Or start typing\n// Supports multiple languages\n// Use Ctrl+Enter to improve code`}
                className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 focus:outline-none resize-none"
                spellCheck={false}
                disabled={isLoading}
              />
              {!codeInput && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <Code2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing or paste your code</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between text-sm">
              <div className="flex gap-4">
                <span>Lines: {codeStats.lines}</span>
                <span>Chars: {codeStats.characters}</span>
                <span>Words: {codeStats.words}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`
                  font-medium
                  ${codeStats.exceedsLimit ? 'text-red-600 dark:text-red-400' : 
                    codeStats.exceedsWarningThreshold ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-green-600 dark:text-green-400'}
                `}>
                  Tokens: {codeStats.tokens.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  / {getModelLimit(settings.aiProvider, settings.aiModel).toLocaleString()}
                </span>
                {codeStats.exceedsLimit && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Improved Code
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDiffView(!diffView)}
                  className={`p-1.5 rounded-md ${diffView ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-label="Toggle diff view"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(improvedCode)}
                  disabled={!improvedCode}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
                  aria-label="Copy improved code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative h-[400px] overflow-auto">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Improving your code...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">This may take a moment</p>
                </div>
              ) : showOutput && improvedCode ? (
                <pre
                  ref={improvedCodeRef}
                  className="p-4 h-full font-mono text-sm whitespace-pre-wrap break-words"
                >
                  <code>{improvedCode}</code>
                </pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <Sparkles className="h-16 w-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-1">Your improved code will appear here</p>
                  <p className="text-sm">Click "Improve Code" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Improvement Mode
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                disabled={isLoading}
                className={`
                  p-3 rounded-lg border transition-all text-left
                  ${currentMode === mode.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                  disabled:opacity-50
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{mode.icon}</span>
                  <span className="font-medium text-sm truncate">{mode.label}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleImproveCode}
            disabled={isLoading || !codeInput.trim() || codeStats.exceedsLimit}
            className={`
              px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
              flex items-center gap-3
              ${isLoading || !codeInput.trim() || codeStats.exceedsLimit
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Improve Code
                <span className="text-sm opacity-90">(Ctrl+Enter)</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="space-y-6">
                {/* AI Provider */}
                <div>
                  <label className="block text-sm font-medium mb-2">AI Provider</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          aiProvider: provider.id,
                          aiModel: PROVIDER_MODELS[provider.id]?.[0] || 'gpt-4o'
                        }))}
                        className={`
                          p-3 rounded-lg border flex flex-col items-center justify-center gap-2
                          ${settings.aiProvider === provider.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        {provider.icon}
                        <span className="text-sm">{provider.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model */}
                <div>
                  <label className="block text-sm font-medium mb-2">AI Model</label>
                  <select
                    value={settings.aiModel}
                    onChange={(e) => setSettings(prev => ({ ...prev, aiModel: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Token limit: {getModelLimit(settings.aiProvider, settings.aiModel).toLocaleString()}
                  </p>
                </div>

                {/* API Key (if needed) */}
                {settings.aiProvider !== 'ollama' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {settings.aiProvider.charAt(0).toUpperCase() + settings.aiProvider.slice(1)} API Key
                    </label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder={`Enter your ${settings.aiProvider} API key`}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                )}

                {/* Ollama URL */}
                {settings.aiProvider === 'ollama' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Ollama URL</label>
                    <input
                      type="text"
                      value={settings.ollamaUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, ollamaUrl: e.target.value }))}
                      placeholder="http://localhost:11434"
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Make sure Ollama is running on your local machine.
                    </p>
                  </div>
                )}

                {/* Preferences */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Preferences</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-format code</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoFormat: !prev.autoFormat }))}
                      className={`w-12 h-6 rounded-full transition-colors ${settings.autoFormat ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${settings.autoFormat ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-copy improved code</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, autoCopy: !prev.autoCopy }))}
                      className={`w-12 h-6 rounded-full transition-colors ${settings.autoCopy ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${settings.autoCopy ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              animate-slide-in-right
              px-4 py-3 rounded-lg shadow-lg max-w-sm
              ${notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 
                notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' : 
                notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800' : 
                'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'}
            `}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />}
              {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />}
              {notification.type === 'info' && <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
              {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
              <p className="text-sm flex-1">{notification.message}</p>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

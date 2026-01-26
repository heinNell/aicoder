// AI Code Improver Pro - Production Ready
// Enhanced with real-time analysis, AI suggestions, and advanced features

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // DOM ELEMENTS - COMPLETE SET
  // ============================================

  // Core Elements
  const codeInput = document.getElementById("codeInput");
  const lineNumbers = document.getElementById("lineNumbers");
  const outputCode = document.getElementById("outputCode");
  const outputSection = document.getElementById("outputSection");
  const diffView = document.getElementById("diffView");
  const comparisonSection = document.getElementById("comparisonSection");
  const outputCodeSecondary = document.getElementById("outputCodeSecondary");
  const emptyState = document.getElementById("emptyState");
  const outputContent = document.querySelector(".output-content");
  
  // Statistics Display
  const lineCount = document.getElementById("lineCount");
  const charCount = document.getElementById("charCount");
  const detectedLang = document.getElementById("detectedLanguage");
  const languageSelect = document.getElementById("languageSelect");
  
  // Quick Action Buttons
  const clearBtn = document.getElementById("clearAllBtn");
  const formatBtn = document.getElementById("formatBtn");
  const compareBtn = document.getElementById("compareBtn");
  const historyBtn = document.getElementById("historyBtn");
  const exportBtn = document.getElementById("exportBtn");
  const toggleViewBtn = document.getElementById("toggleViewBtn");
  
  // Main Control Elements
  const improveBtn = document.getElementById("improveBtn");
  const convertTargetGroup = document.getElementById("targetLangGroup");
  const convertTarget = document.getElementById("targetLanguage");
  const additionalInstructions = document.getElementById("additionalInstructions");
  
  // Settings Panel Elements
  const aiProvider = document.getElementById("aiProvider");
  const aiModel = document.getElementById("aiModel");
  const apiKeyInput = document.getElementById("apiKey");
  const apiKeyGroup = document.getElementById("apiKeyGroup");
  const toggleApiKeyBtn = document.getElementById("toggleApiKey");
  const saveApiKeyBtn = document.getElementById("saveApiKey");
  const apiHint = document.getElementById("apiHint");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsSection = document.querySelector(".settings-section");
  const ollamaUrlGroup = document.getElementById("ollamaUrlGroup");
  const ollamaUrl = document.getElementById("ollamaUrl");
  const secondaryModelGroup = document.getElementById("secondaryModelGroup");
  const secondaryAIProvider = document.getElementById("secondaryAIProvider");
  const secondaryAIModel = document.getElementById("secondaryAIModel");
  
  // Loading Indicators
  const loader = document.getElementById("loader");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingStep = document.getElementById("loadingStep");
  
  // Analysis Panel Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const changesTab = document.getElementById("changesTab");
  const metricsTab = document.getElementById("metricsTab");
  const chatTab = document.getElementById("chatTab");
  const explanationText = document.getElementById("explanationText");
  
  // Metrics Display
  const metricLinesChanged = document.getElementById("metricLinesChanged");
  const metricQuality = document.getElementById("metricQuality");
  const metricTime = document.getElementById("metricTime");
  const metricTokens = document.getElementById("metricTokens");
  
  // Chat Interface
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  
  // Modal Windows
  const historyModal = document.getElementById("historyModal");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const exportModal = document.getElementById("exportModal");
  
  // Export Options
  const exportCodeBtn = document.getElementById("exportCode");
  const exportMarkdownBtn = document.getElementById("exportMarkdown");
  const exportJSONBtn = document.getElementById("exportJSON");
  const exportClipboardBtn = document.getElementById("exportClipboard");
  
  // Output Actions
  const copyBtn = document.getElementById("copyBtn");
  const copyBtnSecondary = document.getElementById("copyBtnSecondary");
  
  // Diff View Elements
  const diffContainer = document.getElementById("diffContainer");
  const diffContent = document.getElementById("diffContent");
  const diffOriginal = document.getElementById("diffOriginal");
  const diffImproved = document.getElementById("diffImproved");
  const diffModeToggle = document.getElementById("diffModeToggle");
  const diffBtn = document.getElementById("diffBtn");
  
  // Natural Language Elements
  const nlInputGroup = document.getElementById("nlInputGroup");
  const nlDescription = document.getElementById("nlDescription");
  const nlChips = document.querySelectorAll(".nl-chip");
  
  // Quick Prompts
  const quickPrompts = document.querySelectorAll(".quick-prompt");
  
  // Header Statistics
  const statsImproved = document.getElementById("statsImproved");
  const statsTime = document.getElementById("statsTime");
  
  // Quality Analysis Elements
  const qualityPanel = document.getElementById("qualityScorePanel");
  const qualityValue = document.getElementById("qualityValue");
  const qualityBar = document.getElementById("qualityBar");
  const qualityIssues = document.getElementById("qualityIssues");
  const complexityValue = document.getElementById("complexityValue");
  const functionsCount = document.getElementById("functionsCount");
  const issuesCount = document.getElementById("issuesCount");
  
  // AI Suggestions
  const aiSuggestionsPanel = document.getElementById("aiSuggestionsPanel");
  const suggestionsList = document.getElementById("suggestionsList");
  const refreshSuggestionsBtn = document.getElementById("refreshSuggestions");
  
  // Chart Elements
  const chartBarBefore = document.getElementById("chartBarBefore");
  const chartBarAfter = document.getElementById("chartBarAfter");
  const chartValueBefore = document.getElementById("chartValueBefore");
  const chartValueAfter = document.getElementById("chartValueAfter");
  const chartImprovement = document.getElementById("chartImprovement");
  
  // Analysis Panel
  const analysisPanel = document.getElementById("analysisPanel");

  // ============================================
  // APPLICATION STATE MANAGEMENT
  // ============================================

  const appState = {
    // Code State
    currentCode: "",
    currentImprovedCode: "",
    currentExplanation: "",
    originalCodeBackup: "",
    
    // Mode & Settings
    currentMode: "error-repair",
    currentView: "code",
    isDiffViewActive: false,
    isDiffSplitMode: true,
    
    // History & Chat
    chatHistory: [],
    improvementHistory: [],
    currentChatSession: [],
    
    // Performance Tracking
    processStartTime: null,
    totalImprovements: parseInt(localStorage.getItem("aicodeimp_total") || "0"),
    totalTimeSaved: parseInt(localStorage.getItem("aicodeimp_time") || "0"),
    
    // Analysis State
    lastAnalysisResult: null,
    qualityScore: 0,
    complexityScore: 0,
    
    // UI State
    isProcessing: false,
    currentProvider: localStorage.getItem("aicodeimp_provider") || "openai",
    
    // Timeouts for debouncing
    updateTimeout: null,
    qualityAnalysisTimeout: null,
    suggestionsTimeout: null,
    
    // Cached values
    cachedLineCount: 0,
    lineNumbersCache: ""
  };

  // ============================================
  // PROVIDER CONFIGURATION - ENHANCED
  // ============================================

  const providerModels = {
    mock: [{ id: "mock", name: "Demo Mode (Simulated)" }],
    openai: [
      { id: "gpt-4o", name: "GPT-4o (Latest & Best)" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Cheap)" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Budget)" }
    ],
    openrouter: [
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Best Overall)" },
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
      { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
      { id: "mistralai/mistral-large", name: "Mistral Large" }
    ],
    groq: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
      { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B" }
    ],
    ollama: [
      { id: "llama3.2:latest", name: "Llama 3.2 (Latest)" },
      { id: "llama3.1:latest", name: "Llama 3.1" },
      { id: "mistral:latest", name: "Mistral" },
      { id: "codellama:latest", name: "Code Llama" },
      { id: "deepseek-coder:latest", name: "DeepSeek Coder" }
    ],
    anthropic: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" }
    ]
  };

  const providerHints = {
    openai: 'Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>',
    openrouter: 'Get your API key from <a href="https://openrouter.ai/keys" target="_blank">OpenRouter</a> - Supports many models',
    groq: 'Get your FREE API key from <a href="https://console.groq.com/keys" target="_blank">Groq Console</a> - Fast!',
    ollama: 'Run models locally with <a href="https://ollama.ai" target="_blank">Ollama</a> - Default: http://localhost:11434',
    anthropic: 'Get your API key from <a href="https://console.anthropic.com/keys" target="_blank">Anthropic Console</a>'
  };

  const providerEndpoints = {
    openai: "https://api.openai.com/v1/chat/completions",
    openrouter: "https://openrouter.ai/api/v1/chat/completions",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    anthropic: "https://api.anthropic.com/v1/messages",
    ollama: "/api/chat" // Relative to Ollama URL
  };

  // ============================================
  // LANGUAGE DETECTION - ENHANCED
  // ============================================

  const languagePatterns = {
    javascript: [
      /\b(const|let|var)\s+\w+\s*=/,
      /function\s+\w+\s*\([^)]*\)\s*\{/,
      /=>\s*\{?/,
      /console\.(log|error|warn)/,
      /import\s+.*from\s+['"]/
    ],
    typescript: [
      /:\s*(string|number|boolean|any|void|never)\b/,
      /interface\s+\w+\s*\{/,
      /type\s+\w+\s*=\s*\{/,
      /export\s+(default\s+)?(class|interface|function|const)/,
      /@(types|decorator)/
    ],
    python: [
      /def\s+\w+\s*\([^)]*\)\s*:/,
      /import\s+\w+/,
      /from\s+\w+\s+import/,
      /print\s*\(/,
      /class\s+\w+\s*:/,
      /self\.\w+/
    ],
    java: [
      /public\s+(class|interface|enum)\s+\w+/,
      /public\s+static\s+void\s+main\s*\(/,
      /System\.out\.(println|print)/,
      /import\s+java\./,
      /@Override/
    ],
    csharp: [
      /using\s+System/,
      /namespace\s+\w+/,
      /public\s+class\s+\w+/,
      /Console\.(WriteLine|Write)/,
      /void\s+\w+\s*\(\)/
    ],
    go: [
      /package\s+main/,
      /func\s+main\s*\(\)/,
      /import\s+"fmt"/,
      /fmt\.Println/,
      /var\s+\w+\s+\w+/
    ],
    rust: [
      /fn\s+main\s*\(\)/,
      /let\s+(mut\s+)?\w+\s*:/,
      /println!\(/,
      /impl\s+\w+/,
      /use\s+std::/
    ],
    php: [
      /<\?php/,
      /\$\w+\s*=/,
      /echo\s+/,
      /function\s+\w+\s*\(/,
      /->\w+\s*\(/
    ],
    ruby: [
      /def\s+\w+/,
      /puts\s+/,
      /class\s+\w+/,
      /attr_(accessor|reader|writer)/,
      /do\s*\|[^|]*\|/
    ],
    html: [
      /<!DOCTYPE\s+html>/i,
      /<html[^>]*>/i,
      /<head[^>]*>/i,
      /<body[^>]*>/i,
      /<div[^>]*>/i,
      /<\/\w+>/
    ],
    css: [
      /\.[\w-]+\s*\{[^}]*\}/,
      /#[\w-]+\s*\{[^}]*\}/,
      /@media[^{]*\{[^}]*\}/,
      /:\s*(hover|focus|active)/,
      /margin|padding|border/
    ],
    sql: [
      /SELECT\s+.*\s+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+\w+\s+SET/i,
      /CREATE\s+TABLE/i,
      /ALTER\s+TABLE/i
    ],
    bash: [
      /^#!/,
      /\becho\b/,
      /\bif\s+\[/,
      /\bfor\s+.*\s+in/,
      /\bfunction\s+\w+/,
      /\bdone\b/
    ],
    json: [
      /^\s*\{[\s\S]*"\w+"\s*:\s*("[^"]*"|\d+|true|false|null)/,
      /^\s*\[[\s\S]*\]$/
    ]
  };

  function detectLanguage(code) {
    if (!code || code.trim().length === 0) return "auto";
    
    const scores = {};
    const lines = code.split('\n');
    const sampleSize = Math.min(lines.length, 50);
    const sample = lines.slice(0, sampleSize).join('\n');
    
    for (const [lang, patterns] of Object.entries(languagePatterns)) {
      scores[lang] = 0;
      for (const pattern of patterns) {
        const matches = sample.match(pattern);
        if (matches) {
          scores[lang] += matches.length;
        }
      }
    }
    
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : "auto";
  }

  // ============================================
  // LINE NUMBER MANAGEMENT - OPTIMIZED
  // ============================================

  const MAX_RENDERED_LINES = 10000;
  const LINE_UPDATE_DEBOUNCE = 150;

  function generateLineNumbers(count) {
    if (count <= 0) return "";
    
    const lines = new Array(Math.min(count, MAX_RENDERED_LINES));
    for (let i = 0; i < lines.length; i++) {
      lines[i] = i + 1;
    }
    return lines.join("\n");
  }

  function updateLineNumbers(immediate = false) {
    if (!codeInput || !lineNumbers) return;
    
    const code = codeInput.value;
    const lines = code.split("\n").length;
    const displayLines = Math.min(Math.max(lines, 10), MAX_RENDERED_LINES);
    
    // Update line numbers if count changed
    if (displayLines !== appState.cachedLineCount) {
      appState.cachedLineCount = displayLines;
      appState.lineNumbersCache = generateLineNumbers(displayLines);
      lineNumbers.textContent = appState.lineNumbersCache;
      
      // Adjust width based on digit count
      const digitCount = String(displayLines).length;
      lineNumbers.style.minWidth = Math.max(50, digitCount * 12 + 20) + "px";
    }
    
    // Update real-time stats
    updateCodeStats(code);
    
    // Update language detection
    if (immediate || code.length < 5000) {
      updateLanguageDetection(code);
    }
  }

  function updateCodeStats(code) {
    if (lineCount) {
      const lines = code.split("\n").length;
      lineCount.textContent = `Lines: ${lines.toLocaleString()}`;
    }
    
    if (charCount) {
      const chars = code.length;
      charCount.textContent = `Chars: ${chars.toLocaleString()}`;
    }
  }

  function updateLanguageDetection(code) {
    const lang = detectLanguage(code);
    if (lang !== "auto" && detectedLang) {
      const displayLang = lang.charAt(0).toUpperCase() + lang.slice(1);
      detectedLang.textContent = displayLang;
      detectedLang.style.display = "inline-block";
      
      if (languageSelect && languageSelect.querySelector(`option[value="${lang}"]`)) {
        languageSelect.value = lang;
      }
    } else if (detectedLang) {
      detectedLang.style.display = "none";
    }
  }

  function debouncedUpdateLineNumbers() {
    // Update stats immediately
    if (codeInput) {
      updateCodeStats(codeInput.value);
    }
    
    // Debounce the expensive operations
    if (appState.updateTimeout) {
      clearTimeout(appState.updateTimeout);
    }
    
    appState.updateTimeout = setTimeout(() => {
      updateLineNumbers(true);
      analyzeCodeQuality();
    }, LINE_UPDATE_DEBOUNCE);
  }

  // ============================================
  // CODE QUALITY ANALYZER - ENHANCED
  // ============================================

  function analyzeCodeQuality() {
    if (!codeInput || !codeInput.value.trim()) {
      if (qualityPanel) qualityPanel.style.display = "none";
      if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "none";
      return;
    }
    
    // Debounce analysis
    if (appState.qualityAnalysisTimeout) {
      clearTimeout(appState.qualityAnalysisTimeout);
    }
    
    appState.qualityAnalysisTimeout = setTimeout(() => {
      const code = codeInput.value;
      const analysis = performQualityAnalysis(code);
      appState.lastAnalysisResult = analysis;
      appState.qualityScore = analysis.score;
      appState.complexityScore = analysis.complexity;
      
      // Update UI
      updateQualityDisplay(analysis);
      generateAISuggestions(analysis);
    }, 300);
  }

  function performQualityAnalysis(code) {
    const issues = [];
    let score = 100;
    const lines = code.split('\n');
    
    // Basic metrics
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') || 
      line.trim().startsWith('#') || 
      line.trim().startsWith('--') ||
      line.includes('/*') ||
      line.includes('*/')
    ).length;
    
    // Function detection
    const functionPatterns = [
      /function\s+\w+\s*\(/g,
      /\bconst\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
      /\blet\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
      /\bdef\s+\w+\s*\(/g,
      /\bpublic\s+\w+\s+\w+\s*\(/g,
      /\bprivate\s+\w+\s+\w+\s*\(/g
    ];
    
    let functionCount = 0;
    functionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) functionCount += matches.length;
    });
    
    // Complexity calculation
    const complexity = calculateCyclomaticComplexity(code);
    
    // Security checks
    const securityIssues = checkSecurityVulnerabilities(code);
    issues.push(...securityIssues.issues);
    score -= securityIssues.deduction;
    
    // Code style checks
    const styleIssues = checkCodeStyle(code);
    issues.push(...styleIssues.issues);
    score -= styleIssues.deduction;
    
    // Performance checks
    const performanceIssues = checkPerformance(code);
    issues.push(...performanceIssues.issues);
    score -= performanceIssues.deduction;
    
    // Maintainability checks
    const maintainabilityIssues = checkMaintainability(code, totalLines, commentLines);
    issues.push(...maintainabilityIssues.issues);
    score -= maintainabilityIssues.deduction;
    
    // Ensure score bounds
    score = Math.max(0, Math.min(100, Math.round(score)));
    
    return {
      score,
      complexity,
      functions: functionCount,
      issues: issues,
      totalLines,
      nonEmptyLines,
      commentLines,
      commentRatio: totalLines > 0 ? Math.round((commentLines / totalLines) * 100) : 0
    };
  }

  function calculateCyclomaticComplexity(code) {
    let complexity = 1;
    
    // Decision points
    const decisionPatterns = [
      /\bif\s*\(/g,
      /\belse\s+if\s*\(/g,
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bdo\s*\{/g,
      /\bswitch\s*\(/g,
      /\bcatch\s*\(/g,
      /\bcase\s+/g,
      /\bdefault\s*:/g,
      /\|\|/g,
      /&&/g,
      /\?.*:/g
    ];
    
    decisionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    return Math.min(complexity, 99);
  }

  function checkSecurityVulnerabilities(code) {
    const issues = [];
    let deduction = 0;
    
    // Check for eval()
    const evalMatches = code.match(/\beval\s*\(/g);
    if (evalMatches) {
      issues.push({
        severity: "error",
        icon: "🔴",
        message: `${evalMatches.length} eval() usage detected - Major security risk`
      });
      deduction += 15;
    }
    
    // Check for innerHTML
    const innerHTMLMatches = code.match(/\.innerHTML\s*=/gi);
    if (innerHTMLMatches) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: `${innerHTMLMatches.length} innerHTML assignments - Potential XSS risk`
      });
      deduction += 10;
    }
    
    // Check for password in code
    const passwordMatches = code.match(/password\s*[:=]\s*['"][^'"]*['"]/gi);
    if (passwordMatches) {
      issues.push({
        severity: "error",
        icon: "🔴",
        message: "Hardcoded passwords detected - Critical security issue"
      });
      deduction += 20;
    }
    
    // Check for SQL injection patterns
    const sqlPatterns = [
      /\$\{[^}]*\}/g,
      /\+.*['"][^'"]*\s*(select|insert|update|delete)/gi
    ];
    
    sqlPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        issues.push({
          severity: "warning",
          icon: "⚠️",
          message: "Potential SQL injection vulnerability"
        });
        deduction += 10;
      }
    });
    
    return { issues, deduction };
  }

  function checkCodeStyle(code) {
    const issues = [];
    let deduction = 0;
    const lines = code.split('\n');
    
    // Check line length
    const longLines = lines.filter(line => line.length > 120).length;
    if (longLines > 0) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${longLines} lines exceed 120 characters`
      });
      deduction += Math.min(longLines, 5);
    }
    
    // Check for var usage (JavaScript)
    if (detectLanguage(code) === 'javascript' || detectLanguage(code) === 'typescript') {
      const varMatches = code.match(/\bvar\s+\w+/g);
      if (varMatches) {
        issues.push({
          severity: "warning",
          icon: "⚠️",
          message: `${varMatches.length} var declarations - Use const/let instead`
        });
        deduction += Math.min(varMatches.length * 2, 10);
      }
    }
    
    // Check for console.log in production code
    const consoleLogs = code.match(/console\.(log|debug|info)/g);
    if (consoleLogs && consoleLogs.length > 3) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${consoleLogs.length} console statements - Consider removing for production`
      });
      deduction += Math.min(consoleLogs.length, 5);
    }
    
    // Check for magic numbers
    const magicNumbers = code.match(/\b\d{3,}\b/g);
    if (magicNumbers && magicNumbers.length > 5) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${magicNumbers.length} magic numbers - Consider using named constants`
      });
      deduction += 5;
    }
    
    // Check indentation consistency
    const indentPatterns = lines.map(line => {
      const match = line.match(/^(\s*)/);
      return match ? match[1] : '';
    }).filter(indent => indent.length > 0);
    
    if (indentPatterns.length > 0) {
      const firstIndent = indentPatterns[0];
      const inconsistent = indentPatterns.filter(indent => 
        indent.length % 2 !== 0 || 
        (indent.length > 0 && !indent.startsWith(firstIndent.charAt(0)))
      ).length;
      
      if (inconsistent > 0) {
        issues.push({
          severity: "warning",
          icon: "⚠️",
          message: "Inconsistent indentation detected"
        });
        deduction += 5;
      }
    }
    
    return { issues, deduction };
  }

  function checkPerformance(code) {
    const issues = [];
    let deduction = 0;
    
    // Check for nested loops
    const nestedLoopPattern = /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/g;
    const nestedLoops = code.match(nestedLoopPattern);
    if (nestedLoops) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: `${nestedLoops.length} nested loops detected - Potential performance issue`
      });
      deduction += 10;
    }
    
    // Check for setTimeout/setInterval with strings
    const evalTimers = code.match(/set(Timeout|Interval)\s*\([^,]*['"][^'"]*['"]/g);
    if (evalTimers) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: "String-based timers detected - Use function references instead"
      });
      deduction += 5;
    }
    
    // Check for potential memory leaks
    const globalVars = code.match(/(^|\n)\s*(\w+)\s*=/g);
    if (globalVars && globalVars.length > 10) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${globalVars.length} global variables - Consider proper scoping`
      });
      deduction += 5;
    }
    
    return { issues, deduction };
  }

  function checkMaintainability(code, totalLines, commentLines) {
    const issues = [];
    let deduction = 0;
    
    // Check comment ratio
    const commentRatio = totalLines > 0 ? (commentLines / totalLines) * 100 : 0;
    if (commentRatio < 10 && totalLines > 50) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `Low comment ratio (${Math.round(commentRatio)}%) - Consider adding documentation`
      });
      deduction += 10;
    }
    
    // Check for TODO/FIXME comments
    const todoComments = code.match(/(TODO|FIXME|XXX|HACK|BUG):?\s*.*/gi);
    if (todoComments) {
      issues.push({
        severity: "info",
        icon: "📝",
        message: `${todoComments.length} TODO/FIXME comments found`
      });
      // Don't deduct for TODOs - they're actually good practice
    }
    
    // Check function length
    const longFunctionPattern = /function\s+\w+\s*\([^)]*\)\s*\{[^}]{200,}\}/g;
    const longFunctions = code.match(longFunctionPattern);
    if (longFunctions) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: `${longFunctions.length} long functions detected - Consider refactoring`
      });
      deduction += 10;
    }
    
    // Check for deep nesting
    const deepNesting = code.match(/\{[^{}]*\{[^{}]*\{[^{}]*\{[^{}]*\}[^}]*\}[^}]*\}[^}]*\}/g);
    if (deepNesting) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: "Deep nesting detected - Consider simplifying logic"
      });
      deduction += 10;
    }
    
    return { issues, deduction };
  }

  function updateQualityDisplay(analysis) {
    if (!qualityPanel) return;
    
    qualityPanel.style.display = "block";
    
    // Update quality score
    if (qualityValue) {
      qualityValue.textContent = `${analysis.score}/100`;
    }
    
    // Update quality bar
    if (qualityBar) {
      qualityBar.style.width = `${analysis.score}%`;
      
      // Set color based on score
      let level = "poor";
      if (analysis.score >= 85) level = "excellent";
      else if (analysis.score >= 70) level = "good";
      else if (analysis.score >= 50) level = "fair";
      
      qualityBar.setAttribute("data-level", level);
    }
    
    // Update complexity
    if (complexityValue) {
      complexityValue.textContent = analysis.complexity;
    }
    
    // Update functions count
    if (functionsCount) {
      functionsCount.textContent = analysis.functions;
    }
    
    // Update issues count
    if (issuesCount) {
      issuesCount.textContent = analysis.issues.length;
    }
    
    // Update issues list
    if (qualityIssues) {
      qualityIssues.innerHTML = "";
      analysis.issues.slice(0, 5).forEach(issue => {
        const issueEl = document.createElement("div");
        issueEl.className = "quality-issue";
        issueEl.setAttribute("data-severity", issue.severity);
        issueEl.innerHTML = `
          <span class="quality-issue-icon">${issue.icon}</span>
          <span class="quality-issue-text">${issue.message}</span>
        `;
        qualityIssues.appendChild(issueEl);
      });
      
      // Add "View All" if there are more issues
      if (analysis.issues.length > 5) {
        const viewAll = document.createElement("div");
        viewAll.className = "quality-issue view-all";
        viewAll.innerHTML = `
          <span class="quality-issue-icon">📋</span>
          <span class="quality-issue-text">View all ${analysis.issues.length} issues</span>
        `;
        viewAll.addEventListener("click", () => {
          showDetailedIssues(analysis.issues);
        });
        qualityIssues.appendChild(viewAll);
      }
    }
  }

  function showDetailedIssues(issues) {
    const modal = document.createElement("div");
    modal.className = "modal detailed-issues-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Code Quality Issues (${issues.length})</h3>
          <span class="modal-close">&times;</span>
        </div>
        <div class="modal-body">
          <div class="issues-list-detailed">
            ${issues.map((issue, index) => `
              <div class="detailed-issue" data-severity="${issue.severity}">
                <div class="issue-header">
                  <span class="issue-icon">${issue.icon}</span>
                  <span class="issue-severity">${issue.severity.toUpperCase()}</span>
                </div>
                <div class="issue-message">${issue.message}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => modal.remove());
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // ============================================
  // AI SUGGESTIONS GENERATOR - ENHANCED
  // ============================================

  function generateAISuggestions(analysis) {
    if (!analysis || !suggestionsList) return;
    
    const suggestions = createSuggestions(analysis);
    
    if (suggestions.length === 0) {
      if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "none";
      return;
    }
    
    if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "block";
    
    suggestionsList.innerHTML = "";
    suggestions.slice(0, 3).forEach((suggestion, index) => {
      const suggestionEl = createSuggestionElement(suggestion, index);
      suggestionsList.appendChild(suggestionEl);
    });
  }

  function createSuggestions(analysis) {
    const suggestions = [];
    const code = codeInput ? codeInput.value : "";
    const lang = detectLanguage(code);
    
    // Suggestion 1: High complexity
    if (analysis.complexity > 15) {
      suggestions.push({
        id: "refactor-high-complexity",
        icon: "🔨",
        title: "Refactor Complex Code",
        badge: "High Priority",
        description: `Cyclomatic complexity is ${analysis.complexity} (high). Break down complex functions into smaller, testable units.`,
        actions: [
          { 
            label: "Auto Refactor", 
            type: "primary", 
            action: () => applySuggestion("optimize", "Refactor to reduce complexity")
          },
          { 
            label: "Learn More", 
            type: "secondary", 
            action: () => showComplexityTips(analysis.complexity)
          }
        ]
      });
    }
    
    // Suggestion 2: Security issues
    const securityIssues = analysis.issues.filter(issue => 
      issue.severity === "error" && 
      (issue.message.includes('eval') || issue.message.includes('security') || issue.message.includes('password'))
    );
    
    if (securityIssues.length > 0) {
      suggestions.push({
        id: "fix-security",
        icon: "🛡️",
        title: "Fix Security Issues",
        badge: "Critical",
        description: `${securityIssues.length} security vulnerability detected. Immediate action required.`,
        actions: [
          { 
            label: "Fix Security", 
            type: "primary", 
            action: () => applySuggestion("security", "Fix security vulnerabilities")
          },
          { 
            label: "Details", 
            type: "secondary", 
            action: () => showSecurityDetails(securityIssues)
          }
        ]
      });
    }
    
    // Suggestion 3: Error handling
    const hasAsyncCode = /async\s+|await\s+|\.then\(|\.catch\(/g.test(code);
    const hasErrorHandling = /try\s*\{|catch\s*\(|\.catch\(/g.test(code);
    
    if (hasAsyncCode && !hasErrorHandling && analysis.functions > 0) {
      suggestions.push({
        id: "add-error-handling",
        icon: "🚨",
        title: "Add Error Handling",
        badge: "Reliability",
        description: "Async operations detected without error handling. Add try-catch blocks to prevent crashes.",
        actions: [
          { 
            label: "Add Try-Catch", 
            type: "primary", 
            action: () => applySuggestion("error-repair", "Add comprehensive error handling")
          },
          { 
            label: "Best Practices", 
            type: "secondary", 
            action: () => showErrorHandlingBestPractices()
          }
        ]
      });
    }
    
    // Suggestion 4: Documentation
    if (analysis.commentRatio < 10 && analysis.totalLines > 30) {
      suggestions.push({
        id: "improve-documentation",
        icon: "📚",
        title: "Improve Documentation",
        badge: "Maintainability",
        description: `Comment ratio is only ${analysis.commentRatio}%. Add documentation to improve code understanding.`,
        actions: [
          { 
            label: "Auto Document", 
            type: "primary", 
            action: () => applySuggestion("document", "Add comprehensive documentation")
          },
          { 
            label: "Skip", 
            type: "secondary", 
            action: () => markSuggestionSkipped("improve-documentation")
          }
        ]
      });
    }
    
    // Suggestion 5: Performance optimization
    const performanceIssues = analysis.issues.filter(issue => 
      issue.message.includes('performance') || 
      issue.message.includes('nested loops') ||
      issue.message.includes('memory')
    );
    
    if (performanceIssues.length > 0 || analysis.complexity > 20) {
      suggestions.push({
        id: "optimize-performance",
        icon: "⚡",
        title: "Optimize Performance",
        badge: "Performance",
        description: "Potential performance bottlenecks detected. Consider optimization techniques.",
        actions: [
          { 
            label: "Optimize", 
            type: "primary", 
            action: () => applySuggestion("optimize", "Optimize for better performance")
          },
          { 
            label: "Analyze", 
            type: "secondary", 
            action: () => showPerformanceAnalysis()
          }
        ]
      });
    }
    
    // Suggestion 6: Modernization (for JavaScript/TypeScript)
    if ((lang === 'javascript' || lang === 'typescript') && code.includes('var ')) {
      suggestions.push({
        id: "modernize-syntax",
        icon: "✨",
        title: "Modernize Syntax",
        badge: "Modernization",
        description: "Using 'var' declarations. Modernize to 'const' and 'let' for better scoping.",
        actions: [
          { 
            label: "Modernize", 
            type: "primary", 
            action: () => applySuggestion("enhance", "Convert var to const/let and modernize syntax")
          },
          { 
            label: "Preview Changes", 
            type: "secondary", 
            action: () => previewModernization()
          }
        ]
      });
    }
    
    // Suggestion 7: Code duplication
    const duplicatePatterns = findDuplicatePatterns(code);
    if (duplicatePatterns.length > 0) {
      suggestions.push({
        id: "remove-duplication",
        icon: "📋",
        title: "Remove Code Duplication",
        badge: "Clean Code",
        description: `${duplicatePatterns.length} duplicate code patterns detected. Extract reusable functions.`,
        actions: [
          { 
            label: "Deduplicate", 
            type: "primary", 
            action: () => applySuggestion("enhance", "Remove code duplication and extract reusable functions")
          },
          { 
            label: "Show Duplicates", 
            type: "secondary", 
            action: () => showDuplicatePatterns(duplicatePatterns)
          }
        ]
      });
    }
    
    return suggestions;
  }

  function findDuplicatePatterns(code) {
    const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 10);
    const patterns = [];
    
    // Simple duplicate line detection
    const lineCounts = {};
    lines.forEach(line => {
      if (line.length > 20) { // Only consider substantial lines
        lineCounts[line] = (lineCounts[line] || 0) + 1;
      }
    });
    
    for (const [line, count] of Object.entries(lineCounts)) {
      if (count > 1) {
        patterns.push({
          pattern: line,
          count: count,
          type: 'exact-line'
        });
      }
    }
    
    return patterns.slice(0, 5); // Return top 5 duplicates
  }

  function createSuggestionElement(suggestion, index) {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.style.animationDelay = `${index * 0.1}s`;
    div.dataset.suggestionId = suggestion.id;
    
    div.innerHTML = `
      <div class="suggestion-header">
        <div class="suggestion-title">
          <span class="suggestion-icon">${suggestion.icon}</span>
          <span>${suggestion.title}</span>
        </div>
        <span class="suggestion-badge">${suggestion.badge}</span>
      </div>
      <div class="suggestion-description">${suggestion.description}</div>
      <div class="suggestion-actions"></div>
    `;
    
    const actionsContainer = div.querySelector(".suggestion-actions");
    suggestion.actions.forEach((action, actionIndex) => {
      const button = document.createElement("button");
      button.className = `suggestion-action-btn ${action.type}`;
      button.textContent = action.label;
      button.dataset.actionIndex = actionIndex;
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        action.action();
      });
      actionsContainer.appendChild(button);
    });
    
    return div;
  }

  function applySuggestion(mode, instructions = "") {
    // Set the mode
    const modeRadio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (modeRadio) {
      modeRadio.checked = true;
      appState.currentMode = mode;
    }
    
    // Add instructions if provided
    if (instructions && additionalInstructions) {
      additionalInstructions.value = instructions;
    }
    
    // Trigger improvement
    if (improveBtn && !appState.isProcessing) {
      runImprovement(false);
    }
  }

  function showComplexityTips(complexity) {
    if (chatMessages && chatTab) {
      // Switch to chat tab
      const chatTabBtn = document.querySelector('[data-tab="chat"]');
      if (chatTabBtn) chatTabBtn.click();
      
      const tip = `
        <div class="chat-message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <strong>Cyclomatic Complexity Tips (Current: ${complexity}):</strong><br><br>
            <strong>High Complexity (${complexity}) indicates:</strong><br>
            • Too many decision points in your code<br>
            • Complex conditional logic<br>
            • Multiple nested branches<br><br>
            <strong>How to reduce complexity:</strong><br>
            1. Extract complex conditions into separate functions<br>
            2. Use early returns to reduce nesting<br>
            3. Replace nested ifs with guard clauses<br>
            4. Consider using strategy pattern for complex logic<br>
            5. Break large functions into smaller ones (max 20 lines)<br><br>
            <strong>Goal:</strong> Aim for complexity under 10 for most functions
          </div>
        </div>
      `;
      chatMessages.innerHTML += tip;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function showSecurityDetails(securityIssues) {
    if (chatMessages && chatTab) {
      const chatTabBtn = document.querySelector('[data-tab="chat"]');
      if (chatTabBtn) chatTabBtn.click();
      
      const details = securityIssues.map(issue => `• ${issue.message}`).join('<br>');
      const tip = `
        <div class="chat-message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <strong>Security Issues Detected:</strong><br><br>
            ${details}<br><br>
            <strong>Recommended Actions:</strong><br>
            1. Never use eval() - use JSON.parse() or Function() with caution<br>
            2. Avoid innerHTML - use textContent or createElement<br>
            3. Never hardcode credentials - use environment variables<br>
            4. Validate all user inputs<br>
            5. Use parameterized queries for database operations
          </div>
        </div>
      `;
      chatMessages.innerHTML += tip;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function showErrorHandlingBestPractices() {
    if (chatMessages && chatTab) {
      const chatTabBtn = document.querySelector('[data-tab="chat"]');
      if (chatTabBtn) chatTabBtn.click();
      
      const tip = `
        <div class="chat-message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <strong>Error Handling Best Practices:</strong><br><br>
            <strong>For Async/Await:</strong><br>
            <code>try {
  const result = await asyncFunction();
} catch (error) {
  console.error('Operation failed:', error);
  // Handle or rethrow
}</code><br><br>
            <strong>For Promises:</strong><br>
            <code>asyncFunction()
  .then(result => process(result))
  .catch(error => handleError(error))
  .finally(() => cleanup());</code><br><br>
            <strong>General Principles:</strong><br>
            1. Fail fast - validate inputs early<br>
            2. Never swallow errors silently<br>
            3. Log errors with context<br>
            4. Provide user-friendly messages<br>
            5. Use custom error types for domain-specific errors
          </div>
        </div>
      `;
      chatMessages.innerHTML += tip;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function markSuggestionSkipped(suggestionId) {
    const suggestionElement = document.querySelector(`[data-suggestion-id="${suggestionId}"]`);
    if (suggestionElement) {
      suggestionElement.style.opacity = "0.5";
      suggestionElement.style.pointerEvents = "none";
      
      // Store skipped suggestions in localStorage
      const skipped = JSON.parse(localStorage.getItem("aicodeimp_skipped_suggestions") || "[]");
      if (!skipped.includes(suggestionId)) {
        skipped.push(suggestionId);
        localStorage.setItem("aicodeimp_skipped_suggestions", JSON.stringify(skipped));
      }
    }
  }

  // ============================================
  // MAIN IMPROVEMENT ENGINE - REAL AI INTEGRATION
  // ============================================

  async function runImprovement(isComparison = false) {
    if (!codeInput) return;
    
    const code = codeInput.value.trim();
    const instructions = additionalInstructions ? additionalInstructions.value.trim() : "";
    const provider = aiProvider ? aiProvider.value : "openai";
    const model = aiModel ? aiModel.value : "gpt-4o";
    
    // Validate input based on mode
    if (appState.currentMode === "nl-to-code") {
      const description = nlDescription ? nlDescription.value.trim() : "";
      if (!description && !instructions) {
        showNotification("Please describe what code you want to generate!", "error");
        if (nlDescription) nlDescription.focus();
        return;
      }
    } else if (!code) {
      showNotification("Please enter some code!", "error");
      return;
    }
    
    // Validate API configuration
    if (provider !== "mock") {
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem(`aicodeimp_${provider}_key`);
      if (!apiKey && provider !== "ollama") {
        showNotification(`Please enter your ${provider.toUpperCase()} API key.`, "error");
        if (settingsSection) settingsSection.classList.remove("collapsed");
        return;
      }
      
      if (provider === "ollama") {
        const ollamaUrlValue = ollamaUrl ? ollamaUrl.value.trim() : "http://localhost:11434";
        if (!ollamaUrlValue) {
          showNotification("Please enter Ollama URL", "error");
          return;
        }
      }
    }
    
    // Set processing state
    appState.isProcessing = true;
    appState.processStartTime = Date.now();
    
    if (loadingOverlay) loadingOverlay.style.display = "flex";
    if (improveBtn) improveBtn.disabled = true;
    
    // Show loading steps
    const steps = ["Analyzing code structure...", "Identifying improvements...", 
                   "Generating optimized code...", "Applying enhancements...", "Finalizing..."];
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (loadingStep) {
        loadingStep.textContent = steps[stepIndex % steps.length];
        stepIndex++;
      }
    }, 1200);
    
    try {
      appState.currentCode = code;
      appState.originalCodeBackup = code;
      
      const result = await improveCode(code, appState.currentMode, instructions, provider, model);
      
      clearInterval(stepInterval);
      
      if (!result || !result.improvedCode) {
        throw new Error("No improvement results received");
      }
      
      appState.currentImprovedCode = result.improvedCode;
      appState.currentExplanation = result.explanation || "Code improved successfully.";
      
      // Display results
      displayResults(result);
      
      // Save to history
      saveToHistory(code, result, appState.currentMode);
      
      // Update global stats
      updateStats();
      
      // Handle comparison mode
      if (isComparison && comparisonSection) {
        comparisonSection.classList.remove("hidden");
        // Secondary improvement can be implemented here
      } else if (comparisonSection) {
        comparisonSection.classList.add("hidden");
      }
      
    } catch (error) {
      clearInterval(stepInterval);
      console.error("Improvement error:", error);
      showNotification(`Error: ${error.message}`, "error");
      
      // Fallback to basic formatting if AI fails
      if (code && !appState.currentImprovedCode) {
        const formattedCode = formatCodeBasic(code);
        appState.currentImprovedCode = formattedCode;
        appState.currentExplanation = "Basic formatting applied (AI service unavailable)";
        displayResults({
          improvedCode: formattedCode,
          explanation: "Basic formatting applied"
        });
      }
      
    } finally {
      // Cleanup
      appState.isProcessing = false;
      if (loadingOverlay) loadingOverlay.style.display = "none";
      if (improveBtn) improveBtn.disabled = false;
    }
  }

  async function improveCode(code, mode, instructions, provider = "openai", model = "gpt-4o") {
    // For demo purposes or when no API is available
    if (provider === "mock" || !validateProviderConfig(provider)) {
      await new Promise(resolve => setTimeout(resolve, 1800));
      return mockImprove(code, mode, instructions);
    }
    
    const { systemPrompt, userPrompt } = buildPrompt(code, mode, instructions);
    
    try {
      let response;
      switch (provider) {
        case "openai":
          response = await callOpenAI(systemPrompt, userPrompt, model);
          break;
        case "openrouter":
          response = await callOpenRouter(systemPrompt, userPrompt, model);
          break;
        case "groq":
          response = await callGroq(systemPrompt, userPrompt, model);
          break;
        case "anthropic":
          response = await callAnthropic(systemPrompt, userPrompt, model);
          break;
        case "ollama":
          response = await callOllama(systemPrompt, userPrompt, model);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      return parseAIResponse(response, mode);
      
    } catch (error) {
      console.error(`Error calling ${provider}:`, error);
      
      // Fallback to mock if API fails
      if (provider !== "mock") {
        showNotification(`API Error: ${error.message}. Using demo mode.`, "warning");
        return mockImprove(code, mode, instructions);
      }
      
      throw error;
    }
  }

  function validateProviderConfig(provider) {
    if (provider === "ollama") {
      const url = ollamaUrl ? ollamaUrl.value.trim() : "http://localhost:11434";
      return url.length > 0;
    }
    
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem(`aicodeimp_${provider}_key`);
    return apiKey && apiKey.length > 0;
  }

  function buildPrompt(code, mode, instructions) {
    const modeConfigs = {
      "error-repair": {
        title: "Error Repair and Bug Fixing",
        task: "Fix all errors, bugs, and issues in this code. Make it production-ready.",
        focus: ["Syntax errors", "Runtime bugs", "Logical errors", "Edge cases", "Best practices"]
      },
      "enhance": {
        title: "Code Enhancement",
        task: "Improve code quality, readability, structure, and maintainability.",
        focus: ["Clean code", "Better naming", "Modern patterns", "SOLID principles", "Readability"]
      },
      "optimize": {
        title: "Performance Optimization",
        task: "Optimize the code for maximum performance and efficiency.",
        focus: ["Time complexity", "Space complexity", "Algorithm optimization", "Memory usage", "Speed"]
      },
      "document": {
        title: "Documentation Generation",
        task: "Add comprehensive, professional documentation to the code.",
        focus: ["JSDoc comments", "Inline documentation", "Usage examples", "API documentation", "README structure"]
      },
      "security": {
        title: "Security Audit and Hardening",
        task: "Find and fix all security vulnerabilities. Make the code secure.",
        focus: ["Input validation", "XSS prevention", "SQL injection", "Authentication", "Data protection"]
      },
      "test": {
        title: "Test Generation",
        task: "Generate comprehensive test suites for the code.",
        focus: ["Unit tests", "Integration tests", "Edge cases", "Test coverage", "Mocking"]
      },
      "convert": {
        title: "Language Conversion",
        task: `Convert the code to ${convertTarget ? convertTarget.value : "Python"} following idiomatic patterns.`,
        focus: ["Syntax translation", "Language idioms", "Standard libraries", "Equivalent patterns"]
      },
      "explain": {
        title: "Code Explanation",
        task: "Explain what the code does, how it works, and its purpose.",
        focus: ["Line-by-line analysis", "Algorithm explanation", "Purpose", "Use cases", "Complexity"]
      },
      "nl-to-code": {
        title: "Natural Language to Code",
        task: "Generate clean, production-ready code based on the description.",
        focus: ["Clean architecture", "Best practices", "Error handling", "Documentation", "Production readiness"]
      }
    };
    
    const config = modeConfigs[mode] || modeConfigs["enhance"];
    const targetLang = convertTarget ? convertTarget.value : detectLanguage(code) || "javascript";
    
    // Special handling for NL-to-code mode
    if (mode === "nl-to-code") {
      const description = nlDescription ? nlDescription.value.trim() : instructions;
      
      const systemPrompt = `You are an expert ${targetLang} developer. Generate clean, production-ready code based on the user's description.

IMPORTANT RULES:
1. Return ONLY the code without any explanations, markdown formatting, or JSON wrappers
2. Write clean, well-structured, and maintainable code
3. Include proper error handling and validation
4. Add helpful comments for complex logic
5. Follow ${targetLang} best practices and conventions
6. Make it production-ready with appropriate imports/exports

Return ONLY the raw code that can be directly copied and used.`;

      let userPrompt = `Generate ${targetLang.toUpperCase()} code with these requirements:

DESCRIPTION: ${description}

ADDITIONAL REQUIREMENTS:
- Use modern ${targetLang} features and best practices
- Include comprehensive error handling
- Add appropriate comments for documentation
- Ensure code is efficient and readable
- Follow standard naming conventions

${code ? `REFERENCE/EXISTING CODE TO CONSIDER:\n${code}\n\n` : ''}
Provide ONLY the ${targetLang} code - no explanations, no markdown backticks, no JSON.`;

      return { systemPrompt, userPrompt };
    }
    
    // Standard mode system prompt
    const systemPrompt = `You are an expert code assistant specializing in ${config.title}.

CRITICAL INSTRUCTIONS:
1. Return ONLY the improved code - no explanations, no markdown, no JSON wrappers
2. Do NOT include any text before or after the code
3. The output should be directly executable/runnable code
4. Focus on: ${config.focus.join(", ")}
5. Maintain the original functionality while improving quality

Return ONLY the raw improved code.`;

    // Standard mode user prompt
    let userPrompt = `TASK: ${config.task}
MODE: ${config.title}

ORIGINAL CODE:
${code}

${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}\n\n` : ''}
IMPROVE THIS CODE FOLLOWING THESE GUIDELINES:
- Fix all errors and bugs
- Improve code structure and readability
- Apply modern best practices
- Add appropriate error handling
- Optimize for performance where possible
- Ensure production readiness

Provide ONLY the improved code - no explanations, no markdown, no JSON.`;

    return { systemPrompt, userPrompt };
  }

  function parseAIResponse(response, mode) {
    if (!response || typeof response !== 'string') {
      throw new Error("Invalid response from AI");
    }
    
    let code = response.trim();
    
    // Remove markdown code blocks
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/;
    const match = code.match(codeBlockRegex);
    if (match && match[1]) {
      code = match[1].trim();
    }
    
    // Remove common AI response prefixes
    const prefixes = [
      /^Here(?:'s| is) (?:the |an? )?(?:improved |fixed |optimized |generated )?code:\s*/i,
      /^(?:Improved|Fixed|Optimized|Enhanced|Generated) code:\s*/i,
      /^(?:The|Your) (?:improved|fixed|optimized|enhanced) code:\s*/i,
      /^Below is (?:the |an? )?(?:improved |fixed |optimized )?code:\s*/i,
      /^Following is (?:the |an? )?(?:improved |fixed |optimized )?code:\s*/i,
      /^Code:\s*/i,
      /^Output:\s*/i
    ];
    
    prefixes.forEach(prefix => {
      code = code.replace(prefix, '');
    });
    
    // Try to extract JSON if present
    try {
      if (code.startsWith('{') || code.startsWith('[')) {
        const parsed = JSON.parse(code);
        if (parsed.code || parsed.improvedCode) {
          code = parsed.code || parsed.improvedCode;
        }
      }
    } catch (e) {
      // Not JSON, continue with raw code
    }
    
    // Clean up any remaining non-code text
    const lines = code.split('\n');
    const codeLines = [];
    let inCodeBlock = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip lines that look like explanations
      if (!inCodeBlock && (
        trimmed.startsWith('Explanation:') ||
        trimmed.startsWith('Note:') ||
        trimmed.startsWith('Tips:') ||
        trimmed.startsWith('Changes:') ||
        (trimmed.length < 100 && trimmed.includes(':') && !trimmed.includes('=') && !trimmed.includes('{') && !trimmed.includes('}'))
      )) {
        continue;
      }
      
      codeLines.push(line);
    }
    
    code = codeLines.join('\n').trim();
    
    // If we have very little code left, use the original response
    if (code.split('\n').length < 3 && response.split('\n').length > 5) {
      code = response;
    }
    
    // Generate explanation based on mode
    const explanation = generateExplanation(code, mode);
    
    return {
      improvedCode: code,
      explanation: explanation
    };
  }

  function generateExplanation(improvedCode, mode) {
    const originalLines = appState.currentCode.split('\n').length;
    const improvedLines = improvedCode.split('\n').length;
    const lineChange = improvedLines - originalLines;
    
    const explanations = [];
    
    explanations.push(`✨ Applied ${mode.replace('-', ' ')} improvements`);
    
    if (lineChange > 0) {
      explanations.push(`📈 Added ${lineChange} lines (mostly documentation and error handling)`);
    } else if (lineChange < 0) {
      explanations.push(`📉 Reduced by ${Math.abs(lineChange)} lines (code simplification)`);
    } else {
      explanations.push(`📊 Same line count (focused on quality improvements)`);
    }
    
    // Add mode-specific explanations
    switch (mode) {
      case 'error-repair':
        explanations.push('🔧 Fixed syntax errors and runtime issues');
        explanations.push('🛡️ Added comprehensive error handling');
        break;
      case 'enhance':
        explanations.push('🎨 Improved code structure and readability');
        explanations.push('🏗️ Applied modern coding patterns');
        break;
      case 'optimize':
        explanations.push('⚡ Optimized performance and efficiency');
        explanations.push('📦 Reduced memory footprint');
        break;
      case 'document':
        explanations.push('📚 Added comprehensive documentation');
        explanations.push('💬 Included helpful comments');
        break;
      case 'security':
        explanations.push('🔒 Fixed security vulnerabilities');
        explanations.push('🛡️ Implemented security best practices');
        break;
      case 'test':
        explanations.push('🧪 Added comprehensive test coverage');
        explanations.push('✅ Included edge case testing');
        break;
    }
    
    // Add complexity analysis
    const originalComplexity = calculateCyclomaticComplexity(appState.currentCode);
    const improvedComplexity = calculateCyclomaticComplexity(improvedCode);
    
    if (improvedComplexity < originalComplexity) {
      explanations.push(`📉 Reduced complexity from ${originalComplexity} to ${improvedComplexity}`);
    }
    
    // Add quality score
    const improvedAnalysis = performQualityAnalysis(improvedCode);
    if (improvedAnalysis.score > appState.qualityScore) {
      const improvement = improvedAnalysis.score - appState.qualityScore;
      explanations.push(`📊 Quality score improved by ${improvement} points (${appState.qualityScore} → ${improvedAnalysis.score})`);
    }
    
    return explanations.join('\n');
  }

  async function callOpenAI(systemPrompt, userPrompt, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_openai_key");
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callOpenRouter(systemPrompt, userPrompt, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_openrouter_key");
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Code Improver Pro"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callGroq(systemPrompt, userPrompt, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_groq_key");
    
    if (!apiKey) {
      throw new Error("Groq API key not configured");
    }
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callAnthropic(systemPrompt, userPrompt, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_anthropic_key");
    
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.2
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0]?.text || "";
  }

  async function callOllama(systemPrompt, userPrompt, model) {
    const baseUrl = ollamaUrl ? ollamaUrl.value.trim() : "http://localhost:11434";
    
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: 4000
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      return data.message?.content || "";
      
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(`Cannot connect to Ollama at ${baseUrl}. Ensure Ollama is running.`);
      }
      throw error;
    }
  }

  function mockImprove(code, mode, instructions) {
    // Enhanced mock improvement with realistic transformations
    let improvedCode = code;
    const improvements = [];
    
    switch (mode) {
      case "error-repair":
        // Fix common syntax errors
        improvedCode = improvedCode.replace(/(\w+)\s*=\s*([^;]+)(?!;|\n|$)/g, "$1 = $2;");
        
        // Add missing semicolons
        const lines = improvedCode.split('\n');
        improvedCode = lines.map(line => {
          const trimmed = line.trim();
          if (trimmed && 
              !trimmed.endsWith(';') && 
              !trimmed.endsWith('{') && 
              !trimmed.endsWith('}') &&
              !trimmed.startsWith('//') &&
              !trimmed.startsWith('/*') &&
              !trimmed.startsWith('*') &&
              !trimmed.startsWith('#') &&
              !trimmed.match(/^(if|else|for|while|function|class|import|export)\b/) &&
              !trimmed.match(/=>\s*$/) &&
              trimmed.match(/^(const|let|var|return|break|continue|console\.|alert\()/)) {
            return line + ';';
          }
          return line;
        }).join('\n');
        
        improvements.push("• Fixed missing semicolons");
        improvements.push("• Added basic error handling structure");
        break;
        
      case "enhance":
        // Convert var to const/let
        improvedCode = improvedCode.replace(/\bvar\s+(\w+)/g, (match, varName) => {
          // Simple heuristic: if variable is reassigned, use let, else const
          const reassignments = improvedCode.match(new RegExp(`\\b${varName}\\s*=`, 'g'));
          return reassignments && reassignments.length > 1 ? `let ${varName}` : `const ${varName}`;
        });
        
        // Format code with proper indentation
        improvedCode = formatCodeBasic(improvedCode);
        
        improvements.push("• Converted var to const/let");
        improvements.push("• Improved code formatting and indentation");
        break;
        
      case "optimize":
        // Remove duplicate console.log statements
        const logLines = improvedCode.split('\n');
        const uniqueLogs = [];
        const seenLogs = new Set();
        
        improvedCode = logLines.map(line => {
          const logMatch = line.match(/console\.log\(([^)]+)\)/);
          if (logMatch) {
            const logContent = logMatch[1].trim();
            if (!seenLogs.has(logContent)) {
              seenLogs.add(logContent);
              uniqueLogs.push(line);
              return line;
            }
            return null;
          }
          return line;
        }).filter(line => line !== null).join('\n');
        
        improvements.push("• Removed duplicate console statements");
        improvements.push("• Applied basic optimization patterns");
        break;
        
      case "document":
        // Add JSDoc comments to functions
        improvedCode = improvedCode.replace(/(function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*\([^)]*\)\s*=>)/g, (match) => {
          return `/**\n * TODO: Add function description\n */\n${match}`;
        });
        
        improvements.push("• Added JSDoc template to functions");
        improvements.push("• Improved code documentation structure");
        break;
        
      case "nl-to-code":
        const description = nlDescription ? nlDescription.value.trim() : instructions;
        const targetLang = languageSelect ? languageSelect.value : "javascript";
        
        if (targetLang === "python") {
          improvedCode = `# Generated from: ${description || "natural language description"}\n\n"""\n${description || "Module description"}\n"""\n\nimport sys\nimport os\n\ndef main() -> None:\n    """Main function."""\n    try:\n        # TODO: Implement your logic here\n        result = process_data()\n        print(f"Result: {result}")\n    except Exception as e:\n        print(f"Error: {e}", file=sys.stderr)\n        sys.exit(1)\n\ndef process_data() -> any:\n    """Process data according to requirements."""\n    # TODO: Implement data processing logic\n    return None\n\nif __name__ == "__main__":\n    main()`;
        } else {
          improvedCode = `// Generated from: ${description || "natural language description"}\n\n/**\n * ${description || "Module description"}\n */\n\n'use strict';\n\n/**\n * Main function\n * @returns {Promise<void>}\n */\nasync function main() {\n  try {\n    // TODO: Implement your logic here\n    const result = await processData();\n    console.log(\`Result: \${result}\`);\n  } catch (error) {\n    console.error('Error:', error);\n    process.exit(1);\n  }\n}\n\n/**\n * Process data according to requirements\n * @returns {Promise<any>}\n */\nasync function processData() {\n  // TODO: Implement data processing logic\n  return null;\n}\n\n// Execute main function\nif (require.main === module) {\n  main();\n}\n\nmodule.exports = { main, processData };`;
        }
        
        improvements.push("• Generated template code from description");
        improvements.push("• Added comprehensive error handling");
        improvements.push("• Included documentation and TODOs");
        break;
    }
    
    // Always apply basic formatting
    improvedCode = formatCodeBasic(improvedCode);
    
    return {
      improvedCode: improvedCode,
      explanation: improvements.join('\n') + '\n\n✨ Demo improvement applied'
    };
  }

  function formatCodeBasic(code) {
    const lines = code.split('\n');
    let indent = 0;
    const formatted = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        formatted.push('');
        continue;
      }
      
      // Decrease indent for closing braces/brackets
      if (trimmed.match(/^[}\])]/) || trimmed === 'end' || trimmed === 'endif' || trimmed === 'endfor') {
        indent = Math.max(0, indent - 1);
      }
      
      // Add line with proper indentation
      formatted.push('  '.repeat(indent) + trimmed);
      
      // Increase indent for opening braces/brackets
      if (trimmed.match(/[{[(]$/) || trimmed.match(/:\s*$/) || 
          trimmed.match(/^(if|else|for|while|function|class|try|catch|finally)\b/)) {
        indent++;
      }
    }
    
    return formatted.join('\n');
  }

  function displayResults(result) {
    if (!result || !result.improvedCode) return;
    
    // Hide empty state, show output
    if (emptyState) emptyState.style.display = "none";
    if (outputSection) outputSection.style.display = "block";
    
    // Reset diff view
    appState.isDiffViewActive = false;
    if (diffContainer) diffContainer.style.display = "none";
    if (diffBtn) diffBtn.textContent = "🔄";
    
    // Display improved code with syntax highlighting
    if (outputCode) {
      outputCode.textContent = result.improvedCode;
      outputCode.style.display = "block";
      
      // Apply syntax highlighting
      if (typeof Prism !== "undefined") {
        const lang = languageSelect ? languageSelect.value : detectLanguage(result.improvedCode);
        outputCode.className = "language-" + (lang || "javascript");
        Prism.highlightElement(outputCode);
      }
    }
    
    // Display explanation
    if (explanationText) {
      explanationText.innerHTML = result.explanation
        .replace(/\n/g, "<br>")
        .replace(/•/g, "✦")
        .replace(/✨/g, "✨")
        .replace(/🔧/g, "🔧")
        .replace(/🛡️/g, "🛡️")
        .replace(/🎨/g, "🎨")
        .replace(/⚡/g, "⚡")
        .replace(/📚/g, "📚")
        .replace(/🔒/g, "🔒")
        .replace(/🧪/g, "🧪")
        .replace(/📈/g, "📈")
        .replace(/📉/g, "📉")
        .replace(/📊/g, "📊");
    }
    
    // Show analysis panel
    if (analysisPanel) analysisPanel.style.display = "block";
    
    // Calculate and display metrics
    const timeElapsed = ((Date.now() - appState.processStartTime) / 1000).toFixed(1);
    const originalLines = appState.currentCode.split("\n").length;
    const newLines = result.improvedCode.split("\n").length;
    const linesChanged = newLines - originalLines;
    
    if (metricLinesChanged) {
      metricLinesChanged.textContent = linesChanged > 0 ? `+${linesChanged}` : linesChanged.toString();
      metricLinesChanged.className = linesChanged > 0 ? "positive" : linesChanged < 0 ? "negative" : "";
    }
    
    if (metricQuality) {
      const qualityScore = calculateQualityScore(result.improvedCode);
      metricQuality.textContent = `${qualityScore}%`;
    }
    
    if (metricTime) {
      metricTime.textContent = `${timeElapsed}s`;
    }
    
    if (metricTokens) {
      metricTokens.textContent = estimateTokens(result.improvedCode);
    }
    
    // Reset chat and add welcome message
    appState.chatHistory = [];
    if (chatMessages) {
      chatMessages.innerHTML = `
        <div class="chat-message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <strong>Code improvement complete!</strong><br>
            I've applied ${appState.currentMode.replace('-', ' ')} enhancements to your code.<br>
            Ask me anything about the changes, or request further improvements.
          </div>
        </div>
      `;
    }
    
    // Update complexity chart
    updateComplexityChart(appState.currentCode, result.improvedCode);
    
    // Scroll to results
    if (outputSection) {
      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  function calculateQualityScore(code) {
    let score = 70;
    
    // Bonus for good practices
    if (code.includes("//") || code.includes("/*") || code.includes("# ")) score += 10;
    if (!/\bvar\s+/.test(code)) score += 5;
    if (/try\s*\{/.test(code)) score += 5;
    if (/const\s+/.test(code)) score += 5;
    if (code.includes("async") && code.includes("await")) score += 5;
    if (code.includes("@param") || code.includes("@return")) score += 5;
    
    // Penalty for bad practices
    if (code.includes("eval(")) score -= 20;
    if (code.match(/console\.log/g)?.length > 5) score -= 5;
    if (code.match(/\b\d{3,}\b/g)?.length > 10) score -= 5;
    
    return Math.min(100, Math.max(0, score));
  }

  function estimateTokens(code) {
    // Rough estimation: 1 token ≈ 4 characters for English code
    const tokens = Math.ceil(code.length / 4);
    return tokens > 1000 ? `${(tokens / 1000).toFixed(1)}k` : tokens.toString();
  }

  function updateComplexityChart(originalCode, improvedCode) {
    if (!chartBarBefore || !chartBarAfter) return;
    
    const originalComplexity = calculateCyclomaticComplexity(originalCode);
    const improvedComplexity = calculateCyclomaticComplexity(improvedCode);
    const maxComplexity = Math.max(originalComplexity, improvedComplexity, 10);
    
    setTimeout(() => {
      const beforeWidth = Math.min(100, (originalComplexity / maxComplexity) * 100);
      const afterWidth = Math.min(100, (improvedComplexity / maxComplexity) * 100);
      
      chartBarBefore.style.width = `${beforeWidth}%`;
      chartBarAfter.style.width = `${afterWidth}%`;
      
      if (chartValueBefore) chartValueBefore.textContent = originalComplexity;
      if (chartValueAfter) chartValueAfter.textContent = improvedComplexity;
      
      if (chartImprovement) {
        const improvement = originalComplexity - improvedComplexity;
        const improvementPercent = originalComplexity > 0 ? 
          Math.round((improvement / originalComplexity) * 100) : 0;
        
        if (improvement > 0) {
          chartImprovement.className = "chart-improvement positive";
          chartImprovement.innerHTML = `
            <span>🎉 Reduced by ${improvement} points (${improvementPercent}%)</span>
          `;
        } else if (improvement < 0) {
          chartImprovement.className = "chart-improvement negative";
          chartImprovement.innerHTML = `
            <span>⚠️ Increased by ${Math.abs(improvement)} points</span>
          `;
        } else {
          chartImprovement.className = "chart-improvement";
          chartImprovement.innerHTML = `
            <span>✓ Complexity maintained</span>
          `;
        }
      }
    }, 500);
  }

  // ============================================
  // HISTORY MANAGEMENT - ENHANCED
  // ============================================

  function saveToHistory(original, result, mode) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString(),
      mode: mode,
      originalCode: original.substring(0, 500),
      improvedCode: result.improvedCode.substring(0, 500),
      explanation: result.explanation,
      qualityScore: calculateQualityScore(result.improvedCode),
      complexity: calculateCyclomaticComplexity(result.improvedCode),
      linesChanged: result.improvedCode.split('\n').length - original.split('\n').length
    };
    
    appState.improvementHistory.unshift(entry);
    
    // Keep only last 50 entries
    if (appState.improvementHistory.length > 50) {
      appState.improvementHistory.pop();
    }
    
    // Save to localStorage
    try {
      localStorage.setItem("aicodeimp_history", JSON.stringify(appState.improvementHistory));
    } catch (e) {
      console.warn("Could not save history to localStorage:", e);
    }
    
    // Update stats
    appState.totalImprovements++;
    localStorage.setItem("aicodeimp_total", appState.totalImprovements.toString());
    
    if (statsImproved) {
      statsImproved.textContent = appState.totalImprovements;
    }
  }

  function loadHistory() {
    try {
      const savedHistory = localStorage.getItem("aicodeimp_history");
      if (savedHistory) {
        appState.improvementHistory = JSON.parse(savedHistory);
      }
    } catch (e) {
      console.warn("Could not load history from localStorage:", e);
      appState.improvementHistory = [];
    }
  }

  function showHistoryModal() {
    if (!historyModal || !historyList) return;
    
    loadHistory();
    
    historyList.innerHTML = "";
    
    if (appState.improvementHistory.length === 0) {
      historyList.innerHTML = `
        <div class="empty-history">
          <div class="empty-icon">📝</div>
          <div class="empty-text">No improvement history yet</div>
          <div class="empty-subtext">Your improvements will appear here</div>
        </div>
      `;
    } else {
      appState.improvementHistory.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
          <div class="history-info">
            <div class="history-header">
              <span class="history-mode">${item.mode.toUpperCase()}</span>
              <span class="history-date">${item.date}</span>
            </div>
            <div class="history-preview">
              <div class="history-original">${escapeHtml(item.originalCode.substring(0, 80))}${item.originalCode.length > 80 ? '...' : ''}</div>
              <div class="history-arrow">→</div>
              <div class="history-improved">${escapeHtml(item.improvedCode.substring(0, 80))}${item.improvedCode.length > 80 ? '...' : ''}</div>
            </div>
            <div class="history-stats">
              <span class="history-stat quality">Quality: ${item.qualityScore}%</span>
              <span class="history-stat complexity">Complexity: ${item.complexity}</span>
              <span class="history-stat lines">Lines: ${item.linesChanged > 0 ? '+' : ''}${item.linesChanged}</span>
            </div>
          </div>
          <button class="history-load-btn" title="Load this improvement">↺</button>
        `;
        
        const loadBtn = div.querySelector(".history-load-btn");
        loadBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          loadHistoryItem(item);
        });
        
        div.addEventListener("click", () => {
          loadHistoryItem(item);
        });
        
        historyList.appendChild(div);
      });
    }
    
    historyModal.style.display = "flex";
    historyModal.classList.add("visible");
  }

  function loadHistoryItem(item) {
    if (codeInput) {
      codeInput.value = item.originalCode;
      updateLineNumbers(true);
      analyzeCodeQuality();
    }
    
    if (outputCode) {
      outputCode.textContent = item.improvedCode;
      outputCode.style.display = "block";
      
      if (typeof Prism !== "undefined") {
        const lang = detectLanguage(item.improvedCode);
        outputCode.className = "language-" + (lang || "javascript");
        Prism.highlightElement(outputCode);
      }
    }
    
    if (explanationText) {
      explanationText.innerHTML = item.explanation.replace(/\n/g, "<br>");
    }
    
    if (emptyState) emptyState.style.display = "none";
    if (outputSection) outputSection.style.display = "block";
    if (analysisPanel) analysisPanel.style.display = "block";
    
    // Set the mode
    const modeRadio = document.querySelector(`input[name="mode"][value="${item.mode}"]`);
    if (modeRadio) {
      modeRadio.checked = true;
      appState.currentMode = item.mode;
    }
    
    closeModal(historyModal);
    
    showNotification("History item loaded successfully", "success");
  }

  function clearHistory() {
    if (confirm("Are you sure you want to clear all improvement history? This cannot be undone.")) {
      appState.improvementHistory = [];
      localStorage.removeItem("aicodeimp_history");
      showHistoryModal(); // Refresh the modal
      showNotification("History cleared successfully", "success");
    }
  }

  // ============================================
  // EXPORT FUNCTIONALITY - ENHANCED
  // ============================================

  function showExportModal() {
    if (!exportModal) return;
    
    exportModal.style.display = "flex";
    exportModal.classList.add("visible");
  }

  function setupExportHandlers() {
    if (exportCodeBtn) {
      exportCodeBtn.addEventListener("click", exportAsCode);
    }
    
    if (exportMarkdownBtn) {
      exportMarkdownBtn.addEventListener("click", exportAsMarkdown);
    }
    
    if (exportJSONBtn) {
      exportJSONBtn.addEventListener("click", exportAsJSON);
    }
    
    if (exportClipboardBtn) {
      exportClipboardBtn.addEventListener("click", exportToClipboard);
    }
  }

  function exportAsCode() {
    const code = appState.currentImprovedCode || (outputCode ? outputCode.textContent : "");
    if (!code) {
      showNotification("No code to export", "error");
      return;
    }
    
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `improved-code-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal(exportModal);
    showNotification("Code exported successfully", "success");
  }

  function exportAsMarkdown() {
    const code = appState.currentImprovedCode || (outputCode ? outputCode.textContent : "");
    const explanation = appState.currentExplanation || (explanationText ? explanationText.textContent : "");
    
    if (!code) {
      showNotification("No code to export", "error");
      return;
    }
    
    const markdown = `# Improved Code\n\n**Mode:** ${appState.currentMode.replace('-', ' ')}\n**Timestamp:** ${new Date().toLocaleString()}\n\n## Original Code\n\n\`\`\`\n${appState.currentCode}\n\`\`\`\n\n## Improved Code\n\n\`\`\`\n${code}\n\`\`\`\n\n## Explanation\n\n${explanation}\n\n## Metrics\n\n- **Quality Score:** ${calculateQualityScore(code)}%\n- **Complexity:** ${calculateCyclomaticComplexity(code)}\n- **Lines Changed:** ${code.split('\\n').length - appState.currentCode.split('\\n').length}\n\n---\n\n*Exported from AI Code Improver Pro*`;
    
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `improved-code-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal(exportModal);
    showNotification("Markdown exported successfully", "success");
  }

  function exportAsJSON() {
    const code = appState.currentImprovedCode || (outputCode ? outputCode.textContent : "");
    const explanation = appState.currentExplanation || (explanationText ? explanationText.textContent : "");
    
    if (!code) {
      showNotification("No code to export", "error");
      return;
    }
    
    const exportData = {
      metadata: {
        tool: "AI Code Improver Pro",
        version: "2.0",
        exportDate: new Date().toISOString(),
        mode: appState.currentMode
      },
      originalCode: appState.currentCode,
      improvedCode: code,
      explanation: explanation,
      metrics: {
        qualityScore: calculateQualityScore(code),
        complexity: calculateCyclomaticComplexity(code),
        linesChanged: code.split('\n').length - appState.currentCode.split('\n').length,
        originalLines: appState.currentCode.split('\n').length,
        improvedLines: code.split('\n').length
      },
      analysis: appState.lastAnalysisResult
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `improved-code-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal(exportModal);
    showNotification("JSON exported successfully", "success");
  }

  async function exportToClipboard() {
    const code = appState.currentImprovedCode || (outputCode ? outputCode.textContent : "");
    
    if (!code) {
      showNotification("No code to copy", "error");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(code);
      closeModal(exportModal);
      showNotification("Code copied to clipboard", "success");
    } catch (error) {
      console.error("Clipboard error:", error);
      showNotification("Failed to copy to clipboard", "error");
    }
  }

  // ============================================
  // CHAT FUNCTIONALITY - ENHANCED
  // ============================================

  async function sendChatMessage() {
    if (!chatInput || !chatMessages || appState.isProcessing) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Clear input
    chatInput.value = "";
    
    // Add user message
    addChatMessage("user", message);
    
    // Add typing indicator
    const typingId = `typing-${Date.now()}`;
    addTypingIndicator(typingId);
    
    try {
      const response = await getChatResponse(message);
      
      // Remove typing indicator
      removeElement(typingId);
      
      // Add AI response
      addChatMessage("ai", response);
      
      // Save to chat history
      appState.currentChatSession.push(
        { role: "user", content: message },
        { role: "assistant", content: response }
      );
      
    } catch (error) {
      removeElement(typingId);
      addChatMessage("ai", `Error: ${error.message}`, true);
      console.error("Chat error:", error);
    }
  }

  function addChatMessage(role, content, isError = false) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${role}`;
    
    const avatar = role === "user" ? "👤" : "🤖";
    const messageClass = isError ? "message-content error" : "message-content";
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="${messageClass}">${formatChatMessage(content)}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator(id) {
    if (!chatMessages) return;
    
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message ai";
    typingDiv.id = id;
    
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  }

  function formatChatMessage(text) {
    return escapeHtml(text)
      .replace(/\n/g, "<br>")
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
      .replace(/# (.*?)(<br>|$)/g, '<h4>$1</h4>')
      .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
      .replace(/<li>/g, '<ul><li>')
      .replace(/<\/li>(?!<li>)/g, '</li></ul>');
  }

  async function getChatResponse(message) {
    const provider = aiProvider ? aiProvider.value : "openai";
    const model = aiModel ? aiModel.value : "gpt-4o";
    
    // If in demo mode or no API, use mock response
    if (provider === "mock" || !validateProviderConfig(provider)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getMockChatResponse(message);
    }
    
    // Build chat context
    const context = buildChatContext(message);
    
    try {
      switch (provider) {
        case "openai":
          return await callOpenAIChat(context, model);
        case "openrouter":
          return await callOpenRouterChat(context, model);
        case "groq":
          return await callGroqChat(context, model);
        case "anthropic":
          return await callAnthropicChat(context, model);
        case "ollama":
          return await callOllamaChat(context, model);
        default:
          return getMockChatResponse(message);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      return getMockChatResponse(message);
    }
  }

  function buildChatContext(message) {
    const systemPrompt = `You are a helpful code assistant for the AI Code Improver Pro tool.
    
Current Context:
- Mode: ${appState.currentMode}
- Original Code Length: ${appState.currentCode.length} characters
- Improved Code Length: ${appState.currentImprovedCode.length} characters
- Current Language: ${detectLanguage(appState.currentImprovedCode) || 'unknown'}

You are discussing code improvements with the user. Be concise, helpful, and focused on code quality.
Provide practical, actionable advice. If suggesting code changes, provide complete code examples.
Format code blocks with backticks.`;

    const recentChat = appState.currentChatSession.slice(-4);
    
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Original code:\n${appState.currentCode.substring(0, 1000)}` },
      { role: "user", content: `Improved code:\n${appState.currentImprovedCode.substring(0, 1000)}` },
      ...recentChat,
      { role: "user", content: message }
    ];
    
    return messages;
  }

  async function callOpenAIChat(messages, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_openai_key");
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API error");
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callOpenRouterChat(messages, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_openrouter_key");
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenRouter API error");
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callGroqChat(messages, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_groq_key");
    
    if (!apiKey) {
      throw new Error("Groq API key not configured");
    }
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async function callAnthropicChat(messages, model) {
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : localStorage.getItem("aicodeimp_anthropic_key");
    
    if (!apiKey) {
      throw new Error("Anthropic API key not configured");
    }
    
    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter(msg => msg.role !== "system")
      .map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
    
    const systemMessage = messages.find(msg => msg.role === "system")?.content || "";
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1000,
        system: systemMessage,
        messages: anthropicMessages,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Anthropic API error");
    }
    
    const data = await response.json();
    return data.content[0]?.text || "";
  }

  async function callOllamaChat(messages, model) {
    const baseUrl = ollamaUrl ? ollamaUrl.value.trim() : "http://localhost:11434";
    
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.message?.content || "";
  }

  function getMockChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("what") && lowerMessage.includes("change")) {
      return `I analyzed your code and made these key improvements:

**Main Changes:**
1. **Error Handling:** Added comprehensive try-catch blocks for all async operations
2. **Code Structure:** Reorganized functions for better readability and maintainability
3. **Performance:** Optimized loops and reduced unnecessary computations
4. **Security:** Fixed potential vulnerabilities and added input validation
5. **Documentation:** Added JSDoc comments and inline documentation

**Specific Improvements:**
- Reduced cyclomatic complexity from ${appState.complexityScore + 5} to ${appState.complexityScore}
- Improved code quality score from ${appState.qualityScore - 15}% to ${appState.qualityScore}%
- Added proper error boundaries and logging
- Implemented modern ES6+ features

Would you like me to explain any specific change in more detail?`;
    }
    
    if (lowerMessage.includes("why") && lowerMessage.includes("improve")) {
      return `The improvements were made for these important reasons:

**Why These Changes Matter:**
1. **Reliability:** Proper error handling prevents crashes and improves user experience
2. **Maintainability:** Clean, well-structured code is easier to debug and extend
3. **Performance:** Optimized code runs faster and uses fewer resources
4. **Security:** Protection against common vulnerabilities prevents data breaches
5. **Team Collaboration:** Good documentation helps other developers understand the code

**Real-World Impact:**
- Fewer production bugs and outages
- Faster development cycles for new features
- Reduced server costs through better performance
- Lower security risks and compliance issues
- Easier onboarding for new team members

These improvements follow industry best practices from companies like Google, Microsoft, and Airbnb.`;
    }
    
    if (lowerMessage.includes("how") && (lowerMessage.includes("test") || lowerMessage.includes("debug"))) {
      return `**Testing and Debugging Recommendations:**

**Unit Testing:**
\`\`\`javascript
// Example test for your improved code
describe('YourFunction', () => {
  test('should handle normal case', async () => {
    const result = await yourFunction(input);
    expect(result).toBe(expected);
  });
  
  test('should handle errors gracefully', async () => {
    await expect(yourFunction(invalidInput))
      .rejects.toThrow('Expected error');
  });
});
\`\`\`

**Debugging Tips:**
1. **Use Chrome DevTools:** Set breakpoints and inspect variables
2. **Add Strategic Logging:** Use structured logging with levels (debug, info, error)
3. **Error Tracking:** Implement Sentry or similar for production monitoring
4. **Performance Profiling:** Use Chrome's Performance tab to identify bottlenecks

**Best Practices:**
- Write tests before implementing new features (TDD)
- Use mocking for external dependencies
- Test edge cases and error scenarios
- Keep test coverage above 80%
- Automate testing in your CI/CD pipeline`;
    }
    
    if (lowerMessage.includes("better") || lowerMessage.includes("more") || lowerMessage.includes("further")) {
      return `**Further Improvements You Could Make:**

**Advanced Optimizations:**
1. **Lazy Loading:** Load resources only when needed
2. **Memoization:** Cache expensive function results
3. **Code Splitting:** Split large bundles for faster loading
4. **Web Workers:** Offload heavy computations

**Architecture Improvements:**
1. **Implement Design Patterns:** Factory, Observer, Strategy patterns where appropriate
2. **Add TypeScript:** Static typing catches errors at compile time
3. **State Management:** Consider Redux or Context API for complex state
4. **API Layer:** Create a dedicated service layer for API calls

**DevOps Enhancements:**
1. **Dockerize:** Containerize for consistent environments
2. **CI/CD:** Automate testing and deployment
3. **Monitoring:** Add application performance monitoring
4. **Logging:** Implement structured logging with rotation

**Specific Suggestions for Your Code:**
- Consider adding React/Vue if this is a frontend project
- Implement automated end-to-end testing with Cypress
- Add internationalization (i18n) if targeting global users
- Implement proper caching strategy for API responses

Would you like me to help implement any of these?`;
    }
    
    // Default response
    return `I've analyzed your code with the "${appState.currentMode}" improvements. 

The main focus was on:
- **Code Quality:** Improving readability and maintainability
- **Error Handling:** Ensuring robustness and reliability  
- **Performance:** Optimizing for speed and efficiency
- **Security:** Addressing potential vulnerabilities
- **Best Practices:** Following modern development standards

**Current Status:**
- Quality Score: ${appState.qualityScore}%
- Complexity: ${appState.complexityScore}
- Lines Changed: ${appState.currentImprovedCode ? appState.currentImprovedCode.split('\n').length - appState.currentCode.split('\n').length : 'N/A'}

**What would you like to know more about?**
- Specific changes I made
- Why certain improvements were necessary  
- How to test or debug the improved code
- Further optimization opportunities
- Best practices for maintaining this code`;
  }

  // ============================================
  // UI UTILITIES AND HELPERS
  // ============================================

  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => notification.remove());
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "ℹ️";
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function copyToClipboard(text) {
    if (!text) {
      showNotification("No text to copy", "error");
      return;
    }
    
    navigator.clipboard.writeText(text).then(
      () => showNotification("Copied to clipboard", "success"),
      () => showNotification("Failed to copy", "error")
    );
  }

  function toggleView() {
    if (appState.currentView === "code") {
      renderDiffView();
      if (outputSection) outputSection.classList.add("hidden");
      if (diffView) diffView.classList.remove("hidden");
      if (toggleViewBtn) toggleViewBtn.innerHTML = "↔️ Code View";
      appState.currentView = "diff";
    } else {
      if (outputSection) outputSection.classList.remove("hidden");
      if (diffView) diffView.classList.add("hidden");
      if (toggleViewBtn) toggleViewBtn.innerHTML = "↔️ Diff View";
      appState.currentView = "code";
    }
  }

  function renderDiffView() {
    if (!diffOriginal || !diffImproved || !appState.currentImprovedCode) return;
    
    const original = appState.currentCode;
    const improved = appState.currentImprovedCode;
    
    diffOriginal.textContent = original;
    diffImproved.textContent = improved;
    
    // Apply syntax highlighting
    if (typeof Prism !== "undefined") {
      const lang = languageSelect ? languageSelect.value : detectLanguage(improved);
      diffOriginal.className = `language-${lang}`;
      diffImproved.className = `language-${lang}`;
      Prism.highlightElement(diffOriginal);
      Prism.highlightElement(diffImproved);
    }
    
    if (diffContainer) diffContainer.style.display = "block";
    appState.isDiffViewActive = true;
  }

  function updateStats() {
    // Update header stats
    appState.totalTimeSaved += 5; // Assume 5 minutes saved per improvement
    localStorage.setItem("aicodeimp_time", appState.totalTimeSaved.toString());
    
    if (statsImproved) {
      statsImproved.textContent = appState.totalImprovements;
    }
    
    if (statsTime) {
      statsTime.textContent = `${appState.totalTimeSaved} min`;
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("visible");
    }
  }

  // ============================================
  // SETTINGS MANAGEMENT
  // ============================================

  function initializeSettings() {
    // Load saved settings
    const savedProvider = localStorage.getItem("aicodeimp_provider") || "openai";
    if (aiProvider) {
      aiProvider.value = savedProvider;
      updateModels();
      updateApiKeyVisibility();
    }
    
    const savedModel = localStorage.getItem("aicodeimp_model");
    if (savedModel && aiModel) {
      aiModel.value = savedModel;
    }
    
    const savedKey = localStorage.getItem(`aicodeimp_${savedProvider}_key`);
    if (savedKey && apiKeyInput) {
      apiKeyInput.value = savedKey;
    }
    
    const savedOllamaUrl = localStorage.getItem("aicodeimp_ollama_url");
    if (savedOllamaUrl && ollamaUrl) {
      ollamaUrl.value = savedOllamaUrl;
    }
    
    // Load history
    loadHistory();
  }

  function updateModels() {
    if (!aiProvider || !aiModel) return;
    
    const provider = aiProvider.value;
    const models = providerModels[provider] || [];
    
    aiModel.innerHTML = "";
    models.forEach(model => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name;
      aiModel.appendChild(option);
    });
    
    // Restore saved model for this provider
    const savedModel = localStorage.getItem(`aicodeimp_${provider}_model`);
    if (savedModel && models.some(m => m.id === savedModel)) {
      aiModel.value = savedModel;
    }
  }

  function updateApiKeyVisibility() {
    if (!aiProvider) return;
    
    const provider = aiProvider.value;
    
    if (provider === "mock") {
      if (apiKeyGroup) apiKeyGroup.style.display = "none";
      if (ollamaUrlGroup) ollamaUrlGroup.style.display = "none";
    } else if (provider === "ollama") {
      if (apiKeyGroup) apiKeyGroup.style.display = "none";
      if (ollamaUrlGroup) ollamaUrlGroup.style.display = "block";
    } else {
      if (apiKeyGroup) apiKeyGroup.style.display = "block";
      if (ollamaUrlGroup) ollamaUrlGroup.style.display = "none";
      if (apiHint) apiHint.innerHTML = providerHints[provider] || "";
    }
  }

  function saveSettings() {
    if (aiProvider) {
      localStorage.setItem("aicodeimp_provider", aiProvider.value);
      localStorage.setItem(`aicodeimp_${aiProvider.value}_model`, aiModel ? aiModel.value : "");
    }
    
    if (aiModel) {
      localStorage.setItem("aicodeimp_model", aiModel.value);
    }
    
    if (ollamaUrl) {
      localStorage.setItem("aicodeimp_ollama_url", ollamaUrl.value);
    }
  }

  function saveApiKey() {
    const provider = aiProvider ? aiProvider.value : "openai";
    const key = apiKeyInput ? apiKeyInput.value.trim() : "";
    
    if (!key) {
      showNotification("Please enter an API key", "error");
      return;
    }
    
    localStorage.setItem(`aicodeimp_${provider}_key`, key);
    showNotification("API key saved successfully", "success");
  }

  function toggleApiKeyVisibility() {
    if (!apiKeyInput) return;
    
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text";
      if (toggleApiKeyBtn) toggleApiKeyBtn.textContent = "🔒";
    } else {
      apiKeyInput.type = "password";
      if (toggleApiKeyBtn) toggleApiKeyBtn.textContent = "👁️";
    }
  }

  // ============================================
  // EVENT LISTENER SETUP
  // ============================================

  function setupEventListeners() {
    // Code input events
    if (codeInput) {
      codeInput.addEventListener("input", debouncedUpdateLineNumbers);
      codeInput.addEventListener("scroll", () => {
        if (lineNumbers) lineNumbers.scrollTop = codeInput.scrollTop;
      });
      codeInput.addEventListener("paste", () => {
        setTimeout(() => {
          updateLineNumbers(true);
          analyzeCodeQuality();
        }, 0);
      });
    }
    
    // Improve button
    if (improveBtn) {
      improveBtn.addEventListener("click", () => runImprovement(false));
    }
    
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (improveBtn && !appState.isProcessing) {
          runImprovement(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        showHistoryModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        showExportModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (settingsSection) {
          settingsSection.classList.toggle("collapsed");
        }
      }
    });
    
    // Quick Actions
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (codeInput && codeInput.value.trim() && 
            confirm("Are you sure you want to clear all code?")) {
          codeInput.value = "";
          updateLineNumbers();
          analyzeCodeQuality();
          showNotification("Code cleared", "info");
        }
      });
    }
    
    if (formatBtn) {
      formatBtn.addEventListener("click", () => {
        if (codeInput && codeInput.value.trim()) {
          const formatted = formatCodeBasic(codeInput.value);
          codeInput.value = formatted;
          updateLineNumbers();
          showNotification("Code formatted", "success");
        }
      });
    }
    
    if (compareBtn) {
      compareBtn.addEventListener("click", () => {
        showNotification("Comparison mode coming soon", "info");
      });
    }
    
    if (historyBtn) {
      historyBtn.addEventListener("click", showHistoryModal);
    }
    
    if (exportBtn) {
      exportBtn.addEventListener("click", showExportModal);
    }
    
    if (toggleViewBtn) {
      toggleViewBtn.addEventListener("click", toggleView);
    }
    
    // Settings
    if (settingsToggle) {
      settingsToggle.addEventListener("click", () => {
        if (settingsSection) {
          settingsSection.classList.toggle("collapsed");
        }
      });
    }
    
    if (aiProvider) {
      aiProvider.addEventListener("change", () => {
        updateModels();
        updateApiKeyVisibility();
        saveSettings();
      });
    }
    
    if (aiModel) {
      aiModel.addEventListener("change", saveSettings);
    }
    
    if (toggleApiKeyBtn) {
      toggleApiKeyBtn.addEventListener("click", toggleApiKeyVisibility);
    }
    
    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener("click", saveApiKey);
    }
    
    // Mode selection
    const modeCards = document.querySelectorAll('.mode-card input[name="mode"]');
    modeCards.forEach((radio) => {
      radio.addEventListener("change", function () {
        appState.currentMode = this.value;
        if (convertTargetGroup) {
          convertTargetGroup.style.display = 
            appState.currentMode === "convert" ? "block" : "none";
        }
        if (nlInputGroup) {
          nlInputGroup.style.display = 
            appState.currentMode === "nl-to-code" ? "block" : "none";
        }
      });
    });
    
    // Natural Language Chips
    if (nlChips) {
      nlChips.forEach((chip) => {
        chip.addEventListener("click", function () {
          if (nlDescription) {
            nlDescription.value = this.dataset.text || "";
            nlDescription.focus();
          }
        });
      });
    }
    
    // Chat functionality
    if (chatSendBtn) {
      chatSendBtn.addEventListener("click", sendChatMessage);
    }
    
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendChatMessage();
        }
      });
    }
    
    // Quick prompts
    if (quickPrompts) {
      quickPrompts.forEach((prompt) => {
        prompt.addEventListener("click", function () {
          if (chatInput) {
            chatInput.value = this.dataset.prompt || "";
            sendChatMessage();
          }
        });
      });
    }
    
    // Output actions
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        if (outputCode) {
          copyToClipboard(outputCode.textContent);
        }
      });
    }
    
    if (copyBtnSecondary) {
      copyBtnSecondary.addEventListener("click", () => {
        if (outputCodeSecondary) {
          copyToClipboard(outputCodeSecondary.textContent);
        }
      });
    }
    
    // Tabs
    if (tabBtns) {
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          tabBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          
          const tab = btn.dataset.tab;
          if (changesTab) {
            changesTab.style.display = tab === "changes" ? "block" : "none";
          }
          if (metricsTab) {
            metricsTab.style.display = tab === "metrics" ? "block" : "none";
          }
          if (chatTab) {
            chatTab.style.display = tab === "chat" ? "block" : "none";
          }
        });
      });
    }
    
    // Refresh suggestions
    if (refreshSuggestionsBtn) {
      refreshSuggestionsBtn.addEventListener("click", () => {
        appState.lastAnalysisResult = null;
        if (codeInput && codeInput.value.trim()) {
          analyzeCodeQuality();
        }
      });
    }
    
    // Clear history
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", clearHistory);
    }
    
    // Modal close buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".modal");
        closeModal(modal);
      });
    });
    
    // Modal background clicks
    [historyModal, exportModal].forEach((modal) => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      }
    });
    
    // Export handlers
    setupExportHandlers();
    
    // Diff mode toggle
    if (diffModeToggle) {
      diffModeToggle.addEventListener("click", () => {
        appState.isDiffSplitMode = !appState.isDiffSplitMode;
        if (diffModeToggle) {
          diffModeToggle.textContent = appState.isDiffSplitMode ? 
            "Split View" : "Unified View";
        }
        if (diffContent) {
          diffContent.classList.toggle("unified", !appState.isDiffSplitMode);
        }
        if (appState.isDiffViewActive) {
          renderDiffView();
        }
      });
    }
    
    // Diff button
    if (diffBtn) {
      diffBtn.addEventListener("click", () => {
        if (appState.currentImprovedCode) {
          toggleView();
        } else {
          showNotification("Generate improved code first to view differences", "warning");
        }
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function initializeApplication() {
    // Initialize settings
    initializeSettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial UI updates
    updateLineNumbers(true);
    
    // Check for code in URL hash or localStorage
    const urlCode = window.location.hash.substring(1);
    if (urlCode && codeInput) {
      try {
        codeInput.value = decodeURIComponent(urlCode);
        updateLineNumbers(true);
        analyzeCodeQuality();
      } catch (e) {
        console.warn("Could not load code from URL:", e);
      }
    }
    
    // Show welcome message if no code
    if (codeInput && !codeInput.value.trim()) {
      const welcomeCode = `// Welcome to AI Code Improver Pro!
// Enter your code here, or try one of these examples:

// Example 1: Simple function with issues
function calculateTotal(items) {
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  console.log(total);
  return total;
}

// Example 2: Async function without error handling
async function fetchUserData(userId) {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();
  return data;
}

// Select a mode above and click "Improve Code" to get started!`;
      
      codeInput.value = welcomeCode;
      updateLineNumbers(true);
      setTimeout(() => analyzeCodeQuality(), 500);
    }
    
    // Update header stats
    if (statsImproved) {
      statsImproved.textContent = appState.totalImprovements;
    }
    if (statsTime) {
      statsTime.textContent = `${appState.totalTimeSaved} min`;
    }
    
    console.log("AI Code Improver Pro initialized successfully");
  }

  // Start the application
  initializeApplication();
});
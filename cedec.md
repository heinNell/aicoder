// AI Code Improver Pro - Enhanced Script
// Supports multiple AI providers and 8 improvement modes

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // DOM ELEMENTS
  // ============================================

  // Code Panels
  const codeInput = document.getElementById("codeInput");
  const lineNumbers = document.getElementById("lineNumbers");
  const outputCode = document.getElementById("outputCode");
  const outputSection = document.getElementById("outputSection");
  const diffView = document.getElementById("diffView");
  const comparisonSection = document.getElementById("comparisonSection");
  const outputCodeSecondary = document.getElementById("outputCodeSecondary");
  const emptyState = document.getElementById("emptyState");
  const outputContent = document.querySelector(".output-content");

  // Stats
  const lineCount = document.getElementById("lineCount");
  const charCount = document.getElementById("charCount");
  const detectedLang = document.getElementById("detectedLanguage");
  const languageSelect = document.getElementById("languageSelect");

  // Quick Actions
  const clearBtn = document.getElementById("clearAllBtn");
  const formatBtn = document.getElementById("formatBtn");
  const compareBtn = document.getElementById("compareBtn");
  const historyBtn = document.getElementById("historyBtn");
  const exportBtn = document.getElementById("exportBtn");

  // Controls
  const improveBtn = document.getElementById("improveBtn");
  const convertTargetGroup = document.getElementById("targetLangGroup");
  const convertTarget = document.getElementById("targetLanguage");
  const additionalInstructions = document.getElementById(
    "additionalInstructions",
  );

  // Settings Elements
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

  // Loading
  const loadingOverlay = document.getElementById("loading");
  const loadingText = document.getElementById("loadingText");
  const loadingStep = document.getElementById("loadingStep");

  // Analysis Panel
  const tabBtns = document.querySelectorAll(".tab-btn");
  const changesTab = document.getElementById("changesTab");
  const metricsTab = document.getElementById("metricsTab");
  const chatTab = document.getElementById("chatTab");
  const explanationText = document.getElementById("explanationText");

  // Metrics
  const metricLinesChanged = document.getElementById("metricLinesChanged");
  const metricQuality = document.getElementById("metricQuality");
  const metricTime = document.getElementById("metricTime");
  const metricTokens = document.getElementById("metricTokens");

  // Chat
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");

  // Modals
  const historyModal = document.getElementById("historyModal");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const exportModal = document.getElementById("exportModal");

  // Output Panel Actions
  const copyBtn = document.getElementById("copyBtn");
  const copyBtnSecondary = document.getElementById("copyBtnSecondary");
  const toggleViewBtn = document.getElementById("toggleViewBtn");

  // Diff View Elements
  const diffContainer = document.getElementById("diffContainer");
  const diffContent = document.getElementById("diffContent");
  const diffOriginal = document.getElementById("diffOriginal");
  const diffImproved = document.getElementById("diffImproved");
  const diffModeToggle = document.getElementById("diffModeToggle");

  // Natural Language to Code Elements
  const nlInputGroup = document.getElementById("nlInputGroup");
  const nlDescription = document.getElementById("nlDescription");
  const nlChips = document.querySelectorAll(".nl-chip");

  // Quick Prompts
  const quickPrompts = document.querySelectorAll(".quick-prompt");

  // Header Stats
  const statsImproved = document.getElementById("statsImproved");
  const statsTime = document.getElementById("statsTime");

  // ============================================
  // STATE
  // ============================================

  let currentCode = "";
  let currentImprovedCode = "";
  let currentExplanation = "";
  let currentMode = "error-repair";
  let chatHistory = [];
  let improvementHistory = [];
  let processStartTime = null;
  let isDiffViewActive = false;
  let isDiffSplitMode = true;
  let totalImprovements = parseInt(
    localStorage.getItem("aicodeimp_total") || "0",
  );
  let totalTimeSaved = parseInt(localStorage.getItem("aicodeimp_time") || "0");

  // Update header stats
  if (statsImproved) statsImproved.textContent = totalImprovements;
  if (statsTime) statsTime.textContent = totalTimeSaved + "min";

  // ============================================
  // PROVIDER CONFIGURATION
  // ============================================

  const providerModels = {
    mock: [{ id: "mock", name: "Demo Mode (Simulated)" }],
    openai: [
      // GPT-5 Series (Latest)
      { id: "gpt-5", name: "GPT-5 🔥 (Most Advanced)" },
      { id: "gpt-5-2025-08-07", name: "GPT-5 (Aug 2025)" },
      { id: "gpt-5-chat-latest", name: "GPT-5 Chat Latest" },
      { id: "gpt-5-mini", name: "GPT-5 Mini (Faster)" },
      { id: "gpt-5-nano", name: "GPT-5 Nano (Compact)" },
      { id: "gpt-5-nano-2025-08-07", name: "GPT-5 Nano (Aug 2025)" },
      // GPT-4.1 Series
      { id: "gpt-4.1", name: "GPT-4.1 (Latest 4-series)" },
      { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
      { id: "gpt-4.1-mini-2025-04-14", name: "GPT-4.1 Mini (Apr 2025)" },
      { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
      { id: "gpt-4.1-nano-2025-04-14", name: "GPT-4.1 Nano (Apr 2025)" },
      // GPT-4o Series
      { id: "gpt-4o-2024-11-20", name: "GPT-4o (Nov 2024)" },
      { id: "gpt-4o-audio-preview", name: "GPT-4o Audio Preview" },
      { id: "gpt-4o-mini-realtime-preview", name: "GPT-4o Mini Realtime" },
      { id: "gpt-4o-realtime-preview", name: "GPT-4o Realtime" },
      // GPT-4 Series
      { id: "gpt-4", name: "GPT-4" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-4-turbo-2024-04-09", name: "GPT-4 Turbo (Apr 2024)" },
      // GPT-3.5 Series
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Budget)" },
      { id: "gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo (Jan 2025)" },
      // Other Models
      { id: "o3-mini-2025-01-31", name: "o3 Mini (Reasoning)" },
      { id: "dall-e-2", name: "DALL-E 2 (Image Gen)" },
      { id: "omni-moderation-latest", name: "Omni Moderation" },
    ],
    openrouter: [
      // Anthropic Claude
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (Best)" },
      {
        id: "anthropic/claude-3.5-sonnet:beta",
        name: "Claude 3.5 Sonnet Beta",
      },
      { id: "anthropic/claude-3-opus", name: "Claude 3 Opus (Most Capable)" },
      { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku (Fast)" },
      { id: "anthropic/claude-2.1", name: "Claude 2.1" },
      { id: "anthropic/claude-2", name: "Claude 2" },
      { id: "anthropic/claude-instant-1", name: "Claude Instant (Budget)" },

      // OpenAI
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "openai/gpt-4", name: "GPT-4" },
      { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      { id: "openai/o1-preview", name: "o1 Preview (Reasoning)" },
      { id: "openai/o1-mini", name: "o1 Mini (Reasoning)" },

      // Google
      { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
      { id: "google/gemini-pro", name: "Gemini Pro" },
      { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5 (Fast)" },
      { id: "google/palm-2-chat-bison", name: "PaLM 2 Chat" },
      { id: "google/gemma-2-9b-it", name: "Gemma 2 9B" },

      // Meta Llama
      {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B (Latest)",
      },
      {
        id: "meta-llama/llama-3.2-90b-vision-instruct",
        name: "Llama 3.2 90B Vision",
      },
      {
        id: "meta-llama/llama-3.2-11b-vision-instruct",
        name: "Llama 3.2 11B Vision",
      },
      {
        id: "meta-llama/llama-3.1-405b-instruct",
        name: "Llama 3.1 405B (Largest)",
      },
      { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
      { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B (Free)" },
      { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" },
      { id: "meta-llama/llama-3-8b-instruct", name: "Llama 3 8B" },

      // Mistral
      { id: "mistralai/mistral-large", name: "Mistral Large" },
      { id: "mistralai/mistral-medium", name: "Mistral Medium" },
      { id: "mistralai/mistral-small", name: "Mistral Small" },
      { id: "mistralai/mistral-tiny", name: "Mistral Tiny" },
      { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B" },
      { id: "mistralai/mixtral-8x22b-instruct", name: "Mixtral 8x22B" },
      { id: "mistralai/codestral-latest", name: "Codestral (Code Specialist)" },
      { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B" },

      // Cohere
      { id: "cohere/command-r-plus", name: "Command R+ (Best)" },
      { id: "cohere/command-r", name: "Command R" },
      { id: "cohere/command", name: "Command" },
      { id: "cohere/command-light", name: "Command Light" },

      // DeepSeek
      { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek/deepseek-coder", name: "DeepSeek Coder" },

      // Perplexity
      {
        id: "perplexity/llama-3.1-sonar-huge-128k-online",
        name: "Sonar Huge (Online)",
      },
      {
        id: "perplexity/llama-3.1-sonar-large-128k-online",
        name: "Sonar Large (Online)",
      },
      {
        id: "perplexity/llama-3.1-sonar-small-128k-online",
        name: "Sonar Small (Online)",
      },

      // Qwen
      { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B" },
      { id: "qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B" },
      { id: "qwen/qwen-2-7b-instruct", name: "Qwen 2 7B" },

      // Others
      { id: "microsoft/wizardlm-2-8x22b", name: "WizardLM 2 8x22B" },
      { id: "databricks/dbrx-instruct", name: "DBRX Instruct" },
      { id: "nvidia/nemotron-4-340b-instruct", name: "Nemotron 4 340B" },
      { id: "01-ai/yi-large", name: "Yi Large" },
      { id: "phind/phind-codellama-34b", name: "Phind CodeLlama 34B" },
    ],
    groq: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile (Best)" },
      { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B Versatile" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant (Fastest)" },
      { id: "llama3-70b-8192", name: "Llama 3 70B" },
      { id: "llama3-8b-8192", name: "Llama 3 8B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B" },
      { id: "gemma-7b-it", name: "Gemma 7B" },
      { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision" },
      { id: "llama-3.2-11b-vision-preview", name: "Llama 3.2 11B Vision" },
      { id: "llama-3.2-3b-preview", name: "Llama 3.2 3B" },
      { id: "llama-3.2-1b-preview", name: "Llama 3.2 1B (Light)" },
    ],
    ollama: [
      // Llama
      { id: "llama3.2:1b", name: "Llama 3.2 1B (Lightest)" },
      { id: "llama3.2:3b", name: "Llama 3.2 3B (Light)" },
      { id: "llama3.2", name: "Llama 3.2 (Default)" },
      { id: "llama3.1:8b", name: "Llama 3.1 8B" },
      { id: "llama3.1:70b", name: "Llama 3.1 70B" },
      { id: "llama3.1", name: "Llama 3.1 (Default)" },
      { id: "llama3:8b", name: "Llama 3 8B" },
      { id: "llama3:70b", name: "Llama 3 70B" },
      { id: "llama3", name: "Llama 3" },
      { id: "llama2:7b", name: "Llama 2 7B" },
      { id: "llama2:13b", name: "Llama 2 13B" },
      { id: "llama2:70b", name: "Llama 2 70B" },
      { id: "llama2", name: "Llama 2" },

      // Code Models
      { id: "codellama:7b", name: "Code Llama 7B" },
      { id: "codellama:13b", name: "Code Llama 13B" },
      { id: "codellama:34b", name: "Code Llama 34B" },
      { id: "codellama", name: "Code Llama (Default)" },
      { id: "deepseek-coder:6.7b", name: "DeepSeek Coder 6.7B" },
      { id: "deepseek-coder:33b", name: "DeepSeek Coder 33B" },
      { id: "deepseek-coder", name: "DeepSeek Coder (Default)" },
      { id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder 7B" },
      { id: "qwen2.5-coder:32b", name: "Qwen 2.5 Coder 32B" },
      { id: "qwen2.5-coder", name: "Qwen 2.5 Coder (Default)" },
      { id: "starcoder2:7b", name: "StarCoder 2 7B" },
      { id: "starcoder2:15b", name: "StarCoder 2 15B" },
      { id: "starcoder2", name: "StarCoder 2" },

      // Mistral
      { id: "mistral:7b", name: "Mistral 7B" },
      { id: "mistral", name: "Mistral" },
      { id: "mixtral:8x7b", name: "Mixtral 8x7B" },
      { id: "mixtral:8x22b", name: "Mixtral 8x22B" },
      { id: "mixtral", name: "Mixtral (Default)" },

      // Qwen
      { id: "qwen2.5:7b", name: "Qwen 2.5 7B" },
      { id: "qwen2.5:14b", name: "Qwen 2.5 14B" },
      { id: "qwen2.5:32b", name: "Qwen 2.5 32B" },
      { id: "qwen2.5:72b", name: "Qwen 2.5 72B" },
      { id: "qwen2.5", name: "Qwen 2.5 (Default)" },
      { id: "qwen2:7b", name: "Qwen 2 7B" },
      { id: "qwen2", name: "Qwen 2" },

      // Gemma
      { id: "gemma2:2b", name: "Gemma 2 2B" },
      { id: "gemma2:9b", name: "Gemma 2 9B" },
      { id: "gemma2:27b", name: "Gemma 2 27B" },
      { id: "gemma2", name: "Gemma 2 (Default)" },
      { id: "gemma:7b", name: "Gemma 7B" },
      { id: "gemma", name: "Gemma" },

      // Phi
      { id: "phi3:mini", name: "Phi 3 Mini" },
      { id: "phi3:medium", name: "Phi 3 Medium" },
      { id: "phi3", name: "Phi 3" },

      // Others
      { id: "neural-chat", name: "Neural Chat" },
      { id: "starling-lm", name: "Starling LM" },
      { id: "vicuna", name: "Vicuna" },
      { id: "orca-mini", name: "Orca Mini" },
      { id: "wizard-vicuna-uncensored", name: "Wizard Vicuna (Uncensored)" },
      { id: "nous-hermes2", name: "Nous Hermes 2" },
      { id: "dolphin-mixtral", name: "Dolphin Mixtral" },
      { id: "solar", name: "Solar" },
    ],
  };

  const providerHints = {
    openai:
      'Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>',
    openrouter:
      'Get your API key from <a href="https://openrouter.ai/keys" target="_blank">OpenRouter</a> - Supports many models',
    groq: 'Get your FREE API key from <a href="https://console.groq.com/keys" target="_blank">Groq Console</a> - Fast!',
    ollama:
      'Run models locally with <a href="https://ollama.ai" target="_blank">Ollama</a> - No API key needed',
  };

  // ============================================
  // LANGUAGE DETECTION
  // ============================================

  const languagePatterns = {
    javascript: [/\bconst\b/, /\blet\b/, /=>/, /function\s*\(/, /console\.log/],
    typescript: [
      /:\s*(string|number|boolean|any)/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
    ],
    python: [/\bdef\s+\w+\(/, /import\s+\w+/, /print\s*\(/, /:\s*$/, /self\./],
    java: [
      /public\s+class/,
      /public\s+static\s+void\s+main/,
      /System\.out\.println/,
    ],
    csharp: [/using\s+System/, /namespace\s+\w+/, /Console\.WriteLine/],
    go: [/package\s+main/, /func\s+main\(\)/, /import\s+"fmt"/, /fmt\.Println/],
    rust: [/fn\s+main\(\)/, /let\s+mut\s+/, /println!\(/, /impl\s+\w+/],
    php: [/<\?php/, /\$\w+\s*=/, /echo\s+/, /function\s+\w+\s*\(/],
    ruby: [/def\s+\w+/, /puts\s+/, /end\s*$/, /class\s+\w+\s*</],
    html: [/<html/, /<head>/, /<body>/, /<div/, /<\/\w+>/],
    css: [/\{[\s\S]*:[\s\S]*;[\s\S]*\}/, /@media/, /\.[\w-]+\s*\{/],
    sql: [/SELECT\s+/i, /FROM\s+/i, /INSERT\s+INTO/i, /CREATE\s+TABLE/i],
    bash: [/^#!/, /\becho\b/, /\bif\s+\[/, /\bfi\b/, /\bdone\b/],
    json: [/^\s*\{[\s\S]*"[\w]+"\s*:/, /^\s*\[[\s\S]*\]$/],
  };

  function detectLanguage(code) {
    const scores = {};
    for (const [lang, patterns] of Object.entries(languagePatterns)) {
      scores[lang] = patterns.filter((p) => p.test(code)).length;
    }
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best && best[1] > 0 ? best[0] : "auto";
  }

  // ============================================
  // LINE NUMBERS (Optimized for large files)
  // ============================================

  let cachedLineCount = 0;
  let lineNumbersCache = "";
  let updateTimeout = null;
  const MAX_RENDERED_LINES = 10000; // Limit for performance

  function generateLineNumbers(count) {
    // Use array for efficient string building
    const lines = new Array(count);
    for (let i = 0; i < count; i++) {
      lines[i] = i + 1;
    }
    return lines.join("\n");
  }

  function updateLineNumbers(immediate = false) {
    if (!codeInput || !lineNumbers) return;

    const lines = codeInput.value.split("\n").length;
    const displayLines = Math.min(Math.max(lines, 10), MAX_RENDERED_LINES);

    // Only regenerate line numbers if count changed
    if (displayLines !== cachedLineCount) {
      cachedLineCount = displayLines;
      lineNumbersCache = generateLineNumbers(displayLines);
      lineNumbers.textContent = lineNumbersCache;

      // Adjust min-width based on digit count for large numbers
      const digitCount = String(displayLines).length;
      lineNumbers.style.minWidth = Math.max(50, digitCount * 10 + 20) + "px";
    }

    // Update stats
    if (lineCount) lineCount.textContent = "Lines: " + lines.toLocaleString();
    if (charCount)
      charCount.textContent =
        "Chars: " + codeInput.value.length.toLocaleString();

    // Detect language (debounced for large files)
    if (immediate || codeInput.value.length < 5000) {
      const lang = detectLanguage(codeInput.value);
      if (lang !== "auto" && detectedLang) {
        detectedLang.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        detectedLang.style.display = "inline-block";
        if (languageSelect) languageSelect.value = lang;
      } else if (detectedLang) {
        detectedLang.style.display = "none";
      }
    }
  }

  function debouncedUpdateLineNumbers() {
    // Immediate update for stats visibility
    if (lineCount) {
      const lines = codeInput.value.split("\n").length;
      lineCount.textContent = "Lines: " + lines.toLocaleString();
    }
    if (charCount) {
      charCount.textContent =
        "Chars: " + codeInput.value.length.toLocaleString();
    }

    // Debounce the expensive operations
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => updateLineNumbers(true), 100);
  }

  if (codeInput) {
    codeInput.addEventListener("input", () => {
      debouncedUpdateLineNumbers();
      analyzeCodeQuality(); // Add quality analysis
    });
    codeInput.addEventListener("scroll", () => {
      if (lineNumbers) lineNumbers.scrollTop = codeInput.scrollTop;
    });
    codeInput.addEventListener("paste", () => {
      // Force immediate update after paste
      setTimeout(() => {
        updateLineNumbers(true);
        analyzeCodeQuality();
      }, 0);
    });
    updateLineNumbers(true);
  }

  // ============================================
  // CODE QUALITY ANALYZER
  // ============================================

  const qualityPanel = document.getElementById("qualityScorePanel");
  const qualityValue = document.getElementById("qualityValue");
  const qualityBar = document.getElementById("qualityBar");
  const qualityIssues = document.getElementById("qualityIssues");
  const complexityValue = document.getElementById("complexityValue");
  const functionsCount = document.getElementById("functionsCount");
  const issuesCount = document.getElementById("issuesCount");

  let qualityAnalysisTimeout = null;

  function analyzeCodeQuality() {
    // Debounce quality analysis
    if (qualityAnalysisTimeout) clearTimeout(qualityAnalysisTimeout);
    
    qualityAnalysisTimeout = setTimeout(() => {
      if (!codeInput || !codeInput.value.trim()) {
        if (qualityPanel) qualityPanel.style.display = "none";
        return;
      }

      if (qualityPanel) qualityPanel.style.display = "block";
      
      const code = codeInput.value;
      const analysis = performQualityAnalysis(code);
      
      // Update quality score
      if (qualityValue) {
        qualityValue.textContent = analysis.score + "/100";
      }
      
      // Update quality bar
      if (qualityBar) {
        qualityBar.style.width = analysis.score + "%";
        if (analysis.score >= 85) {
          qualityBar.setAttribute("data-level", "excellent");
        } else if (analysis.score >= 70) {
          qualityBar.setAttribute("data-level", "good");
        } else if (analysis.score >= 50) {
          qualityBar.setAttribute("data-level", "fair");
        } else {
          qualityBar.setAttribute("data-level", "poor");
        }
      }
      
      // Update issues
      if (qualityIssues) {
        qualityIssues.innerHTML = "";
        if (analysis.issues.length > 0) {
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
        }
      }
      
      // Update complexity metrics
      if (complexityValue) complexityValue.textContent = analysis.complexity;
      if (functionsCount) functionsCount.textContent = analysis.functions;
      if (issuesCount) issuesCount.textContent = analysis.issues.length;
      
      // Generate AI suggestions
      generateAISuggestions();
    }, 300);
  }

  function performQualityAnalysis(code) {
    const issues = [];
    let score = 100;
    
    // Count functions
    const functionMatches = code.match(/function\s+\w+|=>\s*{|:\s*function|\bdef\s+\w+/g) || [];
    const functionCount = functionMatches.length;
    
    // Calculate cyclomatic complexity (simplified)
    const complexityPatterns = [
      /\bif\s*\(/g, /\belse\s+if\s*\(/g, /\bwhile\s*\(/g,
      /\bfor\s*\(/g, /\bcase\s+/g, /\bcatch\s*\(/g,
      /\|\|/g, /&&/g, /\?/g
    ];
    let complexity = 1; // Base complexity
    complexityPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    // Check for common issues
    
    // 1. Missing semicolons (JavaScript/TypeScript)
    if (detectLanguage(code).match(/javascript|typescript/)) {
      const lines = code.split('\n');
      let missingSemicolons = 0;
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && 
            !trimmed.endsWith(';') && 
            !trimmed.endsWith('{') && 
            !trimmed.endsWith('}') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('/*') &&
            !trimmed.startsWith('*') &&
            trimmed.match(/^(const|let|var|return|break|continue)\s+/) &&
            !trimmed.match(/=>\s*$/)
           ) {
          missingSemicolons++;
        }
      });
      if (missingSemicolons > 0) {
        issues.push({
          severity: "warning",
          icon: "⚠️",
          message: `${missingSemicolons} line(s) missing semicolons`
        });
        score -= Math.min(missingSemicolons * 2, 10);
      }
    }
    
    // 2. Use of var instead of const/let
    const varUsage = (code.match(/\bvar\s+/g) || []).length;
    if (varUsage > 0) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: `Avoid using 'var' (found ${varUsage})`
      });
      score -= Math.min(varUsage * 3, 15);
    }
    
    // 3. Console logs (potential debugging leftover)
    const consoleLogs = (code.match(/console\.log/g) || []).length;
    if (consoleLogs > 2) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${consoleLogs} console.log statements found`
      });
      score -= Math.min(consoleLogs, 5);
    }
    
    // 4. Long functions (complexity check)
    if (complexity > 20) {
      issues.push({
        severity: "error",
        icon: "🔴",
        message: `High complexity (${complexity}) - consider refactoring`
      });
      score -= 20;
    } else if (complexity > 10) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: `Moderate complexity (${complexity})`
      });
      score -= 10;
    }
    
    // 5. No error handling
    const hasErrorHandling = /try\s*{|catch\s*\(|\.catch\(/.test(code);
    const hasAsyncAwait = /async\s+|await\s+/.test(code);
    if (hasAsyncAwait && !hasErrorHandling && code.length > 200) {
      issues.push({
        severity: "error",
        icon: "🔴",
        message: "Async code without error handling"
      });
      score -= 15;
    }
    
    // 6. No comments in long code
    const hasComments = /\/\/|\/\*|\#/.test(code);
    if (!hasComments && code.length > 500) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: "Consider adding comments"
      });
      score -= 5;
    }
    
    // 7. Nested callbacks (callback hell)
    const callbackDepth = (code.match(/function\s*\([^)]*\)\s*{\s*[^}]*function/g) || []).length;
    if (callbackDepth > 2) {
      issues.push({
        severity: "warning",
        icon: "⚠️",
        message: "Deep callback nesting detected"
      });
      score -= 10;
    }
    
    // 8. Magic numbers
    const magicNumbers = code.match(/\b\d{3,}\b/g);
    if (magicNumbers && magicNumbers.length > 2) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: "Consider extracting magic numbers to constants"
      });
      score -= 5;
    }
    
    // 9. TODO/FIXME comments
    const todos = (code.match(/TODO|FIXME|XXX|HACK/gi) || []).length;
    if (todos > 0) {
      issues.push({
        severity: "info",
        icon: "📝",
        message: `${todos} TODO/FIXME comment(s) found`
      });
    }
    
    // 10. Long lines
    const longLines = code.split('\n').filter(line => line.length > 120).length;
    if (longLines > 5) {
      issues.push({
        severity: "info",
        icon: "ℹ️",
        message: `${longLines} lines exceed 120 characters`
      });
      score -= 5;
    }
    
    // Ensure score doesn't go below 0
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: Math.round(score),
      complexity: Math.min(complexity, 99),
      functions: functionCount,
      issues: issues
    };
  }

  // ============================================
  // AI SUGGESTIONS GENERATOR
  // ============================================

  const aiSuggestionsPanel = document.getElementById("aiSuggestionsPanel");
  const suggestionsList = document.getElementById("suggestionsList");
  const refreshSuggestionsBtn = document.getElementById("refreshSuggestions");

  let suggestionsTimeout = null;
  let lastAnalysisResult = null;

  function generateAISuggestions() {
    if (suggestionsTimeout) clearTimeout(suggestionsTimeout);
    
    suggestionsTimeout = setTimeout(() => {
      if (!codeInput || !codeInput.value.trim()) {
        if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "none";
        return;
      }

      const code = codeInput.value;
      const analysis = lastAnalysisResult || performQualityAnalysis(code);
      lastAnalysisResult = analysis;
      
      const suggestions = createSuggestions(code, analysis);
      
      if (suggestions.length > 0) {
        if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "block";
        if (suggestionsList) {
          suggestionsList.innerHTML = "";
          suggestions.slice(0, 3).forEach((suggestion, index) => {
            const suggestionEl = createSuggestionElement(suggestion, index);
            suggestionsList.appendChild(suggestionEl);
          });
        }
      } else {
        if (aiSuggestionsPanel) aiSuggestionsPanel.style.display = "none";
      }
    }, 500);
  }

  function createSuggestions(code, analysis) {
    const suggestions = [];
    const lang = detectLanguage(code);
    
    // Suggestion 1: Refactor complex code
    if (analysis.complexity > 10) {
      suggestions.push({
        id: "refactor-complexity",
        icon: "🔨",
        title: "Refactor Complex Code",
        badge: "Optimization",
        description: `Complexity score is ${analysis.complexity}. Break down complex logic into smaller, reusable functions.`,
        actions: [
          { label: "Auto Refactor", type: "primary", action: () => applyImprovement("optimize") },
          { label: "Explain", type: "secondary", action: () => applyImprovement("explain") }
        ]
      });
    }
    
    // Suggestion 2: Add error handling
    const hasErrorHandling = /try\s*{|catch\s*\(|\.catch\(/.test(code);
    const hasAsyncAwait = /async\s+|await\s+/.test(code);
    if ((hasAsyncAwait || analysis.functions > 2) && !hasErrorHandling) {
      suggestions.push({
        id: "add-error-handling",
        icon: "🛡️",
        title: "Add Error Handling",
        badge: "Security",
        description: "No error handling detected. Add try-catch blocks to prevent crashes.",
        actions: [
          { label: "Add Try-Catch", type: "primary", action: () => applyImprovement("error-repair") },
          { label: "Learn More", type: "secondary", action: () => showErrorHandlingTip() }
        ]
      });
    }
    
    // Suggestion 3: Add documentation
    const hasComments = /\/\/|\/\*|\#|'''|"""/g.test(code);
    if (!hasComments && code.length > 300) {
      suggestions.push({
        id: "add-docs",
        icon: "📚",
        title: "Add Documentation",
        badge: "Quality",
        description: "No comments found. Add JSDoc/docstrings to explain your code's purpose.",
        actions: [
          { label: "Auto Document", type: "primary", action: () => applyImprovement("document") },
          { label: "Skip", type: "secondary", action: () => {} }
        ]
      });
    }
    
    // Suggestion 4: Use modern syntax
    const hasVar = /\bvar\s+/.test(code);
    const oldCallbacks = /function\s*\([^)]*\)\s*{\s*[^}]*function/.test(code);
    if ((hasVar || oldCallbacks) && lang === "javascript") {
      suggestions.push({
        id: "modernize",
        icon: "✨",
        title: "Modernize Syntax",
        badge: "Enhancement",
        description: "Use ES6+ features: const/let, arrow functions, async/await instead of callbacks.",
        actions: [
          { label: "Modernize", type: "primary", action: () => applyImprovement("visual-enhancement") },
          { label: "Preview", type: "secondary", action: () => {} }
        ]
      });
    }
    
    // Suggestion 5: Optimize performance
    if (analysis.complexity < 5 && analysis.functions > 5) {
      suggestions.push({
        id: "optimize-performance",
        icon: "⚡",
        title: "Optimize Performance",
        badge: "Performance",
        description: "Consider memoization, lazy loading, or caching for better performance.",
        actions: [
          { label: "Optimize", type: "primary", action: () => applyImprovement("optimize") },
          { label: "Analyze", type: "secondary", action: () => {} }
        ]
      });
    }
    
    // Suggestion 6: Security scan
    const securityRisks = [
      /eval\s*\(/,
      /innerHTML\s*=/,
      /dangerouslySetInnerHTML/,
      /\$\{.*\}/  // Template injection risk
    ];
    const hasSecurityRisk = securityRisks.some(pattern => pattern.test(code));
    if (hasSecurityRisk) {
      suggestions.push({
        id: "security-scan",
        icon: "🔒",
        title: "Security Scan",
        badge: "Critical",
        description: "Potential security vulnerabilities detected (eval, innerHTML, etc.)",
        actions: [
          { label: "Fix Now", type: "primary", action: () => applyImprovement("security") },
          { label: "Details", type: "secondary", action: () => {} }
        ]
      });
    }
    
    return suggestions;
  }

  function createSuggestionElement(suggestion, index) {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.style.animationDelay = `${index * 0.1}s`;
    
    div.innerHTML = `
      <div class="suggestion-header">
        <div class="suggestion-title">
          <span class="suggestion-icon">${suggestion.icon}</span>
          <span>${suggestion.title}</span>
        </div>
        <span class="suggestion-badge">${suggestion.badge}</span>
      </div>
      <div class="suggestion-description">${suggestion.description}</div>
      <div class="suggestion-actions" id="suggestion-actions-${suggestion.id}"></div>
    `;
    
    // Add action buttons
    const actionsContainer = div.querySelector(`#suggestion-actions-${suggestion.id}`);
    suggestion.actions.forEach(action => {
      const button = document.createElement("button");
      button.className = `suggestion-action-btn ${action.type}`;
      button.textContent = action.label;
      button.onclick = action.action;
      actionsContainer.appendChild(button);
    });
    
    return div;
  }

  function applyImprovement(mode) {
    // Set the mode
    const modeRadio = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (modeRadio) {
      modeRadio.checked = true;
      currentMode = mode;
    }
    
    // Trigger improvement
    if (improveBtn && !improveBtn.disabled) {
      improveBtn.click();
    }
  }

  function showErrorHandlingTip() {
    if (chatMessages && chatTab) {
      chatTab.click();
      const tip = `
        <div class="chat-message ai">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <strong>Error Handling Best Practices:</strong><br>
            1. Always wrap async/await in try-catch<br>
            2. Handle promise rejections with .catch()<br>
            3. Validate input before processing<br>
            4. Log errors for debugging<br>
            5. Provide user-friendly error messages
          </div>
        </div>
      `;
      chatMessages.innerHTML += tip;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Refresh suggestions button
  if (refreshSuggestionsBtn) {
    refreshSuggestionsBtn.addEventListener("click", () => {
      lastAnalysisResult = null;
      generateAISuggestions();
    });
  }

  // ============================================
  // MODE SELECTION
  // ============================================

  const modeCards = document.querySelectorAll('.mode-card input[name="mode"]');

  modeCards.forEach((radio) => {
    radio.addEventListener("change", function () {
      currentMode = this.value;
      if (convertTargetGroup) {
        convertTargetGroup.style.display =
          currentMode === "convert" ? "block" : "none";
      }
      // Show/hide Natural Language input
      if (nlInputGroup) {
        nlInputGroup.style.display =
          currentMode === "nl-to-code" ? "block" : "none";
      }
    });
  });

  // Natural Language Chips
  nlChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      if (nlDescription) {
        nlDescription.value = this.dataset.text;
        nlDescription.focus();
      }
    });
  });

  // ============================================
  // QUICK ACTIONS
  // ============================================

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all code?")) {
        codeInput.value = "";
        updateLineNumbers();
      }
    });
  }

  if (formatBtn) {
    formatBtn.addEventListener("click", () => {
      let code = codeInput.value;
      const lines = code.split("\n");
      let indent = 0;
      code = lines
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed.match(/^[}\])]/) || trimmed.match(/^end\b/))
            indent = Math.max(0, indent - 1);
          const result = "  ".repeat(indent) + trimmed;
          if (trimmed.match(/[{[(]$/) || trimmed.match(/:\s*$/)) indent++;
          return result;
        })
        .join("\n");
      codeInput.value = code;
      updateLineNumbers();
    });
  }

  if (historyBtn)
    historyBtn.addEventListener("click", () => showHistoryModal());
  if (exportBtn) exportBtn.addEventListener("click", () => showExportModal());

  // ============================================
  // SETTINGS
  // ============================================

  function initializeSettings() {
    const savedProvider = localStorage.getItem("aicodeimp_provider") || "mock";
    if (aiProvider) {
      aiProvider.value = savedProvider;
      updateModels();
      updateApiKeyVisibility();
    }

    const savedModel = localStorage.getItem("aicodeimp_model");
    if (savedModel && aiModel) aiModel.value = savedModel;

    const savedKey = localStorage.getItem(
      "aicodeimp_" + savedProvider + "_key",
    );
    if (savedKey && apiKeyInput) apiKeyInput.value = savedKey;

    const savedOllamaUrl = localStorage.getItem("aicodeimp_ollama_url");
    if (savedOllamaUrl && ollamaUrl) ollamaUrl.value = savedOllamaUrl;

    const savedHistory = localStorage.getItem("aicodeimp_history");
    if (savedHistory) improvementHistory = JSON.parse(savedHistory);
  }

  function updateModels() {
    if (!aiProvider || !aiModel) return;
    const provider = aiProvider.value;
    const models = providerModels[provider] || [];

    aiModel.innerHTML = "";
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name;
      aiModel.appendChild(option);
    });

    const savedKey = localStorage.getItem("aicodeimp_" + provider + "_key");
    if (apiKeyInput) apiKeyInput.value = savedKey || "";
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
    if (aiProvider)
      localStorage.setItem("aicodeimp_provider", aiProvider.value);
    if (aiModel) localStorage.setItem("aicodeimp_model", aiModel.value);
    if (ollamaUrl)
      localStorage.setItem("aicodeimp_ollama_url", ollamaUrl.value);
  }

  if (settingsToggle) {
    settingsToggle.addEventListener("click", () => {
      if (settingsSection) settingsSection.classList.toggle("collapsed");
    });
  }

  if (aiProvider) {
    aiProvider.addEventListener("change", () => {
      updateModels();
      updateApiKeyVisibility();
      saveSettings();
    });
  }

  if (aiModel) aiModel.addEventListener("change", saveSettings);

  if (toggleApiKeyBtn) {
    toggleApiKeyBtn.addEventListener("click", () => {
      if (apiKeyInput.type === "password") {
        apiKeyInput.type = "text";
        toggleApiKeyBtn.textContent = "🔒";
      } else {
        apiKeyInput.type = "password";
        toggleApiKeyBtn.textContent = "👁️";
      }
    });
  }

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener("click", () => {
      const provider = aiProvider.value;
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem("aicodeimp_" + provider + "_key", key);
        showMessage("API key saved!", "success");
      }
    });
  }

  initializeSettings();

  // ============================================
  // MAIN IMPROVE FUNCTION
  // ============================================

  if (improveBtn) improveBtn.addEventListener("click", handleImprove);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleImprove();
    }
    if (e.ctrlKey && e.key === "h") {
      e.preventDefault();
      showHistoryModal();
    }
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      showExportModal();
    }
  });

  async function handleImprove() {
    if (!codeInput) return;
    const code = codeInput.value.trim();
    const instructions = additionalInstructions
      ? additionalInstructions.value.trim()
      : "";
    const provider = aiProvider ? aiProvider.value : "mock";

    // For NL-to-code mode, check description instead of code
    if (currentMode === "nl-to-code") {
      const description = nlDescription ? nlDescription.value.trim() : "";
      if (!description && !instructions) {
        showMessage("Please describe what code you want to generate!", "error");
        if (nlDescription) nlDescription.focus();
        return;
      }
    } else if (!code) {
      showMessage("Please enter some code!", "error");
      return;
    }

    if (provider !== "mock" && provider !== "ollama") {
      const apiKey =
        (apiKeyInput ? apiKeyInput.value.trim() : "") ||
        localStorage.getItem("aicodeimp_" + provider + "_key");
      if (!apiKey) {
        showMessage(
          "Please enter your " + provider.toUpperCase() + " API key.",
          "error",
        );
        if (settingsSection) settingsSection.classList.remove("collapsed");
        return;
      }
    }

    if (loadingOverlay) loadingOverlay.style.display = "flex";
    if (improveBtn) improveBtn.disabled = true;
    processStartTime = Date.now();

    const steps = [
      "Analyzing code structure...",
      "Identifying improvements...",
      "Generating optimized code...",
      "Finalizing response...",
    ];
    let stepIndex = 0;
    
    // Animate progress bar
    const progressBar = document.getElementById("progressBar");
    let progress = 0;
    
    const stepInterval = setInterval(() => {
      if (loadingStep)
        loadingStep.textContent = steps[stepIndex % steps.length];
      stepIndex++;
      
      // Update progress bar
      if (progressBar) {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressBar.style.width = progress + "%";
      }
    }, 800);

    try {
      currentCode = code;
      const result = await improveCode(code, currentMode, instructions);

      clearInterval(stepInterval);

      currentImprovedCode = result.improvedCode;
      currentExplanation = result.explanation;

      displayResults(result);
      saveToHistory(code, result, currentMode);
      updateStats();
    } catch (err) {
      clearInterval(stepInterval);
      showMessage("Error: " + err.message, "error");
      console.error(err);
    } finally {
      if (loadingOverlay) loadingOverlay.style.display = "none";
      if (improveBtn) improveBtn.disabled = false;
    }
  }

  function displayResults(result) {
    if (emptyState) emptyState.style.display = "none";
    if (outputSection) outputSection.style.display = "block";

    // Reset diff view when new results come in
    isDiffViewActive = false;
    if (diffContainer) diffContainer.style.display = "none";
    if (diffBtn) diffBtn.textContent = "🔄";

    if (outputCode) {
      outputCode.style.display = "block";
      outputCode.textContent = result.improvedCode;
      if (typeof Prism !== "undefined") {
        const lang =
          (languageSelect ? languageSelect.value : null) ||
          detectLanguage(result.improvedCode);
        outputCode.className = "language-" + lang;
        Prism.highlightElement(outputCode);
      }
    }

    const explanationStr = Array.isArray(result.explanation)
      ? result.explanation.join("\n")
      : String(result.explanation || "Code improved.");
    if (explanationText) {
      if (typeof marked !== "undefined") {
        explanationText.innerHTML = marked.parse(explanationStr);
      } else {
        explanationText.innerHTML = explanationStr
          .replace(/\n/g, "<br>")
          .replace(/•/g, "✦");
      }
    }

    // Show the analysis panel
    const analysisPanel = document.getElementById("analysisPanel");
    if (analysisPanel) analysisPanel.style.display = "block";

    const timeElapsed = ((Date.now() - processStartTime) / 1000).toFixed(1);
    const originalLines = currentCode.split("\n").length;
    const newLines = result.improvedCode.split("\n").length;
    const linesChanged = Math.abs(newLines - originalLines);

    if (metricLinesChanged)
      metricLinesChanged.textContent =
        linesChanged > 0 ? "+" + linesChanged : "0";
    if (metricQuality)
      metricQuality.textContent =
        calculateQualityScore(result.improvedCode) + "%";
    if (metricTime) metricTime.textContent = timeElapsed + "s";
    if (metricTokens)
      metricTokens.textContent = estimateTokens(result.improvedCode);

    chatHistory = [];
    if (chatMessages) {
      chatMessages.innerHTML =
        '<div class="chat-message ai"><div class="message-avatar">🤖</div><div class="message-content">Code improved! Ask me anything about the changes.</div></div>';
    }

    if (outputSection)
      outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function calculateQualityScore(code) {
    let score = 70;
    if (code.includes("//") || code.includes("/*")) score += 10;
    if (code.split("\n").length > 5) score += 5;
    if (!/var\s+/.test(code)) score += 5;
    if (/try\s*{/.test(code)) score += 5;
    if (/const\s+/.test(code)) score += 5;
    return Math.min(100, score);
  }

  function estimateTokens(code) {
    return Math.ceil(code.length / 4);
  }

  // ============================================
  // PROMPT BUILDER
  // ============================================

  function buildPrompt(code, mode, instructions) {
    const modePrompts = {
      "error-repair": {
        title: "Error Repair",
        task: "Fix any errors, bugs, or issues in this code.",
        focus: ["Syntax errors", "Logic bugs", "Runtime errors", "Edge cases"],
      },
      enhance: {
        title: "Code Enhancement",
        task: "Improve readability, structure, and maintainability.",
        focus: ["Better naming", "Cleaner structure", "Modern patterns"],
      },
      "visual-enhancement": {
        title: "Code Enhancement",
        task: "Improve readability, structure, and maintainability.",
        focus: ["Better naming", "Cleaner structure", "Modern patterns"],
      },
      optimize: {
        title: "Performance Optimization",
        task: "Optimize for better performance.",
        focus: ["Time complexity", "Space complexity", "Resource usage"],
      },
      document: {
        title: "Documentation",
        task: "Add comprehensive documentation.",
        focus: ["JSDoc/docstrings", "Inline comments", "Usage examples"],
      },
      security: {
        title: "Security Audit",
        task: "Find and fix security vulnerabilities.",
        focus: ["Input validation", "Injection prevention", "Auth issues"],
      },
      test: {
        title: "Test Generation",
        task: "Generate unit tests for this code.",
        focus: ["Edge cases", "Happy paths", "Error scenarios"],
      },
      convert: {
        title: "Language Conversion",
        task:
          "Convert to " +
          ((convertTarget ? convertTarget.value : null) || "Python") +
          ".",
        focus: ["Syntax translation", "Idiomatic patterns"],
      },
      explain: {
        title: "Code Explanation",
        task: "Explain what this code does.",
        focus: ["Line-by-line analysis", "Algorithm explanation"],
      },
      "nl-to-code": {
        title: "Natural Language to Code",
        task: "Generate code based on the user's description.",
        focus: [
          "Clean code",
          "Best practices",
          "Well-structured",
          "Production-ready",
        ],
      },
    };

    const modeConfig = modePrompts[mode] || modePrompts["enhance"];

    // Special handling for NL-to-code mode
    if (mode === "nl-to-code") {
      const description = nlDescription ? nlDescription.value.trim() : "";
      const targetLang = languageSelect ? languageSelect.value : "javascript";

      const systemPrompt =
        "You are an expert code generator. Generate clean, production-ready code based on user descriptions.\n\n" +
        "IMPORTANT: Your response MUST be a valid JSON object with two fields:\n" +
        '1. "improvedCode": The generated code.\n' +
        '2. "explanation": A concise explanation of the implementation details (markdown supported).';

      let userPrompt =
        "Generate " +
        targetLang.toUpperCase() +
        " code for the following:\n\n" +
        "DESCRIPTION: " +
        (description || instructions || "Generate a simple example") +
        "\n\n" +
        "Requirements:\n" +
        "- Write clean, well-structured code\n" +
        "- Add helpful comments\n" +
        "- Use modern patterns and best practices\n" +
        "- Make it production-ready\n\n" +
        "Provide valid JSON response with 'improvedCode' and 'explanation' fields.";

      if (code && code.trim()) {
        userPrompt += "\n\nContext/reference code to consider:\n" + code;
      }

      return { systemPrompt, userPrompt };
    }

    const systemPrompt =
      "You are an expert code assistant for " +
      modeConfig.title +
      ".\n\nIMPORTANT: Your response MUST be a valid JSON object with two fields:\n" +
      '1. "improvedCode": The complete code after your changes.\n' +
      '2. "explanation": A concise summary of what you changed and why (markdown supported).\n\n' +
      "Focus: " +
      modeConfig.focus.join(", ");

    let userPrompt =
      "MODE: " +
      modeConfig.title +
      "\nTASK: " +
      modeConfig.task +
      "\n\nProvide valid JSON response with 'improvedCode' and 'explanation' fields.\n\nCODE:\n" +
      code;

    if (instructions) {
      userPrompt += "\n\nADDITIONAL: " + instructions;
    }

    return { systemPrompt, userPrompt };
  }

  // ============================================
  // AI PROVIDER CALLS
  // ============================================

  async function improveCode(code, mode, instructions) {
    const provider = aiProvider ? aiProvider.value : "mock";

    if (provider === "mock") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return mockImprove(code, mode, instructions);
    }

    const { systemPrompt, userPrompt } = buildPrompt(code, mode, instructions);

    let response;
    switch (provider) {
      case "openai":
        response = await callOpenAI(systemPrompt, userPrompt);
        break;
      case "openrouter":
        response = await callOpenRouter(systemPrompt, userPrompt);
        break;
      case "groq":
        response = await callGroq(systemPrompt, userPrompt);
        break;
      case "ollama":
        response = await callOllama(systemPrompt, userPrompt);
        break;
      default:
        throw new Error("Unknown provider");
    }

    return parseAIResponse(response);
  }

  function parseAIResponse(response) {
    let code = response.trim();

    // Remove markdown code blocks if present
    const codeBlockMatch = code.match(/```[\w]*\n?([\s\S]*?)```/);
    if (codeBlockMatch) {
      code = codeBlockMatch[1].trim();
    }

    // Try to extract from JSON if the AI still returned JSON
    try {
      if (code.startsWith("{") && code.includes("improvedCode")) {
        const parsed = JSON.parse(code);
        if (parsed.improvedCode) {
          return {
            improvedCode: parsed.improvedCode,
            explanation: parsed.explanation || "Code improved by AI.",
          };
        }
      }
    } catch (e) {
      // Not valid JSON, continue with the code as-is
    }

    // Try to find JSON embedded in the response
    try {
      const jsonMatch = response.match(
        /\{[\s\S]*?"improvedCode"\s*:\s*"([\s\S]*?)"[\s\S]*?\}/,
      );
      if (jsonMatch) {
        // Extract the improvedCode value and unescape it
        let extractedCode = jsonMatch[1]
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
        return {
          improvedCode: extractedCode,
          explanation: "Code improved by AI.",
        };
      }
    } catch (e) {
      // JSON extraction failed
    }

    // Remove common AI response prefixes
    code = code
      .replace(/^(Here'?s?|The|Your|Below is|Following is)[^:]*:\s*/i, "")
      .replace(/^(Improved|Fixed|Enhanced|Optimized) code:\s*/i, "")
      .trim();

    // Return the cleaned code
    return {
      improvedCode: code,
      explanation: "Code processed by AI.",
    };
  }

  async function callOpenAI(systemPrompt, userPrompt) {
    const apiKey =
      (apiKeyInput ? apiKeyInput.value.trim() : "") ||
      localStorage.getItem("aicodeimp_openai_key");
    const model = aiModel ? aiModel.value : "gpt-4o";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async function callOpenRouter(systemPrompt, userPrompt) {
    const apiKey =
      (apiKeyInput ? apiKeyInput.value.trim() : "") ||
      localStorage.getItem("aicodeimp_openrouter_key");
    const model = aiModel ? aiModel.value : "anthropic/claude-3.5-sonnet";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
          "HTTP-Referer": window.location.href,
          "X-Title": "AI Code Improver Pro",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenRouter API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async function callGroq(systemPrompt, userPrompt) {
    const apiKey =
      (apiKeyInput ? apiKeyInput.value.trim() : "") ||
      localStorage.getItem("aicodeimp_groq_key");
    const model = aiModel ? aiModel.value : "llama-3.3-70b-versatile";

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Groq API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async function callOllama(systemPrompt, userPrompt) {
    const baseUrl =
      (ollamaUrl ? ollamaUrl.value.trim() : "") || "http://localhost:11434";
    const model = aiModel ? aiModel.value : "llama3.2:1b";

    try {
      const response = await fetch(baseUrl + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: false,
          options: { temperature: 0.3 },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          "Ollama error (" +
            response.status +
            "): " +
            (errorText || response.statusText),
        );
      }

      const data = await response.json();
      return data.message.content;
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        throw new Error(
          "Cannot connect to Ollama at " +
            baseUrl +
            ". Ensure:\n" +
            "1. Ollama is running\n" +
            '2. Start with: OLLAMA_ORIGINS="*" ollama serve\n' +
            "3. Model pulled: ollama pull " +
            model,
        );
      }
      throw err;
    }
  }

  // ============================================
  // MOCK IMPROVEMENT
  // ============================================

  function mockImprove(code, mode, instructions) {
    const improvements = [];
    let improvedCode = code;

    switch (mode) {
      case "error-repair":
        if (!code.trim().endsWith(";") && !code.trim().endsWith("}")) {
          improvedCode = code
            .split("\n")
            .map((line) => {
              if (
                line.trim() &&
                !line.trim().endsWith(";") &&
                !line.trim().endsWith("{") &&
                !line.trim().endsWith("}") &&
                !line.trim().startsWith("//")
              ) {
                return line + ";";
              }
              return line;
            })
            .join("\n");
          improvements.push("• Added missing semicolons");
        }
        improvements.push("• Checked syntax errors");
        improvements.push("• Validated structure");
        break;

      case "enhance":
        improvedCode = improvedCode.replace(/\bvar\b/g, "const");
        improvements.push("• Converted var to const");
        improvements.push("• Improved readability");
        improvements.push("• Applied modern patterns");
        break;

      case "optimize":
        improvements.push("• Analyzed complexity");
        improvements.push("• Optimized loops");
        improvements.push("• Reduced allocations");
        break;

      case "document":
        if (!code.startsWith("/**")) {
          improvedCode =
            "/**\n * @description Auto-generated\n */\n" + improvedCode;
        }
        improvements.push("• Added JSDoc header");
        improvements.push("• Added comments");
        break;

      case "security":
        improvements.push("• Checked input validation");
        improvements.push("• Verified no credentials");
        improvements.push("• Assessed vulnerabilities");
        break;

      case "test":
        improvedCode =
          "// Original Code\n" +
          code +
          "\n\n// Tests\ndescribe('Tests', () => {\n  test('works', () => {\n    expect(true).toBe(true);\n  });\n});";
        improvements.push("• Generated test suite");
        improvements.push("• Added assertions");
        break;

      case "convert":
        improvements.push(
          "• Converted to " +
            ((convertTarget ? convertTarget.value : null) || "python"),
        );
        improvements.push("• Applied idioms");
        break;

      case "explain":
        improvements.push("• This code processes data");
        improvements.push("• Key operations identified");
        improvements.push("• Logic flow analyzed");
        break;

      case "nl-to-code":
        const description = nlDescription ? nlDescription.value.trim() : "";
        const targetLang = languageSelect ? languageSelect.value : "javascript";

        if (targetLang === "python") {
          improvedCode = `# Generated code based on: ${description || "your description"}\n\ndef main():\n    """\n    ${description || "Generated function"}\n    """\n    # TODO: Implement your logic here\n    result = None\n    \n    print("Implementation placeholder")\n    return result\n\nif __name__ == "__main__":\n    main()`;
        } else {
          improvedCode = `// Generated code based on: ${description || "your description"}\n\n/**\n * ${description || "Generated function"}\n * @returns {any} Result of the operation\n */\nfunction main() {\n  // TODO: Implement your logic here\n  let result = null;\n  \n  console.log("Implementation placeholder");\n  return result;\n}\n\nmain();`;
        }

        improvements.push(
          "• Generated " + targetLang + " code from description",
        );
        improvements.push("• Added documentation");
        improvements.push("• Created basic structure");
        improvements.push("• Ready for customization");
        break;
    }

    // Format
    const lines = improvedCode.split("\n");
    let indent = 0;
    improvedCode = lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.match(/^[}\])]/) || trimmed === "end")
          indent = Math.max(0, indent - 1);
        const result = "  ".repeat(indent) + trimmed;
        if (trimmed.match(/[{[(]$/) || trimmed.match(/:\s*$/)) indent++;
        return result;
      })
      .join("\n");

    return {
      improvedCode,
      explanation: improvements.join("\n") + "\n\n✨ Done! (Demo Mode)",
    };
  }

  // ============================================
  // HISTORY
  // ============================================

  function saveToHistory(original, result, mode) {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode,
      originalCode: original.substring(0, 200),
      improvedCode: result.improvedCode,
      explanation: result.explanation,
    };

    improvementHistory.unshift(entry);
    if (improvementHistory.length > 20) improvementHistory.pop();

    localStorage.setItem(
      "aicodeimp_history",
      JSON.stringify(improvementHistory),
    );
  }

  function showHistoryModal() {
    if (!historyModal || !historyList) return;
    historyList.innerHTML = "";

    if (improvementHistory.length === 0) {
      historyList.innerHTML =
        '<div class="empty-history">No history yet!</div>';
    } else {
      improvementHistory.forEach((item) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML =
          '<div class="history-info"><span class="history-mode">' +
          item.mode.replace("-", " ").toUpperCase() +
          '</span><span class="history-date">' +
          new Date(item.date).toLocaleString() +
          '</span></div><button class="icon-btn">→</button>';
        div.addEventListener("click", () => {
          if (codeInput) codeInput.value = item.originalCode;
          if (outputCode) {
            outputCode.style.display = "block";
            outputCode.textContent = item.improvedCode;
          }
          if (explanationText)
            explanationText.innerHTML = item.explanation.replace(/\n/g, "<br>");
          if (emptyState) emptyState.style.display = "none";
          if (outputSection) outputSection.style.display = "block";
          closeModal(historyModal);
          updateLineNumbers();
        });
        historyList.appendChild(div);
      });
    }

    historyModal.style.display = "flex";
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Clear all history?")) {
        improvementHistory = [];
        localStorage.removeItem("aicodeimp_history");
        showHistoryModal();
      }
    });
  }

  // ============================================
  // EXPORT
  // ============================================

  function showExportModal() {
    if (exportModal) exportModal.style.display = "flex";
  }

  const exportCode = document.getElementById("exportCode");
  const exportMarkdown = document.getElementById("exportMarkdown");
  const exportJSON = document.getElementById("exportJSON");
  const exportClipboard = document.getElementById("exportClipboard");

  if (exportCode) {
    exportCode.addEventListener("click", () => {
      downloadFile(
        currentImprovedCode || (outputCode ? outputCode.textContent : ""),
        "improved-code.txt",
        "text/plain",
      );
      closeModal(exportModal);
    });
  }

  if (exportMarkdown) {
    exportMarkdown.addEventListener("click", () => {
      const md =
        "# Improved Code\n\n```\n" +
        (currentImprovedCode || (outputCode ? outputCode.textContent : "")) +
        "\n```\n\n## Explanation\n" +
        (currentExplanation ||
          (explanationText ? explanationText.textContent : ""));
      downloadFile(md, "improved-code.md", "text/markdown");
      closeModal(exportModal);
    });
  }

  if (exportJSON) {
    exportJSON.addEventListener("click", () => {
      const json = JSON.stringify(
        {
          original: currentCode,
          improved:
            currentImprovedCode || (outputCode ? outputCode.textContent : ""),
          explanation:
            currentExplanation ||
            (explanationText ? explanationText.textContent : ""),
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );
      downloadFile(json, "improved-code.json", "application/json");
      closeModal(exportModal);
    });
  }

  if (exportClipboard) {
    exportClipboard.addEventListener("click", () => {
      navigator.clipboard.writeText(
        currentImprovedCode || (outputCode ? outputCode.textContent : ""),
      );
      showMessage("Copied!", "success");
      closeModal(exportModal);
    });
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================
  // MODAL HELPERS
  // ============================================

  function closeModal(modal) {
    if (modal) modal.style.display = "none";
  }

  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal"));
    });
  });

  [historyModal, exportModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // ============================================
  // TABS
  // ============================================

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      if (changesTab)
        changesTab.style.display = tab === "changes" ? "block" : "none";
      if (metricsTab)
        metricsTab.style.display = tab === "metrics" ? "block" : "none";
      if (chatTab) chatTab.style.display = tab === "chat" ? "block" : "none";
    });
  });

  // ============================================
  // AI CHAT (Enhanced)
  // ============================================

  if (chatSendBtn) chatSendBtn.addEventListener("click", sendChatMessage);
  if (chatInput)
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendChatMessage();
    });

  // Quick prompts functionality
  quickPrompts.forEach((prompt) => {
    prompt.addEventListener("click", function () {
      if (chatInput) {
        chatInput.value = this.dataset.prompt;
        sendChatMessage();
      }
    });
  });

  async function sendChatMessage() {
    if (!chatInput || !chatMessages) return;
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message with avatar
    chatMessages.innerHTML +=
      '<div class="chat-message user"><div class="message-avatar">👤</div><div class="message-content">' +
      escapeHtml(message) +
      "</div></div>";
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add typing indicator
    const typingId = "typing-" + Date.now();
    chatMessages.innerHTML +=
      '<div class="chat-message ai" id="' +
      typingId +
      '"><div class="message-avatar">🤖</div><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const provider = aiProvider ? aiProvider.value : "mock";
      let response;

      if (provider === "mock") {
        await new Promise((r) => setTimeout(r, 800));
        response = getMockChatResponse(message);
      } else {
        const systemPrompt =
          "You are a helpful code assistant. You are discussing code improvements with the user. " +
          "Be concise and helpful. The user has just improved their code and may have questions. " +
          "Focus on being practical and giving actionable advice.";

        const userPrompt =
          'User question: "' +
          message +
          '"\n\n' +
          "Context:\n" +
          "Original Code (first 500 chars):\n" +
          (currentCode ? currentCode.substring(0, 500) : "N/A") +
          "\n\n" +
          "Improved Code (first 500 chars):\n" +
          (currentImprovedCode
            ? currentImprovedCode.substring(0, 500)
            : "N/A") +
          "\n\n" +
          "Mode used: " +
          currentMode +
          "\n\n" +
          "Provide a helpful, concise response.";

        switch (provider) {
          case "openai":
            response = await callOpenAI(systemPrompt, userPrompt);
            break;
          case "openrouter":
            response = await callOpenRouter(systemPrompt, userPrompt);
            break;
          case "groq":
            response = await callGroq(systemPrompt, userPrompt);
            break;
          case "ollama":
            response = await callOllama(systemPrompt, userPrompt);
            break;
        }
      }

      // Remove typing indicator and add response
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      chatMessages.innerHTML +=
        '<div class="chat-message ai"><div class="message-avatar">🤖</div><div class="message-content">' +
        formatChatResponse(response) +
        "</div></div>";
    } catch (err) {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      chatMessages.innerHTML +=
        '<div class="chat-message ai"><div class="message-avatar">🤖</div><div class="message-content" style="color: #ff6b6b;">Error: ' +
        escapeHtml(err.message) +
        "</div></div>";
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getMockChatResponse(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("what") && lowerMsg.includes("change")) {
      return "The main changes include improved code structure, better variable naming, and fixed potential issues. The code now follows modern best practices.";
    }
    if (lowerMsg.includes("why")) {
      return "These improvements make the code more maintainable, readable, and less prone to bugs. Modern patterns also improve performance and developer experience.";
    }
    if (lowerMsg.includes("issue") || lowerMsg.includes("problem")) {
      return "The original code had some potential issues with error handling and edge cases. The improved version addresses these concerns.";
    }
    if (
      lowerMsg.includes("improve") ||
      lowerMsg.includes("more") ||
      lowerMsg.includes("further")
    ) {
      return "You could further improve this code by:\n• Adding unit tests\n• Implementing error boundaries\n• Adding input validation\n• Using TypeScript for type safety";
    }

    return (
      'I analyzed your code with "' +
      currentMode +
      '" mode. The improvements focus on code quality and best practices. What specific aspect would you like me to explain?'
    );
  }

  function formatChatResponse(text) {
    // Convert markdown-like formatting to HTML
    return escapeHtml(text)
      .replace(/\n/g, "<br>")
      .replace(
        /`([^`]+)`/g,
        '<code style="background: rgba(0,255,249,0.1); padding: 2px 5px; border-radius: 3px;">$1</code>',
      )
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/• /g, "✦ ");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // OUTPUT ACTIONS
  // ============================================

  if (copyBtn) {
    copyBtn.addEventListener("click", () =>
      copyToClipboard(outputCode.textContent),
    );
  }
  if (copyBtnSecondary) {
    copyBtnSecondary.addEventListener("click", () =>
      copyToClipboard(outputCodeSecondary.textContent),
    );
  }

  toggleViewBtn.addEventListener("click", () => {
    if (currentView === "code") {
      renderDiffView();
      outputSection.classList.add("hidden");
      diffView.classList.remove("hidden");
      toggleViewBtn.innerHTML = "↔️ Code";
      currentView = "diff";
    } else {
      outputSection.classList.remove("hidden");
      diffView.classList.add("hidden");
      toggleViewBtn.innerHTML = "↔️ Diff";
      currentView = "code";
    }
  });

  // Diff mode toggle (split/unified)
  if (diffModeToggle) {
    diffModeToggle.addEventListener("click", () => {
      isDiffSplitMode = !isDiffSplitMode;
      diffModeToggle.textContent = isDiffSplitMode
        ? "Split View"
        : "Unified View";
      if (diffContent) {
        diffContent.classList.toggle("unified", !isDiffSplitMode);
      }
      if (isDiffViewActive) {
        renderDiffView();
      }
    });
  }


});

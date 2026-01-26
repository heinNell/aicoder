# AI Code Improver Pro - Developer API Reference

## Overview

This document provides technical details for developers who want to understand, extend, or integrate with the AI Code Improver Pro application.

---

## Architecture

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with custom properties
- **Syntax Highlighting**: Prism.js v1.29.0
- **Diff Visualization**: diff2html
- **AI Integration**: Multiple providers (OpenAI, OpenRouter, Groq, Ollama)

### File Structure

```
/workspaces/aicoder/
├── index.html          # Main HTML structure (673 lines)
├── styles.css          # Complete styling (3,455 lines)
├── script.js           # Application logic (1,579 lines)
├── README.md           # Project documentation
├── USER_GUIDE.md       # End-user documentation
├── ENHANCEMENTS_REPORT.md  # Enhancement summary
└── VALIDATION_REPORT.md    # Validation results
```

---

## Core Functions

### 1. Quality Analysis System

#### `analyzeCodeQuality()`

```javascript
analyzeCodeQuality();
```

**Purpose**: Debounced function that triggers code quality analysis.

**Behavior**:

- Clears previous timeout
- Waits 300ms before analyzing
- Prevents excessive calculations during typing

**Called By**: Input event listener on code textarea

**Calls**: `performQualityAnalysis()`

---

#### `performQualityAnalysis(code)`

```javascript
performQualityAnalysis(code);
```

**Purpose**: Analyzes code and returns quality metrics.

**Parameters**:

- `code` (string): The code to analyze

**Returns**: Object

```javascript
{
  score: number,        // 0-100 quality score
  complexity: number,   // Complexity metric
  functions: number,    // Number of functions detected
  issues: Array<{
    type: string,      // Issue category
    count: number,     // Number of occurrences
    severity: string,  // 'high', 'medium', 'low'
    description: string // Human-readable explanation
  }>
}
```

**Analysis Rules**:

1. **Missing Semicolons** (Medium severity)

   - Pattern: Lines ending without `;` (excluding `{`, `}`, `)`)
   - Penalty: 2 points per occurrence

2. **Var Usage** (High severity)

   - Pattern: `var` keyword
   - Penalty: 3 points per occurrence
   - Recommendation: Use `const` or `let`

3. **Console.log** (Low severity)

   - Pattern: `console.log(`
   - Penalty: 1 point per occurrence
   - Recommendation: Remove in production

4. **High Complexity** (High severity)

   - Pattern: Long functions (>50 lines)
   - Penalty: 5 points per function
   - Recommendation: Refactor into smaller functions

5. **Missing Error Handling** (High severity)

   - Pattern: No try-catch blocks
   - Penalty: 5 points if missing
   - Recommendation: Add proper error handling

6. **Insufficient Comments** (Medium severity)

   - Pattern: Comment ratio < 5% of code
   - Penalty: 3 points
   - Recommendation: Add explanatory comments

7. **Callback Hell** (High severity)

   - Pattern: `function(` nested patterns
   - Penalty: 4 points per occurrence
   - Recommendation: Use async/await

8. **Magic Numbers** (Medium severity)

   - Pattern: Hardcoded numbers in logic
   - Penalty: 2 points per occurrence
   - Recommendation: Use named constants

9. **TODO Comments** (Low severity)

   - Pattern: `// TODO` or `// FIXME`
   - Penalty: 1 point per occurrence
   - Recommendation: Complete pending tasks

10. **Long Lines** (Low severity)
    - Pattern: Lines > 120 characters
    - Penalty: 1 point per occurrence
    - Recommendation: Break into multiple lines

**Score Calculation**:

```javascript
finalScore = Math.max(0, 100 - totalPenalty);
```

---

### 2. AI Suggestions System

#### `generateAISuggestions()`

```javascript
generateAISuggestions();
```

**Purpose**: Generates context-aware improvement suggestions.

**Behavior**:

1. Gets code from input area
2. Performs quality analysis
3. Creates suggestions based on detected issues
4. Updates suggestions panel DOM

**Called By**:

- Input event listener (debounced)
- After quality analysis update

**Calls**: `createSuggestions(code, analysis)`

---

#### `createSuggestions(code, analysis)`

```javascript
createSuggestions(code, analysis);
```

**Purpose**: Creates specific suggestion objects based on code analysis.

**Parameters**:

- `code` (string): The code to analyze
- `analysis` (object): Result from `performQualityAnalysis()`

**Returns**: Array of suggestion objects

```javascript
[
  {
    id: string, // Unique identifier
    title: string, // Display title
    description: string, // Explanation
    priority: string, // 'high', 'medium', 'low'
    mode: string, // Improvement mode to trigger
    condition: boolean, // Whether to show this suggestion
  },
];
```

**Suggestion Types**:

1. **Refactor Complex Functions**

   - **Trigger**: `analysis.complexity > 15 || analysis.functions > 10`
   - **Mode**: `clean-refactor`
   - **Priority**: High
   - **Description**: Break down complex logic into smaller, focused functions

2. **Add Error Handling**

   - **Trigger**: Has issue with type "Missing Error Handling"
   - **Mode**: `code-quality`
   - **Priority**: High
   - **Description**: Add try-catch blocks and input validation

3. **Add Documentation**

   - **Trigger**: Has issue with type "Insufficient Comments"
   - **Mode**: `add-documentation`
   - **Priority**: Medium
   - **Description**: Add JSDoc comments and explanatory notes

4. **Modernize Syntax**

   - **Trigger**: Has "Var Usage" or "Callback Hell" issues
   - **Mode**: `clean-refactor`
   - **Priority**: Medium
   - **Description**: Convert to modern ES6+ syntax

5. **Optimize Performance**

   - **Trigger**: `code.length > 1000`
   - **Mode**: `performance-optimization`
   - **Priority**: Medium
   - **Description**: Improve efficiency and reduce complexity

6. **Security Scan**
   - **Trigger**: Code contains potential security patterns
   - **Mode**: `security-hardening`
   - **Priority**: High
   - **Description**: Fix XSS, injection vulnerabilities, etc.

---

#### `applyImprovement(mode)`

```javascript
applyImprovement(mode);
```

**Purpose**: Applies a specific improvement mode to the code.

**Parameters**:

- `mode` (string): The improvement mode to apply
  - Valid values: `'refactor'`, `'errorHandling'`, `'docs'`, `'modernize'`, `'optimize'`, `'security'`

**Behavior**:

1. Maps friendly mode names to internal mode IDs
2. Triggers the improvement process
3. Shows loading state
4. Updates results when complete

**Mode Mapping**:

```javascript
{
  'refactor': 'clean-refactor',
  'errorHandling': 'code-quality',
  'docs': 'add-documentation',
  'modernize': 'clean-refactor',
  'optimize': 'performance-optimization',
  'security': 'security-hardening'
}
```

---

### 3. Visualization System

#### `updateComplexityChart(originalCode, improvedCode)`

```javascript
updateComplexityChart(originalCode, improvedCode);
```

**Purpose**: Updates the complexity comparison chart.

**Parameters**:

- `originalCode` (string): The original code
- `improvedCode` (string): The improved code

**Behavior**:

1. Calculates complexity for both versions
2. Computes reduction percentage
3. Updates DOM with animated bars
4. Triggers CSS animations

**DOM Updates**:

- `.complexity-bar.original` width
- `.complexity-bar.improved` width
- `.improvement-badge` text
- `.chart-legend-value` texts

**Calls**: `calculateComplexityScore(code)`

---

#### `calculateComplexityScore(code)`

```javascript
calculateComplexityScore(code);
```

**Purpose**: Calculates a weighted complexity score for code.

**Parameters**:

- `code` (string): The code to analyze

**Returns**: number (0-100+)

**Scoring Algorithm**:

```javascript
let score = 0;

// Conditional statements (if, else, switch)
score += (code.match(/\bif\b/g)?.length || 0) * 1;
score += (code.match(/\belse\b/g)?.length || 0) * 1;
score += (code.match(/\bswitch\b/g)?.length || 0) * 2;

// Loops
score += (code.match(/\bfor\b/g)?.length || 0) * 2;
score += (code.match(/\bwhile\b/g)?.length || 0) * 2;

// Functions
score += (code.match(/\bfunction\b/g)?.length || 0) * 3;
score += (code.match(/=>/g)?.length || 0) * 2;

// Logical operators
score += (code.match(/&&/g)?.length || 0) * 1;
score += (code.match(/\|\|/g)?.length || 0) * 1;

// Try-catch blocks
score += (code.match(/\btry\b/g)?.length || 0) * 2;

return score;
```

**Weights Explanation**:

- **Conditionals**: Lower weight (1-2) as they're common
- **Loops**: Medium weight (2) as they add complexity
- **Functions**: Higher weight (2-3) as they increase structure
- **Logical operators**: Low weight (1) but accumulate
- **Try-catch**: Medium weight (2) as they add paths

---

### 4. Enhanced Feedback System

#### `formatDetailedExplanation(explanation, originalCode, improvedCode)`

```javascript
formatDetailedExplanation(explanation, originalCode, improvedCode);
```

**Purpose**: Creates enhanced HTML explanation with stats and actions.

**Parameters**:

- `explanation` (string): AI-generated explanation text
- `originalCode` (string): Original code
- `improvedCode` (string): Improved code

**Returns**: string (HTML)

**Output Structure**:

```html
<div class="explanation-header">🎯 Improvement Summary</div>

<div class="stats-grid">
  <div class="stat-box">
    <div class="stat-label">Original Lines</div>
    <div class="stat-value">{originalLines}</div>
  </div>
  <div class="stat-box">
    <div class="stat-label">Improved Lines</div>
    <div class="stat-value">{improvedLines}</div>
  </div>
  <div class="stat-box">
    <div class="stat-label">Quality Improvement</div>
    <div class="stat-value">+{scoreDiff}%</div>
  </div>
</div>

<div class="changes-section">
  <h4>📋 Changes Made</h4>
  <ul class="changes-list">
    <li>{change1}</li>
    <li>{change2}</li>
    ...
  </ul>
</div>

<div class="next-steps">
  <h4>🚀 Next Steps</h4>
  <ul class="suggestions-actions">
    <li onclick="...">▶️ Run Another Improvement</li>
    <li onclick="...">📊 View Diff</li>
    <li onclick="...">📋 Copy Improved Code</li>
  </ul>
</div>
```

**Features**:

- Calculates line count differences
- Extracts quality score improvements
- Parses explanation into bullet points
- Adds interactive action buttons
- Applies cyberpunk styling

---

## Event Handlers

### Input Code Textarea

```javascript
document.getElementById("inputCode").addEventListener("input", function () {
  analyzeCodeQuality(); // Trigger quality analysis
  generateAISuggestions(); // Update suggestions
});
```

### Improve Button Click

```javascript
document
  .getElementById("improveBtn")
  .addEventListener("click", async function () {
    // Get configuration
    const code = inputCode.value;
    const mode = improvementMode.value;
    const provider = apiProvider.value;

    // Validate
    if (!code) {
      alert("Please enter code to improve");
      return;
    }

    // Show loading state
    showLoading();

    // Call AI API
    const result = await callAI(code, mode, provider);

    // Display results
    displayResults(result);

    // Update complexity chart
    updateComplexityChart(code, result.improvedCode);
  });
```

### Suggestion Click

```javascript
suggestionElement.addEventListener("click", function () {
  const mode = this.dataset.mode;
  applyImprovement(mode);
});
```

---

## AI Provider Integration

### Provider Configuration

```javascript
const API_CONFIGS = {
  openai: {
    baseURL: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-4.5-turbo", "gpt-4.1-turbo", "gpt-4o"],
    requiresKey: true,
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1/chat/completions",
    models: ["claude-3-opus", "llama-3-70b", "mistral-large"],
    requiresKey: true,
  },
  groq: {
    baseURL: "https://api.groq.com/openai/v1/chat/completions",
    models: ["llama3-70b-8192"],
    requiresKey: true,
  },
  ollama: {
    baseURL: "http://localhost:11434/api/chat",
    models: ["codellama", "mistral"],
    requiresKey: false,
  },
  mock: {
    requiresKey: false,
  },
};
```

### API Call Flow

1. User clicks "Improve Code"
2. `validateAndImprove()` checks for API key
3. `improveCode()` constructs request payload
4. Provider-specific API endpoint called
5. Response parsed and displayed
6. Quality analysis and chart updates triggered

---

## DOM Element IDs

### Input/Output

- `inputCode` - Main code input textarea
- `outputCode` - Improved code display
- `explanationContent` - Explanation text area
- `diffContent` - Diff visualization container
- `metricsContent` - Metrics display area

### Panels

- `qualityScorePanel` - Quality score display
- `qualityValue` - Numeric score
- `qualityBar` - Visual meter
- `qualityLevel` - Text level (Excellent/Good/etc.)
- `issuesList` - Detected issues list
- `complexityValue` - Complexity metric
- `functionsValue` - Function count

- `aiSuggestionsPanel` - Suggestions container
- `suggestionsList` - List of suggestions
- `refreshSuggestionsBtn` - Refresh button

- `complexityChart` - Chart container
- `originalBar` - Original complexity bar
- `improvedBar` - Improved complexity bar
- `improvementBadge` - Percentage improvement

### Buttons & Controls

- `improveBtn` - Main improve button
- `copyBtn` - Copy code button
- `configBtn` - Configuration button
- `saveConfigBtn` - Save configuration button

### Configuration

- `apiProvider` - Provider selector
- `apiModel` - Model selector
- `apiKey` - API key input
- `maxTokens` - Max tokens slider
- `temperature` - Temperature slider
- `additionalInstructions` - Custom instructions textarea

---

## CSS Classes

### Quality Panel

- `.quality-score-panel` - Main container
- `.quality-meter` - Score visualization
- `.quality-bar` - Animated bar
- `.quality-bar[data-level="excellent"]` - Green styling
- `.quality-bar[data-level="good"]` - Cyan styling
- `.quality-bar[data-level="fair"]` - Orange styling
- `.quality-bar[data-level="poor"]` - Red styling
- `.quality-issues` - Issues list container
- `.issue-item` - Individual issue

### Suggestions Panel

- `.ai-suggestions-panel` - Main container
- `.suggestions-list` - List container
- `.suggestion-item` - Individual suggestion
- `.suggestion-priority` - Priority badge
- `.suggestion-title` - Title text
- `.suggestion-description` - Description text
- `.suggestion-action` - Action button

### Complexity Chart

- `.complexity-chart` - Main container
- `.chart-bar-container` - Bar wrapper
- `.complexity-bar` - Animated bar
- `.complexity-bar.original` - Original code bar
- `.complexity-bar.improved` - Improved code bar
- `.improvement-badge` - Percentage label
- `.chart-legend` - Legend container

### Enhanced Explanation

- `.explanation-header` - Header with emoji
- `.stats-grid` - Grid layout for stats
- `.stat-box` - Individual stat container
- `.stat-label` - Stat name
- `.stat-value` - Stat value
- `.changes-section` - Changes list section
- `.changes-list` - Bullet list of changes
- `.next-steps` - Actions section
- `.suggestions-actions` - Action buttons list

---

## Local Storage

### Keys Used

- `ai_code_improver_api_key` - Encrypted API key
- `ai_code_improver_provider` - Selected provider
- `ai_code_improver_model` - Selected model
- `ai_code_improver_settings` - JSON string of settings

### Settings Object

```javascript
{
  maxTokens: number,           // 1000-50000
  temperature: number,         // 0.0-1.0
  additionalInstructions: string
}
```

---

## Extension Points

### Adding New Quality Checks

1. Add detection logic in `performQualityAnalysis()`:

```javascript
// Detect new issue
const newIssueCount = (code.match(/pattern/g) || []).length;
if (newIssueCount > 0) {
  issues.push({
    type: "New Issue Type",
    count: newIssueCount,
    severity: "medium",
    description: "Description of the issue",
  });
  score -= newIssueCount * penaltyPoints;
}
```

2. Update scoring logic accordingly

### Adding New Suggestion Types

1. Add suggestion in `createSuggestions()`:

```javascript
{
  id: 'new-suggestion',
  title: '✨ New Suggestion',
  description: 'What this suggestion does',
  priority: 'medium',
  mode: 'corresponding-mode',
  condition: /* boolean condition */
}
```

2. Ensure the `mode` maps to an existing improvement mode

### Adding New AI Providers

1. Add provider config:

```javascript
const API_CONFIGS = {
  // ... existing configs
  newprovider: {
    baseURL: "https://api.newprovider.com/v1/chat",
    models: ["model-1", "model-2"],
    requiresKey: true,
  },
};
```

2. Add provider option in HTML:

```html
<option value="newprovider">New Provider</option>
```

3. Handle provider-specific request format in `improveCode()`

---

## Performance Considerations

### Debouncing

- Quality analysis is debounced by 300ms
- Prevents excessive calculations during typing
- Balance between responsiveness and performance

### DOM Updates

- Suggestions panel only updates when content changes
- Complexity chart uses CSS animations (GPU accelerated)
- Code highlighting is done by Prism.js asynchronously

### Memory Management

- No memory leaks from event listeners
- Timeouts are properly cleared
- Large strings are not unnecessarily duplicated

---

## Browser Compatibility

### Required Features

- ES6+ (const, let, arrow functions, async/await, template literals)
- CSS Grid and Flexbox
- CSS Custom Properties
- Local Storage API
- Fetch API

### Tested Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Fallbacks

- Prism.js handles syntax highlighting across browsers
- CSS animations degrade gracefully
- Fetch API has broad support (no polyfill needed for modern browsers)

---

## Security Considerations

### API Key Storage

- Keys are stored in localStorage (not sessionStorage)
- Keys are sent only to selected API provider
- No keys are logged or exposed in console
- **Recommendation**: Implement encryption for production use

### XSS Prevention

- User input is displayed in `textContent` (not `innerHTML` where possible)
- Code is syntax-highlighted by Prism.js (handles escaping)
- **Caution**: Explanation HTML uses `innerHTML` for formatting

### Content Security Policy

Recommended CSP headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.openai.com https://openrouter.ai https://api.groq.com http://localhost:11434;
```

---

## Testing

### Manual Testing Checklist

- [ ] Quality score updates when typing
- [ ] Suggestions appear for low-quality code
- [ ] Clicking suggestions triggers improvement
- [ ] Complexity chart displays correctly
- [ ] Enhanced explanation formats properly
- [ ] All action buttons work
- [ ] Diff view displays changes
- [ ] Copy button copies code
- [ ] Configuration saves and loads
- [ ] API errors are handled gracefully

### Test Cases

1. **Empty Code**: Should show score of 100, no issues
2. **Poor Code**: Should show low score, multiple suggestions
3. **Good Code**: Should show high score, minimal suggestions
4. **Large Code**: Should handle 10K+ lines without lag
5. **Invalid API Key**: Should display clear error message

---

## Troubleshooting Guide

### Common Issues

#### Issue: Quality score shows NaN

**Cause**: Division by zero or invalid input
**Fix**: Add validation in `performQualityAnalysis()`

#### Issue: Suggestions panel is empty

**Cause**: All suggestion conditions are false
**Debug**: Log `analysis` object to see detected issues

#### Issue: Complexity chart bars don't animate

**Cause**: CSS animation not triggering
**Fix**: Ensure width is set and element is visible

#### Issue: Enhanced explanation breaks layout

**Cause**: Missing CSS classes or syntax error in HTML
**Fix**: Validate HTML structure and check for typos

---

## Future Development

### Planned Features

1. **Batch Processing**: Upload and process multiple files
2. **Advanced Chunking**: Handle files >100K lines
3. **Custom Rules**: User-defined quality checks
4. **Export Reports**: PDF/JSON export of analyses
5. **Interactive Diff**: Accept/reject individual changes
6. **Model Comparison**: Compare results from multiple AI models
7. **Plugin System**: Allow third-party extensions
8. **Real-time Collaboration**: Multiple users working on same code

### API Enhancements

- Streaming responses for large improvements
- Webhooks for async processing
- Rate limiting and quota management
- Caching frequently improved patterns

---

## License & Credits

### Libraries Used

- **Prism.js**: MIT License - Syntax highlighting
- **diff2html**: MIT License - Diff visualization

### Fonts

- **Orbitron**: SIL Open Font License
- **Rajdhani**: SIL Open Font License
- **JetBrains Mono**: SIL Open Font License

---

## Contact & Support

For technical questions or contributions:

- GitHub Issues: [Your repository]
- Email: [Your email]
- Documentation: [Your docs site]

---

_Last Updated: 2024_
_Version: 2.0_
_Status: Production Ready_

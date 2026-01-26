# Working with Large Codebases

## Understanding Token Limits

AI models have token limits that determine how much code they can process at once. A **token** is roughly 4 characters of code.

### Model Token Limits

| Provider      | Model             | Max Input Tokens | Max Lines (approx) |
| ------------- | ----------------- | ---------------- | ------------------ |
| **OpenAI**    | GPT-4o            | 120,000          | ~6,000             |
| **OpenAI**    | GPT-4o-mini       | 120,000          | ~6,000             |
| **OpenAI**    | GPT-4-turbo       | 120,000          | ~6,000             |
| **OpenAI**    | GPT-3.5-turbo     | 15,000           | ~750               |
| **Anthropic** | Claude 3.5 Sonnet | 180,000          | ~9,000             |
| **Anthropic** | Claude 3 Opus     | 180,000          | ~9,000             |
| **Anthropic** | Claude 3 Sonnet   | 180,000          | ~9,000             |
| **Anthropic** | Claude 3 Haiku    | 180,000          | ~9,000             |
| **Google**    | Gemini Pro        | 30,000           | ~1,500             |
| **Google**    | Gemini Pro Vision | 15,000           | ~750               |
| **Ollama**    | (varies)          | ~50,000          | ~2,500             |

## Solutions for Large Code

### 1. Use Models with Larger Context Windows

**Best for large codebases:**

- **Claude 3.5 Sonnet** - 180,000 tokens (≈9,000 lines)
- **GPT-4o** - 120,000 tokens (≈6,000 lines)

**Avoid for large files:**

- GPT-3.5-turbo - Only 15,000 tokens
- Gemini Pro Vision - Only 15,000 tokens

### 2. Split Your Code into Modules

Instead of improving an entire 10,000+ line file:

```
❌ single-file.js (10,000 lines) → Too large!

✅ Split into modules:
   ├── auth.js (500 lines)
   ├── database.js (800 lines)
   ├── api-routes.js (1,200 lines)
   └── utils.js (300 lines)
```

Improve each module separately.

### 3. Focus on Specific Functions

Instead of improving entire files, extract specific functions:

**Before:**

```javascript
// Entire file with 20 functions (5,000 lines)
function getUserData() { ... }
function processPayment() { ... }
// ... 18 more functions
```

**Better approach:**

1. Improve `getUserData()` function only
2. Improve `processPayment()` function only
3. Continue one function at a time

### 4. Use Different Modes Strategically

Some modes require less context:

- **Document** mode - Can handle larger files (just adds comments)
- **Explain** mode - Provides overview without rewriting
- **Test** mode - Can work on smaller units

Avoid for very large files:

- **Convert** mode - Rewrites everything
- **Optimize** mode - Analyzes all relationships

## Real-World Examples

### Example 1: Processing a 3,000 Line File

✅ **Works with most models:**

- GPT-4o, GPT-4-turbo: ✓
- Claude models: ✓
- GPT-3.5-turbo: ✗ (Too large)
- Gemini Pro: ✓ (Close to limit)

### Example 2: Processing a 10,000 Line File

✅ **Only works with:**

- Claude 3.5 Sonnet: ✓
- Claude 3 Opus: ✓

❌ **Too large for:**

- All GPT models: ✗
- All Gemini models: ✗
- Ollama (most models): ✗

**Recommendation:** Split into 5 files of 2,000 lines each

### Example 3: Processing a 20,000+ Line File

❌ **Too large for ALL models**

**Solutions:**

1. Split into multiple files (recommended 1,000-2,000 lines each)
2. Use version control and improve incrementally
3. Focus on specific modules or functions
4. Use the AI to help split the file first

## Token Estimation in the UI

The application shows real-time token estimates:

```
Lines: 1,234  Chars: 45,678  Words: 6,789  Tokens: ≈11,420 / 120,000
```

**Color indicators:**

- **Gray** - Safe range (< 80% of limit)
- **Orange** (warning) - Near limit (80-100%)
- **Red** (error) - Exceeds limit (blocked)

## Best Practices

### 1. Check Before Processing

Always check the token counter before clicking "Improve Code"

### 2. Choose the Right Model

- **Small files** (< 1,000 lines): Any model works
- **Medium files** (1,000-3,000 lines): GPT-4o, Claude, Gemini Pro
- **Large files** (3,000-8,000 lines): GPT-4o, Claude models only
- **Very large files** (> 8,000 lines): Claude models only or split the file

### 3. Optimize Your Workflow

**For refactoring large projects:**

```
1. Use "Explain" mode to understand the codebase
2. Split into logical modules
3. Improve each module individually
4. Test each improved module
5. Integrate gradually
```

### 4. Cost Consideration

Larger inputs = higher API costs:

- 100,000 tokens with GPT-4o ≈ $0.25-$0.50
- 100,000 tokens with Claude ≈ $0.80-$1.50

For large codebases, consider:

- Using cheaper models (GPT-4o-mini, Claude Haiku)
- Processing in smaller batches
- Using Ollama locally (free but slower)

## Error Messages

### "Code is too large"

**Meaning:** Your code exceeds the model's token limit

**Solutions:**

1. Switch to a model with larger context (Claude or GPT-4o)
2. Split your code into smaller files
3. Focus on specific functions or modules

### "Warning: Code is near the token limit"

**Meaning:** You're at 90% of the limit

**Risk:** The AI might not be able to return complete improved code

**Solutions:**

1. Reduce the input size slightly
2. Switch to a model with a larger limit
3. Proceed with caution (response may be incomplete)

## Tips for Maximum Code Size

### How to process 50,000+ lines of code:

1. **Split by features/modules**
   - auth/, api/, database/, ui/, utils/
2. **Use Git branches**

   - Create a branch per module improvement
   - Review and merge individually

3. **Document first**

   - Run "Document" mode on overview
   - Then improve functions based on documentation

4. **Automate splitting**

   - Use the AI to suggest logical splits
   - Ask: "How should I split this file into modules?"

5. **Use Ollama for unlimited size**
   - Install Ollama locally
   - Use larger local models
   - No token costs, but slower processing

## Summary

**Your 5,000 line code works with:**

- ✅ GPT-4o (limit: 6,000 lines)
- ✅ Claude models (limit: 9,000 lines)
- ❌ GPT-3.5-turbo (limit: 750 lines)

**To exceed 5,000 lines:**

1. Use Claude 3.5 Sonnet (best for large files)
2. Or split your code into smaller modules
3. Monitor the token counter in real-time

---

**Remember:** The token limits are there to ensure quality output. Larger inputs can result in incomplete or lower-quality improvements. When in doubt, split your code!

# 🤖 AI Code Improver

An intelligent web-based tool that helps you improve your code by fixing errors and applying visual enhancements using AI-powered suggestions.

## Features

- **Error Repair Mode**: Paste your code and console errors to get corrected code
- **Visual Enhancement Mode**: Improve code formatting, naming, and structure
- **Real-time Feedback**: Get explanations of what was improved
- **Copy to Clipboard**: Easily copy the improved code
- **User-Friendly Interface**: Clean, modern design with smooth interactions

## How to Use

1. Open `index.html` in your web browser
2. Paste your code snippet into the "Your Code" textarea
3. Select an improvement mode:
   - **Error Repair**: For fixing bugs and errors
   - **Visual Enhancement**: For improving code style and readability
4. (Optional) If you have a console error, paste it in the "Console Error" field
5. (Optional) Add any additional instructions for specific improvements
6. Click "✨ Improve Code" button
7. View the improved code and explanation
8. Click "📋 Copy to Clipboard" to copy the result

## Improvement Capabilities

### Error Repair Mode
- Fixes missing semicolons
- Declares undefined variables
- Adds missing quotes
- Fixes function syntax
- Adds error handling (try-catch blocks)
- Corrects common syntax errors

### Visual Enhancement Mode
- Improves variable naming
- Applies consistent indentation
- Adds explanatory comments
- Fixes line breaks and spacing
- Converts to modern JavaScript (ES6)
- Adds type annotations (TypeScript)

## Example Usage

### Example 1: Error Repair
**Input Code:**
```javascript
console.log(message)
let result = undefined_variable + 5
```

**Console Error:**
```
ReferenceError: undefined_variable is not defined
```

**Result:**
- Adds missing semicolons
- Declares the undefined variable
- Provides corrected, working code

### Example 2: Visual Enhancement
**Input Code:**
```javascript
function add(a,b){return a+b}
let x=5
```

**Result:**
- Improves formatting and indentation
- Adds proper spacing
- Adds explanatory comments
- Improves variable names

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **No Dependencies**: Pure web technologies, no frameworks required
- **Browser Compatibility**: Works in all modern browsers
- **Responsive Design**: Works on desktop and mobile devices

## Future Enhancements

- Integration with OpenAI API or Anthropic Claude for real AI improvements
- Support for multiple programming languages (Python, Java, C++, etc.)
- Syntax highlighting in code editors
- Dark/light theme toggle
- Save/load code snippets
- History of improvements

## Getting Started

Simply open `index.html` in any modern web browser. No installation or setup required!

## License

MIT License - feel free to use and modify as needed.
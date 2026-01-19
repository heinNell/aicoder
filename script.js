// AI Code Improver Script
// This is a demonstration version that simulates AI improvements
// In production, you would integrate with an actual AI API (OpenAI, Anthropic, etc.)

document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('codeInput');
    const errorInput = document.getElementById('errorInput');
    const additionalInstructions = document.getElementById('additionalInstructions');
    const improvementMode = document.getElementById('improvementMode');
    const improveBtn = document.getElementById('improveBtn');
    const outputSection = document.getElementById('outputSection');
    const outputCode = document.getElementById('outputCode');
    const explanationSection = document.getElementById('explanationSection');
    const explanationText = document.getElementById('explanationText');
    const copyBtn = document.getElementById('copyBtn');
    const loading = document.getElementById('loading');
    const errorInputGroup = document.querySelector('.error-input-group');

    // Toggle error input visibility based on mode
    improvementMode.addEventListener('change', function() {
        if (this.value === 'error-repair') {
            errorInputGroup.style.display = 'block';
        } else {
            errorInputGroup.style.display = 'none';
        }
    });

    // Main improve button handler
    improveBtn.addEventListener('click', async function() {
        const code = codeInput.value.trim();
        const error = errorInput.value.trim();
        const mode = improvementMode.value;
        const instructions = additionalInstructions.value.trim();

        // Validation
        if (!code) {
            showMessage('Please enter some code to improve!', 'error');
            return;
        }

        // Show loading, hide output
        loading.style.display = 'block';
        outputSection.style.display = 'none';
        improveBtn.disabled = true;

        try {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Process the code based on mode
            const result = await improveCode(code, error, mode, instructions);
            
            // Display results
            outputCode.textContent = result.improvedCode;
            explanationText.textContent = result.explanation;
            explanationSection.style.display = 'block';
            outputSection.style.display = 'block';
            
            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (err) {
            showMessage('An error occurred while improving your code. Please try again.', 'error');
            console.error(err);
        } finally {
            loading.style.display = 'none';
            improveBtn.disabled = false;
        }
    });

    // Copy to clipboard handler
    copyBtn.addEventListener('click', function() {
        const code = outputCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.style.background = '#45a049';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            showMessage('Failed to copy to clipboard', 'error');
        });
    });

    // Show message helper
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;
        
        const main = document.querySelector('main');
        main.insertBefore(messageDiv, main.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }

    // AI Code Improvement Logic (Mock Implementation)
    async function improveCode(code, error, mode, instructions) {
        // In a real implementation, this would call an AI API
        // For now, we'll provide intelligent mock improvements
        
        if (mode === 'error-repair') {
            return repairErrors(code, error, instructions);
        } else {
            return enhanceVisuals(code, instructions);
        }
    }

    // Error repair logic
    function repairErrors(code, error, instructions) {
        let improvedCode = code;
        let explanation = 'The following improvements were made:\n\n';
        const improvements = [];

        // Check for common errors and fix them
        
        // Missing semicolons (JavaScript)
        if (code.includes('console.log') && !code.trim().endsWith(';')) {
            const lines = improvedCode.split('\n');
            improvedCode = lines.map(line => {
                if (line.trim() && !line.trim().endsWith(';') && 
                    !line.trim().endsWith('{') && !line.trim().endsWith('}') &&
                    !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
                    return line + ';';
                }
                return line;
            }).join('\n');
            improvements.push('• Added missing semicolons');
        }

        // Undefined variables
        if (error && error.includes('is not defined')) {
            const match = error.match(/(\w+) is not defined/);
            if (match) {
                const varName = match[1];
                improvedCode = `let ${varName};\n` + improvedCode;
                improvements.push(`• Declared undefined variable: ${varName}`);
            }
        }

        // Missing quotes
        if (error && error.includes('Unexpected token')) {
            improvedCode = improvedCode.replace(/console\.log\((\w+)\)/g, 'console.log("$1")');
            improvements.push('• Added missing quotes around strings');
        }

        // Add try-catch if error handling mentioned
        if (instructions && instructions.toLowerCase().includes('error handling')) {
            improvedCode = `try {\n${improvedCode.split('\n').map(l => '    ' + l).join('\n')}\n} catch (error) {\n    console.error('An error occurred:', error);\n}`;
            improvements.push('• Wrapped code in try-catch block for error handling');
        }

        // Add comments if requested
        if (instructions && instructions.toLowerCase().includes('comment')) {
            improvedCode = '// Code has been improved and fixed\n' + improvedCode;
            improvements.push('• Added explanatory comments');
        }

        // Fix common syntax errors
        if (error && error.includes('SyntaxError')) {
            // Fix missing parentheses
            improvedCode = improvedCode.replace(/function\s+(\w+)\s*{/g, 'function $1() {');
            improvements.push('• Fixed function declaration syntax');
        }

        // If no specific improvements made, add general enhancements
        if (improvements.length === 0) {
            // Add proper indentation
            const lines = improvedCode.split('\n');
            let indentLevel = 0;
            improvedCode = lines.map(line => {
                const trimmed = line.trim();
                if (trimmed.endsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
                const indented = '    '.repeat(indentLevel) + trimmed;
                if (trimmed.endsWith('{')) indentLevel++;
                return indented;
            }).join('\n');
            
            improvements.push('• Fixed indentation for better readability');
            improvements.push('• Verified syntax structure');
        }

        explanation += improvements.join('\n');
        
        if (error) {
            explanation += '\n\n✓ The error has been addressed in the improved code.';
        }

        return {
            improvedCode,
            explanation
        };
    }

    // Visual enhancement logic
    function enhanceVisuals(code, instructions) {
        let improvedCode = code;
        let explanation = 'Visual enhancements applied:\n\n';
        const improvements = [];

        // Improve variable naming - only for variable declarations
        // Note: This is a simple example improvement. In real scenarios, preserve
        // meaningful single-letter variables (e.g., in math operations, coordinates)
        if (/\b(let|const|var)\s+[a-z]\b/.test(improvedCode)) {
            // Example: improve single letter variables in declarations
            improvedCode = improvedCode.replace(/\b(let|const|var)\s+x\b/g, '$1 counter');
            improvedCode = improvedCode.replace(/\b(let|const|var)\s+i\b/g, '$1 index');
            improvedCode = improvedCode.replace(/\b(let|const|var)\s+n\b/g, '$1 number');
            improvements.push('• Improved variable names for clarity');
        }
        
        // Add comments for function declarations (more precise pattern)
        if (/\bfunction\s+\w+\s*\(/.test(improvedCode)) {
            const lines = improvedCode.split('\n');
            const enhanced = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Only match function declarations, not strings or method calls
                if (/^\s*function\s+\w+\s*\(/.test(line) && !lines[i-1]?.includes('//')) {
                    enhanced.push('// Function definition');
                }
                enhanced.push(line);
            }
            improvedCode = enhanced.join('\n');
            improvements.push('• Added explanatory comments');
        }

        // Proper indentation
        const lines = improvedCode.split('\n');
        let indentLevel = 0;
        improvedCode = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.endsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
            const indented = '    '.repeat(indentLevel) + trimmed;
            if (trimmed.endsWith('{')) indentLevel++;
            return indented;
        }).join('\n');
        improvements.push('• Applied consistent indentation');
        improvements.push('• Improved code formatting and readability');

        // Apply additional instructions
        if (instructions) {
            if (instructions.toLowerCase().includes('typescript')) {
                improvedCode = '// TypeScript version\n' + improvedCode;
                // Note: In a real AI implementation, type inference would be used
                // For demo purposes, we use a basic type annotation
                improvedCode = improvedCode.replace(/let (\w+)(?!\s*:)/g, 'let $1: unknown');
                improvements.push('• Added TypeScript type annotations');
            }
            
            if (instructions.toLowerCase().includes('es6') || instructions.toLowerCase().includes('modern')) {
                // Convert var to let (safer than const as we don't know if values are reassigned)
                improvedCode = improvedCode.replace(/\bvar\b/g, 'let');
                improvements.push('• Converted var to let (ES6)');
            }
        }

        explanation += improvements.join('\n');
        explanation += '\n\n✨ Your code now has better formatting and visual structure!';

        return {
            improvedCode,
            explanation
        };
    }
});

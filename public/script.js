// DOM Elements
const modeSelect = document.getElementById('mode-select');
const codeInput = document.getElementById('code-input');
const errorInput = document.getElementById('error-input');
const errorGroup = document.getElementById('error-group');
const improveBtn = document.getElementById('improve-btn');
const btnText = document.getElementById('btn-text');
const loadingSpinner = document.getElementById('loading-spinner');
const outputSection = document.getElementById('output-section');
const codeOutput = document.getElementById('code-output');
const errorMessage = document.getElementById('error-message');
const copyBtn = document.getElementById('copy-btn');

// Toggle error input visibility based on mode
modeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'repair') {
        errorGroup.classList.remove('hidden');
    } else {
        errorGroup.classList.add('hidden');
        errorInput.value = '';
    }
});

// Handle improve button click
improveBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    const error = errorInput.value.trim();
    const mode = modeSelect.value;

    // Validation
    if (!code) {
        showError('Please enter a code snippet');
        return;
    }

    // Hide previous results and errors
    outputSection.classList.add('hidden');
    errorMessage.classList.add('hidden');

    // Show loading state
    setLoadingState(true);

    try {
        const response = await fetch('/api/improve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, error, mode }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to improve code');
        }

        // Display the improved code
        codeOutput.textContent = data.improvedCode;
        outputSection.classList.remove('hidden');

        // Scroll to results
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        showError(err.message);
    } finally {
        setLoadingState(false);
    }
});

// Handle copy to clipboard
copyBtn.addEventListener('click', async () => {
    const code = codeOutput.textContent;
    
    try {
        await navigator.clipboard.writeText(code);
        
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#4caf50';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = '#4caf50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'white';
            copyBtn.style.color = '#667eea';
            copyBtn.style.borderColor = '#667eea';
        }, 2000);
    } catch (err) {
        showError('Failed to copy to clipboard');
    }
});

// Helper functions
function setLoadingState(isLoading) {
    if (isLoading) {
        improveBtn.disabled = true;
        btnText.textContent = 'Processing...';
        loadingSpinner.classList.remove('hidden');
    } else {
        improveBtn.disabled = false;
        btnText.textContent = 'Improve Code';
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Allow Ctrl+Enter to submit
codeInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !improveBtn.disabled) {
        improveBtn.click();
    }
});

errorInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !improveBtn.disabled) {
        improveBtn.click();
    }
});

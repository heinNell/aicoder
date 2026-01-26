import { NextRequest, NextResponse } from 'next/server';

interface ImproveRequest {
  code: string;
  mode: string;
  provider: string;
  model: string;
  apiKey: string;
  ollamaUrl?: string;
}

// Approximate token limits per model (conservative estimates)
const MODEL_LIMITS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 120000, output: 16000 },
  'gpt-4o-mini': { input: 120000, output: 16000 },
  'gpt-4-turbo': { input: 120000, output: 4000 },
  'gpt-3.5-turbo': { input: 15000, output: 4000 },
  'claude-3-5-sonnet-20241022': { input: 180000, output: 8000 },
  'claude-3-opus-20240229': { input: 180000, output: 4000 },
  'claude-3-sonnet-20240229': { input: 180000, output: 4000 },
  'claude-3-haiku-20240307': { input: 180000, output: 4000 },
  'gemini-pro': { input: 30000, output: 8000 },
  'gemini-pro-vision': { input: 15000, output: 4000 },
};

// Rough estimation: 1 token ≈ 4 characters for code
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getMaxTokens(model: string, codeLength: number): number {
  const limits = MODEL_LIMITS[model] || { input: 15000, output: 4000 };
  const estimatedInput = estimateTokens(codeLength.toString());
  
  // Use larger output tokens for larger inputs
  if (estimatedInput > 10000) return Math.min(16000, limits.output);
  if (estimatedInput > 5000) return Math.min(8000, limits.output);
  return Math.min(4000, limits.output);
}

const MODE_PROMPTS: Record<string, string> = {
  'error-repair': 'Fix all bugs, errors, and potential issues in this code. Add error handling where needed.',
  'visual-enhancement': 'Improve code readability, formatting, and visual structure. Add better comments and organization.',
  'optimize': 'Optimize this code for better performance, efficiency, and resource usage.',
  'document': 'Add comprehensive documentation, comments, and JSDoc/docstrings to explain the code.',
  'security': 'Identify and fix all security vulnerabilities. Implement security best practices.',
  'test': 'Generate comprehensive unit tests for this code with good coverage.',
  'convert': 'Convert this code to a better, more modern version using best practices.',
  'explain': 'Explain what this code does in detail, line by line.',
  'nl-to-code': 'Convert this natural language description into working code.',
};

async function callOpenAI(code: string, mode: string, model: string, apiKey: string) {
  const prompt = MODE_PROMPTS[mode] || 'Improve this code';
  const maxTokens = getMaxTokens(model, code.length);
  const estimatedTokens = estimateTokens(code);
  const modelLimit = MODEL_LIMITS[model] || MODEL_LIMITS['gpt-3.5-turbo'];
  
  // Check if input is too large
  if (estimatedTokens > modelLimit.input) {
    throw new Error(`Code is too large (≈${estimatedTokens} tokens). Maximum for ${model} is ${modelLimit.input} tokens. Consider using a model with a larger context window like GPT-4o or Claude.`);
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert code improvement assistant. Provide improved code without explanatory text unless specifically asked to explain. Return only the code.',
        },
        {
          role: 'user',
          content: `${prompt}\n\nCode:\n${code}`,
        },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    let errorMessage = `OpenAI API request failed (${response.status})`;
    try {
      const error = await response.json();
      errorMessage = error.error?.message || errorMessage;
    } catch (e) {
      // Response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (e) {
    throw new Error('OpenAI returned an invalid JSON response');
  }
}

async function callAnthropic(code: string, mode: string, model: string, apiKey: string) {
  const prompt = MODE_PROMPTS[mode] || 'Improve this code';
  const maxTokens = getMaxTokens(model, code.length);
  const estimatedTokens = estimateTokens(code);
  const modelLimit = MODEL_LIMITS[model] || { input: 180000, output: 4000 };
  
  // Check if input is too large
  if (estimatedTokens > modelLimit.input) {
    throw new Error(`Code is too large (≈${estimatedTokens} tokens). Maximum for ${model} is ${modelLimit.input} tokens.`);
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nCode:\n${code}\n\nProvide only the improved code without explanatory text.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    let errorMessage = `Anthropic API request failed (${response.status})`;
    try {
      const error = await response.json();
      errorMessage = error.error?.message || errorMessage;
    } catch (e) {
      // Response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data.content[0]?.text || 'No response generated';
  } catch (e) {
    throw new Error('Anthropic returned an invalid JSON response');
  }
}

async function callGoogle(code: string, mode: string, model: string, apiKey: string) {
  const prompt = MODE_PROMPTS[mode] || 'Improve this code';
  const maxTokens = getMaxTokens(model, code.length);
  const estimatedTokens = estimateTokens(code);
  const modelLimit = MODEL_LIMITS[model] || { input: 30000, output: 8000 };
  
  // Check if input is too large
  if (estimatedTokens > modelLimit.input) {
    throw new Error(`Code is too large (≈${estimatedTokens} tokens). Maximum for ${model} is ${modelLimit.input} tokens.`);
  }
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${prompt}\n\nCode:\n${code}\n\nProvide only the improved code without explanatory text.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    let errorMessage = `Google API request failed (${response.status})`;
    try {
      const error = await response.json();
      errorMessage = error.error?.message || errorMessage;
    } catch (e) {
      // Response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  } catch (e) {
    throw new Error('Google API returned an invalid JSON response');
  }
}

async function callOllama(code: string, mode: string, model: string, ollamaUrl: string = 'http://localhost:11434') {
  const prompt = MODE_PROMPTS[mode] || 'Improve this code';
  
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: `${prompt}\n\nCode:\n${code}\n\nProvide only the improved code without explanatory text.`,
      stream: false,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Ollama API request failed (${response.status}). Make sure Ollama is running.`;
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      // Response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Ollama returned an invalid response. Check if the model is installed.');
  }
  return data.response || 'No response generated';
}

export async function POST(request: NextRequest) {
  try {
    const body: ImproveRequest = await request.json();
    const { code, mode, provider, model, apiKey, ollamaUrl } = body;

    if (!code || !mode || !provider || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let improvedCode: string;

    switch (provider) {
      case 'openai':
        if (!apiKey) {
          return NextResponse.json(
            { error: 'OpenAI API key is required' },
            { status: 400 }
          );
        }
        improvedCode = await callOpenAI(code, mode, model, apiKey);
        break;

      case 'anthropic':
        if (!apiKey) {
          return NextResponse.json(
            { error: 'Anthropic API key is required' },
            { status: 400 }
          );
        }
        improvedCode = await callAnthropic(code, mode, model, apiKey);
        break;

      case 'google':
        if (!apiKey) {
          return NextResponse.json(
            { error: 'Google API key is required' },
            { status: 400 }
          );
        }
        improvedCode = await callGoogle(code, mode, model, apiKey);
        break;

      case 'ollama':
        improvedCode = await callOllama(code, mode, model, ollamaUrl);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
    }

    // Clean up the response - remove code fences if present
    improvedCode = improvedCode
      .replace(/^```[\w]*\n/gm, '')
      .replace(/```$/gm, '')
      .trim();

    return NextResponse.json({
      success: true,
      improvedCode,
      provider,
      model,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to improve code',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

interface ImproveRequest {
  code: string;
  mode: string;
  provider: string;
  model: string;
  apiKey: string;
  ollamaUrl?: string;
}

interface TokenLimits {
  input: number;
  output: number;
}

type ModelName = string;

// Extended model limits with fallback defaults
const MODEL_LIMITS: Record<ModelName, TokenLimits> = {
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

// Default limits for unknown models
const DEFAULT_LIMITS: TokenLimits = { input: 15000, output: 4000 };

// Validation constants
const MAX_CODE_LENGTH = 10 * 1024 * 1024; // 10MB
const VALID_MODES = new Set([
  'error-repair',
  'visual-enhancement',
  'optimize',
  'document',
  'security',
  'test',
  'convert',
  'explain',
  'nl-to-code',
]);

const VALID_PROVIDERS = new Set(['openai', 'anthropic', 'google', 'ollama']);

// Enhanced mode prompts with clearer instructions
const MODE_PROMPTS: Record<string, string> = {
  'error-repair': 'Fix all bugs, errors, and potential issues in this code. Add comprehensive error handling where needed. Ensure the code follows best practices.',
  'visual-enhancement': 'Improve code readability, formatting, and visual structure. Add better comments, organize imports, and follow consistent styling. Use meaningful variable names.',
  'optimize': 'Optimize this code for better performance, efficiency, and resource usage. Consider time and space complexity improvements.',
  'document': 'Add comprehensive documentation, JSDoc comments, and inline explanations to explain the code functionality, parameters, and return values.',
  'security': 'Identify and fix all security vulnerabilities. Implement security best practices including input validation, sanitization, and secure defaults.',
  'test': 'Generate comprehensive unit tests for this code with good coverage. Include edge cases and error scenarios.',
  'convert': 'Convert this code to a better, more modern version using best practices and idiomatic patterns for the language.',
  'explain': 'Explain what this code does in detail, line by line. Describe the purpose and functionality of each component.',
  'nl-to-code': 'Convert this natural language description into working, production-ready code with proper error handling and documentation.',
};

// Rough estimation: 1 token ≈ 4 characters for code
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getModelLimits(model: string): TokenLimits {
  return MODEL_LIMITS[model] || DEFAULT_LIMITS;
}

function getMaxTokens(model: string, codeLength: number): number {
  const limits = getModelLimits(model);
  const estimatedInput = estimateTokens(codeLength.toString());
  
  // Dynamic output token allocation based on input size
  if (estimatedInput > 20000) return Math.min(16000, limits.output);
  if (estimatedInput > 10000) return Math.min(8000, limits.output);
  if (estimatedInput > 5000) return Math.min(6000, limits.output);
  return Math.min(4000, limits.output);
}

function validateRequest(request: ImproveRequest): string[] {
  const errors: string[] = [];

  if (!request.code?.trim()) {
    errors.push('Code is required');
  } else if (request.code.length > MAX_CODE_LENGTH) {
    errors.push(`Code exceeds maximum length of ${MAX_CODE_LENGTH} bytes`);
  }

  if (!VALID_MODES.has(request.mode)) {
    errors.push(`Invalid mode. Valid modes are: ${Array.from(VALID_MODES).join(', ')}`);
  }

  if (!VALID_PROVIDERS.has(request.provider)) {
    errors.push(`Invalid provider. Valid providers are: ${Array.from(VALID_PROVIDERS).join(', ')}`);
  }

  if (!request.model?.trim()) {
    errors.push('Model is required');
  }

  // Provider-specific validations
  if (request.provider !== 'ollama' && !request.apiKey?.trim()) {
    errors.push(`${request.provider} API key is required`);
  }

  if (request.provider === 'ollama' && request.ollamaUrl) {
    try {
      new URL(request.ollamaUrl);
    } catch {
      errors.push('Invalid Ollama URL format');
    }
  }

  return errors;
}

function buildSystemPrompt(provider: string, mode: string): string {
  const basePrompt = 'You are an expert code improvement assistant. ';
  
  switch (mode) {
    case 'explain':
      return basePrompt + 'Provide detailed explanations of the code.';
    case 'test':
      return basePrompt + 'Generate comprehensive tests with good coverage.';
    case 'nl-to-code':
      return basePrompt + 'Convert natural language descriptions into production-ready code.';
    default:
      return basePrompt + 'Provide improved code without explanatory text unless specifically asked to explain. Return only the code.';
  }
}

async function callAIProvider(
  provider: string,
  code: string,
  mode: string,
  model: string,
  apiKey: string,
  ollamaUrl?: string
): Promise<string> {
  const limits = getModelLimits(model);
  const estimatedTokens = estimateTokens(code);
  
  if (estimatedTokens > limits.input) {
    throw new Error(
      `Code is too large (≈${estimatedTokens} tokens). Maximum for ${model} is ${limits.input} tokens. ` +
      `Consider using a model with a larger context window or splitting your code.`
    );
  }

  const maxTokens = getMaxTokens(model, code.length);
  const prompt = MODE_PROMPTS[mode] || 'Improve this code';
  
  let response: Response;
  let endpoint: string;

  try {
    switch (provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        response = await fetch(endpoint, {
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
                content: buildSystemPrompt(provider, mode),
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
        break;

      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        response = await fetch(endpoint, {
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
                content: `${prompt}\n\nCode:\n${code}\n\n${mode === 'explain' ? 'Provide a detailed explanation.' : 'Provide only the improved code without explanatory text.'}`,
              },
            ],
          }),
        });
        break;

      case 'google':
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\nCode:\n${code}\n\n${mode === 'explain' ? 'Provide a detailed explanation.' : 'Provide only the improved code without explanatory text.'}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: maxTokens,
              topP: 0.95,
              topK: 40,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
            ],
          }),
        });
        break;

      case 'ollama':
        endpoint = `${ollamaUrl || 'http://localhost:11434'}/api/generate`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            prompt: `${prompt}\n\nCode:\n${code}\n\n${mode === 'explain' ? 'Provide a detailed explanation.' : 'Provide only the improved code without explanatory text.'}`,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: maxTokens,
            },
          }),
        });
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!response.ok) {
      let errorMessage = `${provider} API request failed (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.error?.error?.message || errorMessage;
        
        // Add helpful hints for common errors
        if (response.status === 401) {
          errorMessage += '. Please check your API key.';
        } else if (response.status === 404) {
          errorMessage += '. The model or endpoint might not exist.';
        } else if (response.status === 429) {
          errorMessage += '. Rate limit exceeded. Please try again later.';
        }
      } catch {
        // Use default error message if response isn't JSON
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    switch (provider) {
      case 'openai':
        return data.choices[0]?.message?.content?.trim() || 'No response generated';
      case 'anthropic':
        return data.content[0]?.text?.trim() || 'No response generated';
      case 'google':
        return data.candidates[0]?.content?.parts[0]?.text?.trim() || 'No response generated';
      case 'ollama':
        return data.response?.trim() || 'No response generated';
      default:
        return '';
    }

  } catch (error) {
    if (error instanceof Error) {
      // Re-throw API errors with context
      if (error.message.includes('API request failed')) {
        throw error;
      }
      throw new Error(`Failed to call ${provider} API: ${error.message}`);
    }
    throw new Error(`Unknown error calling ${provider} API`);
  }
}

function cleanupResponse(response: string, mode: string): string {
  if (mode === 'explain') {
    // For explanations, just trim whitespace
    return response.trim();
  }
  
  // Remove code fences for code responses
  return response
    .replace(/^```[\w]*\n/gm, '')
    .replace(/```$/gm, '')
    .replace(/^`/gm, '')
    .replace(/`$/gm, '')
    .trim();
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  console.log(`[${requestId}] Processing code improvement request`);

  try {
    let body: ImproveRequest;
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request
    const validationErrors = validateRequest(body);
    if (validationErrors.length > 0) {
      console.warn(`[${requestId}] Validation failed:`, validationErrors);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const { code, mode, provider, model, apiKey, ollamaUrl } = body;

    // Call AI provider
    const improvedCode = await callAIProvider(provider, code, mode, model, apiKey, ollamaUrl);
    
    // Clean up response
    const cleanedCode = cleanupResponse(improvedCode, mode);
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      improvedCode: cleanedCode,
      provider,
      model,
      mode,
      processingTime,
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Error after ${processingTime}ms:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to improve code';
    const status = errorMessage.includes('API key') || errorMessage.includes('Validation') ? 400 : 500;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        requestId,
        processingTime,
      },
      { status }
    );
  }
}

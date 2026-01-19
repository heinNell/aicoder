import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint for code improvement
app.post('/api/improve', async (req, res) => {
  try {
    const { code, error, mode } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env file' 
      });
    }

    let prompt = '';
    
    if (mode === 'repair' && error) {
      prompt = `You are a code debugging assistant. The user has provided code with an error.
      
Code:
\`\`\`
${code}
\`\`\`

Error message:
\`\`\`
${error}
\`\`\`

Please fix the code to resolve the error. Return ONLY the corrected code without any explanations or markdown formatting.`;
    } else if (mode === 'enhance') {
      prompt = `You are a code enhancement assistant. The user has provided code that needs visual and structural improvements.
      
Code:
\`\`\`
${code}
\`\`\`

Please enhance this code by:
- Improving code formatting and structure
- Adding meaningful comments where helpful
- Improving variable/function names if needed
- Following best practices for the language
- Making it more readable and maintainable

Return ONLY the enhanced code without any explanations or markdown formatting.`;
    } else {
      return res.status(400).json({ error: 'Invalid mode or missing error for repair mode' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding assistant. Always return only the code without explanations or markdown code blocks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const improvedCode = response.choices[0].message.content.trim();
    
    res.json({ 
      success: true, 
      improvedCode: improvedCode,
      mode: mode
    });

  } catch (error) {
    console.error('Error improving code:', error);
    res.status(500).json({ 
      error: 'Failed to improve code. Please try again.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`AI Code Improver running on http://localhost:${PORT}`);
});

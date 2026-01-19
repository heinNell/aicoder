# AI Code Improver 🤖

An intelligent code improvement tool that helps you repair errors and enhance your code using AI.

## Features

- **Error Repair Mode**: Paste your code and console errors to get a fixed version
- **Visual Enhancement Mode**: Improve code formatting, structure, and readability
- **Simple Interface**: Easy-to-use web interface
- **Copy to Clipboard**: Quickly copy improved code

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/heinNell/aicoder.git
cd aicoder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=3000
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Use the application:
   - **Repair Errors**: Select "Repair Errors" mode, paste your code and error message, then click "Improve Code"
   - **Visual Enhancements**: Select "Visual Enhancements" mode, paste your code, then click "Improve Code"

## How It Works

1. **Input**: Paste your code snippet into the text area
2. **Mode Selection**: Choose between repairing errors or enhancing code visually
3. **Error Details** (optional): For repair mode, paste the console error message
4. **AI Processing**: Click "Improve Code" to send your request to the AI
5. **Results**: View the improved code and copy it to your clipboard

## API Endpoints

- `POST /api/improve`: Improve code
  - Request body: `{ code, error, mode }`
  - Response: `{ success, improvedCode, mode }`
- `GET /api/health`: Health check endpoint

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **AI**: OpenAI GPT-3.5 Turbo

## License

ISC
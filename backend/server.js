import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import institutionsRouter from './routes/institutions.js';

// Initial load of environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL?.trim();

// Enable CORS for frontend
app.use(cors({
  origin: FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Parse JSON request bodies (support base64 images up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (re-reads .env dynamically so key changes take effect immediately)
app.get('/api/health', (req, res) => {
  dotenv.config({ override: true });

  const hasApiKey = Boolean(process.env.OPENROUTER_API_KEY?.trim());
  const model = process.env.OPENROUTER_MODEL?.trim() || 'anthropic/claude-3.5-sonnet';

  res.json({
    status: 'online',
    service: 'CivicSetu Civic-to-University Problem Solver API',
    timestamp: new Date().toISOString(),
    llmConfig: {
      provider: 'OpenRouter',
      model: model,
      hasApiKey: hasApiKey,
      mode: hasApiKey ? 'live_llm' : 'intelligent_mock_fallback'
    }
  });
});

// Mount Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/institutions', institutionsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`CivicSetu Backend API running on port ${PORT}`);
  console.log(`OpenRouter API Key: ${process.env.OPENROUTER_API_KEY?.trim() ? 'CONFIGURED (Live LLM)' : 'EMPTY (Mock Fallback Enabled)'}`);
  console.log(`OpenRouter Model:   ${process.env.OPENROUTER_MODEL?.trim() || 'default'}`);
  console.log(`====================================================`);
});

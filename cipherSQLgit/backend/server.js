require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');
const pool = require('./db');
const QueryLog = require('./queryLog');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(() => console.warn(' MongoDB failed (non-fatal)'));

app.get('/assignments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assignments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sample-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/execute-query', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '')
    return res.status(400).json({ error: 'Query cannot be empty.' });

  const normalized = query.trim().toUpperCase();

  if (!normalized.startsWith('SELECT'))
    return res.status(400).json({ error: 'Only SELECT queries are allowed.' });

  if (normalized.includes(';'))
    return res.status(400).json({ error: 'Semicolons are not allowed.' });

  try {
    const result = await pool.query(query);
    QueryLog.create({ query, success: true, rowCount: result.rowCount }).catch(() => {});
    res.json({
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
    });
  } catch (err) {
    QueryLog.create({ query, success: false, error: err.message }).catch(() => {});
    res.status(400).json({ error: err.message });
  }
});

app.post('/hint', (req, res) => {
  const { question, query, error } = req.body;

  const prompt = `You are a SQL tutor. Do NOT give the full answer.
Question: ${question || 'N/A'}
Query: ${query || 'none'}
Error: ${error || 'none'}
Give a 1-2 sentence hint about what to fix.`;

  const body = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const request = https.request(options, (groqRes) => {
    let data = '';
    groqRes.on('data', chunk => data += chunk);
    groqRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const hint = parsed?.choices?.[0]?.message?.content;
        res.json({ hint: hint || 'Could not get a hint.' });
      } catch (e) {
        res.json({ hint: 'Could not parse hint response.' });
      }
    });
  });

  request.on('error', () => res.json({ hint: 'Network error reaching Groq.' }));
  request.write(body);
  request.end();
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));

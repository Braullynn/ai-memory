import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initDb } from '../db/db.js';
import { cosineSimilarity } from '../utils.js';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Gera embedding
async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001"});
  const res = await model.embedContent(text);
  return res.embedding.values;
}

// Resume diálogo
async function summarizeChunk(messages) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const prompt = `Resuma em 1 parágrafo os pontos-chave:
${messages.join('')}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

// Escrever memória
async function writeMemory(chunk) {
  const db = await initDb();
  const summary = await summarizeChunk(chunk);
  const emb = await getEmbedding(summary);
  await db.run('INSERT INTO memories (summary, embedding) VALUES (?,?)', summary, JSON.stringify(emb));
  return summary;
}

// Recuperar memórias relevantes
async function retrieveMemories(query, topK = 5) {
  const db = await initDb();
  const rows = await db.all('SELECT * FROM memories');
  const qEmb = await getEmbedding(query);
  const sims = rows.map(r => ({
    summary: r.summary,
    score: cosineSimilarity(qEmb, JSON.parse(r.embedding))
  }));
  sims.sort((a,b) => b.score - a.score);
  return sims.slice(0, topK).map(x => x.summary);
}

router.post('/', async (req, res) => {
    const { history, message } = req.body;

    // 1. write memory every N mensagens
    if (history.length > 0 && history.length % 10 === 0) {
        await writeMemory(history.slice(-10).map(h => h.parts));
    }

    // 2. retrieve
    const memories = await retrieveMemories(message);

    // 3. construir prompt e chamar a API
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const chat = model.startChat({
        history: [
            ...history,
            {
                role: "system",
                parts: `Use estas memórias para guiar a conversa: ${memories.join(' | ')}`
            }
        ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ reply: response.text() });
});

export default router;

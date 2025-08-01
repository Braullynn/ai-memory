import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/chat', chatRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`> Server rodando na porta ${PORT}`));

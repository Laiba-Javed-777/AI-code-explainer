import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/.netlify/functions/explain', async (req, res) => {
  try {
    const { language, code } = req.body;
    const modelList = await groq.models.list();
    const validModels = modelList.data
      .map((m) => m.id)
      .filter((id) => !id.includes('guard') && !id.includes('safeguard'));

    const activeModel = validModels.find((id) => id.includes('llama')) || validModels[0];

    const completion = await groq.chat.completions.create({
      model: activeModel,
      messages: [
        { role: 'system', content: 'You are a helpful coding tutor. Explain the code clearly.' },
        { role: 'user', content: `Language: ${language || 'Auto-detect'}\n\nCode:\n${code}` },
      ],
    });

    res.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const handler = serverless(app);
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getChatResponse, getChatResponseStream, analyzeStudentState, generateScientificImage } from "./services/gemini.server.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check for API key on startup
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set in the environment.");
  } else {
    console.log("GEMINI_API_KEY is defined.");
  }

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, profile, language } = req.body;
      const response = await getChatResponse(messages, profile, language);
      res.json({ text: response });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/stream", async (req, res) => {
    try {
      const { messages, profile, language } = req.body;
      const stream = getChatResponseStream(messages, profile, language);
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error("Stream API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { history, currentProfile, language } = req.body;
      const analysis = await analyzeStudentState(history, currentProfile, language);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analyze API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const imageUrl = await generateScientificImage(prompt);
      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Image Generation API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

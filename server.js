// server.js
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body || "");
  next();
});

// Setup OpenAI if API key exists
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
  console.log("OpenAI is ready.");
} else {
  console.log("No OpenAI API key found. Chat will echo messages.");
}

// Root route
app.get("/", (req, res) => {
  res.send("Hello from backend! Server is working.");
});

// Example data route
app.get("/data", (req, res) => {
  res.json({ sample: "This is example data from backend" });
});

// Chat route — fail-safe
app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required in JSON body." });
    }

    let reply = `Echo: ${message}`; // default fallback reply

    if (openai) {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
        });
        reply = completion.data.choices[0].message.content;
      } catch (gptError) {
        console.error("OpenAI API error:", gptError.response?.data || gptError.message);
        reply = `GPT API error. Fallback reply: ${message}`;
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error("Unexpected error in /chat:", error.message);
    res.status(500).json({
      error: "Unexpected server error. Your message could not be processed.",
    });
  }
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/* ================= AI RECONSTRUCTION ================= */

app.post("/reconstruct", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt:
        "Reconstruct this damaged ancient artifact into its original complete realistic form.",
      image: base64Image,
      size: "1024x1024"
    });

    res.json({
      reconstructed: result.data[0].b64_json
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI reconstruction failed" });
  }
});

/* ================= AI ANALYSIS ================= */

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Analyze this artifact. Give Title, Description, Estimated Age." },
          { type: "input_image", image_base64: base64Image }
        ]
      }]
    });

    res.json({
      analysis: response.output_text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
/* ================= AI AUTO AGE DETECTION ================= */

app.post("/detect-age", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Estimate the historical age of this artifact and explain why." },
          { type: "input_image", image_base64: base64Image }
        ]
      }]
    });

    res.json({
      age: response.output_text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Age detection failed" });
  }
});
/* ================= AI 3D GENERATION ================= */

app.post("/generate-3d", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: "Generate a realistic 3D rendered model of this artifact, museum-quality, clean background.",
      image: base64Image,
      size: "1024x1024"
    });

    res.json({
      model3d: result.data[0].b64_json
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "3D generation failed" });
  }
});
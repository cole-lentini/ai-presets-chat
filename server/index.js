import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("USING UPDATED SERVER FILE");

const app = express();

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(cors());

app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

// -----------------------------
// CHAT ROUTE (FIXED PATH)
// -----------------------------
app.post("/api/chat", async (req, res) => {
  const { message, preset, image } = req.body;

  const prompt = `
${preset?.instructions || ""}

User: ${message}
`;

  try {
    const parts = [];

    // text part
    parts.push({
      text: prompt,
    });

    // image part (if provided)
    if (image) {
      const match = image.match(
        /^data:(.+);base64,(.+)$/
      );

      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];

        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data,
          },
        });
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(
      "GEMINI RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ text });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: "Gemini request failed",
    });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
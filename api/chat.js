export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, preset, image } = req.body || {};

    const prompt = `
${preset?.instructions || ""}

User: ${message}
`;

    const parts = [{ text: prompt }];

    if (image) {
      const match = image.match(/^data:(.+);base64,(.+)$/);

      if (match) {
        parts.push({
          inline_data: {
            mime_type: match[1],
            data: match[2],
          },
        });
      }
    }

    // IMPORTANT: use globalThis.fetch (safe in all Vercel runtimes)
    const fetchFn = globalThis.fetch;

    if (!fetchFn) {
      throw new Error("fetch is not available in this runtime");
    }

    const response = await fetchFn(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts }],
        }),
      }
    );

    const textResponse = await response.text();

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      console.error("NON-JSON RESPONSE:", textResponse);
      return res.status(500).json({
        error: "Gemini returned invalid JSON",
        raw: textResponse,
      });
    }

    if (!response.ok) {
      console.error("GEMINI ERROR:", data);
      return res.status(500).json({
        error: "Gemini API failed",
        details: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("FUNCTION CRASH:", err);

    return res.status(500).json({
      error: "Server crashed",
      message: err.message,
      stack: err.stack,
    });
  }
}
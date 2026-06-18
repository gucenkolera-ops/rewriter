export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4000 }
      })
    }
  );
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
  res.status(200).json({ text });
}
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;

  const response = await fetch('https://api.openmodel.ai/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.DEEPSEEK_API_KEY
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      input: prompt,
      max_output_tokens: 4000
    })
  });

  const data = await response.json();
  const text = data?.output?.[0]?.content?.[0]?.text || '';
  res.status(200).json({ text, debug: data });
}
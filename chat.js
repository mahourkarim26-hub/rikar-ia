export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages invalides' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: "Tu es Rikar.IA, un assistant IA intelligent, utile et bienveillant. Tu réponds en français sauf si l'utilisateur écrit dans une autre langue. Tes réponses sont claires et bien structurées.",
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.[0]?.text || '';
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur: ' + err.message });
  }
}

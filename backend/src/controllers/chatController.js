/**
 * POST /chat - proxy to Hugging Face Inference API
 * Body: { message, conversationHistory? }
 * Uses Hugging Face API (e.g. mistralai/Mixtral-8x7B-Instruct-v0.1 or meta-llama/Llama-2-7b-chat-hf)
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

export async function chat(req, res) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chat API not configured. Set HUGGINGFACE_API_KEY.' });
    }

    const { message, conversationHistory = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    // Build prompt from history + new message (simple format for Mistral/Llama)
    const past = conversationHistory
      .map((m) => (m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`))
      .join('\n');
    const prompt = past
      ? `${past}\nUser: ${message}\nAssistant:`
      : `User: ${message}\nAssistant:`;

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face API error:', response.status, errText);
      return res.status(response.status).json({
        error: 'AI service error',
        details: response.status === 503 ? 'Model is loading, try again in a moment.' : errText,
      });
    }

    const data = await response.json();
    // HF returns array of { generated_text: "..." }
    const text = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text.trim()
      : (data.generated_text ?? JSON.stringify(data));

    res.json({ reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
}

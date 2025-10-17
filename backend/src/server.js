require('dotenv').config({ path: '../../.env' });
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// ElevenLabs API Endpoint
app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // ElevenLabs'in sunduğu varsayılan seslerden birinin ID'si. Değiştirebilirsiniz.
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Örnek olarak Rachel sesi
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  };

  try {
    const apiRes = await fetch(url, options);
    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      console.error('ElevenLabs API Error:', errorBody);
      return res.status(apiRes.status).send(errorBody);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    apiRes.body.pipe(res);

  } catch (error) {
    console.error('Error calling ElevenLabs API:', error);
    res.status(500).json({ error: 'Failed to call Text-to-Speech API' });
  }
});


// Frontend build'ini sunmak için statik middleware
app.use(express.static(path.join(__dirname, '../../../frontend/build')));

// Tüm istekleri React app'e yönlendir, böylece client-side routing çalışır
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});

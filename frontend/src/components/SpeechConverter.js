import React, { useState, useEffect } from 'react';

// Web Speech API tarayıcıda var mı diye kontrol edelim
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'tr-TR';
  recognition.interimResults = false;
}

const SpeechConverter = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('Konuşmak için "Kaydı Başlat" düğmesine basın veya metni buraya yazın.');
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu için state

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const currentText = event.results[0][0].transcript;
      setText(currentText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error', event.error);
      setIsListening(false);
    };

  }, []);

  const handleListen = () => {
    if (!recognition) {
        setText('Üzgünüz, tarayıcınız ses tanımayı desteklemiyor.');
        return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setText('Dinleniyor...');
    }
  };

  const handleSpeak = async () => {
    if (!text) {
      alert('Lütfen seslendirilecek bir metin girin.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`API isteği başarısız: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error('Metin okuma hatası:', error);
      alert('Metin okunurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sesden Metine & ElevenLabs TTS</h1>
      <p>Bu uygulama, Web Speech API ile sesi metne dönüştürür ve ElevenLabs API ile metni seslendirir.</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10" 
        cols="50"
        style={{ marginTop: '20px', padding: '10px' }}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleListen} disabled={isLoading} style={{ marginRight: '10px', padding: '10px 20px' }}>
          {isListening ? 'Kaydı Durdur' : 'Kaydı Başlat'}
        </button>
        <button onClick={handleSpeak} disabled={isLoading} style={{ padding: '10px 20px' }}>
          {isLoading ? 'Yükleniyor...' : 'Metni Oku (ElevenLabs)'}
        </button>
      </div>
    </div>
  );
};

export default SpeechConverter;

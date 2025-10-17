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
  const [text, setText] = useState('Konuşmak için "Kaydı Başlat" düğmesine basın.');

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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sesi Metne Dönüştür</h1>
      <p>Bu uygulama, Web Speech API ile sesi metne dönüştürür.</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10" 
        cols="50"
        style={{ marginTop: '20px', padding: '10px' }}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleListen} style={{ padding: '10px 20px' }}>
          {isListening ? 'Kaydı Durdur' : 'Kaydı Başlat'}
        </button>
      </div>
    </div>
  );
};

export default SpeechConverter;

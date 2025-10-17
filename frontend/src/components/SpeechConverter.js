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
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

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

    // Sesleri yükle
    const populateVoiceList = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Varsayılan olarak bir ses seç
      if (availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(voice => voice.lang === 'tr-TR') || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

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

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Üzgünüz, tarayıcınız metin okumayı desteklemiyor.');
      return;
    }
    if (!text || text === 'Dinleniyor...' || text === 'Konuşmak için \"Kaydı Başlat\" düğmesine basın veya metni buraya yazın.') {
      alert('Lütfen seslendirilecek bir metin girin.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = 'tr-TR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Sesi Metne & Metni Sese Dönüştür</h1>
      <p>Bu uygulama, Web Speech API ile sesi metne dönüştürür ve metni seslendirir.</p>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10" 
        cols="50"
        style={{ marginTop: '20px', padding: '10px' }}
      />
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="voice-select" style={{ marginRight: '10px' }}>Ses Seçin:</label>
        <select id="voice-select" value={selectedVoice || ''} onChange={(e) => setSelectedVoice(e.target.value)} style={{ marginRight: '20px', padding: '5px' }}>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleListen} style={{ marginRight: '10px', padding: '10px 20px' }}>
          {isListening ? 'Kaydı Durdur' : 'Kaydı Başlat'}
        </button>
        <button onClick={handleSpeak} style={{ padding: '10px 20px' }}>
          Metni Oku
        </button>
      </div>
    </div>
  );
};

export default SpeechConverter;

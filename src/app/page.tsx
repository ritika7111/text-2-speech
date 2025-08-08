'use client';

import { useState } from 'react';

export default function TTSBootstrap() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState('en-IN-ArjunNeural');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return alert('Please enter some text.');

    setLoading(true);
    setAudioUrl('');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) throw new Error('Failed to generate audio.');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (err: any) {
      alert(err.message || 'Error generating audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>🎙 Text to Speech</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Choose Voice</label>
          <select
            className="form-select"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option value="en-IN-ArjunNeural">English - Arjun</option>
            <option value="hi-IN-ArjunNeural">Hindi - Arjun</option>
            <option value="hi-IN-SwaraNeural">Hindi - Swara</option>
            <option value="en-IN-AartiNeural">English - Aarti</option>
            <option value="hi-IN-AartiNeural">Hindi - Aarti</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Enter Text</label>
          <textarea
            className="form-control"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
          ></textarea>
        </div>

        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Generating...
              </>
            ) : (
              '▶️ Play Audio'
            )}
          </button>

          {audioUrl && (
            <a
              href={audioUrl}
              download={voice+".mp3"}
              className="btn btn-success"
            >
              ⬇️ Download MP3
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

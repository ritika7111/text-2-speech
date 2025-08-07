"use client";
import { useState } from "react";

export default function TTSPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadTTS = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`TTS failed: ${errorData.error}`);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "speech.mp3";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          🎙Text-to-Speech
        </h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="✍️ Type or paste text here..."
          style={{
            width: "100%",
            minHeight: "350px",
            fontSize: "16px",
            padding: "12px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          className="w-full text-lg p-6 border border-gray-300 rounded-2xl shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />

        <button
          onClick={downloadTTS}
          disabled={loading}
          className={`w-full py-4 text-lg font-semibold rounded-2xl transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "🔄 Generating MP3..." : "⬇️ Download MP3"}
        </button>
      </div>
    </main>
  );
}

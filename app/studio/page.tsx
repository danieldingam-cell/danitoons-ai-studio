
"use client";

import { useEffect, useState } from "react";

type Voice = {
  id: string;
  name: string;
};

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [speechText, setSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoResult, setVideoResult] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // Load your 20 configured ElevenLabs voices
  useEffect(() => {
    async function loadVoices() {
      try {
        const response = await fetch("/api/voice");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load voices");
        }

        setVoices(data.voices || []);

        if (data.voices?.length > 0) {
          setVoiceId(data.voices[0].id);
        }
      } catch (error) {
        console.error("Voice loading error:", error);
        setMessage("Could not load voices. Check your voice API setup.");
      }
    }

    loadVoices();
  }, []);

  async function uploadImage() {
    if (!image) {
      setMessage("Please select an image first.");
      return "";
    }

    const formData = new FormData();
    formData.append("file", image);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed");
    }

    setImageUrl(data.imageUrl);
    return data.imageUrl;
  }

  async function createVideo() {
    if (!prompt.trim() || !image) {
      setMessage("Select an image and enter a cartoon prompt.");
      return;
    }

    setLoading(true);
    setMessage("");
    setVideoResult("");

    try {
      const uploadedUrl = imageUrl || await uploadImage();

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          imageUrl: uploadedUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Video generation failed");
      }

      setVideoResult(JSON.stringify(data.video || data, null, 2));
      setMessage("Video generation task submitted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createVoice() {
    if (!speechText.trim() || !voiceId) {
      setMessage("Enter your story text and select a voice.");
      return;
    }

    setVoiceLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: speechText,
          voiceId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Voice generation failed");
      }

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);

      setAudioUrl(newAudioUrl);
      setMessage("Your AI voice has been generated!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Voice generation failed."
      );
    } finally {
      setVoiceLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-2xl font-black text-purple-400">
            DaniToons AI Studio
          </h1>

          <a
            href="/"
            className="rounded-lg bg-white/10 px-4 py-2"
          >
            Home
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black">
            Create Your Cartoon
          </h2>
          <p className="mt-3 text-slate-400">
            Turn your imagination into animated stories with AI.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* VIDEO GENERATION */}

          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="text-xl font-bold mb-5">
              01. Create an AI Video
            </h3>

            <label className="block mb-3 font-semibold">
              Upload your picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files?.[0] || null);
                setImageUrl("");
              }}
              className="w-full rounded-lg bg-slate-800 p-3 mb-5"
            />

            {image && (
              <p className="text-sm text-green-400 mb-4">
                Selected: {image.name}
              </p>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded cartoon"
                className="w-full max-h-64 object-contain rounded-xl mb-5"
              />
            )}

            <label className="block mb-3 font-semibold">
              Describe your cartoon
            </label>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A cute little rabbit walking through a magical forest, smiling and talking to colorful butterflies..."
              rows={6}
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={createVideo}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-purple-600 p-4 font-bold hover:bg-purple-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Generate Cartoon Video"}
            </button>
          </section>

          {/* VOICE GENERATION */}

          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="text-xl font-bold mb-5">
              02. Children's AI Voices
            </h3>

            <label className="block mb-3 font-semibold">
              Choose a Character Voice
            </label>

            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full rounded-lg bg-slate-800 p-4 mb-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              {voices.length === 0 && (
                <option value="">
                  No voices loaded
                </option>
              )}

              {voices.map((voice, index) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name || `Character Voice ${index + 1}`}
                </option>
              ))}
            </select>

            <p className="text-sm text-slate-400 mb-5">
              Available voices: {voices.length}/20
            </p>

            <label className="block mb-3 font-semibold">
              Story or dialogue
            </label>

            <textarea
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Once upon a time, in a magical kingdom..."
              rows={6}
              className="w-full rounded-xl bg-slate-800 p-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={createVoice}
              disabled={voiceLoading || !voiceId}
              className="mt-5 w-full rounded-xl bg-pink-600 p-4 font-bold hover:bg-pink-500 disabled:opacity-50"
            >
              {voiceLoading ? "Generating Voice..." : "Generate AI Voice"}
            </button>

            {audioUrl && (
              <div className="mt-5">
                <p className="mb-3 font-semibold">
                  Your generated voice
                </p>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </section>
        </div>

        {message && (
          <div className="mt-8 rounded-xl bg-slate-800 p-5">
            {message}
          </div>
        )}

        {videoResult && (
          <section className="mt-8 rounded-2xl border border-purple-500/30 bg-slate-900 p-6">
            <h3 className="text-xl font-bold mb-4">
              Video Generation Response
            </h3>

            <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-green-300">
              {videoResult}
            </pre>

            <p className="mt-4 text-sm text-slate-400">
              This is the Runway task response. Video completion and playback
              still require a status-checking endpoint.
            </p>
          </section>
        )}

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-slate-500">
          DaniToons AI Studio · Created by Daniel Tuwi Dingam
       ©2026
        </footer>
      </div>
    </main>
  );
    }
  

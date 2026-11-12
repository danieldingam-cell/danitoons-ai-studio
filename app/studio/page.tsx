
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

  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [speechText, setSpeechText] = useState("");

  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoStatus, setVideoStatus] = useState("");

  useEffect(() => {
    async function loadVoices() {
      try {
        const response = await fetch("/api/voice");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load voices.");
        }

        setVoices(data.voices || []);

        if (data.voices?.length) {
          setSelectedVoiceId(data.voices[0].id);
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load voices."
        );
      }
    }

    loadVoices();
  }, []);

  async function uploadImage(): Promise<string> {
    if (!image) {
      throw new Error("Please select an image first.");
    }

    const formData = new FormData();
    formData.append("file", image);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed.");
    }

    if (!data.imageUrl) {
      throw new Error("No image URL was returned.");
    }

    setImageUrl(data.imageUrl);
    return data.imageUrl;
  }

  async function createVideo() {
    if (!prompt.trim() || !image) {
      setMessage("Please upload an image and enter a cartoon prompt.");
      return;
    }

    setLoading(true);
    setVideoUrl("");
    setVideoStatus("Uploading image...");
    setMessage("");

    try {
      const uploadedImageUrl = imageUrl || await uploadImage();

      setVideoStatus("Submitting video to Runway...");

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          imageUrl: uploadedImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Video generation failed.");
      }

      if (!data.taskId) {
        throw new Error("Runway did not return a task ID.");
      }

      setVideoStatus("Runway is creating your cartoon...");

      let completed = false;

      for (let attempt = 0; attempt < 60; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusResponse = await fetch(
          `/api/video?taskId=${encodeURIComponent(data.taskId)}`
        );

        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(
            statusData.error || "Could not check video status."
          );
        }

        const status = String(statusData.status || "").toUpperCase();

        if (status === "SUCCEEDED") {
          const finishedVideo =
            statusData.videoUrl ||
            statusData.task?.output?.[0];

          if (!finishedVideo) {
            throw new Error("Runway finished but returned no video URL.");
          }

          setVideoUrl(finishedVideo);
          setVideoStatus("Your cartoon video is ready!");
          setMessage("Video generated successfully!");
          completed = true;
          break;
        }

        if (
          status === "FAILED" ||
          status === "CANCELED" ||
          status === "CANCELLED"
        ) {
          throw new Error(`Runway video generation ${status.toLowerCase()}.`);
        }

        setVideoStatus(
          `Generating your cartoon... (${attempt + 1}/60)`
        );
      }

      if (!completed) {
        setVideoStatus("Generation is taking longer than expected.");
        setMessage(
          "Your Runway task may still be processing. Try checking again later."
        );
      }
    } catch (error) {
      setVideoStatus("Video generation stopped.");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createVoice() {
    if (!speechText.trim()) {
      setMessage("Please enter your story or dialogue.");
      return;
    }

    if (!selectedVoiceId) {
      setMessage("Please select a configured voice.");
      return;
    }

    setVoiceLoading(true);
    setMessage("");
    setAudioUrl("");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: speechText,
          voiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Voice generation failed.");
      }

      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);

      setAudioUrl(newAudioUrl);
      setMessage("Your AI voice has been generated!");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Voice generation failed."
      );
    } finally {
      setVoiceLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
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
          <h2 className="text-4xl font-bold">
            Create Your Cartoon
          </h2>
          <p className="mt-3 text-slate-400">
            Turn your imagination into animated stories with AI.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-5 text-xl font-bold">
              01. Create an AI Video
            </h3>

            <label className="mb-3 block font-semibold">
              Upload your picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                setImage(event.target.files?.[0] || null);
                setImageUrl("");
              }}
              className="mb-4 w-full rounded-lg bg-slate-800 p-3"
            />

            {image && (
              <p className="mb-3 text-sm text-green-400">
                Selected: {image.name}
              </p>
            )}

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected cartoon"
                className="mb-5 max-h-64 rounded-xl object-contain"
              />
            )}

            <label className="mb-3 block font-semibold">
              Describe your cartoon
            </label>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: A cute little rabbit walking through a magical forest..."
              rows={6}
              className="mb-5 w-full rounded-lg bg-slate-800 p-4 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={createVideo}
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 p-4 font-bold hover:bg-purple-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Generate Cartoon Video"}
            </button>

            {videoStatus && (
              <p className="mt-4 text-sm text-purple-300">
                {videoStatus}
              </p>
            )}

            {videoUrl && (
              <div className="mt-6">
                <h4 className="mb-3 font-bold">
                  Your Finished Cartoon
                </h4>

                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="w-full rounded-xl"
                />

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-purple-300 underline"
                >
                  Open video
                </a>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-5 text-xl font-bold">
              02. Children's AI Voices
            </h3>

            <label className="mb-3 block font-semibold">
              Select an ElevenLabs character voice
            </label>

            <select
              value={selectedVoiceId}
              onChange={(event) =>
                setSelectedVoiceId(event.target.value)
              }
              className="mb-5 w-full rounded-lg bg-slate-800 p-4 text-white"
            >
              {voices.length === 0 && (
                <option value="">No voices loaded</option>
              )}

              {voices.map((voice, index) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name || `Character Voice ${index + 1}`}
                </option>
              ))}
            </select>

            <p className="mb-5 text-sm text-slate-400">
              {voices.length} configured voices available.
            </p>

            <label className="mb-3 block font-semibold">
              Story or dialogue
            </label>

            <textarea
              value={speechText}
              onChange={(event) => setSpeechText(event.target.value)}
              placeholder="Once upon a time, in a magical kingdom..."
              rows={6}
              className="mb-5 w-full rounded-lg bg-slate-800 p-4 text-white outline-none focus:ring-2 focus:ring-pink-500"
            />

            <button
              onClick={createVoice}
              disabled={voiceLoading}
              className="w-full rounded-xl bg-pink-600 p-4 font-bold hover:bg-pink-500 disabled:opacity-50"
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

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-slate-500">
          DaniToons AI Studio · Created by Daniel Dingam
        </footer>
      </div>
    </main>
  );
    }
    

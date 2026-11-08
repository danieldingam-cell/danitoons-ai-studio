
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          window.location.assign("/studio");
        } else {
          setMessage("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.assign("/studio");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          DaniToons AI Studio
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create amazing cartoons with AI
        </p>

        <h2 className="text-xl font-bold mt-8 mb-5 text-gray-800">
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          <input
            type="password"
            placeholder="Password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white p-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
          className="w-full mt-6 text-purple-700 font-semibold"
        >
          {isSignup
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-8">
          Created by Daniel Dingam
        </p>
      </div>
    </main>
  );
    }
                              


import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09091b] text-white overflow-hidden">

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-purple-400">
          DaniToons<span className="text-pink-400"> AI</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm hover:text-purple-400">
            Log In
          </Link>
          <Link
            href="/login"
            className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-full font-bold text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <div className="inline-block bg-purple-500/15 text-purple-300 border border-purple-400/30 rounded-full px-5 py-2 text-sm mb-8">
            ✨ Your imagination, powered by AI
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Bring Your
            <span className="block text-purple-400">
              Cartoon
            </span>
            Stories to Life.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mt-7 max-w-xl">
            Create magical animated stories using artificial intelligence.
            Upload a picture, describe your imagination and turn your ideas
            into amazing cartoon videos with AI-powered voices.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-900/40"
            >
              Start Creating →
            </Link>

            <a
              href="#features"
              className="border border-white/20 hover:bg-white/10 px-8 py-4 rounded-xl font-bold"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
            <span>✓ Easy to use</span>
            <span>✓ AI-powered creativity</span>
            <span>✓ Made for storytelling</span>
          </div>
        </div>

        {/* Cartoon showcase */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full" />

          <div className="relative rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-950 p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Your Creative Studio</span>
              <span className="text-green-400 text-sm">● Ready to create</span>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-72 flex flex-col items-center justify-center text-center p-8">
              <div className="text-8xl mb-5">🦊</div>
              <h2 className="text-3xl font-black">
                Magical Stories
              </h2>
              <p className="mt-3 text-white/80">
                Imagine it. Create it. Animate it.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl">🎨</div>
                <p className="text-xs mt-2">AI Art</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl">🎬</div>
                <p className="text-xs mt-2">AI Videos</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl">🎤</div>
                <p className="text-xs mt-2">AI Voices</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#101027] py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-purple-400 font-bold mb-4">
              POWERFUL CREATIVE TOOLS
            </p>
            <h2 className="text-4xl md:text-5xl font-black">
              Everything You Need to Create
            </h2>
            <p className="text-gray-400 mt-5">
              Your complete AI cartoon creation workspace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-5xl mb-6">🖼️</div>
              <h3 className="text-xl font-bold mb-3">
                Picture to Animation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Upload your pictures and use creative prompts to turn
                your ideas into animated scenes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-5xl mb-6">🎬</div>
              <h3 className="text-xl font-bold mb-3">
                AI Video Creation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Transform your imagination into cartoon video projects
                with AI video generation.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-5xl mb-6">🎙️</div>
              <h3 className="text-xl font-bold mb-3">
                AI Character Voices
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Give your cartoon characters voices and bring your
                stories to life with AI speech.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-black">
          Your Next Story Starts Here.
        </h2>

        <p className="text-gray-400 mt-5 mb-9">
          Step into a world of imagination and start creating.
        </p>

        <Link
          href="/login"
          className="inline-block bg-purple-600 hover:bg-purple-500 px-10 py-4 rounded-xl font-bold"
        >
          Create Your Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 DaniToons AI Studio. All rights reserved.</p>
          <p>Created by Daniel Dingam</p>
        </div>
      </footer>

    </main>
  );
      }
            

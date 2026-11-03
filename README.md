# DaniToons AI Studio

Next.js starter for a children's cartoon creator. Includes Supabase email/password authentication, protected studio pages, Cloudinary signed image uploads, and ElevenLabs text-to-speech.

## 1. Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## 2. Supabase setup

1. Create a project at https://supabase.com.
2. Open Project Settings → API.
3. Copy Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the publishable/anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. In Authentication → URL Configuration, set your local site URL to `http://localhost:3000`; add your deployed Vercel URL after deployment.
6. Configure email confirmation as desired in Supabase Auth.

The service role key is not needed for this starter. Do not expose it in browser code.

## 3. Cloudinary setup

1. Create an account at https://cloudinary.com.
2. From the Cloudinary dashboard, copy cloud name, API key and API secret.
3. Put them in `.env.local` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

The app signs uploads on the server. The browser never receives the API secret.

## 4. ElevenLabs setup

1. Create an API key in your ElevenLabs account.
2. Set `ELEVENLABS_API_KEY`.
3. Copy a permitted voice's Voice ID from ElevenLabs and set `ELEVENLABS_DEFAULT_VOICE_ID`.
4. The voice page calls `/api/voice`; the API key remains on the server.

Generated speech is returned as MP3. Provider usage may consume credits.

## 5. Runway video generation

1. Add your Runway API key as `RUNWAYML_API_SECRET`.
2. The app calls Runway's official image-to-video endpoint and checks the task status until the video is ready.
3. The starter uses `gen4_turbo`, 5 seconds, landscape 1280:720.
4. See the official docs for current models, durations and pricing: https://docs.dev.runwayml.com/api/

Runway generation consumes credits. Free login access does not make provider generation free.

## 6. Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose Add New → Project and import the repository.
3. Add every variable from `.env.local` under Project Settings → Environment Variables (do not upload `.env.local` to GitHub).
4. Deploy.
5. In Supabase Authentication → URL Configuration, add your Vercel production URL to Site URL / Redirect URLs.
6. Redeploy after changing environment variables.

## Important

- "Free" here means this starter has no payment wall. Supabase, Cloudinary, ElevenLabs and video generation providers have their own free limits, usage limits and/or charges.
- This is a starter implementation, not a production-ready service. Before inviting children or collecting personal data, add privacy notices, parental consent where required, moderation, rate limits, quotas, abuse reporting, and secure data-retention rules.
- Do not collect children's full names, precise locations, photos, or other sensitive information unnecessarily. Restrict uploads and generated content to safe, age-appropriate use.
- Never share API keys in chat or commit them to GitHub.

# LingoMentor AI - Production-Ready AI English Speaking Teacher

A full-stack AI English speaking tutor web application with real-time voice conversation, grammatical and pronunciation error correction, native-speaker style rephrasing, clear explanations in Uzbek or English, CEFR placement tests (A1 to C2), structured lessons, IELTS simulator, and comprehensive progress tracking.

---

## Key Features

1. **AI Speaking Teacher with Real Voice**
   - Natural speech conversation with minimal delay.
   - Dual-engine speech system: Web Speech Recognition API for instantaneous streaming speech-to-text, plus audio transcription fallback.
   - Text-to-Speech: Gemini TTS (`gemini-3.8-flash-lite-tts`) with voice personas (`Kore`, `Puck`, `Fenrir`, `Zephyr`, `Charon`) and browser SpeechSynthesis fallback.
   - Automatic voice activity detection with silence timer.

2. **Instant Bilingual Correction**
   - **Your Sentence**: Transcribed student utterance.
   - **Corrected**: Grammatically precise sentence.
   - **More Natural**: Idiomatic, native-speaker alternative.
   - **Explanation**: Clear linguistic explanation in Uzbek (O'zbek tilida) or English.
   - **Pronunciation Guidance**: IPA transcription, syllable stress, tricky sound tips.
   - **Suggested Vocabulary**: Level-boosting phrases with Uzbek meanings.

3. **14 Speaking Practice Modes**
   - Free Conversation, Daily Conversation, Job Interview, IELTS Speaking, Travel English, School & Academic, Business English, Pronunciation Practice, Vocabulary Practice, Grammar Conversation, Debate, Roleplay, Random Topic, Exam Simulation.

4. **CEFR Curricula (A1 - C2)**
   - Structured step-by-step topic lessons with warm-up prompts, vocabulary definitions in Uzbek, interactive dialogue with the AI teacher, and final performance recommendations.

5. **IELTS Speaking Simulator**
   - Part 1: Introduction & warm-up.
   - Part 2: Cue Card monologue with 1-minute prep and 2-minute speaking timers.
   - Part 3: Two-way analytical discussion.
   - Band score rubric evaluation (Fluency, Lexical Resource, Grammar, Pronunciation).

6. **Pronunciation Lab**
   - Minimal pairs (/ɪ/ vs /iː/, /θ/ vs /s/, /w/ vs /v/, etc.).
   - Tongue twisters with target sound focus.
   - Speech comparison and phonetic accuracy scoring.

7. **Extensive Vocabulary Vault**
   - 10 categories: Common, Advanced, Phrasal Verbs, Idioms, Collocations, Academic, Business, IELTS, Daily Expressions, Synonyms/Antonyms.
   - Integrated AI Deep-Dive Explorer to look up ANY English word or expression with instant IPA, definition, Uzbek translation, and pronunciation playback.
   - Interactive Flashcard review mode.

8. **Placement Level Test**
   - 5-part diagnostic test (Grammar, Vocabulary, Reading, Audio Comprehension, Spoken Response) calculating estimated CEFR level with personalized recommendations.

9. **Progress Dashboard & Clean Storage**
   - Speaking minutes, lessons completed, vocabulary mastered, grammar accuracy, pronunciation score, fluency score, 7-day activity chart, and streaks.
   - Clean data-access layer (`storage.ts`) ready for Supabase or PostgreSQL connection. Initial state is clean without mock/fake data.

---

## Vercel Deployment Instructions

This application is ready to deploy directly to Vercel:

### Method 1: Deploy with Vercel CLI

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set your environment variable in Vercel:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Paste your Google Gemini API key.

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via GitHub & Vercel Dashboard

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Import Project** and select your repository.
3. In **Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
5. Click **Deploy**.

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY`.

3. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Run type check:
   ```bash
   npm run lint
   ```

5. Build for production:
   ```bash
   npm run build
   ```

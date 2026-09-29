import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json({ limit: '30mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to check API key
const hasApiKey = () => !!process.env.GEMINI_API_KEY;

async function generateContentWithFallback(params: any) {
  const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash'];
  let lastErr: any;
  for (const model of candidateModels) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} failed: ${err?.message || err}. Attempting fallback.`);
    }
  }
  throw lastErr;
}

function buildGracefulResponse(userText: string, userLevel: string = 'B1', explanationLanguage: string = 'uz') {
  const lower = userText.toLowerCase();
  const isUzbekInput = /[\b\s](men|sen|biz|salom|bugun|qanday|yaxshi|kerak|bilan|uchun|nima|ha|yo'q|rahmat|qayerda|gapir|til|ish|dars)[\b\s]|^salom|^men|^bugun/i.test(lower);

  if (isUzbekInput) {
    return {
      reply: `That sounds like a wonderful topic! In English, you can say: "I want to speak English fluently." How often do you practice speaking English each day?`,
      correction: {
        hadErrors: true,
        userSentence: userText,
        correctedSentence: "I want to speak English fluently.",
        moreNatural: "My goal is to achieve effortless English fluency.",
        explanation: "O'zbekcha fikringizni ingliz tilida 'I want to speak English fluently' yoki 'I would like to speak...' deb ifodalashingiz mumkin. 'Fluently' (ravon tarzda) fe'ldan keyin keladi.",
        pronunciationTips: "Fluently /ˈfluː.ənt.li/ — birinchi bo'g'inga urg'u beriladi.",
        grammarPoints: ["'Want to' + Verb", "Adverb of manner positioning"],
        suggestedVocabulary: [
          { word: "fluent", translation: "ravon" },
          { word: "confidence", translation: "ishonch" }
        ],
        scores: { grammar: 85, vocabulary: 80, fluency: 82 },
      },
      feedback: {
        estimatedLevel: userLevel || 'B1',
        grammarScore: 85,
        vocabularyScore: 80,
        fluencyScore: 82,
      },
    };
  }

  return {
    reply: `That is a great thought! Practicing your speaking out loud is the fastest way to progress. Can you tell me a little more about that?`,
    correction: {
      hadErrors: false,
      userSentence: userText,
      correctedSentence: userText,
      moreNatural: userText,
      explanation: explanationLanguage === 'uz'
        ? "Gapingiz tushunarli va ma'nosi aniq ifodalangan. Nutq tezligi va intonatsiyasini yaxshilash uchun doimiy gapirishni davom eting!"
        : "Your sentence was conveyed clearly. Keep speaking with natural pacing and rhythm!",
      pronunciationTips: "Keep your intonation steady and stress the main content words in your sentence.",
      grammarPoints: ["Clear sentence structure", "Active participation"],
      suggestedVocabulary: [
        { word: "consistently", translation: "muntazam ravishda" }
      ],
      scores: { grammar: 88, vocabulary: 84, fluency: 85 },
    },
    feedback: {
      estimatedLevel: userLevel || 'B1',
      grammarScore: 88,
      vocabularyScore: 84,
      fluencyScore: 85,
    },
  };
}

// 1. CHAT ENDPOINT - Real-time English tutor conversation & linguistic correction
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      userText,
      messages = [],
      mode = 'free_conversation',
      userLevel = 'B1',
      explanationLanguage = 'uz',
      lessonContext = '',
      tutorVoice = 'Kore',
    } = req.body;

    if (!userText || typeof userText !== 'string') {
      return res.status(400).json({ error: 'userText is required' });
    }

    if (!hasApiKey()) {
      return res.json(buildGracefulResponse(userText, userLevel, explanationLanguage));
    }

    const isUzbek = explanationLanguage === 'uz';

    const systemInstruction = `You are LingoMentor AI, a world-class, empathetic, highly engaging AI English Speaking Teacher who is completely bilingual in ENGLISH and UZBEK.

CRITICAL BILINGUAL UNDERSTANDING (ENGLISH & UZBEK):
The student can speak or type in:
1. ENGLISH: If the student speaks English (with or without mistakes):
   - Evaluate grammar, vocabulary, and naturalness.
   - If there are mistakes: set hadErrors: true, provide the grammatically correct English sentence in correctedSentence, a native alternative in moreNatural, and explain the mistake and grammar rules in UZBEK (O'zbek tilida).
   - If completely correct: set hadErrors: false, show moreNatural phrasing, and give positive feedback in Uzbek.
   - In reply: speak naturally in English, encouraging the student and asking a natural follow-up question.
2. UZBEK: If the student speaks in UZBEK (e.g., asking how to say something, or replying in Uzbek like "Men do'stim bilan gaplashdim", "Bugun havo juda sovuq", "Buni qanday aytaman?"):
   - Understand the Uzbek speech completely!
   - In userSentence: retain what the student said in Uzbek.
   - In correctedSentence: provide the accurate, natural English translation of what they intended to express!
   - In moreNatural: provide the most authentic native English phrasing.
   - In explanation: explain in UZBEK (O'zbek tilida) how to express this in English, why each word/tense is used, and how to pronounce it.
   - In reply: reply in English, encouraging the student, showing them the English phrase, and asking a follow-up question so they practice speaking the English words!
3. MIXED (Code-Switching): If the student mixes Uzbek and English words:
   - Understand both seamlessly.
   - In correctedSentence: provide the full natural English sentence.
   - In explanation: explain in Uzbek how to say the complete sentence in pure English.
   - In reply: conversational English response.

SPEAKING & CONVERSATION RULES:
1. Keep your reply concise (2-4 sentences max so the voice dialogue flows naturally and fast). Never give long walls of text. Always end with an engaging question so the student speaks again.
2. Adapt difficulty to CEFR level: ${userLevel}.
3. Current Speaking Practice Mode: "${mode}".
${lessonContext ? `Lesson/Topic Context: ${lessonContext}` : ''}
4. Always provide IPA pronunciation tips, stress hints, and 1-2 suggested vocabulary with Uzbek translations.
5. If explanationLanguage is 'uz' (or if the student used Uzbek), write the explanation in clear, natural UZBEK (O'zbek tilida).
6. Output format must strictly match the JSON response schema.`;

    // Format recent chat history
    const conversationHistory = messages.slice(-8).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    conversationHistory.push({
      role: 'user',
      parts: [
        {
          text: `[Student speaks]: "${userText}"\nEvaluate this sentence and provide your conversational reply, correction, and feedback.`,
        },
      ],
    });

    const response = await generateContentWithFallback({
      contents: conversationHistory as any,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Your conversational reply in English, engaging and concise (2-4 sentences).',
            },
            correction: {
              type: Type.OBJECT,
              properties: {
                hadErrors: {
                  type: Type.BOOLEAN,
                  description: 'True if there were grammar or wording errors, false if completely natural.',
                },
                userSentence: {
                  type: Type.STRING,
                  description: "The user's original sentence.",
                },
                correctedSentence: {
                  type: Type.STRING,
                  description: 'The grammatically correct version.',
                },
                moreNatural: {
                  type: Type.STRING,
                  description: 'A native-sounding, natural idiomatic alternative.',
                },
                explanation: {
                  type: Type.STRING,
                  description: isUzbek
                    ? "Explanation of errors and grammar rules written in UZBEK (O'zbekcha)."
                    : 'Clear explanation of errors and grammar rules in English.',
                },
                pronunciationTips: {
                  type: Type.STRING,
                  description: 'Pronunciation guidance, phonetic hints, and stress advice.',
                },
                grammarPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key grammar topics observed.',
                },
                suggestedVocabulary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      translation: { type: Type.STRING },
                    },
                  },
                  description: '1-2 useful words or idioms to level up this sentence with Uzbek translation.',
                },
              },
              required: [
                'hadErrors',
                'userSentence',
                'correctedSentence',
                'moreNatural',
                'explanation',
                'pronunciationTips',
              ],
            },
            feedback: {
              type: Type.OBJECT,
              properties: {
                estimatedLevel: {
                  type: Type.STRING,
                  description: 'Estimated CEFR level: A1, A2, B1, B2, C1, or C2',
                },
                grammarScore: { type: Type.NUMBER, description: 'Score 0 to 100' },
                vocabularyScore: { type: Type.NUMBER, description: 'Score 0 to 100' },
                fluencyScore: { type: Type.NUMBER, description: 'Score 0 to 100' },
              },
              required: ['estimatedLevel', 'grammarScore', 'vocabularyScore', 'fluencyScore'],
            },
          },
          required: ['reply', 'correction', 'feedback'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Optionally generate high-fidelity speech for the reply
    let audioBase64: string | undefined = undefined;
    try {
      const speechRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: parsed.reply,
                speechMetadata: {
                  style: 'Warm, clear, articulate English teacher with natural pauses and encouraging tone',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: tutorVoice || 'Kore' },
            },
          },
        },
      });

      audioBase64 = speechRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (ttsErr) {
      console.warn('Inline TTS generation error, client will use Web Speech Synthesis fallback:', ttsErr);
    }

    return res.json({
      ...parsed,
      audioBase64,
    });
  } catch (error: any) {
    console.warn('Chat API error, providing graceful bilingual response:', error?.message);
    const { userText, userLevel = 'B1', explanationLanguage = 'uz' } = req.body || {};
    return res.json(buildGracefulResponse(userText || 'Hello', userLevel, explanationLanguage));
  }
});

// 2. TEXT-TO-SPEECH (TTS) ENDPOINT
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!hasApiKey()) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Crisp, articulate English pronunciation teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      return res.status(500).json({ error: 'No audio returned' });
    }

    return res.json({ audioBase64, mimeType: 'audio/wav' });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: 'TTS failed', details: err.message });
  }
});

// 3. TRANSCRIBE AUDIO ENDPOINT (for high-accuracy audio files / voice notes)
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    if (!hasApiKey()) {
      return res.status(503).json({ error: 'API key not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64,
            },
          },
          {
            text: 'Transcribe this English spoken audio accurately verbatim, including punctuation.',
          },
        ],
      },
    });

    return res.json({ text: response.text?.trim() || '' });
  } catch (err: any) {
    console.error('Transcribe error:', err);
    return res.status(500).json({ error: 'Transcription failed' });
  }
});

// 4. VOCABULARY LOOKUP & GENERATOR ENDPOINT
app.post('/api/vocabulary/lookup', async (req: Request, res: Response) => {
  try {
    const { query, language = 'uz' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!hasApiKey()) {
      return res.json({
        word: query,
        ipa: '/.../',
        partOfSpeech: 'noun / phrase',
        uzbekMeaning: `${query} so'zining ma'nosi`,
        englishDefinition: `Definition for ${query}`,
        exampleSentence: `Practice using ${query} in your next sentence.`,
        uzbekExample: `${query} so'zini keyingi jumlada ishlatib ko'ring.`,
        level: 'B1',
        synonyms: [],
        antonyms: [],
        collocations: [],
        tips: 'Learn words in sentences rather than in isolation.',
      });
    }

    const prompt = `Provide an in-depth linguistic entry for the English word or idiom: "${query}".
Translate the meaning and example into Uzbek (O'zbek tili). Provide accurate IPA phonetics, part of speech, CEFR level, synonyms, and collocations.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            ipa: { type: Type.STRING, description: 'IPA phonetic transcription, e.g. /ˈpræktɪs/' },
            partOfSpeech: { type: Type.STRING, description: 'noun, verb, adjective, phrasal verb, idiom, etc.' },
            uzbekMeaning: { type: Type.STRING, description: "Meaning in Uzbek (O'zbekcha tarjima)" },
            englishDefinition: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
            uzbekExample: { type: Type.STRING, description: 'Uzbek translation of the example sentence' },
            level: { type: Type.STRING, description: 'A1, A2, B1, B2, C1, or C2' },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            collocations: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.STRING, description: 'Helpful tip on usage, false friends, or pronunciation' },
          },
          required: [
            'word',
            'ipa',
            'partOfSpeech',
            'uzbekMeaning',
            'englishDefinition',
            'exampleSentence',
            'uzbekExample',
            'level',
          ],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return res.json(data);
  } catch (err: any) {
    console.error('Vocab lookup error:', err);
    return res.status(500).json({ error: 'Lookup failed', details: err.message });
  }
});

// 5. LEVEL TEST EVALUATION ENDPOINT
app.post('/api/level-test/evaluate', async (req: Request, res: Response) => {
  try {
    const { answers, spokenTranscript } = req.body;

    if (!hasApiKey()) {
      return res.json({
        cefrLevel: 'B1',
        overallScore: 68,
        grammarScore: 70,
        vocabularyScore: 65,
        readingScore: 72,
        listeningScore: 66,
        speakingScore: 68,
        breakdown: 'Good intermediate comprehension with solid conversational readiness.',
        strengths: ['Clear sentence comprehension', 'Daily vocabulary'],
        improvements: ['Complex tenses', 'Natural linking words'],
        recommendedLessons: ['lesson-b1-1', 'lesson-b1-2'],
      });
    }

    const prompt = `Evaluate this student's CEFR English placement test results:
Test Answers: ${JSON.stringify(answers)}
Spoken Transcript from speaking section: "${spokenTranscript || 'None provided'}"
Determine their precise CEFR level (A1, A2, B1, B2, C1, C2), detailed score breakdown, strengths, weak areas, and recommended focus.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cefrLevel: { type: Type.STRING, description: 'A1, A2, B1, B2, C1, or C2' },
            overallScore: { type: Type.NUMBER, description: '0-100' },
            grammarScore: { type: Type.NUMBER },
            vocabularyScore: { type: Type.NUMBER },
            readingScore: { type: Type.NUMBER },
            listeningScore: { type: Type.NUMBER },
            speakingScore: { type: Type.NUMBER },
            breakdown: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedLessons: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'cefrLevel',
            'overallScore',
            'grammarScore',
            'vocabularyScore',
            'readingScore',
            'listeningScore',
            'speakingScore',
            'breakdown',
            'strengths',
            'improvements',
          ],
        },
      },
    });

    const evaluation = JSON.parse(response.text || '{}');
    return res.json(evaluation);
  } catch (err: any) {
    console.error('Level test evaluation error:', err);
    return res.status(500).json({ error: 'Evaluation failed' });
  }
});

// Vite or Static files handling
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LingoMentor AI server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start listener if run directly (not imported as serverless function)
if (process.env.VERCEL !== '1') {
  startServer().catch((err) => {
    console.error('Server startup error:', err);
  });
}

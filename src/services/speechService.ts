export interface SpeechRecognitionHandlers {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static activeAudio: HTMLAudioElement | null = null;

  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public static startListening(handlers: SpeechRecognitionHandlers, lang: string = 'en-US') {
    if (!this.isRecognitionSupported()) {
      handlers.onError?.('NOT_SUPPORTED');
      return;
    }

    try {
      this.stopListening();
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
        handlers.onStart?.();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          handlers.onInterimResult?.(interimTranscript);
        }
        if (finalTranscript) {
          handlers.onFinalResult?.(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          handlers.onError?.('NOT_ALLOWED');
        } else if (event.error !== 'no-speech') {
          handlers.onError?.(event.error);
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        handlers.onEnd?.();
      };

      this.recognition = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      handlers.onError?.(e.message || 'START_FAILED');
    }
  }

  public static stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  public static getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Plays speech using base64 audio (e.g. from Gemini TTS) or falls back to SpeechSynthesis
   */
  public static async speak(
    text: string,
    options?: {
      audioBase64?: string;
      rate?: number;
      voicePreference?: string;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): Promise<void> {
    this.stopSpeaking();

    // 1. Try base64 audio first if provided
    if (options?.audioBase64) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${options.audioBase64}`);
        audio.playbackRate = options.rate || 1.0;
        this.activeAudio = audio;

        audio.onplay = () => options.onStart?.();
        audio.onended = () => {
          this.activeAudio = null;
          options.onEnd?.();
        };
        audio.onerror = () => {
          console.warn('Base64 audio playback failed, falling back to Web Speech Synthesis.');
          this.speakNative(text, options);
        };

        await audio.play();
        return;
      } catch (e) {
        console.warn('Audio play error, falling back to Web Speech Synthesis:', e);
      }
    }

    // 2. Fallback to native Web Speech Synthesis
    this.speakNative(text, options);
  }

  private static speakNative(
    text: string,
    options?: {
      rate?: number;
      voicePreference?: string;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      options?.onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 1.0;
      utterance.lang = 'en-US';

      // Pick best English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const naturalEn = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
        );
        if (naturalEn) {
          utterance.voice = naturalEn;
        } else {
          const anyEn = voices.find((v) => v.lang.startsWith('en'));
          if (anyEn) utterance.voice = anyEn;
        }
      }

      utterance.onstart = () => options?.onStart?.();
      utterance.onend = () => options?.onEnd?.();
      utterance.onerror = () => options?.onEnd?.();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      options?.onEnd?.();
    }
  }

  public static stopSpeaking() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.activeAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }
}

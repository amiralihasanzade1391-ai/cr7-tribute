"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const STORAGE_KEY = "cr7_audio_muted";

export interface AudioPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  analyserNode: AnalyserNode | null;
}

export function useAudioPlayer(): AudioPlayerState {
  const [isMuted, setIsMuted] = useState<boolean>(true); // Muted by default per directives
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ambientOscillatorsRef = useRef<OscillatorNode[]>([]);
  const ambientGainRef = useRef<GainNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Web Audio Context and Analyser
  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  // Synthesize Cinematic Ambient Drone Pad (Fallback when no MP3 is present)
  const startSynthesizedPad = useCallback((ctx: AudioContext, analyser: AnalyserNode) => {
    if (ambientOscillatorsRef.current.length > 0) return;

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2.0);

      // Lowpass Filter for warm dark cinema sound
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      // Luscious Cinematic Drone Chord: F1 (43.65Hz), C2 (65.41Hz), G#2 (103.83Hz), C3 (130.81Hz)
      const frequencies = [43.65, 65.41, 103.83, 130.81];
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.25 / frequencies.length, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      filter.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      ambientGainRef.current = masterGain;
      ambientOscillatorsRef.current = oscs;
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  // Stop Synthesized Pad
  const stopSynthesizedPad = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ambientGainRef.current && ctx) {
      ambientGainRef.current.gain.setValueAtTime(ambientGainRef.current.gain.value, ctx.currentTime);
      ambientGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    }
    setTimeout(() => {
      ambientOscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      ambientOscillatorsRef.current = [];
    }, 450);
  }, []);

  // Restore user mute preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsMuted(saved === "true");
      }
    } catch {}
  }, []);

  // Attempt to load external ambient audio or synthesize fallback
  const startBackgroundAudio = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx || !analyserRef.current) return;

    if (!audioElRef.current) {
      const audio = new Audio("/audio/ambient-cinematic.mp3");
      audio.loop = true;
      audio.volume = 0.35;
      audioElRef.current = audio;

      // When MP3 can play, route it through Web Audio Analyser
      audio.addEventListener("canplaythrough", () => {
        try {
          if (!ctx || !analyserRef.current) return;
          const source = ctx.createMediaElementSource(audio);
          source.connect(analyserRef.current);
          analyserRef.current.connect(ctx.destination);
        } catch {}
      });

      // If MP3 fails to load, gracefully start synthesized cinematic drone
      audio.addEventListener("error", () => {
        if (!isMuted && ctx && analyserRef.current) {
          startSynthesizedPad(ctx, analyserRef.current);
        }
      });
    }

    if (!isMuted) {
      audioElRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Play synthesized pad if MP3 fails or blocked
          if (ctx && analyserRef.current) {
            startSynthesizedPad(ctx, analyserRef.current);
            setIsPlaying(true);
          }
        });
    }
  }, [ensureAudioContext, isMuted, startSynthesizedPad]);

  // Toggle Mute / Play
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    try {
      localStorage.setItem(STORAGE_KEY, String(nextMuted));
    } catch {}

    const ctx = ensureAudioContext();
    if (!ctx || !analyserRef.current) return;

    if (nextMuted) {
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
      stopSynthesizedPad();
      setIsPlaying(false);
    } else {
      startBackgroundAudio();
      setIsPlaying(true);
    }
  }, [ensureAudioContext, isMuted, startBackgroundAudio, stopSynthesizedPad]);

  // Synthesize soft golden sine ping hover sound (880Hz, 50ms envelope)
  const playHover = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1174, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, [ensureAudioContext, isMuted]);

  // Synthesize deeper tactile thud click sound with subtle decay
  const playClick = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [ensureAudioContext, isMuted]);

  return {
    isPlaying,
    isMuted,
    toggleMute,
    playHover,
    playClick,
    analyserNode: analyserRef.current,
  };
}

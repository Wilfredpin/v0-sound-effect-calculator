"use client";

import { useCallback, useRef } from "react";

type SoundType = "number" | "operator" | "function" | "equals" | "error";

export function useCalculatorSounds() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Different sound configurations based on button type
      switch (type) {
        case "number":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            600,
            ctx.currentTime + 0.08
          );
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.08
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.08);
          break;

        case "operator":
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.05); // E5
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.12
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.12);
          break;

        case "function":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(400, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            300,
            ctx.currentTime + 0.06
          );
          gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.06
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.06);
          break;

        case "equals":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          oscillator.start(ctx.currentTime);

          // Create a second oscillator for chord effect
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
          gain2.gain.setValueAtTime(0.15, ctx.currentTime);
          osc2.start(ctx.currentTime);

          // Third note for major chord
          const osc3 = ctx.createOscillator();
          const gain3 = ctx.createGain();
          osc3.connect(gain3);
          gain3.connect(ctx.destination);
          osc3.type = "sine";
          osc3.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
          gain3.gain.setValueAtTime(0.12, ctx.currentTime);
          osc3.start(ctx.currentTime);

          // Fade out all
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.25
          );
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

          oscillator.stop(ctx.currentTime + 0.25);
          osc2.stop(ctx.currentTime + 0.25);
          osc3.stop(ctx.currentTime + 0.25);
          break;

        case "error":
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            100,
            ctx.currentTime + 0.15
          );
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.15
          );
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;
      }
    },
    [getAudioContext]
  );

  return { playSound };
}

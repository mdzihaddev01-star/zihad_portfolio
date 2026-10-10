// Web Audio API Retro Sound Effects Engine

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundFx = {
  isEnabled(): boolean {
    return isSoundEnabled;
  },

  toggleSound(): boolean {
    isSoundEnabled = !isSoundEnabled;
    return isSoundEnabled;
  },

  setSound(enabled: boolean) {
    isSoundEnabled = enabled;
  },

  // 1. Retro Blip (UI Hover / Switch)
  playBlip() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  // 2. Snake Food Munch (Chirp sound)
  playEat() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.06);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  },

  // 3. Cyber Jump (Runner leap)
  playJump() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  },

  // 4. Retro Explosion / Game Over
  playGameOver() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  },

  // 5. Zero-Gravity Warp Whoosh
  playWarp() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  },

  // 6. Confetti Victory Chime
  playFanfare() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  },

  // 7. Cinematic Cyberpunk Ambient Drone Synthesizer
  startAmbientDrone(): boolean {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (isAmbientPlaying) return true;

    try {
      // Dual detuned low-frequency oscillators for warm spatial depth
      ambientOsc1 = ctx.createOscillator();
      ambientOsc2 = ctx.createOscillator();
      ambientFilter = ctx.createBiquadFilter();
      ambientGain = ctx.createGain();

      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(110.4, ctx.currentTime); // A2 note + subtle beating

      // Warm resonant lowpass filter
      ambientFilter.type = 'lowpass';
      ambientFilter.frequency.setValueAtTime(320, ctx.currentTime);
      ambientFilter.Q.setValueAtTime(2.5, ctx.currentTime);

      // Smooth volume fade in
      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2.0);

      ambientOsc1.connect(ambientFilter);
      ambientOsc2.connect(ambientFilter);
      ambientFilter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc1.start();
      ambientOsc2.start();
      isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  },

  stopAmbientDrone() {
    if (!isAmbientPlaying) return;
    const ctx = getAudioContext();
    if (ctx && ambientGain) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        try {
          ambientOsc1?.stop();
          ambientOsc2?.stop();
          ambientOsc1?.disconnect();
          ambientOsc2?.disconnect();
        } catch {
          // ignore
        }
        ambientOsc1 = null;
        ambientOsc2 = null;
        isAmbientPlaying = false;
      }, 850);
    } else {
      isAmbientPlaying = false;
    }
  },

  toggleAmbientDrone(): boolean {
    if (isAmbientPlaying) {
      this.stopAmbientDrone();
      return false;
    } else {
      return this.startAmbientDrone();
    }
  },

  isAmbientActive(): boolean {
    return isAmbientPlaying;
  },
};

let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientFilter: BiquadFilterNode | null = null;
let ambientGain: GainNode | null = null;
let isAmbientPlaying = false;


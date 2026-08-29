/**
 * 100% Offline Web Audio API Synthesizer for 8-Bit Arcade Sound FX & Chiptune Music
 */

export class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  private isMuted = false;
  private sfxVolume = 0.5;
  private musicVolume = 0.3;

  private musicInterval: any = null;
  private currentMusicTheme: string | null = null;
  private stepIndex = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
    } catch (e) {
      console.warn('AudioContext initialization failed', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  setSFXVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  // --- Sound Effects Synthesis ---

  playLaser(pitch = 1.0) {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(110 * pitch, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playHeavyLaser() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playExplosion(isBoss = false) {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const duration = isBoss ? 0.8 : 0.35;

    // White Noise buffer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give that crunchy 8-bit rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBoss ? 450 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isBoss ? 0.6 : 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  playJump() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCoin() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playPowerup() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [330, 392, 523, 659, 784];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.3, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.1);
    });
  }

  playHit() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playBounce(pitch = 1.0) {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(160 * pitch, now + 0.06);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playDash() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playGameOver() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [440, 415, 392, 370, 311];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.35, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.18);
    });
  }

  playCameraClick() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Shutter click 1 (high snap)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2400, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.03);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.03);

    // Shutter click 2 (mechanical release)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1600, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    gain2.gain.setValueAtTime(0.35, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.1);
  }

  playFanfare() {
    this.resume();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Victorious brass-style chord arpeggio
    const notes = [
      { f: 523.25, d: 0.1, t: 0 },       // C5
      { f: 659.25, d: 0.1, t: 0.08 },    // E5
      { f: 783.99, d: 0.1, t: 0.16 },    // G5
      { f: 1046.50, d: 0.35, t: 0.24 },  // C6 (held)
    ];

    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.35, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  // --- Chiptune Arpeggiator Music Synthesizer ---

  startMusic(theme: 'shmup' | 'brick_breaker' | 'platformer' | 'tank_arena') {
    if (this.currentMusicTheme === theme && this.musicInterval) return;
    this.stopMusic();
    this.currentMusicTheme = theme;
    this.stepIndex = 0;

    const bpm = theme === 'shmup' ? 140 : theme === 'brick_breaker' ? 128 : theme === 'platformer' ? 136 : 120;
    const intervalMs = (60 / bpm / 4) * 1000; // 16th note steps

    this.musicInterval = setInterval(() => {
      this.playMusicStep(theme);
    }, intervalMs);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentMusicTheme = null;
  }

  private playMusicStep(theme: string) {
    if (this.isMuted || !this.ctx || !this.musicGain) return;

    const now = this.ctx.currentTime;
    const step = this.stepIndex % 32;
    this.stepIndex++;

    // Base Chords & Arpeggio tables
    let leadFreq = 0;
    let bassFreq = 0;
    let playKick = false;
    let playHihat = false;
    let playSnare = false;

    if (theme === 'shmup') {
      // Fast cyber synthwave arpeggio
      const bassLine = [110, 110, 110, 110, 130.81, 130.81, 146.83, 164.81]; // A2, C3, D3, E3
      bassFreq = bassLine[Math.floor(step / 4) % bassLine.length];

      const leadArp = [220, 261.63, 329.63, 440, 523.25, 659.25, 523.25, 440];
      leadFreq = leadArp[step % leadArp.length];

      if (step % 8 === 0) playKick = true;
      if (step % 8 === 4) playSnare = true;
      if (step % 2 === 0) playHihat = true;
    } else if (theme === 'brick_breaker') {
      // Funky arcade bouncy rhythm
      const bassLine = [130.81, 130.81, 174.61, 174.61, 196, 196, 164.81, 164.81]; // C3, F3, G3, E3
      bassFreq = bassLine[Math.floor(step / 4) % bassLine.length];

      const leadArp = [261.63, 329.63, 392, 523.25, 392, 329.63, 261.63, 196];
      leadFreq = leadArp[step % leadArp.length];

      if (step % 8 === 0 || step % 8 === 6) playKick = true;
      if (step % 8 === 4) playSnare = true;
      playHihat = true;
    } else if (theme === 'platformer') {
      // 8-bit upbeat adventure melody
      const bassLine = [146.83, 146.83, 164.81, 174.61, 220, 196, 174.61, 164.81];
      bassFreq = bassLine[Math.floor(step / 4) % bassLine.length];

      const leadArp = [293.66, 349.23, 440, 587.33, 440, 349.23, 392, 523.25];
      leadFreq = leadArp[step % leadArp.length];

      if (step % 8 === 0) playKick = true;
      if (step % 8 === 4) playSnare = true;
      if (step % 4 === 2) playHihat = true;
    } else {
      // Tank tactical tension
      const bassLine = [82.41, 82.41, 98.0, 82.41, 110.0, 98.0, 73.42, 82.41]; // E2, G2, A2, D2
      bassFreq = bassLine[Math.floor(step / 4) % bassLine.length];

      const leadArp = [164.81, 196.0, 246.94, 329.63, 293.66, 246.94, 196.0, 164.81];
      leadFreq = leadArp[step % leadArp.length];

      if (step % 8 === 0) playKick = true;
      if (step % 8 === 4) playSnare = true;
    }

    // Play bass note (Triangle wave for soft 8-bit thumping bass)
    if (step % 2 === 0 && bassFreq > 0) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(bassFreq, now);

      bGain.gain.setValueAtTime(0.2, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      bOsc.connect(bGain);
      bGain.connect(this.musicGain);

      bOsc.start(now);
      bOsc.stop(now + 0.12);
    }

    // Play lead synth note (Square wave with pulse charm)
    if (leadFreq > 0) {
      const lOsc = this.ctx.createOscillator();
      const lGain = this.ctx.createGain();
      lOsc.type = 'square';
      lOsc.frequency.setValueAtTime(leadFreq, now);

      lGain.gain.setValueAtTime(0.08, now);
      lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      lOsc.connect(lGain);
      lGain.connect(this.musicGain);

      lOsc.start(now);
      lOsc.stop(now + 0.08);
    }

    // Drums: 8-bit Kick
    if (playKick) {
      const kOsc = this.ctx.createOscillator();
      const kGain = this.ctx.createGain();
      kOsc.type = 'sine';
      kOsc.frequency.setValueAtTime(140, now);
      kOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      kGain.gain.setValueAtTime(0.3, now);
      kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      kOsc.connect(kGain);
      kGain.connect(this.musicGain);

      kOsc.start(now);
      kOsc.stop(now + 0.08);
    }

    // Drums: 8-bit Snare (Noise burst + tonal drop)
    if (playSnare) {
      const sOsc = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sOsc.type = 'triangle';
      sOsc.frequency.setValueAtTime(180, now);
      sOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      sGain.gain.setValueAtTime(0.2, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      sOsc.connect(sGain);
      sGain.connect(this.musicGain);

      sOsc.start(now);
      sOsc.stop(now + 0.06);
    }

    // Drums: 8-bit HiHat
    if (playHihat) {
      const hOsc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      hOsc.type = 'square';
      hOsc.frequency.setValueAtTime(6000 + Math.random() * 2000, now);

      hGain.gain.setValueAtTime(0.05, now);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      hOsc.connect(hGain);
      hGain.connect(this.musicGain);

      hOsc.start(now);
      hOsc.stop(now + 0.02);
    }
  }
}

export const soundEngine = new RetroAudioEngine();

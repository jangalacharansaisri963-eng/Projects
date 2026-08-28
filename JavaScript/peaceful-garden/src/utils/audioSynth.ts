class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.55;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;
  private ambientNoiseNode: AudioNode | null = null;
  private currentPreset: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl' = 'cozy_chords';
  private chordIndex: number = 0;

  constructor() {
    // Lazy initialize on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm(this.currentPreset);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(musicVol: number, sfxVol: number) {
    this.musicVolume = Math.max(0, Math.min(1, musicVol));
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
  }

  public setPreset(preset: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl') {
    this.currentPreset = preset;
    if (this.isBgmPlaying && !this.isMuted) {
      this.stopBgm();
      this.startBgm(preset);
    }
  }

  public startBgm(preset?: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (preset) this.currentPreset = preset;
    this.isBgmPlaying = true;
    this.stopBgm(); // clear existing intervals

    this.playNextChord();
    this.bgmIntervalId = setInterval(() => {
      this.playNextChord();
    }, 4200);
  }

  public stopBgm() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }

  private playNextChord() {
    if (!this.ctx || this.isMuted || !this.isBgmPlaying) return;

    // Peaceful Chord Progressions
    // 1: Cmaj7, Am9, Fmaj7, G6
    // 2: Dmaj7, Bm7, Gmaj7, Asus4
    // 3: E minor pentatonic chill
    const progressions = {
      cozy_chords: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
        [174.61, 261.63, 329.63, 392.00], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G6
      ],
      rain_kalimba: [
        [329.63, 392.00, 493.88, 587.33], // Em7
        [293.66, 369.99, 440.00, 587.33], // D6
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [246.94, 293.66, 369.99, 440.00], // Bm7
      ],
      wind_chimes: [
        [523.25, 659.25, 783.99, 987.77, 1046.50], // C high chime
        [440.00, 523.25, 659.25, 880.00], // A chime
        [392.00, 493.88, 587.33, 783.99], // G chime
        [349.23, 440.00, 523.25, 698.46], // F chime
      ],
      zen_bowl: [
        [146.83, 220.00, 293.66, 440.00], // D deep drone
        [164.81, 246.94, 329.63, 493.88], // E drone
        [130.81, 196.00, 261.63, 392.00], // C drone
        [146.83, 220.00, 293.66, 369.99], // D maj drone
      ]
    };

    const chords = progressions[this.currentPreset] || progressions.cozy_chords;
    const chord = chords[this.chordIndex % chords.length];
    this.chordIndex++;

    const now = this.ctx.currentTime;

    // Play soft arpeggiated Rhodes / Kalimba notes
    chord.forEach((freq, i) => {
      const noteDelay = i * 0.18 + (Math.random() * 0.05);
      this.playCalmNote(freq, now + noteDelay, 3.2, this.currentPreset);
    });

    // Occasional windchime or bell highlight
    if (Math.random() > 0.4) {
      const chimeFreqs = [783.99, 880.00, 987.77, 1174.66, 1318.51];
      const randomChime = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
      this.playChimePluck(randomChime, now + 1.2 + Math.random() * 1.5);
    }
  }

  private playCalmNote(freq: number, startTime: number, duration: number, preset: string) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm, soft acoustic tone
    osc.type = preset === 'zen_bowl' ? 'sine' : (preset === 'rain_kalimba' ? 'triangle' : 'sine');
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm Low-pass filter for cozy lofi feel
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(preset === 'wind_chimes' ? 2200 : 950, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    const masterVol = this.musicVolume * 0.12;

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(masterVol, startTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(masterVol * 0.5, startTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playChimePluck(freq: number, startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, startTime);
    filter.Q.setValueAtTime(8, startTime);

    const vol = this.musicVolume * 0.08;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 2.0);
  }

  // --- SOUND EFFECTS ---

  public playWaterSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Splash simulation using filtered white noise + bubbly oscillators
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
    filter.Q.setValueAtTime(4.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);

    // Droplet bubble blips
    [400, 560, 680].forEach((f, idx) => {
      const dropOsc = this.ctx!.createOscillator();
      const dropGain = this.ctx!.createGain();
      const t = now + idx * 0.08;
      dropOsc.frequency.setValueAtTime(f, t);
      dropOsc.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.1);

      dropGain.gain.setValueAtTime(this.sfxVolume * 0.15, t);
      dropGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      dropOsc.connect(dropGain);
      dropGain.connect(this.ctx!.destination);
      dropOsc.start(t);
      dropOsc.stop(t + 0.13);
    });
  }

  public playMistSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  public playDigSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPlantSeedSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playHarvestSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major bright sparkle
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  public playPruneSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playBellChimeSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [432, 864, 1296]; // Pure 432Hz harmonic
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = (this.sfxVolume * 0.25) / (idx + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(amp, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  public playCoinSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 -> E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  public playGemSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  public playQuestCompleteSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  public playPotPlacementSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playPollinationSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Magic genetic pollination swirl
    const freqs = [440, 554.37, 659.25, 830.61, 987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + 0.3);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.22, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  public playMutationSuccessSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Celestial mutation fanfare chord
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.28, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 1.25);
    });
  }

  public playWeatherChangeSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.7);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  }

  public playBirdChirp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(3600, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playAchievementSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.25, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  public playReviveSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.22, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  public playPerfectionSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Brilliant euphoric 100% completion sparkling arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + idx * 0.055;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.15);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.3, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  public playStreakRewardSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Grand daily streak trumpet-like harmonic celebration
    const notes = [
      { freq: 440.00, delay: 0.00, dur: 0.25 },
      { freq: 554.37, delay: 0.12, dur: 0.25 },
      { freq: 659.25, delay: 0.24, dur: 0.35 },
      { freq: 880.00, delay: 0.40, dur: 0.75 },
      { freq: 1108.73, delay: 0.40, dur: 0.75 },
    ];
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = now + n.delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(this.sfxVolume * 0.32, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + n.dur + 0.05);
    });
  }
}

export const audioSynth = new AudioSynthesizer();

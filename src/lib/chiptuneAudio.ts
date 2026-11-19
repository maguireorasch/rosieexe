import type { SoundSettings } from '../types/rosie';

export type SfxKind =
  | 'boot'
  | 'click'
  | 'nav'
  | 'select'
  | 'flip'
  | 'unlock'
  | 'attack'
  | 'victory'
  | 'treasure';

class ChiptuneSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private isMusicPlaying = false;

  private settings: SoundSettings = {
    musicEnabled: true,
    sfxEnabled: true,
    volume: 0.55,
  };

  // Cheerful, original 8-bit pink pixel adventure melody (C5/F4/G4/Am/F/G/C)
  private readonly melody: Array<{ lead: number; bass: number }> = [
    { lead: 523.25, bass: 174.61 }, // C5 / F3
    { lead: 659.25, bass: 174.61 }, // E5
    { lead: 783.99, bass: 220.0 },  // G5 / A3
    { lead: 659.25, bass: 220.0 },  // E5
    { lead: 698.46, bass: 196.0 },  // F5 / G3
    { lead: 587.33, bass: 196.0 },  // D5
    { lead: 523.25, bass: 130.81 }, // C5 / C3
    { lead: 392.0, bass: 130.81 },  // G4
    { lead: 440.0, bass: 174.61 },  // A4 / F3
    { lead: 523.25, bass: 174.61 }, // C5
    { lead: 587.33, bass: 196.0 },  // D5 / G3
    { lead: 659.25, bass: 196.0 },  // E5
    { lead: 783.99, bass: 130.81 }, // G5 / C3
    { lead: 659.25, bass: 196.0 },  // E5 / G3
    { lead: 523.25, bass: 130.81 }, // C5 / C3
    { lead: 0, bass: 130.81 },
  ];

  private ensureContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.settings.volume;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.settings.musicEnabled ? 0.22 : 0;

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.settings.sfxEnabled ? 0.45 : 0;

    this.bgmGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    return this.ctx;
  }

  public applySettings(next: SoundSettings) {
    this.settings = { ...next };
    if (this.ctx && this.masterGain && this.bgmGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(next.volume, now, 0.03);
      this.bgmGain.gain.setTargetAtTime(next.musicEnabled ? 0.22 : 0, now, 0.03);
      this.sfxGain.gain.setTargetAtTime(next.sfxEnabled ? 0.45 : 0, now, 0.03);
    }
    if (!next.musicEnabled) {
      this.stopMusic();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    target: 'bgm' | 'sfx',
    delayOffset = 0,
    gainPeak = 0.28
  ) {
    if (freq <= 0) return;
    const ctx = this.ensureContext();
    const out = target === 'bgm' ? this.bgmGain : this.sfxGain;
    if (!ctx || !out) return;

    const start = ctx.currentTime + delayOffset;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    env.gain.setValueAtTime(0.001, start);
    env.gain.linearRampToValueAtTime(gainPeak, start + 0.015);
    env.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(env);
    env.connect(out);

    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  public startMusic() {
    if (!this.settings.musicEnabled || this.isMusicPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    const tick = () => {
      if (!this.isMusicPlaying || !this.settings.musicEnabled) return;
      const step = this.melody[this.bgmStep % this.melody.length];
      if (step.lead > 0) {
        this.playTone(step.lead, 0.24, 'square', 'bgm', 0, 0.14);
      }
      if (step.bass > 0) {
        this.playTone(step.bass, 0.28, 'triangle', 'bgm', 0, 0.2);
      }
      this.bgmStep = (this.bgmStep + 1) % this.melody.length;
      this.bgmTimer = window.setTimeout(tick, 310);
    };
    tick();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.bgmTimer !== null) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public playSfx(kind: SfxKind) {
    if (!this.settings.sfxEnabled) return;
    switch (kind) {
      case 'boot':
        this.playTone(440, 0.09, 'square', 'sfx', 0, 0.22);
        this.playTone(880, 0.14, 'square', 'sfx', 0.09, 0.22);
        break;
      case 'click':
        this.playTone(620, 0.06, 'square', 'sfx', 0, 0.2);
        break;
      case 'nav':
        this.playTone(523.25, 0.07, 'triangle', 'sfx', 0, 0.25);
        this.playTone(659.25, 0.08, 'triangle', 'sfx', 0.06, 0.22);
        break;
      case 'select':
        this.playTone(523.25, 0.08, 'square', 'sfx', 0, 0.2);
        this.playTone(659.25, 0.08, 'square', 'sfx', 0.07, 0.2);
        this.playTone(783.99, 0.14, 'square', 'sfx', 0.14, 0.22);
        break;
      case 'flip':
        this.playTone(480, 0.05, 'triangle', 'sfx', 0, 0.24);
        this.playTone(740, 0.09, 'sine', 'sfx', 0.05, 0.26);
        break;
      case 'unlock':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) =>
          this.playTone(f, 0.14, 'square', 'sfx', idx * 0.08, 0.22)
        );
        break;
      case 'attack':
        this.playTone(220, 0.08, 'sawtooth', 'sfx', 0, 0.26);
        this.playTone(130, 0.12, 'square', 'sfx', 0.05, 0.24);
        break;
      case 'victory':
        [523.25, 523.25, 523.25, 659.25, 587.33, 659.25, 783.99].forEach((f, idx) =>
          this.playTone(f, idx === 6 ? 0.35 : 0.11, 'square', 'sfx', idx * 0.11, 0.22)
        );
        break;
      case 'treasure':
        [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66].forEach((f, idx) =>
          this.playTone(f, 0.18, 'triangle', 'sfx', idx * 0.075, 0.28)
        );
        break;
    }
  }
}

export const chiptune = new ChiptuneSoundEngine();

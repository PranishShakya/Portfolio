// Web Audio API Synthesizers for cosmic suction rumble and realistic rolling thunder

// ── Cosmic Suction (Space Destruction) Hum & Rumble ────────────────
let suctionCtx = null;
let suctionOsc = null;
let suctionFilter = null;
let suctionGain = null;
let suctionLfo = null;

export const startSuctionSound = () => {
  try {
    // Only initialize if not already playing
    if (suctionCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    suctionCtx = new AudioContext();
    const now = suctionCtx.currentTime;

    // Sawtooth oscillator for a rich, vibrating hum
    suctionOsc = suctionCtx.createOscillator();
    suctionOsc.type = "sawtooth";
    suctionOsc.frequency.setValueAtTime(42, now); // Low cosmic base rumble

    // Lowpass filter to shave off harsh high frequencies, yielding a deep resonance
    suctionFilter = suctionCtx.createBiquadFilter();
    suctionFilter.type = "lowpass";
    suctionFilter.frequency.setValueAtTime(140, now);
    suctionFilter.Q.setValueAtTime(5, now);

    // Gain node for absolute volume control
    suctionGain = suctionCtx.createGain();
    suctionGain.gain.setValueAtTime(0.001, now); // start silent

    // LFO (Low Frequency Oscillator) to modulate frequency and simulate cosmic wobble/destruction
    suctionLfo = suctionCtx.createOscillator();
    suctionLfo.type = "sine";
    suctionLfo.frequency.setValueAtTime(9, now); // 9 Hz wobble speed

    const lfoGain = suctionCtx.createGain();
    lfoGain.gain.setValueAtTime(18, now); // modulate pitch by +/- 18Hz

    // Wire up LFO pitch modulation
    suctionLfo.connect(lfoGain);
    lfoGain.connect(suctionOsc.frequency);

    // Wire up main audio pipeline
    suctionOsc.connect(suctionFilter);
    suctionFilter.connect(suctionGain);
    suctionGain.connect(suctionCtx.destination);

    // Start oscillations
    suctionOsc.start(now);
    suctionLfo.start(now);

    // Ramp volume and filter frequency to simulate building tension of suction
    suctionGain.gain.linearRampToValueAtTime(0.3, now + 0.5);
    suctionFilter.frequency.exponentialRampToValueAtTime(320, now + 1.2);
  } catch (e) {
    console.warn("Failed to play cosmic suction sound:", e);
  }
};

export const stopSuctionSound = () => {
  if (!suctionCtx) return;

  try {
    const now = suctionCtx.currentTime;
    // Fade out volume quickly but smoothly to avoid click sounds
    suctionGain.gain.cancelScheduledValues(now);
    suctionGain.gain.setValueAtTime(suctionGain.gain.value, now);
    suctionGain.gain.linearRampToValueAtTime(0.001, now + 0.3);

    const tempCtx = suctionCtx;
    const tempOsc = suctionOsc;
    const tempLfo = suctionLfo;

    suctionCtx = null;
    suctionOsc = null;
    suctionLfo = null;
    suctionFilter = null;
    suctionGain = null;

    setTimeout(() => {
      try {
        if (tempOsc) tempOsc.stop();
        if (tempLfo) tempLfo.stop();
        if (tempCtx && tempCtx.state !== "closed") {
          tempCtx.close();
        }
      } catch (err) {}
    }, 400);
  } catch (e) {
    console.warn("Error while stopping suction sound:", e);
  }
};


// ── Realistic Rolling Thunder Synthesizer ──────────────────────────
export const playThunderSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // 1. White Noise generator for atmospheric rain/thunder rumble
    const bufferSize = ctx.sampleRate * 5.0; // 5 seconds of thunder rumble
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // 2. Heavy lowpass filter to emulate thunder sound profile (deep & muffled)
    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    lowpassFilter.frequency.setValueAtTime(420, now);  // wider for more crispness on the strike
    lowpassFilter.Q.setValueAtTime(6, now);

    // Muffle the frequency as the thunder travels/rolls away
    lowpassFilter.frequency.exponentialRampToValueAtTime(55, now + 4.5);

    // 3. Master gain amplifier — boosts the overall thunder loudness
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(2.2, now); // 2.2× amplifier

    // 4. Gain envelope for master levels (lightning clap + rolling decay)
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.001, now);

    // Lightning clap — powerful, immediate crack
    envelope.gain.linearRampToValueAtTime(0.95, now + 0.04); // sharp, powerful crack
    envelope.gain.exponentialRampToValueAtTime(0.35, now + 0.35); // decay to heavy rumble

    // Secondary rolling thunder surges (echoes bouncing off clouds)
    envelope.gain.linearRampToValueAtTime(0.65, now + 0.75);
    envelope.gain.exponentialRampToValueAtTime(0.20, now + 1.8);
    envelope.gain.linearRampToValueAtTime(0.38, now + 2.4);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 5.0); // complete fade

    // 5. Low Sub-Bass oscillator — heavy physical weight/rumble vibration
    const subOsc = ctx.createOscillator();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(36, now); // 36 Hz sub-bass

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.70, now + 0.07); // stronger sub-clout
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2); // fade out

    // Wire up connections — route noise through masterGain for amplification
    noiseNode.connect(lowpassFilter);
    lowpassFilter.connect(envelope);
    envelope.connect(masterGain);
    masterGain.connect(ctx.destination);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);


    // Start playing
    noiseNode.start(now);
    subOsc.start(now);

    // Safe disposal of audio context
    noiseNode.stop(now + 5.0);
    subOsc.stop(now + 5.0);
    
    setTimeout(() => {
      try {
        ctx.close();
      } catch (err) {}
    }, 5500);
  } catch (e) {
    console.warn("Failed to synthesize thunder sound:", e);
  }
};

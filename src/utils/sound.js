const SOUND_MAP = {
  correct: { frequency: 740, duration: 0.14, type: 'sine' },
  incorrect: { frequency: 180, duration: 0.18, type: 'sawtooth' },
  win: { frequency: 880, duration: 0.22, type: 'triangle' },
};

export function playSoundEffect(name, enabled = true) {
  if (!enabled || typeof window === 'undefined') {
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const config = SOUND_MAP[name];
  if (!config) {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = config.type;
  oscillator.frequency.value = config.frequency;
  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + config.duration);
}

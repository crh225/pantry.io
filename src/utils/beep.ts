const beep = (freq: number, duration: number, type: OscillatorType = 'sine') => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.3;
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playBeep = () => beep(1200, 0.15);

export const playErrorBeep = () => {
  beep(300, 0.15, 'square');
  setTimeout(() => beep(200, 0.25, 'square'), 180);
};

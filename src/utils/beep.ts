export const playBeep = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = 1200;
  gainNode.gain.value = 0.3;

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.15);
};

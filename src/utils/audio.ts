
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (audioCtx) return audioCtx;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioCtx;
  } catch (e) {
    console.warn("Web Audio API is not supported in this browser.");
    return null;
  }
};

export const playSound = (type: 'success' | 'error' | 'click') => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Prevent issues with audio context being in a suspended state
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);

  switch (type) {
    case 'success':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      break;
    case 'error':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      break;
    case 'click':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
      break;
  }
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
};

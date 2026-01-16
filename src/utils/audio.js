// ===== Audio & Haptics =====
let audioContext = null;

export function initAudio() {
    try {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return false;
            audioContext = new AudioContextClass();
        }
        return true;
    } catch (e) {
        return false;
    }
}

function vibrate(pattern) {
    if ('vibrate' in navigator) {
        try { navigator.vibrate(pattern); } catch (e) { }
    }
}

export function hapticTap() { vibrate(10); }
export function hapticMatch() { vibrate([30, 50, 30]); }
export function hapticGameOver() { vibrate(200); }
export function hapticVictory() { vibrate([50, 30, 50, 30, 100]); }

export function playWoodKnock(soundEnabled) {
    if (!soundEnabled || !audioContext) return;
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
}

export function playMatchSound(soundEnabled) {
    if (!soundEnabled || !audioContext) return;
    const notes = [
        { freq: 659, start: 0, duration: 0.1 },
        { freq: 784, start: 0.05, duration: 0.1 },
        { freq: 1047, start: 0.1, duration: 0.15 }
    ];

    notes.forEach(note => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.start);

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime + note.start);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.start + note.duration);

        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        osc.start(audioContext.currentTime + note.start);
        osc.stop(audioContext.currentTime + note.start + note.duration);
    });
}

export function playVictorySound(soundEnabled) {
    if (!soundEnabled || !audioContext) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.4);

        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        osc.start(audioContext.currentTime + index * 0.15);
        osc.stop(audioContext.currentTime + index * 0.15 + 0.4);
    });
}

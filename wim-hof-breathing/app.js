// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// ==================== AUDIO SYSTEM ====================

const AudioCues = {
    context: null,

    init() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        // iOS requires user interaction to unlock audio
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Create a tone with specific parameters
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    // Breathing audio cues
    inhale() {
        // Rising tone for inhale
        this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.setValueAtTime(400, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.25, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
    },

    exhale() {
        // Falling tone for exhale
        this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.3);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
    },

    startRound() {
        // Bright chime for round start
        this.playTone(1200, 0.15);
        setTimeout(() => this.playTone(1400, 0.15), 150);
    },

    startHold() {
        // Lower sustained tone for hold
        this.playTone(300, 0.5);
    },

    endHold() {
        // Completion sound
        this.playTone(1000, 0.1);
        setTimeout(() => this.playTone(1200, 0.1), 100);
        setTimeout(() => this.playTone(1500, 0.2), 200);
    },

    recoveryBreath() {
        // Recovery breath cue
        this.playTone(600, 0.4);
    },

    sessionComplete() {
        // Victory melody
        this.playTone(800, 0.15);
        setTimeout(() => this.playTone(1000, 0.15), 150);
        setTimeout(() => this.playTone(1200, 0.15), 300);
        setTimeout(() => this.playTone(1600, 0.3), 450);
    }
};

// ==================== STATE MANAGEMENT ====================

let appState = {
    currentView: 'home',
    sessionInProgress: false,
    currentRound: 0,
    currentBreath: 0,
    breathsPerRound: 30,
    numberOfRounds: 3,
    breathPace: 2,
    isInhaling: true,
    holdStartTime: null,
    holdDuration: 0,
    currentSession: null,
    breathInterval: null,
    holdInterval: null
};

// ==================== UTILITY FUNCTIONS ====================

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ==================== NAVIGATION ====================

function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });

    document.getElementById(viewName + 'View').classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-slate-400');
        btn.style.background = '';
    });

    const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-white');
        activeBtn.classList.remove('text-slate-400');
        activeBtn.style.background = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
    }

    appState.currentView = viewName;

    if (viewName === 'home') {
        updateHomeView();
    } else if (viewName === 'history') {
        updateHistoryView();
    }
}

// ==================== HOME VIEW ====================

function updateHomeView() {
    const settings = loadFromLocalStorage('settings', {
        breathsPerRound: 30,
        numberOfRounds: 3,
        breathPace: 2
    });

    const sessionHistory = loadFromLocalStorage('sessionHistory', []);

    // Update stats
    document.getElementById('totalSessions').textContent = sessionHistory.length;

    const allHolds = sessionHistory.flatMap(s => s.rounds.map(r => r.holdDuration));
    const longestHold = allHolds.length > 0 ? Math.max(...allHolds) : 0;
    const avgHold = allHolds.length > 0 ? Math.round(allHolds.reduce((a, b) => a + b, 0) / allHolds.length) : 0;
    const totalRounds = sessionHistory.reduce((sum, s) => sum + s.rounds.length, 0);

    document.getElementById('longestHold').textContent = longestHold + 's';
    document.getElementById('avgHold').textContent = avgHold + 's';
    document.getElementById('totalRounds').textContent = totalRounds;

    // Apply settings to selectors
    document.getElementById('breathsPerRound').value = settings.breathsPerRound;
    document.getElementById('numberOfRounds').value = settings.numberOfRounds;
    document.getElementById('breathPace').value = settings.breathPace;
}

// ==================== SESSION LOGIC ====================

function startSession() {
    const settings = {
        breathsPerRound: parseInt(document.getElementById('breathsPerRound').value),
        numberOfRounds: parseInt(document.getElementById('numberOfRounds').value),
        breathPace: parseFloat(document.getElementById('breathPace').value)
    };

    saveToLocalStorage('settings', settings);

    appState.breathsPerRound = settings.breathsPerRound;
    appState.numberOfRounds = settings.numberOfRounds;
    appState.breathPace = settings.breathPace;
    appState.sessionInProgress = true;
    appState.currentRound = 1;
    appState.currentBreath = 0;
    appState.currentSession = {
        date: Date.now(),
        settings: settings,
        rounds: []
    };

    showView('session');
    renderBreathingRound();
}

function renderBreathingRound() {
    const stage = document.getElementById('sessionStage');

    AudioCues.startRound();

    stage.innerHTML = `
        <div class="w-full">
            <div class="text-center mb-8">
                <div class="text-lg text-slate-400 mb-2">Round ${appState.currentRound} of ${appState.numberOfRounds}</div>
                <div class="text-6xl font-bold mb-4 text-cyan-400" id="breathCount">0</div>
                <div class="text-xl text-slate-300" id="breathPhase">Get Ready...</div>
            </div>

            <div class="flex justify-center mb-8">
                <div class="breathing-circle gradient-primary" id="breathingCircle">
                    <div class="text-4xl font-bold">💨</div>
                </div>
            </div>

            <button onclick="skipToHold()" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl">
                Skip to Retention
            </button>
        </div>
    `;

    setTimeout(() => startBreathing(), 2000);
}

function startBreathing() {
    appState.currentBreath = 0;
    appState.isInhaling = true;

    const breathCount = document.getElementById('breathCount');
    const breathPhase = document.getElementById('breathPhase');
    const breathingCircle = document.getElementById('breathingCircle');

    function breathCycle() {
        if (appState.currentBreath >= appState.breathsPerRound) {
            clearInterval(appState.breathInterval);
            startRetention();
            return;
        }

        if (appState.isInhaling) {
            appState.currentBreath++;
            breathCount.textContent = appState.currentBreath;
            breathPhase.textContent = 'Inhale Deeply';
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            AudioCues.inhale();
        } else {
            breathPhase.textContent = 'Exhale Gently';
            breathingCircle.classList.remove('inhale');
            breathingCircle.classList.add('exhale');
            AudioCues.exhale();
        }

        appState.isInhaling = !appState.isInhaling;
    }

    breathCycle();
    appState.breathInterval = setInterval(breathCycle, appState.breathPace * 1000);
}

function skipToHold() {
    clearInterval(appState.breathInterval);
    startRetention();
}

function startRetention() {
    const stage = document.getElementById('sessionStage');

    AudioCues.startHold();

    stage.innerHTML = `
        <div class="w-full text-center">
            <div class="text-lg text-slate-400 mb-2">Round ${appState.currentRound} of ${appState.numberOfRounds}</div>
            <h2 class="text-3xl font-bold mb-6 text-purple-400">Breath Retention</h2>

            <div class="flex justify-center mb-8">
                <div class="breathing-circle hold gradient-secondary">
                    <div class="text-center">
                        <div class="text-7xl font-bold text-white" id="holdTimer">0</div>
                        <div class="text-sm text-slate-300 mt-2">seconds</div>
                    </div>
                </div>
            </div>

            <p class="text-slate-400 mb-8">Hold your breath with empty lungs</p>

            <button onclick="endRetention()" class="w-full gradient-primary text-white font-bold py-4 rounded-xl pulse-glow">
                Take Recovery Breath
            </button>
        </div>
    `;

    appState.holdStartTime = Date.now();
    appState.holdDuration = 0;

    const holdTimer = document.getElementById('holdTimer');

    appState.holdInterval = setInterval(() => {
        appState.holdDuration = Math.floor((Date.now() - appState.holdStartTime) / 1000);
        holdTimer.textContent = appState.holdDuration;
    }, 100);
}

function endRetention() {
    clearInterval(appState.holdInterval);

    AudioCues.recoveryBreath();

    const holdDuration = Math.floor((Date.now() - appState.holdStartTime) / 1000);

    appState.currentSession.rounds.push({
        round: appState.currentRound,
        breaths: appState.breathsPerRound,
        holdDuration: holdDuration
    });

    startRecoveryBreath(holdDuration);
}

function startRecoveryBreath(holdDuration) {
    const stage = document.getElementById('sessionStage');

    stage.innerHTML = `
        <div class="w-full text-center">
            <div class="text-lg text-slate-400 mb-2">Round ${appState.currentRound} of ${appState.numberOfRounds}</div>
            <h2 class="text-3xl font-bold mb-6 text-emerald-400">Recovery Breath</h2>

            <div class="rounded-xl p-6 mb-6 card-shadow" style="background: var(--bg-card);">
                <div class="text-sm text-slate-400 mb-2">Retention Time</div>
                <div class="text-5xl font-bold text-purple-400">${holdDuration}s</div>
            </div>

            <div class="flex justify-center mb-8">
                <div class="breathing-circle gradient-accent">
                    <div class="text-4xl">🫁</div>
                </div>
            </div>

            <p class="text-slate-400 mb-4">Inhale fully and hold for 15 seconds</p>

            <div class="text-6xl font-bold text-amber-400 mb-8" id="recoveryTimer">15</div>

            <button onclick="skipRecovery()" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl">
                Skip
            </button>
        </div>
    `;

    let timeRemaining = 15;
    const recoveryTimer = document.getElementById('recoveryTimer');

    const recoveryInterval = setInterval(() => {
        timeRemaining--;
        recoveryTimer.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(recoveryInterval);
            AudioCues.endHold();
            completeRound();
        }
    }, 1000);
}

function skipRecovery() {
    completeRound();
}

function completeRound() {
    if (appState.currentRound < appState.numberOfRounds) {
        appState.currentRound++;
        renderBreathingRound();
    } else {
        completeSession();
    }
}

function completeSession() {
    const history = loadFromLocalStorage('sessionHistory', []);
    history.unshift(appState.currentSession);
    saveToLocalStorage('sessionHistory', history);

    AudioCues.sessionComplete();

    const stage = document.getElementById('sessionStage');
    const avgHold = Math.round(
        appState.currentSession.rounds.reduce((sum, r) => sum + r.holdDuration, 0) /
        appState.currentSession.rounds.length
    );

    stage.innerHTML = `
        <div class="w-full text-center">
            <div class="text-6xl mb-6">🎉</div>
            <h2 class="text-3xl font-bold mb-6 text-cyan-400">Session Complete!</h2>

            <div class="rounded-xl p-6 mb-6 card-shadow" style="background: var(--bg-card);">
                <div class="stats-grid">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-400">${appState.numberOfRounds}</div>
                        <div class="text-sm text-slate-400">Rounds</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-cyan-400">${avgHold}s</div>
                        <div class="text-sm text-slate-400">Avg Hold</div>
                    </div>
                </div>
            </div>

            <div class="space-y-2 mb-6">
                ${appState.currentSession.rounds.map((r, i) => `
                    <div class="rounded-lg p-4 card-shadow" style="background: var(--bg-card);">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-400">Round ${i + 1}</span>
                            <span class="font-bold text-purple-400">${r.holdDuration}s</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <button onclick="finishSession()" class="w-full gradient-primary text-white font-bold py-4 rounded-xl">
                Back to Home
            </button>
        </div>
    `;

    appState.sessionInProgress = false;
}

function finishSession() {
    showView('home');
}

// ==================== HISTORY VIEW ====================

function updateHistoryView() {
    const history = loadFromLocalStorage('sessionHistory', []);
    const historyList = document.getElementById('historyList');

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="rounded-xl p-6 text-center text-slate-400 card-shadow" style="background: var(--bg-card);">
                No sessions yet. Start your first breathing session!
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map((session, index) => {
        const avgHold = Math.round(
            session.rounds.reduce((sum, r) => sum + r.holdDuration, 0) / session.rounds.length
        );
        const longestHold = Math.max(...session.rounds.map(r => r.holdDuration));

        return `
            <div class="rounded-xl p-4 card-shadow" style="background: var(--bg-card);">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-cyan-400">${formatDate(session.date)}</h3>
                    <span class="text-sm text-slate-400">${session.rounds.length} rounds</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-400">Avg Hold: <span class="text-purple-400 font-semibold">${avgHold}s</span></span>
                    <span class="text-slate-400">Best: <span class="text-emerald-400 font-semibold">${longestHold}s</span></span>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    const settings = loadFromLocalStorage('settings', {
        breathsPerRound: 30,
        numberOfRounds: 3,
        breathPace: 2
    });

    appState.breathsPerRound = settings.breathsPerRound;
    appState.numberOfRounds = settings.numberOfRounds;
    appState.breathPace = settings.breathPace;

    showView('home');
});

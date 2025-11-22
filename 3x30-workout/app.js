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
    // Create audio context
    context: null,

    init() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // Beep sound for countdown
    beep(frequency = 800, duration = 0.1) {
        this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    // Different sounds for different events
    countdown() {
        this.beep(600, 0.1);
    },

    finalCountdown() {
        this.beep(800, 0.15);
    },

    complete() {
        this.beep(1000, 0.1);
        setTimeout(() => this.beep(1200, 0.1), 100);
        setTimeout(() => this.beep(1400, 0.15), 200);
    },

    startExercise() {
        this.beep(1200, 0.2);
    },

    rest() {
        this.beep(400, 0.3);
    }
};

// ==================== DATA STRUCTURE ====================

const WORKOUT_DATA = {
    warmup: {
        name: "Warm-up",
        duration: 180, // 3 minutes total
        exercises: [
            { name: "Jumping Jacks", duration: 30 },
            { name: "Arm Circles", duration: 30 },
            { name: "Hip Hinge Swings", duration: 30 }
        ],
        rounds: 2
    },

    phases: {
        mastery: {
            name: "Movement Mastery",
            weeks: "1-4",
            circuitA: [
                {
                    name: "Push-ups",
                    reps: "10-15",
                    alternatives: {
                        beginner: "Knee Push-ups",
                        intermediate: "Push-ups",
                        advanced: "Decline Push-ups"
                    }
                },
                {
                    name: "Inverted Rows",
                    reps: "8-10",
                    alternatives: {
                        beginner: "Bent-Knee Rows",
                        intermediate: "Inverted Rows",
                        advanced: "Archer Rows"
                    }
                },
                {
                    name: "Air Squats",
                    reps: "12-15",
                    alternatives: {
                        beginner: "Partial Squats",
                        intermediate: "Air Squats",
                        advanced: "Jump Squats"
                    }
                }
            ],
            circuitB: [
                {
                    name: "Pike Push-ups",
                    reps: "6-8",
                    alternatives: {
                        beginner: "Incline Pike Push-ups",
                        intermediate: "Pike Push-ups",
                        advanced: "Decline Pike Push-ups"
                    }
                },
                {
                    name: "Reverse Lunges",
                    reps: "8-10 per leg",
                    alternatives: {
                        beginner: "Split Squats",
                        intermediate: "Reverse Lunges",
                        advanced: "Walking Lunges"
                    }
                },
                {
                    name: "Dead-Bugs",
                    reps: "10-12 per side",
                    alternatives: {
                        beginner: "Dead-Bugs (arms only)",
                        intermediate: "Dead-Bugs",
                        advanced: "Dead-Bugs (with weight)"
                    }
                }
            ],
            finisher: {
                type: "rounds",
                rounds: 3,
                exercises: [
                    { name: "High Knees", duration: 30 },
                    { name: "Plank", duration: 30 },
                    { name: "Rest", duration: 30 }
                ]
            }
        },

        volume: {
            name: "Volume Build",
            weeks: "5-8",
            circuitA: [
                {
                    name: "Decline Push-ups",
                    reps: "12-15",
                    alternatives: {
                        beginner: "Regular Push-ups",
                        intermediate: "Decline Push-ups",
                        advanced: "Archer Push-ups"
                    }
                },
                {
                    name: "Towel Rows",
                    reps: "10-12",
                    alternatives: {
                        beginner: "Inverted Rows",
                        intermediate: "Towel Rows",
                        advanced: "One-Arm Rows"
                    }
                },
                {
                    name: "Jump Squats",
                    reps: "8-10",
                    alternatives: {
                        beginner: "Air Squats",
                        intermediate: "Jump Squats",
                        advanced: "Pistol Squat Progression"
                    }
                }
            ],
            circuitB: [
                {
                    name: "Bulgarian Split Squat",
                    reps: "8-10 per leg",
                    alternatives: {
                        beginner: "Reverse Lunges",
                        intermediate: "Bulgarian Split Squat",
                        advanced: "Bulgarian Split Squat (elevated)"
                    }
                },
                {
                    name: "Diamond Push-ups",
                    reps: "8-10",
                    alternatives: {
                        beginner: "Close-Grip Push-ups",
                        intermediate: "Diamond Push-ups",
                        advanced: "Decline Diamond Push-ups"
                    }
                },
                {
                    name: "Bicycle Crunches",
                    reps: "15-20 total",
                    alternatives: {
                        beginner: "Slow Bicycle Crunches",
                        intermediate: "Bicycle Crunches",
                        advanced: "Bicycle Crunches (extended hold)"
                    }
                }
            ],
            finisher: {
                type: "amrap",
                duration: 360, // 6 minutes
                exercises: [
                    { name: "Burpees", reps: 6 },
                    { name: "Alternating V-Ups", reps: 6 }
                ]
            }
        },

        density: {
            name: "Density & Power",
            weeks: "9-12",
            circuitA: {
                type: "emom",
                duration: 12,
                exercises: [
                    { name: "Clap Push-ups", reps: "6-8", minute: "odd", alternatives: {
                        beginner: "Explosive Push-ups",
                        intermediate: "Clap Push-ups",
                        advanced: "Double Clap Push-ups"
                    }},
                    { name: "Chair-Assist Chin-ups", reps: "4-6", minute: "even", alternatives: {
                        beginner: "Jumping Chin-ups",
                        intermediate: "Chair-Assist Chin-ups",
                        advanced: "Chin-ups"
                    }}
                ]
            },
            circuitB: {
                type: "emom",
                duration: 10,
                exercises: [
                    { name: "Jump Lunges", reps: "8-10 per leg", minute: "odd", alternatives: {
                        beginner: "Reverse Lunges",
                        intermediate: "Jump Lunges",
                        advanced: "Jump Lunges (with hold)"
                    }},
                    { name: "Single-leg Hip Thrusts", reps: "10-12 per leg", minute: "even", alternatives: {
                        beginner: "Two-leg Hip Thrusts",
                        intermediate: "Single-leg Hip Thrusts",
                        advanced: "Single-leg Hip Thrusts (elevated)"
                    }}
                ]
            },
            finisher: {
                type: "tabata",
                duration: 240, // 4 minutes
                workDuration: 20,
                restDuration: 10,
                exercises: [
                    { name: "Mountain Climbers" }
                ]
            }
        }
    },

    cooldown: {
        name: "Cool-down",
        duration: 180, // 3 minutes total
        exercises: [
            { name: "Deep Squat Hold", duration: 30 },
            { name: "Cat-Cow", reps: 8 },
            { name: "Down-Dog to Cobra", reps: 6 },
            { name: "Thread-the-Needle", reps: "4 per side" }
        ]
    }
};

// ==================== STATE MANAGEMENT ====================

let appState = {
    currentView: 'home',
    currentPhase: 'mastery',
    currentDifficulty: 'intermediate',
    restTime: 75,
    workoutInProgress: false,
    currentStage: null,
    currentCircuit: null,
    currentRound: 0,
    currentExerciseIndex: 0,
    timerInterval: null,
    timerSeconds: 0,
    workoutStartTime: null,
    currentWorkoutLog: null
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
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show selected view
    document.getElementById(viewName + 'View').classList.remove('hidden');

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-slate-400');
        btn.style.background = '';
    });

    const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'text-white');
        activeBtn.classList.remove('text-slate-400');
        activeBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }

    appState.currentView = viewName;

    // Load view-specific content
    if (viewName === 'home') {
        updateHomeView();
    } else if (viewName === 'history') {
        updateHistoryView();
    }
}

// ==================== HOME VIEW ====================

function updateHomeView() {
    const settings = loadFromLocalStorage('settings', {
        phase: 'mastery',
        difficulty: 'intermediate',
        restTime: 75
    });

    const workoutHistory = loadFromLocalStorage('workoutHistory', []);

    // Update stats
    document.getElementById('totalWorkouts').textContent = workoutHistory.length;
    document.getElementById('currentPhaseDisplay').textContent = WORKOUT_DATA.phases[settings.phase].name;

    // Calculate current week based on workout count
    const weekNumber = Math.min(Math.floor(workoutHistory.length / 3) + 1, 12);
    document.getElementById('currentWeek').textContent = weekNumber;

    // Update header phase
    document.getElementById('currentPhase').textContent = WORKOUT_DATA.phases[settings.phase].name + ` (Week ${weekNumber})`;
}

// ==================== WORKOUT LOGIC ====================

function startWorkout() {
    const settings = loadFromLocalStorage('settings', {
        phase: 'mastery',
        difficulty: 'intermediate',
        restTime: 75
    });

    appState.currentPhase = settings.phase;
    appState.currentDifficulty = settings.difficulty;
    appState.restTime = settings.restTime;
    appState.workoutInProgress = true;
    appState.currentStage = 'warmup';
    appState.currentRound = 0;
    appState.currentExerciseIndex = 0;
    appState.workoutStartTime = Date.now();
    appState.currentWorkoutLog = {
        date: Date.now(),
        phase: settings.phase,
        difficulty: settings.difficulty,
        stages: {},
        totalDuration: 0
    };

    showView('workout');
    renderWarmup();
}

function renderWarmup() {
    const stage = document.getElementById('workoutStage');
    const warmup = WORKOUT_DATA.warmup;

    stage.innerHTML = `
        <div class="rounded-xl p-6 mb-4 card-shadow" style="background: var(--bg-card);">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-emerald-400">${warmup.name}</h2>
                <span class="text-sm text-slate-400">2 Rounds</span>
            </div>
            <div class="mb-6">
                <div class="text-6xl font-bold text-center mb-2 text-emerald-400" id="timerDisplay">3:00</div>
                <div class="text-center text-slate-400" id="currentExercise">Ready to start</div>
            </div>
            <div class="space-y-2 mb-6">
                ${warmup.exercises.map((ex, i) => `
                    <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg" id="warmup-ex-${i}">
                        <span>${ex.name}</span>
                        <span class="text-slate-400">${ex.duration}s</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="startWarmupTimer()" class="w-full gradient-primary text-white font-bold py-4 rounded-xl mb-2 pulse-glow">
                Start Warm-up
            </button>
            <button onclick="startCircuitA()" class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl">
                Skip Warm-up
            </button>
        </div>
    `;
}

function startWarmupTimer() {
    const warmup = WORKOUT_DATA.warmup;
    let currentRound = 0;
    let currentExIndex = 0;
    let timeRemaining = warmup.exercises[0].duration;

    const timerDisplay = document.getElementById('timerDisplay');
    const currentExercise = document.getElementById('currentExercise');

    // Update button
    const startBtn = document.querySelector('#workoutStage button');
    startBtn.textContent = 'Skip Warm-up';
    startBtn.onclick = () => {
        clearInterval(appState.timerInterval);
        startCircuitA();
    };

    function updateWarmup() {
        if (currentRound >= 2) {
            clearInterval(appState.timerInterval);
            AudioCues.complete();
            startCircuitA();
            return;
        }

        if (timeRemaining <= 0) {
            currentExIndex++;
            if (currentExIndex >= warmup.exercises.length) {
                currentExIndex = 0;
                currentRound++;
                if (currentRound >= 2) {
                    clearInterval(appState.timerInterval);
                    AudioCues.complete();
                    startCircuitA();
                    return;
                }
            }
            timeRemaining = warmup.exercises[currentExIndex].duration;
            AudioCues.startExercise();
        }

        // Audio cues for countdown
        if (timeRemaining === 3) {
            AudioCues.finalCountdown();
        } else if (timeRemaining <= 2 && timeRemaining > 0) {
            AudioCues.countdown();
        }

        // Highlight current exercise
        document.querySelectorAll('[id^="warmup-ex-"]').forEach((el, i) => {
            if (i === currentExIndex) {
                el.classList.add('bg-emerald-600');
                el.classList.remove('bg-slate-700');
            } else {
                el.classList.remove('bg-emerald-600');
                el.classList.add('bg-slate-700');
            }
        });

        timerDisplay.textContent = formatTime(timeRemaining);
        currentExercise.textContent = `Round ${currentRound + 1}/2 - ${warmup.exercises[currentExIndex].name}`;

        timeRemaining--;
    }

    appState.timerInterval = setInterval(updateWarmup, 1000);
    updateWarmup();
}

function startCircuitA() {
    appState.currentStage = 'circuitA';
    appState.currentRound = 1;
    renderCircuit('A', 1);
}

function renderCircuit(circuit, round) {
    const stage = document.getElementById('workoutStage');
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const circuitKey = 'circuit' + circuit;

    // Handle EMOM format for Density phase
    if (appState.currentPhase === 'density') {
        renderEMOM(circuit);
        return;
    }

    const exercises = phaseData[circuitKey];

    stage.innerHTML = `
        <div class="rounded-xl p-6 mb-4 card-shadow" style="background: var(--bg-card);">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-blue-400">Circuit ${circuit}</h2>
                <span class="text-sm text-slate-400">Round ${round}/3</span>
            </div>

            <div class="mb-6 space-y-4">
                ${exercises.map((ex, i) => {
                    const exerciseName = ex.alternatives[appState.currentDifficulty];
                    return `
                        <div class="bg-slate-700 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="font-semibold">${exerciseName}</h3>
                                <button onclick="showExerciseAlternatives(${i}, '${circuit}')" class="text-emerald-400 text-sm hover:text-emerald-300">
                                    Options
                                </button>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-400 text-sm">Target: ${ex.reps}</span>
                                <div class="flex items-center gap-2">
                                    <button onclick="decrementReps(${i})" class="bg-slate-600 hover:bg-slate-500 w-8 h-8 rounded">-</button>
                                    <input type="number"
                                           id="reps-${circuit}-${i}"
                                           class="w-16 text-center bg-slate-600 text-white rounded p-2"
                                           value="${ex.reps.split('-')[0]}"
                                           min="0">
                                    <button onclick="incrementReps(${i})" class="bg-slate-600 hover:bg-slate-500 w-8 h-8 rounded">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${round < 3 ? `
                <button onclick="completeCircuitRound('${circuit}', ${round})"
                        class="w-full gradient-secondary text-white font-bold py-4 rounded-xl mb-2">
                    Complete Round & Rest
                </button>
            ` : `
                <button onclick="completeCircuit('${circuit}')"
                        class="w-full gradient-primary text-white font-bold py-4 rounded-xl mb-2">
                    Complete Circuit ${circuit}
                </button>
            `}

            <button onclick="skipCircuit('${circuit}')"
                    class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl">
                Skip Circuit
            </button>
        </div>
    `;
}

function incrementReps(index) {
    const circuit = appState.currentStage === 'circuitA' ? 'A' : 'B';
    const input = document.getElementById(`reps-${circuit}-${index}`);
    input.value = parseInt(input.value) + 1;
}

function decrementReps(index) {
    const circuit = appState.currentStage === 'circuitA' ? 'A' : 'B';
    const input = document.getElementById(`reps-${circuit}-${index}`);
    const newValue = parseInt(input.value) - 1;
    if (newValue >= 0) {
        input.value = newValue;
    }
}

function showExerciseAlternatives(index, circuit) {
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const circuitKey = 'circuit' + circuit;
    const exercise = phaseData[circuitKey][index];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 class="text-xl font-bold mb-4">Exercise Options</h3>
            <div class="space-y-2">
                ${Object.entries(exercise.alternatives).map(([level, name]) => `
                    <button onclick="selectAlternative('${level}', ${index}, '${circuit}'); this.closest('.fixed').remove();"
                            class="w-full text-left p-3 rounded ${level === appState.currentDifficulty ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500">
                        <div class="font-semibold capitalize">${level}</div>
                        <div class="text-sm text-gray-300">${name}</div>
                    </button>
                `).join('')}
            </div>
            <button onclick="this.closest('.fixed').remove()"
                    class="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function selectAlternative(level, index, circuit) {
    // For now, just close the modal - in a full implementation,
    // you'd update the exercise display
    console.log(`Selected ${level} for exercise ${index} in circuit ${circuit}`);
}

function completeCircuitRound(circuit, round) {
    // Save round data
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const circuitKey = 'circuit' + circuit;
    const exercises = phaseData[circuitKey];

    const roundData = exercises.map((ex, i) => {
        const input = document.getElementById(`reps-${circuit}-${i}`);
        return {
            exercise: ex.alternatives[appState.currentDifficulty],
            reps: parseInt(input.value)
        };
    });

    if (!appState.currentWorkoutLog.stages[circuitKey]) {
        appState.currentWorkoutLog.stages[circuitKey] = [];
    }
    appState.currentWorkoutLog.stages[circuitKey].push(roundData);

    // Start rest timer
    startRestTimer(circuit, round + 1);
}

function startRestTimer(circuit, nextRound) {
    const stage = document.getElementById('workoutStage');
    let timeRemaining = appState.restTime;

    AudioCues.rest();

    stage.innerHTML = `
        <div class="rounded-xl p-6 mb-4 card-shadow" style="background: var(--bg-card);">
            <h2 class="text-2xl font-bold mb-6 text-center text-amber-400">Rest Period</h2>
            <div class="text-8xl font-bold text-center mb-6 text-amber-400" id="restTimer">${timeRemaining}</div>
            <div class="text-center text-slate-400 mb-6">Prepare for Round ${nextRound}</div>
            <button onclick="skipRest('${circuit}', ${nextRound})"
                    class="w-full gradient-secondary text-white font-bold py-3 rounded-xl">
                Skip Rest
            </button>
        </div>
    `;

    const timerEl = document.getElementById('restTimer');

    appState.timerInterval = setInterval(() => {
        timeRemaining--;
        timerEl.textContent = timeRemaining;

        // Audio cues for countdown
        if (timeRemaining === 10) {
            AudioCues.finalCountdown();
        } else if (timeRemaining <= 3 && timeRemaining > 0) {
            AudioCues.countdown();
        } else if (timeRemaining === 0) {
            AudioCues.startExercise();
        }

        if (timeRemaining <= 0) {
            clearInterval(appState.timerInterval);
            renderCircuit(circuit, nextRound);
        }
    }, 1000);
}

function skipRest(circuit, nextRound) {
    clearInterval(appState.timerInterval);
    renderCircuit(circuit, nextRound);
}

function completeCircuit(circuit) {
    // Save final round data
    completeCircuitRound(circuit, 3);
    clearInterval(appState.timerInterval);

    // Move to next stage
    if (circuit === 'A') {
        appState.currentStage = 'circuitB';
        setTimeout(() => renderCircuit('B', 1), 100);
    } else {
        appState.currentStage = 'finisher';
        renderFinisher();
    }
}

function skipCircuit(circuit) {
    if (confirm(`Skip Circuit ${circuit}?`)) {
        clearInterval(appState.timerInterval);
        if (circuit === 'A') {
            appState.currentStage = 'circuitB';
            renderCircuit('B', 1);
        } else {
            appState.currentStage = 'finisher';
            renderFinisher();
        }
    }
}

function renderEMOM(circuit) {
    const stage = document.getElementById('workoutStage');
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const circuitKey = 'circuit' + circuit;
    const circuitData = phaseData[circuitKey];

    stage.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 mb-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Circuit ${circuit} - EMOM</h2>
                <span class="text-sm text-gray-400">${circuitData.duration} minutes</span>
            </div>

            <div class="text-6xl font-bold text-center mb-4" id="emomTimer">1:00</div>
            <div class="text-center text-gray-400 mb-6" id="emomExercise">Get Ready</div>

            <div class="mb-6 space-y-3">
                ${circuitData.exercises.map(ex => `
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-semibold">${ex.alternatives[appState.currentDifficulty]}</div>
                                <div class="text-sm text-gray-400">${ex.minute} minutes: ${ex.reps}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <button onclick="startEMOMTimer('${circuit}')"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mb-2">
                Start EMOM
            </button>

            <button onclick="skipCircuit('${circuit}')"
                    class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                Skip Circuit
            </button>
        </div>
    `;
}

function startEMOMTimer(circuit) {
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const circuitKey = 'circuit' + circuit;
    const circuitData = phaseData[circuitKey];

    let currentMinute = 1;
    let secondsInMinute = 60;

    const timerEl = document.getElementById('emomTimer');
    const exerciseEl = document.getElementById('emomExercise');
    const startBtn = document.querySelector('#workoutStage button');

    startBtn.textContent = 'Stop EMOM';
    startBtn.onclick = () => {
        clearInterval(appState.timerInterval);
        completeCircuit(circuit);
    };

    function updateEMOM() {
        if (currentMinute > circuitData.duration) {
            clearInterval(appState.timerInterval);
            completeCircuit(circuit);
            return;
        }

        const currentEx = circuitData.exercises.find(ex =>
            (ex.minute === 'odd' && currentMinute % 2 === 1) ||
            (ex.minute === 'even' && currentMinute % 2 === 0)
        );

        exerciseEl.textContent = `Minute ${currentMinute}: ${currentEx.alternatives[appState.currentDifficulty]} (${currentEx.reps})`;
        timerEl.textContent = formatTime(secondsInMinute);

        secondsInMinute--;

        if (secondsInMinute < 0) {
            currentMinute++;
            secondsInMinute = 59;
        }
    }

    appState.timerInterval = setInterval(updateEMOM, 1000);
    updateEMOM();
}

function renderFinisher() {
    const stage = document.getElementById('workoutStage');
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const finisher = phaseData.finisher;

    if (finisher.type === 'rounds') {
        stage.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 class="text-2xl font-bold mb-4">Finisher</h2>
                <div class="text-center mb-6">
                    <div class="text-4xl font-bold mb-2" id="finisherTimer">0:30</div>
                    <div class="text-gray-400" id="finisherExercise">Get Ready</div>
                </div>
                <div class="mb-6 space-y-2">
                    ${finisher.exercises.map(ex => `
                        <div class="bg-gray-700 rounded-lg p-3">
                            <span class="font-semibold">${ex.name}</span>
                            <span class="text-gray-400 float-right">${ex.duration}s</span>
                        </div>
                    `).join('')}
                </div>
                <button onclick="startFinisherTimer()"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mb-2">
                    Start Finisher
                </button>
                <button onclick="skipFinisher()"
                        class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                    Skip to Cool-down
                </button>
            </div>
        `;
    } else if (finisher.type === 'amrap') {
        stage.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 class="text-2xl font-bold mb-4">Finisher - AMRAP</h2>
                <div class="text-center mb-6">
                    <div class="text-6xl font-bold mb-2" id="finisherTimer">6:00</div>
                    <div class="text-gray-400">As Many Rounds As Possible</div>
                </div>
                <div class="mb-6 space-y-2">
                    ${finisher.exercises.map(ex => `
                        <div class="bg-gray-700 rounded-lg p-3">
                            <span class="font-semibold">${ex.name}</span>
                            <span class="text-gray-400 float-right">${ex.reps} reps</span>
                        </div>
                    `).join('')}
                </div>
                <div class="mb-6">
                    <label class="text-sm text-gray-400">Rounds completed:</label>
                    <input type="number" id="amrapRounds" class="w-full bg-gray-700 text-white rounded-lg p-3 mt-2" value="0" min="0">
                </div>
                <button onclick="startAMRAPTimer()"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mb-2">
                    Start AMRAP
                </button>
                <button onclick="skipFinisher()"
                        class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                    Skip to Cool-down
                </button>
            </div>
        `;
    } else if (finisher.type === 'tabata') {
        stage.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 class="text-2xl font-bold mb-4">Finisher - Tabata</h2>
                <div class="text-center mb-6">
                    <div class="text-6xl font-bold mb-2" id="finisherTimer">0:20</div>
                    <div class="text-gray-400" id="tabataStatus">WORK</div>
                    <div class="text-sm text-gray-500 mt-2" id="tabataRound">Round 1/8</div>
                </div>
                <div class="mb-6">
                    <div class="bg-gray-700 rounded-lg p-4 text-center">
                        <div class="font-semibold text-lg">${finisher.exercises[0].name}</div>
                        <div class="text-sm text-gray-400 mt-1">20s work / 10s rest</div>
                    </div>
                </div>
                <button onclick="startTabataTimer()"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg mb-2">
                    Start Tabata
                </button>
                <button onclick="skipFinisher()"
                        class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">
                    Skip to Cool-down
                </button>
            </div>
        `;
    }
}

function startFinisherTimer() {
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const finisher = phaseData.finisher;

    let currentRound = 0;
    let currentExIndex = 0;
    let timeRemaining = finisher.exercises[0].duration;

    const timerEl = document.getElementById('finisherTimer');
    const exerciseEl = document.getElementById('finisherExercise');

    function updateFinisher() {
        if (currentRound >= finisher.rounds) {
            clearInterval(appState.timerInterval);
            renderCooldown();
            return;
        }

        if (timeRemaining <= 0) {
            currentExIndex++;
            if (currentExIndex >= finisher.exercises.length) {
                currentExIndex = 0;
                currentRound++;
                if (currentRound >= finisher.rounds) {
                    clearInterval(appState.timerInterval);
                    renderCooldown();
                    return;
                }
            }
            timeRemaining = finisher.exercises[currentExIndex].duration;
        }

        timerEl.textContent = formatTime(timeRemaining);
        exerciseEl.textContent = `Round ${currentRound + 1}/${finisher.rounds} - ${finisher.exercises[currentExIndex].name}`;

        timeRemaining--;
    }

    appState.timerInterval = setInterval(updateFinisher, 1000);
    updateFinisher();
}

function startAMRAPTimer() {
    const phaseData = WORKOUT_DATA.phases[appState.currentPhase];
    const finisher = phaseData.finisher;

    let timeRemaining = finisher.duration;
    const timerEl = document.getElementById('finisherTimer');

    appState.timerInterval = setInterval(() => {
        timeRemaining--;
        timerEl.textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(appState.timerInterval);
            const rounds = document.getElementById('amrapRounds').value;
            appState.currentWorkoutLog.stages.finisher = { rounds: parseInt(rounds) };
            renderCooldown();
        }
    }, 1000);
}

function startTabataTimer() {
    let currentRound = 0;
    let isWork = true;
    let timeRemaining = 20;

    const timerEl = document.getElementById('finisherTimer');
    const statusEl = document.getElementById('tabataStatus');
    const roundEl = document.getElementById('tabataRound');

    function updateTabata() {
        if (currentRound >= 8) {
            clearInterval(appState.timerInterval);
            renderCooldown();
            return;
        }

        if (timeRemaining <= 0) {
            isWork = !isWork;
            timeRemaining = isWork ? 20 : 10;
            if (!isWork) {
                currentRound++;
            }
        }

        timerEl.textContent = formatTime(timeRemaining);
        statusEl.textContent = isWork ? 'WORK' : 'REST';
        statusEl.className = isWork ? 'text-green-400' : 'text-yellow-400';
        roundEl.textContent = `Round ${currentRound + 1}/8`;

        timeRemaining--;
    }

    appState.timerInterval = setInterval(updateTabata, 1000);
    updateTabata();
}

function skipFinisher() {
    clearInterval(appState.timerInterval);
    renderCooldown();
}

function renderCooldown() {
    const stage = document.getElementById('workoutStage');
    const cooldown = WORKOUT_DATA.cooldown;

    stage.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 mb-4">
            <h2 class="text-2xl font-bold mb-4">Cool-down</h2>
            <div class="mb-6 space-y-3">
                ${cooldown.exercises.map(ex => `
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="font-semibold">${ex.name}</div>
                        <div class="text-sm text-gray-400">${ex.duration ? ex.duration + 's' : ex.reps}</div>
                    </div>
                `).join('')}
            </div>
            <button onclick="completeWorkout()"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg">
                Complete Workout
            </button>
        </div>
    `;
}

function completeWorkout() {
    // Calculate total duration
    appState.currentWorkoutLog.totalDuration = Math.floor((Date.now() - appState.workoutStartTime) / 1000);

    // Save to history
    const history = loadFromLocalStorage('workoutHistory', []);
    history.unshift(appState.currentWorkoutLog);
    saveToLocalStorage('workoutHistory', history);

    // Show completion screen
    const stage = document.getElementById('workoutStage');
    stage.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-3xl font-bold mb-4">Workout Complete!</h2>
            <div class="text-gray-400 mb-6">
                <p>Duration: ${formatTime(appState.currentWorkoutLog.totalDuration)}</p>
                <p class="mt-2">Great job!</p>
            </div>
            <button onclick="finishWorkout()"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg">
                Back to Home
            </button>
        </div>
    `;

    appState.workoutInProgress = false;
}

function finishWorkout() {
    showView('home');
}

// ==================== HISTORY VIEW ====================

function updateHistoryView() {
    const history = loadFromLocalStorage('workoutHistory', []);
    const historyList = document.getElementById('historyList');

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="rounded-xl p-6 text-center text-slate-400 card-shadow" style="background: var(--bg-card);">
                No workouts yet. Start your first workout!
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map((workout, index) => `
        <div class="rounded-xl p-4 card-shadow" style="background: var(--bg-card);">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-emerald-400">${WORKOUT_DATA.phases[workout.phase].name}</h3>
                <span class="text-sm text-slate-400">${formatDate(workout.date)}</span>
            </div>
            <div class="flex items-center justify-between text-sm text-slate-400">
                <span>Duration: ${formatTime(workout.totalDuration)}</span>
                <span class="capitalize text-blue-400">${workout.difficulty}</span>
            </div>
            <button onclick="viewWorkoutDetails(${index})"
                    class="mt-3 w-full gradient-secondary text-white font-bold py-2 rounded-xl text-sm">
                View Details
            </button>
        </div>
    `).join('');
}

function viewWorkoutDetails(index) {
    const history = loadFromLocalStorage('workoutHistory', []);
    const workout = history[index];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    let detailsHTML = '<div class="space-y-4">';

    // Circuit A
    if (workout.stages.circuitA) {
        detailsHTML += '<div><h4 class="font-semibold mb-2">Circuit A</h4>';
        workout.stages.circuitA.forEach((round, i) => {
            detailsHTML += `<div class="text-sm mb-2"><span class="text-gray-400">Round ${i + 1}:</span><ul class="ml-4">`;
            round.forEach(ex => {
                detailsHTML += `<li>${ex.exercise}: ${ex.reps} reps</li>`;
            });
            detailsHTML += '</ul></div>';
        });
        detailsHTML += '</div>';
    }

    // Circuit B
    if (workout.stages.circuitB) {
        detailsHTML += '<div><h4 class="font-semibold mb-2">Circuit B</h4>';
        workout.stages.circuitB.forEach((round, i) => {
            detailsHTML += `<div class="text-sm mb-2"><span class="text-gray-400">Round ${i + 1}:</span><ul class="ml-4">`;
            round.forEach(ex => {
                detailsHTML += `<li>${ex.exercise}: ${ex.reps} reps</li>`;
            });
            detailsHTML += '</ul></div>';
        });
        detailsHTML += '</div>';
    }

    detailsHTML += '</div>';

    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 max-w-lg w-full my-8">
            <h3 class="text-xl font-bold mb-2">Workout Details</h3>
            <p class="text-gray-400 text-sm mb-4">${formatDate(workout.date)}</p>

            <div class="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div class="bg-gray-700 p-3 rounded">
                    <div class="text-gray-400">Phase</div>
                    <div class="font-semibold">${WORKOUT_DATA.phases[workout.phase].name}</div>
                </div>
                <div class="bg-gray-700 p-3 rounded">
                    <div class="text-gray-400">Duration</div>
                    <div class="font-semibold">${formatTime(workout.totalDuration)}</div>
                </div>
            </div>

            <div class="max-h-96 overflow-y-auto mb-4">
                ${detailsHTML}
            </div>

            <button onclick="this.closest('.fixed').remove()"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

// ==================== SETTINGS ====================

function changePhase() {
    const phase = document.getElementById('phaseSelector').value;
    const settings = loadFromLocalStorage('settings', {});
    settings.phase = phase;
    saveToLocalStorage('settings', settings);
    appState.currentPhase = phase;
    updateHomeView();
}

function changeDifficulty() {
    const difficulty = document.getElementById('difficultySelector').value;
    const settings = loadFromLocalStorage('settings', {});
    settings.difficulty = difficulty;
    saveToLocalStorage('settings', settings);
    appState.currentDifficulty = difficulty;
}

function changeRestTime() {
    const restTime = parseInt(document.getElementById('restTimeSelector').value);
    const settings = loadFromLocalStorage('settings', {});
    settings.restTime = restTime;
    saveToLocalStorage('settings', settings);
    appState.restTime = restTime;
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all workout data? This cannot be undone.')) {
        if (confirm('Really? All your workout history will be deleted!')) {
            localStorage.clear();
            alert('All data cleared!');
            location.reload();
        }
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Load settings
    const settings = loadFromLocalStorage('settings', {
        phase: 'mastery',
        difficulty: 'intermediate',
        restTime: 75
    });

    // Apply settings to UI
    document.getElementById('phaseSelector').value = settings.phase;
    document.getElementById('difficultySelector').value = settings.difficulty;
    document.getElementById('restTimeSelector').value = settings.restTime;

    // Update state
    appState.currentPhase = settings.phase;
    appState.currentDifficulty = settings.difficulty;
    appState.restTime = settings.restTime;

    // Show home view
    showView('home');
});

# Wim Hof Breathing Method

A guided Progressive Web App (PWA) for practicing the Wim Hof breathing method with audio cues and visual guidance.

**Live Demo:** [https://wim-hof-breathing.pages.dev](https://wim-hof-breathing.pages.dev)

## Features

- **Guided Breathing Sessions**: Follow along with visual and audio cues for each breath
- **Audio Feedback**:
  - Rising tone for inhale
  - Falling tone for exhale
  - Specific sounds for starting rounds, retention, and recovery
- **Animated Visual Guide**: Breathing circle that expands/contracts with your breath
- **Customizable Sessions**:
  - Adjustable breaths per round (30, 35, or 40)
  - Choose number of rounds (3, 4, or 5)
  - Set breath pace (Fast, Normal, or Slow)
- **Progress Tracking**:
  - Session history with retention times
  - Statistics (longest hold, average hold, total rounds)
  - localStorage persistence
- **Full Wim Hof Method**:
  - Deep breathing rounds
  - Breath retention phase
  - Recovery breath (15 seconds)
- **PWA Features**:
  - Offline support
  - iPhone optimized
  - Add to home screen

## How It Works

### 1. Get Comfortable
Sit or lie down in a position that allows your belly to expand freely.

### 2. Deep Breathing (30-40 breaths)
Close your eyes and inhale deeply through your nose or mouth, expanding your belly and filling your lungs. Then exhale casually through your mouth without force. Repeat rapidly, focusing on full inhalations and relaxed exhalations.

### 3. Breath Retention
After the final exhale, hold your breath (with empty lungs) as long as you can. When you feel the urge to breathe, the app will guide you to take a recovery breath.

### 4. Recovery Breath
Inhale fully and hold the breath for about 15 seconds before exhaling.

### 5. Repeat
This completes one round. Most sessions involve 3-4 rounds.

## Safety Notice

**Important:** Always practice in a safe environment. Never practice while driving, swimming, or in any situation where loss of consciousness could be dangerous.

## Tech Stack

- Vanilla JavaScript
- Tailwind CSS
- Web Audio API (for breathing cues)
- Service Worker (PWA)
- localStorage API

## Installation

### Local Development

```bash
cd wim-hof-breathing
python3 -m http.server 8000
```

Open http://localhost:8000

### iPhone Installation

1. Open the app URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. The app will work offline like a native app

## Audio Cues

- **Inhale**: Rising tone (400Hz → 800Hz)
- **Exhale**: Falling tone (800Hz → 400Hz)
- **Round Start**: Bright chime
- **Retention Start**: Lower sustained tone
- **Recovery Breath**: Mid-range tone
- **Session Complete**: Victory melody

## License

MIT

# 3x30 Bodyweight Workout Tracker

A Progressive Web App (PWA) for tracking Jake Wood's 3x30 Bodyweight Program workouts.

## Features

- **Full Workout Program**: All 3 phases (Movement Mastery, Volume Build, Density & Power)
- **Smart Timers**: Automatic timers for warmup, rest periods, EMOM, AMRAP, and Tabata
- **Exercise Progression**: Beginner, Intermediate, and Advanced variations
- **Workout History**: Track all your workouts with detailed logs
- **Offline Support**: Works without internet connection (PWA)
- **iPhone Optimized**: Full PWA support for iOS with home screen install

## Installation

### Option 1: Local Server (Recommended)

1. Navigate to the project directory:
```bash
cd /home/patrick/Projects/pb_fitness
```

2. Start a local web server:
```bash
# Using Python 3
python3 -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js (if you have http-server installed)
npx http-server -p 8000
```

3. Open your browser and go to: `http://localhost:8000`

### Option 2: Deploy to a Web Server

Upload all files to your web hosting service. The app needs to be served over HTTPS for PWA features to work properly.

## Installing on iPhone

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right corner
5. The app will now appear on your home screen like a native app!

## How to Use

### Starting a Workout

1. From the **Home** screen, tap "Start Workout"
2. Follow the warmup routine (3 minutes, 2 rounds)
3. Complete Circuit A (3 rounds with rest periods)
4. Complete Circuit B (3 rounds with rest periods)
5. Finish with the phase-specific finisher
6. Cool down with stretches

### Tracking Exercises

- Enter your actual reps completed for each exercise
- Use the +/- buttons for quick adjustments
- Tap "Options" on any exercise to see beginner/intermediate/advanced variations

### Changing Settings

Navigate to the **Settings** tab to:
- Change your current phase (Weeks 1-4, 5-8, or 9-12)
- Adjust exercise difficulty level
- Modify rest time between circuits (60/75/90 seconds)

### Viewing History

- Tap the **History** tab to see all past workouts
- Tap "View Details" on any workout to see exactly what you did

## Program Structure

### Phase 1: Movement Mastery (Weeks 1-4)
Focus on form and technique with moderate volume.

### Phase 2: Volume Build (Weeks 5-8)
Increase difficulty and volume with more challenging variations.

### Phase 3: Density & Power (Weeks 9-12)
EMOM and Tabata protocols for maximum intensity.

## Technical Details

- **Framework**: Vanilla JavaScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage API
- **PWA Features**: Service Worker, Web Manifest
- **No Build Step Required**: Just HTML, CSS, and JS

## File Structure

```
pb_fitness/
├── index.html          # Main HTML file
├── app.js             # All workout logic and state management
├── sw.js              # Service worker for PWA
├── manifest.json      # PWA manifest
├── icons/             # App icons
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon.svg
└── README.md          # This file
```

## Data Storage

All workout data is stored locally in your browser using localStorage:
- Workout history
- User settings (phase, difficulty, rest time)
- No data is sent to any server

## Clearing Data

To reset the app and clear all workout history:
1. Go to **Settings**
2. Scroll to "Danger Zone"
3. Tap "Clear All Workout Data"

## Browser Compatibility

- Chrome/Edge: Full support
- Safari (iOS): Full support including PWA install
- Firefox: Full support
- Requires JavaScript enabled

## License

Free to use for personal fitness tracking.

## Credits

Workout program designed by Jake Wood (3x30 Bodyweight Program)

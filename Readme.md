# Circle Dodge Game – README

A simple tilt-controlled mobile browser game where you move a circle to avoid falling balls. Built using plain HTML, CSS, and JavaScript.

---

## 📌 Features

* Tilt-based movement using **DeviceOrientation** API
* Randomly generated falling obstacles
* Real-time collision detection
* Score system based on survival time
* Auto game restart on game-over
* Lightweight and mobile-friendly

---

## 📁 Project Structure

```
/project
│── index.html
│── styles.css
│── script.js
```

---

## 📄 index.html

* Loads the game container
* Links to `styles.css` and `script.js`
* Contains the main `#game-container` and player element (`#player`)
* Includes the score UI and a start button

---

## 🎨 styles.css

### Main Responsibilities

* Rendering the game layout
* Styling the player (blue circle)
* Styling falling balls (red)
* Score/overlay styling
* Game over animation effects

### Key Classes & Their Purpose

| Selector          | Purpose                          |
| ----------------- | -------------------------------- |
| `#game-container` | Fullscreen game area             |
| `#player`         | User-controlled circle           |
| `.ball`           | Auto-generated falling obstacles |
| `#score`          | Displays current score           |
| `#start-btn`      | Button to start game             |

---

## 🧠 script.js

This file contains **all game logic**, including:

### 1️⃣ Initialization Variables

* `player`, `gameContainer` → element references
* `playerX`, `playerY` → player position
* `tiltX`, `tiltY` → tilt force values
* `balls` → array storing active enemy balls
* `score` and `scoreInterval` → scoring system

---

## 🎮 Core Functions

### **1. startGame()**

* Resets score and positions
* Begins ball spawning interval
* Attaches device orientation listener
* Starts the game loop

---

### **2. endGame()**

* Stops game loop
* Stops ball spawning
* Shows game-over overlay
* Removes tilt listeners

---

### **3. spawnBall()**

* Creates a new `.ball` div
* Randomly positions it at top
* Assigns a random fall speed
* Adds it to the DOM + tracking array

---

### **4. updatePlayerPosition()**

* Moves the player based on tilt sensor values
* Clamps X/Y so player stays inside the screen
* Updates DOM position

---

### **5. updateBalls()**

* Moves each ball downward
* Removes balls when they exit screen
* Calls collision detection for each ball

---

### **6. isColliding(playerRect, ballRect)**

* Checks circle-to-ball collision
* Uses simple bounding overlap detection
* Returns true if a hit occurs

---

### **7. gameLoop()**

* Main loop using `requestAnimationFrame`
* Updates player
* Updates balls
* Updates score
* Ends game on collision

---

### **8. handleOrientation(event)**

Receives real-time tilt values:

* `event.beta` (front/back tilt)
* `event.gamma` (left/right tilt)

Converts them to movement by scaling values.

---

### **9. updateScore()**

* Score increases every 100ms
* Displays score on UI

---

## 🔧 Browser Permissions

Mobile browsers require:

* Motion sensor permission (`DeviceOrientationEvent.requestPermission`) on iOS

---

## 🚀 How to Play

1. Open the game on a mobile device
2. Tap “Start Game”
3. Tilt your phone left/right/up/down
4. Avoid the falling red balls
5. Survive as long as possible to score higher

---

## 📜 License

MIT – Free to use, modify, and distribute

---

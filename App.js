import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Accelerometer } from "expo-sensors";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const PLAYER_SIZE = 50;
const ENEMY_SIZE = 35;
const GRAVITY_SPEED = 5;
const SPAWN_INTERVAL = 800;

export default function App() {
  const [playerX, setPlayerX] = useState(SCREEN_W / 2 - PLAYER_SIZE / 2);
  const [playerY] = useState(SCREEN_H - 140); // fixed vertical position
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const speedRef = useRef(6);

  // Accelerometer movement
  useEffect(() => {
    Accelerometer.setUpdateInterval(40);

    const subscription = Accelerometer.addListener(({ x }) => {
      if (gameOver) return;

      const move = -x * 22; // invert so tilt right = move right
      setPlayerX((prev) => {
        let next = prev + move;
        if (next < 0) next = 0;
        if (next > SCREEN_W - PLAYER_SIZE) next = SCREEN_W - PLAYER_SIZE;
        return next;
      });
    });

    return () => subscription.remove();
  }, [gameOver]);

  // Enemy spawning
  useEffect(() => {
    if (gameOver) return;

    const spawn = setInterval(() => {
      const x = Math.random() * (SCREEN_W - ENEMY_SIZE);
      const id = Date.now() + Math.random();
      setEnemies((prev) => [
        ...prev,
        { id, x, y: -ENEMY_SIZE, speed: speedRef.current },
      ]);
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawn);
  }, [gameOver]);

  // Enemy movement + collision detection + scoring
  useEffect(() => {
    if (gameOver) return;

    const loop = setInterval(() => {
      // Move enemies down
      setEnemies((prev) =>
        prev
          .map((e) => ({ ...e, y: e.y + e.speed }))
          .filter((e) => e.y < SCREEN_H + ENEMY_SIZE)
      );

      // Score increases as time passes
      setScore((s) => s + 1);

      // Increase difficulty gradually
      if (score % 300 === 0) {
        speedRef.current += 0.4;
      }

      // Collision detection
      const collided = enemies.some((e) => {
        const dx = e.x + ENEMY_SIZE / 2 - (playerX + PLAYER_SIZE / 2);
        const dy = e.y + ENEMY_SIZE / 2 - (playerY + PLAYER_SIZE / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (PLAYER_SIZE + ENEMY_SIZE) / 2;
      });

      if (collided) setGameOver(true);
    }, 16);

    return () => clearInterval(loop);
  }, [enemies, playerX, playerY, gameOver, score]);

  const restartGame = () => {
    setGameOver(false);
    setEnemies([]);
    setScore(0);
    speedRef.current = 6;
    setPlayerX(SCREEN_W / 2 - PLAYER_SIZE / 2);
  };

  return (
    <TouchableWithoutFeedback onPress={() => gameOver && restartGame()}>
      <View style={styles.container}>
        {/* Score */}
        <Text style={styles.score}>Score: {Math.floor(score / 10)}</Text>

        {/* Player circle */}
        <View
          style={[
            styles.player,
            { left: playerX, top: playerY },
          ]}
        />

        {/* Enemies */}
        {enemies.map((e) => (
          <View
            key={e.id}
            style={[
              styles.enemy,
              { left: e.x, top: e.y },
            ]}
          />
        ))}

        {/* Game Over */}
        {gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOver}>GAME OVER</Text>
            <Text style={styles.tapToRestart}>Tap to Restart</Text>
            <Text style={styles.finalScore}>Final Score: {Math.floor(score / 10)}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
    alignItems: "center",
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: "#00eaff",
  },
  enemy: {
    position: "absolute",
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
    borderRadius: ENEMY_SIZE / 2,
    backgroundColor: "#ff3b3b",
  },
  score: {
    color: "#fff",
    fontSize: 20,
    marginTop: 50,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameOver: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 10,
  },
  tapToRestart: {
    color: "#ddd",
    fontSize: 18,
    marginBottom: 10,
  },
  finalScore: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
});

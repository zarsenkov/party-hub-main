import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем уникальный стиль Шпиона
import './SpyGame.css';

// --- ДАННЫЕ ИГРЫ ---
const LOCATIONS = ["Орбитальная станция", "Подводная лодка", "Ночной клуб", "Овощебаза", "Театр"];

export default function SpyGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [gameState, setGameState] = useState('setup'); // setup, pass, reveal, play
  const [players, setPlayers] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [spyIndex, setSpyIndex] = useState(0);
  const [location, setLocation] = useState('');

  // --- ЛОГИКА ---
  
  // Инициализация новой игры
  const startNewGame = () => {
    const randomSpy = Math.floor(Math.random() * players) + 1;
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    setSpyIndex(randomSpy);
    setLocation(randomLoc);
    setCurrentPlayer(1);
    setGameState('pass');
  };

  // Переход к следующему игроку
  const nextStep = () => {
    if (gameState === 'reveal') {
      if (currentPlayer < players) {
        setCurrentPlayer(p => p + 1);
        setGameState('pass');
      } else {
        setGameState('play');
      }
    } else {
      setGameState('reveal');
    }
  };

  return (
    <div className="spy-theme-wrapper">
      {/* Кнопка выхода в стиле "Отмена миссии" */}
      <button className="spy-exit-btn" onClick={onBack}>ABORT MISSION</button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: НАСТРОЙКА КОЛИЧЕСТВА ИГРОКОВ */}
        {gameState === 'setup' && (
          <motion.div key="setup" className="spy-screen" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="spy-scanner"></div>
            <h1 className="spy-glitch-title">SPY<span>_CONFIDENTIAL</span></h1>
            <div className="spy-setup-box">
              <label>AGENTS IN FIELD:</label>
              <div className="spy-counter">
                <button onClick={() => setPlayers(Math.max(3, players - 1))}>-</button>
                <span>{players}</span>
                <button onClick={() => setPlayers(Math.min(10, players + 1))}>+</button>
              </div>
            </div>
            <button className="spy-btn-action" onClick={startNewGame}>INITIALIZE</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА (СКРЫТО) */}
        {gameState === 'pass' && (
          <motion.div key="pass" className="spy-screen" initial={{scale:0.9}} animate={{scale:1}}>
            <div className="spy-alert-icon">⚠️</div>
            <h2>AGENT #{currentPlayer}</h2>
            <p className="spy-instruction">PASS THE DEVICE TO THE AGENT. ENSURE PRIVACY.</p>
            <button className="spy-btn-action" onClick={nextStep}>ACCESS DATA</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: ПОКАЗ РОЛИ */}
        {gameState === 'reveal' && (
          <motion.div key="reveal" className="spy-screen" initial={{y: 20}} animate={{y:0}}>
            <div className="spy-data-card">
              <label>YOUR STATUS:</label>
              {currentPlayer === spyIndex ? (
                <div className="spy-role-text spy-danger">YOU ARE THE SPY</div>
              ) : (
                <div className="spy-role-text">LOCATION: {location}</div>
              )}
            </div>
            <button className="spy-btn-action" onClick={nextStep}>CONFIRM & ERASE</button>
          </motion.div>
        )}

        {/* ЭКРАН 4: ИГРОВОЙ ТАЙМЕР */}
        {gameState === 'play' && (
          <motion.div key="play" className="spy-screen">
            <h2 className="spy-glitch-title">IN FILTRATION</h2>
            <div className="spy-timer-ring">
              <p>QUESTIONS IN PROGRESS</p>
            </div>
            <button className="spy-btn-action" onClick={() => setGameState('setup')}>END MISSION</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

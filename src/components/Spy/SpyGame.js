import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем уникальный стиль
import './SpyGame.css';

// --- СПИСОК ЛОКАЦИЙ ---
const LOCATIONS = [
  "Орбитальная станция", "Подводная лодка", "Ночной клуб", 
  "Овощебаза", "Театр", "Цирк шапито", "Ресторан", 
  "Полицейский участок", "Школа", "Больница"
];

export default function SpyGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [gameState, setGameState] = useState('setup'); // setup, pass, reveal, play
  const [players, setPlayers] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [spyIndex, setSpyIndex] = useState(0);
  const [location, setLocation] = useState('');

  // --- ЛОГИКА ИГРЫ ---
  
  // Создание новой партии: выбираем шпиона и локацию
  const startNewGame = () => {
    const randomSpy = Math.floor(Math.random() * players) + 1;
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    setSpyIndex(randomSpy);
    setLocation(randomLoc);
    setCurrentPlayer(1);
    setGameState('pass');
  };

  // Ход управления экранами
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
    <div className="spy-wrapper">
      {/* Кнопка выхода в стиле архивного ярлыка */}
      <button className="spy-btn-exit" onClick={onBack}>ЗАКРЫТЬ ДЕЛО</button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: НАСТРОЙКА */}
        {gameState === 'setup' && (
          <motion.div key="setup" className="spy-folder" initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}}>
            <div className="spy-stamp">СЕКРЕТНО</div>
            <h1 className="spy-title">ДОСЬЕ: ШПИОН</h1>
            
            <div className="spy-setup-row">
              <label>КОЛИЧЕСТВО АГЕНТОВ:</label>
              <div className="spy-controls">
                <button onClick={() => setPlayers(Math.max(3, players - 1))}>-</button>
                <span className="spy-num">{players}</span>
                <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
              </div>
            </div>

            <button className="spy-btn-confirm" onClick={startNewGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА */}
        {gameState === 'pass' && (
          <motion.div key="pass" className="spy-screen-center" initial={{scale: 0.9}} animate={{scale: 1}}>
            <div className="spy-briefcase">💼</div>
            <h2>АГЕНТ №{currentPlayer}</h2>
            <p>Передайте устройство следующему игроку. Убедитесь, что никто не видит ваш экран.</p>
            <button className="spy-btn-confirm" onClick={nextStep}>ОЗНАКОМИТЬСЯ</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: РОЛЬ */}
        {gameState === 'reveal' && (
          <motion.div key="reveal" className="spy-folder" initial={{rotateY: 90}} animate={{rotateY: 0}}>
            <div className="spy-document">
              <div className="spy-doc-header">ЛИЧНОЕ ДЕЛО №{Math.floor(Math.random()*1000)}</div>
              <div className="spy-doc-content">
                <label>ВАШ СТАТУС:</label>
                {currentPlayer === spyIndex ? (
                  <div className="spy-role spy-is-spy">ВЫ ШПИОН</div>
                ) : (
                  <div className="spy-role">ЛОКАЦИЯ: <span>{location}</span></div>
                )}
                <p className="spy-warning">Запомните данные и сожгите (нажмите кнопку).</p>
              </div>
            </div>
            <button className="spy-btn-confirm" onClick={nextStep}>УНИЧТОЖИТЬ УЛИКИ</button>
          </motion.div>
        )}

        {/* ЭКРАН 4: ИГРА */}
        {gameState === 'play' && (
          <motion.div key="play" className="spy-screen-center" initial={{opacity: 0}} animate={{opacity: 1}}>
            <div className="spy-stamp-play">В ИГРЕ</div>
            <h2 className="spy-mission-title">ОПЕРАЦИЯ ИДЕТ</h2>
            <div className="spy-timer-box">Задавайте вопросы друг другу.</div>
            <button className="spy-btn-confirm" onClick={() => setGameState('setup')}>ЗАВЕРШИТЬ МИССИЮ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

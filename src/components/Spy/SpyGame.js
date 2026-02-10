import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './SpyGame.css';

const LOCATIONS = [
  "Орбитальная станция", "Подводная лодка", "Ночной клуб", 
  "Овощебаза", "Театр", "Цирк шапито", "Ресторан", 
  "Полицейский участок", "Школа", "Больница"
];

export default function SpyGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [gameState, setGameState] = useState('setup'); // setup, pass, reveal, play, voting, finale
  const [playerNames, setPlayerNames] = useState(["Агент 001", "Агент 002", "Агент 003"]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [spyIndex, setSpyIndex] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    let timer;
    if (gameState === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- УПРАВЛЕНИЕ ИГРОКАМИ ---
  const addPlayer = () => {
    if (playerNames.length < 12) {
      setPlayerNames([...playerNames, `Агент 00${playerNames.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (playerNames.length > 3) {
      setPlayerNames(playerNames.slice(0, -1));
    }
  };

  const handleNameChange = (index, newName) => {
    const newNames = [...playerNames];
    newNames[index] = newName;
    setPlayerNames(newNames);
  };

  const startNewGame = () => {
    const randomSpy = Math.floor(Math.random() * playerNames.length);
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    setSpyIndex(randomSpy);
    setLocation(randomLoc);
    setCurrentPlayer(0);
    setTimeLeft(300);
    setGameState('pass');
  };

  const nextStep = () => {
    if (gameState === 'reveal') {
      if (currentPlayer < playerNames.length - 1) {
        setCurrentPlayer(p => p + 1);
        setGameState('pass');
      } else {
        setGameState('play');
      }
    } else {
      setGameState('reveal');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="spy-wrapper">
      <button className="spy-btn-exit" onClick={onBack}>ЗАКРЫТЬ ДЕЛО</button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: НАСТРОЙКА */}
        {gameState === 'setup' && (
          <motion.div key="setup" className="spy-folder" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="spy-stamp">SECRET</div>
            <h1 className="spy-title">СПИСОК АГЕНТОВ</h1>
            
            <div className="spy-names-list">
              {playerNames.map((name, idx) => (
                <div key={idx} className="spy-input-row">
                  <span className="spy-id">#{idx + 1}</span>
                  <input 
                    className="spy-name-input"
                    value={name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="spy-setup-controls">
              <button className="spy-round-btn" onClick={removePlayer}>-</button>
              <span className="spy-count-badge">ГРУППА: {playerNames.length}</span>
              <button className="spy-round-btn" onClick={addPlayer}>+</button>
            </div>

            <button className="spy-btn-confirm" onClick={startNewGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА (КРАСИВЫЙ ДИЗАЙН) */}
        {gameState === 'pass' && (
          <motion.div key="pass" className="spy-envelope" initial={{scale:0.8, y: 100}} animate={{scale:1, y: 0}}>
            <div className="envelope-top"></div>
            <div className="spy-pass-content">
              <span className="label-top-secret">TOP SECRET</span>
              <h2>ПЕРЕДАТЬ ЛИЧНО В РУКИ:</h2>
              <div className="spy-target-name">{playerNames[currentPlayer]}</div>
              <p className="spy-disclaimer">Убедитесь, что посторонние не видят экран</p>
            </div>
            <button className="spy-btn-confirm" onClick={nextStep}>ОТКРЫТЬ ПАКЕТ</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: РОЛЬ */}
        {gameState === 'reveal' && (
          <motion.div key="reveal" className="spy-folder" initial={{rotateY: 90}} animate={{rotateY: 0}}>
            <div className="spy-document">
              <div className="spy-doc-header">ЛИЧНОЕ ДЕЛО №00{currentPlayer + 1}</div>
              <div className="spy-doc-content">
                <div className="status-label-box">ВАШ ТЕКУЩИЙ СТАТУС:</div>
                {currentPlayer === spyIndex ? (
                  <div className="spy-role-box spy-is-spy">
                    <span className="spy-role-text">ШПИОН</span>
                    <p className="spy-subtext">Вычислите локацию!</p>
                  </div>
                ) : (
                  <div className="spy-role-box">
                    <span className="spy-loc-label">ЛОКАЦИЯ:</span>
                    <span className="spy-loc-text">{location}</span>
                  </div>
                )}
              </div>
            </div>
            <button className="spy-btn-confirm" onClick={nextStep}>УНИЧТОЖИТЬ</button>
          </motion.div>
        )}

        {/* ЭКРАН 4: ИГРА (ТАЙМЕР И ГОЛОСОВАНИЕ) */}
        {gameState === 'play' && (
          <motion.div key="play" className="spy-screen-center" initial={{opacity:0}}>
            <div className="spy-timer-display">{formatTime(timeLeft)}</div>
            <p className="spy-briefing">Операция в активной фазе. Задавайте вопросы.</p>
            <div className="spy-actions-group">
              <button className="spy-btn-secondary" onClick={() => setGameState('voting')}>ПЕРЕЙТИ К ГОЛОСОВАНИЮ</button>
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 5: ГОЛОСОВАНИЕ ВНУТРИ ИГРЫ */}
        {gameState === 'voting' && (
          <motion.div key="voting" className="spy-folder" initial={{y: 50}}>
            <h2 className="spy-title">ГОЛОСОВАНИЕ</h2>
            <p className="spy-instruction">Выберите, кто кажется вам подозрительным:</p>
            <div className="spy-voting-grid">
              {playerNames.map((name, idx) => (
                <button key={idx} className="spy-vote-btn" onClick={() => setGameState('finale')}>
                  {name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 6: ФИНАЛ */}
        {gameState === 'finale' && (
          <motion.div key="finale" className="spy-folder" initial={{scale: 0.9}}>
            <div className="spy-stamp-red">ОБЪЕКТ РАСКРЫТ</div>
            <div className="spy-results-content">
              <label>ШПИОНОМ БЫЛ(А):</label>
              <div className="spy-winner-reveal">{playerNames[spyIndex]}</div>
              <label>ЛОКАЦИЯ МИССИИ:</label>
              <div className="spy-loc-reveal">{location}</div>
            </div>
            <button className="spy-btn-confirm" onClick={() => setGameState('setup')}>НОВОЕ ДЕЛО</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

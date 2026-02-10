import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpyGame.css';

// // --- СПИСОК ЛОКАЦИЙ (ДЛЯ ПОКАЗА В КОНЦЕ) ---
const LOCATIONS = [
  "Орбитальная станция", "Подводная лодка", "Ночной клуб", 
  "Овощебаза", "Театр", "Цирк шапито", "Ресторан", 
  "Полицейский участок", "Школа", "Больница"
];

export default function SpyGame({ onBack }) {
  // // --- СОСТОЯНИЯ ---
  const [gameState, setGameState] = useState('setup'); // setup, pass, reveal, play, finale
  const [playerNames, setPlayerNames] = useState(["Игрок 1", "Игрок 2", "Игрок 3"]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [spyIndex, setSpyIndex] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут в секундах

  // // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    let timer;
    if (gameState === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('finale');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // // --- ФУНКЦИИ УПРАВЛЕНИЯ ---

  // // Добавление/удаление игроков
  const updatePlayersCount = (val) => {
    if (val > 0 && playerNames.length < 12) {
      setPlayerNames([...playerNames, `Игрок ${playerNames.length + 1}`]);
    } else if (val < 0 && playerNames.length > 3) {
      setPlayerNames(playerNames.slice(0, -1));
    }
  };

  // // Изменение конкретного имени
  const handleNameChange = (index, newName) => {
    const newNames = [...playerNames];
    newNames[index] = newName;
    setPlayerNames(newNames);
  };

  // // Запуск новой миссии
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

  // // Форматирование времени (05:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="spy-wrapper">
      <button className="spy-btn-exit" onClick={onBack}>ЗАКРЫТЬ ДЕЛО</button>

      <AnimatePresence mode="wait">
        
        {/* // ЭКРАН 1: НАСТРОЙКА ИМЕН */}
        {gameState === 'setup' && (
          <motion.div key="setup" className="spy-folder" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="spy-stamp">СЕКРЕТНО</div>
            <h1 className="spy-title">СПИСОК АГЕНТОВ</h1>
            
            <div className="spy-names-list">
              {playerNames.map((name, idx) => (
                <input 
                  key={idx}
                  className="spy-name-input"
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Агент ${idx + 1}`}
                />
              ))}
            </div>

            <div className="spy-setup-controls">
              <button onClick={() => updatePlayersCount(-1)}>-</button>
              <span>{playerNames.length}</span>
              <button onClick={() => updatePlayersCount(1)}>+</button>
            </div>

            <button className="spy-btn-confirm" onClick={startNewGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
          </motion.div>
        )}

        {/* // ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА */}
        {gameState === 'pass' && (
          <motion.div key="pass" className="spy-screen-center" initial={{scale:0.8}} animate={{scale:1}}>
            <div className="spy-briefcase">💼</div>
            <h2>ПЕРЕДАЙТЕ:</h2>
            <div className="spy-target-name">{playerNames[currentPlayer]}</div>
            <button className="spy-btn-confirm" onClick={nextStep}>Я {playerNames[currentPlayer]}</button>
          </motion.div>
        )}

        {/* // ЭКРАН 3: ПОКАЗ РОЛИ */}
        {gameState === 'reveal' && (
          <motion.div key="reveal" className="spy-folder" initial={{rotateY: 90}} animate={{rotateY: 0}}>
            <div className="spy-document">
              <div className="spy-doc-header">ДОСЬЕ №{currentPlayer + 101}</div>
              <div className="spy-doc-content">
                <label>ВАШ СТАТУС:</label>
                {currentPlayer === spyIndex ? (
                  <div className="spy-role spy-is-spy">ВЫ ШПИОН</div>
                ) : (
                  <div className="spy-role">ЛОКАЦИЯ: <br/><span>{location}</span></div>
                )}
              </div>
            </div>
            <button className="spy-btn-confirm" onClick={nextStep}>ПРИНЯТО</button>
          </motion.div>
        )}

        {/* // ЭКРАН 4: ТАЙМЕР И ОБСУЖДЕНИЕ */}
        {gameState === 'play' && (
          <motion.div key="play" className="spy-screen-center">
            <div className="spy-timer-display">{formatTime(timeLeft)}</div>
            <p className="spy-hint-text">Задавайте вопросы. Шпион должен вычислить локацию, остальные — шпиона.</p>
            <button className="spy-btn-confirm" onClick={() => setGameState('finale')}>ГОЛОСОВАНИЕ</button>
          </motion.div>
        )}

        {/* // ЭКРАН 5: ФИНАЛ (РАСКРЫТИЕ КАРТ) */}
        {gameState === 'finale' && (
          <motion.div key="finale" className="spy-folder" initial={{y: 50}} animate={{y:0}}>
            <div className="spy-stamp-red">ДЕЛО ЗАКРЫТО</div>
            <h2 className="spy-title">ИТОГИ МИССИИ</h2>
            <div className="spy-results-box">
              <p>ШПИОНОМ БЫЛ(А):</p>
              <div className="spy-winner-name">{playerNames[spyIndex]}</div>
              <p style={{marginTop: '20px'}}>ЛОКАЦИЯ:</p>
              <div className="spy-target-name">{location}</div>
            </div>
            <button className="spy-btn-confirm" onClick={() => setGameState('setup')}>НОВАЯ МИССИЯ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

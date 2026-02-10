import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили именно для этой игры
import './AliasGame.css';

// --- БАЗА СЛОВ ДЛЯ ИГРЫ ---
const ALIAS_WORDS = ["Счастье", "Пицца", "Программист", "Гитара", "Космос", "Метро", "Зеркало", "Шоколад"];

export default function AliasGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [screen, setScreen] = useState('menu'); // Экран: menu, play, result
  const [word, setWord] = useState(''); // Текущее слово
  const [timer, setTimer] = useState(60); // Время раунда
  const [isActive, setIsActive] = useState(false); // Запущена ли игра
  const [score, setScore] = useState(0); // Очки за раунд

  // --- ЛОГИКА ТАЙМЕРА ---
  // Каждую секунду уменьшает время, если isActive = true
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
      setScreen('result');
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- ФУНКЦИИ ---

  // Функция для получения нового слова из базы
  const nextWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ALIAS_WORDS.length);
    setWord(ALIAS_WORDS[randomIndex]);
  }, []);

  // Старт раунда
  const startRound = () => {
    setScore(0);
    setTimer(60);
    setScreen('play');
    setIsActive(true);
    nextWord();
  };

  // Клик "Угадано" (+1 очко и новое слово)
  const handleSuccess = () => {
    setScore(s => s + 1);
    nextWord();
  };

  return (
    <div className="alias-container">
      {/* КНОПКА НАЗАД (Твоя просьба) */}
      {/* При нажатии вызывает функцию onBack из App.js, которая ставит activeGame в null */}
      <button className="btn-back-menu" onClick={onBack}>
        ← В МЕНЮ
      </button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: МЕНЮ */}
        {screen === 'menu' && (
          <motion.div key="menu" initial={{opacity:0}} animate={{opacity:1}} className="alias-content">
            <h1 className="alias-title">ALIAS <span>POP</span></h1>
            <p className="alias-info">Объясни как можно больше слов за 60 секунд!</p>
            <button className="btn-alias-main" onClick={startRound}>ПОЕХАЛИ!</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПРОЦЕСС ИГРЫ */}
        {screen === 'play' && (
          <motion.div key="play" initial={{y: 50}} animate={{y:0}} className="alias-content">
            <div className="alias-timer-box">⏱ {timer}s</div>
            <div className="alias-word-card">
              <span style={{fontSize: '12px', opacity: 0.5}}>ОБЪЯСНИ СЛОВО:</span>
              <div className="alias-word-text">{word}</div>
            </div>
            <div className="alias-controls">
              <button className="btn-alias-skip" onClick={nextWord}>ПРОПУСТИТЬ</button>
              <button className="btn-alias-success" onClick={handleSuccess}>УГАДАНО!</button>
            </div>
            <div className="alias-score-counter">Очки: {score}</div>
          </motion.div>
        )}

        {/* ЭКРАН 3: РЕЗУЛЬТАТЫ */}
        {screen === 'result' && (
          <motion.div key="res" initial={{scale:0.8}} animate={{scale:1}} className="alias-content">
            <h2 className="alias-res-title">ВРЕМЯ ВЫШЛО!</h2>
            <div className="alias-word-card">
               <p>Твой результат:</p>
               <div className="alias-word-text" style={{color: '#667EEA'}}>{score}</div>
            </div>
            <button className="btn-alias-main" onClick={() => setScreen('menu')}>ЕЩЕ РАЗ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем твой новый сочный CSS
import './AliasGame.css';

// --- ДАННЫЕ ИГРЫ ---
const CATEGORIES = ["❤️ ХОТ", "🥳 ПАТИ", "🧠 УМ", "🎬 КИНО"];
const DICTIONARY = {
  "❤️ ХОТ": ["Свидание", "Поцелуй", "Романтика", "Страсть", "Флирт"],
  "🥳 ПАТИ": ["Танцы", "Караоке", "Коктейль", "Музыка", "Диджей"],
  "🧠 УМ": ["Интеллект", "Логика", "Философия", "Космос", "Теория"],
  "🎬 КИНО": ["Оскар", "Попкорн", "Трейлер", "Актер", "Режиссер"]
};

export default function AliasGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [screen, setScreen] = useState('setup'); // setup, play, results
  const [category, setCategory] = useState("❤️ ХОТ");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [history, setHistory] = useState([]); // Для списка результатов в конце

  // --- ЛОГИКА ТАЙМЕРА ---
  // Считает секунды и по нулям выкидывает на экран результатов
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setScreen('results');
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- ФУНКЦИИ ---
  
  // Выбор случайного слова из категории
  const getNextWord = useCallback(() => {
    const list = DICTIONARY[category];
    const word = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(word);
  }, [category]);

  // Старт игры
  const startGame = () => {
    setScore(0);
    setTimer(60);
    setHistory([]);
    setScreen('play');
    setIsActive(true);
    getNextWord();
  };

  // Обработка Угадал/Пропустил
  const handleAction = (isSuccess) => {
    setHistory(prev => [{ word: currentWord, success: isSuccess }, ...prev]);
    if (isSuccess) setScore(s => s + 1);
    getNextWord();
  };

  return (
    <div className="app-shell">
      {/* HEADER: Виден всегда, кроме главного меню, если хочешь */}
      <header className={`pop-header ${screen !== 'setup' ? 'visible' : 'visible'}`}>
        <button className="pop-chip" onClick={onBack}>← МЕНЮ</button>
        {screen === 'play' && <div className="timer-bubble">{timer}s</div>}
        <div className="score-pill">🏆 {score}</div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: НАСТРОЙКА (SETUP) */}
        {screen === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pop-screen active">
            <h1 className="pop-title">ALIAS<span>POP</span></h1>
            
            <div className="section-label">Выбери категорию:</div>
            <div className="chips-group">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat} 
                  className={`pop-chip ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>

            <button className="btn-pop-main" onClick={startGame}>НАЧАТЬ ИГРУ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ИГРОВОЙ ПРОЦЕСС (PLAY) */}
        {screen === 'play' && (
          <motion.div key="play" initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="pop-screen active">
            <div className="card-container">
              <div className="word-card">
                <div id="word-display">{currentWord}</div>
              </div>
              <div className="swipe-hint">Объясни это слово!</div>
            </div>

            <div className="game-actions">
              <button className="btn-pop-main btn-skip" onClick={() => handleAction(false)}>ПРОПУСТИТЬ</button>
              <button className="btn-pop-main btn-check" onClick={() => handleAction(true)}>УГАДАНО</button>
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 3: РЕЗУЛЬТАТЫ (RESULTS) */}
        {screen === 'results' && (
          <motion.div key="results" initial={{ y: 300 }} animate={{ y: 0 }} className="pop-screen active">
            <div className="summary-box">
              <h2>ИТОГО: {score}</h2>
              <p>Отличный результат!</p>
            </div>

            <div className="pop-list">
              {history.map((item, idx) => (
                <div className="word-row" key={idx}>
                  <span>{item.word}</span>
                  <div className={`status-icon ${item.success ? 'status-ok' : 'status-err'}`}>
                    {item.success ? '✓' : '✕'}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-pop-main" onClick={() => setScreen('setup')}>ИГРАТЬ ЕЩЕ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

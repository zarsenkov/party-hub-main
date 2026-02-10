import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили именно этой игры
import './CrocodileGame.css';

// --- БАЗА СЛОВ ---
const CROC_WORDS = [
  "Синхрофазотрон", "Зубная паста", "Понедельник", "Кот в сапогах", 
  "Электрический ток", "Миксер", "Сноуборд", "Гарри Поттер", 
  "Шлагбаум", "Интуиция", "Эволюция", "Кофемашина"
];

// --- УСЛОЖНЕНИЯ ---
const MODIFIERS = [
  "Только одной рукой", 
  "Стоя на одной ноге", 
  "С закрытыми глазами", 
  "Спиной к игрокам", 
  "Не используя руки"
];

export default function CrocodileGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [screen, setScreen] = useState('menu'); // menu, play, result
  const [word, setWord] = useState(''); // Текущее слово
  const [mod, setMod] = useState(null); // Текущее усложнение
  const [timer, setTimer] = useState(60); // Время раунда
  const [isActive, setIsActive] = useState(false);

  // --- ТАЙМЕР ---
  // Запускает обратный отсчет, если isActive = true
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
  
  // Генерация нового задания: выбирает слово и с шансом 40% добавляет усложнение
  const startGame = () => {
    const randomWord = CROC_WORDS[Math.floor(Math.random() * CROC_WORDS.length)];
    const randomMod = Math.random() > 0.6 ? MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)] : null;
    
    setWord(randomWord);
    setMod(randomMod);
    setTimer(60);
    setScreen('play');
    setIsActive(true);
  };

  return (
    <div className="croc-container">
      {/* Кнопка выхода на лендинг */}
      <button className="croc-back" onClick={onBack}>← МЕНЮ</button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: ГЛАВНОЕ МЕНЮ ИГРЫ */}
        {screen === 'menu' && (
          <motion.div 
            key="menu" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="croc-content"
          >
            <div className="croc-icon">🐊</div>
            <h1 className="croc-title">КРОКО<span>ДИЛ</span></h1>
            <p className="croc-desc">Показывай слово жестами. Никаких звуков и слов!</p>
            <button className="croc-btn-start" onClick={startGame}>ПОЛУЧИТЬ ЗАДАНИЕ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПРОЦЕСС ПОКАЗА */}
        {screen === 'play' && (
          <motion.div 
            key="play" 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="croc-content"
          >
            <div className="croc-timer">⏱ {timer}</div>
            
            <div className="croc-word-card">
              <span className="croc-label">ТВОЕ СЛОВО:</span>
              <div className="croc-word-text">{word}</div>
              
              {/* Показываем усложнение, если оно выпало */}
              {mod && (
                <div className="croc-modifier">
                  ⚠️ {mod}
                </div>
              )}
            </div>

            <button className="croc-btn-done" onClick={() => { setIsActive(false); setScreen('result'); }}>
              УГАДАНО!
            </button>
          </motion.div>
        )}

        {/* ЭКРАН 3: РЕЗУЛЬТАТ */}
        {screen === 'result' && (
          <motion.div 
            key="result" 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            className="croc-content"
          >
            <h2 className="croc-res-title">{timer > 0 ? "ОТЛИЧНО! 🎉" : "ВРЕМЯ ВЫШЛО"}</h2>
            <div className="croc-word-card" style={{ boxShadow: 'none', background: 'rgba(255,255,255,0.5)' }}>
               <p>Слово: <strong>{word}</strong></p>
            </div>
            <button className="croc-btn-start" onClick={() => setScreen('menu')}>ИГРАТЬ ЕЩЕ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

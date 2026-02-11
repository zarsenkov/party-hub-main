import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, RefreshCw, CheckCircle2, XCircle, ArrowLeft, Play } from 'lucide-react';
import './CrocodileGame.css';

// База слов, разделенная по уровням сложности
const WORDS_DATABASE = {
  easy: ['Кошка', 'Телефон', 'Арбуз', 'Гитара', 'Зонт', 'Повар', 'Книга', 'Молоток'],
  medium: ['Счастье', 'Интервью', 'Электричество', 'Орбита', 'Микроскоп', 'Шахматы'],
  hard: ['Дежавю', 'Синхрофазотрон', 'Менеджмент', 'Харизма', 'Когнитивность']
};

const CrocodileGame = ({ onBack }) => {
  // Состояния игры: menu (выбор сложности), play (процесс), result (финал раунда)
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  // Функция для случайного выбора слова из базы
  const getRandomWord = (level) => {
    const words = WORDS_DATABASE[level];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // Функция запуска раунда
  const startGame = (level) => {
    setDifficulty(level);
    setCurrentWord(getRandomWord(level));
    setTimeLeft(60);
    setGameState('play');
    setIsPaused(false);
  };

  // Эффект для работы таймера
  useEffect(() => {
    let timer;
    if (gameState === 'play' && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('result');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isPaused]);

  // Экран выбора сложности (Menu)
  if (gameState === 'menu') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="croc-container">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={24} /></button>
        <h2 className="croc-title">КРОКОДИЛ</h2>
        <p className="croc-subtitle">Выбери сложность слов:</p>
        <div className="difficulty-grid">
          {Object.keys(WORDS_DATABASE).map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`diff-card ${level}`}
              onClick={() => startGame(level)}
            >
              {level === 'easy' && 'Легко'}
              {level === 'medium' && 'Средне'}
              {level === 'hard' && 'Хардкор'}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Экран игрового процесса (Play)
  return (
    <div className="croc-container">
      <div className="game-header">
        <div className={`timer-badge ${timeLeft < 10 ? 'low' : ''}`}>
          <Timer size={20} />
          <span>{timeLeft}с</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="word-card"
        >
          <span className="word-label">Покажи слово:</span>
          <h1 className="word-main">{currentWord}</h1>
        </motion.div>
      </AnimatePresence>

      <div className="game-controls">
        <button className="control-btn skip" onClick={() => setCurrentWord(getRandomWord(difficulty))}>
          <RefreshCw size={24} />
          <span>Другое слово</span>
        </button>
        
        <button className="control-btn done" onClick={() => setGameState('result')}>
          <CheckCircle2 size={24} />
          <span>Угадано!</span>
        </button>
      </div>
    </div>
  );
};

export default CrocodileGame;

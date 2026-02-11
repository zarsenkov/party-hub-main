import React, { useState, useEffect } from 'react';
// Плавные переходы без рывков
import { motion, AnimatePresence } from 'framer-motion';
// Иконки
import { Timer, X, Check, ArrowLeft, Trophy } from 'lucide-react';
import './CrocodileGame.css';

const WORDS = ['Обезьяна', 'Банан', 'Лиана', 'Джунгли', 'Слон', 'Пиранья', 'Мачете', 'Кокос', 'Леопард'];

const CrocodileGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play, results
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);

  // Смена слова
  // // Выбирает случайное, отличное от текущего
  const nextWord = () => {
    const filtered = WORDS.filter(w => w !== word);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setWord(random);
  };

  // Таймер раунда
  useEffect(() => {
    let interval = null;
    if (stage === 'play' && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('results');
    }
    return () => { if (interval) clearInterval(interval); };
  }, [stage, time]);

  const startGame = () => {
    setScore(0);
    setTime(60);
    nextWord();
    setStage('play');
  };

  if (stage === 'menu') {
    return (
      <div className="croc-container jungle-theme center">
        <button className="back-btn-fixed" onClick={onBack}><ArrowLeft size={18}/> НАЗАД</button>
        <h1 className="croc-logo">CROC!</h1>
        <button className="croc-main-btn" onClick={startGame}>НАЧАТЬ РАУНД</button>
      </div>
    );
  }

  if (stage === 'play') {
    return (
      <div className="croc-container jungle-theme">
        <div className="game-header">
          <div className="timer-badge"><Timer size={16}/> {time}с</div>
          <div className="score-badge">Счет: {score}</div>
        </div>
        <div className="card-zone">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="croc-card"
            >
              <h2>{word}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="game-controls">
          <button className="btn-no" onClick={nextWord}><X size={32}/></button>
          <button className="btn-yes" onClick={() => { setScore(s => s + 1); nextWord(); }}><Check size={32}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="croc-container jungle-theme center">
      <Trophy size={64} color="#ffe600" />
      <h2 className="res-title">ФИНИШ</h2>
      <div className="final-score">{score}</div>
      <button className="croc-main-btn" onClick={onBack}>В МЕНЮ</button>
    </div>
  );
};

export default CrocodileGame;

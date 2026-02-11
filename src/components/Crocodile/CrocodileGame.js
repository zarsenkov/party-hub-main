import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, X, Check, ArrowLeft, Play } from 'lucide-react';
import './CrocodileGame.css';

const WORDS = ['Обезьяна', 'Банан', 'Лиана', 'Джунгли', 'Слон', 'Пиранья', 'Исследователь', 'Мачете'];

const CrocodileGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play, results
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);

  // Функция смены слова
  // // Ищет новое слово, отличное от текущего
  const nextWord = useCallback(() => {
    setWord(prev => {
      let n = WORDS[Math.floor(Math.random() * WORDS.length)];
      while (n === prev) n = WORDS[Math.floor(Math.random() * WORDS.length)];
      return n;
    });
  }, []);

  // Таймер раунда (1 раунд и финиш)
  useEffect(() => {
    let interval;
    if (stage === 'play' && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('results');
    }
    return () => clearInterval(interval);
  }, [stage, time]);

  if (stage === 'menu') {
    return (
      <div className="croc-container jungle-theme center">
        <button className="back-btn-fixed" onClick={onBack}><ArrowLeft /> Назад</button>
        <h1 className="croc-logo">CROC!</h1>
        <button className="croc-main-btn" onClick={() => { setScore(0); setTime(60); nextWord(); setStage('play'); }}>
          НАЧАТЬ РАУНД
        </button>
      </div>
    );
  }

  if (stage === 'play') {
    return (
      <div className="croc-container jungle-theme">
        <div className="game-header">
          <div className="timer-badge">{time}с</div>
          <div className="score-badge">Счет: {score}</div>
        </div>
        <div className="card-zone">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
      <Trophy size={60} color="#ffe600" />
      <h2 className="res-title">РАУНД ОКОНЧЕН</h2>
      <div className="final-score">{score}</div>
      <button className="croc-main-btn" onClick={onBack}>В МЕНЮ ИГР</button>
    </div>
  );
};

export default CrocodileGame;

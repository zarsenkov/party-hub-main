import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Check, ArrowLeft } from 'lucide-react';
import './AliasGame.css';

const ALIAS_WORDS = ['Космос', 'Пицца', 'Гитара', 'Метро', 'Робот', 'Зомби', 'Спорт', 'Кино', 'Ниндзя'];

const AliasGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu');
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [log, setLog] = useState([]);

  const nextWord = () => {
    const filtered = ALIAS_WORDS.filter(w => w !== word);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setWord(random);
  };

  useEffect(() => {
    let t = null;
    if (stage === 'play' && time > 0) {
      t = setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('results');
    }
    return () => { if (t) clearInterval(t); };
  }, [stage, time]);

  const startAlias = () => {
    setScore(0);
    setTime(60);
    setLog([]);
    nextWord();
    setStage('play');
  };

  if (stage === 'menu') {
    return (
      <div className="pop-container center">
        <button className="back-btn-fixed-pop" onClick={onBack}><ArrowLeft size={18}/> НАЗАД</button>
        <h1 className="pop-logo">ALIAS!</h1>
        <button className="pop-btn-main" onClick={startAlias}>ИГРАТЬ</button>
      </div>
    );
  }

  if (stage === 'play') {
    return (
      <div className="pop-container play-bg">
        <div className="pop-header">
          <div className="pop-timer-pill"><Timer size={16}/> {time}с</div>
          <div className="pop-score-pill">Очки: {score}</div>
        </div>
        <div className="pop-card-area">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="pop-word-card"
            >
              <h2>{word}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pop-actions">
          <button className="pop-action-btn btn-no" onClick={() => { setLog(prev => [...prev, {word, ok: false}]); nextWord(); }}><X size={32}/></button>
          <button className="pop-action-btn btn-yes" onClick={() => { setScore(s => s + 1); setLog(prev => [...prev, {word, ok: true}]); nextWord(); }}><Check size={32}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="pop-container">
      <h2 className="pop-res-title">ИТОГИ</h2>
      <div className="pop-list">
        {log.map((item, i) => (
          <div key={i} className={`pop-list-item ${item.ok ? 'is-ok' : 'is-no'}`}>
            {item.word} <span>{item.ok ? '+1' : '-1'}</span>
          </div>
        ))}
      </div>
      <button className="pop-btn-main" onClick={onBack}>В МЕНЮ</button>
    </div>
  );
};

export default AliasGame;

import React, { useState, useEffect } from 'react';
// Импортируем иконки
import { Timer, X, Check, ArrowLeft, Trophy } from 'lucide-react';
import './CrocodileGame.css';

const WORDS = ['Телефон', 'Самолет', 'Арбуз', 'Гитара', 'Кошка', 'Зеркало', 'Лампа', 'Книга'];

const CrocodileGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play, results
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);

  // Функция для получения случайного слова
  const nextWord = () => {
    const random = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(random);
  };

  // Таймер игры
  useEffect(() => {
    let interval = null;
    if (stage === 'play' && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
      setStage('results');
    }
    return () => { if (interval) clearInterval(interval); };
  }, [stage, time]);

  if (stage === 'menu') {
    return (
      <div className="croc-wrap jungle">
        <button className="abs-back" onClick={onBack}><ArrowLeft /> Назад</button>
        <h1 className="croc-title">CROC</h1>
        <button className="main-action-btn" onClick={() => { setScore(0); setTime(60); nextWord(); setStage('play'); }}>СТАРТ</button>
      </div>
    );
  }

  if (stage === 'play') {
    return (
      <div className="croc-wrap jungle">
        <div className="game-top">
          <div className="badge"><Timer size={16}/> {time}</div>
          <div className="badge">Счет: {score}</div>
        </div>
        <div className="word-card-box">
          <div className="word-card">
            <h2>{word}</h2>
          </div>
        </div>
        <div className="game-btns">
          <button className="btn-skip" onClick={nextWord}><X size={30}/></button>
          <button className="btn-ok" onClick={() => { setScore(s => s + 1); nextWord(); }}><Check size={30}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="croc-wrap jungle center">
      <Trophy size={60} color="yellow" />
      <h1>ФИНИШ</h1>
      <div className="res-circle">{score}</div>
      <button className="main-action-btn" onClick={onBack}>В МЕНЮ</button>
    </div>
  );
};

export default CrocodileGame;

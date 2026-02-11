import React, { useState, useEffect } from 'react';
import { Timer, X, Check, ArrowLeft } from 'lucide-react';
import './AliasGame.css';

const WORDS = ['Космос', 'Пицца', 'Гитара', 'Метро', 'Робот', 'Зомби', 'Спорт', 'Кино', 'Ниндзя'];

const AliasGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu');
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [log, setLog] = useState([]);

  const nextWord = () => {
    const random = WORDS[Math.floor(Math.random() * WORDS.length)];
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

  if (stage === 'menu') {
    return (
      <div className="alias-wrap pop">
        <button className="abs-back-pop" onClick={onBack}><ArrowLeft /> Назад</button>
        <h1 className="alias-title">ALIAS</h1>
        <button className="pop-btn" onClick={() => { setScore(0); setTime(60); setLog([]); nextWord(); setStage('play'); }}>ИГРАТЬ</button>
      </div>
    );
  }

  if (stage === 'play') {
    return (
      <div className="alias-wrap pop yellow">
        <div className="pop-head">
          <div className="pill">{time}с</div>
          <div className="pill">Очки: {score}</div>
        </div>
        <div className="alias-card-box">
          <div className="alias-card">
            <h2>{word}</h2>
          </div>
        </div>
        <div className="alias-btns">
          <button className="a-no" onClick={() => { setLog(p => [...p, {w: word, ok: false}]); nextWord(); }}><X size={30}/></button>
          <button className="a-ok" onClick={() => { setScore(s => s + 1); setLog(p => [...p, {w: word, ok: true}]); nextWord(); }}><Check size={30}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="alias-wrap pop">
      <h2 className="title-res">ИТОГИ</h2>
      <div className="alias-log">
        {log.map((item, i) => (
          <div key={i} className={`log-row ${item.ok ? 'c-ok' : 'c-no'}`}>{item.w}</div>
        ))}
      </div>
      <button className="pop-btn" onClick={onBack}>ВЫЙТИ</button>
    </div>
  );
};

export default AliasGame;

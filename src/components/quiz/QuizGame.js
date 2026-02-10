import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './QuizGame.css';

// База вопросов
const CATEGORIES = {
  "Кино": [
    { q: "Кто сыграл Джека в 'Титанике'?", a: ["Брэд Питт", "Лео Ди Каприо", "Том Круз", "Джонни Депп"], c: 1 },
    { q: "В каком фильме была красная таблетка?", a: ["Начало", "Матрица", "Трон", "Обливион"], c: 1 }
  ],
  "Наука": [
    { q: "Какая планета самая большая?", a: ["Марс", "Земля", "Юпитер", "Сатурн"], c: 2 },
    { q: "Формула воды?", a: ["CO2", "H2O", "O2", "NaCl"], c: 1 }
  ],
  "Технологии": [
    { q: "Какая компания создала iPhone?", a: ["Samsung", "Apple", "Microsoft", "Google"], c: 1 },
    { q: "Первая криптовалюта?", a: ["Ether", "Dogecoin", "Bitcoin", "Litecoin"], c: 2 }
  ]
};

export default function QuizGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [step, setStep] = useState('setup'); // setup, pass, play, results
  const [settings, setSettings] = useState({ cat: "Кино", rounds: 3, time: 15 });
  const [players, setPlayers] = useState(["Игрок 1", "Игрок 2"]);
  const [scores, setScores] = useState({});
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Таймер обратного отсчета
  useEffect(() => {
    let timer;
    if (step === 'play' && timeLeft > 0 && !isLocked) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && !isLocked) {
      handleAnswer(null); // Авто-проигрыш при окончании времени
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isLocked]);

  // Запуск системы
  const initGame = () => {
    const initialScores = {};
    players.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setCurrentPlayerIdx(0);
    setCurrentRound(1);
    setTimeLeft(settings.time);
    setStep('pass');
  };

  // Обработка клика по ответу
  const handleAnswer = (idx) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelected(idx);

    const questions = CATEGORIES[settings.cat];
    const currentQ = questions[(currentRound - 1) % questions.length];

    // Если ответ верный — добавляем очко
    if (idx === currentQ.c) {
      setScores(prev => ({ ...prev, [players[currentPlayerIdx]]: prev[players[currentPlayerIdx]] + 1 }));
    }

    // Пауза, чтобы увидеть результат
    setTimeout(() => {
      if (currentPlayerIdx < players.length - 1) {
        setCurrentPlayerIdx(p => p + 1);
        setStep('pass');
      } else if (currentRound < settings.rounds) {
        setCurrentRound(r => r + 1);
        setCurrentPlayerIdx(0);
        setStep('pass');
      } else {
        setStep('results');
      }
      setSelected(null);
      setIsLocked(false);
      setTimeLeft(settings.time);
    }, 1200);
  };

  return (
    <div className="qz-wrapper">
      <button className="qz-exit" onClick={onBack}>TERMINATE</button>

      <AnimatePresence mode="wait">
        {/* 1. НАСТРОЙКИ */}
        {step === 'setup' && (
          <motion.div key="setup" className="qz-panel" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
            <h2 className="qz-neon-text">QUIZ SYSTEM</h2>
            <div className="qz-setup-grid">
              <label>DATA CATEGORY</label>
              <select value={settings.cat} onChange={(e)=>setSettings({...settings, cat: e.target.value})}>
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label>ROUNDS: {settings.rounds}</label>
              <input type="range" min="1" max="10" value={settings.rounds} 
                onChange={(e)=>setSettings({...settings, rounds: parseInt(e.target.value)})}/>

              <label>PLAYERS</label>
              <div className="qz-players-setup">
                {players.map((p, i) => (
                  <input key={i} className="qz-input-text" value={p} onChange={(e) => {
                    const n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                {players.length < 6 && (
                  <button className="qz-add-btn" onClick={()=>setPlayers([...players, `Игрок ${players.length+1}`])}>+</button>
                )}
              </div>
            </div>
            <button className="qz-btn-main" onClick={initGame}>BOOT GAME</button>
          </motion.div>
        )}

        {/* 2. ПЕРЕДАЧА ХОДА */}
        {step === 'pass' && (
          <motion.div key="pass" className="qz-panel qz-center" initial={{scale:0.8}} animate={{scale:1}} exit={{scale:1.2, opacity:0}}>
            <div className="qz-round-badge">ROUND {currentRound}</div>
            <p className="qz-label">PREPARE FOR SCAN:</p>
            <h2 className="qz-player-highlight">{players[currentPlayerIdx]}</h2>
            <button className="qz-btn-main" onClick={() => setStep('play')}>I AM READY</button>
          </motion.div>
        )}

        {/* 3. ВОПРОС */}
        {step === 'play' && (
          <motion.div key="play" className="qz-play-area" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="qz-info-bar">
              <span className="qz-p-name">{players[currentPlayerIdx]}</span>
              <div className="qz-timer-ring">{timeLeft}</div>
              <span className="qz-r-count">{currentRound}/{settings.rounds}</span>
            </div>

            <h2 className="qz-q-text">{CATEGORIES[settings.cat][(currentRound-1) % CATEGORIES[settings.cat].length].q}</h2>

            <div className="qz-grid-answers">
              {CATEGORIES[settings.cat][(currentRound-1) % CATEGORIES[settings.cat].length].a.map((ans, i) => {
                let cl = "";
                if (selected !== null) {
                   if (i === CATEGORIES[settings.cat][(currentRound-1) % CATEGORIES[settings.cat].length].c) cl = "correct";
                   else if (i === selected) cl = "wrong";
                }
                return (
                  <button key={i} className={`qz-ans-btn ${cl} ${selected === i ? 'sel' : ''}`} onClick={() => handleAnswer(i)}>
                    {ans}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 4. РЕЗУЛЬТАТЫ */}
        {step === 'results' && (
          <motion.div key="res" className="qz-panel" initial={{y:30}} animate={{y:0}}>
            <h2 className="qz-neon-text">FINAL SCORE</h2>
            <div className="qz-score-list">
              {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([name, sc], i) => (
                <div key={i} className="qz-score-item">
                  <span className="qz-rank">#{i+1}</span>
                  <span className="qz-name">{name}</span>
                  <b className="qz-pts">{sc} PTS</b>
                </div>
              ))}
            </div>
            <button className="qz-btn-main" onClick={() => setStep('setup')}>NEW CYCLE</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

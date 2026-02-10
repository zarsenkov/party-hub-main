import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuizGame.css';

// --- ДАННЫЕ (Можно расширить) ---
const CATEGORIES = {
  "Кино": [
    { q: "Кто сыграл Джека в 'Титанике'?", a: ["Брэд Питт", "Лео Ди Каприо", "Том Круз", "Джонни Депп"], c: 1 },
    { q: "В каком фильме была красная таблетка?", a: ["Начало", "Матрица", "Трон", "Обливион"], c: 1 }
  ],
  "Наука": [
    { q: "Какая планета самая большая?", a: ["Марс", "Земля", "Юпитер", "Сатурн"], c: 2 },
    { q: "Формула воды?", a: ["CO2", "H2O", "O2", "NaCl"], c: 1 }
  ]
};

export default function QuizGame({ onBack }) {
  // --- НАСТРОЙКИ ---
  const [step, setStep] = useState('setup'); // setup, pass, play, results
  const [settings, setSettings] = useState({ cat: "Кино", rounds: 2, time: 15 });
  const [players, setPlayers] = useState(["Игрок 1", "Игрок 2"]);
  
  // --- СОСТОЯНИЕ ИГРЫ ---
  const [scores, setScores] = useState({}); // { "Имя": очки }
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Таймер
  useEffect(() => {
    let timer;
    if (step === 'play' && timeLeft > 0 && !isLocked) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && !isLocked) {
      handleAnswer(null);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isLocked]);

  // Инициализация игры
  const initGame = () => {
    const s = {};
    players.forEach(p => s[p] = 0);
    setScores(s);
    setCurrentPlayerIdx(0);
    setCurrentRound(1);
    setTimeLeft(settings.time);
    setStep('pass');
  };

  // Обработка ответа
  const handleAnswer = (idx) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelected(idx);

    const questions = CATEGORIES[settings.cat];
    const currentQ = questions[(currentRound - 1) % questions.length];

    if (idx === currentQ.c) {
      setScores(prev => ({ ...prev, [players[currentPlayerIdx]]: prev[players[currentPlayerIdx]] + 1 }));
    }

    setTimeout(() => {
      if (currentPlayerIdx < players.length - 1) {
        // Следующий игрок в этом же раунде
        setCurrentPlayerIdx(p => p + 1);
        setStep('pass');
      } else if (currentRound < settings.rounds) {
        // Новый раунд, первый игрок
        setCurrentRound(r => r + 1);
        setCurrentPlayerIdx(0);
        setStep('pass');
      } else {
        // Финал
        setStep('results');
      }
      setSelected(null);
      setIsLocked(false);
      setTimeLeft(settings.time);
    }, 1000);
  };

  return (
    <div className="qz-wrapper">
      <button className="qz-exit" onClick={onBack}>BACK</button>

      <AnimatePresence mode="wait">
        {/* ЭКРАН 1: НАСТРОЙКИ */}
        {step === 'setup' && (
          <motion.div key="setup" className="qz-panel" initial={{opacity:0}} animate={{opacity:1}}>
            <h2 className="qz-neon-text">QUIZ CONFIG</h2>
            
            <div className="qz-setup-grid">
              <label>КАТЕГОРИЯ</label>
              <select onChange={(e)=>setSettings({...settings, cat: e.target.value})}>
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label>РАУНДЫ: {settings.rounds}</label>
              <input type="range" min="1" max="5" value={settings.rounds} 
                onChange={(e)=>setSettings({...settings, rounds: parseInt(e.target.value)})}/>

              <label>ИГРОКИ</label>
              <div className="qz-players-setup">
                {players.map((p, i) => (
                  <input key={i} value={p} onChange={(e) => {
                    const n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                <button className="qz-add-btn" onClick={()=>setPlayers([...players, `Игрок ${players.length+1}`])}>+</button>
              </div>
            </div>
            <button className="qz-btn-main" onClick={initGame}>START SYSTEM</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПЕРЕДАЧА ХОДА */}
        {step === 'pass' && (
          <motion.div key="pass" className="qz-panel qz-center" initial={{scale:0.8}} animate={{scale:1}}>
            <div className="qz-round-badge">РАУНД {currentRound}</div>
            <h3>ОЧЕРЕДЬ ИГРОКА:</h3>
            <h2 className="qz-player-highlight">{players[currentPlayerIdx]}</h2>
            <button className="qz-btn-main" onClick={() => setStep('play')}>ГОТОВ</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: ВОПРОС */}
        {step === 'play' && (
          <motion.div key="play" className="qz-play-area" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="qz-info-bar">
              <span>{players[currentPlayerIdx]}</span>
              <div className="qz-timer-ring">{timeLeft}</div>
              <span>{currentRound}/{settings.rounds}</span>
            </div>

            <h2 className="qz-q-text">{CATEGORIES[settings.cat][(currentRound-1)%CATEGORIES[settings.cat].length].q}</h2>

            <div className="qz-grid-answers">
              {CATEGORIES[settings.cat][(currentRound-1)%CATEGORIES[settings.cat].length].a.map((ans, i) => (
                <button 
                  key={i} 
                  className={`qz-ans-btn ${selected === i ? 'sel' : ''}`}
                  onClick={() => handleAnswer(i)}
                >
                  {ans}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 4: РЕЗУЛЬТАТЫ */}
        {step === 'results' && (
          <motion.div key="res" className="qz-panel" initial={{y:30}} animate={{y:0}}>
            <h2 className="qz-neon-text">FINAL SCORE</h2>
            <div className="qz-score-list">
              {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([name, sc], i) => (
                <div key={i} className="qz-score-item">
                  <span>{name}</span>
                  <b>{sc} PTS</b>
                </div>
              ))}
            </div>
            <button className="qz-btn-main" onClick={() => setStep('setup')}>РЕСТАРТ</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

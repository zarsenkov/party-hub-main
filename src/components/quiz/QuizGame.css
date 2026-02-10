import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './QuizGame.css';

// --- ДАННЫЕ ---
const QUIZ_CONTENT = {
  "Мифы": [
    { q: "Кто похитил огонь у богов?", a: ["Геракл", "Прометей", "Зевс", "Атлант"], c: 1 },
    { q: "Страж подземного мира?", a: ["Минотавр", "Цербер", "Гидра", "Сфинкс"], c: 1 }
  ],
  "Тайны": [
    { q: "Где находится Бермудский треугольник?", a: ["Атлантика", "Тихий океан", "Индийский", "Северный"], c: 0 },
    { q: "Какой город искал Шлиман?", a: ["Вавилон", "Троя", "Атлантида", "Помпеи"], c: 1 }
  ]
};

export default function QuizGame({ onBack }) {
  // Настройки
  const [view, setView] = useState('setup'); // setup, waiting, play, finish
  const [cfg, setCfg] = useState({ cat: "Мифы", rounds: 3, time: 15 });
  const [players, setPlayers] = useState(["Alpha", "Beta"]);
  
  // Игровой цикл
  const [scores, setScores] = useState({});
  const [pIndex, setPIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [seconds, setSeconds] = useState(15);
  const [activeIdx, setActiveIdx] = useState(null);
  const [locked, setLocked] = useState(false);

  // Живой таймер
  useEffect(() => {
    let t;
    if (view === 'play' && seconds > 0 && !locked) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && !locked) {
      handleStep(null);
    }
    return () => clearInterval(t);
  }, [view, seconds, locked]);

  const init = () => {
    const s = {};
    players.forEach(p => s[p] = 0);
    setScores(s);
    setPIndex(0);
    setRound(1);
    setSeconds(cfg.time);
    setView('waiting');
  };

  const handleStep = (idx) => {
    if (locked) return;
    setLocked(true);
    setActiveIdx(idx);

    const correct = QUIZ_CONTENT[cfg.cat][(round - 1) % QUIZ_CONTENT[cfg.cat].length].c;
    if (idx === correct) {
      setScores(prev => ({ ...prev, [players[pIndex]]: prev[players[pIndex]] + 1 }));
    }

    setTimeout(() => {
      setLocked(false);
      setActiveIdx(null);
      setSeconds(cfg.time);

      if (pIndex < players.length - 1) {
        setPIndex(i => i + 1);
        setView('waiting');
      } else if (round < cfg.rounds) {
        setRound(r => r + 1);
        setPIndex(0);
        setView('waiting');
      } else {
        setView('finish');
      }
    }, 1500);
  };

  return (
    <div className="bio-container">
      <div className="bio-blob-bg"></div>
      <button className="bio-exit-btn" onClick={onBack}>ABORT_CORE</button>

      <AnimatePresence mode="wait">
        {/* SETUP */}
        {view === 'setup' && (
          <motion.div key="s" className="bio-card" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}}>
            <h1 className="bio-header">EVO.<span>QUIZ</span></h1>
            
            <div className="bio-input-group">
              <label>GENETIC_PATH</label>
              <select onChange={(e) => setCfg({...cfg, cat: e.target.value})}>
                {Object.keys(QUIZ_CONTENT).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="bio-input-group">
              <label>CYCLES: {cfg.rounds}</label>
              <input type="range" min="1" max="5" value={cfg.rounds} onChange={(e) => setCfg({...cfg, rounds: e.target.value})} />
            </div>

            <div className="bio-input-group">
              <label>ORGANISMS</label>
              <div className="bio-players">
                {players.map((p, i) => (
                  <input key={i} value={p} onChange={(e) => {
                    let n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                {players.length < 4 && <button className="bio-add" onClick={() => setPlayers([...players, `User_${players.length+1}`])}>+</button>}
              </div>
            </div>

            <button className="bio-pulse-btn" onClick={init}>INITIATE EVOLUTION</button>
          </motion.div>
        )}

        {/* WAITING */}
        {view === 'waiting' && (
          <motion.div key="w" className="bio-card bio-center" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
            <div className="bio-round-info">CYCLE {round}</div>
            <p className="bio-sub">NEXT SUBJECT:</p>
            <h2 className="bio-player-name">{players[pIndex]}</h2>
            <button className="bio-pulse-btn" onClick={() => setView('play')}>CONNECT</button>
          </motion.div>
        )}

        {/* PLAY */}
        {view === 'play' && (
          <motion.div key="p" className="bio-play-zone" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="bio-hud">
              <div className="bio-timer-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="bio-timer-bg" />
                  <circle cx="50" cy="50" r="45" className="bio-timer-bar" 
                    style={{strokeDashoffset: 282 - (282 * seconds) / cfg.time}} />
                </svg>
                <span>{seconds}</span>
              </div>
              <div className="bio-hud-info">
                <strong>{players[pIndex]}</strong>
                <span>{round} / {cfg.rounds}</span>
              </div>
            </div>

            <h2 className="bio-question">{QUIZ_CONTENT[cfg.cat][(round - 1) % QUIZ_CONTENT[cfg.cat].length].q}</h2>

            <div className="bio-grid">
              {QUIZ_CONTENT[cfg.cat][(round - 1) % QUIZ_CONTENT[cfg.cat].length].a.map((ans, i) => {
                let state = "";
                if (activeIdx !== null) {
                  const corr = QUIZ_CONTENT[cfg.cat][(round - 1) % QUIZ_CONTENT[cfg.cat].length].c;
                  state = i === corr ? "bio-corr" : (i === activeIdx ? "bio-wrong" : "bio-fade");
                }
                return (
                  <button key={i} className={`bio-ans-btn ${state}`} onClick={() => handleStep(i)}>
                    {ans}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* FINISH */}
        {view === 'finish' && (
          <motion.div key="f" className="bio-card" initial={{scale:0.9}} animate={{scale:1}}>
            <h2 className="bio-header">MUTATION COMPLETE</h2>
            <div className="bio-results">
              {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([n, s], i) => (
                <div key={i} className="bio-res-item">
                  <span className="bio-res-name">{n}</span>
                  <span className="bio-res-score">{s} RNA</span>
                </div>
              ))}
            </div>
            <button className="bio-pulse-btn" onClick={() => setView('setup')}>RE-EVOLVE</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

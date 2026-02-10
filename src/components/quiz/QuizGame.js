import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './QuizGame.css';

// База вопросов (категории)
const DATA = {
  "Культура": [
    { q: "Кто написал 'Черный квадрат'?", a: ["Пикассо", "Малевич", "Кандинский", "Дали"], c: 1 },
    { q: "В какой стране находится Лувр?", a: ["Италия", "Германия", "Франция", "Испания"], c: 2 }
  ],
  "Космос": [
    { q: "Первая планета от Солнца?", a: ["Венера", "Марс", "Меркурий", "Земля"], c: 2 },
    { q: "Как называется наша галактика?", a: ["Андромеда", "Млечный Путь", "Орион", "Сириус"], c: 1 }
  ]
};

export default function QuizGame({ onBack }) {
  // --- СОСТОЯНИЕ ---
  const [view, setView] = useState('menu'); // menu, lobby, play, finish
  const [config, setConfig] = useState({ cat: "Культура", rounds: 3, time: 20 });
  const [players, setPlayers] = useState(["Игрок 1", "Игрок 2"]);
  const [scores, setScores] = useState({});
  const [turn, setTurn] = useState(0); // индекс текущего игрока
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(20);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [lock, setLock] = useState(false);

  // Таймер логика
  useEffect(() => {
    let interval;
    if (view === 'play' && timer > 0 && !lock) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !lock) {
      submitAnswer(null);
    }
    return () => clearInterval(interval);
  }, [view, timer, lock]);

  // Запуск игры
  const startAction = () => {
    const s = {};
    players.forEach(p => s[p] = 0);
    setScores(s);
    setTurn(0);
    setRound(1);
    setTimer(config.time);
    setView('lobby');
  };

  // Проверка ответа
  const submitAnswer = (idx) => {
    if (lock) return;
    setLock(true);
    setAnswerIdx(idx);

    const correct = DATA[config.cat][(round - 1) % DATA[config.cat].length].c;
    if (idx === correct) {
      setScores(prev => ({ ...prev, [players[turn]]: prev[players[turn]] + 1 }));
    }

    setTimeout(() => {
      setLock(false);
      setAnswerIdx(null);
      setTimer(config.time);

      if (turn < players.length - 1) {
        setTurn(t => t + 1);
        setView('lobby');
      } else if (round < config.rounds) {
        setRound(r => r + 1);
        setTurn(0);
        setView('lobby');
      } else {
        setView('finish');
      }
    }, 1500);
  };

  return (
    <div className="art-wrapper">
      <button className="art-back" onClick={onBack}>← ВЫХОД</button>

      <AnimatePresence mode="wait">
        {/* ЭКРАН 1: НАСТРОЙКИ */}
        {view === 'menu' && (
          <motion.div key="menu" className="art-card" initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -20, opacity: 0}}>
            <h1 className="art-title">QUIZ.<span>ED</span></h1>
            
            <div className="art-field">
              <label>ТЕМА</label>
              <select onChange={(e) => setConfig({...config, cat: e.target.value})}>
                {Object.keys(DATA).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="art-field">
              <label>РАУНДЫ: {config.rounds}</label>
              <input type="range" min="1" max="5" value={config.rounds} onChange={(e) => setConfig({...config, rounds: e.target.value})} />
            </div>

            <div className="art-field">
              <label>УЧАСТНИКИ</label>
              <div className="art-players-list">
                {players.map((p, i) => (
                  <input key={i} value={p} onChange={(e) => {
                    let n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                {players.length < 4 && <button className="art-plus" onClick={() => setPlayers([...players, `Игрок ${players.length+1}`])}>+</button>}
              </div>
            </div>

            <button className="art-btn-black" onClick={startAction}>СОЗДАТЬ СЕССИЮ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ЛОББИ / ПЕРЕДАЧА */}
        {view === 'lobby' && (
          <motion.div key="lobby" className="art-card art-center" initial={{scale: 0.9}} animate={{scale: 1}} exit={{opacity: 0}}>
            <div className="art-badge">РАУНД {round}</div>
            <p className="art-pre">СЛЕДУЮЩИЙ ИГРОК:</p>
            <h2 className="art-hero-name">{players[turn]}</h2>
            <button className="art-btn-black" onClick={() => setView('play')}>НАЧАТЬ</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: ИГРА */}
        {view === 'play' && (
          <motion.div key="play" className="art-play-container" initial={{opacity: 0}} animate={{opacity: 1}}>
            <div className="art-top-nav">
              <div className="art-timer-line" style={{width: `${(timer/config.time)*100}%`}}></div>
              <div className="art-meta">
                <span>{players[turn]}</span>
                <span>{round}/{config.rounds}</span>
              </div>
            </div>

            <h2 className="art-q">{DATA[config.cat][(round - 1) % DATA[config.cat].length].q}</h2>

            <div className="art-grid">
              {DATA[config.cat][(round - 1) % DATA[config.cat].length].a.map((ans, i) => {
                let state = "";
                if (answerIdx !== null) {
                  const correct = DATA[config.cat][(round - 1) % DATA[config.cat].length].c;
                  state = i === correct ? "art-correct" : (i === answerIdx ? "art-wrong" : "art-dim");
                }
                return (
                  <button key={i} className={`art-ans ${state}`} onClick={() => submitAnswer(i)}>
                    {ans}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 4: ИТОГИ */}
        {view === 'finish' && (
          <motion.div key="finish" className="art-card" initial={{y: 20}} animate={{y: 0}}>
            <h2 className="art-title">ИТОГИ</h2>
            <div className="art-results">
              {Object.entries(scores).sort((a,b) => b[1]-a[1]).map(([n, s], i) => (
                <div key={i} className="art-res-row">
                  <span className="art-n">{n}</span>
                  <span className="art-s">{s} PTS</span>
                </div>
              ))}
            </div>
            <button className="art-btn-black" onClick={() => setView('menu')}>РЕСТАРТ</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

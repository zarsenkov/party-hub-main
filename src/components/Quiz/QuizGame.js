import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './QuizGame.css';

// --- БАЗА ЗНАНИЙ (Добавляй свои вопросы сюда) ---
const QUESTIONS_DB = {
  "Мультфильмы": [
    { q: "Как зовут жёлтую губку, живущую на дне океана?", a: ["Патрик", "Спанч Боб", "Сквидвард", "Гэри"], c: 1 },
    { q: "Что любит есть Винни-Пух?", a: ["Пиццу", "Варенье", "Мёд", "Морковку"], c: 2 },
    { q: "Кто самый быстрый в мире?", a: ["Молния Маккуин", "Мэтр", "Салли", "Шериф"], c: 0 }
  ],
  "Еда": [
    { q: "Из чего делают чипсы?", a: ["Из муки", "Из картофеля", "Из яблок", "Из сыра"], c: 1 },
    { q: "Какой фрукт называют королём цитрусовых?", a: ["Лимон", "Апельсин", "Грейпфрут", "Помело"], c: 1 }
  ],
  "Животные": [
    { q: "Какое животное самое высокое?", a: ["Слон", "Жираф", "Страус", "Бегемот"], c: 1 },
    { q: "Кто спит вниз головой?", a: ["Сова", "Ленивец", "Летучая мышь", "Коала"], c: 2 }
  ]
};

export default function QuizGame({ onBack }) {
  // --- НАСТРОЙКИ ---
  const [step, setStep] = useState('setup'); // setup, waiting, play, finish
  const [config, setConfig] = useState({ cat: "Мультфильмы", rounds: 3, time: 15 });
  const [players, setPlayers] = useState(["Игрок 1", "Игрок 2"]);
  
  // --- СОСТОЯНИЕ ИГРЫ ---
  const [scores, setScores] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(15);
  const [ansActive, setAnsActive] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    let interval;
    if (step === 'play' && timer > 0 && !isLocked) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !isLocked) {
      handleAnswer(null); // Время вышло
    }
    return () => clearInterval(interval);
  }, [step, timer, isLocked]);

  // --- СТАРТ ИГРЫ ---
  const startReady = () => {
    const s = {};
    players.forEach(p => s[p] = 0);
    setScores(s);
    setCurrentPlayer(0);
    setRound(1);
    setTimer(config.time);
    setStep('waiting');
  };

  // --- ОБРАБОТКА ОТВЕТА ---
  const handleAnswer = (idx) => {
    if (isLocked) return;
    setIsLocked(true);
    setAnsActive(idx);

    const correct = QUESTIONS_DB[config.cat][(round - 1) % QUESTIONS_DB[config.cat].length].c;
    if (idx === correct) {
      setScores(prev => ({ ...prev, [players[currentPlayer]]: prev[players[currentPlayer]] + 1 }));
    }

    setTimeout(() => {
      setIsLocked(false);
      setAnsActive(null);
      setTimer(config.time);

      if (currentPlayer < players.length - 1) {
        setCurrentPlayer(c => c + 1);
        setStep('waiting');
      } else if (round < config.rounds) {
        setRound(r => r + 1);
        setCurrentPlayer(0);
        setStep('waiting');
      } else {
        setStep('finish');
      }
    }, 1500);
  };

  return (
    <div className="cosmic-container">
      <button className="cosmic-back" onClick={onBack}>ВЫЙТИ</button>

      <AnimatePresence mode="wait">
        {/* ЭКРАН 1: НАСТРОЙКИ */}
        {step === 'setup' && (
          <motion.div key="s" className="cosmic-card" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>
            <h1 className="cosmic-logo">МЕГА<span>КВИЗ</span></h1>
            
            <div className="cosmic-field">
              <label>ВЫБЕРИ ТЕМУ</label>
              <select onChange={(e) => setConfig({...config, cat: e.target.value})}>
                {Object.keys(QUESTIONS_DB).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="cosmic-field">
              <label>РАУНДОВ: {config.rounds}</label>
              <input type="range" min="1" max="10" value={config.rounds} onChange={(e) => setConfig({...config, rounds: e.target.value})} />
            </div>

            <div className="cosmic-field">
              <label>КТО ИГРАЕТ?</label>
              <div className="cosmic-player-inputs">
                {players.map((p, i) => (
                  <input key={i} value={p} onChange={(e) => {
                    let n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                {players.length < 5 && <button className="cosmic-add" onClick={() => setPlayers([...players, `Игрок ${players.length+1}`])}>+</button>}
              </div>
            </div>

            <button className="cosmic-main-btn" onClick={startReady}>ПОЕХАЛИ!</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ОЖИДАНИЕ ИГРОКА */}
        {step === 'waiting' && (
          <motion.div key="w" className="cosmic-card cosmic-center" initial={{y: 100}} animate={{y: 0}}>
            <div className="cosmic-round-info">РАУНД {round}</div>
            <p className="cosmic-label">ПРИГОТОВИТЬСЯ:</p>
            <h2 className="cosmic-player-target">{players[currentPlayer]}</h2>
            <button className="cosmic-main-btn pulse" onClick={() => setStep('play')}>Я ТУТ!</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: ВОПРОС */}
        {step === 'play' && (
          <motion.div key="p" className="cosmic-play-zone" initial={{opacity:0}} animate={{opacity:1}}>
            <div className="cosmic-hud">
              <div className="cosmic-timer">{timer}</div>
              <div className="cosmic-stats">
                <strong>{players[currentPlayer]}</strong>
                <span>{round} / {config.rounds}</span>
              </div>
            </div>

            <div className="cosmic-q-bubble">
              {QUESTIONS_DB[config.cat][(round - 1) % QUESTIONS_DB[config.cat].length].q}
            </div>

            <div className="cosmic-grid">
              {QUESTIONS_DB[config.cat][(round - 1) % QUESTIONS_DB[config.cat].length].a.map((ans, i) => {
                let status = "";
                if (ansActive !== null) {
                  const corr = QUESTIONS_DB[config.cat][(round - 1) % QUESTIONS_DB[config.cat].length].c;
                  status = i === corr ? "correct" : (i === ansActive ? "wrong" : "dim");
                }
                return (
                  <button key={i} className={`cosmic-ans-btn ${status}`} onClick={() => handleAnswer(i)}>
                    {ans}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 4: ФИНАЛ */}
        {step === 'finish' && (
          <motion.div key="f" className="cosmic-card" initial={{scale:0}} animate={{scale:1}}>
            <h2 className="cosmic-logo">ЗАВЕРШЕНО!</h2>
            <div className="cosmic-results">
              {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([n, s], i) => (
                <div key={i} className="cosmic-res-item">
                  <span className="cosmic-res-rank">#{i+1}</span>
                  <span className="cosmic-res-name">{n}</span>
                  <b className="cosmic-res-score">{s} ОЧКОВ</b>
                </div>
              ))}
            </div>
            <button className="cosmic-main-btn" onClick={() => setStep('setup')}>НОВАЯ ИГРА</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

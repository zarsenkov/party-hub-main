import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем "мягкие" стили
import './GuessWhoGame.css';

// --- БАЗА СЛОВ ---
const WORDS = {
  "Профессии": ["Врач", "Космонавт", "Повар", "Пират", "Детектив"],
  "Животные": ["Жираф", "Пингвин", "Хомяк", "Акула", "Кенгуру"],
  "Предметы": ["Тостер", "Зонтик", "Гитара", "Кактус", "Фонарик"]
};

export default function GuessWhoGame({ onBack }) {
  // // Инициализация состояний
  const [view, setView] = useState('menu'); 
  const [cfg, setCfg] = useState({ cat: "Животные", time: 40 });
  const [players, setPlayers] = useState(["Ник", "Алекс"]);
  const [scores, setScores] = useState({});
  const [pIdx, setPIdx] = useState(0);
  const [timer, setTimer] = useState(40);
  const [word, setWord] = useState("");

  // // Логика таймера
  useEffect(() => {
    let interval;
    if (view === 'play' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && view === 'play') {
      next(false);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  // // Запуск игры
  const start = () => {
    const s = {};
    players.forEach(p => s[p] = 0);
    setScores(s);
    setPIdx(0);
    newWord();
    setView('play');
  };

  // // Выдача нового слова
  const newWord = () => {
    const list = WORDS[cfg.cat];
    setWord(list[Math.floor(Math.random() * list.length)]);
    setTimer(cfg.time);
  };

  // // Переход хода
  const next = (win) => {
    if (win) {
      setScores(prev => ({ ...prev, [players[pIdx]]: prev[players[pIdx]] + 1 }));
    }
    if (pIdx < players.length - 1) {
      setPIdx(pIdx + 1);
      newWord();
    } else {
      setView('end');
    }
  };

  return (
    <div className="clay-container">
      <button className="clay-back" onClick={onBack}>← НАЗАД</button>

      <AnimatePresence mode="wait">
        {/* МЕНЮ */}
        {view === 'menu' && (
          <motion.div key="m" className="clay-card" initial={{scale: 0.8}} animate={{scale: 1}}>
            <h1 className="clay-title">КТО <span>Я?</span></h1>
            
            <div className="clay-field">
              <label>ЧТО ОТГАДЫВАЕМ?</label>
              <select onChange={(e) => setCfg({...cfg, cat: e.target.value})}>
                {Object.keys(WORDS).map(k => <option key={k}>{k}</option>)}
              </select>
            </div>

            <div className="clay-field">
              <label>ИГРОКИ</label>
              <div className="clay-p-list">
                {players.map((p, i) => (
                  <input key={i} value={p} onChange={(e) => {
                    let n = [...players]; n[i] = e.target.value; setPlayers(n);
                  }} />
                ))}
                <button className="clay-add" onClick={() => setPlayers([...players, "Новый"])}>+</button>
              </div>
            </div>

            <button className="clay-btn-primary" onClick={start}>ИГРАТЬ</button>
          </motion.div>
        )}

        {/* ИГРА */}
        {view === 'play' && (
          <motion.div key="p" className="clay-game" initial={{y: 50}} animate={{y: 0}}>
            <div className="clay-header">
              <div className="clay-badge">{players[pIdx]}</div>
              <div className="clay-timer">{timer}</div>
            </div>

            <div className="clay-word-box">
              <h2>{word}</h2>
              <p>Держи телефон у лба!</p>
            </div>

            <div className="clay-actions">
              <button className="clay-btn-no" onClick={() => next(false)}>Мимо</button>
              <button className="clay-btn-yes" onClick={() => next(true)}>Угадал!</button>
            </div>
          </motion.div>
        )}

        {/* ИТОГИ */}
        {view === 'end' && (
          <motion.div key="e" className="clay-card" initial={{scale: 0.5}} animate={{scale: 1}}>
            <h2 className="clay-title">ИТОГИ</h2>
            {Object.entries(scores).map(([n, s]) => (
              <div key={n} className="clay-res-row">
                <span>{n}</span>
                <strong>{s}</strong>
              </div>
            ))}
            <button className="clay-btn-primary" onClick={() => setView('menu')}>ЕЩЁ РАЗ</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

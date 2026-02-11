import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ALIAS_DATA } from './words';
import './AliasGame.css';

export default function AliasGame({ onBack }) {
  const [phase, setPhase] = useState('setup'); 
  const [teams, setTeams] = useState([
    { id: 1, name: 'Тролли', score: 0 },
    { id: 2, name: 'Обезьяны', score: 0 }
  ]);
  const [settings, setSettings] = useState({ 
    time: 60, 
    rounds: 5, 
    categories: ['standard'] 
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [roundResults, setRoundResults] = useState([]);

  // --- ЛОГИКА ---
  const toggleCategory = (key) => {
    setSettings(prev => {
      const isSelected = prev.categories.includes(key);
      if (isSelected && prev.categories.length > 1) {
        return { ...prev, categories: prev.categories.filter(c => c !== key) };
      } else if (!isSelected) {
        return { ...prev, categories: [...prev.categories, key] };
      }
      return prev;
    });
  };

  const getRandomWord = () => {
    const pool = settings.categories.flatMap(cat => ALIAS_DATA[cat].words);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startRound = () => {
    setPhase('game');
    setTimeLeft(settings.time);
    setRoundResults([]);
    setCurrentWord(getRandomWord());
  };

  useEffect(() => {
    let interval;
    if (phase === 'game' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && phase === 'game') {
      setPhase('summary');
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const handleAction = (isCorrect) => {
    setRoundResults(prev => [...prev, { word: currentWord, status: isCorrect ? 'ok' : 'skip' }]);
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 40 : 20);
    setCurrentWord(getRandomWord());
  };

  const applyScores = () => {
    const correctCount = roundResults.filter(r => r.status === 'ok').length;
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += correctCount;
    setTeams(newTeams);

    if (currentTeamIdx < teams.length - 1) {
      setCurrentTeamIdx(currentTeamIdx + 1);
      setPhase('ready');
    } else {
      if (currentRound >= settings.rounds) {
        setPhase('victory');
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentTeamIdx(0);
        setPhase('ready');
      }
    }
  };

  const resetToSettings = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setCurrentRound(1);
    setCurrentTeamIdx(0);
    setPhase('setup');
  };

  // --- ЭКРАНЫ ---

  if (phase === 'setup') {
    return (
      <div className="alias-full-app">
        <button className="alias-close-btn" onClick={onBack}>✕</button>
        <h1 className="alias-main-title">НАСТРОЙКИ</h1>
        
        <div className="alias-scroll-content">
          <button className="alias-btn-special" onClick={() => alert("Онлайн скоро!")}>ИГРАТЬ ОНЛАЙН 🌐</button>

          <div className="alias-white-card">
            <label className="alias-mini-label">КОМАНДЫ</label>
            {teams.map(t => (
              <div key={t.id} className="alias-input-wrapper">
                <input className="alias-field" value={t.name} onChange={(e) => setTeams(teams.map(tm => tm.id === t.id ? {...tm, name: e.target.value} : tm))} />
                {teams.length > 2 && <button className="alias-btn-delete" onClick={() => setTeams(teams.filter(tm => tm.id !== t.id))}>✕</button>}
              </div>
            ))}
            {teams.length < 6 && <button className="alias-btn-add-team" onClick={() => setTeams([...teams, {id: Date.now(), name: `Команда ${teams.length+1}`, score: 0}])}>+ ДОБАВИТЬ</button>}
          </div>

          <div className="alias-white-card">
            <label className="alias-mini-label">КАТЕГОРИИ</label>
            <div className="alias-grid-cats">
              {Object.keys(ALIAS_DATA).map(key => (
                <button 
                  key={key} 
                  className={`alias-cat-pill ${settings.categories.includes(key) ? 'active' : ''}`}
                  onClick={() => toggleCategory(key)}
                >
                  {ALIAS_DATA[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="alias-white-card">
            <label className="alias-mini-label">РАУНДЫ: {settings.rounds} | ВРЕМЯ: {settings.time}с</label>
            <input type="range" className="alias-range" min="1" max="10" value={settings.rounds} onChange={e => setSettings({...settings, rounds: Number(e.target.value)})} />
            <div style={{height: '15px'}}></div>
            <input type="range" className="alias-range" min="10" max="90" step="10" value={settings.time} onChange={e => setSettings({...settings, time: Number(e.target.value)})} />
          </div>
        </div>

        <button className="alias-btn-giant" onClick={() => setPhase('ready')}>ПОЕХАЛИ</button>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="alias-full-app">
        <button className="alias-close-btn" onClick={() => setPhase('setup')}>✕</button>
        <div className="alias-ready-header">РАУНД {currentRound}/{settings.rounds}</div>
        
        <div className="alias-score-container">
          {teams.map((t, idx) => (
            <div key={t.id} className={`alias-score-row ${idx === currentTeamIdx ? 'active' : ''}`}>
              <span>{t.name}</span>
              <b>{t.score}</b>
            </div>
          ))}
        </div>

        <div className="alias-ready-msg">
          <p>ПРИГОТОВИТЬСЯ:</p>
          <h2>{teams[currentTeamIdx].name}</h2>
        </div>

        <button className="alias-btn-giant" onClick={startRound}>Я ГОТОВ</button>
      </div>
    );
  }

  if (phase === 'game') {
    return (
      <div className="alias-full-app" style={{background: '#fff'}}>
        <button className="alias-close-btn" onClick={() => { if(window.confirm("Выйти в настройки?")) setPhase('setup') }}>✕</button>
        
        <div className="alias-game-hud">
          <div className="alias-timer-box">{timeLeft}</div>
          <div className="alias-hud-text">
            <b>{teams[currentTeamIdx].name}</b>
            <small>РАУНД {currentRound}</small>
          </div>
        </div>

        <div className="alias-card-viewport">
          <SwipeCard key={currentWord} word={currentWord} onResult={handleAction} />
        </div>

        <div className="alias-game-footer">
          <button className="alias-btn-action skip" onClick={() => handleAction(false)}>ПРОПУСТИТЬ</button>
          <button className="alias-btn-action ok" onClick={() => handleAction(true)}>УГАДАЛ</button>
        </div>
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div className="alias-full-app">
        <h1 className="alias-main-title">ИТОГИ ХОДА</h1>
        <div className="alias-summary-total">+{roundResults.filter(r => r.status === 'ok').length}</div>
        <div className="alias-summary-list">
          {roundResults.map((res, i) => (
            <div key={i} className={`alias-summary-item ${res.status}`} onClick={() => {
                const upd = [...roundResults];
                upd[i].status = upd[i].status === 'ok' ? 'skip' : 'ok';
                setRoundResults(upd);
            }}>
              <span>{res.word}</span>
              <div className="alias-dot-status"></div>
            </div>
          ))}
        </div>
        <button className="alias-btn-giant" onClick={applyScores}>ДАЛЕЕ</button>
      </div>
    );
  }

  if (phase === 'victory') {
    const winner = [...teams].sort((a,b) => b.score - a.score)[0];
    return (
      <div className="alias-full-app">
        <div className="alias-victory-box">
          <div className="alias-cup">🏆</div>
          <h1 className="alias-main-title">ФИНАЛ</h1>
          <h2 className="alias-winner-name">{winner.name}</h2>
          <p className="alias-winner-score">{winner.score} ОЧКОВ</p>
          <button className="alias-btn-giant" style={{marginTop: '40px'}} onClick={resetToSettings}>В НАСТРОЙКИ</button>
        </div>
      </div>
    );
  }

  return null;
}

function SwipeCard({ word, onResult }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-25, 25]);
  const background = useTransform(x, [-120, 0, 120], ["#FF6B6B", "#FFFFFF", "#26DE81"]);

  return (
    <div className="alias-card-wrapper">
       <div className="alias-card-hint h-left">ПАС</div>
       <div className="alias-card-hint h-right">ОК</div>
       <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, background }}
        onDragEnd={(_, info) => {
            if (info.offset.x > 80) onResult(true);
            else if (info.offset.x < -80) onResult(false);
        }}
        className="alias-main-card"
        >
        {word}
        </motion.div>
    </div>
  );
}
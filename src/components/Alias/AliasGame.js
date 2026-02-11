import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ALIAS_DATA } from './words';
import './AliasGame.css';

export default function AliasGame({ onBack }) {
  const [phase, setPhase] = useState('setup'); // setup, ready, game, summary, victory
  const [teams, setTeams] = useState([
    { id: 1, name: 'Тролли', score: 0 },
    { id: 2, name: 'Обезьяны', score: 0 }
  ]);
  const [settings, setSettings] = useState({ 
    time: 60, 
    rounds: 5, 
    categories: ['standard'] // Массив для нескольких категорий
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [roundResults, setRoundResults] = useState([]);

  // --- ЛОГИКА ---
  
  const toggleCategory = (key) => {
    setSettings(prev => {
      const current = prev.categories;
      if (current.includes(key)) {
        if (current.length === 1) return prev; // Оставляем хотя бы одну
        return { ...prev, categories: current.filter(c => c !== key) };
      } else {
        return { ...prev, categories: [...current, key] };
      }
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

  const restartFull = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setCurrentRound(1);
    setCurrentTeamIdx(0);
    setPhase('setup');
  };

  // --- ЭКРАНЫ ---

  if (phase === 'setup') {
    return (
      <div className="alias-fixed-overlay">
        <div className="alias-top-bar">
           <span className="alias-brand">ALIAS NEO</span>
           <button className="alias-exit-circle" onClick={onBack}>✕</button>
        </div>
        
        <div className="alias-setup-body">
          <div className="alias-card">
            <span className="alias-label">КОМАНДЫ</span>
            {teams.map(t => (
              <div key={t.id} className="alias-input-row">
                <input className="alias-input" value={t.name} onChange={(e) => setTeams(teams.map(tm => tm.id === t.id ? {...tm, name: e.target.value} : tm))} />
                {teams.length > 2 && <button className="alias-btn-del" onClick={() => setTeams(teams.filter(tm => tm.id !== t.id))}>✕</button>}
              </div>
            ))}
            {teams.length < 6 && <button className="alias-btn-add" onClick={() => setTeams([...teams, {id: Date.now(), name: `Команда ${teams.length+1}`, score: 0}])}>+ Добавить</button>}
          </div>

          <div className="alias-card">
            <span className="alias-label">КАТЕГОРИИ (МОЖНО НЕСКОЛЬКО)</span>
            <div className="alias-cat-grid">
              {Object.keys(ALIAS_DATA).map(key => (
                <button 
                  key={key} 
                  className={`alias-cat-item ${settings.categories.includes(key) ? 'active' : ''}`}
                  onClick={() => toggleCategory(key)}
                >
                  {ALIAS_DATA[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="alias-card">
            <span className="alias-label">РАУНДЫ: {settings.rounds} | ВРЕМЯ: {settings.time}с</span>
            <input type="range" min="1" max="10" value={settings.rounds} onChange={e => setSettings({...settings, rounds: Number(e.target.value)})} />
            <div style={{marginTop:'15px'}}></div>
            <input type="range" min="10" max="90" step="10" value={settings.time} onChange={e => setSettings({...settings, time: Number(e.target.value)})} />
          </div>
        </div>

        <button className="alias-primary-btn" onClick={() => setPhase('ready')}>ПОЕХАЛИ</button>
      </div>
    );
  }

  if (phase === 'ready') {
    return (
      <div className="alias-fixed-overlay">
        <div className="alias-top-bar">
           <div className="alias-round-badge">РАУНД {currentRound}/{settings.rounds}</div>
           <button className="alias-exit-circle" onClick={() => setPhase('setup')}>✕</button>
        </div>
        
        <div className="alias-score-list">
          {teams.map((t, idx) => (
            <div key={t.id} className={`alias-team-row ${idx === currentTeamIdx ? 'active' : ''}`}>
              <span>{t.name}</span>
              <span>{t.score}</span>
            </div>
          ))}
        </div>

        <div className="alias-ready-center">
          <p>ОЧЕРЕДЬ КОМАНДЫ:</p>
          <h2>{teams[currentTeamIdx].name}</h2>
        </div>

        <button className="alias-primary-btn" onClick={startRound}>Я ГОТОВ</button>
      </div>
    );
  }

  if (phase === 'game') {
    return (
      <div className="alias-fixed-overlay game-phase">
        <div className="alias-top-bar">
           <div className="alias-timer-pill">{timeLeft}</div>
           <div className="alias-round-info">{teams[currentTeamIdx].name}</div>
           <button className="alias-exit-circle" onClick={() => { if(window.confirm("Выйти?")) setPhase('setup') }}>✕</button>
        </div>

        <div className="alias-card-container">
          <SwipeCard key={currentWord} word={currentWord} onResult={handleAction} />
        </div>

        <div className="alias-game-footer">
          <button className="alias-action-btn skip" onClick={() => handleAction(false)}>ПАС</button>
          <button className="alias-action-btn done" onClick={() => handleAction(true)}>ОК</button>
        </div>
      </div>
    );
  }

  if (phase === 'summary' || phase === 'victory') {
    // Логика результатов та же, но в конце victory -> restartFull()
    if (phase === 'summary') {
        return (
          <div className="alias-fixed-overlay">
            <h1 className="alias-title">ИТОГИ ХОДА</h1>
            <div className="alias-summary-val">+{roundResults.filter(r => r.status === 'ok').length}</div>
            <div className="alias-res-list">
              {roundResults.map((res, i) => (
                <div key={i} className={`alias-res-item ${res.status}`} onClick={() => {
                    const upd = [...roundResults];
                    upd[i].status = upd[i].status === 'ok' ? 'skip' : 'ok';
                    setRoundResults(upd);
                }}>
                  <span>{res.word}</span>
                  <div className="alias-status-dot"></div>
                </div>
              ))}
            </div>
            <button className="alias-primary-btn" onClick={applyScores}>ДАЛЕЕ</button>
          </div>
        );
    }
    
    const winner = [...teams].sort((a,b) => b.score - a.score)[0];
    return (
      <div className="alias-fixed-overlay">
        <div className="alias-victory-box clay-card">
          <div style={{fontSize:'60px'}}>🏆</div>
          <h1 className="alias-title">ПОБЕДИТЕЛИ</h1>
          <h2 style={{fontSize:'32px'}}>{winner.name}</h2>
          <p>{winner.score} ОЧКОВ</p>
        </div>
        <button className="alias-primary-btn" onClick={restartFull}>В НАСТРОЙКИ</button>
      </div>
    );
  }

  return null;
}

function SwipeCard({ word, onResult }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-25, 25]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);
  const borderColor = useTransform(x, [-100, 0, 100], ["#FF6B6B", "#000000", "#26DE81"]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity, borderColor }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) onResult(true);
        else if (info.offset.x < -80) onResult(false);
      }}
      className="alias-swipe-card"
    >
      <div className="alias-word-text">{word}</div>
      <div className="alias-hints-static">
        <span className="h-pas">← ПАС</span>
        <span className="h-ok">ОК →</span>
      </div>
    </motion.div>
  );
}
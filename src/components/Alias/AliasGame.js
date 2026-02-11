import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ALIAS_DATA } from './words';
import './AliasGame.css';

export default function AliasGame({ onBack }) {
  // --- СОСТОЯНИЕ ---
  const [phase, setPhase] = useState('setup'); // setup, ready, game, summary, victory
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда 1', score: 0 },
    { id: 2, name: 'Команда 2', score: 0 }
  ]);
  const [settings, setSettings] = useState({ 
    time: 60, 
    rounds: 5, 
    category: 'standard' 
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [roundResults, setRoundResults] = useState([]); 

  // --- ФУНКЦИИ УПРАВЛЕНИЯ ---
  const updateTeamName = (id, name) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name } : t));
  };
  
  const addTeam = () => {
    if (teams.length < 6) {
      setTeams([...teams, { id: Date.now(), name: `Команда ${teams.length + 1}`, score: 0 }]);
    }
  };

  const removeTeam = (id) => {
    if (teams.length > 2) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleOnlineClick = () => {
    alert("🌐 ОНЛАЙН-РЕЖИМ\n\nСкоро! Вы сможете играть с друзьями через интернет.");
  };

  const getRandomWord = () => {
    const pool = ALIAS_DATA[settings.category].words;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startRound = () => {
    setPhase('game');
    setTimeLeft(settings.time);
    setRoundResults([]);
    setCurrentWord(getRandomWord());
  };

  // Таймер
  useEffect(() => {
    let interval;
    if (phase === 'game' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase === 'game') {
      setPhase('summary');
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  // Свайп или кнопка
  const handleAction = (isCorrect) => {
    const status = isCorrect ? 'ok' : 'skip';
    setRoundResults((prev) => [...prev, { word: currentWord, status }]);
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 50 : 20);
    setCurrentWord(getRandomWord());
  };

  const toggleResult = (idx) => {
    const updated = [...roundResults];
    updated[idx].status = updated[idx].status === 'ok' ? 'skip' : 'ok';
    setRoundResults(updated);
  };

  const applyScores = () => {
    const correctCount = roundResults.filter(r => r.status === 'ok').length;
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += correctCount;
    setTeams(newTeams);

    // Смена хода
    if (currentTeamIdx < teams.length - 1) {
      setCurrentTeamIdx(currentTeamIdx + 1);
      setPhase('ready');
    } else {
      // Конец раунда
      if (currentRound >= settings.rounds) {
        setPhase('victory');
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentTeamIdx(0);
        setPhase('ready');
      }
    }
  };

  // --- ЭКРАНЫ ---

  // 1. SETUP
  if (phase === 'setup') {
    return (
      <div className="alias-fixed-overlay">
        <button className="alias-exit-btn" onClick={onBack}>✕</button>
        <h1 className="alias-title">НАСТРОЙКИ</h1>
        
        <div className="alias-setup-body">
          <button className="alias-online-btn" onClick={handleOnlineClick}>ИГРАТЬ ОНЛАЙН 🌐</button>

          <div className="alias-card">
            <span className="alias-label">КОМАНДЫ</span>
            {teams.map(t => (
              <div key={t.id} className="alias-input-row">
                <input className="alias-input" value={t.name} onChange={(e) => updateTeamName(t.id, e.target.value)} />
                {teams.length > 2 && <button className="alias-btn-del" onClick={() => removeTeam(t.id)}>✕</button>}
              </div>
            ))}
            {teams.length < 6 && <button className="alias-btn-add" onClick={addTeam}>+ Добавить команду</button>}
          </div>

          <div className="alias-card">
            <span className="alias-label">КАТЕГОРИЯ</span>
            <div className="alias-cat-grid">
              {Object.keys(ALIAS_DATA).map(key => (
                <button 
                  key={key} 
                  className={`alias-cat-item ${settings.category === key ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, category: key})}
                >
                  {ALIAS_DATA[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="alias-card">
            <span className="alias-label">РАУНДЫ: {settings.rounds}</span>
            <input type="range" min="1" max="10" value={settings.rounds} onChange={e => setSettings({...settings, rounds: Number(e.target.value)})} />
            <span className="alias-label" style={{marginTop:'15px'}}>ВРЕМЯ: {settings.time}с</span>
            <input type="range" min="10" max="90" step="10" value={settings.time} onChange={e => setSettings({...settings, time: Number(e.target.value)})} />
          </div>
        </div>

        <button className="alias-primary-btn" onClick={() => setPhase('ready')}>ПОЕХАЛИ</button>
      </div>
    );
  }

  // 2. READY (SCORE)
  if (phase === 'ready') {
    return (
      <div className="alias-fixed-overlay">
        <button className="alias-exit-btn" onClick={() => setPhase('setup')}>✕</button>
        <h1 className="alias-title">РАУНД {currentRound}/{settings.rounds}</h1>
        
        <div style={{flex: 1, overflowY: 'auto'}}>
          {teams.map((t, idx) => (
            <div key={t.id} className={`alias-team-row ${idx === currentTeamIdx ? 'active' : ''}`}>
              <span>{t.name}</span>
              <span>{t.score}</span>
            </div>
          ))}
        </div>

        <div style={{textAlign:'center', marginBottom:'20px'}}>
          <p style={{fontSize:'12px', fontWeight:900, opacity:0.5}}>СЕЙЧАС ИГРАЕТ:</p>
          <h2 style={{fontSize:'28px', fontWeight:900, fontFamily:'Unbounded'}}>{teams[currentTeamIdx].name}</h2>
        </div>

        <button className="alias-primary-btn" onClick={startRound}>Я ГОТОВ</button>
      </div>
    );
  }

  // 3. GAME
  if (phase === 'game') {
    return (
      <div className="alias-fixed-overlay" style={{backgroundColor: '#fff'}}>
        <button className="alias-exit-btn" onClick={() => { if(window.confirm("Выйти?")) setPhase('setup') }}>✕</button>
        
        <div className="alias-game-header">
          <div className="alias-timer-pill">{timeLeft}</div>
          <div className="alias-round-info">
            <small>{teams[currentTeamIdx].name}</small>
            РАУНД {currentRound}
          </div>
        </div>

        <div className="alias-card-container">
          <SwipeCard key={currentWord} word={currentWord} onResult={handleAction} />
        </div>

        <div className="alias-game-footer">
          <button className="alias-action-btn skip" onClick={() => handleAction(false)}>ПРОПУСТИТЬ</button>
          <button className="alias-action-btn done" onClick={() => handleAction(true)}>УГАДАНО</button>
        </div>
      </div>
    );
  }

  // 4. SUMMARY
  if (phase === 'summary') {
    const roundCorrect = roundResults.filter(r => r.status === 'ok').length;
    return (
      <div className="alias-fixed-overlay">
        <h1 className="alias-title">ИТОГИ ХОДА</h1>
        <div style={{textAlign:'center', fontSize:'48px', fontWeight:900, margin:'10px 0'}}>+{roundCorrect}</div>
        
        <div className="alias-res-list">
          {roundResults.map((res, i) => (
            <div key={i} className={`alias-res-item ${res.status}`} onClick={() => toggleResult(i)}>
              <span>{res.word}</span>
              <div className="alias-status-dot"></div>
            </div>
          ))}
        </div>

        <button className="alias-primary-btn" onClick={applyScores}>ДАЛЕЕ</button>
      </div>
    );
  }

  // 5. VICTORY
  if (phase === 'victory') {
    const winner = [...teams].sort((a,b) => b.score - a.score)[0];
    return (
      <div className="alias-fixed-overlay" style={{justifyContent:'center'}}>
        <div className="alias-victory-box clay-card">
          <div style={{fontSize:'64px'}}>🏆</div>
          <h1 className="alias-title">ПОБЕДИТЕЛИ</h1>
          <h2 style={{fontSize:'32px', fontFamily:'Unbounded'}}>{winner.name}</h2>
          <p style={{fontWeight:900, marginTop:'10px'}}>{winner.score} ОЧКОВ</p>
        </div>
        <button className="alias-primary-btn" style={{marginTop:'30px'}} onClick={() => window.location.reload()}>В МЕНЮ</button>
      </div>
    );
  }

  return null;
}

function SwipeCard({ word, onResult }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-25, 25]);
  const background = useTransform(x, [-100, 0, 100], ["#FF6B6B", "#FFFFFF", "#26DE81"]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, background }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onResult(true);
        else if (info.offset.x < -100) onResult(false);
      }}
      className="alias-swipe-card"
    >
      {word}
      <div className="alias-hint-text">
        <span>← ПАС</span>
        <span>ОК →</span>
      </div>
    </motion.div>
  );
}

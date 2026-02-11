import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ALIAS_WORDS } from './words';
import './AliasGame.css';

export default function AliasGame({ onBack }) {
  // --- STATE ---
  const [phase, setPhase] = useState('setup'); // setup, ready, game, summary, victory
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда 1', score: 0 },
    { id: 2, name: 'Команда 2', score: 0 }
  ]);
  const [settings, setSettings] = useState({ time: 60, goal: 50 });
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  
  // Game Logic State
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [roundResults, setRoundResults] = useState([]); // { word: '...', status: 'ok' | 'skip' }
  const [isPaused, setIsPaused] = useState(false);

  // --- SETUP HELPERS ---
  const updateTeamName = (id, name) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name } : t));
  };

  const addTeam = () => {
    if (teams.length < 4) {
      setTeams([...teams, { id: Date.now(), name: `Команда ${teams.length + 1}`, score: 0 }]);
    }
  };

  const removeTeam = (id) => {
    if (teams.length > 2) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  // --- GAMEPLAY HELPERS ---
  const getRandomWord = () => {
    return ALIAS_WORDS[Math.floor(Math.random() * ALIAS_WORDS.length)];
  };

  const startGame = () => {
    setPhase('ready');
  };

  const startRound = () => {
    setPhase('game');
    setTimeLeft(settings.time);
    setRoundResults([]);
    setCurrentWord(getRandomWord());
    setIsPaused(false);
  };

  // Timer
  useEffect(() => {
    if (phase === 'game' && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('summary');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, isPaused]);

  // Swipe Handler
  const handleSwipe = (direction) => {
    const status = direction === 'down' ? 'ok' : 'skip';
    setRoundResults((prev) => [...prev, { word: currentWord, status }]);
    
    // Вибрация
    if (navigator.vibrate) navigator.vibrate(direction === 'down' ? 50 : [30, 30]);

    setCurrentWord(getRandomWord());
  };

  // --- SUMMARY LOGIC ---
  const toggleResult = (index) => {
    const newResults = [...roundResults];
    newResults[index].status = newResults[index].status === 'ok' ? 'skip' : 'ok';
    setRoundResults(newResults);
  };

  const applyScores = () => {
    const points = roundResults.filter(r => r.status === 'ok').length - roundResults.filter(r => r.status === 'skip').length;
    
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score = Math.max(0, newTeams[currentTeamIdx].score + points); // Не уходим в минус
    setTeams(newTeams);

    // Check Win
    if (newTeams[currentTeamIdx].score >= settings.goal) {
      setPhase('victory');
    } else {
      setCurrentTeamIdx((prev) => (prev + 1) % teams.length);
      setPhase('ready');
    }
  };

  // --- RENDERERS ---

  // 1. SETUP SCREEN
  if (phase === 'setup') {
    return (
      <div className="alias-container">
        <button className="alias-btn icon-only" onClick={onBack} style={{ position: 'absolute', top: 20, left: 20 }}>←</button>
        <div style={{ marginTop: 60 }}></div>
        <h1 className="alias-title">ALIAS NEO</h1>
        
        <div className="alias-card">
          <p className="alias-subtitle">КОМАНДЫ</p>
          {teams.map((team, idx) => (
            <div key={team.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <input 
                className="alias-input" 
                value={team.name} 
                onChange={(e) => updateTeamName(team.id, e.target.value)}
              />
              {teams.length > 2 && <button className="alias-btn icon-only" onClick={() => removeTeam(team.id)}>🗑️</button>}
            </div>
          ))}
          {teams.length < 4 && <button className="alias-btn" onClick={addTeam}>+ ДОБАВИТЬ</button>}
        </div>

        <div className="alias-card">
          <p className="alias-subtitle">ВРЕМЯ: {settings.time} СЕК</p>
          <input 
            type="range" min="30" max="120" step="10" 
            value={settings.time} 
            onChange={(e) => setSettings({...settings, time: Number(e.target.value)})}
            style={{ width: '100%', accentColor: '#1A202C' }}
          />
          <p className="alias-subtitle" style={{ marginTop: 20 }}>ЦЕЛЬ: {settings.goal} ОЧКОВ</p>
          <input 
            type="range" min="20" max="100" step="10" 
            value={settings.goal} 
            onChange={(e) => setSettings({...settings, goal: Number(e.target.value)})}
            style={{ width: '100%', accentColor: '#1A202C' }}
          />
        </div>

        <button className="alias-btn primary" style={{ marginTop: 'auto' }} onClick={startGame}>ИГРАТЬ</button>
      </div>
    );
  }

  // 2. READY SCREEN (SCOREBOARD)
  if (phase === 'ready') {
    return (
      <div className="alias-container">
        <h1 className="alias-title">СЧЕТ</h1>
        <div className="alias-card" style={{ flexGrow: 1 }}>
          {teams.map((team, idx) => (
            <div key={team.id} className={`team-row ${idx === currentTeamIdx ? 'active' : ''}`}>
              <span style={{ fontWeight: 900 }}>{team.name}</span>
              <span style={{ fontSize: 24, fontWeight: 900 }}>{team.score}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p>Готовится:</p>
          <h2 style={{ fontSize: 28, fontWeight: 900 }}>{teams[currentTeamIdx].name}</h2>
        </div>
        <button className="alias-btn primary" onClick={startRound}>ПОГНАЛИ!</button>
      </div>
    );
  }

  // 3. GAME SCREEN (SWIPE)
  if (phase === 'game') {
    return (
      <div className="alias-container">
        <div className="game-area">
          <div className="timer-badge">{timeLeft}</div>
          
          <div className="word-card-stack">
            <SwipeCard word={currentWord} onSwipe={handleSwipe} />
          </div>

          <div style={{ display: 'flex', gap: 20, width: '100%', marginTop: 40 }}>
            <button className="alias-btn" onClick={() => handleSwipe('up')}>ПРОПУСК ⤴️</button>
            <button className="alias-btn primary" onClick={() => handleSwipe('down')}>ГОТОВО ⤵️</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. SUMMARY SCREEN
  if (phase === 'summary') {
    const score = roundResults.filter(r => r.status === 'ok').length - roundResults.filter(r => r.status === 'skip').length;
    return (
      <div className="alias-container">
        <h1 className="alias-title">ИТОГИ РАУНДА</h1>
        <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
          {score > 0 ? `+${score}` : score}
        </h2>
        <p className="alias-subtitle">Нажми, чтобы исправить</p>
        
        <div className="results-list">
          {roundResults.map((res, idx) => (
            <div 
              key={idx} 
              className={`result-item ${res.status === 'ok' ? 'correct' : 'skipped'}`}
              onClick={() => toggleResult(idx)}
            >
              <span style={{ fontWeight: 800 }}>{res.word}</span>
              <span className="toggle-icon">{res.status === 'ok' ? '✔️' : '❌'}</span>
            </div>
          ))}
        </div>

        <button className="alias-btn primary" onClick={applyScores}>ДАЛЕЕ</button>
      </div>
    );
  }

  // 5. VICTORY SCREEN
  if (phase === 'victory') {
    return (
      <div className="alias-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 80 }}>👑</div>
        <h1 className="alias-title">ПОБЕДА!</h1>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>
          {teams[currentTeamIdx].name}
        </h2>
        <button className="alias-btn primary" onClick={() => setPhase('setup')}>В МЕНЮ</button>
      </div>
    );
  }

  return null;
}

// --- SUBCOMPONENT: SWIPE CARD ---
function SwipeCard({ word, onSwipe }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]); // Вращение при свайпе вбок (если захочешь)
  
  // Мы используем Y для вертикального свайпа
  // Вниз (положительный Y) = Угадал
  // Вверх (отрицательный Y) = Пропуск

  return (
    <motion.div
      className="play-card"
      style={{ x, y, rotate }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100) {
            onSwipe('down'); // Угадал
        } else if (offset.y < -100) {
            onSwipe('up'); // Пропуск
        }
      }}
      // Возврат на место, если свайп не удался
      animate={{ x: 0, y: 0, rotate: 0 }}
    >
      <span className="word-text">{word}</span>
      <div style={{ position: 'absolute', bottom: 20, opacity: 0.3, fontSize: 12, fontWeight: 700 }}>
        ВВЕРХ - ПАС / ВНИЗ - ОК
      </div>
    </motion.div>
  );
}
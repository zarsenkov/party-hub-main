import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ALIAS_DATA } from './words';
import './AliasGame.css';

export default function AliasGame({ onBack }) {
  // --- СОСТОЯНИЕ ---
  const [phase, setPhase] = useState('setup'); // setup, ready, game, summary, victory
  const [teams, setTeams] = useState([
    { id: 1, name: 'Тролли', score: 0 },
    { id: 2, name: 'Обезьяны', score: 0 }
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

  // --- ФУНКЦИИ УПРАВЛЕНИЯ КОМАНДАМИ ---
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

  // --- ЛОГИКА ИГРЫ ---
  const handleOnlineClick = () => {
    alert("🌐 ОНЛАЙН-РЕЖИМ\n\nВ разработке! Скоро вы сможете играть с друзьями удаленно.");
  };

  const startRound = () => {
    setPhase('game');
    setTimeLeft(settings.time);
    setRoundResults([]);
    setCurrentWord(getRandomWord());
  };

  const getRandomWord = () => {
    const pool = ALIAS_DATA[settings.category].words;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  useEffect(() => {
    if (phase === 'game') {
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
  }, [phase]);

  const handleAction = (isCorrect) => {
    const status = isCorrect ? 'ok' : 'skip';
    setRoundResults((prev) => [...prev, { word: currentWord, status }]);
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 40 : 20);
    setCurrentWord(getRandomWord());
  };

  const toggleResult = (index) => {
    const newResults = [...roundResults];
    newResults[index].status = newResults[index].status === 'ok' ? 'skip' : 'ok';
    setRoundResults(newResults);
  };

  const applyScores = () => {
    const points = roundResults.filter(r => r.status === 'ok').length;
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += points;
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

  // --- ЭКРАНЫ ---

  // 1. НАСТРОЙКИ
  if (phase === 'setup') {
    return (
      <div className="alias-container">
        <button className="alias-exit-btn" onClick={onBack}>✕</button>
        <h1 className="alias-title">ALIAS NEO</h1>
        
        <div className="alias-setup-scroll">
          <button className="alias-btn online-btn" onClick={handleOnlineClick}>
             ИГРАТЬ ОНЛАЙН 🌐
          </button>

          <div className="alias-card">
            <p className="alias-label">КОМАНДЫ</p>
            {teams.map((team) => (
              <div key={team.id} className="alias-input-group">
                <input 
                  className="alias-input" 
                  value={team.name} 
                  onChange={(e) => updateTeamName(team.id, e.target.value)}
                />
                {teams.length > 2 && <button className="alias-remove-team" onClick={() => removeTeam(team.id)}>✕</button>}
              </div>
            ))}
            {teams.length < 6 && <button className="alias-add-btn" onClick={addTeam}>+ Добавить команду</button>}
          </div>

          <div className="alias-card">
            <p className="alias-label">КАТЕГОРИЯ</p>
            <div className="alias-category-grid">
              {Object.keys(ALIAS_DATA).map(key => (
                <button 
                  key={key}
                  className={`alias-cat-btn ${settings.category === key ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, category: key})}
                >
                  {ALIAS_DATA[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="alias-card">
            <p className="alias-label">РАУНДОВ: <b>{settings.rounds}</b></p>
            <input type="range" min="1" max="10" value={settings.rounds} onChange={(e) => setSettings({...settings, rounds: Number(e.target.value)})} />
            
            <p className="alias-label" style={{ marginTop: 20 }}>ВРЕМЯ: <b>{settings.time}с</b></p>
            <input type="range" min="10" max="90" step="10" value={settings.time} onChange={(e) => setSettings({...settings, time: Number(e.target.value)})} />
          </div>
        </div>

        <button className="alias-btn primary" onClick={() => setPhase('ready')}>ПОЕХАЛИ</button>
      </div>
    );
  }

  // 2. ГОТОВНОСТЬ (СЧЕТ)
  if (phase === 'ready') {
    return (
      <div className="alias-container">
        <button className="alias-exit-btn" onClick={() => setPhase('setup')}>✕</button>
        <div className="alias-header-info">
          <span>РАУНД {currentRound}/{settings.rounds}</span>
        </div>
        <h1 className="alias-title">СЧЕТ</h1>
        <div className="alias-score-list">
          {teams.map((team, idx) => (
            <div key={team.id} className={`alias-team-line ${idx === currentTeamIdx ? 'active' : ''}`}>
              <span>{team.name}</span>
              <b>{team.score}</b>
            </div>
          ))}
        </div>
        <div className="alias-next-player-box">
          <p>Очередь команды:</p>
          <h2>{teams[currentTeamIdx].name}</h2>
          <small>{ALIAS_DATA[settings.category].name}</small>
        </div>
        <button className="alias-btn primary" onClick={startRound}>Я ГОТОВ</button>
      </div>
    );
  }

  // 3. ИГРОВОЙ ЭКРАН
  if (phase === 'game') {
    return (
      <div className="alias-container game-bg">
        <button className="alias-exit-btn" onClick={() => { if(window.confirm("Выйти в настройки?")) setPhase('setup') }}>✕</button>
        <div className="alias-game-header">
          <div className="alias-timer">{timeLeft}</div>
          <div className="alias-game-info">
            <span>{teams[currentTeamIdx].name}</span>
            <small>РАУНД {currentRound}</small>
          </div>
        </div>
        
        <div className="alias-card-zone">
          <SwipeCard 
            key={currentWord} 
            word={currentWord} 
            onResult={handleAction} 
          />
        </div>

        <div className="alias-game-footer">
          <button className="alias-game-btn skip" onClick={() => handleAction(false)}>ПРОПУСТИТЬ</button>
          <button className="alias-game-btn done" onClick={() => handleAction(true)}>УГАДАЛ</button>
        </div>
      </div>
    );
  }

  // 4. ИТОГИ
  if (phase === 'summary') {
    const roundScore = roundResults.filter(r => r.status === 'ok').length;
    return (
      <div className="alias-container">
        <h1 className="alias-title">ИТОГИ ХОДА</h1>
        <div className="alias-summary-score">+{roundScore}</div>
        <div className="alias-results-scroll">
          {roundResults.map((res, idx) => (
            <div key={idx} className={`alias-result-item ${res.status}`} onClick={() => toggleResult(idx)}>
              <span>{res.word}</span>
              <div className="alias-toggle-status"></div>
            </div>
          ))}
        </div>
        <button className="alias-btn primary" onClick={applyScores}>ПРИНЯТЬ</button>
      </div>
    );
  }

  // 5. ФИНАЛ
  if (phase === 'victory') {
    const winner = [...teams].sort((a,b) => b.score - a.score)[0];
    return (
      <div className="alias-container victory-bg">
        <h1 className="alias-title">ФИНАЛ</h1>
        <div className="alias-victory-card clay-card">
          <div className="victory-icon">🏆</div>
          <p>ПОБЕДИТЕЛИ</p>
          <h2>{winner.name}</h2>
          <div className="victory-score">{winner.score} очков</div>
        </div>
        <button className="alias-btn primary" onClick={() => setPhase('setup')}>ИГРАТЬ СНОВА</button>
      </div>
    );
  }

  return null;
}

function SwipeCard({ word, onResult }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#FEB2B2", "#FFFFFF", "#9AE6B4"]
  );

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, background }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) onResult(true);
        else if (info.offset.x < -80) onResult(false);
      }}
      className="alias-swipe-card"
    >
      {word}
      <div className="alias-swipe-hints">
        <span>← ПАС</span>
        <span>ОК →</span>
      </div>
    </motion.div>
  );
}

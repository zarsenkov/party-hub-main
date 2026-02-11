import React, { useState, useEffect } from 'react';
import './LoveStory.css'; // // Подключаем твои стили
import { STORIES } from './LoveData'; // // Вынеси объект STORIES в отдельный файл

export default function LoveStory({ onBack }) {
  // // Состояния пользователя
  const [p1, setP1] = useState(localStorage.getItem('ls_p1') || "");
  const [p2, setP2] = useState(localStorage.getItem('ls_p2') || "");
  const [screen, setScreen] = useState(p1 && p2 ? 'lobby' : 'setup');

  // // Игровой прогресс
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [honestyScore, setHonestyScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  // // Состояния для UI
  const [isSpinning, setIsSpinning] = useState(false);
  const [showHonesty, setShowHonesty] = useState(false);
  const [rotation, setRotation] = useState(0);

  const story = STORIES[currentStoryId];
  const phase = story?.phases[phaseIdx];

  // // Логика авто-таймера Амалии
  useEffect(() => {
    let timer;
    if (screen === 'quest' && phase?.npc[stepIdx]?.auto) {
      timer = setTimeout(() => setStepIdx(prev => prev + 1), 5000);
    }
    return () => clearTimeout(timer);
  }, [stepIdx, phase, screen]);

  // // Функция старта истории
  const startStory = (id) => {
    setCurrentStoryId(id);
    setPhaseIdx(0);
    setStepIdx(0);
    setHonestyScore(0);
    setTotalQuestions(0);
    setScreen('quest');
  };

  // // Колесо судьбы
  const handleSpin = () => {
    setIsSpinning(true);
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setStepIdx(prev => prev + 1);
    }, 4000);
  };

  // // Экран входа
  if (screen === 'setup') {
    return (
      <section className="screen active">
        <div className="clay-card setup-box">
          <h2 className="title">LOVE<span>STORY</span></h2>
          <input className="joy-input" placeholder="Имя 1" value={p1} onChange={e => setP1(e.target.value)} />
          <input className="joy-input" placeholder="Имя 2" value={p2} onChange={e => setP2(e.target.value)} style={{marginTop: '15px'}} />
          <button className="btn-clay primary" style={{marginTop: '25px'}} onClick={() => {
            localStorage.setItem('ls_p1', p1);
            localStorage.setItem('ls_p2', p2);
            setScreen('lobby');
          }}>ВОЙТИ</button>
        </div>
      </section>
    );
  }

  // // Лобби
  if (screen === 'lobby') {
    return (
      <section className="screen active">
        <header className="lobby-header">
          <button className="btn-mini" onClick={onBack}>←</button>
          <h2 className="section-label">ВАШИ СЮЖЕТЫ</h2>
        </header>
        <div className="story-grid">
          {Object.entries(STORIES).map(([id, s]) => (
            <div key={id} className="story-card clay-box" onClick={() => startStory(id)}>
              <div className="story-img">{s.coverIcon}</div>
              <h3>{s.title}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // // Игровой процесс
  return (
    <section className="screen active" style={{backgroundColor: phase?.bg}}>
      <div className="quest-top">
        <button className="btn-mini" onClick={() => setScreen('lobby')}>←</button>
        <div className="love-jar">
          <div className="liquid" style={{height: `${(stepIdx / (phase?.cards.length + phase?.npc.length)) * 100}%`, background: phase?.color}}></div>
          <i className="fas fa-heart" style={{position: 'relative', zIndex: 2, color: '#fff'}}></i>
        </div>
      </div>

      <div className="npc-block">
        <div className={`amalia-avatar ${phase?.npc[stepIdx]?.auto ? 'amalia-talking' : ''}`}>✨</div>
        <div className="clay-box npc-bubble">
          <p>{phase?.npc[stepIdx]?.text || "Амалия ждет ваших откровений..."}</p>
        </div>
      </div>

      <div className="action-area">
        {phase?.npc[stepIdx] ? (
          !phase.npc[stepIdx].auto && <button className="btn-clay primary" onClick={() => setStepIdx(prev => prev + 1)}>ПРОДОЛЖИТЬ</button>
        ) : (
          <div className="clay-box card-body">
            <p>{phase?.cards[0]?.text.replace(/{name1}/g, p1).replace(/{name2}/g, p2)}</p>
            {phase?.cards[0]?.type === 'duel' ? (
              <button className="btn-clay primary" onClick={() => setIsSpinning(true)}>КРУТИТЬ КОЛЕСО</button>
            ) : (
              <button className="btn-clay primary" onClick={() => { setTotalQuestions(t => t+1); setShowHonesty(true); }}>ОТВЕТИЛ(А)</button>
            )}
          </div>
        )}
      </div>

      {/* Оверлей Колеса */}
      {isSpinning && (
        <div className="duel-overlay">
          <div className="wheel-container">
            <div className="wheel" style={{transform: `rotate(${rotation}deg)`, transition: '4s cubic-bezier(0.1, 0.7, 0.1, 1)'}}>
              <div className="sector" id="sector1">{p1}</div>
              <div className="sector" id="sector2">{p2}</div>
            </div>
            <button className="btn-clay primary" style={{marginTop: '200px'}} onClick={handleSpin}>SPIN</button>
          </div>
        </div>
      )}

      {/* Оверлей Честности */}
      {showHonesty && (
        <div className="honesty-overlay">
          <div className="clay-box text-center">
            <h3>Честность</h3>
            <p>Партнер ответил искренне?</p>
            <div className="honesty-btns">
              <button className="btn-clay green" onClick={() => { setHonestyScore(s => s+1); setShowHonesty(false); setStepIdx(prev => prev + 1); }}>ВЕРЮ</button>
              <button className="btn-clay red" onClick={() => { setShowHonesty(false); setStepIdx(prev => prev + 1); }}>НЕТ</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

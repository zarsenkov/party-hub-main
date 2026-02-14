import React, { useState, useEffect } from 'react';
import { WHO_AM_I_CATEGORIES } from './whoAmI_data';

// // Игра "Кто я?" в стиле матового стекла
const WhoAmIGame = () => {
  const [screen, setScreen] = useState('setup'); // // setup, play, results
  const [selectedCats, setSelectedCats] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  // // Редирект на главную
  const goHome = () => window.location.href = 'https://lovecouple.ru';

  // // Сборка колоды и старт
  const startGame = () => {
    if (selectedCats.length === 0) return;
    let deck = [];
    selectedCats.forEach(id => {
      const cat = WHO_AM_I_CATEGORIES.find(c => c.id === id);
      if (cat) deck = [...deck, ...cat.characters];
    });
    setCharacters(deck.sort(() => Math.random() - 0.5));
    setIndex(0);
    setScore(0);
    setTimeLeft(60);
    setScreen('play');
    setIsActive(true);
  };

  // // Логика окончания игры
  const finishGame = () => {
    setIsActive(false);
    setScreen('results');
  };

  // // Эффект таймера
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame(); // // Конец по времени
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // // Выбор категорий
  const toggleCat = (id) => {
    setSelectedCats(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  };

  // // Переключение персонажа
  const handleAction = (isHit) => {
    if (isHit) setScore(s => s + 1);
    
    if (index + 1 < characters.length) {
      setIndex(i => i + 1);
    } else {
      finishGame(); // // Конец, если персонажи закончились
    }
  };

  return (
    <div className="who-glass-root">
      <style>{glassStyles}</style>
      
      <button className="back-link" onClick={goHome}>← МЕНЮ</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="glass-container fade-in">
          <h1 className="main-title">КТО Я?</h1>
          <p className="hint">Выбери темы для игры</p>
          
          <div className="cats-list">
            {WHO_AM_I_CATEGORIES.map(c => (
              <div 
                key={c.id} 
                className={`cat-card ${selectedCats.includes(c.id) ? 'active' : ''}`}
                onClick={() => toggleCat(c.id)}
              >
                {c.name}
              </div>
            ))}
          </div>

          <button 
            className="start-button" 
            disabled={selectedCats.length === 0}
            onClick={startGame}
          >
            ПОЕХАЛИ
          </button>
        </div>
      )}

      {/* ЭКРАН 2: ПРОЦЕСС ИГРЫ */}
      {screen === 'play' && (
        <div className="play-wrapper fade-in">
          <div className="stats-row">
            <div className="glass-pill">СЧЕТ: {score}</div>
            <div className={`glass-pill timer ${timeLeft < 10 ? 'low' : ''}`}>
              0:{(timeLeft).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="character-card">
            <span className="card-label">ТЫ СЕЙЧАС:</span>
            <h2 className="char-name">{characters[index]}</h2>
          </div>

          <div className="controls-row">
            <button className="glass-btn skip" onClick={() => handleAction(false)}>ПРОПУСТИТЬ</button>
            <button className="glass-btn hit" onClick={() => handleAction(true)}>УГАДАЛ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="glass-container result-card fade-in">
          <h2 className="main-title">ФИНИШ!</h2>
          <div className="final-score">
            <span>Твой результат:</span>
            <div className="score-num">{score}</div>
          </div>
          <p className="hint">Отличная работа, агент!</p>
          
          <button className="start-button" onClick={() => setScreen('setup')}>
            ИГРАТЬ СНОВА
          </button>
        </div>
      )}
    </div>
  );
};

const glassStyles = `
  .who-glass-root {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: white; padding: 20px;
  }

  .back-link {
    position: absolute; top: env(safe-area-inset-top, 20px); left: 20px;
    background: rgba(255,255,255,0.1); border: none; color: white;
    padding: 8px 16px; border-radius: 20px; backdrop-filter: blur(10px);
    z-index: 10;
  }

  .glass-container {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 32px;
    padding: 40px 24px;
    width: 100%; max-width: 360px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }

  .main-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; }
  .hint { opacity: 0.7; font-size: 0.9rem; margin-bottom: 32px; }

  .cats-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
  .cat-card {
    background: rgba(255,255,255,0.1);
    padding: 16px; border-radius: 16px;
    font-weight: 600; font-size: 0.85rem;
    border: 1px solid transparent; transition: 0.3s;
  }
  .cat-card.active {
    background: white; color: #764ba2;
    transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  .start-button {
    width: 100%; padding: 18px; border-radius: 18px;
    border: none; background: #fff; color: #764ba2;
    font-weight: 800; font-size: 1.1rem; cursor: pointer;
  }

  /* Экран результатов */
  .final-score { margin: 20px 0; }
  .score-num { font-size: 5rem; font-weight: 900; line-height: 1; margin-top: 10px; }

  /* Игровой экран */
  .play-wrapper { width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 20px; }
  
  .stats-row { display: flex; justify-content: space-between; }
  .glass-pill {
    background: rgba(255,255,255,0.15);
    padding: 10px 20px; border-radius: 30px;
    backdrop-filter: blur(10px); font-weight: 700;
  }
  .timer.low { color: #ff4d4d; background: rgba(255, 77, 77, 0.2); }

  .character-card {
    background: rgba(255,255,255,0.2);
    height: 300px; border-radius: 32px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }
  .card-label { font-size: 0.8rem; font-weight: 700; opacity: 0.6; margin-bottom: 12px; }
  .char-name { font-size: 2.2rem; font-weight: 900; text-align: center; padding: 0 20px; }

  .controls-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  .glass-btn {
    padding: 20px; border-radius: 20px; border: none;
    font-weight: 700; font-size: 1rem; color: white; backdrop-filter: blur(10px);
  }
  .glass-btn.skip { background: rgba(255,255,255,0.1); }
  .glass-btn.hit { background: #4ade80; color: #1a472a; }

  .fade-in { animation: fIn 0.5s ease; }
  @keyframes fIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default WhoAmIGame;

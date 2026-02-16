import React, { useState, useEffect } from 'react';
// // Данные категорий и персонажей
import { WHO_AM_I_CATEGORIES } from './whoAmI_data';

const WhoAmIGame = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [screen, setScreen] = useState('setup'); // setup, play, results
  const [selectedCats, setSelectedCats] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // === ЛОГИКА ИГРЫ ===

  // // Сборка колоды и старт
  const startGame = () => {
    if (selectedCats.length === 0) return;
    let deck = [];
    selectedCats.forEach(id => {
      const cat = WHO_AM_I_CATEGORIES.find(c => c.id === id);
      if (cat && cat.characters) deck = [...deck, ...cat.characters];
    });
    
    if (deck.length === 0) {
      alert("В выбранных категориях нет персонажей!");
      return;
    }

    setCharacters(deck.sort(() => Math.random() - 0.5));
    setIndex(0);
    setScore(0);
    setTimeLeft(60);
    setScreen('play');
    setIsActive(true);
    setIsPaused(false);
  };

  const finishGame = () => {
    setIsActive(false);
    setScreen('results');
  };

  // // Таймер
  useEffect(() => {
    let timer;
    if (isActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft]);

  // // Выбор категорий
  const toggleCat = (id) => {
    setSelectedCats(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  };

  // // Ответ (угадал / пропустил)
  const handleAction = (isHit) => {
    if (isPaused) return;
    if (isHit) setScore(s => s + 1);
    
    if (index + 1 < characters.length) {
      setIndex(i => i + 1);
    } else {
      finishGame();
    }
  };

  return (
    <div className="pop-root">
      <style>{popStyles}</style>
      
      <button className="pop-back" onClick={onBack}>← ВЫХОД</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="pop-container fade-in">
          <div className="pop-title-wrap">
            <h1 className="pop-title">КТО Я?</h1>
          </div>
          <p className="pop-subtitle">ВЫБЕРИ СВОИ МИРЫ:</p>
          
          <div className="pop-cats-grid">
            {WHO_AM_I_CATEGORIES.map(c => (
              <button 
                key={c.id} 
                className={`pop-cat-card ${selectedCats.includes(c.id) ? 'active' : ''}`}
                onClick={() => toggleCat(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <button 
            className="pop-btn-primary main-start" 
            disabled={selectedCats.length === 0}
            onClick={startGame}
          >
            ПОГНАЛИ!
          </button>
        </div>
      )}

      {/* ЭКРАН 2: ПРОЦЕСС ИГРЫ */}
      {screen === 'play' && (
        <div className="pop-play-area fade-in">
          <div className="pop-top-bar">
            <div className="pop-stat-box">ОЧКИ: {score}</div>
            <button className="pop-pause-btn" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? '▶' : 'II'}
            </button>
            <div className={`pop-stat-box timer ${timeLeft < 10 ? 'critical' : ''}`}>
              {timeLeft}с
            </div>
          </div>

          <div className={`pop-main-card ${isPaused ? 'paused' : ''}`}>
            {isPaused ? (
              <h2 className="pop-char-name">ПАУЗА</h2>
            ) : (
              <>
                <span className="pop-card-hint">ПОКАЖИ ДРУЗЬЯМ:</span>
                <h2 className="pop-char-name">{characters[index]}</h2>
              </>
            )}
          </div>

          <div className="pop-controls">
            <button className="pop-btn-action skip" onClick={() => handleAction(false)}>МАТ! (ПРОПУСК)</button>
            <button className="pop-btn-action hit" onClick={() => handleAction(true)}>ЕСТЬ! (УГАДАЛ)</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="pop-container result-screen fade-in">
          <h2 className="pop-res-title">ФИНИШ!</h2>
          <div className="pop-score-circle">
            <span className="score-label">ТВОЙ СЧЕТ</span>
            <span className="score-val">{score}</span>
          </div>
          <p className="pop-res-msg">ТЫ ПРОСТО ЛЕГЕНДА!</p>
          
          <button className="pop-btn-primary" onClick={() => setScreen('setup')}>
            ЕЩЕ РАЗОК?
          </button>
        </div>
      )}
    </div>
  );
};

// // СТИЛИ: POP-ART RETRO
const popStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Bangers&display=swap');

  .pop-root {
    position: fixed !important; inset: 0 !important;
    background-color: #FFD700 !important; /* Желтый */
    background-image: radial-gradient(#000 10%, transparent 10%) !important;
    background-size: 20px 20px !important; /* Точки поп-арта */
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-family: 'Unbounded', sans-serif !important; color: #000 !important; padding: 20px !important;
    z-index: 100000 !important;
  }

  .pop-back {
    position: absolute !important; top: 20px !important; left: 20px !important;
    background: #000 !important; color: #fff !important; border: none !important;
    padding: 10px 15px !important; font-weight: 900 !important; font-size: 10px !important;
    cursor: pointer !important; transform: skew(-10deg) !important;
  }

  .pop-container {
    background: #fff !important; border: 6px solid #000 !important;
    padding: 30px 20px !important; width: 100% !important; max-width: 380px !important;
    box-shadow: 15px 15px 0px #000 !important; text-align: center !important;
  }

  .pop-title-wrap {
    background: #FF00FF !important; border: 4px solid #000 !important;
    padding: 10px !important; margin-bottom: 25px !important; transform: rotate(-3deg) !important;
  }
  .pop-title { font-family: 'Bangers', cursive !important; font-size: 4rem !important; color: #fff !important; text-shadow: 4px 4px 0 #000 !important; letter-spacing: 5px !important; margin: 0 !important; }

  .pop-subtitle { font-weight: 900 !important; margin-bottom: 20px !important; font-size: 0.8rem !important; }

  .pop-cats-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; margin-bottom: 30px !important; }
  .pop-cat-card {
    background: #fff !important; border: 3px solid #000 !important; padding: 12px !important;
    font-weight: 900 !important; font-size: 0.75rem !important; cursor: pointer !important;
    transition: 0.2s !important;
  }
  .pop-cat-card.active { background: #00FFFF !important; transform: scale(1.05) !important; box-shadow: 5px 5px 0 #000 !important; }

  .pop-btn-primary {
    width: 100% !important; background: #FF00FF !important; color: #fff !important;
    border: 4px solid #000 !important; padding: 15px !important; font-family: 'Bangers' !important;
    font-size: 1.8rem !important; cursor: pointer !important; box-shadow: 8px 8px 0 #000 !important;
  }
  .pop-btn-primary:active { transform: translate(4px, 4px) !important; box-shadow: 0px 0px 0 #000 !important; }

  /* Игровой экран */
  .pop-play-area { width: 100% !important; max-width: 400px !important; display: flex !important; flex-direction: column !important; gap: 20px !important; }
  
  .pop-top-bar { display: flex !important; justify-content: space-between !important; align-items: center !important; }
  .pop-stat-box {
    background: #000 !important; color: #fff !important; padding: 8px 15px !important;
    font-weight: 900 !important; font-size: 0.9rem !important; transform: skew(-5deg) !important;
  }
  .pop-stat-box.timer.critical { background: #FF0000 !important; animation: pulse 0.5s infinite !important; }
  @keyframes pulse { 50% { opacity: 0.5; } }

  .pop-pause-btn { background: #00FFFF !important; border: 3px solid #000 !important; width: 40px !important; height: 40px !important; font-weight: 900 !important; cursor: pointer !important; }

  .pop-main-card {
    background: #fff !important; border: 8px solid #000 !important; height: 300px !important;
    display: flex !important; flex-direction: column !important; align-items: center !important;
    justify-content: center !important; box-shadow: 20px 20px 0px #00FFFF !important;
    padding: 20px !important; position: relative !important;
  }
  .pop-main-card.paused { opacity: 0.5 !important; background: #eee !important; }
  .pop-card-hint { background: #000 !important; color: #fff !important; padding: 2px 10px !important; font-size: 0.7rem !important; margin-bottom: 20px !important; }
  .pop-char-name { font-family: 'Bangers' !important; font-size: 3.5rem !important; text-align: center !important; line-height: 1 !important; color: #FF00FF !important; text-shadow: 3px 3px 0 #000 !important; }

  .pop-controls { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
  .pop-btn-action {
    padding: 15px !important; border: 4px solid #000 !important; font-weight: 900 !important;
    font-size: 0.8rem !important; cursor: pointer !important; box-shadow: 5px 5px 0 #000 !important;
  }
  .pop-btn-action.skip { background: #FF0000 !important; color: #fff !important; }
  .pop-btn-action.hit { background: #00FF00 !important; color: #000 !important; }
  .pop-btn-action:active { transform: translate(3px, 3px) !important; box-shadow: 0px 0px 0 #000 !important; }

  /* Результаты */
  .pop-score-circle {
    width: 150px !important; height: 150px !important; background: #00FFFF !important;
    border: 5px solid #000 !important; border-radius: 50% !important;
    display: flex !important; flex-direction: column !important; align-items: center !important;
    justify-content: center !important; margin: 20px auto !important; transform: rotate(5deg) !important;
  }
  .score-label { font-size: 0.6rem !important; font-weight: 900 !important; }
  .score-val { font-family: 'Bangers' !important; font-size: 5rem !important; line-height: 1 !important; }

  .fade-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
  @keyframes popIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
`;

export default WhoAmIGame;

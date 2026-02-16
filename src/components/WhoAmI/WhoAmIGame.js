import React, { useState, useEffect } from 'react';
// // Данные категорий и персонажей
import { WHO_AM_I_CATEGORIES } from './whoAmI_data';

const WhoAmIGame = ({ onBack }) => {
  // // === СОСТОЯНИЕ ===
  const [screen, setScreen] = useState('setup'); // // setup, play, results
  const [selectedCats, setSelectedCats] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // // === ЛОГИКА ===

  // // Сборка колоды и старт игры
  const startGame = () => {
    if (selectedCats.length === 0) return;
    let deck = [];
    selectedCats.forEach(id => {
      const cat = WHO_AM_I_CATEGORIES.find(c => c.id === id);
      if (cat && cat.characters) deck = [...deck, ...cat.characters];
    });
    
    if (deck.length === 0) return;

    setCharacters(deck.sort(() => Math.random() - 0.5)); // // Перемешивание
    setIndex(0);
    setScore(0);
    setTimeLeft(60);
    setScreen('play');
    setIsActive(true);
    setIsPaused(false);
  };

  // // Завершение игры
  const finishGame = () => {
    setIsActive(false);
    setScreen('results');
  };

  // // Таймер с учетом паузы
  useEffect(() => {
    let timer;
    if (isActive && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [isActive, isPaused, timeLeft]);

  // // Выбор/отмена категории
  const toggleCat = (id) => {
    setSelectedCats(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  };

  // // Обработка ответа (Угадал / Пропустил)
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
    <div className="toon-root">
      <style>{toonStyles}</style>
      
      {/* Точечно исправленная кнопка назад */}
      <button className="toon-back-btn" onClick={onBack}>← ДОМОЙ</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="toon-card setup-box fade-in">
          <div className="toon-header-group">
            <div className="toon-eye left"></div>
            <h1 className="toon-title">КТО Я?</h1>
            <div className="toon-eye right"></div>
          </div>
          <p className="toon-subtitle">ВЫБИРАЙ КАРТЫ ДЛЯ ВЕСЕЛЬЯ!</p>
          
          <div className="toon-grid-scroll-container">
            <div className="toon-grid">
              {WHO_AM_I_CATEGORIES.map(c => (
                <div 
                  key={c.id} 
                  className={`toon-cat-card ${selectedCats.includes(c.id) ? 'active' : ''}`}
                  onClick={() => toggleCat(c.id)}
                >
                  <div className="toon-check"></div>
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          <button 
            className="toon-btn-play" 
            disabled={selectedCats.length === 0}
            onClick={startGame}
          >
            ИГРАТЬ!
          </button>
        </div>
      )}

      {/* ЭКРАН 2: ИГРА */}
      {screen === 'play' && (
        <div className="toon-play-container fade-in">
          <div className="toon-stats">
            <div className="toon-pill score">⭐ {score}</div>
            <button className="toon-pause-btn" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? '▶' : 'II'}
            </button>
            <div className={`toon-pill timer ${timeLeft < 10 ? 'shake' : ''}`}>
              ⏰ {timeLeft}
            </div>
          </div>

          <div className={`toon-main-card ${isPaused ? 'is-paused' : ''}`}>
            {isPaused ? (
              <h2 className="toon-char-text">ПАУЗА!</h2>
            ) : (
              <>
                <span className="toon-label">ТЫ СЕЙЧАС...</span>
                <h2 className="toon-char-text">{characters[index]}</h2>
              </>
            )}
            <div className="toon-card-footer"></div>
          </div>

          <div className="toon-controls">
            <button className="toon-btn-ctrl skip" onClick={() => handleAction(false)}>ОЙ, НЕТ!</button>
            <button className="toon-btn-ctrl hit" onClick={() => handleAction(true)}>УГАДАЛ!</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="toon-card result-box fade-in">
          <h2 className="toon-title small">УРА!</h2>
          <div className="toon-result-circle">
            <span className="res-val">{score}</span>
            <span className="res-label">ОЧКОВ</span>
          </div>
          <button className="toon-btn-play" onClick={() => setScreen('setup')}>
            ЕЩЕ КРУГ?
          </button>
        </div>
      )}
    </div>
  );
};

// // CSS СТИЛИ (Только необходимые правки для видимости кнопки)
const toonStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Bangers&display=swap');

  .toon-root {
    position: fixed !important; inset: 0 !important;
    background: #fdf5e6 !important;
    background-image: radial-gradient(#dcd0b9 2px, transparent 2px) !important;
    background-size: 30px 30px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-family: 'Comfortaa', cursive !important; color: #2c2c2c !important;
    padding: 20px !important; z-index: 100000 !important; overflow: hidden !important;
  }

  /* // // Точечный фикс кнопки: добавлен z-index и нормальный отступ */
  .toon-back-btn {
    position: absolute !important; top: 25px !important; left: 20px !important;
    background: #ff6b6b !important; color: #fff !important; border: 4px solid #000 !important;
    padding: 8px 15px !important; border-radius: 50px !important; font-weight: 900 !important;
    font-size: 0.75rem !important; cursor: pointer !important; box-shadow: 0 4px 0 #000 !important;
    z-index: 100005 !important;
  }

  .toon-card {
    background: #fff !important; border: 6px solid #000 !important;
    border-radius: 40px !important; padding: 40px 20px !important;
    width: 100% !important; max-width: 380px !important;
    box-shadow: 0 15px 0 rgba(0,0,0,0.1) !important; text-align: center !important;
    position: relative !important; display: flex !important; flex-direction: column !important;
    max-height: 90vh !important;
  }

  .toon-header-group { display: flex !important; justify-content: center !important; align-items: center !important; gap: 10px !important; margin-bottom: 20px !important; }
  .toon-eye { width: 12px; height: 12px; background: #000; border-radius: 50%; }
  
  .toon-title { font-family: 'Bangers' !important; font-size: 4.5rem !important; line-height: 0.8 !important; color: #000 !important; margin: 0 !important; }
  .toon-title.small { font-size: 3rem !important; }
  .toon-subtitle { font-size: 0.8rem !important; font-weight: 900 !important; margin-bottom: 25px !important; color: #555 !important; }

  .toon-grid-scroll-container {
    max-height: 280px !important; overflow-y: auto !important;
    margin-bottom: 30px !important; padding: 10px 5px !important;
  }
  .toon-grid-scroll-container::-webkit-scrollbar { width: 6px !important; }
  .toon-grid-scroll-container::-webkit-scrollbar-thumb { background: #000 !important; border-radius: 10px !important; }

  .toon-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
  
  .toon-cat-card {
    background: #f0f0f0 !important; border: 4px solid #000 !important;
    padding: 15px !important; border-radius: 20px !important;
    font-weight: 900 !important; font-size: 0.8rem !important; cursor: pointer !important;
    position: relative !important; transition: 0.1s !important;
  }
  .toon-cat-card.active { background: #4ecdc4 !important; transform: translateY(-5px) !important; box-shadow: 0 5px 0 #000 !important; }

  .toon-btn-play {
    width: 100% !important; background: #ff6b6b !important; color: #fff !important;
    border: 5px solid #000 !important; border-radius: 25px !important;
    padding: 15px !important; font-family: 'Bangers' !important; font-size: 2rem !important;
    cursor: pointer !important; box-shadow: 0 8px 0 #000 !important; transition: 0.1s !important;
  }
  .toon-btn-play:active { transform: translateY(4px) !important; box-shadow: 0 4px 0 #000 !important; }

  .toon-play-container { width: 100% !important; max-width: 400px !important; }
  .toon-stats { display: flex !important; justify-content: space-between !important; margin-bottom: 20px !important; }
  .toon-pill { background: #fff !important; border: 4px solid #000 !important; padding: 10px 20px !important; border-radius: 30px !important; font-weight: 900 !important; }
  
  @keyframes shake { 0% { transform: rotate(1deg); } 100% { transform: rotate(-1deg); } }
  .timer.shake { animation: shake 0.2s infinite !important; color: #ff6b6b !important; }

  .toon-pause-btn { background: #000 !important; color: #fff !important; border: none !important; width: 50px !important; border-radius: 20px !important; cursor: pointer !important; font-weight: 900 !important; }

  .toon-main-card {
    background: #fff !important; border: 6px solid #000 !important; height: 320px !important;
    border-radius: 50px !important; display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    box-shadow: 0 15px 0 rgba(0,0,0,0.05) !important; margin-bottom: 30px !important;
  }
  .toon-char-text { font-family: 'Bangers' !important; font-size: 3.5rem !important; text-align: center !important; line-height: 1 !important; padding: 0 20px !important; }
  .toon-label { font-size: 0.7rem !important; opacity: 0.4 !important; font-weight: 900 !important; margin-bottom: 10px !important; }

  .toon-controls { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
  .toon-btn-ctrl {
    padding: 20px !important; border-radius: 30px !important; border: 4px solid #000 !important;
    font-weight: 900 !important; cursor: pointer !important; box-shadow: 0 6px 0 #000 !important;
  }
  .toon-btn-ctrl.skip { background: #ffe66d !important; }
  .toon-btn-ctrl.hit { background: #4ecdc4 !important; }
  .toon-btn-ctrl:active { transform: translateY(3px) !important; box-shadow: 0 3px 0 #000 !important; }

  .toon-result-circle {
    width: 160px !important; height: 160px !important; border: 6px solid #000 !important;
    border-radius: 50% !important; margin: 30px auto !important;
    display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important;
    background: #ffe66d !important; transform: rotate(-5deg) !important;
  }
  .res-val { font-family: 'Bangers' !important; font-size: 5rem !important; line-height: 1 !important; }
  .res-label { font-size: 0.8rem !important; font-weight: 900 !important; }

  .fade-in { animation: toonIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
  @keyframes toonIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
`;

export default WhoAmIGame;

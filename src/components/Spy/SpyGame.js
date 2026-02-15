import React, { useState, useEffect } from 'react';
// // Импорт списка локаций
import { SPY_LOCATIONS } from './spyData';

const SpyGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('setup'); // // setup, distribution, play
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [cards, setCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480); // // 8 минут по умолчанию

  // // Подготовка колоды ролей
  const prepareGame = () => {
    const location = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    let roles = new Array(players).fill(location);
    
    // // Назначаем шпионов
    for (let i = 0; i < spies; i++) {
      let r;
      do { r = Math.floor(Math.random() * players); } while (roles[r] === "ШПИОН");
      roles[r] = "ШПИОН";
    }
    
    setCards(roles);
    setCurrentPlayer(0);
    setGameState('distribution');
  };

  // // Таймер обратного отсчета
  useEffect(() => {
    let timer;
    if (gameState === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="spy-root">
      <style>{spyStyles}</style>
      
      <button className="spy-exit" onClick={onBack}>✖ ЗАКРЫТЬ ДОСЬЕ</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {gameState === 'setup' && (
        <div className="spy-container fade-in">
          <h1 className="spy-title">CLASSIFIED<span>TOP SECRET</span></h1>
          <div className="spy-setup-box">
            <div className="spy-row">
              <span>АГЕНТЫ:</span>
              <div className="spy-stepper">
                <button onClick={() => setPlayers(Math.max(3, players - 1))}>-</button>
                <span className="spy-val">{players}</span>
                <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
              </div>
            </div>
            <div className="spy-row">
              <span>ШПИОНЫ:</span>
              <div className="spy-stepper">
                <button onClick={() => setSpies(Math.max(1, spies - 1))}>-</button>
                <span className="spy-val">{spies}</span>
                <button onClick={() => setSpies(Math.min(players - 1, spies + 1))}>+</button>
              </div>
            </div>
            <button className="spy-main-btn" onClick={prepareGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: РАЗДАЧА РОЛЕЙ */}
      {gameState === 'distribution' && (
        <div className="spy-container fade-in">
          <div className="spy-card-box">
            <h2 className="spy-label">АГЕНТ №{currentPlayer + 1}</h2>
            <div className={`spy-card ${showCard ? 'flipped' : ''}`} onClick={() => setShowCard(!showCard)}>
              <div className="spy-card-inner">
                <div className="spy-card-front">НАЖМИ, ЧТОБЫ УЗНАТЬ РОЛЬ</div>
                <div className="spy-card-back">{cards[currentPlayer]}</div>
              </div>
            </div>
            {showCard && (
              <button className="spy-main-btn" onClick={() => {
                setShowCard(false);
                if (currentPlayer + 1 < players) {
                  setCurrentPlayer(currentPlayer + 1);
                } else {
                  setGameState('play');
                }
              }}> ПРИНЯТО </button>
            )}
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ТАЙМЕР И ИГРА */}
      {gameState === 'play' && (
        <div className="spy-container fade-in">
          <div className="spy-timer-box">
            <h2 className="spy-timer">{formatTime(timeLeft)}</h2>
            <p className="spy-hint">Ищите шпиона, задавая вопросы о локации.</p>
            <button className="spy-main-btn restart" onClick={() => setGameState('setup')}>НОВАЯ ОПЕРАЦИЯ</button>
          </div>
        </div>
      )}
    </div>
  );
};

const spyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap');

  .spy-root {
    position: fixed !important; inset: 0 !important;
    background: #e4e0d9 !important; /* Цвет старой бумаги */
    background-image: radial-gradient(#d1ccc0 1px, transparent 1px) !important;
    background-size: 20px 20px !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    font-family: 'Courier Prime', monospace !important;
    color: #222 !important; z-index: 100000 !important;
  }

  .spy-exit {
    position: absolute !important; top: 20px !important; right: 20px !important;
    background: #000 !important; color: #fff !important; border: none !important;
    padding: 8px 12px !important; font-size: 0.7rem !important; cursor: pointer !important;
  }

  .spy-title {
    font-family: 'Special Elite', cursive !important; font-size: 2.5rem !important;
    text-align: center !important; margin-bottom: 40px !important;
    border-bottom: 3px solid #000 !important; transform: rotate(-2deg) !important;
  }
  .spy-title span { display: block !important; background: #000 !important; color: #fff !important; padding: 5px !important; font-size: 1.2rem !important; }

  .spy-setup-box { background: rgba(0,0,0,0.05) !important; padding: 20px !important; border: 2px dashed #000 !important; width: 300px !important; }

  .spy-row { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 20px !important; font-weight: bold !important; }
  
  .spy-stepper { display: flex !important; align-items: center !important; gap: 10px !important; }
  .spy-stepper button { width: 30px !important; height: 30px !important; border: 1px solid #000 !important; background: none !important; cursor: pointer !important; }
  .spy-val { font-size: 1.2rem !important; width: 25px !important; text-align: center !important; }

  .spy-main-btn {
    width: 100% !important; padding: 15px !important; background: #000 !important;
    color: #fff !important; border: none !important; font-family: 'Special Elite' !important;
    font-size: 1.1rem !important; cursor: pointer !important; transition: 0.3s !important;
  }
  .spy-main-btn:active { transform: scale(0.98) !important; opacity: 0.8 !important; }

  /* Карточка роли */
  .spy-card-box { text-align: center !important; }
  .spy-label { font-family: 'Special Elite' !important; margin-bottom: 20px !important; }
  
  .spy-card {
    width: 280px !important; height: 180px !important; 
    perspective: 1000px !important; cursor: pointer !important; margin-bottom: 30px !important;
  }
  .spy-card-inner {
    position: relative !important; width: 100% !important; height: 100% !important;
    transition: transform 0.6s !important; transform-style: preserve-3d !important;
    border: 2px solid #000 !important; background: #fff !important;
  }
  .spy-card.flipped .spy-card-inner { transform: rotateY(180deg) !important; }
  
  .spy-card-front, .spy-card-back {
    position: absolute !important; width: 100% !important; height: 100% !important;
    backface-visibility: hidden !important; display: flex !important;
    align-items: center !important; justify-content: center !important;
    padding: 20px !important; font-size: 1.2rem !important; font-weight: bold !important;
  }
  .spy-card-back { transform: rotateY(180deg) !important; background: #000 !important; color: #fff !important; }

  .spy-timer { font-size: 4rem !important; font-family: 'Special Elite' !important; margin-bottom: 10px !important; }
  .spy-hint { margin-bottom: 30px !important; opacity: 0.7 !important; font-style: italic !important; }

  .fade-in { animation: fIn 0.4s ease !important; }
  @keyframes fIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default SpyGame;

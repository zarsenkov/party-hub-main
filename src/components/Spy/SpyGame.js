import React, { useState, useEffect } from 'react';
// // Список локаций (структура: { name: "Школа", roles: ["Учитель", "Ученик"...] })
import { SPY_LOCATIONS } from './spyData';

const SpyGame = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [gameState, setGameState] = useState('setup'); // setup, pass, distribution, play
  const [players, setPlayers] = useState(3);
  const [spiesCount, setSpiesCount] = useState(1);
  const [minutes, setMinutes] = useState(8);
  
  const [cards, setCards] = useState([]); // [{location: '...', role: '...'}, ...]
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480);

  // === ЛОГИКА ИГРЫ ===

  // // Подготовка раунда
  const prepareGame = () => {
    const locationObj = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    const locationName = typeof locationObj === 'string' ? locationObj : locationObj.name;
    const locationRoles = locationObj.roles || [];

    let newCards = [];
    // // Заполняем локациями и ролями
    for (let i = 0; i < players; i++) {
      const randomRole = locationRoles.length > 0 
        ? locationRoles[Math.floor(Math.random() * locationRoles.length)]
        : "Житель";
      newCards.push({ location: locationName, role: randomRole, isSpy: false });
    }

    // // Назначаем шпионов
    let assignedSpies = 0;
    while (assignedSpies < spiesCount) {
      let r = Math.floor(Math.random() * players);
      if (!newCards[r].isSpy) {
        newCards[r].isSpy = true;
        newCards[r].location = "ШПИОН";
        newCards[r].role = "Скрывайтесь и вычисляйте локацию";
        assignedSpies++;
      }
    }

    setCards(newCards);
    setCurrentPlayer(0);
    setTimeLeft(minutes * 60);
    setGameState('pass'); // Сначала просим передать телефон
  };

  // // Таймер
  useEffect(() => {
    let timer;
    if (gameState === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="terminal-root">
      <style>{terminalStyles}</style>
      
      <div className="scanline"></div>

      <button className="term-exit" onClick={onBack}>_ABORT_MISSION</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {gameState === 'setup' && (
        <div className="term-container fade-in">
          <div className="term-header">SYSTEM_SETUP v2.0</div>
          <h1 className="term-title">PROJECT_SPY</h1>
          
          <div className="term-box">
            <div className="term-row">
              <label>AGENTS_TOTAL:</label>
              <div className="term-stepper">
                <button onClick={() => setPlayers(Math.max(3, players - 1))}>-</button>
                <span>{players}</span>
                <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
              </div>
            </div>

            <div className="term-row">
              <label>SPY_UNITS:</label>
              <div className="term-stepper">
                <button onClick={() => setSpiesCount(Math.max(1, spiesCount - 1))}>-</button>
                <span>{spiesCount}</span>
                <button onClick={() => setSpiesCount(Math.min(players - 1, spiesCount + 1))}>+</button>
              </div>
            </div>

            <div className="term-row">
              <label>MISSION_TIME:</label>
              <div className="term-stepper">
                <button onClick={() => setMinutes(Math.max(1, minutes - 1))}>-</button>
                <span>{minutes}m</span>
                <button onClick={() => setMinutes(Math.min(15, minutes + 1))}>+</button>
              </div>
            </div>

            <button className="term-btn-main" onClick={prepareGame}>INITIALIZE_START</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА (БЕЗОПАСНОСТЬ) */}
      {gameState === 'pass' && (
        <div className="term-container fade-in">
          <div className="term-alert">ATTENTION!</div>
          <p className="term-text">ПЕРЕДАЙТЕ УСТРОЙСТВО</p>
          <h2 className="agent-number">АГЕНТУ №{currentPlayer + 1}</h2>
          <button className="term-btn-main" onClick={() => setGameState('distribution')}>Я АГЕНТ №{currentPlayer + 1}</button>
        </div>
      )}

      {/* ЭКРАН 3: РОЛЬ */}
      {gameState === 'distribution' && (
        <div className="term-container fade-in">
          <div className="term-header">ID_VERIFICATION</div>
          <div className={`term-card ${showCard ? 'active' : ''}`} onClick={() => setShowCard(!showCard)}>
            {!showCard ? (
              <div className="card-placeholder">HOLD_TO_DECRYPT</div>
            ) : (
              <div className="card-data">
                <div className="data-item"><span>LOC:</span> {cards[currentPlayer].location}</div>
                <div className="data-item"><span>ROLE:</span> {cards[currentPlayer].role}</div>
              </div>
            )}
          </div>
          
          {showCard && (
            <button className="term-btn-main" onClick={() => {
              setShowCard(false);
              if (currentPlayer + 1 < players) {
                setCurrentPlayer(currentPlayer + 1);
                setGameState('pass');
              } else {
                setGameState('play');
              }
            }}>CONFIRM_AND_HIDE</button>
          )}
        </div>
      )}

      {/* ЭКРАН 4: ИГРА */}
      {gameState === 'play' && (
        <div className="term-container fade-in">
          <div className="term-timer">{formatTime(timeLeft)}</div>
          <div className="term-status">MISSION_IN_PROGRESS...</div>
          <p className="term-hint">Вычислите шпиона через перекрестный допрос.</p>
          <div className="term-grid-btns">
             <button className="term-btn-secondary" onClick={() => setGameState('setup')}>RESTART</button>
          </div>
        </div>
      )}
    </div>
  );
};

const terminalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

  .terminal-root {
    position: fixed !important; inset: 0 !important;
    background: #050505 !important;
    color: #00ff41 !important; /* Классический Matrix Green */
    font-family: 'Fira Code', monospace !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    z-index: 100000 !important; overflow: hidden !important;
  }

  /* Эффект сканирующей линии */
  .scanline {
    width: 100%; height: 2px; background: rgba(0, 255, 65, 0.1);
    position: absolute; top: 0; left: 0; pointer-events: none;
    animation: scan 4s linear infinite; z-index: 10;
  }
  @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

  .term-exit {
    position: absolute !important; top: 20px !important; right: 20px !important;
    background: none !important; border: 1px solid #00ff41 !important;
    color: #00ff41 !important; padding: 5px 10px !important; font-size: 10px !important;
    cursor: pointer !important; opacity: 0.5 !important;
  }

  .term-container {
    width: 90% !important; max-width: 400px !important;
    border: 1px solid #00ff41 !important; padding: 30px !important;
    background: rgba(0, 255, 65, 0.02) !important;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.1) !important;
    position: relative !important;
  }

  .term-header { font-size: 10px !important; opacity: 0.6 !important; margin-bottom: 10px !important; letter-spacing: 2px !important; }
  .term-title { font-size: 2rem !important; font-weight: 700 !important; margin-bottom: 30px !important; text-align: center !important; }

  .term-row { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 20px !important; }
  
  .term-stepper { display: flex !important; align-items: center !important; gap: 15px !important; }
  .term-stepper button { 
    background: #00ff41 !important; color: #000 !important; border: none !important;
    width: 30px !important; height: 30px !important; cursor: pointer !important; font-weight: 900 !important;
  }
  .term-stepper span { min-width: 40px !important; text-align: center !important; font-size: 1.2rem !important; }

  .term-btn-main {
    width: 100% !important; background: #00ff41 !important; color: #000 !important;
    border: none !important; padding: 15px !important; font-family: 'Fira Code' !important;
    font-weight: 700 !important; font-size: 1rem !important; cursor: pointer !important;
    margin-top: 10px !important;
  }
  .term-btn-main:hover { background: #00cc33 !important; }

  /* Карточка роли */
  .term-card {
    height: 180px !important; border: 2px dashed #00ff41 !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    margin-bottom: 20px !important; cursor: pointer !important; transition: 0.3s !important;
  }
  .term-card.active { border-style: solid !important; background: rgba(0, 255, 65, 0.05) !important; }

  .data-item { margin-bottom: 10px !important; font-size: 1.1rem !important; }
  .data-item span { opacity: 0.5 !important; font-size: 0.8rem !important; display: block !important; }

  .agent-number { font-size: 2rem !important; text-align: center !important; margin: 20px 0 !important; }
  
  .term-timer { font-size: 4rem !important; text-align: center !important; margin-bottom: 10px !important; text-shadow: 0 0 15px #00ff41 !important; }
  .term-status { text-align: center !important; font-size: 0.8rem !important; margin-bottom: 30px !important; animation: blink 1s infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  .term-btn-secondary {
    width: 100% !important; background: none !important; border: 1px solid #00ff41 !important;
    color: #00ff41 !important; padding: 12px !important; cursor: pointer !important;
    font-family: 'Fira Code' !important;
  }

  .fade-in { animation: fIn 0.3s ease-out !important; }
  @keyframes fIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
`;

export default SpyGame;

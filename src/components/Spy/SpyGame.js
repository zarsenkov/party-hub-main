import React, { useState, useEffect } from 'react';
// // Импорт локаций
import { SPY_LOCATIONS } from './spyData';

const SpyGame = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [gameState, setGameState] = useState('setup'); // setup, pass, distribution, play
  const [players, setPlayers] = useState(3);
  const [spiesCount, setSpiesCount] = useState(1);
  const [minutes, setMinutes] = useState(8);
  
  const [cards, setCards] = useState([]); 
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(480);

  // === ЛОГИКА ===

  // // Инициализация игры и перемешивание ролей
  const prepareGame = () => {
    const locationObj = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    const locationName = typeof locationObj === 'string' ? locationObj : locationObj.name;
    const locationRoles = locationObj.roles || [];

    let newCards = [];
    // // Заполнение обычными агентами
    for (let i = 0; i < players; i++) {
      const randomRole = locationRoles.length > 0 
        ? locationRoles[Math.floor(Math.random() * locationRoles.length)]
        : "Оперативник";
      newCards.push({ location: locationName, role: randomRole, isSpy: false });
    }

    // // Внедрение шпионов
    let assignedSpies = 0;
    while (assignedSpies < spiesCount) {
      let r = Math.floor(Math.random() * players);
      if (!newCards[r].isSpy) {
        newCards[r].isSpy = true;
        newCards[r].location = "НЕИЗВЕСТНО";
        newCards[r].role = "ШПИОН";
        assignedSpies++;
      }
    }

    setCards(newCards);
    setCurrentPlayer(0);
    setTimeLeft(minutes * 60);
    setGameState('pass');
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
    <div className="dossier-root">
      <style>{dossierStyles}</style>
      
      {/* Кнопка выхода оформлена как закрытие папки */}
      <button className="dossier-exit" onClick={onBack}>ЗАКРЫТЬ ДЕЛО №00-{players}</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {gameState === 'setup' && (
        <div className="folder-container fade-in">
          <div className="stamp">CONFIDENTIAL</div>
          <h1 className="folder-title">ОПЕРАЦИЯ: ШПИОН</h1>
          
          <div className="setup-fields">
            <div className="field-row">
              <span className="typewriter">КОЛ-ВО АГЕНТОВ:</span>
              <div className="stepper">
                <button onClick={() => setPlayers(Math.max(3, players - 1))}>-</button>
                <span className="val">{players}</span>
                <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
              </div>
            </div>

            <div className="field-row">
              <span className="typewriter">ВРАЖЕСКИЕ КРОТЫ:</span>
              <div className="stepper">
                <button onClick={() => setSpiesCount(Math.max(1, spiesCount - 1))}>-</button>
                <span className="val">{spiesCount}</span>
                <button onClick={() => setSpiesCount(Math.min(players - 1, spiesCount + 1))}>+</button>
              </div>
            </div>

            <div className="field-row">
              <span className="typewriter">ВРЕМЯ СВЯЗИ (МИН):</span>
              <div className="stepper">
                <button onClick={() => setMinutes(Math.max(1, minutes - 1))}>-</button>
                <span className="val">{minutes}</span>
                <button onClick={() => setMinutes(Math.min(15, minutes + 1))}>+</button>
              </div>
            </div>

            <button className="dossier-btn-main" onClick={prepareGame}>СФОРМИРОВАТЬ ОТРЯД</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ПЕРЕДАЧА ТЕЛЕФОНА */}
      {gameState === 'pass' && (
        <div className="folder-container fade-in">
          <div className="security-tape">TOP SECRET</div>
          <p className="typewriter-msg">ПЕРЕДАЙТЕ ДОСЬЕ СЛЕДУЮЩЕМУ АГЕНТУ</p>
          <div className="agent-id">АГЕНТ №{currentPlayer + 1}</div>
          <button className="dossier-btn-main" onClick={() => setGameState('distribution')}>ПОЛУЧИТЬ ДОСТУП</button>
        </div>
      )}

      {/* ЭКРАН 3: ПРОСМОТР РОЛИ */}
      {gameState === 'distribution' && (
        <div className="folder-container fade-in">
          <h3 className="typewriter-header">ЛИЧНОЕ ДЕЛО №{currentPlayer + 104}</h3>
          
          <div className="report-box">
            <div className="report-line">
              <span className="label">ЛОКАЦИЯ:</span>
              <span className={`censored ${showCard ? 'revealed' : ''}`} onClick={() => setShowCard(true)}>
                {cards[currentPlayer].location}
              </span>
            </div>
            <div className="report-line">
              <span className="label">СТАТУС:</span>
              <span className={`censored red ${showCard ? 'revealed' : ''}`} onClick={() => setShowCard(true)}>
                {cards[currentPlayer].role}
              </span>
            </div>
          </div>

          {!showCard && <p className="hint-blink">Нажмите на черную полосу для расшифровки</p>}
          
          {showCard && (
            <button className="dossier-btn-main" onClick={() => {
              setShowCard(false);
              if (currentPlayer + 1 < players) {
                setCurrentPlayer(currentPlayer + 1);
                setGameState('pass');
              } else {
                setGameState('play');
              }
            }}>УНИЧТОЖИТЬ ПОСЛЕ ЧТЕНИЯ</button>
          )}
        </div>
      )}

      {/* ЭКРАН 4: ТАЙМЕР */}
      {gameState === 'play' && (
        <div className="folder-container fade-in">
          <div className="timer-display">{formatTime(timeLeft)}</div>
          <div className="mission-status">ДОПРОС ВЕДЕТСЯ...</div>
          <div className="divider"></div>
          <button className="dossier-btn-secondary" onClick={() => setGameState('setup')}>АРХИВИРОВАТЬ ДЕЛО</button>
        </div>
      )}
    </div>
  );
};

// // CSS СТИЛИ: DOSSIER NOIR
const dossierStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');

  .dossier-root {
    position: fixed !important; inset: 0 !important;
    background: #c5bba8 !important; /* Цвет папки */
    background-image: url('https://www.transparenttextures.com/patterns/paper.png') !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-family: 'Courier Prime', monospace !important;
    color: #2b2b2b !important; z-index: 100000 !important;
  }

  .dossier-exit {
    position: absolute !important; top: 20px !important; right: 20px !important;
    background: #8b2626 !important; color: #fff !important; border: none !important;
    padding: 5px 15px !important; font-size: 10px !important; font-family: 'Special Elite' !important;
    cursor: pointer !important; box-shadow: 2px 2px 5px rgba(0,0,0,0.3) !important;
  }

  .folder-container {
    width: 85% !important; max-width: 380px !important;
    background: #e0d7c6 !important;
    padding: 40px 30px !important;
    box-shadow: 10px 10px 0px rgba(0,0,0,0.1) !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
    position: relative !important;
  }

  /* Штамп */
  .stamp {
    position: absolute !important; top: 10px !important; right: 10px !important;
    border: 3px solid #8b2626 !important; color: #8b2626 !important;
    padding: 5px 10px !important; font-family: 'Special Elite' !important;
    transform: rotate(15deg) !important; font-weight: bold !important;
    opacity: 0.8 !important; pointer-events: none !important;
  }

  .folder-title { font-family: 'Special Elite' !important; font-size: 1.8rem !important; margin-bottom: 30px !important; text-align: center !important; border-bottom: 2px solid #000 !important; padding-bottom: 10px !important; }

  .field-row { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 25px !important; }
  .typewriter { font-size: 0.9rem !important; font-weight: bold !important; }

  .stepper { display: flex !important; align-items: center !important; border: 2px solid #000 !important; }
  .stepper button { background: #000 !important; color: #fff !important; border: none !important; width: 30px !important; height: 30px !important; cursor: pointer !important; font-size: 1.2rem !important; }
  .stepper .val { width: 40px !important; text-align: center !important; font-weight: bold !important; }

  .dossier-btn-main {
    width: 100% !important; background: #2b2b2b !important; color: #fff !important;
    border: none !important; padding: 15px !important; font-family: 'Special Elite' !important;
    font-size: 1.1rem !important; cursor: pointer !important; margin-top: 20px !important;
    box-shadow: 4px 4px 0px #8b2626 !important;
  }
  .dossier-btn-main:active { transform: translate(2px, 2px) !important; box-shadow: 0px 0px 0px #000 !important; }

  /* Цензура */
  .report-box { margin: 30px 0 !important; background: rgba(0,0,0,0.03) !important; padding: 20px !important; border-left: 5px solid #000 !important; }
  .report-line { margin-bottom: 15px !important; }
  .report-line .label { display: block !important; font-size: 0.7rem !important; opacity: 0.6 !important; }
  
  .censored {
    display: inline-block !important; background: #000 !important; color: #000 !important;
    padding: 2px 10px !important; cursor: pointer !important; transition: 0.2s !important;
    min-width: 100px !important; border-radius: 2px !important;
  }
  .censored.revealed { background: transparent !important; color: #2b2b2b !important; border-bottom: 1px dashed #000 !important; }
  .censored.red.revealed { color: #8b2626 !important; font-weight: bold !important; }

  .agent-id { font-family: 'Special Elite' !important; font-size: 2.5rem !important; text-align: center !important; margin: 20px 0 !important; }
  .security-tape { background: #000 !important; color: #fff !important; text-align: center !important; padding: 5px !important; font-size: 0.8rem !important; margin-bottom: 20px !important; }

  .timer-display { font-family: 'Special Elite' !important; font-size: 4rem !important; text-align: center !important; color: #8b2626 !important; }
  .mission-status { text-align: center !important; font-weight: bold !important; font-size: 0.8rem !important; letter-spacing: 3px !important; margin-bottom: 30px !important; }

  .hint-blink { font-size: 0.7rem !important; text-align: center !important; animation: blink 1.5s infinite; }
  @keyframes blink { 50% { opacity: 0.3; } }

  .divider { border-top: 1px dashed #000 !important; margin: 20px 0 !important; }
  .dossier-btn-secondary { background: none !important; border: 2px solid #000 !important; width: 100% !important; padding: 10px !important; font-family: 'Special Elite' !important; cursor: pointer !important; }

  .fade-in { animation: fIn 0.3s ease !important; }
  @keyframes fIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
`;

export default SpyGame;

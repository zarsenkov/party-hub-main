import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

// // Компонент игры "Шпион" с читабельным дизайном "Доска расследований"
const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); 
  const [players, setPlayers] = useState(4);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Ссылка на главную LoveCouple
  const goHome = () => window.location.href = 'https://lovecouple.ru';

  // // Логика подготовки раунда
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) newRoles[i] = 'spy';
    setRoles(newRoles.sort(() => Math.random() - 0.5));
    setCurrentPlayer(0);
    setScreen('transit');
  };

  // // Работа таймера
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  return (
    <div className="board-root">
      <style>{boardStyles}</style>

      {/* Кнопка назад */}
      <button className="nav-back" onClick={goHome}>← В МЕНЮ</button>

      {/* 1. НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="view fade-in">
          <div className="polaroid setup-card">
            <h2 className="stamp-title">ДЕЛО №2026</h2>
            <div className="setup-rows">
              <div className="setup-item">
                <label>УЧАСТНИКИ</label>
                <div className="counter-box">
                  <button onClick={() => setPlayers(Math.max(3, players - 1))}>–</button>
                  <span>{players}</span>
                  <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
                </div>
              </div>
              <div className="setup-item">
                <label>ШПИОНЫ</label>
                <div className="counter-box red">
                  <button onClick={() => setSpies(Math.max(1, spies - 1))}>–</button>
                  <span>{spies}</span>
                  <button onClick={() => setSpies(Math.min(3, spies + 1))}>+</button>
                </div>
              </div>
            </div>
          </div>
          <button className="main-action-btn" onClick={prepareGame}>НАЧАТЬ ПОИСК</button>
        </div>
      )}

      {/* 2. ТРАНЗИТ */}
      {screen === 'transit' && (
        <div className="view fade-in">
          <div className="sticky-note">
            <div className="pin-head"></div>
            <div className="note-body">
              <p>СЛЕДУЮЩИЙ</p>
              <h3>АГЕНТ #{currentPlayer + 1}</h3>
              <div className="divider"></div>
              <p className="small">Убедись, что никто не подглядывает</p>
            </div>
          </div>
          <button className="main-action-btn" onClick={() => setScreen('role')}>УЗНАТЬ РОЛЬ</button>
        </div>
      )}

      {/* 3. ПРОСМОТР РОЛИ */}
      {screen === 'role' && (
        <div className="view fade-in">
          <div className="polaroid role-card">
            <div className="photo-placeholder">
              {roles[currentPlayer] === 'spy' ? '🕵️' : '📍'}
            </div>
            <div className="role-details">
              {roles[currentPlayer] === 'spy' ? (
                <div className="spy-info">
                  <h3 className="red-label">ТЫ ШПИОН</h3>
                  <p>Твоя задача — слушать и угадать место, не выдав себя.</p>
                </div>
              ) : (
                <div className="player-info">
                  <h3 className="blue-label">ТЫ В ИГРЕ</h3>
                  <p className="loc-hint">ЛОКАЦИЯ:</p>
                  <div className="loc-display">{location}</div>
                </div>
              )}
            </div>
          </div>
          <button className="main-action-btn dark" onClick={() => {
            if (currentPlayer + 1 < players) {
              setCurrentPlayer(currentPlayer + 1);
              setScreen('transit');
            } else {
              setScreen('play');
              setIsTimerRunning(true);
            }
          }}>СКРЫТЬ И ПЕРЕДАТЬ</button>
        </div>
      )}

      {/* 4. ТАЙМЕР */}
      {screen === 'play' && (
        <div className="view fade-in">
          <div className="timer-paper">
            <div className="timer-val">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="timer-label">ВРЕМЯ ДОПРОСА</p>
          </div>
          <div className="play-footer">
            <button className="btn-secondary" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? 'ПАУЗА' : 'СТАРТ'}
            </button>
            <button className="btn-secondary reset" onClick={() => setScreen('setup')}>СБРОС</button>
          </div>
        </div>
      )}
    </div>
  );
};

const boardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Permanent+Marker&display=swap');

  .board-root {
    position: fixed; inset: 0; width: 100vw; height: 100vh;
    background: #4a3728;
    background-image: url('https://www.transparenttextures.com/patterns/cork-board.png');
    font-family: 'Inter', sans-serif;
    color: #333; overflow: hidden;
  }

  .nav-back {
    position: absolute; top: 20px; left: 20px; z-index: 10;
    background: rgba(0,0,0,0.3); border: none; color: white;
    padding: 8px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; cursor: pointer;
  }

  .view {
    height: 100%; width: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 20px;
  }

  /* Полароид */
  .polaroid {
    background: white; padding: 15px 15px 35px 15px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
    width: 90%; max-width: 340px; transform: rotate(-1deg);
    margin-bottom: 40px;
  }

  .stamp-title { 
    font-family: 'Permanent Marker', cursive; 
    font-size: 1.5rem; text-align: center; margin-bottom: 25px; color: #555;
  }

  .setup-rows { display: flex; flex-direction: column; gap: 20px; }
  .setup-item label { display: block; font-size: 0.7rem; font-weight: 900; opacity: 0.6; margin-bottom: 8px; }
  
  .counter-box { 
    display: flex; justify-content: space-between; align-items: center;
    background: #f0f0f0; border-radius: 12px; padding: 5px;
  }
  .counter-box span { font-size: 1.5rem; font-weight: 900; }
  .counter-box button { 
    width: 40px; height: 40px; border-radius: 8px; border: none;
    background: white; font-size: 1.2rem; font-weight: 900; cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .counter-box.red span { color: #d32f2f; }

  /* Основная кнопка */
  .main-action-btn {
    background: #d32f2f; color: white; border: none;
    padding: 20px 50px; font-size: 1.1rem; font-weight: 900;
    border-radius: 50px; cursor: pointer; transform: rotate(1deg);
    box-shadow: 0 10px 20px rgba(211, 47, 47, 0.3);
  }
  .main-action-btn.dark { background: #222; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

  /* Стикер (Транзит) */
  .sticky-note {
    background: #ffeb3b; width: 280px; padding: 30px;
    box-shadow: 5px 10px 20px rgba(0,0,0,0.2);
    transform: rotate(2deg); margin-bottom: 40px; position: relative;
  }
  .pin-head {
    width: 16px; height: 16px; background: #f44336; border-radius: 50%;
    position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .note-body { text-align: center; }
  .note-body h3 { font-size: 1.8rem; margin: 10px 0; font-weight: 900; }
  .divider { height: 2px; background: rgba(0,0,0,0.1); margin: 15px 0; }
  .small { font-size: 0.8rem; opacity: 0.6; }

  /* Карточка роли */
  .photo-placeholder {
    height: 180px; background: #222; display: flex; align-items: center;
    justify-content: center; font-size: 4rem; margin-bottom: 20px;
  }
  .red-label { color: #d32f2f; font-family: 'Permanent Marker', cursive; font-size: 2rem; margin-bottom: 10px; }
  .blue-label { color: #1976d2; font-family: 'Permanent Marker', cursive; font-size: 2rem; margin-bottom: 10px; }
  .loc-hint { font-size: 0.7rem; font-weight: 900; opacity: 0.5; margin-top: 10px; }
  .loc-display { font-size: 1.6rem; font-weight: 900; color: #1976d2; text-transform: uppercase; }
  .role-details p { font-size: 0.9rem; line-height: 1.4; color: #555; }

  /* Таймер */
  .timer-paper {
    background: white; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    text-align: center; border-radius: 4px; border-top: 8px solid #333;
  }
  .timer-val { font-size: 5rem; font-weight: 900; font-variant-numeric: tabular-nums; }
  .timer-label { font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; opacity: 0.4; }

  .play-footer { display: flex; gap: 15px; margin-top: 50px; }
  .btn-secondary {
    background: rgba(255,255,255,0.1); border: 2px solid white;
    color: white; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer;
  }
  .btn-secondary.reset { border-color: #d32f2f; color: #d32f2f; }

  .fade-in { animation: fIn 0.4s ease-out; }
  @keyframes fIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

export default SpyGame;

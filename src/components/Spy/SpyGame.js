import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

// // Игра "Шпион" в стиле "Доска расследования"
const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); 
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Ссылка на главную
  const goHome = () => window.location.href = 'https://lovecouple.ru';

  // // Начало операции
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) newRoles[i] = 'spy';
    setRoles(newRoles.sort(() => Math.random() - 0.5));
    setCurrentPlayer(0);
    setScreen('transit');
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  return (
    <div className="investigation-root">
      <style>{boardStyles}</style>

      <button className="back-to-hq" onClick={goHome}>← В ШТАБ</button>

      {/* ЭКРАН 1: СБОР УЛИК (НАСТРОЙКИ) */}
      {screen === 'setup' && (
        <div className="board-view fade-in">
          <div className="polaroid setup-photo">
            <div className="photo-area">
              <h2>КТО ПОД ПОДОЗРЕНИЕМ?</h2>
            </div>
            <div className="photo-desc">
              <div className="row">
                <span>ПОДОЗРЕВАЕМЫЕ:</span>
                <div className="counter">
                  <button onClick={() => setPlayers(Math.max(3, players - 1))}>–</button>
                  <b>{players}</b>
                  <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
                </div>
              </div>
              <div className="row">
                <span>ШПИОНЫ (КРОТЫ):</span>
                <div className="counter">
                  <button onClick={() => setSpies(Math.max(1, spies - 1))}>–</button>
                  <b className="spy-red">{spies}</b>
                  <button onClick={() => setSpies(Math.min(3, spies + 1))}>+</button>
                </div>
              </div>
            </div>
          </div>
          <button className="pin-button" onClick={prepareGame}>НАЧАТЬ ПОИСК</button>
        </div>
      )}

      {/* ЭКРАН 2: ТРАНЗИТ (ПЕРЕДАЧА) */}
      {screen === 'transit' && (
        <div className="board-view transit-view fade-in">
          <div className="sticky-note">
            <div className="pin red"></div>
            <div className="note-content">
              <h3>СЛЕДУЮЩИЙ АГЕНТ:</h3>
              <div className="agent-number">№{currentPlayer + 1}</div>
              <p>Возьми устройство и нажми на кнопку ниже.</p>
            </div>
          </div>
          <button className="pin-button" onClick={() => setScreen('role')}>ПОСМОТРЕТЬ ФАЙЛ</button>
        </div>
      )}

      {/* ЭКРАН 3: УЛИКА (РОЛЬ) */}
      {screen === 'role' && (
        <div className="board-view fade-in">
          <div className="polaroid role-photo">
            <div className="photo-area bg-dark">
              {roles[currentPlayer] === 'spy' ? (
                <div className="spy-mark">?</div>
              ) : (
                <div className="loc-mark">📍</div>
              )}
            </div>
            <div className="photo-desc">
              {roles[currentPlayer] === 'spy' ? (
                <div className="role-text">
                  <h3 className="red-stamp">ШПИОН</h3>
                  <p>Твоя цель: Узнать локацию по разговорам.</p>
                </div>
              ) : (
                <div className="role-text">
                  <h3 className="blue-stamp">АГЕНТ</h3>
                  <p>ОБЪЕКТ:</p>
                  <div className="loc-name">{location}</div>
                </div>
              )}
            </div>
          </div>
          <button className="pin-button dark" onClick={() => {
            if (currentPlayer + 1 < players) {
              setCurrentPlayer(currentPlayer + 1);
              setScreen('transit');
            } else {
              setScreen('play');
              setIsTimerRunning(true);
            }
          }}>ПРИКОЛОТЬ К ДОСКЕ</button>
        </div>
      )}

      {/* ЭКРАН 4: ТАЙМЕР */}
      {screen === 'play' && (
        <div className="board-view play-view fade-in">
          <div className="timer-clip">
            <div className="clip-metal"></div>
            <div className="timer-val">
               {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
            </div>
            <p>ДО ПЕРЕХВАТА</p>
          </div>
          
          <div className="play-actions">
            <button className="action-btn" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? 'СТОП' : 'ПУСК'}
            </button>
            <button className="action-btn reset" onClick={() => setScreen('setup')}>НОВОЕ ДЕЛО</button>
          </div>
        </div>
      )}
    </div>
  );
};

const boardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Kalam:wght@400;700&display=swap');

  .investigation-root {
    position: fixed; inset: 0; width: 100vw; height: 100vh;
    background: #4d3a2e;
    background-image: url('https://www.transparenttextures.com/patterns/cork-board.png');
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Kalam', cursive;
  }

  .back-to-hq {
    position: absolute; top: 15px; left: 15px; z-index: 50;
    background: rgba(255,255,255,0.1); border: 1px dashed white;
    color: white; padding: 5px 10px; font-size: 0.8rem; cursor: pointer;
  }

  .board-view {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 20px;
  }

  /* Полароид */
  .polaroid {
    background: #fff; padding: 15px 15px 40px 15px;
    box-shadow: 5px 10px 30px rgba(0,0,0,0.5);
    transform: rotate(-2deg); width: 85%; max-width: 320px;
    margin-bottom: 30px;
  }
  .photo-area {
    background: #e0e0e0; height: 250px; display: flex;
    align-items: center; justify-content: center; text-align: center;
    border: 1px solid #ccc; overflow: hidden;
  }
  .photo-area h2 { font-size: 1.5rem; padding: 20px; color: #333; }
  .photo-area.bg-dark { background: #222; color: #fff; }

  .photo-desc { margin-top: 15px; color: #333; }
  .photo-desc .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  
  .counter { display: flex; align-items: center; gap: 15px; }
  .counter button { background: #333; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
  .counter b { font-size: 1.4rem; }
  .spy-red { color: #d32f2f; }

  /* Кнопки на доске */
  .pin-button {
    background: #d32f2f; color: #fff; border: none;
    padding: 15px 40px; font-size: 1.2rem; font-weight: bold;
    font-family: 'Permanent Marker', cursive;
    box-shadow: 0 4px 0 #8a1d1d; cursor: pointer;
    transform: rotate(1deg);
  }
  .pin-button.dark { background: #333; box-shadow: 0 4px 0 #000; }

  /* Стикеров (Transit) */
  .sticky-note {
    background: #ffeb3b; padding: 30px; width: 280px;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
    position: relative; transform: rotate(3deg); margin-bottom: 40px;
  }
  .pin {
    width: 20px; height: 20px; border-radius: 50%;
    position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
    box-shadow: 0 2px 5px rgba(0,0,0,0.4);
  }
  .pin.red { background: #f44336; }
  
  .note-content { text-align: center; color: #555; }
  .agent-number { font-size: 4rem; font-weight: bold; color: #333; line-height: 1; }

  /* Роли */
  .red-stamp { color: #d32f2f; border: 3px solid #d32f2f; display: inline-block; padding: 5px 15px; transform: rotate(-10deg); font-size: 2rem; }
  .blue-stamp { color: #1976d2; border: 3px solid #1976d2; display: inline-block; padding: 5px 15px; transform: rotate(5deg); font-size: 2rem; }
  .loc-name { font-size: 1.8rem; font-weight: bold; margin-top: 5px; color: #1976d2; }
  .spy-mark { font-size: 6rem; font-family: 'Permanent Marker', cursive; }
  .loc-mark { font-size: 6rem; }

  /* Таймер */
  .timer-clip {
    background: #fff; padding: 40px; width: 280px;
    border-top: 20px solid #555; text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }
  .timer-val { font-size: 5rem; font-family: 'Permanent Marker', cursive; line-height: 1; margin-bottom: 10px; }
  
  .play-actions { display: flex; gap: 15px; margin-top: 40px; }
  .action-btn { background: #fff; border: 2px solid #333; padding: 10px 20px; font-weight: bold; cursor: pointer; }
  .action-btn.reset { background: #333; color: #fff; }

  .fade-in { animation: fIn 0.4s ease-out; }
  @keyframes fIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
`;

export default SpyGame;

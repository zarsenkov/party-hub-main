import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

// // Иконка для шпиона
const SpyIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FF0055" strokeWidth="1.5">
    <path d="M17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 18h14v-6.5C19 8.5 16.5 6 13.5 6h-3C7.5 6 5 8.5 5 11.5V18zM12 2v4M4.5 9h15" />
  </svg>
);

const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); // // setup, transit, role, play
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Подготовка игры
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) newRoles[i] = 'spy';
    setRoles(newRoles.sort(() => Math.random() - 0.5));
    setCurrentPlayer(0);
    setScreen('transit'); // // Переходим на экран передачи
  };

  return (
    <div className="spy-glass-root">
      <style>{glassStyles}</style>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="view fade-in">
          <h1 className="main-title">SPY <span className="neon-text">NEO</span></h1>
          <div className="glass-card">
            <div className="setting">
              <span>Игроков: <b>{players}</b></span>
              <input type="range" min="3" max="10" value={players} onChange={e => setPlayers(Number(e.target.value))} />
            </div>
            <div className="setting">
              <span>Шпионов: <b>{spies}</b></span>
              <input type="range" min="1" max="2" value={spies} onChange={e => setSpies(Number(e.target.value))} />
            </div>
          </div>
          <button className="neon-btn" onClick={prepareGame}>ПОЕХАЛИ</button>
        </div>
      )}

      {/* ЭКРАН 2: ЭКРАН ПЕРЕДАЧИ (ЧТОБЫ НЕ ПОДГЛЯДЫВАЛИ) */}
      {screen === 'transit' && (
        <div className="view fade-in">
          <div className="transit-box">
            <div className="circle-num">{currentPlayer + 1}</div>
            <h2>ПЕРЕДАЙТЕ ТЕЛЕФОН</h2>
            <p>Сейчас очередь Игрока {currentPlayer + 1}</p>
          </div>
          <button className="neon-btn" onClick={() => setScreen('role')}>Я ГОТОВ, ПОКАЖИ РОЛЬ</button>
        </div>
      )}

      {/* ЭКРАН 3: ПРОСМОТР РОЛИ */}
      {screen === 'role' && (
        <div className="view fade-in">
          <div className="glass-card role-reveal">
            {roles[currentPlayer] === 'spy' ? (
              <>
                <SpyIcon />
                <h2 className="role-spy-text">ТЫ ШПИОН</h2>
                <p>Твоя задача: не выдать себя и узнать локацию.</p>
              </>
            ) : (
              <>
                <div className="loc-icon">📍</div>
                <h2 className="role-player-text">ТЫ В ИГРЕ</h2>
                <p>Локация:</p>
                <div className="loc-name">{location}</div>
              </>
            )}
          </div>
          <button className="neon-btn" onClick={() => {
            if (currentPlayer + 1 < players) {
              setCurrentPlayer(currentPlayer + 1);
              setScreen('transit');
            } else {
              setScreen('play');
              setIsTimerRunning(true);
            }
          }}>
            ПОНЯТНО, СКРЫТЬ
          </button>
        </div>
      )}

      {/* ЭКРАН 4: ИГРА */}
      {screen === 'play' && (
        <div className="view fade-in">
          <div className="timer-box">
            <div className="timer-val">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>
            <p>Обсуждайте! Кто ведет себя странно?</p>
          </div>
          <div className="glass-card loc-list">
            <h4>Возможные локации:</h4>
            <div className="loc-grid">
              {SPY_LOCATIONS.slice(0, 6).map(l => <span key={l}>{l}</span>)}
              <span>...и другие</span>
            </div>
          </div>
          <button className="neon-btn secondary" onClick={() => setScreen('setup')}>ЗАКОНЧИТЬ ИГРУ</button>
        </div>
      )}
    </div>
  );
};

const glassStyles = `
  .spy-glass-root {
    position: fixed; inset: 0;
    background: #08091a;
    background-image: radial-gradient(circle at 20% 20%, #1a1b3a 0%, #08091a 100%);
    color: white; font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column; padding: 20px;
  }

  .main-title { font-size: 3rem; font-weight: 900; text-align: center; margin-bottom: 40px; letter-spacing: -1px; }
  .neon-text { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }

  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px; padding: 30px; margin-bottom: 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .setting { margin-bottom: 25px; }
  .setting span { display: block; margin-bottom: 12px; font-size: 1.1rem; }
  .setting b { color: #00f2ff; font-size: 1.4rem; }

  input[type=range] { width: 100%; height: 6px; border-radius: 5px; accent-color: #00f2ff; }

  .neon-btn {
    background: #00f2ff; color: #08091a; border: none; padding: 20px;
    border-radius: 20px; font-weight: 800; font-size: 1rem; text-transform: uppercase;
    box-shadow: 0 0 20px rgba(0, 242, 255, 0.4); cursor: pointer;
  }
  .neon-btn.secondary { background: rgba(255,255,255,0.1); color: white; box-shadow: none; margin-top: auto; }

  .transit-box { text-align: center; margin-bottom: 40px; }
  .circle-num {
    width: 80px; height: 80px; border: 3px solid #00f2ff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; font-weight: 900; margin: 0 auto 20px; color: #00f2ff;
  }

  .role-reveal { text-align: center; padding: 50px 20px; }
  .role-spy-text { color: #FF0055; text-shadow: 0 0 15px #FF0055; font-size: 2rem; margin: 20px 0; }
  .role-player-text { color: #00f2ff; font-size: 2rem; margin: 20px 0; }
  .loc-name { font-size: 1.8rem; font-weight: 800; margin-top: 15px; color: white; }
  .loc-icon { font-size: 3rem; }

  .timer-val { font-size: 5rem; font-weight: 900; text-align: center; color: #00f2ff; }
  .loc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
  .loc-grid span { font-size: 0.7rem; opacity: 0.5; padding: 5px; border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; }

  .fade-in { animation: fIn 0.3s ease; }
  @keyframes fIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

export default SpyGame;

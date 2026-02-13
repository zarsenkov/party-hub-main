import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

// // Иконка глаза (для скрытия/показа роли)
const EyeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); // // setup, deal, play
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // // 5 минут на раунд
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Инициализация игры
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);

    // // Создаем массив ролей
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) {
      newRoles[i] = 'spy';
    }
    // // Перемешиваем роли
    newRoles = newRoles.sort(() => Math.random() - 0.5);
    
    setRoles(newRoles);
    setCurrentPlayer(0);
    setShowRole(false);
    setScreen('deal');
  };

  // // Таймер
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  return (
    <div className="spy-root">
      <style>{spyStyles}</style>

      {/* HEADER */}
      <header className="spy-header">
        <button className="back-btn" onClick={() => window.location.reload()}>←</button>
        <div className="spy-logo">SPY / ШПИОН</div>
        <div className="empty-box"></div>
      </header>

      <main className="spy-main">
        {/* ЭКРАН НАСТРОЕК */}
        {screen === 'setup' && (
          <div className="view fade-in">
            <h1 className="spy-title">Настройка</h1>
            <div className="setting-card">
              <label>Игроков: {players}</label>
              <input type="range" min="3" max="12" value={players} onChange={(e) => setPlayers(parseInt(e.target.value))} />
            </div>
            <div className="setting-card">
              <label>Шпионов: {spies}</label>
              <input type="range" min="1" max="3" value={spies} onChange={(e) => setSpies(parseInt(e.target.value))} />
            </div>
            <button className="btn-spy-main" onClick={prepareGame}>РАЗДАТЬ РОЛИ</button>
          </div>
        )}

        {/* ЭКРАН РАЗДАЧИ (ПЕРЕДАЧА ТЕЛЕФОНА) */}
        {screen === 'deal' && (
          <div className="view fade-in">
            <div className="player-indicator">Игрок {currentPlayer + 1}</div>
            
            <div className={`role-card ${showRole ? 'flipped' : ''}`} onClick={() => setShowRole(!showRole)}>
              {!showRole ? (
                <div className="card-face front">
                  <EyeIcon />
                  <p>Нажми, чтобы узнать роль</p>
                </div>
              ) : (
                <div className="card-face back">
                  <div className="role-type">{roles[currentPlayer] === 'spy' ? 'ТЫ ШПИОН 🕵️' : 'ТЫ В ИГРЕ ✅'}</div>
                  <div className="role-loc">{roles[currentPlayer] === 'spy' ? 'Узнай локацию у других' : `Локация: ${location}`}</div>
                  <p className="tap-hint">Нажми еще раз, чтобы скрыть</p>
                </div>
              )}
            </div>

            {!showRole && (
              <button className="btn-spy-next" onClick={() => {
                if (currentPlayer + 1 < players) {
                  setCurrentPlayer(currentPlayer + 1);
                } else {
                  setScreen('play');
                  setIsTimerRunning(true);
                }
              }}>
                {currentPlayer + 1 < players ? 'СЛЕДУЮЩИЙ ИГРОК' : 'НАЧАТЬ ОБСУЖДЕНИЕ'}
              </button>
            )}
          </div>
        )}

        {/* ЭКРАН ИГРЫ (ТАЙМЕР) */}
        {screen === 'play' && (
          <div className="view fade-in">
            <div className="timer-display ${timeLeft < 30 ? 'danger' : ''}">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="play-hint">Шпион должен вычислить локацию, а игроки — шпиона.</p>
            <div className="play-actions">
               <button className="btn-spy-main" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                 {isTimerRunning ? 'ПАУЗА' : 'ПУСК'}
               </button>
               <button className="btn-spy-outline" onClick={() => setScreen('setup')}>ЗАКОНЧИТЬ</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// // СТИЛИ В ТВОЕМ НОВОМ СТИЛЕ
const spyStyles = `
  .spy-root {
    position: fixed; inset: 0;
    background: #0F0C29; color: #fff;
    font-family: 'Montserrat', sans-serif; display: flex; flex-direction: column;
  }
  .spy-header {
    height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;
  }
  .spy-logo { font-weight: 900; letter-spacing: 2px; font-size: 0.9rem; color: #E94560; }
  
  .spy-main { flex: 1; display: flex; flex-direction: column; padding: 25px; }
  .view { flex: 1; display: flex; flex-direction: column; justify-content: center; }

  .spy-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; }
  
  .setting-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 20px; margin-bottom: 20px; }
  .setting-card label { display: block; margin-bottom: 10px; font-weight: 700; opacity: 0.7; }
  
  input[type=range] { width: 100%; accent-color: #E94560; }

  .btn-spy-main {
    background: #E94560; color: white; border: none; padding: 22px; border-radius: 18px;
    font-weight: 900; font-size: 1.1rem; cursor: pointer; box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
  }

  .player-indicator { text-align: center; font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; color: #E94560; }

  /* КАРТОЧКА РОЛИ */
  .role-card {
    background: #fff; color: #0F0C29; border-radius: 30px; min-height: 50vh;
    display: flex; align-items: center; justify-content: center; text-align: center;
    padding: 30px; cursor: pointer; margin-bottom: 20px;
    transition: 0.6s transform; transform-style: preserve-3d;
  }
  .role-type { font-size: 2rem; font-weight: 900; margin-bottom: 15px; }
  .role-loc { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-style: italic; }
  .tap-hint { margin-top: 30px; font-size: 0.8rem; opacity: 0.4; font-weight: 700; }

  .btn-spy-next {
    background: white; color: #0F0C29; border: none; padding: 20px; border-radius: 15px; font-weight: 900;
  }

  .timer-display { font-size: 6rem; font-weight: 900; text-align: center; margin-bottom: 20px; }
  .timer-display.danger { color: #E94560; animation: pulse 1s infinite; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

  .play-actions { display: flex; flex-direction: column; gap: 15px; }
  .btn-spy-outline { background: none; border: 2px solid rgba(255,255,255,0.2); color: white; padding: 20px; border-radius: 15px; font-weight: 900; }

  .fade-in { animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default SpyGame;

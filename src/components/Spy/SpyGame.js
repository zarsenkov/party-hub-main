import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

// // Компонент игры "Шпион" в стиле "Секретное досье"
const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); 
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Функция для возврата на главную
  const goHome = () => {
    window.location.href = 'https://lovecouple.ru';
  };

  // // Генерация ролей и локации
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) newRoles[i] = 'spy';
    setRoles(newRoles.sort(() => Math.random() - 0.5));
    setCurrentPlayer(0);
    setScreen('transit');
  };

  // // Логика таймера
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  return (
    <div className="spy-dossier-root">
      <style>{dossierStyles}</style>

      {/* Кнопка возврата (всегда сверху) */}
      <button className="global-back-btn" onClick={goHome}>
        ← НАЗАД
      </button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="paper-container fade-in">
          <div className="paper-sheet">
            <div className="stamp">TOP SECRET</div>
            <h1 className="dossier-title">ИНСТРУКТАЖ: ШПИОН</h1>
            
            <div className="setup-fields">
              <div className="field">
                <span className="field-label">ЧИСЛО АГЕНТОВ:</span>
                <div className="stepper">
                  <button onClick={() => setPlayers(Math.max(3, players - 1))}>–</button>
                  <span className="field-val">{players}</span>
                  <button onClick={() => setPlayers(Math.min(12, players + 1))}>+</button>
                </div>
              </div>
              
              <div className="field">
                <span className="field-label">ВРАЖЕСКИЕ КРОТЫ:</span>
                <div className="stepper">
                  <button onClick={() => setSpies(Math.max(1, spies - 1))}>–</button>
                  <span className="field-val">{spies}</span>
                  <button onClick={() => setSpies(Math.min(3, spies + 1))}>+</button>
                </div>
              </div>
            </div>

            <button className="btn-action" onClick={prepareGame}>ПОЛУЧИТЬ ДОПУСК</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ТРАНЗИТ */}
      {screen === 'transit' && (
        <div className="full-view transit-bg fade-in">
          <div className="security-seal">CONFIDENTIAL</div>
          <div className="agent-id-large">АГЕНТ #{currentPlayer + 1}</div>
          <p className="transit-hint">ПРИМИТЕ ДАННЫЕ ЛИЧНО В РУКИ</p>
          <button className="btn-action white" onClick={() => setScreen('role')}>ВЫВЕСТИ НА ЭКРАН</button>
        </div>
      )}

      {/* ЭКРАН 3: РОЛЬ */}
      {screen === 'role' && (
        <div className="paper-container fade-in">
          <div className="paper-sheet">
            <div className="paper-header">FILE ID: 00{currentPlayer + 1}-ALPHA</div>
            
            <div className="role-content">
              {roles[currentPlayer] === 'spy' ? (
                <div className="role-spy">
                  <div className="status-stamp red">ШПИОН</div>
                  <div className="objective">
                    <strong>ЦЕЛЬ:</strong> Внедритесь в группу. Определите местоположение объекта. Не дайте себя раскрыть.
                  </div>
                </div>
              ) : (
                <div className="role-player">
                  <div className="status-stamp green">АГЕНТ</div>
                  <div className="location-box">
                    <span className="loc-label">ТЕКУЩАЯ ДИСЛОКАЦИЯ:</span>
                    <div className="loc-name">{location}</div>
                  </div>
                  <div className="objective">
                    <strong>ЦЕЛЬ:</strong> Путем допроса вычислите вражеского шпиона.
                  </div>
                </div>
              )}
            </div>

            <button className="btn-action" onClick={() => {
              if (currentPlayer + 1 < players) {
                setCurrentPlayer(currentPlayer + 1);
                setScreen('transit');
              } else {
                setScreen('play');
                setIsTimerRunning(true);
              }
            }}>УНИЧТОЖИТЬ ЗАПИСЬ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 4: ТАЙМЕР */}
      {screen === 'play' && (
        <div className="full-view play-bg fade-in">
          <div className="digital-stopwatch">
            <div className="timer-val">
              {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
            </div>
            <div className="timer-status">АКТИВНАЯ ФАЗА ОПЕРАЦИИ</div>
          </div>
          
          <div className="footer-btns">
            <button className="btn-mini" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? 'ПАУЗА' : 'ПУСК'}
            </button>
            <button className="btn-mini danger" onClick={() => setScreen('setup')}>ПРЕРВАТЬ</button>
          </div>
        </div>
      )}
    </div>
  );
};

const dossierStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap');

  /* Основной контейнер на весь экран */
  .spy-dossier-root {
    position: fixed; inset: 0;
    width: 100vw; height: 100vh;
    background: #1a1714;
    background-image: url('https://www.transparenttextures.com/patterns/dark-leather.png');
    font-family: 'Courier Prime', monospace;
    overflow: hidden;
    display: flex; flex-direction: column;
  }

  .global-back-btn {
    position: absolute; top: 20px; left: 20px; z-index: 100;
    background: none; border: 1px solid rgba(255,255,255,0.3);
    color: #fff; padding: 8px 15px; border-radius: 5px;
    font-size: 0.7rem; cursor: pointer;
  }

  /* Контейнеры для экранов */
  .paper-container {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px;
  }

  .full-view {
    flex: 1; display: flex; flex-direction: column; 
    align-items: center; justify-content: center; padding: 40px;
    text-align: center;
  }

  /* Лист бумаги */
  .paper-sheet {
    background: #f4f0e6;
    width: 100%; height: 85vh; max-width: 400px;
    padding: 50px 30px; box-shadow: 20px 20px 60px rgba(0,0,0,0.5);
    position: relative; display: flex; flex-direction: column;
    border: 1px solid #dcd7c9;
  }

  /* Антураж */
  .stamp {
    position: absolute; top: 30px; right: -15px;
    border: 4px solid #b22222; color: #b22222;
    padding: 5px 20px; font-family: 'Special Elite', cursive;
    transform: rotate(12deg); font-weight: bold; font-size: 1.2rem;
  }

  .status-stamp {
    font-family: 'Special Elite', cursive; font-size: 3rem;
    padding: 10px 20px; border: 6px solid; display: inline-block;
    margin-bottom: 30px; transform: rotate(-8deg);
  }
  .status-stamp.red { color: #b22222; border-color: #b22222; }
  .status-stamp.green { color: #2e7d32; border-color: #2e7d32; }

  .dossier-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 10px; }
  
  .setup-fields { flex: 1; }
  .field { margin-bottom: 30px; }
  .field-label { display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 15px; color: #666; }
  .stepper { display: flex; align-items: center; justify-content: space-between; background: #e8e4d8; padding: 10px; border-radius: 5px; }
  .stepper button { background: none; border: none; font-size: 1.8rem; width: 50px; cursor: pointer; }
  .field-val { font-size: 1.8rem; font-weight: bold; }

  .btn-action {
    background: #222; color: #fff; border: none; padding: 20px;
    width: 100%; font-family: 'Courier Prime', monospace;
    font-weight: 700; font-size: 1.1rem; cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  .btn-action.white { background: #f4f0e6; color: #222; }

  /* Транзит и Таймер */
  .security-seal { background: #b22222; color: #fff; padding: 5px 25px; font-weight: 700; margin-bottom: 20px; }
  .agent-id-large { font-size: 4rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
  .transit-hint { color: rgba(255,255,255,0.5); margin-bottom: 40px; }

  .timer-val { font-size: 7rem; font-family: 'Special Elite', cursive; color: #fff; line-height: 1; }
  .timer-status { color: #b22222; letter-spacing: 3px; font-weight: 700; margin-top: 10px; }
  .footer-btns { display: flex; gap: 20px; margin-top: 60px; }
  .btn-mini { background: none; border: 1px solid #fff; color: #fff; padding: 10px 30px; cursor: pointer; font-weight: 700; }
  .btn-mini.danger { border-color: #b22222; color: #b22222; }

  .location-box { background: #e8e4d8; padding: 20px; margin-bottom: 30px; border: 2px dashed #bbb; }
  .loc-name { font-size: 1.8rem; font-weight: 700; color: #000; margin-top: 5px; }
  .objective { font-size: 0.95rem; line-height: 1.5; color: #444; }

  .fade-in { animation: fIn 0.4s ease; }
  @keyframes fIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default SpyGame;

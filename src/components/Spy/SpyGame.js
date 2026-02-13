import React, { useState, useEffect } from 'react';
import { SPY_LOCATIONS } from './spyData';

const SpyGame = () => {
  const [screen, setScreen] = useState('setup'); 
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [roles, setRoles] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [location, setLocation] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // // Подготовка данных раунда
  const prepareGame = () => {
    const loc = SPY_LOCATIONS[Math.floor(Math.random() * SPY_LOCATIONS.length)];
    setLocation(loc);
    let newRoles = new Array(players).fill('player');
    for (let i = 0; i < spies; i++) newRoles[i] = 'spy';
    setRoles(newRoles.sort(() => Math.random() - 0.5));
    setCurrentPlayer(0);
    setScreen('transit');
  };

  // // Таймер обратного отсчета
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

      {/* ЭКРАН 1: ПОДГОТОВКА ОПЕРАЦИИ */}
      {screen === 'setup' && (
        <div className="paper fade-in">
          <div className="stamp">TOP SECRET</div>
          <h1 className="dossier-title">ОПЕРАЦИЯ: ШПИОН</h1>
          
          <div className="setup-fields">
            <div className="field">
              <span className="field-label">АГЕНТОВ В СЕТИ:</span>
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

          <button className="btn-action" onClick={prepareGame}>НАЧАТЬ ИНСТРУКТАЖ</button>
        </div>
      )}

      {/* ЭКРАН 2: ТРАНЗИТ (ПЕРЕДАЧА ЛИЧНО В РУКИ) */}
      {screen === 'transit' && (
        <div className="folder-transit fade-in">
          <div className="transit-content">
            <div className="security-seal">CONFIDENTIAL</div>
            <div className="agent-id">АГЕНТ #{currentPlayer + 1}</div>
            <h2>ПРИНЯТЬ ПАКЕТ ДАННЫХ</h2>
            <p>Убедитесь, что никто не видит ваш экран</p>
            <button className="btn-action" onClick={() => setScreen('role')}>ВСКРЫТЬ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ЛИЧНОЕ ДЕЛО (РОЛЬ) */}
      {screen === 'role' && (
        <div className="paper role-paper fade-in">
          <div className="paper-header">ЛИЧНОЕ ДЕЛО №0{currentPlayer + 1}</div>
          
          <div className="role-content">
            {roles[currentPlayer] === 'spy' ? (
              <div className="role-spy">
                <div className="status-stamp red">ШПИОН</div>
                <div className="objective">
                  <strong>ЗАДАЧА:</strong> Внедритесь в доверие. Выясните местоположение объекта, не выдав себя.
                </div>
              </div>
            ) : (
              <div className="role-player">
                <div className="status-stamp green">АГЕНТ</div>
                <div className="location-box">
                  <span className="loc-label">ОБЪЕКТ:</span>
                  <div className="loc-name">{location}</div>
                </div>
                <div className="objective">
                  <strong>ЗАДАЧА:</strong> Вычислите предателя, задавая наводящие вопросы.
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
          }}>УНИЧТОЖИТЬ УЛИКИ</button>
        </div>
      )}

      {/* ЭКРАН 4: АКТИВНАЯ ФАЗА (ТАЙМЕР) */}
      {screen === 'play' && (
        <div className="play-view fade-in">
          <div className="stopwatch">
            <div className="timer-digits">
              {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}
            </div>
            <div className="timer-label">ДО ПРОВАЛА ОПЕРАЦИИ</div>
          </div>
          
          <div className="play-btns">
            <button className="btn-secondary" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {isTimerRunning ? 'ПАУЗА' : 'ПРОДОЛЖИТЬ'}
            </button>
            <button className="btn-secondary danger" onClick={() => window.location.reload()}>СБРОС</button>
          </div>
        </div>
      )}
    </div>
  );
};

const dossierStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap');

  .spy-dossier-root {
    position: fixed; inset: 0;
    background: #2b2622; /* Цвет темной папки */
    background-image: url('https://www.transparenttextures.com/patterns/dark-leather.png');
    display: flex; align-items: center; justify-content: center;
    padding: 20px; font-family: 'Courier Prime', monospace; color: #333;
  }

  /* ЛИСТ БУМАГИ */
  .paper {
    background: #fdfaf0;
    width: 100%; max-width: 350px; min-height: 500px;
    padding: 40px 25px; box-shadow: 10px 10px 0 rgba(0,0,0,0.3);
    position: relative; display: flex; flex-direction: column; align-items: center;
    border-radius: 2px;
  }
  .paper::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 10px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.05), transparent);
  }

  /* ШТАМПЫ */
  .stamp {
    position: absolute; top: 20px; right: -10px;
    border: 3px solid #b22222; color: #b22222;
    padding: 5px 15px; font-family: 'Special Elite', cursive;
    transform: rotate(15deg); font-weight: bold; opacity: 0.8;
  }
  .status-stamp {
    font-family: 'Special Elite', cursive; font-size: 3rem;
    padding: 10px; border: 5px solid; display: inline-block;
    margin-bottom: 20px; transform: rotate(-5deg);
  }
  .status-stamp.red { color: #b22222; border-color: #b22222; }
  .status-stamp.green { color: #2e7d32; border-color: #2e7d32; }

  /* ЗАГОЛОВКИ */
  .dossier-title { font-size: 1.4rem; font-weight: 700; text-align: center; margin-bottom: 40px; text-decoration: underline; }
  .paper-header { font-size: 0.8rem; opacity: 0.6; margin-bottom: 30px; align-self: flex-start; }

  /* ПОЛЯ НАСТРОЕК */
  .setup-fields { width: 100%; margin-bottom: 40px; }
  .field { margin-bottom: 25px; }
  .field-label { display: block; font-size: 0.9rem; font-weight: bold; margin-bottom: 10px; }
  .stepper { display: flex; align-items: center; gap: 20px; }
  .stepper button { 
    background: #eee; border: 1px solid #ccc; width: 40px; height: 40px; 
    font-size: 1.2rem; cursor: pointer; border-radius: 5px;
  }
  .field-val { font-size: 1.5rem; font-weight: bold; }

  /* КНОПКИ */
  .btn-action {
    background: #333; color: #fff; border: none; padding: 15px 30px;
    font-family: 'Courier Prime', monospace; font-weight: 700;
    font-size: 1rem; cursor: pointer; box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
    margin-top: auto; width: 100%;
  }

  /* ТРАНЗИТНЫЙ ЭКРАН */
  .transit-content { text-align: center; color: #fdfaf0; }
  .agent-id { font-size: 3rem; font-weight: 700; margin-bottom: 10px; }
  .security-seal { 
    background: #b22222; color: #fff; padding: 5px 20px; 
    display: inline-block; margin-bottom: 30px; font-weight: 700;
  }

  /* ИГРОВОЙ ЭКРАН */
  .stopwatch { text-align: center; color: #fdfaf0; }
  .timer-digits { font-size: 6rem; font-weight: 700; font-family: 'Special Elite', cursive; }
  .timer-label { font-size: 0.8rem; letter-spacing: 2px; opacity: 0.6; }
  .play-btns { display: flex; gap: 10px; margin-top: 50px; }
  .btn-secondary { background: rgba(255,255,255,0.1); border: 1px solid #fff; color: #fff; padding: 10px 20px; cursor: pointer; }
  .btn-secondary.danger { border-color: #b22222; color: #b22222; }

  /* ДЕТАЛИ РОЛИ */
  .location-box { background: #eee; padding: 15px; margin-bottom: 20px; border: 1px dashed #999; }
  .loc-label { font-size: 0.7rem; font-weight: bold; }
  .loc-name { font-size: 1.4rem; font-weight: 700; color: #000; }
  .objective { font-size: 0.9rem; line-height: 1.4; text-align: left; }

  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default SpyGame;

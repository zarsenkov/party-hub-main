import React, { useState, useEffect } from 'react';
// // Иконки для интерфейса
import { Moon, Sun, ArrowLeft, Skull, Heart, Timer, RefreshCw, Eye } from 'lucide-react';
// // Данные ролей (должны быть в mafiaData.js)
import { mafiaRoles } from './mafiaData';

// // Список кличек для атмосферы
const NICKNAMES = ["Крот", "Шустрый", "Барон", "Доцент", "Бритва", "Молчун", "Артист", "Счастливчик", "Шериф", "Лис", "Призрак", "Кабан", "Акула", "Маэстро", "Стукач"];

const MafiaGame = ({ onBack }) => {
  // === СОСТОЯНИЯ ===
  const [gameState, setGameState] = useState('setup'); // // setup, dealing, action, results
  const [phase, setPhase] = useState('night');
  const [playerCount, setPlayerCount] = useState(6);
  const [useManiac, setUseManiac] = useState(false);
  const [useProstitute, setUseProstitute] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [winner, setWinner] = useState(null);

  // === ТАЙМЕР ===
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { setTimerActive(false); }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // === ЛОГИКА ИГРЫ ===

  // // Генерация ролей и имен
  const startDealing = () => {
    let rolesPool = [];
    const mafiaCount = Math.max(1, Math.floor(playerCount / 4)); // // Балансировка
    
    // // Наполнение пула ролей
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'detective'));
    
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));
    
    while (rolesPool.length < playerCount) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    
    // // Перемешивание
    rolesPool = rolesPool.slice(0, playerCount).sort(() => Math.random() - 0.5);
    const shuffledNames = [...NICKNAMES].sort(() => Math.random() - 0.5);
    
    setPlayers(rolesPool.map((role, i) => ({
      id: i + 1,
      name: shuffledNames[i] || `Игрок ${i + 1}`,
      role: role,
      alive: true,
      statusEffect: null // // 'killed' или 'healed'
    })));
    
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

  // // Проверка условий завершения
  const checkVictory = (currentPlayers) => {
    const alive = currentPlayers.filter(p => p.alive);
    const mafia = alive.filter(p => p.role.side === 'evil' && p.role.id !== 'maniac');
    const maniac = alive.filter(p => p.role.id === 'maniac');
    const good = alive.filter(p => p.role.side === 'good' || p.role.id === 'prostitute');

    if (mafia.length === 0 && maniac.length === 0) return 'Мирные';
    if (mafia.length >= (good.length + maniac.length)) return 'Мафия';
    if (maniac.length > 0 && alive.length <= 2) return 'Маньяк';
    return null;
  };

  // // Переход фазы и применение эффектов
  const confirmAction = () => {
    const updated = players.map(p => {
      // // Если убили и НЕ вылечили — умирает
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      // // Сбрасываем лечение для следующего раунда
      if (p.statusEffect === 'healed') return { ...p, statusEffect: null };
      return p;
    });
    
    setPlayers(updated);
    const v = checkVictory(updated);
    
    if (v) {
      setWinner(v);
      setGameState('results');
    } else {
      setPhase(phase === 'night' ? 'day' : 'night');
      setTimerActive(false);
      setTimeLeft(60);
    }
  };

  return (
    <div className={`mafia-root ${phase}`}>
      <style>{mafiaStyles}</style>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {gameState === 'setup' && (
        <div className="mafia-container fade-in">
          <header className="mafia-header">
            <button onClick={onBack} className="m-icon-btn"><ArrowLeft/></button>
            <div className="m-badge">CITY_CONTROL</div>
          </header>
          
          <h1 className="m-title">MAFIA<span>STORY</span></h1>
          
          <div className="m-setup-card">
            <div className="m-field">
              <label>ИГРОКОВ: {playerCount}</label>
              <input type="range" min="4" max="15" value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))} />
            </div>
            
            <div className="m-switches">
              <div className={`m-switch ${useManiac ? 'on' : ''}`} onClick={() => setUseManiac(!useManiac)}>
                МАНЬЯК {useManiac ? 'ВКЛ' : 'ВЫКЛ'}
              </div>
              <div className={`m-switch ${useProstitute ? 'on' : ''}`} onClick={() => setUseProstitute(!useProstitute)}>
                ПУТАНА {useProstitute ? 'ВКЛ' : 'ВЫКЛ'}
              </div>
            </div>

            <button onClick={startDealing} className="m-btn-prime">НАЧАТЬ РАЗДАЧУ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: РАЗДАЧА РОЛЕЙ */}
      {gameState === 'dealing' && (
        <div className="mafia-container dealing-view fade-in">
          <div className="m-role-card">
            <p className="m-player-name">{players[currentPlayerIdx].name}</p>
            {!showRole ? (
              <button onClick={() => setShowRole(true)} className="m-btn-prime">УЗНАТЬ РОЛЬ</button>
            ) : (
              <div className="m-role-reveal">
                <h2 className={players[currentPlayerIdx].role.side}>{players[currentPlayerIdx].role.name}</h2>
                <p>{players[currentPlayerIdx].role.desc}</p>
                <button 
                  onClick={() => { 
                    setShowRole(false); 
                    currentPlayerIdx < playerCount - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action'); 
                  }} 
                  className="m-btn-sub"
                >
                  Я ЗАПОМНИЛ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ИГРОВОЙ ПРОЦЕСС (ПУЛЬТ) */}
      {gameState === 'action' && (
        <div className="mafia-action-view fade-in">
          <header className="m-play-header">
            <div className="m-timer" onClick={() => setTimerActive(!timerActive)}>
              <Timer size={16}/> {timeLeft}s
            </div>
            <div className="m-phase-badge">{phase.toUpperCase()}</div>
            <button className="m-phase-toggle" onClick={() => setPhase(phase === 'night' ? 'day' : 'night')}>
              <RefreshCw size={16}/>
            </button>
          </header>

          <div className="m-player-list">
            {players.map(p => (
              <div key={p.id} className={`m-player-row ${!p.alive ? 'dead' : ''}`}>
                <div className="m-p-info">
                  <span className="m-p-name">{p.name}</span>
                  <span className="m-p-role">{p.role.name}</span>
                </div>
                
                <div className="m-p-actions">
                  {p.alive ? (
                    <>
                      <button 
                        className={`m-act-btn kill ${p.statusEffect === 'killed' ? 'active' : ''}`}
                        onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'killed' ? null : 'killed'} : pl))}
                      >
                        <Skull size={18}/>
                      </button>
                      {phase === 'night' && (
                        <button 
                          className={`m-act-btn heal ${p.statusEffect === 'healed' ? 'active' : ''}`}
                          onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'healed' ? null : 'healed'} : pl))}
                        >
                          <Heart size={18}/>
                        </button>
                      )}
                    </>
                  ) : <span className="m-dead-label">ELIMINATED</span>}
                </div>
              </div>
            ))}
          </div>

          <button onClick={confirmAction} className="m-btn-confirm">
            {phase === 'night' ? 'ЗАВЕРШИТЬ НОЧЬ' : 'ИТОГИ ГОЛОСОВАНИЯ'}
          </button>
        </div>
      )}

      {/* ЭКРАН 4: ПОБЕДА */}
      {gameState === 'results' && (
        <div className="mafia-container result-view fade-in">
          <h1 className="m-res-title">ПОБЕДА!</h1>
          <div className="m-winner-box">{winner.toUpperCase()}</div>
          <button onClick={() => setGameState('setup')} className="m-btn-prime">НОВАЯ ИГРА</button>
        </div>
      )}
    </div>
  );
};

// // СТИЛИ: NOIR NEON
const mafiaStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Staatliches&family=JetBrains+Mono:wght@400;800&display=swap');

  .mafia-root {
    position: fixed !important; inset: 0 !important;
    font-family: 'JetBrains Mono', monospace !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    padding: 20px !important; z-index: 100000 !important; transition: 0.5s !important;
  }
  .mafia-root.night { background: #050505 !important; color: #fff !important; }
  .mafia-root.day { background: #f0f0f0 !important; color: #111 !important; }

  .mafia-container { width: 100% !important; max-width: 400px !important; text-align: center !important; }

  .mafia-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 40px !important; }
  .m-icon-btn { background: #ff003c !important; color: #fff !important; border: none !important; padding: 10px !important; cursor: pointer !important; }
  .m-badge { background: #111; color: #fff; padding: 5px 12px; font-size: 0.7rem; font-weight: 800; }

  .m-title { font-family: 'Staatliches', cursive !important; font-size: 5rem !important; line-height: 0.8 !important; margin-bottom: 40px !important; letter-spacing: 2px !important; }
  .m-title span { color: #ff003c !important; display: block !important; }

  .m-setup-card { background: #fff !important; color: #000 !important; padding: 30px !important; border: 4px solid #111 !important; box-shadow: 12px 12px 0 #ff003c !important; }
  .m-field { margin-bottom: 25px !important; text-align: left !important; }
  .m-field label { font-weight: 800 !important; font-size: 0.8rem !important; display: block !important; margin-bottom: 10px !important; }
  .m-field input { width: 100% !important; accent-color: #ff003c !important; }

  .m-switches { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; margin-bottom: 30px !important; }
  .m-switch { padding: 10px !important; border: 2px solid #111 !important; font-size: 0.6rem !important; font-weight: 800 !important; cursor: pointer !important; }
  .m-switch.on { background: #111 !important; color: #fff !important; }

  .m-btn-prime {
    width: 100% !important; background: #ff003c !important; color: #fff !important;
    border: none !important; padding: 18px !important; font-weight: 800 !important;
    font-size: 1.1rem !important; cursor: pointer !important; box-shadow: 6px 6px 0 #111 !important;
  }
  .m-btn-sub { background: #111 !important; color: #fff !important; border: none !important; padding: 15px 30px !important; margin-top: 20px !important; cursor: pointer !important; }

  /* Роли */
  .m-role-card { background: #111 !important; color: #fff !important; padding: 50px 20px !important; border: 4px solid #ff003c !important; }
  .m-player-name { font-size: 1.5rem !important; font-weight: 800 !important; color: #ff003c !important; margin-bottom: 30px !important; }
  .m-role-reveal h2 { font-size: 3rem !important; font-family: 'Staatliches' !important; margin-bottom: 15px !important; }
  .m-role-reveal .evil { color: #ff003c !important; }
  .m-role-reveal .good { color: #00ff88 !important; }
  .m-role-reveal p { font-size: 0.8rem !important; opacity: 0.7 !important; line-height: 1.4 !important; }

  /* Игровой пульт */
  .mafia-action-view { width: 100% !important; max-width: 450px !important; height: 100% !important; display: flex !important; flex-direction: column !important; }
  .m-play-header { display: flex !important; justify-content: space-between !important; margin-bottom: 20px !important; padding: 10px !important; background: #ff003c !important; color: #fff !important; }
  .m-timer { display: flex !important; align-items: center !important; gap: 5px !important; font-weight: 800 !important; cursor: pointer !important; }
  
  .m-player-list { flex: 1 !important; overflow-y: auto !important; display: flex !important; flex-direction: column !important; gap: 8px !important; padding-right: 5px !important; }
  .m-player-row {
    background: #fff !important; color: #111 !important; padding: 15px !important;
    display: flex !important; justify-content: space-between !important; align-items: center !important;
    border: 3px solid #111 !important;
  }
  .mafia-root.night .m-player-row { background: #1a1a1a !important; color: #fff !important; border-color: #333 !important; }
  .m-player-row.dead { opacity: 0.4 !important; grayscale: 1 !important; }

  .m-p-info { display: flex !important; flex-direction: column !important; text-align: left !important; }
  .m-p-name { font-weight: 800 !important; font-size: 1.1rem !important; }
  .m-p-role { font-size: 0.6rem !important; opacity: 0.6 !important; text-transform: uppercase !important; }

  .m-p-actions { display: flex !important; gap: 8px !important; }
  .m-act-btn { background: none !important; border: 2px solid #111 !important; padding: 8px !important; cursor: pointer !important; transition: 0.2s !important; color: inherit !important; }
  .m-act-btn.kill.active { background: #ff003c !important; color: #fff !important; border-color: #ff003c !important; }
  .m-act-btn.heal.active { background: #00ff88 !important; color: #111 !important; border-color: #00ff88 !important; }
  .m-dead-label { font-size: 0.7rem !important; font-weight: 800 !important; color: #ff003c !important; border: 1px solid !important; padding: 2px 6px !important; }

  .m-btn-confirm { width: 100% !important; padding: 20px !important; background: #111 !important; color: #fff !important; border: none !important; font-weight: 800 !important; margin-top: 20px !important; cursor: pointer !important; letter-spacing: 2px !important; }

  /* Результат */
  .m-winner-box { font-size: 3rem !important; background: #ff003c !important; color: #fff !important; padding: 20px !important; margin: 40px 0 !important; transform: rotate(-2deg) !important; font-weight: 800 !important; }

  .fade-in { animation: mIn 0.4s ease-out !important; }
  @keyframes mIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default MafiaGame;

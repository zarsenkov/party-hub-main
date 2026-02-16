import React, { useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft, Skull, Heart, Timer, RefreshCw, Eye, Plus, X, User } from 'lucide-react';
// // Данные ролей (должны быть в mafiaData.js)
import { mafiaRoles } from './mafiaData';

const NICKNAMES = ["Крот", "Барон", "Доцент", "Бритва", "Артист", "Шериф", "Лис", "Призрак", "Кабан", "Акула"];

const MafiaGame = ({ onBack }) => {
  // === СОСТОЯНИЯ ===
  const [gameState, setGameState] = useState('setup'); // // setup, dealing, action, results
  const [phase, setPhase] = useState('night');
  const [tempNames, setTempNames] = useState(['', '', '', '']); // // Стартовые 4 поля для имен
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

  // === ЛОГИКА ИМЕН ===
  const handleAddName = () => setTempNames([...tempNames, '']);
  const handleRemoveName = (i) => setTempNames(tempNames.filter((_, idx) => idx !== i));
  const updateName = (i, val) => {
    const newNames = [...tempNames];
    newNames[i] = val;
    setTempNames(newNames);
  };

  // === СТАРТ ИГРЫ ===
  const startDealing = () => {
    let rolesPool = [];
    const count = tempNames.length;
    const mafiaCount = Math.max(1, Math.floor(count / 4));
    
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'), mafiaRoles.find(r => r.id === 'detective'));
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));
    while (rolesPool.length < count) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    
    rolesPool = rolesPool.slice(0, count).sort(() => Math.random() - 0.5);
    
    setPlayers(tempNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || NICKNAMES[i % NICKNAMES.length],
      role: rolesPool[i],
      alive: true,
      statusEffect: null,
      revealed: false // // Для пульта ведущего (проверка комиссара)
    })));
    
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

  const confirmAction = () => {
    const updated = players.map(p => {
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      return { ...p, statusEffect: null };
    });
    setPlayers(updated);
    const v = checkVictory(updated);
    if (v) { setWinner(v); setGameState('results'); }
    else { setPhase(phase === 'night' ? 'day' : 'night'); setTimerActive(false); setTimeLeft(60); }
  };

  const checkVictory = (alivePlayers) => {
    const alive = alivePlayers.filter(p => p.alive);
    const mafia = alive.filter(p => p.role.side === 'evil' && p.role.id !== 'maniac');
    const maniac = alive.filter(p => p.role.id === 'maniac');
    const good = alive.filter(p => p.role.side === 'good' || p.role.id === 'prostitute');
    if (mafia.length === 0 && maniac.length === 0) return 'Мирные';
    if (mafia.length >= (good.length + maniac.length)) return 'Мафия';
    if (maniac.length > 0 && alive.length <= 2) return 'Маньяк';
    return null;
  };

  return (
    <div className={`terminal-root ${phase}`}>
      <style>{terminalStyles}</style>

      {/* ЭКРАН 1: ПРОФ-НАСТРОЙКА ИМЕН */}
      {gameState === 'setup' && (
        <div className="term-container fade-in">
          <div className="term-header">
            <button onClick={onBack} className="t-back"><ArrowLeft size={18}/> ВЫХОД</button>
            <div className="t-status">LOG_INIT_V2.0</div>
          </div>
          
          <h1 className="t-title">MAFIA<span>CONTROL</span></h1>
          
          <div className="t-setup-scroll">
            <p className="t-label">СПИСОК ИГРОКОВ ({tempNames.length})</p>
            {tempNames.map((n, i) => (
              <div key={i} className="t-name-input">
                <span className="t-idx">{i+1}.</span>
                <input 
                  type="text" 
                  placeholder={`Игрок ${i+1}`} 
                  value={n} 
                  onChange={(e) => updateName(i, e.target.value)} 
                />
                {tempNames.length > 4 && <button onClick={() => handleRemoveName(i)} className="t-remove"><X size={14}/></button>}
              </div>
            ))}
            <button onClick={handleAddName} className="t-add-btn"><Plus size={16}/> ДОБАВИТЬ ИГРОКА</button>
          </div>

          <div className="t-options">
            <button className={`t-opt ${useManiac ? 'active' : ''}`} onClick={() => setUseManiac(!useManiac)}>МАНЬЯК</button>
            <button className={`t-opt ${useProstitute ? 'active' : ''}`} onClick={() => setUseProstitute(!useProstitute)}>ПУТАНА</button>
          </div>

          <button onClick={startDealing} className="t-btn-start">СФОРМИРОВАТЬ СОСТАВ</button>
        </div>
      )}

      {/* ЭКРАН 2: РАЗДАЧА (БЕЗ ИЗМЕНЕНИЙ) */}
      {gameState === 'dealing' && (
        <div className="term-container fade-in">
          <div className="t-role-card">
            <div className="t-card-header">ПЕРЕДАЙТЕ ТЕЛЕФОН</div>
            <div className="t-card-body">
              <h2 className="t-player-name">{players[currentPlayerIdx].name}</h2>
              {!showRole ? (
                <button onClick={() => setShowRole(true)} className="t-btn-start">СМОТРЕТЬ РОЛЬ</button>
              ) : (
                <div className="t-reveal">
                  <div className={`t-role-name ${players[currentPlayerIdx].role.side}`}>{players[currentPlayerIdx].role.name}</div>
                  <p className="t-role-desc">{players[currentPlayerIdx].role.desc}</p>
                  <button onClick={() => { setShowRole(false); currentPlayerIdx < players.length - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action'); }} className="t-btn-sub">Я ЗАПОМНИЛ</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ПРОФ-ПУЛЬТ ВЕДУЩЕГО */}
      {gameState === 'action' && (
        <div className="term-action-view fade-in">
          <div className="t-console-header">
            <div className="t-timer" onClick={() => setTimerActive(!timerActive)}>
              <Timer size={16}/> {timeLeft}s
            </div>
            <div className="t-phase">{phase === 'night' ? 'НОЧЬ' : 'ДЕНЬ'}</div>
            <button className="t-swap" onClick={() => setPhase(phase === 'night' ? 'day' : 'night')}><RefreshCw size={16}/></button>
          </div>

          <div className="t-players-grid">
            {players.map(p => (
              <div key={p.id} className={`t-player-box ${!p.alive ? 'eliminated' : ''} ${p.statusEffect ? 'targeted' : ''}`}>
                <div className="t-p-main">
                  <span className="t-p-name">{p.name}</span>
                  <div className="t-p-tags">
                    <span className={`t-p-role-tag ${p.role.side}`}>{p.role.name}</span>
                    {p.revealed && <Eye size={12} className="revealed-icon"/>}
                  </div>
                </div>
                
                <div className="t-p-btns">
                  {p.alive ? (
                    <>
                      <button className={`t-act kill ${p.statusEffect === 'killed' ? 'on' : ''}`} onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'killed' ? null : 'killed'} : pl))}><Skull size={16}/></button>
                      <button className="t-act reveal" onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, revealed: !pl.revealed} : pl))}><Eye size={16}/></button>
                      {phase === 'night' && <button className={`t-act heal ${p.statusEffect === 'healed' ? 'on' : ''}`} onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'healed' ? null : 'healed'} : pl))}><Heart size={16}/></button>}
                    </>
                  ) : <span className="t-rip">DEAD</span>}
                </div>
              </div>
            ))}
          </div>

          <button onClick={confirmAction} className="t-btn-confirm">
            {phase === 'night' ? 'ПРИМЕНИТЬ ХОДЫ НОЧИ' : 'ЗАВЕРШИТЬ ГОЛОСОВАНИЕ'}
          </button>
        </div>
      )}

      {/* ЭКРАН 4: ФИНАЛ */}
      {gameState === 'results' && (
        <div className="term-container fade-in">
          <div className="t-results-box">
            <p>ОПЕРАЦИЯ ЗАВЕРШЕНА</p>
            <h1>ПОБЕДА: {winner}</h1>
            <button onClick={() => setGameState('setup')} className="t-btn-start">ПЕРЕЗАПУСК</button>
          </div>
        </div>
      )}
    </div>
  );
};

const terminalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

  .terminal-root {
    position: fixed !important; inset: 0 !important;
    font-family: 'JetBrains Mono', monospace !important;
    display: flex !important; flex-direction: column !important;
    padding: 20px !important; z-index: 100000 !important;
  }
  .terminal-root.night { background: #0a0b10 !important; color: #00ff41 !important; }
  .terminal-root.day { background: #00141a !important; color: #00d2ff !important; }

  .term-container { width: 100% !important; max-width: 450px !important; margin: 0 auto !important; }
  .term-header { display: flex !important; justify-content: space-between !important; margin-bottom: 20px !important; font-size: 0.7rem !important; opacity: 0.6; }
  .t-back { background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; gap: 5px; }

  .t-title { font-size: 2.5rem !important; font-weight: 800 !important; margin-bottom: 30px !important; text-align: center !important; }
  .t-title span { color: #fff !important; background: #ff003c; padding: 0 10px; }

  /* Настройка имен */
  .t-setup-scroll { 
    max-height: 50vh !important; overflow-y: auto !important; 
    background: rgba(255,255,255,0.05) !important; padding: 15px !important;
    border: 1px solid currentColor !important; margin-bottom: 20px !important;
  }
  .t-name-input { display: flex !important; align-items: center !important; gap: 10px !important; margin-bottom: 8px !important; }
  .t-name-input input { 
    flex: 1 !important; background: none !important; border: none !important; 
    border-bottom: 1px solid rgba(255,255,255,0.2) !important; color: #fff !important; padding: 5px !important;
  }
  .t-idx { font-size: 0.8rem; opacity: 0.5; width: 25px; }
  .t-remove { background: none; border: none; color: #ff003c; cursor: pointer; }
  .t-add-btn { width: 100%; padding: 10px; background: none; border: 1px dashed currentColor; color: inherit; cursor: pointer; margin-top: 10px; font-weight: 700; }

  .t-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .t-opt { padding: 10px; border: 1px solid currentColor; background: none; color: inherit; cursor: pointer; font-size: 0.7rem; font-weight: 700; }
  .t-opt.active { background: currentColor !important; color: #000 !important; }

  .t-btn-start { width: 100% !important; padding: 20px !important; background: currentColor !important; color: #000 !important; border: none !important; font-weight: 800 !important; cursor: pointer !important; }

  /* Пульт ведущего */
  .term-action-view { height: 100% !important; display: flex !important; flex-direction: column !important; }
  .t-console-header { display: flex !important; justify-content: space-between !important; padding: 15px !important; background: rgba(255,255,255,0.05) !important; border: 1px solid currentColor !important; margin-bottom: 15px !important; }
  .t-timer { cursor: pointer; font-weight: 800; }
  .t-swap { background: none; border: none; color: inherit; cursor: pointer; }

  .t-players-grid { flex: 1 !important; overflow-y: auto !important; display: grid !important; gap: 8px !important; }
  .t-player-box { 
    border: 1px solid rgba(255,255,255,0.1) !important; padding: 12px !important; 
    display: flex !important; justify-content: space-between !important; align-items: center !important;
    background: rgba(255,255,255,0.02) !important;
  }
  .t-player-box.targeted { border-color: #ff003c !important; background: rgba(255, 0, 60, 0.05) !important; }
  .t-player-box.eliminated { opacity: 0.3 !important; filter: grayscale(1); }

  .t-p-main { display: flex; flex-direction: column; gap: 4px; }
  .t-p-name { font-weight: 700; font-size: 1rem; color: #fff; }
  .t-p-tags { display: flex; align-items: center; gap: 8px; }
  .t-p-role-tag { font-size: 0.6rem; font-weight: 800; padding: 2px 5px; border-radius: 3px; }
  .t-p-role-tag.evil { background: #ff003c; color: #fff; }
  .t-p-role-tag.good { background: #00ff41; color: #000; }

  .t-p-btns { display: flex; gap: 6px; }
  .t-act { background: none; border: 1px solid currentColor; color: inherit; padding: 6px; cursor: pointer; }
  .t-act.on { background: currentColor !important; color: #000 !important; }
  .t-act.kill:hover { border-color: #ff003c; color: #ff003c; }
  .t-rip { color: #ff003c; font-size: 0.7rem; font-weight: 800; }

  .t-btn-confirm { width: 100%; padding: 20px; background: #ff003c; color: #fff; border: none; font-weight: 800; cursor: pointer; margin-top: 15px; }

  .fade-in { animation: tFade 0.3s ease-out; }
  @keyframes tFade { from { opacity: 0; } to { opacity: 1; } }
`;

export default MafiaGame;

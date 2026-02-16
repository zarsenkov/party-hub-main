import React, { useState, useEffect } from 'react';
// // Иконки для управления консолью
import { Moon, Sun, ArrowLeft, Skull, Heart, Timer, RefreshCw, Eye, Plus, X, UserCheck } from 'lucide-react';
// // Данные ролей (массив объектов с id, name, side, desc)
import { mafiaRoles } from './mafiaData';

// // Запасные имена, если ведущий не ввел свои
const NICKNAMES = ["Крот", "Бритва", "Доцент", "Барон", "Артист", "Счастливчик", "Лис", "Призрак", "Кабан", "Маэстро"];

const MafiaGame = ({ onBack }) => {
  // === ГЛОБАЛЬНЫЕ СОСТОЯНИЯ ===
  const [gameState, setGameState] = useState('setup'); // // setup, dealing, action, results
  const [phase, setPhase] = useState('night');
  const [tempNames, setTempNames] = useState(['', '', '', '']); // // Поля для ввода имен
  const [useManiac, setUseManiac] = useState(false);
  const [useProstitute, setUseProstitute] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [winner, setWinner] = useState(null);

  // === ЛОГИКА ТАЙМЕРА ===
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { setTimerActive(false); }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // === УПРАВЛЕНИЕ СПИСКОМ ИГРОКОВ ===
  // // Добавить новое поле для игрока
  const addPlayerField = () => setTempNames([...tempNames, '']);
  // // Удалить поле (минимум 4 игрока)
  const removePlayerField = (idx) => {
    if (tempNames.length > 4) setTempNames(tempNames.filter((_, i) => i !== idx));
  };
  // // Обновить имя в поле
  const handleNameChange = (idx, val) => {
    const next = [...tempNames];
    next[idx] = val;
    setTempNames(next);
  };

  // === СТАРТ ИГРЫ И РАСПРЕДЕЛЕНИЕ ===
  const startDealing = () => {
    let rolesPool = [];
    const count = tempNames.length;
    const mafiaCount = Math.max(1, Math.floor(count / 4));
    
    // // Формируем колоду ролей
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'), mafiaRoles.find(r => r.id === 'detective'));
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));
    while (rolesPool.length < count) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    
    // // Перемешиваем
    rolesPool = rolesPool.slice(0, count).sort(() => Math.random() - 0.5);
    
    setPlayers(tempNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || NICKNAMES[i % NICKNAMES.length],
      role: rolesPool[i],
      alive: true,
      statusEffect: null, // // 'killed' | 'healed'
      isRevealed: false   // // Пометка для ведущего (проверен комиссаром)
    })));
    
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

  // === ГЛАВНЫЕ ДЕЙСТВИЯ (ХОД) ===
  const confirmCycle = () => {
    const updated = players.map(p => {
      // // Если был убит и НЕ вылечен — умирает
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      return { ...p, statusEffect: null };
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

  // // Логика проверки условий победы
  const checkVictory = (currentPlayers) => {
    const alive = currentPlayers.filter(p => p.alive);
    const mafia = alive.filter(p => p.role.side === 'evil' && p.role.id !== 'maniac');
    const maniac = alive.filter(p => p.role.id === 'maniac');
    const good = alive.filter(p => p.role.side === 'good' || p.role.id === 'prostitute');

    if (mafia.length === 0 && maniac.length === 0) return 'Мирные жители';
    if (mafia.length >= (good.length + maniac.length)) return 'Мафия';
    if (maniac.length > 0 && alive.length <= 2) return 'Маньяк';
    return null;
  };

  return (
    <div className={`mafia-console ${phase}`}>
      <style>{consoleStyles}</style>

      {/* --- ЭКРАН 1: РЕДАКТОР ИГРОКОВ --- */}
      {gameState === 'setup' && (
        <div className="console-view fade-in">
          <header className="c-header">
            <button onClick={onBack} className="c-back-btn"><ArrowLeft size={18}/> ВЫХОД</button>
            <div className="c-system-tag">SYSTEM_OVR_9.1</div>
          </header>

          <h1 className="c-title">MAFIA<span>CRIME_LOG</span></h1>

          <div className="c-scroll-area">
            <p className="c-label">АКТИВНЫЕ ДОСЬЕ ({tempNames.length})</p>
            {tempNames.map((name, i) => (
              <div key={i} className="c-input-row">
                <span className="c-num">{i + 1}</span>
                <input 
                  type="text" 
                  placeholder={`Имя объекта ${i+1}...`}
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                />
                <button onClick={() => removePlayerField(i)} className="c-row-del"><X size={16}/></button>
              </div>
            ))}
            <button onClick={addPlayerField} className="c-add-btn"><Plus size={16}/> ДОБАВИТЬ ОБЪЕКТ</button>
          </div>

          <div className="c-options-grid">
            <div className={`c-toggle ${useManiac ? 'active' : ''}`} onClick={() => setUseManiac(!useManiac)}>
              МАНЬЯК: {useManiac ? 'YES' : 'NO'}
            </div>
            <div className={`c-toggle ${useProstitute ? 'active' : ''}`} onClick={() => setUseProstitute(!useProstitute)}>
              ПУТАНА: {useProstitute ? 'YES' : 'NO'}
            </div>
          </div>

          <button onClick={startDealing} className="c-main-btn">СФОРМИРОВАТЬ СОСТАВ</button>
        </div>
      )}

      {/* --- ЭКРАН 2: РАЗДАЧА (С КАРТОЧКАМИ) --- */}
      {gameState === 'dealing' && (
        <div className="console-view dealing-screen fade-in">
          <div className="c-role-reveal-card">
            <div className="c-card-top">IDENTIFICATION_REQUIRED</div>
            <div className="c-card-content">
              <h2 className="c-p-name">{players[currentPlayerIdx].name}</h2>
              {!showRole ? (
                <button onClick={() => setShowRole(true)} className="c-main-btn">СКАНИРОВАТЬ РОЛЬ</button>
              ) : (
                <div className="c-role-data">
                  <h3 className={players[currentPlayerIdx].role.side}>{players[currentPlayerIdx].role.name}</h3>
                  <p>{players[currentPlayerIdx].role.desc}</p>
                  <button 
                    onClick={() => {
                      setShowRole(false);
                      currentPlayerIdx < players.length - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action');
                    }}
                    className="c-sub-btn"
                  >
                    ПРИНЯТО
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- ЭКРАН 3: ПУЛЬТ ВЕДУЩЕГО --- */}
      {gameState === 'action' && (
        <div className="console-action-view fade-in">
          <div className="c-action-header">
            <div className="c-timer-box" onClick={() => setTimerActive(!timerActive)}>
              <Timer size={16}/> {timeLeft}s
            </div>
            <div className="c-phase-indicator">{phase === 'night' ? 'PHASE: NIGHT' : 'PHASE: DAY'}</div>
            <button className="c-phase-swap" onClick={() => setPhase(phase === 'night' ? 'day' : 'night')}>
              <RefreshCw size={16}/>
            </button>
          </div>

          <div className="c-list-scroll">
            {players.map(p => (
              <div key={p.id} className={`c-p-row ${!p.alive ? 'eliminated' : ''} ${p.statusEffect ? 'active-target' : ''}`}>
                <div className="c-p-main-info">
                  <div className="c-p-identity">
                    <span className="c-p-name">{p.name}</span>
                    <span className={`c-p-role-badge ${p.role.side}`}>{p.role.name}</span>
                    {p.isRevealed && <Eye size={12} className="eye-icon"/>}
                  </div>
                </div>

                <div className="c-p-controls">
                  {p.alive ? (
                    <>
                      <button 
                        className={`c-act kill ${p.statusEffect === 'killed' ? 'on' : ''}`}
                        onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'killed' ? null : 'killed'} : pl))}
                      >
                        <Skull size={18}/>
                      </button>
                      <button 
                        className={`c-act check ${p.isRevealed ? 'on' : ''}`}
                        onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, isRevealed: !pl.isRevealed} : pl))}
                      >
                        <Eye size={18}/>
                      </button>
                      {phase === 'night' && (
                        <button 
                          className={`c-act heal ${p.statusEffect === 'healed' ? 'on' : ''}`}
                          onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'healed' ? null : 'healed'} : pl))}
                        >
                          <Heart size={18}/>
                        </button>
                      )}
                    </>
                  ) : <span className="c-status-dead">EXPIRED</span>}
                </div>
              </div>
            ))}
          </div>

          <button onClick={confirmCycle} className="c-confirm-bar">
            {phase === 'night' ? 'ОБРАБОТАТЬ НОЧНЫЕ СОБЫТИЯ' : 'ПОДТВЕРДИТЬ ИЗГНАНИЕ'}
          </button>
        </div>
      )}

      {/* --- ЭКРАН 4: РЕЗУЛЬТАТ --- */}
      {gameState === 'results' && (
        <div className="console-view result-screen fade-in">
          <div className="c-final-box">
            <p className="c-final-label">OPERATIONAL_RESULT</p>
            <h1>ПОБЕДА: {winner.toUpperCase()}</h1>
            <button onClick={() => setGameState('setup')} className="c-main-btn">НОВЫЙ ПРОТОКОЛ</button>
          </div>
        </div>
      )}
    </div>
  );
};

// // СТИЛИ: CYBER-POLICE CONSOLE
const consoleStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

  .mafia-console {
    position: fixed !important; inset: 0 !important;
    font-family: 'JetBrains Mono', monospace !important;
    display: flex !important; flex-direction: column !important;
    z-index: 100000 !important; transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)) !important;
    background-size: 100% 4px, 3px 100% !important;
  }
  
  .mafia-console.night { background-color: #0d0202 !important; color: #ff3e3e !important; }
  .mafia-console.day { background-color: #020d14 !important; color: #00d2ff !important; }

  .console-view { width: 100% !important; max-width: 440px !important; margin: 0 auto !important; padding: 20px !important; }
  
  .c-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 25px !important; }
  .c-back-btn { background: none; border: 1px solid currentColor; color: inherit; padding: 5px 12px; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; }
  .c-system-tag { font-size: 0.6rem; opacity: 0.6; letter-spacing: 2px; }

  .c-title { font-size: 2.2rem !important; font-weight: 800 !important; text-align: center !important; margin-bottom: 30px !important; }
  .c-title span { display: block; font-size: 1rem; color: #fff; background: currentColor; color: #000; width: fit-content; margin: 5px auto; padding: 0 8px; }

  /* Редактор имен */
  .c-scroll-area { 
    background: rgba(0,0,0,0.3) !important; border: 1px solid currentColor !important; 
    padding: 15px !important; max-height: 45vh !important; overflow-y: auto !important; margin-bottom: 20px !important;
  }
  .c-label { font-size: 0.7rem; font-weight: 800; margin-bottom: 15px; opacity: 0.8; }
  .c-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px; }
  .c-num { font-size: 0.7rem; opacity: 0.5; width: 20px; }
  .c-input-row input { flex: 1; background: none; border: none; color: #fff; font-family: inherit; font-size: 1rem; outline: none; }
  .c-row-del { background: none; border: none; color: #ff3e3e; cursor: pointer; }
  .c-add-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px dashed currentColor; color: inherit; cursor: pointer; font-weight: 700; }

  .c-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px; }
  .c-toggle { padding: 12px; border: 1px solid currentColor; text-align: center; font-size: 0.7rem; font-weight: 800; cursor: pointer; }
  .c-toggle.active { background: currentColor !important; color: #000 !important; }

  .c-main-btn { 
    width: 100% !important; padding: 20px !important; background: currentColor !important; 
    color: #000 !important; border: none !important; font-weight: 800 !important; 
    cursor: pointer !important; box-shadow: 0 0 15px currentColor !important;
  }

  /* Карточка роли */
  .c-role-reveal-card { border: 2px solid currentColor; background: #000; overflow: hidden; }
  .c-card-top { background: currentColor; color: #000; padding: 5px; font-size: 0.6rem; font-weight: 800; text-align: center; }
  .c-card-content { padding: 40px 20px; text-align: center; }
  .c-p-name { font-size: 1.8rem; margin-bottom: 30px; color: #fff; text-transform: uppercase; }
  .c-role-data h3 { font-size: 2.5rem; font-weight: 800; margin-bottom: 15px; }
  .c-role-data .evil { color: #ff3e3e; }
  .c-role-data .good { color: #00ff88; }
  .c-role-data p { font-size: 0.85rem; line-height: 1.5; opacity: 0.8; margin-bottom: 30px; }
  .c-sub-btn { background: none; border: 1px solid currentColor; color: inherit; padding: 12px 30px; cursor: pointer; font-weight: 800; }

  /* Пульт управления */
  .console-action-view { flex: 1; display: flex; flex-direction: column; padding: 15px; }
  .c-action-header { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); border: 1px solid currentColor; padding: 10px 15px; margin-bottom: 15px; }
  .c-timer-box { font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .c-phase-indicator { font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; }
  .c-phase-swap { background: none; border: none; color: inherit; cursor: pointer; }

  .c-list-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .c-p-row { background: rgba(255,255,255,0.03); border-left: 4px solid rgba(255,255,255,0.1); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
  .c-p-row.active-target { border-left-color: currentColor !important; background: rgba(255,255,255,0.08); }
  .c-p-row.eliminated { opacity: 0.3; filter: grayscale(1); }

  .c-p-identity { display: flex; flex-direction: column; gap: 4px; }
  .c-p-name { font-weight: 700; font-size: 1.1rem; color: #fff; }
  .c-p-role-badge { font-size: 0.6rem; font-weight: 800; padding: 1px 6px; width: fit-content; }
  .c-p-role-badge.evil { background: #ff3e3e; color: #fff; }
  .c-p-role-badge.good { background: #00ff88; color: #000; }
  .eye-icon { color: #fff; margin-top: 2px; }

  .c-p-controls { display: flex; gap: 8px; }
  .c-act { background: none; border: 1px solid rgba(255,255,255,0.2); color: inherit; padding: 8px; cursor: pointer; transition: 0.2s; }
  .c-act.on { background: currentColor !important; color: #000 !important; border-color: currentColor !important; }
  .c-status-dead { font-size: 0.65rem; font-weight: 800; color: #ff3e3e; border: 1px solid; padding: 2px 6px; }

  .c-confirm-bar { width: 100%; padding: 22px; background: #ff3e3e; color: #fff; border: none; font-weight: 800; font-size: 1rem; cursor: pointer; margin-top: 15px; letter-spacing: 1px; box-shadow: 0 -5px 20px rgba(255, 62, 62, 0.2); }
  .mafia-console.day .c-confirm-bar { background: #00d2ff; color: #000; box-shadow: 0 -5px 20px rgba(0, 210, 255, 0.2); }

  .c-final-box { border: 2px solid currentColor; padding: 50px 20px; background: #000; text-align: center; }
  .c-final-label { font-size: 0.7rem; opacity: 0.6; margin-bottom: 20px; }

  .fade-in { animation: cFade 0.4s ease-out forwards; }
  @keyframes cFade { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
`;

export default MafiaGame;

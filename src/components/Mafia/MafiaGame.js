import React, { useState, useEffect } from 'react';
// // Используем иконки для функционала ведущего
import { 
  Moon, Sun, Shield, Crosshair, AlertTriangle, 
  UserX, Check, RotateCcw, Plus, Minus, Info 
} from 'lucide-react';
import { mafiaRoles } from './mafiaData';

const MafiaGame = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [gameState, setGameState] = useState('setup'); // // setup, gameplay, victory
  const [phase, setPhase] = useState('night'); // // night, day
  const [players, setPlayers] = useState([]);
  const [namesInput, setNamesInput] = useState(""); // // Ввод списком
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // // Логика ночных действий (храним ID целей)
  const [nightActions, setNightActions] = useState({ kill: null, heal: null, check: null });

  // === ТАЙМЕР ===
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // === ИНИЦИАЛИЗАЦИЯ ИГРЫ ===
  const setupGame = () => {
    const list = namesInput.split('\n').filter(n => n.trim() !== "");
    if (list.length < 4) return alert("Нужно минимум 4 игрока");

    // // Базовое распределение (упрощенно для ведущего)
    let roles = [];
    const mCount = Math.floor(list.length / 3.5) || 1;
    for (let i = 0; i < mCount; i++) roles.push('mafia');
    roles.push('doctor', 'detective');
    while (roles.length < list.length) roles.push('civilian');
    roles = roles.sort(() => Math.random() - 0.5);

    const newPlayers = list.map((name, i) => ({
      id: i,
      name: name.trim(),
      role: roles[i],
      alive: true,
      fouls: 0,
      note: ""
    }));

    setPlayers(newPlayers);
    setGameState('gameplay');
  };

  // === ЛОГИКА ВЕДУЩЕГО ===
  const handleFoul = (id, delta) => {
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, fouls: Math.max(0, p.fouls + delta) } : p
    ));
  };

  const processNight = () => {
    const { kill, heal } = nightActions;
    let report = "Ночь прошла спокойно.";

    const updatedPlayers = players.map(p => {
      if (p.id === kill && kill !== heal) {
        report = `Убит игрок: ${p.name}`;
        return { ...p, alive: false };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    alert(report);
    setPhase('day');
    setNightActions({ kill: null, heal: null, check: null });
    setTimer(60);
  };

  return (
    <div className={`noir-root ${phase}`}>
      <style>{noirStyles}</style>

      {/* ШАПКА ВЕДУЩЕГО */}
      <header className="noir-header">
        <button className="h-btn" onClick={onBack}>ВЫЙТИ</button>
        <div className="h-status">{phase === 'night' ? <Moon size={14}/> : <Sun size={14}/>} {phase.toUpperCase()}</div>
        <div className="h-timer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
          {timer}s {isTimerRunning ? '⏸' : '▶'}
        </div>
      </header>

      {/* ЭКРАН 1: РЕГИСТРАЦИЯ (СПИСКОМ) */}
      {gameState === 'setup' && (
        <div className="setup-panel fade-in">
          <h1 className="noir-title">РЕЕСТР ГОРOДА</h1>
          <p className="noir-hint">Введите имена (каждое с новой строки):</p>
          <textarea 
            placeholder="Иван&#10;Мария&#10;Петр..." 
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
          />
          <button className="start-btn" onClick={setupGame}>УТВЕРДИТЬ СОСТАВ</button>
        </div>
      )}

      {/* ЭКРАН 2: ПУЛЬТ УПРАВЛЕНИЯ */}
      {gameState === 'gameplay' && (
        <div className="ledger-view fade-in">
          <div className="players-grid">
            {players.map(p => (
              <div key={p.id} className={`p-card ${!p.alive ? 'dead' : ''}`}>
                <div className="p-info">
                  <span className="p-num">{p.id + 1}</span>
                  <span className="p-name">{p.name}</span>
                  <span className={`p-role-tag ${p.role}`}>{p.role}</span>
                </div>

                <div className="p-actions">
                  {p.alive ? (
                    <>
                      {/* Ночные цели */}
                      {phase === 'night' && (
                        <div className="night-tools">
                          <button 
                            className={`tool-btn kill ${nightActions.kill === p.id ? 'active' : ''}`}
                            onClick={() => setNightActions({...nightActions, kill: p.id})}
                          ><Crosshair size={14}/></button>
                          <button 
                            className={`tool-btn heal ${nightActions.heal === p.id ? 'active' : ''}`}
                            onClick={() => setNightActions({...nightActions, heal: p.id})}
                          ><Shield size={14}/></button>
                        </div>
                      )}
                      
                      {/* Фолы */}
                      <div className="foul-tools">
                        <button onClick={() => handleFoul(p.id, 1)} className="foul-btn"><AlertTriangle size={12}/> {p.fouls}</button>
                      </div>

                      {/* Убить вручную (днем) */}
                      <button className="kill-btn" onClick={() => setPlayers(prev => prev.map(pl => pl.id === p.id ? {...pl, alive: false} : pl))}>
                        <UserX size={14}/>
                      </button>
                    </>
                  ) : (
                    <span className="rip-tag">ELIMINATED</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <footer className="ledger-footer">
            {phase === 'night' ? (
              <button className="action-btn next-phase" onClick={processNight}>ЗАВЕРШИТЬ НОЧЬ</button>
            ) : (
              <button className="action-btn next-phase" onClick={() => setPhase('night')}>ГОРОД ЗАСЫПАЕТ</button>
            )}
            <div className="quick-time">
              <button onClick={() => setTimer(30)}>30s</button>
              <button onClick={() => setTimer(60)}>60s</button>
              <button onClick={() => setTimer(timer + 10)}>+10</button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

// // CSS: DARK NOIR LEDGER STYLE
const noirStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Inter:wght@400;700;900&display=swap');

  .noir-root {
    position: fixed !important; inset: 0 !important;
    background: #1a1a1a !important; color: #eee !important;
    font-family: 'Inter', sans-serif !important;
    display: flex !important; flex-direction: column !important;
    z-index: 100000 !important;
  }
  
  .noir-root.night { background: #0c0c0e !important; box-shadow: inset 0 0 100px #000; }
  .noir-root.night .noir-header { border-bottom-color: #ff3b3b; }

  /* ХЕДЕР ВЕДУЩЕГО */
  .noir-header {
    height: 60px; display: flex; justify-content: space-between; align-items: center;
    padding: 0 20px; border-bottom: 2px solid #333; background: #222;
  }
  .h-btn { background: none; border: 1px solid #555; color: #888; padding: 4px 10px; font-size: 10px; cursor: pointer; }
  .h-status { font-weight: 900; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .h-timer { font-family: 'Courier Prime', monospace; font-weight: 700; color: #ff3b3b; cursor: pointer; }

  /* РЕГИСТРАЦИЯ */
  .setup-panel { flex: 1; display: flex; flex-direction: column; padding: 30px; justify-content: center; }
  .noir-title { font-family: 'Courier Prime', monospace; font-size: 1.5rem; text-align: center; margin-bottom: 5px; }
  .noir-hint { font-size: 11px; text-align: center; opacity: 0.5; margin-bottom: 20px; }
  textarea {
    flex: 0.6; background: #000; border: 1px solid #333; color: #32CD32;
    padding: 15px; font-family: 'Courier Prime', monospace; font-size: 1.1rem;
    resize: none; border-radius: 5px; margin-bottom: 20px;
  }
  .start-btn { 
    background: #ff3b3b; color: #fff; border: none; padding: 20px; 
    font-weight: 900; cursor: pointer; border-radius: 5px; 
  }

  /* КАРТОЧКИ ИГРОКОВ */
  .ledger-view { flex: 1; display: flex; flex-direction: column; padding: 15px; overflow: hidden; }
  .players-grid { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
  
  .p-card {
    background: #252527; border: 1px solid #333; padding: 10px 15px;
    border-radius: 8px; display: flex; justify-content: space-between; align-items: center;
  }
  .p-card.dead { opacity: 0.3; background: #111; border-style: dashed; }
  
  .p-info { display: flex; align-items: center; gap: 12px; }
  .p-num { font-family: 'Courier Prime', monospace; color: #ff3b3b; font-weight: 700; width: 20px; }
  .p-name { font-weight: 700; font-size: 0.9rem; }
  .p-role-tag { font-size: 9px; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: #444; }
  .p-role-tag.mafia { background: #ff3b3b; color: #fff; }

  .p-actions { display: flex; align-items: center; gap: 10px; }
  .night-tools { display: flex; gap: 4px; border-right: 1px solid #444; padding-right: 10px; }
  
  .tool-btn { 
    width: 32px; height: 32px; border-radius: 4px; border: 1px solid #444; 
    background: none; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .tool-btn.active.kill { background: #ff3b3b; color: #fff; border-color: #ff3b3b; }
  .tool-btn.active.heal { background: #2e7d32; color: #fff; border-color: #2e7d32; }
  
  .foul-btn { background: none; border: 1px solid #555; color: #ffae00; font-size: 10px; padding: 5px 8px; border-radius: 4px; cursor: pointer; }
  .kill-btn { background: none; border: none; color: #666; cursor: pointer; }
  .rip-tag { font-size: 10px; font-weight: 900; color: #ff3b3b; letter-spacing: 1px; }

  /* ФУТЕР */
  .ledger-footer { padding: 15px 0; border-top: 1px solid #333; }
  .action-btn { 
    width: 100%; padding: 18px; border: none; border-radius: 8px; 
    font-weight: 900; cursor: pointer; margin-bottom: 12px;
  }
  .next-phase { background: #eee; color: #000; }
  .quick-time { display: flex; gap: 5px; }
  .quick-time button { flex: 1; background: #333; border: none; color: #eee; padding: 8px; font-size: 10px; border-radius: 4px; cursor: pointer; }

  .fade-in { animation: noirIn 0.3s ease-out; }
  @keyframes noirIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default MafiaGame;

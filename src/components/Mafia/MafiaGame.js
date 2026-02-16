import React, { useState, useEffect } from 'react';
// // Импорт иконок для тактического интерфейса
import { 
  Crosshair, Shield, Eye, Bell, 
  Trash2, UserPlus, Play, Info, 
  ChevronRight, X, AlertCircle 
} from 'lucide-react';

const MafiaTactical = ({ onBack }) => {
  // === СОСТОЯНИЯ СИСТЕМЫ ===
  const [stage, setStage] = useState('briefing'); // // briefing, distribution, operation
  const [nightPhase, setNightPhase] = useState(false);
  const [players, setPlayers] = useState([]);
  const [inputName, setInputName] = useState("");
  const [activePlayerIdx, setActivePlayerIdx] = useState(null); // // Для просмотра роли
  const [selection, setSelection] = useState({ kill: null, save: null, check: null });
  const [logs, setLogs] = useState([]);

  // === ФУНКЦИИ УПРАВЛЕНИЯ ===

  // // Добавление игрока в список
  const addPlayer = () => {
    if (!inputName.trim()) return;
    setPlayers([...players, { 
      id: Date.now(), 
      name: inputName, 
      role: null, 
      alive: true, 
      fouls: 0,
      checked: false 
    }]);
    setInputName("");
  };

  // // Распределение ролей и запуск раздачи
  const startDistribution = () => {
    if (players.length < 4) return;
    
    // // Логика формирования колоды
    let roles = ['Mafia', 'Doctor', 'Detective'];
    if (players.length > 7) roles.push('Mafia');
    while (roles.length < players.length) roles.push('Civilian');
    roles = roles.sort(() => Math.random() - 0.5);

    setPlayers(players.map((p, i) => ({ ...p, role: roles[i] })));
    setStage('distribution');
    setActivePlayerIdx(0);
  };

  // // Обработка завершения ночи
  const executeNight = () => {
    const { kill, save, check } = selection;
    let report = "Город проснулся.";

    setPlayers(prev => prev.map(p => {
      let updated = { ...p };
      // // Если убит и не спасен
      if (p.id === kill && kill !== save) {
        updated.alive = false;
        report = `Убийство в районе ${p.name}.`;
      }
      // // Если проверен комиссаром
      if (p.id === check) updated.checked = true;
      return updated;
    }));

    setLogs([report, ...logs]);
    setNightPhase(false);
    setSelection({ kill: null, save: null, check: null });
  };

  return (
    <div className={`tactical-root ${nightPhase ? 'is-night' : ''}`}>
      <style>{tacticalStyles}</style>

      {/* ЭКРАН 1: БРИФИНГ (СБОР ИГРОКОВ) */}
      {stage === 'briefing' && (
        <div className="view-container fade-in">
          <header className="t-header">
            <span className="t-label">OPERATIONAL BRIEFING</span>
            <button className="t-close" onClick={onBack}><X size={18}/></button>
          </header>

          <div className="input-block">
            <input 
              value={inputName} 
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Введите имя оперативника..."
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}><UserPlus size={20}/></button>
          </div>

          <div className="player-chips">
            {players.map(p => (
              <div key={p.id} className="chip">
                {p.name}
                <button onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))}><X size={12}/></button>
              </div>
            ))}
          </div>

          <button 
            className={`start-op-btn ${players.length >= 4 ? 'ready' : ''}`}
            onClick={startDistribution}
          >
            ПОДТВЕРДИТЬ СОСТАВ ({players.length})
          </button>
        </div>
      )}

      {/* ЭКРАН 2: СКРЫТАЯ РАЗДАЧА */}
      {stage === 'distribution' && (
        <div className="view-container center fade-in">
          <div className="identity-card">
            <div className="id-header">TOP SECRET</div>
            <div className="id-content">
              <div className="id-sub">OPERATIVE</div>
              <h2 className="id-name">{players[activePlayerIdx].name}</h2>
              
              {activePlayerIdx !== null && (
                <div className="role-reveal-zone">
                  <p className="hint-text">Нажмите и удерживайте, чтобы увидеть роль</p>
                  <button className="reveal-trigger">ПОСМОТРЕТЬ РОЛЬ</button>
                  <div className="actual-role">{players[activePlayerIdx].role}</div>
                </div>
              )}
            </div>
            <button className="id-next" onClick={() => {
              if (activePlayerIdx < players.length - 1) setActivePlayerIdx(activePlayerIdx + 1);
              else setStage('operation');
            }}>
              СЛЕДУЮЩИЙ <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: АКТИВНАЯ ФАЗА (КАРТА) */}
      {stage === 'operation' && (
        <div className="view-container operation-view fade-in">
          <div className="status-bar">
            <div className="phase-indicator">
              {nightPhase ? <><MoonIcon/> NIGHT OP</> : <><SunIcon/> DAYLIGHT</>}
            </div>
            <div className="day-count">DAY 01</div>
          </div>

          <div className="tactical-grid">
            {players.map(p => (
              <div key={p.id} className={`sector ${!p.alive ? 'destroyed' : ''} ${selection.kill === p.id ? 'target' : ''}`}>
                <div className="sector-info">
                  <span className="s-name">{p.name}</span>
                  <span className="s-role">{p.role}</span>
                </div>

                <div className="sector-actions">
                  {p.alive ? (
                    nightPhase ? (
                      <div className="n-btns">
                        <button onClick={() => setSelection({...selection, kill: p.id})} className={selection.kill === p.id ? 'active' : ''}><Crosshair size={14}/></button>
                        <button onClick={() => setSelection({...selection, save: p.id})} className={selection.save === p.id ? 'active' : ''}><Shield size={14}/></button>
                        <button onClick={() => setSelection({...selection, check: p.id})} className={selection.check === p.id ? 'active' : ''}><Eye size={14}/></button>
                      </div>
                    ) : (
                      <button className="day-kill-btn" onClick={() => {
                        setPlayers(players.map(pl => pl.id === p.id ? {...pl, alive: false} : pl));
                      }}>ELIMINATE</button>
                    )
                  ) : <div className="status-label">KIA</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="control-deck">
            <div className="mini-logs">
              {logs[0] || "> Ожидание приказов..."}
            </div>
            {nightPhase ? (
              <button className="p-action-btn run" onClick={executeNight}>ПОДТВЕРДИТЬ УДАР</button>
            ) : (
              <button className="p-action-btn wait" onClick={() => setNightPhase(true)}>ОБЪЯВИТЬ НОЧЬ</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// // Иконки
const MoonIcon = () => <div className="i-moon" />;
const SunIcon = () => <div className="i-sun" />;

// // СТИЛИЗАЦИЯ: TACTICAL BLUEPRINT
const tacticalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Share+Tech+Mono&display=swap');

  .tactical-root {
    position: fixed; inset: 0; background: #0b0e11; color: #a0aec0;
    font-family: 'Share Tech Mono', monospace; z-index: 10000;
  }
  
  .tactical-root.is-night { background: #050709; border: 2px solid #2d3748; }

  .view-container { height: 100%; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
  .view-container.center { justify-content: center; align-items: center; }

  .t-header { display: flex; justify-content: space-between; border-bottom: 1px solid #2d3748; padding-bottom: 10px; margin-bottom: 20px; }
  .t-label { font-family: 'Syncopate', sans-serif; font-size: 10px; letter-spacing: 3px; color: #4a5568; }

  /* Инпуты */
  .input-block { display: flex; gap: 10px; margin-bottom: 20px; }
  .input-block input { 
    flex: 1; background: #1a202c; border: 1px solid #2d3748; 
    padding: 15px; color: #fff; font-family: inherit; border-radius: 4px;
  }
  .input-block button { background: #3182ce; color: #fff; border: none; padding: 0 20px; border-radius: 4px; }

  .player-chips { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
  .chip { background: #2d3748; padding: 8px 12px; border-radius: 20px; font-size: 12px; display: flex; gap: 8px; align-items: center; }
  
  .start-op-btn { 
    width: 100%; padding: 20px; background: #1a202c; border: 1px solid #2d3748; 
    color: #4a5568; font-family: 'Syncopate'; font-size: 12px; transition: 0.3s;
  }
  .start-op-btn.ready { background: #3182ce; color: #fff; border-color: #3182ce; }

  /* Карточка роли */
  .identity-card { 
    width: 100%; max-width: 320px; background: #1a202c; border-top: 4px solid #3182ce; 
    padding: 30px; position: relative; overflow: hidden;
  }
  .id-header { font-size: 10px; opacity: 0.3; margin-bottom: 20px; letter-spacing: 5px; }
  .id-name { font-family: 'Syncopate'; font-size: 1.5rem; color: #fff; margin-bottom: 40px; }
  
  .role-reveal-zone { 
    padding: 20px; border: 1px dashed #4a5568; text-align: center; position: relative; 
  }
  .reveal-trigger:active + .actual-role { opacity: 1; }
  .actual-role { 
    position: absolute; inset: 0; background: #1a202c; display: flex; 
    align-items: center; justify-content: center; font-size: 1.5rem; 
    color: #3182ce; opacity: 0; pointer-events: none; transition: 0.1s;
  }

  /* Сетка операции */
  .operation-view { padding: 10px; }
  .status-bar { display: flex; justify-content: space-between; padding: 10px; font-size: 12px; border-bottom: 1px solid #2d3748; }
  
  .tactical-grid { 
    flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; 
    margin: 15px 0; overflow-y: auto; align-content: start;
  }
  .sector { 
    background: #1a202c; border: 1px solid #2d3748; padding: 12px; 
    display: flex; flex-direction: column; gap: 10px; position: relative;
  }
  .sector.destroyed { opacity: 0.3; background: #000; }
  .sector.target { border-color: #e53e3e; box-shadow: 0 0 10px rgba(229, 62, 62, 0.2); }
  
  .s-name { display: block; color: #fff; font-size: 14px; font-weight: bold; }
  .s-role { font-size: 10px; opacity: 0.4; }

  .n-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
  .n-btns button { 
    background: #0b0e11; border: 1px solid #2d3748; color: #4a5568; 
    height: 30px; display: flex; align-items: center; justify-content: center; 
  }
  .n-btns button.active { background: #3182ce; color: #fff; border-color: #3182ce; }

  .day-kill-btn { width: 100%; border: 1px solid #e53e3e; color: #e53e3e; background: none; font-size: 10px; padding: 5px; }

  .control-deck { 
    background: #1a202c; padding: 15px; border-radius: 8px; border-top: 2px solid #3182ce;
  }
  .mini-logs { font-size: 11px; color: #3182ce; margin-bottom: 10px; font-style: italic; }
  .p-action-btn { 
    width: 100%; padding: 15px; border: none; font-family: 'Syncopate'; 
    font-size: 12px; font-weight: bold; cursor: pointer;
  }
  .p-action-btn.run { background: #e53e3e; color: #fff; }
  .p-action-btn.wait { background: #3182ce; color: #fff; }

  .fade-in { animation: opIn 0.4s ease-out; }
  @keyframes opIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
`;

export default MafiaTactical;

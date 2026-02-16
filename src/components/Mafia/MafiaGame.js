import React, { useState, useEffect } from 'react';
// // Используем минимальный набор иконок для акцентов
import { Search, X, Heart, Skull, Zap, RotateCcw } from 'lucide-react';

const MafiaScrapbook = ({ onBack }) => {
  // === ГЛОБАЛЬНЫЙ КОНТЕКСТ ===
  const [mode, setMode] = useState('folder'); // // folder (ввод), desk (игра), morgue (убитые)
  const [players, setPlayers] = useState([]);
  const [names, setNames] = useState("");
  const [nightAction, setNightAction] = useState({ target: null, type: null }); // // 'kill', 'save', 'check'
  const [log, setLog] = useState(["Дело открыто..."]);

  // === ЛОГИКА СТАРТА ===
  const openCase = () => {
    const list = names.split('\n').filter(n => n.trim());
    if (list.length < 4) return;

    // // Раздаем роли (ведущий видит их в досье, игроки — при передаче телефона)
    let roles = ['Мафия', 'Комиссар', 'Доктор'];
    if (list.length > 8) roles.push('Мафия');
    while (roles.length < list.length) roles.push('Мирный');
    roles = roles.sort(() => Math.random() - 0.5);

    setPlayers(list.map((n, i) => ({
      id: i,
      name: n.trim(),
      role: roles[i],
      alive: true,
      fouls: 0,
      checked: false
    })));
    setMode('desk');
  };

  // === ЛОГИКА ВЗАИМОДЕЙСТВИЯ (Drag & Drop Logic Sim) ===
  const applyAction = (playerId, type) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        if (type === 'kill') return { ...p, alive: false };
        if (type === 'check') return { ...p, checked: true };
        if (type === 'foul') return { ...p, fouls: p.fouls + 1 };
      }
      return p;
    }));
    
    const actionName = type === 'kill' ? "ликвидирован" : type === 'check' ? "проверен" : "получил фол";
    setLog([`Игрок ${players[playerId].name} ${actionName}`, ...log]);
  };

  return (
    <div className="scrapbook-root">
      <style>{scrapbookStyles}</style>

      {/* ЭКРАН 1: СТАРАЯ ПАПКА (ВВОД) */}
      {mode === 'folder' && (
        <div className="folder-view fade-in">
          <div className="paper-stack">
            <h1 className="noir-header">ПРОТОКОЛ №{Math.floor(Math.random()*900 + 100)}</h1>
            <p className="instruction">Перечислите подозреваемых:</p>
            <textarea 
              className="typewriter-input"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="ИМЯ ФАМИЛИЯ..."
            />
            <button className="stamp-btn" onClick={openCase}>НАЧАТЬ СЛЕДСТВИЕ</button>
            <button className="exit-link" onClick={onBack}>ОТМЕНИТЬ</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: СТОЛ СЛЕДОВАТЕЛЯ (ИГРА) */}
      {mode === 'desk' && (
        <div className="desk-view">
          <div className="desk-header">
            <div className="case-info">ДЕЛО: "ТЕНИ ГОРОДА"</div>
            <button className="morgue-trigger" onClick={() => setMode('morgue')}>МОРГ ({players.filter(p => !p.alive).length})</button>
          </div>

          <div className="evidence-grid">
            {players.filter(p => p.alive).map(p => (
              <div key={p.id} className={`dossier-card ${p.checked ? 'is-checked' : ''}`}>
                <div className="card-photo">
                  <div className="photo-placeholder">{p.name[0]}</div>
                  {p.checked && <div className="role-stamp">{p.role}</div>}
                </div>
                <div className="card-info">
                  <h3 className="name">{p.name}</h3>
                  <div className="foul-marks">
                    {[...Array(p.fouls)].map((_, i) => <Zap key={i} size={10} fill="#d35400" color="#d35400"/>)}
                  </div>
                </div>
                
                {/* Быстрые действия "как пометки на фото" */}
                <div className="card-actions">
                  <button onClick={() => applyAction(p.id, 'kill')} title="Убрать"><Skull size={16}/></button>
                  <button onClick={() => applyAction(p.id, 'check')} title="Проверить"><Search size={16}/></button>
                  <button onClick={() => applyAction(p.id, 'foul')} title="Фол"><Zap size={16}/></button>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-log">
            {log.slice(0, 2).map((l, i) => <div key={i} className="log-line">{`> ${l}`}</div>)}
          </div>
        </div>
      )}

      {/* ЭКРАН 3: МОРГ (АРХИВ) */}
      {mode === 'morgue' && (
        <div className="morgue-view fade-in">
          <button className="close-morgue" onClick={() => setMode('desk')}><X size={24}/></button>
          <h2 className="noir-header">АРХИВ ПОГИБШИХ</h2>
          <div className="dead-list">
            {players.filter(p => !p.alive).map(p => (
              <div key={p.id} className="dead-entry">
                <span className="dead-name">{p.name}</span>
                <span className="dead-role">[{p.role}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// // CSS: NOIR SCRAPBOOK DESIGN
const scrapbookStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');

  .scrapbook-root {
    position: fixed; inset: 0; background: #2c2c2c;
    color: #2c1e1e; font-family: 'EB Garamond', serif;
    z-index: 100000; overflow: hidden;
  }

  /* Текстура бумаги */
  .paper-stack {
    background: #f4f1ea; width: 90%; max-width: 400px; margin: 40px auto;
    padding: 30px; box-shadow: 5px 5px 0 #1a1a1a, 10px 10px 0 #d4af37;
    position: relative; border: 1px solid #dcd7c9;
  }

  .noir-header {
    font-family: 'Special Elite', cursive; font-size: 1.5rem;
    border-bottom: 2px solid #2c1e1e; padding-bottom: 10px; margin-bottom: 20px;
    text-transform: uppercase; letter-spacing: 2px;
  }

  .typewriter-input {
    width: 100%; height: 200px; background: transparent; border: none;
    font-family: 'Special Elite', cursive; font-size: 1.1rem; line-height: 1.5;
    background-image: radial-gradient(#d1cfc0 1px, transparent 1px);
    background-size: 20px 20px; outline: none; resize: none;
  }

  .stamp-btn {
    width: 100%; padding: 15px; margin-top: 20px;
    background: #c0392b; color: #fff; border: none;
    font-family: 'Special Elite', cursive; font-size: 1.2rem;
    cursor: pointer; transform: rotate(-1deg);
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  }

  /* Рабочий стол */
  .desk-view {
    height: 100%; background: #1a1a1a url('https://www.transparenttextures.com/patterns/dark-leather.png');
    display: flex; flex-direction: column; padding: 15px;
  }

  .desk-header { display: flex; justify-content: space-between; align-items: center; color: #d4af37; margin-bottom: 20px; }
  .case-info { font-family: 'Special Elite'; font-size: 0.8rem; border: 1px solid #d4af37; padding: 4px 8px; }

  .evidence-grid {
    flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; overflow-y: auto;
  }

  .dossier-card {
    background: #e4e0d5; padding: 10px; box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
    position: relative; display: flex; flex-direction: column; align-items: center;
    transform: rotate(${Math.random() * 4 - 2}deg);
  }

  .card-photo {
    width: 100%; aspect-ratio: 1/1; background: #ccc; margin-bottom: 10px;
    position: relative; overflow: hidden; border: 4px solid #fff;
  }
  .photo-placeholder { 
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    font-size: 3rem; font-family: 'Special Elite'; color: #aaa; background: #eee;
  }

  .role-stamp {
    position: absolute; bottom: 5px; right: 5px; background: rgba(192, 57, 43, 0.8);
    color: #fff; font-size: 0.6rem; padding: 2px 5px; transform: rotate(-15deg);
    font-family: 'Special Elite';
  }

  .name { font-family: 'Special Elite'; font-size: 0.9rem; margin: 5px 0; text-align: center; }

  .card-actions {
    display: flex; gap: 10px; margin-top: auto; border-top: 1px solid #ccc; padding-top: 8px;
  }
  .card-actions button { 
    background: none; border: none; color: #555; cursor: pointer; 
    transition: 0.2s; 
  }
  .card-actions button:hover { color: #c0392b; }

  .bottom-log {
    margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.6);
    color: #00ff41; font-family: 'Special Elite'; font-size: 10px;
  }

  /* Морг */
  .morgue-view {
    position: absolute; inset: 0; background: #000; color: #fff; padding: 40px;
  }
  .dead-entry { 
    display: flex; justify-content: space-between; border-bottom: 1px dashed #444;
    padding: 10px 0; font-family: 'Special Elite';
  }
  .dead-role { color: #c0392b; }
  .close-morgue { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; }

  .fade-in { animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default MafiaScrapbook;

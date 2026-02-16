import React, { useState, useEffect } from 'react';
// // Иконки в стиле классики
import { Moon, Sun, ArrowLeft, Skull, Heart, Timer, RefreshCw, Eye, UserPlus, Trash2, CheckCircle2 } from 'lucide-react';
// // Данные ролей
import { mafiaRoles } from './mafiaData';

// // Имена по умолчанию для атмосферы
const NICKNAMES = ["Дон", "Капо", "Советник", "Красотка", "Букмекер", "Адвокат", "Судья", "Счастливчик", "Громила", "Интуит"];

const MafiaGame = ({ onBack }) => {
  // === СОСТОЯНИЯ ===
  const [gameState, setGameState] = useState('setup');
  const [phase, setPhase] = useState('night');
  const [tempNames, setTempNames] = useState(['', '', '', '']);
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

  // === ЛОГИКА СПИСКА ИГРОКОВ ===
  // // Добавить новое поле
  const addPlayerField = () => setTempNames([...tempNames, '']);
  // // Удалить поле (минимум 4)
  const removePlayerField = (idx) => {
    if (tempNames.length > 4) setTempNames(tempNames.filter((_, i) => i !== idx));
  };
  // // Обновить имя
  const handleNameChange = (idx, val) => {
    const next = [...tempNames];
    next[idx] = val;
    setTempNames(next);
  };

  // === СТАРТ ИГРЫ ===
  const startDealing = () => {
    let rolesPool = [];
    const count = tempNames.length;
    const mafiaCount = Math.max(1, Math.floor(count / 4));
    
    // // Наполнение пула
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'), mafiaRoles.find(r => r.id === 'detective'));
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));
    while (rolesPool.length < count) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    
    // // Перемешивание
    rolesPool = rolesPool.slice(0, count).sort(() => Math.random() - 0.5);
    
    setPlayers(tempNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || NICKNAMES[i % NICKNAMES.length],
      role: rolesPool[i],
      alive: true,
      statusEffect: null,
      isRevealed: false
    })));
    
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

  // === ИГРОВОЙ ЦИКЛ ===
  const confirmCycle = () => {
    const updated = players.map(p => {
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      return { ...p, statusEffect: null };
    });
    setPlayers(updated);
    const v = checkVictory(updated);
    if (v) { setWinner(v); setGameState('results'); }
    else { setPhase(phase === 'night' ? 'day' : 'night'); setTimerActive(false); setTimeLeft(60); }
  };

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

  return (
    <div className={`estate-root ${phase}`}>
      <style>{estateStyles}</style>

      {/* ЭКРАН 1: НАСТРОЙКА (С фиксом кнопки) */}
      {gameState === 'setup' && (
        <div className="estate-view setup-layout fade-in">
          <header className="e-header">
            <button onClick={onBack} className="e-back"><ArrowLeft size={18}/> ВЫЙТИ</button>
            <div className="e-logo">THE SYNDICATE</div>
          </header>

          <h1 className="e-title">Список<span>Гостей</span></h1>

          <div className="e-scroll-container">
            <div className="e-guest-list">
              {tempNames.map((name, i) => (
                <div key={i} className="e-guest-row">
                  <span className="e-guest-number">{String(i + 1).padStart(2, '0')}</span>
                  <input 
                    type="text" 
                    placeholder="Имя гостя..."
                    value={name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                  />
                  <button onClick={() => removePlayerField(i)} className="e-guest-del"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={addPlayerField} className="e-add-guest"><UserPlus size={16}/> Пригласить еще</button>
            </div>
          </div>

          <div className="e-footer-controls">
            <div className="e-settings">
              <div className={`e-check ${useManiac ? 'active' : ''}`} onClick={() => setUseManiac(!useManiac)}>Маньяк</div>
              <div className={`e-check ${useProstitute ? 'active' : ''}`} onClick={() => setUseProstitute(!useProstitute)}>Путана</div>
            </div>
            <button onClick={startDealing} className="e-btn-gold">Начать встречу</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: РАЗДАЧА */}
      {gameState === 'dealing' && (
        <div className="estate-view center fade-in">
          <div className="e-role-envelope">
            <div className="e-env-header">Конфиденциально</div>
            <div className="e-env-content">
              <h2 className="e-env-name">{players[currentPlayerIdx].name}</h2>
              {!showRole ? (
                <button onClick={() => setShowRole(true)} className="e-btn-gold">Вскрыть конверт</button>
              ) : (
                <div className="e-role-reveal">
                  <h3 className={players[currentPlayerIdx].role.side}>{players[currentPlayerIdx].role.name}</h3>
                  <p>{players[currentPlayerIdx].role.desc}</p>
                  <button onClick={() => { setShowRole(false); currentPlayerIdx < players.length - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action'); }} className="e-btn-outline">Ясно</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ИГРОВОЙ ПРОЦЕСС */}
      {gameState === 'action' && (
        <div className="estate-action-view fade-in">
          <header className="e-action-header">
            <div className="e-timer" onClick={() => setTimerActive(!timerActive)}><Timer size={18}/> {timeLeft}с</div>
            <div className="e-phase-title">{phase === 'night' ? 'Глубокая ночь' : 'Солнечный день'}</div>
            <button className="e-swap" onClick={() => setPhase(phase === 'night' ? 'day' : 'night')}><RefreshCw size={18}/></button>
          </header>

          <div className="e-cards-grid">
            {players.map(p => (
              <div key={p.id} className={`e-player-card ${!p.alive ? 'dead' : ''} ${p.statusEffect ? 'selected' : ''}`}>
                <div className="e-card-main">
                  <span className="e-card-name">{p.name}</span>
                  <div className="e-card-badges">
                    <span className={`e-badge ${p.role.side}`}>{p.role.name}</span>
                    {p.isRevealed && <Eye size={12}/>}
                  </div>
                </div>
                <div className="e-card-actions">
                  {p.alive ? (
                    <>
                      <button className={`e-action-btn k ${p.statusEffect === 'killed' ? 'active' : ''}`} onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'killed' ? null : 'killed'} : pl))}><Skull size={18}/></button>
                      <button className={`e-action-btn r ${p.isRevealed ? 'active' : ''}`} onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, isRevealed: !pl.isRevealed} : pl))}><Eye size={18}/></button>
                      {phase === 'night' && <button className={`e-action-btn h ${p.statusEffect === 'healed' ? 'active' : ''}`} onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'healed' ? null : 'healed'} : pl))}><Heart size={18}/></button>}
                    </>
                  ) : <span className="e-eliminated">ВЫБЫЛ</span>}
                </div>
              </div>
            ))}
          </div>

          <button onClick={confirmCycle} className="e-btn-confirm">
            {phase === 'night' ? 'Завершить ночь' : 'Итоги голосования'}
          </button>
        </div>
      )}

      {/* ЭКРАН 4: ПОБЕДА */}
      {gameState === 'results' && (
        <div className="estate-view center fade-in">
          <div className="e-victory-card">
            <p>Финал встречи</p>
            <h1>Победила {winner}</h1>
            <button onClick={() => setGameState('setup')} className="e-btn-gold">Новая партия</button>
          </div>
        </div>
      )}
    </div>
  );
};

const estateStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@400;700&display=swap');

  .estate-root {
    position: fixed !important; inset: 0 !important;
    font-family: 'Montserrat', sans-serif !important;
    display: flex !important; flex-direction: column !important;
    z-index: 100000 !important; transition: all 0.6s ease !important;
    overflow: hidden !important;
  }
  
  .estate-root.night { background: #0a0e14 !important; color: #d4af37 !important; }
  .estate-root.day { background: #fdfaf1 !important; color: #2c1e1e !important; }

  .estate-view { width: 100% !important; max-width: 440px !important; margin: 0 auto !important; height: 100% !important; display: flex !important; flex-direction: column !important; padding: 20px !important; box-sizing: border-box !important; }
  .estate-view.center { justify-content: center !important; }

  /* Специфичный лейаут для настройки */
  .setup-layout { display: flex !important; flex-direction: column !important; }
  .e-scroll-container { flex: 1 !important; overflow-y: auto !important; margin: 15px 0 !important; padding-right: 5px !important; }

  .e-header { display: flex; justify-content: space-between; align-items: center; min-height: 40px; }
  .e-back { background: none; border: 1px solid currentColor; color: inherit; padding: 6px 14px; font-size: 0.7rem; font-weight: 700; cursor: pointer; border-radius: 40px; }
  .e-logo { font-family: 'Playfair Display'; font-weight: 900; font-style: italic; font-size: 0.9rem; letter-spacing: 2px; }

  .e-title { font-family: 'Playfair Display'; font-size: 2.5rem; line-height: 1; margin: 20px 0; text-align: center; font-weight: 900; }
  .e-title span { display: block; font-style: italic; font-weight: 400; color: #c41e3a; }

  /* Список */
  .e-guest-list { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); padding: 15px; border-radius: 12px; }
  .estate-root.night .e-guest-list { background: rgba(255,255,255,0.02); border-color: rgba(212, 175, 55, 0.2); }
  .e-guest-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; }
  .e-guest-number { font-family: 'Playfair Display'; font-weight: 700; opacity: 0.4; font-size: 0.8rem; width: 25px; }
  .e-guest-row input { flex: 1; background: none; border: none; font-family: inherit; font-size: 1rem; color: inherit; outline: none; }
  .e-guest-del { background: none; border: none; color: #c41e3a; cursor: pointer; }
  .e-add-guest { width: 100%; padding: 10px; background: none; border: 1px dashed currentColor; color: inherit; border-radius: 8px; cursor: pointer; font-weight: 700; }

  /* Нижняя часть настроек */
  .e-footer-controls { padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, 0.2); }
  .e-settings { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
  .e-check { padding: 10px; border: 1px solid currentColor; border-radius: 8px; text-align: center; font-weight: 700; font-size: 0.75rem; cursor: pointer; }
  .e-check.active { background: #d4af37 !important; color: #fff !important; border-color: #d4af37 !important; }

  .e-btn-gold { 
    width: 100%; padding: 18px; background: #d4af37; color: #fff; border: none; border-radius: 12px; 
    font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    text-transform: uppercase;
  }

  /* Конверт */
  .e-role-envelope { background: #fff; padding: 30px 20px; border-radius: 4px; box-shadow: 0 15px 30px rgba(0,0,0,0.2); width: 100%; max-width: 300px; position: relative; border-top: 30px solid #f0f0f0; }
  .estate-root.night .e-role-envelope { background: #1a1e26; border-top-color: #12151c; }
  .e-env-header { position: absolute; top: -22px; left: 0; width: 100%; text-align: center; font-size: 0.5rem; text-transform: uppercase; color: #888; letter-spacing: 2px; }
  .e-env-name { font-family: 'Playfair Display'; font-size: 1.8rem; margin-bottom: 20px; }
  .e-role-reveal h3 { font-family: 'Playfair Display'; font-size: 2.2rem; margin-bottom: 8px; }
  .e-role-reveal .evil { color: #c41e3a; }
  .e-role-reveal .good { color: #2e7d32; }
  .e-role-reveal p { font-size: 0.8rem; opacity: 0.8; margin-bottom: 20px; }
  .e-btn-outline { background: none; border: 1px solid currentColor; color: inherit; padding: 8px 20px; border-radius: 30px; cursor: pointer; font-weight: 700; }

  /* Экран действий */
  .estate-action-view { height: 100%; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
  .e-action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 10px; }
  .e-timer { font-weight: 700; display: flex; align-items: center; gap: 6px; }
  .e-phase-title { font-family: 'Playfair Display'; font-weight: 900; }
  .e-swap { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.4; }

  .e-cards-grid { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
  .e-player-card { background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.1); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
  .e-player-card.selected { border-color: #d4af37; background: rgba(212, 175, 55, 0.15); }
  .e-player-card.dead { opacity: 0.4; }
  .e-card-name { font-weight: 700; font-family: 'Playfair Display'; font-size: 1rem; }
  .e-badge { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; opacity: 0.6; margin-right: 5px; }

  .e-card-actions { display: flex; gap: 6px; }
  .e-action-btn { background: none; border: 1px solid rgba(212, 175, 55, 0.3); color: inherit; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .e-action-btn.active { background: #d4af37 !important; color: #fff !important; }
  .e-eliminated { font-size: 0.6rem; font-weight: 700; color: #c41e3a; }

  .e-btn-confirm { width: 100%; padding: 20px; background: #2c1e1e; color: #fff; border: none; font-weight: 700; border-radius: 12px; cursor: pointer; margin-top: 10px; }
  .estate-root.night .e-btn-confirm { background: #d4af37; color: #000; }

  .e-victory-card { text-align: center; }
  .e-victory-card h1 { font-family: 'Playfair Display'; font-size: 2.8rem; font-weight: 900; margin: 20px 0; }

  .fade-in { animation: eIn 0.4s ease-out forwards; }
  @keyframes eIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
`;

export default MafiaGame;

import React, { useState, useEffect } from 'react';
// // Иконки в стиле классики
import { Moon, Sun, ArrowLeft, Skull, Heart, Timer, RefreshCw, Eye, UserPlus, Trash2, CheckCircle2 } from 'lucide-react';
import { mafiaRoles } from './mafiaData';

const NICKNAMES = ["Дон", "Капо", "Советник", "Красотка", "Букмекер", "Адвокат", "Судья", "Счастливчик", "Громила", "Интуит"];

const MafiaGame = ({ onBack }) => {
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

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { setTimerActive(false); }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const addPlayerField = () => setTempNames([...tempNames, '']);
  const removePlayerField = (idx) => {
    if (tempNames.length > 4) setTempNames(tempNames.filter((_, i) => i !== idx));
  };
  const handleNameChange = (idx, val) => {
    const next = [...tempNames];
    next[idx] = val;
    setTempNames(next);
  };

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
      isRevealed: false
    })));
    
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

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

      {/* ЭКРАН 1: СПИСОК ПРИГЛАШЕННЫХ */}
      {gameState === 'setup' && (
        <div className="estate-view fade-in">
          <header className="e-header">
            <button onClick={onBack} className="e-back"><ArrowLeft size={18}/> ВЫЙТИ</button>
            <div className="e-logo">THE SYNDICATE</div>
          </header>

          <h1 className="e-title">Список<span>Гостей</span></h1>

          <div className="e-guest-list">
            {tempNames.map((name, i) => (
              <div key={i} className="e-guest-row">
                <span className="e-guest-number">{String(i + 1).padStart(2, '0')}</span>
                <input 
                  type="text" 
                  placeholder="Введите имя гостя..."
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                />
                <button onClick={() => removePlayerField(i)} className="e-guest-del"><Trash2 size={16}/></button>
              </div>
            ))}
            <button onClick={addPlayerField} className="e-add-guest"><UserPlus size={16}/> Пригласить еще</button>
          </div>

          <div className="e-settings">
            <div className={`e-check ${useManiac ? 'active' : ''}`} onClick={() => setUseManiac(!useManiac)}>Маньяк</div>
            <div className={`e-check ${useProstitute ? 'active' : ''}`} onClick={() => setUseProstitute(!useProstitute)}>Путана</div>
          </div>

          <button onClick={startDealing} className="e-btn-gold">Начать встречу</button>
        </div>
      )}

      {/* ЭКРАН 2: ПРИВАТНЫЙ ЗАЛ (РАЗДАЧА) */}
      {gameState === 'dealing' && (
        <div className="estate-view center fade-in">
          <div className="e-role-envelope">
            <div className="e-env-header">Строго конфиденциально</div>
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

      {/* ЭКРАН 3: ПУЛЬТ РАСПОРЯДИТЕЛЯ */}
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
            {phase === 'night' ? 'Завершить ночь' : 'Подтвердить итоги дня'}
          </button>
        </div>
      )}

      {/* ЭКРАН 4: ИТОГИ */}
      {gameState === 'results' && (
        <div className="estate-view center fade-in">
          <div className="e-victory-card">
            <p>Встреча окончена</p>
            <h1>Победила {winner}</h1>
            <button onClick={() => setGameState('setup')} className="e-btn-gold">Новый раунд</button>
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
    z-index: 100000 !important; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .estate-root.night { background: #0a0e14 !important; color: #d4af37 !important; }
  .estate-root.day { background: #fdfaf1 !important; color: #2c1e1e !important; }

  .estate-view { width: 100% !important; max-width: 440px !important; margin: 0 auto !important; padding: 25px !important; }
  .estate-view.center { display: flex; align-items: center; justify-content: center; height: 100%; }

  .e-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .e-back { background: none; border: 1px solid currentColor; color: inherit; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; border-radius: 40px; }
  .e-logo { font-family: 'Playfair Display'; font-weight: 900; font-style: italic; font-size: 0.9rem; letter-spacing: 2px; }

  .e-title { font-family: 'Playfair Display'; font-size: 3rem; line-height: 1; margin-bottom: 40px; text-align: center; font-weight: 900; }
  .e-title span { display: block; font-style: italic; font-weight: 400; color: #c41e3a; }

  /* Списки гостей */
  .e-guest-list { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); padding: 20px; border-radius: 12px; margin-bottom: 30px; }
  .estate-root.night .e-guest-list { background: rgba(255,255,255,0.02); border-color: rgba(212, 175, 55, 0.2); }
  
  .e-guest-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; }
  .e-guest-number { font-family: 'Playfair Display'; font-weight: 700; opacity: 0.4; font-size: 0.8rem; }
  .e-guest-row input { flex: 1; background: none; border: none; font-family: inherit; font-size: 1rem; color: inherit; outline: none; }
  .e-guest-del { background: none; border: none; color: #c41e3a; cursor: pointer; opacity: 0.6; }

  .e-add-guest { width: 100%; padding: 12px; background: none; border: 1px dashed currentColor; color: inherit; border-radius: 8px; cursor: pointer; font-weight: 700; margin-top: 10px; }

  .e-settings { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
  .e-check { padding: 12px; border: 1px solid currentColor; border-radius: 8px; text-align: center; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.3s; }
  .e-check.active { background: #d4af37 !important; color: #fff !important; border-color: #d4af37 !important; }

  .e-btn-gold { 
    width: 100%; padding: 20px; background: #d4af37; color: #fff; border: none; border-radius: 12px; 
    font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* Конверт роли */
  .e-role-envelope { background: #fff; padding: 40px 20px; border-radius: 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); width: 100%; max-width: 320px; position: relative; border-top: 40px solid #f0f0f0; }
  .estate-root.night .e-role-envelope { background: #1a1e26; border-top-color: #12151c; }
  .e-env-header { position: absolute; top: -30px; left: 0; width: 100%; text-align: center; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: #888; }
  .e-env-name { font-family: 'Playfair Display'; font-size: 2rem; margin-bottom: 30px; }
  .e-role-reveal h3 { font-family: 'Playfair Display'; font-size: 2.5rem; margin-bottom: 10px; }
  .e-role-reveal .evil { color: #c41e3a; }
  .e-role-reveal .good { color: #2e7d32; }
  .e-role-reveal p { font-size: 0.8rem; opacity: 0.7; margin-bottom: 25px; line-height: 1.6; }
  .e-btn-outline { background: none; border: 1px solid currentColor; color: inherit; padding: 10px 25px; border-radius: 30px; cursor: pointer; font-weight: 700; }

  /* Пульт распорядителя */
  .estate-action-view { flex: 1; display: flex; flex-direction: column; padding: 20px; }
  .e-action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); }
  .e-timer { font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .e-phase-title { font-family: 'Playfair Display'; font-weight: 900; font-size: 1.2rem; }
  .e-swap { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.5; }

  .e-cards-grid { flex: 1; overflow-y: auto; display: grid; gap: 12px; }
  .e-player-card { background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
  .e-player-card.selected { border-color: #d4af37; background: rgba(212, 175, 55, 0.1); }
  .e-player-card.dead { opacity: 0.4; filter: sepia(1); }

  .e-card-main { display: flex; flex-direction: column; gap: 4px; }
  .e-card-name { font-weight: 700; font-size: 1.1rem; font-family: 'Playfair Display'; }
  .e-card-badges { display: flex; align-items: center; gap: 8px; }
  .e-badge { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; opacity: 0.7; }

  .e-card-actions { display: flex; gap: 8px; }
  .e-action-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(212, 175, 55, 0.3); color: inherit; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
  .e-action-btn.active { background: #d4af37 !important; color: #fff !important; }
  .e-eliminated { font-size: 0.6rem; font-weight: 700; letter-spacing: 1px; color: #c41e3a; }

  .e-btn-confirm { width: 100%; padding: 22px; background: #2c1e1e; color: #fff; border: none; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 15px; border-radius: 12px; text-transform: uppercase; letter-spacing: 2px; }
  .estate-root.night .e-btn-confirm { background: #d4af37; color: #000; }

  .e-victory-card { text-align: center; }
  .e-victory-card p { font-family: 'Playfair Display'; font-style: italic; font-size: 1.2rem; margin-bottom: 10px; }
  .e-victory-card h1 { font-family: 'Playfair Display'; font-size: 3.5rem; font-weight: 900; margin-bottom: 40px; }

  .fade-in { animation: eIn 0.6s ease-out forwards; }
  @keyframes eIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default MafiaGame;

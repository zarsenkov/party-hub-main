import React, { useState, useEffect } from 'react';
// // Используем иконки для функционала
import { 
  Moon, Sun, Shield, Crosshair, Eye, 
  RotateCcw, Users, Lock, CheckCircle2, AlertOctagon 
} from 'lucide-react';

const MafiaUltimate = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [screen, setScreen] = useState('setup'); // // setup, dealing, work, victory
  const [phase, setPhase] = useState('night'); 
  const [players, setPlayers] = useState([]);
  const [namesInput, setNamesInput] = useState("");
  const [dealIdx, setDealIdx] = useState(0); // // Кто сейчас смотрит роль
  const [showRole, setShowRole] = useState(false);
  const [targets, setTargets] = useState({ mafia: null, doctor: null, check: null });
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // === ТАЙМЕР ===
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // === ЛОГИКА РАЗДАЧИ ===
  const startDistribution = () => {
    const names = namesInput.split('\n').filter(n => n.trim());
    if (names.length < 4) return alert("Минимум 4 игрока!");

    // // Генерация колоды
    let roles = [];
    const count = names.length;
    const mafiaCount = Math.max(1, Math.floor(count / 3.5));
    
    for (let i = 0; i < mafiaCount; i++) roles.push({ id: 'mafia', name: 'МАФИЯ', side: 'evil', desc: 'Ваша цель — устранить всех мирных.' });
    roles.push({ id: 'doctor', name: 'ДОКТОР', side: 'good', desc: 'Вы можете спасти одного человека ночью.' });
    roles.push({ id: 'detective', name: 'КОМИССАР', side: 'good', desc: 'Проверяйте игроков на причастность к Мафии.' });
    while (roles.length < count) roles.push({ id: 'civilian', name: 'МИРНЫЙ', side: 'good', desc: 'Найдите мафию, пока не стало слишком поздно.' });
    
    roles = roles.sort(() => Math.random() - 0.5);

    const initPlayers = names.map((name, i) => ({
      id: i,
      name: name.trim(),
      role: roles[i],
      alive: true,
      fouls: 0,
      isChecked: false
    }));

    setPlayers(initPlayers);
    setScreen('dealing');
  };

  // === ЛОГИКА ВЕДУЩЕГО ===
  const nextPhase = () => {
    if (phase === 'night') {
      const { mafia, doctor } = targets;
      setPlayers(prev => prev.map(p => {
        if (p.id === mafia && mafia !== doctor) return { ...p, alive: false };
        if (p.id === targets.check) return { ...p, isChecked: true };
        return p;
      }));
      setPhase('day');
      setTargets({ mafia: null, doctor: null, check: null });
    } else {
      setPhase('night');
    }
    setTimer(60);
    setIsTimerRunning(false);
  };

  return (
    <div className={`poker-root ${phase}`}>
      <style>{pokerStyles}</style>

      {/* ЭКРАН 1: НАСТРОЙКА */}
      {screen === 'setup' && (
        <div className="p-view center fade-in">
          <h1 className="p-title">THE<span>SYNDICATE</span></h1>
          <p className="p-subtitle">РЕГИСТРАЦИЯ УЧАСТНИКОВ</p>
          <textarea 
            placeholder="Введите имена (каждое с новой строки)..."
            value={namesInput}
            onChange={e => setNamesInput(e.target.value)}
          />
          <button className="p-btn-gold" onClick={startDistribution}>РАСПРЕДЕЛИТЬ РОЛИ</button>
          <button className="p-btn-exit" onClick={onBack}>ВЫХОД</button>
        </div>
      )}

      {/* ЭКРАН 2: ТИХАЯ РАЗДАЧА (ПЕРЕДАЧА ТЕЛЕФОНА) */}
      {screen === 'dealing' && (
        <div className="p-view center fade-in">
          <div className="card-envelope">
            <div className="env-top">ЛИЧНОЕ ДЕЛО</div>
            <div className="env-body">
              <h2 className="env-player-name">{players[dealIdx].name}</h2>
              {!showRole ? (
                <div className="env-closed">
                  <Lock size={48} />
                  <p>Передайте телефон этому игроку</p>
                  <button className="p-btn-gold" onClick={() => setShowRole(true)}>ОТКРЫТЬ</button>
                </div>
              ) : (
                <div className="env-open">
                  <h3 className={`role-name ${players[dealIdx].role.side}`}>{players[dealIdx].role.name}</h3>
                  <p className="role-desc">{players[dealIdx].role.desc}</p>
                  <button className="p-btn-dark" onClick={() => {
                    setShowRole(false);
                    if (dealIdx < players.length - 1) setDealIdx(dealIdx + 1);
                    else setScreen('work');
                  }}>Я ЗАПОМНИЛ</button>
                </div>
              )}
            </div>
            <div className="env-progress">{dealIdx + 1} / {players.length}</div>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ПУЛЬТ ВЕДУЩЕГО (ОСНОВНОЙ) */}
      {screen === 'work' && (
        <div className="p-view work-layout fade-in">
          <header className="work-header">
            <div className="w-timer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              {timer}s {isTimerRunning ? '⏸' : '▶'}
            </div>
            <div className="w-phase">{phase === 'night' ? <Moon size={18}/> : <Sun size={18}/>}</div>
            <div className="w-reset" onClick={() => setTimer(60)}><RotateCcw size={16}/></div>
          </header>

          <div className="p-list-scroll">
            {players.map(p => (
              <div key={p.id} className={`p-item ${!p.alive ? 'is-dead' : ''} ${targets.mafia === p.id ? 'marked-kill' : ''}`}>
                <div className="p-item-info">
                  <span className="p-item-name">{p.name}</span>
                  <div className="p-item-tags">
                    <span className={`tag-role ${p.role.side}`}>{p.role.name}</span>
                    {p.isChecked && <Eye size={12} color="#f1c40f"/>}
                  </div>
                </div>

                <div className="p-item-btns">
                  {p.alive ? (
                    phase === 'night' ? (
                      <div className="night-actions">
                        <button className={`act-btn m ${targets.mafia === p.id ? 'active' : ''}`} onClick={() => setTargets({...targets, mafia: p.id})}><Crosshair size={14}/></button>
                        <button className={`act-btn d ${targets.doctor === p.id ? 'active' : ''}`} onClick={() => setTargets({...targets, doctor: p.id})}><Shield size={14}/></button>
                        <button className={`act-btn c ${targets.check === p.id ? 'active' : ''}`} onClick={() => setTargets({...targets, check: p.id})}><Eye size={14}/></button>
                      </div>
                    ) : (
                      <div className="day-actions">
                        <button className="act-btn-foul" onClick={() => {
                          const newPlayers = [...players];
                          newPlayers[p.id].fouls += 1;
                          setPlayers(newPlayers);
                        }}>⚠️ {p.fouls}</button>
                        <button className="act-btn-kill" onClick={() => {
                          const newPlayers = [...players];
                          newPlayers[p.id].alive = false;
                          setPlayers(newPlayers);
                        }}><AlertOctagon size={16}/></button>
                      </div>
                    )
                  ) : <span className="p-dead-status">ВЫБЫЛ</span>}
                </div>
              </div>
            ))}
          </div>

          <button className="p-btn-action" onClick={nextPhase}>
            {phase === 'night' ? 'ПОДВЕСТИ ИТОГИ НОЧИ' : 'ГОРОД ЗАСЫПАЕТ'}
          </button>
        </div>
      )}
    </div>
  );
};

// // CSS: CLASSIC NOIR POKER
const pokerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@400;700&display=swap');

  .poker-root {
    position: fixed; inset: 0; background: #1a1a1a; color: #fff;
    font-family: 'Montserrat', sans-serif; display: flex; flex-direction: column; z-index: 10000;
  }
  
  .poker-root.night { background: radial-gradient(circle at center, #2c3e50 0%, #000000 100%); }
  .poker-root.day { background: radial-gradient(circle at center, #4a3b3b 0%, #1a1a1a 100%); }

  .p-view { flex: 1; padding: 20px; display: flex; flex-direction: column; }
  .p-view.center { justify-content: center; align-items: center; }

  /* Типографика */
  .p-title { font-family: 'Cinzel', serif; font-size: 2.5rem; letter-spacing: 4px; text-align: center; line-height: 1; }
  .p-title span { display: block; color: #d4af37; font-size: 1.5rem; }
  .p-subtitle { font-size: 0.7rem; letter-spacing: 5px; opacity: 0.5; margin-bottom: 30px; text-align: center; }

  /* Настройка */
  textarea {
    width: 100%; flex: 0.6; background: rgba(255,255,255,0.05); border: 1px solid #d4af37;
    border-radius: 15px; color: #fff; padding: 20px; font-family: inherit; font-size: 1rem; margin-bottom: 20px;
  }

  /* Кнопки */
  .p-btn-gold { 
    width: 100%; padding: 18px; background: #d4af37; border: none; border-radius: 12px;
    color: #000; font-weight: 900; letter-spacing: 2px; cursor: pointer; margin-bottom: 10px;
  }
  .p-btn-exit { background: none; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px; border-radius: 10px; cursor: pointer; font-size: 0.8rem; }
  .p-btn-dark { width: 100%; padding: 15px; background: #1a1a1a; border: 1px solid #d4af37; color: #d4af37; border-radius: 10px; font-weight: 700; cursor: pointer; }

  /* Конверт раздачи */
  .card-envelope {
    width: 100%; max-width: 300px; background: #f4f1ea; color: #2c3e50; border-radius: 15px;
    padding: 30px 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center;
  }
  .env-top { font-size: 0.6rem; letter-spacing: 3px; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; opacity: 0.6; }
  .env-player-name { font-family: 'Cinzel', serif; font-size: 1.8rem; margin-bottom: 30px; }
  .role-name { font-family: 'Cinzel', serif; font-size: 2rem; margin-bottom: 10px; }
  .role-name.evil { color: #c0392b; }
  .role-name.good { color: #27ae60; }
  .role-desc { font-size: 0.8rem; margin-bottom: 30px; line-height: 1.4; font-style: italic; }
  .env-progress { margin-top: 20px; font-size: 0.7rem; font-weight: 700; opacity: 0.4; }

  /* Пульт ведущего */
  .work-layout { padding: 15px; }
  .work-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 15px; }
  .w-timer { font-family: 'Cinzel', serif; font-size: 1.2rem; color: #d4af37; cursor: pointer; }
  .w-reset { opacity: 0.4; cursor: pointer; }

  .p-list-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
  .p-item { 
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
    padding: 12px 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;
  }
  .p-item.is-dead { opacity: 0.3; filter: grayscale(1); }
  .p-item.marked-kill { border-color: #c0392b; background: rgba(192, 57, 43, 0.1); }
  
  .p-item-name { font-weight: 700; font-size: 1rem; margin-bottom: 2px; display: block; }
  .tag-role { font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-right: 5px; background: rgba(255,255,255,0.1); }
  .tag-role.evil { color: #ff7675; }
  .tag-role.good { color: #55efc4; }

  .night-actions, .day-actions { display: flex; gap: 6px; }
  .act-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #444; background: none; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .act-btn.active.m { background: #c0392b; color: #fff; border-color: #c0392b; }
  .act-btn.active.d { background: #27ae60; color: #fff; border-color: #27ae60; }
  .act-btn.active.c { background: #f1c40f; color: #000; border-color: #f1c40f; }

  .act-btn-foul { background: none; border: 1px solid #f39c12; color: #f39c12; font-size: 0.7rem; padding: 0 8px; border-radius: 6px; font-weight: 700; }
  .act-btn-kill { background: none; border: none; color: #c0392b; cursor: pointer; }

  .p-btn-action { width: 100%; padding: 20px; background: #fff; color: #000; border: none; border-radius: 15px; font-weight: 900; letter-spacing: 1px; cursor: pointer; }
  .night .p-btn-action { background: #d4af37; }

  .p-dead-status { font-size: 0.6rem; font-weight: 700; color: #c0392b; letter-spacing: 1px; }

  .fade-in { animation: pIn 0.4s ease-out; }
  @keyframes pIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default MafiaUltimate;

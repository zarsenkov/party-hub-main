import React, { useState, useEffect } from 'react';
// // Импорт иконок для интерфейса
import { Moon, Sun, ArrowLeft, Users, Skull, Heart, Timer, RefreshCw, Eye, ShieldOff } from 'lucide-react';
import { mafiaRoles } from './mafiaData';

// // Список кличек для атмосферы
const NICKNAMES = ["Крот", "Шустрый", "Барон", "Доцент", "Бритва", "Молчун", "Артист", "Счастливчик", "Шериф", "Лис", "Призрак", "Кабан", "Акула", "Маэстро", "Стукач"];

export default function MafiaGame({ onBack }) {
  // // Глобальные состояния игры
  const [gameState, setGameState] = useState('setup'); // setup, dealing, action, results
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

  // // Логика таймера для обсуждения
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { setTimerActive(false); }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // // Функция перемешивания и раздачи ролей
  const startDealing = () => {
    // // Создаем массив ролей исходя из количества игроков
    let rolesPool = [];
    const mafiaCount = Math.floor(playerCount / 3);

    // // Наполнение пула: Мафия, Доктор, Комиссар всегда (минимум)
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'detective'));

    // // Добавляем спецроли по желанию
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));

    // // Заполняем остаток мирными жителями
    while (rolesPool.length < playerCount) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));

    // // Рандомизация ролей и имен
    rolesPool = rolesPool.slice(0, playerCount).sort(() => Math.random() - 0.5);
    const shuffledNames = [...NICKNAMES].sort(() => Math.random() - 0.5);

    // // Формируем итоговый объект игроков
    setPlayers(rolesPool.map((role, i) => ({
      id: i + 1,
      name: shuffledNames[i] || `Игрок ${i + 1}`,
      role: role,
      alive: true,
      statusEffect: null, // // Может быть 'killed', 'healed', 'checked'
      fouls: 0
    })));
    setCurrentPlayerIdx(0);
    setGameState('dealing');
  };

  // // Проверка условий победы (Мафия/Мирные/Маньяк)
  const checkVictory = (currentPlayers) => {
    const alive = currentPlayers.filter(p => p.alive);
    const mafia = alive.filter(p => p.role.side === 'evil' && p.role.id !== 'maniac');
    const maniac = alive.filter(p => p.role.id === 'maniac');
    const civilians = alive.filter(p => p.role.side === 'good');

    // // Если мафии и маньяка нет — победа города
    if (mafia.length === 0 && maniac.length === 0) return 'Мирные жители';
    // // Если мафия сравнялась по количеству или превзошла (стандартные правила)
    if (mafia.length >= (alive.length - mafia.length)) return 'Мафия';
    // // Если остался только маньяк и 1 игрок
    if (maniac.length > 0 && alive.length <= 2) return 'Маньяк';
    return null;
  };

  // // Обработка смены фазы с расчетом ночных событий
  const confirmAction = () => {
    // // Исправленная логика: проверяем 'killed' ТОЛЬКО если нет 'healed'
    const updated = players.map(p => {
      let isAlive = p.alive;
      if (p.statusEffect === 'killed' && p.statusEffect !== 'healed') {
        isAlive = false;
      }
      // // Сбрасываем временные статусы, но оставляем результат проверки комиссара (checked)
      return { 
        ...p, 
        alive: isAlive, 
        statusEffect: p.statusEffect === 'checked' ? 'checked' : null 
      };
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

  // // Функция переключения статусов (точечное внесение функционала)
  const toggleStatus = (id, status) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, statusEffect: p.statusEffect === status ? null : status };
      }
      return p;
    }));
  };

  // --- ЭКРАН 1: НАСТРОЙКА ---
  if (gameState === 'setup') {
    return (
      <div style={ui.container('day')}>
        <header style={ui.header}>
          <button onClick={onBack} style={ui.backBtn}><ArrowLeft size={20}/></button>
          <div style={ui.badge}>SETUP</div>
        </header>
        <h1 style={ui.neoTitle}>MAFIA_GAME</h1>
        <div style={ui.setupBox}>
          <p style={ui.label}>КОЛИЧЕСТВО ИГРОКОВ: <b>{playerCount}</b></p>
          <input type="range" min="4" max="15" value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))} style={ui.range} />

          <div style={ui.optionsList}>
            <label style={ui.optionItem}>
              <span>ДОБАВИТЬ МАНЬЯКА</span>
              <input type="checkbox" checked={useManiac} onChange={() => setUseManiac(!useManiac)} />
            </label>
            <label style={ui.optionItem}>
              <span>ДОБАВИТЬ ПУТАНУ</span>
              <input type="checkbox" checked={useProstitute} onChange={() => setUseProstitute(!useProstitute)} />
            </label>
          </div>
          <button onClick={startDealing} style={ui.mainBtn}>РАСПРЕДЕЛИТЬ РОЛИ</button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 2: РАЗДАЧА РОЛЕЙ ---
  if (gameState === 'dealing') {
    const p = players[currentPlayerIdx];
    return (
      <div style={ui.container('night')}>
        <h2 style={{fontWeight: '900', letterSpacing: '2px', marginBottom: '30px', color: '#fff'}}>ПЕРЕДАЙ ТЕЛЕФОН</h2>
        <div style={ui.card('night')}>
          <p style={{color: '#ff4444', fontWeight: '900', fontSize: '1.4rem'}}>ЭЙ, {p.name.toUpperCase()}!</p>
          {!showRole ? (
            <button onClick={() => setShowRole(true)} style={ui.mainBtn}>КТО Я?</button>
          ) : (
            <>
              <h1 style={{color: p.role.side === 'evil' ? '#ff4444' : '#44ff44', fontSize: '2.5rem', margin: '20px 0'}}>{p.role.name}</h1>
              <p style={{fontSize: '0.8rem', marginBottom: '20px', color: '#fff'}}>{p.role.desc}</p>
              <button onClick={() => { setShowRole(false); currentPlayerIdx < playerCount - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action'); }} style={{...ui.mainBtn, background: '#fff', color: '#000'}}>ЗАПОМНИЛ</button>
            </>
          )}
        </div>
        <p style={{marginTop: '20px', opacity: 0.5, color: '#fff'}}>ИГРОК {currentPlayerIdx + 1} / {playerCount}</p>
      </div>
    );
  }

  // --- ЭКРАН 3: РЕЗУЛЬТАТЫ ---
  if (gameState === 'results') {
    return (
      <div style={ui.container('day')}>
        <h1 style={{fontSize: '3rem', fontWeight: '900', marginTop: '100px'}}>КОНЕЦ</h1>
        <div style={{background: '#ff4444', color: '#fff', padding: '15px 30px', fontWeight: '900', fontSize: '1.5rem', transform: 'rotate(-2deg)'}}>
          ПОБЕДА: {winner.toUpperCase()}
        </div>
        <button onClick={() => setGameState('setup')} style={{...ui.mainBtn, marginTop: '50px'}}>ИГРАТЬ СНОВА</button>
      </div>
    );
  }

  // --- ЭКРАН 4: ПУЛЬТ ВЕДУЩЕГО ---
  return (
    <div style={ui.container(phase)}>
      <header style={ui.header}>
        <button onClick={() => {setTimerActive(!timerActive); if(timeLeft === 0) setTimeLeft(60)}} style={ui.iconBtn}>
          <Timer size={18} color={timerActive ? '#ff4444' : 'inherit'}/> <b>{timeLeft}с</b>
        </button>
        <div style={ui.badge}>{phase === 'night' ? 'NIGHT' : 'DAY'}</div>
        <button onClick={() => setPhase(phase === 'night' ? 'day' : 'night')} style={ui.iconBtn}><RefreshCw/></button>
      </header>

      <div style={ui.playerGrid}>
        {players.map(p => (
          <div key={p.id} style={ui.playerRow(p.alive, phase)}>
            <div style={{textAlign: 'left'}}>
              <div style={{fontWeight: '900', fontSize: '1.1rem', color: p.statusEffect === 'checked' ? '#d4af37' : 'inherit'}}>
                {p.name} {p.statusEffect === 'checked' && '🔍'}
              </div>
              <div style={{fontSize: '0.6rem', opacity: 0.6}}>{p.role.name.toUpperCase()}</div>
            </div>
            <div style={{display: 'flex', gap: '5px'}}>
              {p.alive ? (
                <>
                  {/* Кнопка смерти */}
                  <button onClick={() => toggleStatus(p.id, 'killed')} style={ui.actionBtn(p.statusEffect === 'killed', '#ff4444')}><Skull size={18}/></button>
                  {/* Кнопка лечения */}
                  <button onClick={() => toggleStatus(p.id, 'healed')} style={ui.actionBtn(p.statusEffect === 'healed', '#44ff44')}><Heart size={18}/></button>
                  {/* Кнопка проверки (только ночью для Комиссара) */}
                  <button onClick={() => toggleStatus(p.id, 'checked')} style={ui.actionBtn(p.statusEffect === 'checked', '#d4af37')}><Eye size={18}/></button>
                </>
              ) : <div style={{color: '#ff4444', fontWeight: '900', fontSize: '0.8rem'}}>DIED</div>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={confirmAction} style={ui.confirmBtn}>
        {phase === 'night' ? 'ПОДВЕСТИ ИТОГИ НОЧИ' : 'ЗАВЕРШИТЬ ГОЛОСОВАНИЕ'}
      </button>
    </div>
  );
}

const ui = {
  container: (p) => ({
    position: 'fixed', inset: 0, padding: '20px', zIndex: 1000,
    background: p === 'night' ? '#0a0a0a' : '#e4e0d9', color: p === 'night' ? '#fff' : '#1a1a1a',
    display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'monospace', overflowY: 'auto'
  }),
  header: { display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' },
  badge: { background: '#1a1a1a', color: '#fff', padding: '2px 10px', fontWeight: '900', transform: 'rotate(-1deg)' },
  neoTitle: { fontSize: '2.5rem', fontWeight: '900', margin: '20px 0', borderBottom: '4px solid #1a1a1a' },
  setupBox: { width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
  label: { fontSize: '0.8rem', fontWeight: '900' },
  range: { width: '100%', accentColor: '#1a1a1a' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', border: '2px solid #1a1a1a', background: '#fff', color: '#000', fontWeight: '900', fontSize: '0.7rem' },
  mainBtn: { background: '#1a1a1a', color: '#fff', border: 'none', padding: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0 #ff4444' },
  card: (p) => ({ background: p === 'night' ? '#111' : '#fff', padding: '30px', border: '3px solid #1a1a1a', width: '100%', textAlign: 'center', boxShadow: '8px 8px 0 rgba(0,0,0,0.2)' }),
  playerGrid: { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' },
  playerRow: (alive, p) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px',
    background: alive ? (p === 'night' ? '#1a1a1a' : '#fff') : 'rgba(0,0,0,0.05)',
    border: '2px solid #1a1a1a', opacity: alive ? 1 : 0.5, boxShadow: alive ? '4px 4px 0 rgba(0,0,0,0.1)' : 'none'
  }),
  actionBtn: (active, color) => ({
    background: active ? color : 'none', color: active ? '#fff' : 'inherit',
    border: `2px solid #1a1a1a`, padding: '8px', cursor: 'pointer', transform: active ? 'translate(1px, 1px)' : 'none',
    boxShadow: active ? '0 0 0' : '2px 2px 0 #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }),
  confirmBtn: { marginTop: '20px', width: '100%', padding: '20px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', flexShrink: 0 },
  iconBtn: { background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' },
  backBtn: { background: '#1a1a1a', color: '#fff', border: 'none', padding: '5px' }
};

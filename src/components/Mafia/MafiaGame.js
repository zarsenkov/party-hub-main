import React, { useState, useEffect } from 'react';
// // Подключаем иконки для интерфейса
import { Moon, Sun, ArrowLeft, Users, Skull, Heart, Timer, UserCheck, ShieldCheck, Ghost, Zap } from 'lucide-react';
import { mafiaRoles } from './mafiaData';

const NICKNAMES = ["Крот", "Шустрый", "Барон", "Доцент", "Бритва", "Молчун", "Артист", "Счастливчик", "Шериф", "Лис", "Призрак", "Кабан", "Акула", "Маэстро", "Стукач"];

export default function MafiaGame({ onBack }) {
  // // Состояния игры
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

  // // Логика таймера обсуждения
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { setTimerActive(false); }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // // Генерация ролей с учетом опций
  const startDealing = () => {
    let rolesPool = [];
    // 1 мафия на 3 игрока
    const mafiaCount = Math.floor(playerCount / 3);
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    
    // Обязательные спец-роли для интересной игры
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'detective'));
    
    // Опциональные роли
    if (useManiac) rolesPool.push(mafiaRoles.find(r => r.id === 'maniac'));
    if (useProstitute) rolesPool.push(mafiaRoles.find(r => r.id === 'prostitute'));
    
    // Заполняем мирными
    while (rolesPool.length < playerCount) {
      rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    }
    
    // Если выбрали слишком много ролей для малого кол-ва игроков — обрезаем лишних мирных или ролей
    rolesPool = rolesPool.slice(0, playerCount).sort(() => Math.random() - 0.5);
    const shuffledNames = [...NICKNAMES].sort(() => Math.random() - 0.5);
    
    setPlayers(rolesPool.map((role, i) => ({
      id: i + 1,
      name: shuffledNames[i] || `Игрок ${i + 1}`,
      role: role,
      alive: true,
      statusEffect: null 
    })));
    setGameState('dealing');
  };

  // // Проверка условий победы
  const checkVictory = (currentPlayers) => {
    const alive = currentPlayers.filter(p => p.alive);
    const mafia = alive.filter(p => p.role.side === 'evil' && p.role.id !== 'maniac');
    const maniac = alive.filter(p => p.role.id === 'maniac');
    const good = alive.filter(p => p.role.side === 'good');

    if (mafia.length === 0 && maniac.length === 0) return 'Мирные жители';
    if (mafia.length >= good.length + maniac.length) return 'Мафия';
    if (maniac.length > 0 && alive.length <= 2) return 'Маньяк';
    return null;
  };

  const confirmDeaths = () => {
    const updated = players.map(p => {
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      if (p.statusEffect === 'healed') return { ...p, statusEffect: null };
      return p;
    });
    setPlayers(updated);
    const gameWinner = checkVictory(updated);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('results');
    } else {
      setPhase('day');
    }
  };

  // --- ЭКРАН 1: НАСТРОЙКА ---
  if (gameState === 'setup') {
    return (
      <div style={ui.container('day')}>
        <button onClick={onBack} style={ui.backBtn}><ArrowLeft/></button>
        <h2 style={ui.title}>МАФИЯ</h2>
        <div style={ui.setupBox}>
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <p style={{fontSize: '0.8rem', opacity: 0.6}}>ИГРОКОВ: {playerCount}</p>
            <input type="range" min="4" max="15" value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))} style={{width: '200px', accentColor: '#ff4444'}} />
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '250px', marginBottom: '30px'}}>
            <label style={ui.checkRow}>
              <span>Добавить Маньяка</span>
              <input type="checkbox" checked={useManiac} onChange={() => setUseManiac(!useManiac)} />
            </label>
            <label style={ui.checkRow}>
              <span>Добавить Путану</span>
              <input type="checkbox" checked={useProstitute} onChange={() => setUseProstitute(!useProstitute)} />
            </label>
          </div>

          <button onClick={startDealing} style={ui.mainBtn}>РАСПРЕДЕЛИТЬ РОЛИ</button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 2: РАЗДАЧА (без изменений, как в прошлом шаге) ---
  if (gameState === 'dealing') {
     return (
      <div style={ui.container('night')}>
        <h2 style={{color: '#fff', fontSize: '1rem', letterSpacing: '2px'}}>ПЕРЕДАЙ ТЕЛЕФОН</h2>
        <div style={ui.roleCard}>
          <p style={{color: '#ff4444', fontWeight: '900'}}>{players[currentPlayerIdx].name.toUpperCase()}</p>
          {!showRole ? (
            <button onClick={() => setShowRole(true)} style={ui.mainBtn}>СМОТРЕТЬ РОЛЬ</button>
          ) : (
            <div>
              <h1 style={{color: players[currentPlayerIdx].role.side === 'evil' ? '#ff4444' : '#44ff44', fontSize: '2rem'}}>
                {players[currentPlayerIdx].role.name}
              </h1>
              <p style={{fontSize: '0.8rem', opacity: 0.8}}>{players[currentPlayerIdx].role.desc}</p>
              <button onClick={() => { setShowRole(false); currentPlayerIdx < playerCount - 1 ? setCurrentPlayerIdx(c => c + 1) : setGameState('action'); }} style={{...ui.mainBtn, marginTop: '20px'}}>ГОТОВО</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- ЭКРАН 3: РЕЗУЛЬТАТЫ ---
  if (gameState === 'results') {
    return (
      <div style={ui.container('day')}>
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <Ghost size={80} color="#ff4444" />
          <h1 style={{fontSize: '2.5rem', fontWeight: '900', margin: '20px 0'}}>ПОБЕДА:</h1>
          <h2 style={{background: '#000', color: '#fff', padding: '10px 20px', display: 'inline-block'}}>{winner.toUpperCase()}</h2>
          <button onClick={() => setGameState('setup')} style={{...ui.mainBtn, display: 'block', margin: '40px auto'}}>ИГРАТЬ ЕЩЕ РАЗ</button>
          <button onClick={onBack} style={{background: 'none', border: 'none', textDecoration: 'underline'}}>В меню</button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 4: ПУЛЬТ ВЕДУЩЕГО ---
  return (
    <div style={ui.container(phase)}>
      <div style={ui.header}>
        <button onClick={() => {setTimerActive(!timerActive); if(timeLeft === 0) setTimeLeft(60)}} style={ui.iconBtn}>
          <Timer color={timerActive ? '#ff4444' : 'inherit'}/> {timeLeft}с
        </button>
        <span style={{fontWeight: '900'}}>{phase === 'night' ? 'НОЧЬ' : 'ДЕНЬ'}</span>
        <button onClick={() => setPhase(phase === 'night' ? 'day' : 'night')} style={ui.iconBtn}><RefreshCw/></button>
      </div>

      <div style={ui.playerGrid}>
        {players.map(p => (
          <div key={p.id} style={ui.playerRow(p.alive)}>
            <div style={{textAlign: 'left'}}>
              <div style={{fontWeight: '900'}}>{p.name}</div>
              <div style={{fontSize: '0.6rem', opacity: 0.5}}>{p.role.name}</div>
            </div>
            <div style={{display: 'flex', gap: '5px'}}>
              {p.alive && (
                <>
                  <button onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'killed' ? null : 'killed'} : pl))} style={ui.actionBtn(p.statusEffect === 'killed', '#ff4444')}><Skull size={14}/></button>
                  <button onClick={() => setPlayers(players.map(pl => pl.id === p.id ? {...pl, statusEffect: pl.statusEffect === 'healed' ? null : 'healed'} : pl))} style={ui.actionBtn(p.statusEffect === 'healed', '#44ff44')}><Heart size={14}/></button>
                </>
              )}
              {!p.alive && <Skull size={16} opacity={0.2}/>}
            </div>
          </div>
        ))}
      </div>

      {phase === 'night' && <button onClick={confirmDeaths} style={ui.confirmBtn}>ПОДВЕСТИ ИТОГИ НОЧИ</button>}
      {phase === 'day' && <button onClick={() => {
        const gameWinner = checkVictory(players);
        if (gameWinner) { setWinner(gameWinner); setGameState('results'); }
      }} style={ui.confirmBtn}>ПРОВЕРИТЬ ПОБЕДУ</button>}
    </div>
  );
}

const ui = {
  container: (p) => ({
    position: 'fixed', inset: 0, padding: '20px', background: p === 'night' ? '#000' : '#f4f4f4', color: p === 'night' ? '#fff' : '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'monospace', overflowY: 'auto', zIndex: 1000
  }),
  header: { display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px', alignItems: 'center' },
  setupBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' },
  checkRow: { display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  mainBtn: { padding: '12px 25px', background: '#ff4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  playerGrid: { width: '100%', display: 'flex', flexDirection: 'column', gap: '5px' },
  playerRow: (alive) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc', opacity: alive ? 1 : 0.4 }),
  actionBtn: (active, color) => ({ background: active ? color : 'none', color: active ? '#fff' : 'inherit', border: '1px solid #ccc', padding: '5px', borderRadius: '3px' }),
  confirmBtn: { marginTop: 'auto', width: '100%', padding: '15px', background: '#000', color: '#fff', fontWeight: 'bold', border: '1px solid #fff' },
  title: { letterSpacing: '5px', fontWeight: '900' },
  backBtn: { position: 'absolute', left: '20px', top: '20px', background: 'none', border: 'none', color: 'inherit' },
  roleCard: { background: '#111', padding: '30px', borderRadius: '10px', width: '100%', textAlign: 'center' },
  iconBtn: { background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }
};

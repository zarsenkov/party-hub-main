import React, { useState, useEffect } from 'react';
// // Используем иконки для интерфейса ведущего
import { Moon, Sun, ArrowLeft, Users, Skull, Heart, Timer, CheckCircle, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import { mafiaRoles } from './mafiaData';

// // Список случайных кличек для игроков
const NICKNAMES = [
  "Крот", "Шустрый", "Барон", "Доцент", "Бритва", 
  "Молчун", "Артист", "Счастливчик", "Шериф", "Лис", 
  "Призрак", "Кабан", "Акула", "Маэстро", "Стукач"
];

export default function MafiaGame({ onBack }) {
  const [gameState, setGameState] = useState('setup'); // setup, dealing, action
  const [phase, setPhase] = useState('night'); // night, day
  const [playerCount, setPlayerCount] = useState(6);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  // // Таймер обратного отсчета для обсуждений
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // // Функция генерации состава игры с рандомными именами
  const startDealing = () => {
    let rolesPool = [];
    const mafiaCount = Math.floor(playerCount / 3);
    
    // Формируем колоду ролей
    for (let i = 0; i < mafiaCount; i++) rolesPool.push(mafiaRoles.find(r => r.id === 'mafia'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'doctor'));
    rolesPool.push(mafiaRoles.find(r => r.id === 'detective'));
    while (rolesPool.length < playerCount) rolesPool.push(mafiaRoles.find(r => r.id === 'civilian'));
    
    // Перемешиваем роли и имена
    rolesPool = rolesPool.sort(() => Math.random() - 0.5);
    const shuffledNames = [...NICKNAMES].sort(() => Math.random() - 0.5);
    
    const newPlayers = rolesPool.map((role, i) => ({
      id: i + 1,
      name: shuffledNames[i] || `Подозреваемый ${i + 1}`,
      role: role,
      alive: true,
      statusEffect: null 
    }));
    
    setPlayers(newPlayers);
    setGameState('dealing');
  };

  const nextPlayer = () => {
    setShowRole(false);
    if (currentPlayerIdx < playerCount - 1) {
      setCurrentPlayerIdx(prev => prev + 1);
    } else {
      setGameState('action');
    }
  };

  // // Логика отметки "убит/вылечен" в пульте ведущего
  const markAction = (id, effect) => {
    setPlayers(players.map(p => {
      if (p.id === id) {
        return { ...p, statusEffect: p.statusEffect === effect ? null : effect };
      }
      return p;
    }));
  };

  // // Применение итогов ночи (спасение или смерть)
  const confirmDeaths = () => {
    setPlayers(players.map(p => {
      if (p.statusEffect === 'killed') return { ...p, alive: false, statusEffect: null };
      if (p.statusEffect === 'healed') return { ...p, statusEffect: null };
      return p;
    }));
    setPhase('day');
  };

  // --- ЭКРАН 1: НАСТРОЙКА ---
  if (gameState === 'setup') {
    return (
      <div style={ui.container('day')}>
        <button onClick={onBack} style={ui.backBtn}><ArrowLeft/></button>
        <h2 style={ui.title}>КТО В ИГРЕ?</h2>
        <div style={ui.setupBox}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', margin: '40px 0'}}>
            <button onClick={() => setPlayerCount(Math.max(4, playerCount - 1))} style={ui.roundBtn}><UserMinus/></button>
            <div style={{textAlign: 'center'}}>
              <span style={{fontSize: '3rem', fontWeight: '900'}}>{playerCount}</span>
              <p style={{margin: 0, fontSize: '0.7rem'}}>ГОЛОВ</p>
            </div>
            <button onClick={() => setPlayerCount(Math.min(15, playerCount + 1))} style={ui.roundBtn}><UserPlus/></button>
          </div>
          <button onClick={startDealing} style={ui.mainBtn}>РАСПРЕДЕЛИТЬ РОЛИ</button>
        </div>
      </div>
    );
  }

  // --- ЭКРАН 2: РАЗДАЧА ---
  if (gameState === 'dealing') {
    return (
      <div style={ui.container('night')}>
        <h2 style={{color: '#fff', fontSize: '1rem', letterSpacing: '2px'}}>ПЕРЕДАЙ ТЕЛЕФОН</h2>
        <div style={ui.roleCard}>
          <p style={{color: '#ff4444', fontWeight: '900', marginBottom: '5px'}}>ЭЙ, {players[currentPlayerIdx].name.toUpperCase()}!</p>
          <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '20px'}}>нажми кнопку, чтобы увидеть роль</p>
          {!showRole ? (
            <button onClick={() => setShowRole(true)} style={ui.mainBtn}>КТО Я?</button>
          ) : (
            <div style={{animation: 'fadeIn 0.5s'}}>
              <h1 style={{color: players[currentPlayerIdx].role.side === 'evil' ? '#ff4444' : '#44ff44', fontSize: '2.2rem', margin: '10px 0'}}>
                {players[currentPlayerIdx].role.name}
              </h1>
              <p style={{fontSize: '0.9rem', lineHeight: '1.4'}}>{players[currentPlayerIdx].role.desc}</p>
              <button onClick={nextPlayer} style={{...ui.mainBtn, marginTop: '20px', background: '#fff', color: '#000'}}>ЗАПОМНИЛ</button>
            </div>
          )}
        </div>
        <div style={{marginTop: '20px', opacity: 0.3}}><UserCheck size={40}/></div>
      </div>
    );
  }

  // --- ЭКРАН 3: ПУЛЬТ ВЕДУЩЕГО ---
  return (
    <div style={ui.container(phase)}>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
        <button onClick={() => {setTimerActive(!timerActive); if(timeLeft === 0) setTimeLeft(60)}} style={ui.iconBtn}>
          <Timer size={18} color={timerActive ? '#ff4444' : 'inherit'}/> {timeLeft}с
        </button>
        <div style={{textAlign: 'center'}}>
          <span style={{fontSize: '0.6rem', display: 'block', opacity: 0.5}}>ФАЗА:</span>
          <span style={{fontWeight: '900'}}>{phase === 'night' ? 'НОЧЬ' : 'ДЕНЬ'}</span>
        </div>
        <button onClick={() => setPhase(phase === 'night' ? 'day' : 'night')} style={ui.iconBtn}>
          {phase === 'night' ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
      </div>

      <div style={ui.playerGrid}>
        {players.map(p => (
          <div key={p.id} style={ui.playerRow(p.alive)}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{fontWeight: '900', fontSize: '1rem'}}>{p.name}</span>
              <span style={{fontSize: '0.6rem', opacity: 0.5}}>{p.role.name.toUpperCase()}</span>
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
              {p.alive && (
                <>
                  <button onClick={() => markAction(p.id, 'killed')} style={ui.actionBtn(p.statusEffect === 'killed', '#ff4444')}><Skull size={16}/></button>
                  <button onClick={() => markAction(p.id, 'healed')} style={ui.actionBtn(p.statusEffect === 'healed', '#44ff44')}><Heart size={16}/></button>
                </>
              )}
              {!p.alive && <div style={{color: '#ff4444', fontSize: '0.7rem', fontWeight: '900'}}>ВЫБЫЛ</div>}
            </div>
          </div>
        ))}
      </div>

      {phase === 'night' && (
        <button onClick={confirmDeaths} style={ui.confirmBtn}>ПОДВЕСТИ ИТОГИ НОЧИ</button>
      )}
    </div>
  );
}

const ui = {
  container: (p) => ({
    position: 'fixed', inset: 0, padding: '20px', zIndex: 1000,
    background: p === 'night' ? '#070707' : '#f4f4f4', color: p === 'night' ? '#fff' : '#000',
    display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'monospace', overflowY: 'auto'
  }),
  setupBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  roundBtn: { width: '60px', height: '60px', borderRadius: '30px', border: '2px solid', background: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mainBtn: { padding: '15px 40px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '900', letterSpacing: '1px' },
  roleCard: { textAlign: 'center', marginTop: '20px', padding: '30px 20px', border: '1px solid #222', background: '#111', width: '100%', borderRadius: '2px' },
  playerGrid: { width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' },
  playerRow: (alive) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px',
    borderBottom: '1px solid rgba(128,128,128,0.2)', opacity: alive ? 1 : 0.4
  }),
  actionBtn: (active, color) => ({
    background: active ? color : 'none', color: active ? '#fff' : 'inherit',
    border: `1px solid ${active ? color : '#555'}`, padding: '8px', borderRadius: '2px'
  }),
  confirmBtn: { marginTop: 'auto', width: '100%', padding: '18px', background: '#ff4444', color: '#fff', border: 'none', fontWeight: '900', letterSpacing: '2px' },
  iconBtn: { background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' },
  title: { fontWeight: '900', letterSpacing: '4px', marginTop: '40px' },
  backBtn: { position: 'absolute', left: '20px', top: '20px', background: 'none', border: 'none', color: 'inherit' }
};

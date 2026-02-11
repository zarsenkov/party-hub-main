import React, { useState, useEffect } from 'react';
// Иконки для атмосферы спецслужб
import { ShieldAlert, EyeOff, User, Search, ArrowLeft, Clock, Fingerprint } from 'lucide-react';

const LOCATIONS = ["Орбитальная станция", "Пиратский корабль", "Подводная лодка", "Казино", "Посольство", "База на Марсе", "Цирк", "Отель Гранд"];

const SpyGame = ({ onBack }) => {
  const [stage, setStage] = useState('setup'); // setup, distribution, play
  const [players, setPlayers] = useState(4);
  const [gameData, setGameData] = useState({ location: '', spyIndex: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // Логика таймера для обсуждения
  useEffect(() => {
    let timer = null;
    if (stage === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [stage, timeLeft]);

  // Старт операции
  // // Рандом локации и выбор "крота"
  const startOperation = () => {
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const spy = Math.floor(Math.random() * players);
    setGameData({ location: loc, spyIndex: spy });
    setCurrentPlayer(0);
    setIsRevealed(false);
    setStage('distribution');
  };

  const nextAgent = () => {
    setIsRevealed(false);
    if (currentPlayer + 1 < players) {
      setCurrentPlayer(prev => prev + 1);
    } else {
      setStage('play');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // --- СТИЛИ (Noir / Top Secret) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#0a0a0a', color: '#d1d1d1', fontFamily: '"Courier New", Courier, monospace'
    },
    header: { borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' },
    folder: {
      flex: 1, border: '1px solid #333', background: '#111', borderRadius: '4px',
      padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column',
      boxShadow: 'inset 0 0 50px #000'
    },
    stamp: {
      position: 'absolute', top: '20px', right: '20px', border: '4px solid #8b0000',
      color: '#8b0000', padding: '5px 15px', fontWeight: 'bold', fontSize: '1.5rem',
      transform: 'rotate(15deg)', textTransform: 'uppercase', opacity: 0.8
    },
    setupBox: { margin: '40px 0', textAlign: 'center' },
    slider: { width: '100%', margin: '20px 0', accentColor: '#8b0000' },
    cardArea: {
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', border: '1px dashed #444', margin: '20px 0', cursor: 'pointer'
    },
    btnSpy: {
      background: '#8b0000', color: '#fff', border: 'none', padding: '18px',
      fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer',
      boxShadow: '0 0 15px rgba(139, 0, 0, 0.3)'
    },
    timerBig: { fontSize: '5rem', textAlign: 'center', color: '#8b0000', margin: '40px 0', textShadow: '0 0 20px rgba(139, 0, 0, 0.5)' }
  };

  // 1. НАСТРОЙКА
  if (stage === 'setup') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          <button onClick={onBack} style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}><ArrowLeft size={18}/></button>
        </div>
        <div style={styles.folder}>
          <div style={styles.stamp}>CONFIDENTIAL</div>
          <Fingerprint size={60} color="#333" />
          <h1 style={{fontSize: '2rem', margin: '20px 0'}}>PROJECT: SPY</h1>
          <div style={styles.setupBox}>
            <p style={{fontSize: '1.2rem'}}>КОЛИЧЕСТВО АГЕНТОВ:</p>
            <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#fff'}}>{players}</div>
            <input type="range" min="3" max="12" value={players} onChange={(e) => setPlayers(Number(e.target.value))} style={styles.slider} />
          </div>
          <button style={{...styles.btnSpy, marginTop: 'auto'}} onClick={startOperation}>НАЧАТЬ ИНСТРУКТАЖ</button>
        </div>
      </div>
    );
  }

  // 2. РАСПРЕДЕЛЕНИЕ РОЛЕЙ
  if (stage === 'distribution') {
    const isSpy = currentPlayer === gameData.spyIndex;
    return (
      <div style={styles.container}>
        <div style={styles.header}><span>AGENT {currentPlayer + 1} OF {players}</span></div>
        <div style={styles.folder}>
          <div style={styles.cardArea} onClick={() => setIsRevealed(!isRevealed)}>
            {!isRevealed ? (
              <>
                <EyeOff size={64} color="#444" />
                <p style={{marginTop: '20px', color: '#666'}}>НАЖМИТЕ ДЛЯ СКАНИРОВАНИЯ</p>
              </>
            ) : (
              <div style={{textAlign: 'center'}}>
                {isSpy ? <Search size={80} color="#8b0000" /> : <User size={80} color="#fff" />}
                <h2 style={{fontSize: '2rem', margin: '20px 0'}}>{isSpy ? 'ВЫ ШПИОН' : 'ЛОКАЦИЯ'}</h2>
                {!isSpy && <h3 style={{background: '#fff', color: '#000', padding: '10px 20px'}}>{gameData.location}</h3>}
                <p style={{marginTop: '20px', color: '#8b0000'}}>ЗАПОМНИТЕ И СКРОЙТЕ</p>
              </div>
            )}
          </div>
          {isRevealed && (
            <button style={styles.btnSpy} onClick={nextAgent}>
              {currentPlayer + 1 < players ? 'СЛЕДУЮЩИЙ АГЕНТ' : 'ЗАВЕРШИТЬ ИНСТРУКТАЖ'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. ИГРА (ТАЙМЕР)
  return (
    <div style={styles.container}>
      <div style={styles.header}><span>STATUS: ACTIVE</span> <Clock size={18}/></div>
      <div style={styles.folder}>
        <h2 style={{textAlign: 'center', color: '#666'}}>ВРЕМЯ ДО ВЫЧИСЛЕНИЯ:</h2>
        <div style={styles.timerBig}>{formatTime(timeLeft)}</div>
        <p style={{textAlign: 'center', lineHeight: '1.6', fontSize: '0.9rem'}}>
          ШПИОН ДОЛЖЕН УЗНАТЬ ЛОКАЦИЮ, ЗАДАВАЯ ВОПРОСЫ.<br/>
          АГЕНТЫ ДОЛЖНЫ ВЫЯВИТЬ ШПИОНА.
        </p>
        <button style={{...styles.btnSpy, background: '#333', marginTop: 'auto'}} onClick={() => setStage('setup')}>ПРЕРВАТЬ ОПЕРАЦИЮ</button>
      </div>
    </div>
  );
};

export default SpyGame;

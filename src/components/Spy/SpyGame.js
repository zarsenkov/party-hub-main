import React, { useState, useEffect } from 'react';
// Анимации
import { motion, AnimatePresence } from 'framer-motion';
// Исправленные импорты иконок (убран UserSecret, заменен на Spy)
import { EyeOff, ShieldAlert, ArrowLeft, User, Search } from 'lucide-react';
import './SpyGame.css';

// Список локаций
const LOCATIONS = [
  "Орбитальная станция", "Пиратский корабль", "Подводная лодка", 
  "Киностудия", "Психиатрическая больница", "Отель Гранд Будапешт", 
  "Средневековый замок", "База на Марсе", "Цирк-шапито", "Казино"
];

const SpyGame = ({ onBack }) => {
  // Состояния экрана
  const [screen, setScreen] = useState('setup');
  const [players, setPlayers] = useState(4);
  const [gameData, setGameData] = useState({ location: '', spyIndex: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // Таймер обратного отсчета
  // // Работает только на экране обсуждения
  useEffect(() => {
    let t;
    if (screen === 'play' && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [screen, timeLeft]);

  // Старт игры
  // // Выбирает рандомную локацию и индекс шпиона
  const startGame = () => {
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const randomSpy = Math.floor(Math.random() * players);
    setGameData({ location: randomLoc, spyIndex: randomSpy });
    setCurrentPlayer(0);
    setIsCardOpen(false);
    setTimeLeft(300);
    setScreen('distribution');
  };

  // Переход к следующему игроку
  // // Либо инкремент, либо переход к таймеру
  const nextPlayer = () => {
    setIsCardOpen(false);
    if (currentPlayer + 1 < players) {
      setCurrentPlayer(prev => prev + 1);
    } else {
      setScreen('play');
    }
  };

  // Форматирование времени (ММ:СС)
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // --- ЭКРАНЫ ---

  // 1. Настройка (Setup)
  if (screen === 'setup') {
    return (
      <div className="spy-container dossier-theme center">
        <button className="back-fixed" onClick={onBack}><ArrowLeft size={18}/> МЕНЮ</button>
        <div className="spy-folder">
          <ShieldAlert size={48} className="spy-icon-red" />
          <h1 className="spy-title">TOP SECRET</h1>
          <div className="spy-setup-card">
            <p>АГЕНТОВ В ГРУППЕ: {players}</p>
            <input 
              type="range" 
              min="3" 
              max="12" 
              value={players} 
              onChange={(e) => setPlayers(parseInt(e.target.value, 10))} 
            />
          </div>
          <button className="spy-btn-start" onClick={startGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
        </div>
      </div>
    );
  }

  // 2. Распределение (Distribution)
  if (screen === 'distribution') {
    const isSpy = currentPlayer === gameData.spyIndex;
    return (
      <div className="spy-container dossier-theme center">
        <div className="spy-badge">ИГРОК {currentPlayer + 1}</div>
        <div className="spy-card-box" onClick={() => setIsCardOpen(!isCardOpen)}>
          <AnimatePresence mode="wait">
            {!isCardOpen ? (
              <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-inner closed">
                <EyeOff size={64} />
                <p>НАЖМИ, ЧТОБЫ УЗНАТЬ РОЛЬ</p>
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="card-inner open">
                <div className="stamp">{isSpy ? 'SPY' : 'AGENT'}</div>
                <div className="role-icon-box">
                  {isSpy ? <Search size={48} color="#8b0000" /> : <User size={48} />}
                </div>
                <h3>{isSpy ? 'ВЫ ШПИОН' : 'ЛОКАЦИЯ:'}</h3>
                {!isSpy && <h2>{gameData.location}</h2>}
                <p className="card-hint">Запомни и нажми еще раз</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isCardOpen && (
          <button className="spy-btn-confirm" onClick={nextPlayer}>ПОНЯЛ, СЛЕДУЮЩИЙ</button>
        )}
      </div>
    );
  }

  // 3. Игра (Discussion)
  return (
    <div className="spy-container dossier-theme center">
      <div className="scan-line"></div>
      <h2 className="spy-status">ИДЕТ ОБСУЖДЕНИЕ...</h2>
      <div className={`spy-timer-big ${timeLeft < 30 ? 'critical' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      <p className="spy-instruction">Шпион должен вычислить локацию, <br/> агенты — шпиона.</p>
      <button className="spy-btn-end" onClick={() => setScreen('setup')}>ЗАКОНЧИТЬ</button>
    </div>
  );
};

export default SpyGame;

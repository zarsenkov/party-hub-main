import React, { useState, useEffect } from 'react';
// Анимация раскрытия карты
import { motion, AnimatePresence } from 'framer-motion';
// Иконки: глаз, замок, время, назад
import { Eye, EyeOff, ShieldAlert, Timer, ArrowLeft, Play, UserSecret } from 'lucide-react';
import './SpyGame.css';

// Список локаций (можно расширять до бесконечности)
const LOCATIONS = [
  "Орбитальная станция", "Пиратский корабль", "Подводная лодка", 
  "Киностудия", "Психиатрическая больница", "Отель "Гранд Будапешт"", 
  "Средневековый замок", "База на Марсе", "Цирк-шапито", "Казино"
];

const SpyGame = ({ onBack }) => {
  // screen: setup -> distribution -> play -> result
  const [screen, setScreen] = useState('setup');
  const [players, setPlayers] = useState(4);
  const [gameData, setGameData] = useState({ location: '', spyIndex: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут на обсуждение

  // --- ЛОГИКА ---

  // Таймер обратного отсчета
  useEffect(() => {
    let t;
    if (screen === 'play' && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [screen, timeLeft]);

  // Старт игры: выбираем локацию и шпиона
  const startGame = () => {
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const randomSpy = Math.floor(Math.random() * players);
    setGameData({ location: randomLoc, spyIndex: randomSpy });
    setCurrentPlayer(0);
    setIsCardOpen(false);
    setScreen('distribution');
  };

  // Переход к следующему игроку
  const nextPlayer = () => {
    setIsCardOpen(false);
    if (currentPlayer + 1 < players) {
      setCurrentPlayer(prev => prev + 1);
    } else {
      setScreen('play');
    }
  };

  // Форматирование времени
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // --- ЭКРАНЫ ---

  // 1. Настройка
  if (screen === 'setup') {
    return (
      <div className="spy-container dossier-theme center">
        <button className="back-fixed" onClick={onBack}><ArrowLeft /> МЕНЮ</button>
        <div className="spy-folder">
          <ShieldAlert size={48} className="spy-icon-red" />
          <h1 className="spy-title">TOP SECRET</h1>
          <div className="spy-setup-card">
            <p>АГЕНТОВ В ГРУППЕ: {players}</p>
            <input type="range" min="3" max="12" value={players} onChange={(e) => setPlayers(Number(e.target.value))} />
          </div>
          <button className="spy-btn-start" onClick={startGame}>НАЧАТЬ ОПЕРАЦИЮ</button>
        </div>
      </div>
    );
  }

  // 2. Распределение ролей
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
                <h3>{isSpy ? 'ВЫ ШПИОН' : 'ЛОКАЦИЯ:'}</h3>
                {!isSpy && <h2>{gameData.location}</h2>}
                <p className="card-hint">Запомни и нажми еще раз</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isCardOpen && (
          <button className="spy-btn-confirm" onClick={nextPlayer}>ПОНЯЛ, ПЕРЕДАЮ ТЕЛЕФОН</button>
        )}
      </div>
    );
  }

  // 3. Игра (Таймер)
  return (
    <div className="spy-container dossier-theme center">
      <div className="scan-line"></div>
      <h2 className="spy-status">ИДЕТ ОБСУЖДЕНИЕ...</h2>
      <div className={`spy-timer-big ${timeLeft < 30 ? 'critical' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      <p className="spy-instruction">Задавайте вопросы друг другу. <br/> Шпион должен вычислить локацию.</p>
      <button className="spy-btn-end" onClick={() => setScreen('setup')}>ЗАКОНЧИТЬ</button>
    </div>
  );
};

export default SpyGame;

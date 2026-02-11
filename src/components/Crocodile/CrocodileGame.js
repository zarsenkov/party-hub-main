import React, { useState, useEffect } from 'react';
// Подключаем анимации для свайпов и переходов
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// Иконки для джунгли-стиля
import { Timer, Trophy, Users, ChevronRight, ArrowLeft, Leaf } from 'lucide-react';
import './CrocodileGame.css';

// Тематическая база слов
const WORDS = {
  easy: ['Банан', 'Пальма', 'Обезьяна', 'Солнце', 'Лиана', 'Слон', 'Змея'],
  medium: ['Исследователь', 'Фотоаппарат', 'Мачете', 'Водопад', 'Тропики'],
  hard: ['Инкубационный период', 'Эндемик', 'Мимикрия', 'Биоразнообразие']
};

const CrocodileGame = ({ onBack }) => {
  // Состояния игры: выбор параметров, ожидание команды, процесс, результаты
  const [gameState, setGameState] = useState('setup'); 
  const [difficulty, setDifficulty] = useState('easy');
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда Лиан', score: 0 },
    { id: 2, name: 'Команда Ягуаров', score: 0 }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  // Настройка логики свайпа (движение по X, вращение и прозрачность)
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  // Функция получения случайного слова
  // // Берет список слов согласно выбранной сложности
  const getNewWord = () => {
    const list = WORDS[difficulty];
    setCurrentWord(list[Math.floor(Math.random() * list.length)]);
  };

  // Таймер игры
  // // Срабатывает каждую секунду, если состояние "playing"
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('results');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Обработка свайпа
  // // Вправо (> 100) — успех, Влево (< -100) — пропуск
  const handleDragEnd = (e, info) => {
    if (info.offset.x > 100) {
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 1;
      setTeams(newTeams);
      getNewWord();
    } else if (info.offset.x < -100) {
      getNewWord();
    }
  };

  // Запуск раунда для текущей команды
  const startRound = () => {
    getNewWord();
    setTimeLeft(60);
    setGameState('playing');
  };

  // Переход к следующей команде
  const nextTurn = () => {
    setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
    setGameState('round_start');
  };

  // 1. ЭКРАН НАСТРОЕК (SETUP)
  if (gameState === 'setup') {
    return (
      <div className="jungle-screen setup">
        <button className="jungle-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="jungle-title">CROCODILE</h1>
        <div className="jungle-card setup-box">
          <Leaf className="leaf-icon" color="#ffe600" />
          <p className="label">СЛОЖНОСТЬ</p>
          <div className="jungle-diff-grid">
            {['easy', 'medium', 'hard'].map(d => (
              <button 
                key={d} 
                className={`jungle-opt ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d === 'easy' ? 'Легко' : d === 'medium' ? 'Средне' : 'Хард'}
              </button>
            ))}
          </div>
        </div>
        <button className="jungle-btn-main" onClick={() => setGameState('round_start')}>ГОТОВЫ</button>
      </div>
    );
  }

  // 2. ЭКРАН ОЖИДАНИЯ (ROUND START)
  if (gameState === 'round_start') {
    return (
      <div className="jungle-screen center">
        <Users size={60} color="#ffe600" />
        <h2 className="jungle-sub">Приготовьтесь!</h2>
        <h1 className="jungle-team-title">{teams[currentTeamIndex].name}</h1>
        <button className="jungle-btn-main" onClick={startRound}>НАЧАТЬ РАУНД</button>
      </div>
    );
  }

  // 3. ИГРОВОЙ ЭКРАН (PLAYING + SWIPE)
  if (gameState === 'playing') {
    return (
      <div className="jungle-screen play">
        <div className="jungle-header">
          <div className="jungle-timer"><Timer size={20} /> {timeLeft}с</div>
          <div className="jungle-score">Счёт: {teams[currentTeamIndex].score}</div>
        </div>
        <div className="jungle-card-zone">
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="jungle-swipe-card"
          >
            <span className="swipe-info">← Пропуск | Угадал →</span>
            <h2 className="jungle-word">{currentWord}</h2>
          </motion.div>
        </div>
      </div>
    );
  }

  // 4. ЭКРАН РЕЗУЛЬТАТОВ (RESULTS)
  return (
    <div className="jungle-screen results">
      <Trophy size={60} color="#ffe600" />
      <h1 className="jungle-res-title">Конец раунда!</h1>
      <div className="jungle-results-list">
        {teams.map(t => (
          <div key={t.id} className="jungle-res-item">
            <span>{t.name}</span>
            <span className="res-val">{t.score}</span>
          </div>
        ))}
      </div>
      <button className="jungle-btn-main" onClick={nextTurn}>
        СЛЕДУЮЩИЙ ХОД <ChevronRight />
      </button>
    </div>
  );
};

export default CrocodileGame;

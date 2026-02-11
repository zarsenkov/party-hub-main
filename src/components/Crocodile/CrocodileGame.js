import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Timer, Trophy, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import './CrocodileGame.css';

const WORDS = {
  easy: ['Банан', 'Пальма', 'Обезьяна', 'Солнце', 'Лиана', 'Слон', 'Змея', 'Попугай'],
  medium: ['Исследователь', 'Фотоаппарат', 'Мачете', 'Водопад', 'Тропики', 'Джунгли'],
  hard: ['Инкубационный период', 'Эндемик', 'Мимикрия', 'Биоразнообразие', 'Пангея']
};

const CrocodileGame = ({ onBack }) => {
  const [gameState, setGameState] = useState('setup'); 
  const [difficulty, setDifficulty] = useState('easy');
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда Лиан', score: 0 },
    { id: 2, name: 'Команда Ягуаров', score: 0 }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  // Логика движения
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Функция выбора слова
  // // Выбирает случайный индекс из массива слов
  const getNewWord = () => {
    const list = WORDS[difficulty];
    const newWord = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(newWord);
  };

  // Таймер
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('results');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // ОБРАБОТКА СВАЙПА (ИСПРАВЛЕНО)
  // // Проверяем смещение по оси X после завершения перетаскивания
  const handleDragEnd = (e, info) => {
    // Если свайпнули вправо больше чем на 100 пикселей
    if (info.offset.x > 100) {
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 1;
      setTeams(newTeams);
      getNewWord();
    } 
    // Если свайпнули влево больше чем на 100 пикселей
    else if (info.offset.x < -100) {
      getNewWord();
    }
    // Сбрасываем положение MotionValue в ноль
    x.set(0);
  };

  if (gameState === 'setup') {
    return (
      <div className="jungle-screen setup">
        <button className="jungle-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="jungle-title">CROCODILE</h1>
        <div className="jungle-card setup-box">
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

  if (gameState === 'round_start') {
    return (
      <div className="jungle-screen center">
        <Users size={60} color="#ffe600" />
        <h2 className="jungle-sub">Очередь:</h2>
        <h1 className="jungle-team-title">{teams[currentTeamIndex].name}</h1>
        <button className="jungle-btn-main" onClick={startRound = () => { getNewWord(); setTimeLeft(60); setGameState('playing'); }}>ПОГНАЛИ!</button>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="jungle-screen play">
        <div className="jungle-header">
          <div className="jungle-timer"><Timer size={20} /> {timeLeft}с</div>
          <div className="jungle-score">Счёт: {teams[currentTeamIndex].score}</div>
        </div>
        <div className="jungle-card-zone">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentWord}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.05 }}
              className="jungle-swipe-card"
            >
              <span className="swipe-info">← Пропуск | Угадал →</span>
              <h2 className="jungle-word">{currentWord}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="jungle-screen results">
      <Trophy size={60} color="#ffe600" />
      <h1 className="jungle-res-title">Результаты</h1>
      <div className="jungle-results-list">
        {teams.map(t => (
          <div key={t.id} className="jungle-res-item">
            <span>{t.name}</span>
            <span className="res-val">{t.score}</span>
          </div>
        ))}
      </div>
      <button className="jungle-btn-main" onClick={nextTurn}>СЛЕД. КОМАНДА <ChevronRight /></button>
    </div>
  );
};

export default CrocodileGame;

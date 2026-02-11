import React, { useState, useEffect } from 'react';
// Подключаем анимации для свайпов
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// Иконки: таймер, трофей, игроки, настройки, книга правил
import { Timer, Trophy, Users, ChevronRight, ArrowLeft, Settings, BookOpen, Play } from 'lucide-react';
import './CrocodileGame.css';

// Расширенная база слов
const WORDS = {
  easy: ['Банан', 'Пальма', 'Обезьяна', 'Солнце', 'Лиана', 'Слон', 'Змея', 'Попугай', 'Кокос', 'Ананас'],
  medium: ['Исследователь', 'Фотоаппарат', 'Мачете', 'Водопад', 'Тропики', 'Джунгли', 'Тукан', 'Леопард'],
  hard: ['Инкубационный период', 'Эндемик', 'Мимикрия', 'Биоразнообразие', 'Пангея', 'Экспедиция']
};

const CrocodileGame = ({ onBack }) => {
  // Состояния экранов: setup -> rules -> round_start -> playing -> results -> final
  const [gameState, setGameState] = useState('setup'); 
  const [difficulty, setDifficulty] = useState('easy');
  const [settings, setSettings] = useState({ time: 60, rounds: 3 });
  const [currentRound, setCurrentRound] = useState(1);
  
  const [teams, setTeams] = useState([
    { id: 1, name: 'Команда Лиан', score: 0 },
    { id: 2, name: 'Команда Ягуаров', score: 0 }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  // Параметры для свайпа
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Функция выбора нового слова
  // // Выбирает случайное слово из WORDS на основе текущей сложности
  const getNewWord = () => {
    const list = WORDS[difficulty];
    setCurrentWord(list[Math.floor(Math.random() * list.length)]);
  };

  // Логика таймера
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('results');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Обработка жеста свайпа
  // // Вправо - балл, Влево - пропуск
  const handleDragEnd = (e, info) => {
    if (info.offset.x > 100) {
      const newTeams = [...teams];
      newTeams[currentTeamIndex].score += 1;
      setTeams(newTeams);
      getNewWord();
    } else if (info.offset.x < -100) {
      getNewWord();
    }
    x.set(0); // Возвращаем карточку в центр
  };

  // Запуск самого процесса показа слов
  const startActualPlay = () => {
    getNewWord();
    setTimeLeft(settings.time);
    setGameState('playing');
  };

  // Переход хода или завершение игры
  const nextTurn = () => {
    if (currentTeamIndex === teams.length - 1) {
      if (currentRound >= settings.rounds) {
        setGameState('final');
        return;
      }
      setCurrentRound(prev => prev + 1);
    }
    setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
    setGameState('round_start');
  };

  // --- ЭКРАНЫ ---

  // 1. Настройки
  if (gameState === 'setup') {
    return (
      <div className="jungle-screen">
        <button className="jungle-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="jungle-title">CROCODILE</h1>
        
        <div className="jungle-card setup-box">
          <div className="setup-item">
            <p className="label"><Settings size={16}/> СЛОЖНОСТЬ</p>
            <div className="jungle-diff-grid">
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} className={`jungle-opt ${difficulty === d ? 'active' : ''}`} onClick={() => setDifficulty(d)}>
                  {d === 'easy' ? 'Легко' : d === 'medium' ? 'Средне' : 'Хард'}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-item">
            <p className="label"><Timer size={16}/> ВРЕМЯ РАУНДА: {settings.time}с</p>
            <input type="range" min="30" max="120" step="10" value={settings.time} 
                   onChange={(e) => setSettings({...settings, time: parseInt(e.target.value)})} className="jungle-slider" />
          </div>

          <div className="setup-item">
            <p className="label"><Trophy size={16}/> КОЛ-ВО РАУНДОВ: {settings.rounds}</p>
            <input type="range" min="1" max="10" value={settings.rounds} 
                   onChange={(e) => setSettings({...settings, rounds: parseInt(e.target.value)})} className="jungle-slider" />
          </div>
        </div>
        
        <button className="jungle-btn-main" onClick={() => setGameState('rules')}>ПРАВИЛА</button>
      </div>
    );
  }

  // 2. Правила
  if (gameState === 'rules') {
    return (
      <div className="jungle-screen center">
        <BookOpen size={60} color="#ffe600" />
        <h2 className="jungle-title-small">КАК ИГРАТЬ?</h2>
        <div className="jungle-card rules-text">
          <p>1. Игрок берет телефон и видит слово.</p>
          <p>2. Объясняй его <b>жестами</b>, не издавая звуков.</p>
          <p>3. <b>Свайп ВПРАВО</b> — угадано (+1 балл).</p>
          <p>4. <b>Свайп ВЛЕВО</b> — пропустить слово.</p>
        </div>
        <button className="jungle-btn-main" onClick={() => setGameState('round_start')}>ПОНЯТНО</button>
      </div>
    );
  }

  // 3. Ожидание команды
  if (gameState === 'round_start') {
    return (
      <div className="jungle-screen center">
        <div className="round-badge">РАУНД {currentRound} / {settings.rounds}</div>
        <Users size={60} color="#ffe600" />
        <h2 className="jungle-sub">Очередь команды:</h2>
        <h1 className="jungle-team-title neon-text">{teams[currentTeamIndex].name}</h1>
        <button className="jungle-btn-main highlight" onClick={startActualPlay}><Play size={20}/> НАЧАТЬ</button>
      </div>
    );
  }

  // 4. Игра (Свайпы)
  if (gameState === 'playing') {
    return (
      <div className="jungle-screen play">
        <div className="jungle-header">
          <div className={`jungle-timer ${timeLeft < 10 ? 'danger' : ''}`}>{timeLeft}с</div>
          <div className="jungle-score-mini">Счёт: {teams[currentTeamIndex].score}</div>
        </div>
        <div className="jungle-card-zone">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord}
              style={{ x, rotate, opacity }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.8}
              onDragEnd={handleDragEnd}
              className="jungle-swipe-card"
            >
              <h2 className="jungle-word">{currentWord}</h2>
              <div className="swipe-hints">
                <span className="hint-left">← Пропуск</span>
                <span className="hint-right">Угадал →</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // 5. Итоги раунда или финал
  return (
    <div className="jungle-screen results center">
      <Trophy size={80} color="#ffe600" className="floating" />
      <h1 className="jungle-title">{gameState === 'final' ? 'ФИНАЛ!' : 'ИТОГИ'}</h1>
      <div className="jungle-results-list">
        {teams.map(t => (
          <div key={t.id} className="jungle-res-item">
            <span>{t.name}</span>
            <span className="res-val">{t.score}</span>
          </div>
        ))}
      </div>
      <button className="jungle-btn-main" onClick={gameState === 'final' ? onBack : nextTurn}>
        {gameState === 'final' ? 'В МЕНЮ' : 'СЛЕД. ХОД'} <ChevronRight />
      </button>
    </div>
  );
};

export default CrocodileGame;

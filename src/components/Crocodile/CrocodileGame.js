import React, { useState, useEffect } from 'react';
// Библиотека для плавных жестов и анимаций
import { motion, AnimatePresence } from 'framer-motion';
// Иконки для интерфейса
import { Timer, Trophy, Users, ChevronRight, ArrowLeft, X, Check, Play, Settings } from 'lucide-react';
import './CrocodileGame.css';

// Полноценная база слов, разделенная по уровням
const WORDS_LIBRARY = {
  easy: ['Банан', 'Обезьяна', 'Пальма', 'Змея', 'Лиана', 'Слон', 'Кокос', 'Попугай', 'Солнце', 'Трава'],
  medium: ['Фотоаппарат', 'Мачете', 'Водопад', 'Исследователь', 'Рюкзак', 'Джунгли', 'Леопард', 'Тукан'],
  hard: ['Эндемик', 'Мимикрия', 'Биоразнообразие', 'Инкубация', 'Пангея', 'Экспедиция', 'Артефакт']
};

const CrocodileGame = ({ onBack }) => {
  // --- СОСТОЯНИЯ ИГРЫ ---
  const [screen, setScreen] = useState('setup'); // setup | rules | ready | play | results | final
  const [difficulty, setDifficulty] = useState('easy');
  const [settings, setSettings] = useState({ time: 60, rounds: 3 });
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [score, setScore] = useState([0, 0]); // Счет Команды 1 и Команды 2
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const teamNames = ['Команда Лиан', 'Команда Ягуаров'];

  // --- ЛОГИКА ТАЙМЕРА ---
  // // Срабатывает каждую секунду, если экран "play"
  useEffect(() => {
    let timer;
    if (screen === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && screen === 'play') {
      setScreen('results');
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // --- ФУНКЦИИ УПРАВЛЕНИЯ ---
  
  // Получение случайного слова
  const nextWord = () => {
    const list = WORDS_LIBRARY[difficulty];
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentWord(list[randomIndex]);
  };

  // Старт раунда
  const startRound = () => {
    nextWord();
    setTimeLeft(settings.time);
    setScreen('play');
  };

  // Обработка результата (Угадал / Пропустил)
  const handleAction = (isWin) => {
    if (isWin) {
      const newScore = [...score];
      newScore[currentTeam] += 1;
      setScore(newScore);
    }
    nextWord();
  };

  // Переход к следующему шагу после итогов раунда
  const handleNext = () => {
    if (currentTeam === 1) { // Если сходила вторая команда
      if (currentRound >= settings.rounds) {
        setScreen('final');
      } else {
        setCurrentRound(r => r + 1);
        setCurrentTeam(0);
        setScreen('ready');
      }
    } else {
      setCurrentTeam(1);
      setScreen('ready');
    }
  };

  // --- ЭКРАНЫ (UI) ---

  // 1. Настройки (Setup)
  if (screen === 'setup') {
    return (
      <div className="jungle-ui">
        <button className="j-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="j-title">КРОКОДИЛ</h1>
        <div className="j-card-setup">
          <div className="j-option">
            <span className="j-label"><Settings size={14}/> СЛОЖНОСТЬ</span>
            <div className="j-tabs">
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} className={difficulty === d ? 'active' : ''} onClick={() => setDifficulty(d)}>
                  {d === 'easy' ? 'Легко' : d === 'medium' ? 'Норм' : 'Хард'}
                </button>
              ))}
            </div>
          </div>
          <div className="j-option">
            <span className="j-label"><Timer size={14}/> ВРЕМЯ: {settings.time}с</span>
            <input type="range" min="30" max="120" step="10" value={settings.time} onChange={e => setSettings({...settings, time: +e.target.value})} />
          </div>
        </div>
        <button className="j-btn-prime" onClick={() => setScreen('rules')}>ДАЛЕЕ</button>
      </div>
    );
  }

  // 2. Правила (Rules)
  if (screen === 'rules') {
    return (
      <div className="jungle-ui center">
        <h2 className="j-title">ПРАВИЛА</h2>
        <div className="j-rules-list">
          <p>🏝 Объясняй слова только жестами.</p>
          <p>🤫 Никаких звуков и подсказок.</p>
          <p>✅ Угадали — жми зеленую кнопку.</p>
          <p>❌ Хочешь другое слово — жми красную.</p>
        </div>
        <button className="j-btn-prime" onClick={() => setScreen('ready')}>ПОНЯТНО</button>
      </div>
    );
  }

  // 3. Готовность (Ready)
  if (screen === 'ready') {
    return (
      <div className="jungle-ui center">
        <div className="j-badge">РАУНД {currentRound}</div>
        <Users size={48} color="#ffe600" />
        <p className="j-pre-title">Очередь команды:</p>
        <h2 className="j-team-name">{teamNames[currentTeam]}</h2>
        <button className="j-btn-prime highlight" onClick={startRound}><Play fill="currentColor" size={16}/> НАЧАТЬ</button>
      </div>
    );
  }

  // 4. Игра (Play)
  if (screen === 'play') {
    return (
      <div className="jungle-ui">
        <div className="j-game-header">
          <div className={`j-timer-box ${timeLeft < 10 ? 'urgent' : ''}`}>{timeLeft}</div>
          <div className="j-current-score">Счет: {score[currentTeam]}</div>
        </div>
        <div className="j-word-area">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentWord}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="j-word-card"
            >
              <h3>{currentWord}</h3>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="j-game-controls">
          <button className="j-ctrl-btn skip" onClick={() => handleAction(false)}><X /></button>
          <button className="j-ctrl-btn check" onClick={() => handleAction(true)}><Check /></button>
        </div>
      </div>
    );
  }

  // 5. Итоги раунда и Финал (Results / Final)
  return (
    <div className="jungle-ui center">
      <Trophy size={64} color="#ffe600" className="j-icon-anim" />
      <h2 className="j-title">{screen === 'final' ? 'ИГРА ОКОНЧЕНА' : 'ИТОГИ РАУНДА'}</h2>
      <div className="j-score-board">
        {teamNames.map((name, i) => (
          <div key={i} className="j-score-row">
            <span>{name}</span>
            <span className="val">{score[i]}</span>
          </div>
        ))}
      </div>
      <button className="j-btn-prime" onClick={screen === 'final' ? onBack : handleNext}>
        {screen === 'final' ? 'В МЕНЮ' : 'СЛЕДУЮЩИЙ ХОД'}
      </button>
    </div>
  );
};

export default CrocodileGame;

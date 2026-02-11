import React, { useState, useEffect } from 'react';
// Библиотека для анимаций
import { motion, AnimatePresence } from 'framer-motion';
// Иконки
import { Timer, Trophy, Users, ArrowLeft, X, Check, Play, Settings } from 'lucide-react';
import './CrocodileGame.css';

const WORDS_LIBRARY = {
  easy: ['Банан', 'Обезьяна', 'Пальма', 'Змея', 'Лиана', 'Слон', 'Кокос', 'Попугай', 'Солнце', 'Трава'],
  medium: ['Фотоаппарат', 'Мачете', 'Водопад', 'Исследователь', 'Рюкзак', 'Джунгли', 'Леопард', 'Тукан'],
  hard: ['Эндемик', 'Мимикрия', 'Биоразнообразие', 'Инкубация', 'Пангея', 'Экспедиция', 'Артефакт']
};

const CrocodileGame = ({ onBack }) => {
  // --- СОСТОЯНИЯ ---
  const [screen, setScreen] = useState('setup'); 
  const [difficulty, setDifficulty] = useState('easy');
  const [settings, setSettings] = useState({ time: 60, rounds: 3 }); // Настройка раундов здесь
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [score, setScore] = useState([0, 0]); 
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  const teamNames = ['Команда Лиан', 'Команда Ягуаров'];

  // --- ТАЙМЕР ---
  useEffect(() => {
    let timer;
    if (screen === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && screen === 'play') {
      setScreen('results');
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // --- ЛОГИКА ---

  // Выбор слова
  // // Берет случайное слово из библиотеки по ключу сложности
  const nextWord = () => {
    const list = WORDS_LIBRARY[difficulty];
    setCurrentWord(list[Math.floor(Math.random() * list.length)]);
  };

  const startRound = () => {
    nextWord();
    setTimeLeft(settings.time);
    setScreen('play');
  };

  const handleAction = (isWin) => {
    if (isWin) {
      const newScore = [...score];
      newScore[currentTeam] += 1;
      setScore(newScore);
    }
    nextWord();
  };

  // Переход хода (Логика завершения игры)
  // // Проверяет, был ли это последний раунд для последней команды
  const handleNext = () => {
    if (currentTeam === 1) { 
      if (currentRound >= settings.rounds) {
        setScreen('final'); // Если лимит раундов исчерпан — финал
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

  // --- ЭКРАНЫ ---

  // Экран настроек
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

          {/* НОВОЕ: Настройка количества раундов */}
          <div className="j-option">
            <span className="j-label"><Trophy size={14}/> РАУНДОВ: {settings.rounds}</span>
            <input type="range" min="1" max="10" step="1" value={settings.rounds} onChange={e => setSettings({...settings, rounds: +e.target.value})} />
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

  // Экран "Готовность"
  if (screen === 'ready') {
    return (
      <div className="jungle-ui center">
        <div className="j-badge">РАУНД {currentRound} ИЗ {settings.rounds}</div>
        <Users size={48} color="#ffe600" />
        <p className="j-pre-title">Очередь команды:</p>
        <h2 className="j-team-name">{teamNames[currentTeam]}</h2>
        <button className="j-btn-prime highlight" onClick={startRound}><Play fill="currentColor" size={16}/> НАЧАТЬ</button>
      </div>
    );
  }

  // Игровой экран (Play)
  if (screen === 'play') {
    return (
      <div className="jungle-ui">
        <div className="j-game-header">
          <div className={`j-timer-box ${timeLeft < 10 ? 'urgent' : ''}`}>{timeLeft}</div>
          <div className="j-round-mini">Раунд {currentRound}/{settings.rounds}</div>
          <div className="j-current-score">Счет: {score[currentTeam]}</div>
        </div>
        <div className="j-word-area">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

  // Финальный экран и Итоги
  return (
    <div className="jungle-ui center">
      <Trophy size={64} color="#ffe600" className="j-icon-anim" />
      <h2 className="j-title">{screen === 'final' ? 'ИГРА ОКОНЧЕНА' : 'ИТОГИ РАУНДА'}</h2>
      
      {screen === 'final' && (
        <div className="j-winner-announce">
          {score[0] === score[1] ? 'НИЧЬЯ!' : `ПОБЕДИЛИ ${score[0] > score[1] ? teamNames[0] : teamNames[1]}!`}
        </div>
      )}

      <div className="j-score-board">
        {teamNames.map((name, i) => (
          <div key={i} className={`j-score-row ${screen === 'final' && score[i] === Math.max(...score) ? 'winner' : ''}`}>
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

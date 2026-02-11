import React, { useState, useEffect, useCallback } from 'react';
// Анимации для эффекта появления карточек
import { motion, AnimatePresence } from 'framer-motion';
// Иконки: молния, часы, пользователи, кнопки управления
import { Zap, Timer, Users, X, Check, ArrowLeft, Trophy } from 'lucide-react';
import './AliasGame.css';

// Базовая библиотека слов
const WORDS_BANK = ["Космос", "Пицца", "Детектив", "Айсберг", "Дракон", "Гитара", "Сэндвич", "Вертолет", "Магия", "Океан"];

const AliasGame = ({ onBack }) => {
  // Состояния: lobby (меню), ready (заставка), play (игра), results (итоги)
  const [screen, setScreen] = useState('lobby');
  const [teams, setTeams] = useState([
    { name: 'КОМАНДА А', score: 0 },
    { name: 'КОМАНДА Б', score: 0 }
  ]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [word, setWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [history, setHistory] = useState([]); // История угаданных слов за раунд

  // Функция получения нового слова
  // // Берет случайное слово и обновляет стейт
  const nextWord = useCallback(() => {
    const random = WORDS_BANK[Math.floor(Math.random() * WORDS_BANK.length)];
    setWord(random);
  }, []);

  // Таймер раунда
  useEffect(() => {
    let timer;
    if (screen === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && screen === 'play') {
      setScreen('results');
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // Старт игрового раунда
  const startRound = () => {
    setHistory([]);
    setTimeLeft(60);
    nextWord();
    setScreen('play');
  };

  // Обработка ответа
  // // Сохраняет результат в историю и переключает слово
  const handleAction = (isCorrect) => {
    setHistory(prev => [...prev, { word, isCorrect }]);
    nextWord();
  };

  // Переход к следующей команде после итогов
  const confirmRound = () => {
    const roundScore = history.reduce((acc, item) => acc + (item.isCorrect ? 1 : -1), 0);
    const updated = [...teams];
    updated[currentTeam].score += roundScore;
    
    setTeams(updated);
    setCurrentTeam(currentTeam === 0 ? 1 : 0);
    setScreen('ready');
  };

  // --- ЭКРАНЫ ---

  // 1. ЛОББИ
  if (screen === 'lobby') {
    return (
      <div className="pop-container">
        <button className="pop-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="pop-logo">ALIAS!</h1>
        <div className="pop-teams">
          {teams.map((t, i) => (
            <div key={i} className="pop-team-row">
              <span>{t.name}</span>
              <span className="pop-score-badge">{t.score}</span>
            </div>
          ))}
        </div>
        <button className="pop-btn-main" onClick={() => setScreen('ready')}>ПОЕХАЛИ</button>
      </div>
    );
  }

  // 2. ГОТОВНОСТЬ
  if (screen === 'ready') {
    return (
      <div className="pop-container center">
        <Users size={80} strokeWidth={3} />
        <p className="pop-pre">ГОТОВИТСЯ</p>
        <h2 className="pop-team-name">{teams[currentTeam].name}</h2>
        <button className="pop-btn-main" onClick={startRound}>Я ГОТОВ!</button>
      </div>
    );
  }

  // 3. ИГРА
  if (screen === 'play') {
    return (
      <div className="pop-container play-bg">
        <div className="pop-header">
          <div className="pop-timer-pill"><Timer size={20}/> {timeLeft}с</div>
          <div className="pop-team-pill">{teams[currentTeam].name}</div>
        </div>
        <div className="pop-card-area">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word + history.length}
              initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="pop-word-card"
            >
              <h2>{word}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pop-actions">
          <button className="pop-action-btn btn-no" onClick={() => handleAction(false)}><X size={40}/></button>
          <button className="pop-action-btn btn-yes" onClick={() => handleAction(true)}><Check size={40}/></button>
        </div>
      </div>
    );
  }

  // 4. ИТОГИ
  return (
    <div className="pop-container">
      <h2 className="pop-title-sm">РЕЗУЛЬТАТЫ</h2>
      <div className="pop-list">
        {history.map((h, i) => (
          <div key={i} className={`pop-list-item ${h.isCorrect ? 'is-ok' : 'is-no'}`}>
            {h.word} <span>{h.isCorrect ? '+1' : '-1'}</span>
          </div>
        ))}
      </div>
      <button className="pop-btn-main" onClick={confirmRound}>ПРОДОЛЖИТЬ</button>
    </div>
  );
};

export default AliasGame;

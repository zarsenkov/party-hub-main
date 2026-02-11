import React, { useState, useEffect, useCallback } from 'react';
// Анимации
import { motion, AnimatePresence } from 'framer-motion';
// Иконки: молния, пользователи, щит, стрелки
import { Zap, Users, Play, X, Check, ArrowLeft, Trophy } from 'lucide-react';
import './AliasGame.css';

// База слов для Alias
const ALIAS_WORDS = [
  "Парашют", "Микроскоп", "Эверест", "Шоколад", "Голограмма", 
  "Колизей", "Снежинка", "Марафон", "Киберпанк", "Лабиринт"
];

const AliasGame = ({ onBack }) => {
  // Состояния: lobby (меню), round_start (готовность), play (процесс), score (итоги)
  const [stage, setStage] = useState('lobby');
  const [teams, setTeams] = useState([
    { name: 'АЛЬФА', score: 0 },
    { name: 'ОМЕГА', score: 0 }
  ]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [word, setWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundLog, setRoundLog] = useState([]); // Лог слов для экрана итогов

  // Умная смена слова
  // // Исключает повторы и готовит лог раунда
  const getNextWord = useCallback(() => {
    const next = ALIAS_WORDS[Math.floor(Math.random() * ALIAS_WORDS.length)];
    setWord(next);
  }, []);

  // Таймер раунда
  useEffect(() => {
    let timer;
    if (stage === 'play' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && stage === 'play') {
      setStage('score');
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // Старт раунда для конкретной команды
  const startRound = () => {
    setRoundLog([]);
    setTimeLeft(60);
    getNextWord();
    setStage('play');
  };

  // Обработка ответа (Да / Нет)
  // // Мгновенно меняет слово и записывает результат
  const handleAnswer = (isCorrect) => {
    setRoundLog(prev => [...prev, { word, isCorrect }]);
    getNextWord();
  };

  // Завершение раунда и начисление очков
  const finishRound = () => {
    const roundScore = roundLog.reduce((acc, item) => acc + (item.isCorrect ? 1 : -1), 0);
    const updatedTeams = [...teams];
    updatedTeams[currentTeam].score += roundScore;
    
    setTeams(updatedTeams);
    setCurrentTeam(prev => (prev === 0 ? 1 : 0)); // Смена команды
    setStage('round_start');
  };

  // --- ЭКРАНЫ ---

  // 1. Лобби (Начало)
  if (stage === 'lobby') {
    return (
      <div className="alias-container night-theme">
        <button className="a-back" onClick={onBack}><ArrowLeft /></button>
        <div className="a-content center">
          <Zap size={48} className="a-icon-gold" />
          <h1 className="a-logo">ALIAS</h1>
          <div className="a-teams-preview">
            {teams.map((t, i) => (
              <div key={i} className="a-team-card">
                <span>{t.name}</span>
                <span className="gold-text">{t.score}</span>
              </div>
            ))}
          </div>
          <button className="a-btn-gold" onClick={() => setStage('round_start')}>ПОГНАЛИ</button>
        </div>
      </div>
    );
  }

  // 2. Готовность команды
  if (stage === 'round_start') {
    return (
      <div className="alias-container night-theme center">
        <Users size={60} color="#d4af37" />
        <p className="a-label">ГОТОВИТСЯ КОМАНДА</p>
        <h2 className="a-team-title">{teams[currentTeam].name}</h2>
        <button className="a-btn-gold" onClick={startRound}>Я ГОТОВ</button>
      </div>
    );
  }

  // 3. Игра (Play)
  if (stage === 'play') {
    return (
      <div className="alias-container night-theme">
        <div className="a-header">
          <div className="a-timer">{timeLeft}с</div>
          <div className="a-current-team">{teams[currentTeam].name}</div>
        </div>
        <div className="a-card-zone">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="a-word-card"
            >
              <h2>{word}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="a-controls">
          <button className="a-btn-no" onClick={() => handleAnswer(false)}><X /></button>
          <button className="a-btn-yes" onClick={() => handleAnswer(true)}><Check /></button>
        </div>
      </div>
    );
  }

  // 4. Итоги раунда
  return (
    <div className="alias-container night-theme">
      <h2 className="a-res-title">РЕЗУЛЬТАТЫ</h2>
      <div className="a-log-list">
        {roundLog.map((item, i) => (
          <div key={i} className={`a-log-item ${item.isCorrect ? 'pos' : 'neg'}`}>
            {item.word} <span>{item.isCorrect ? '+1' : '-1'}</span>
          </div>
        ))}
      </div>
      <button className="a-btn-gold" onClick={finishRound}>ПРИНЯТЬ</button>
    </div>
  );
};

export default AliasGame;

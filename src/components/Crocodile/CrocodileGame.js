import React, { useState, useEffect } from 'react';
// Импортируем только нужные иконки
import { Timer, Trophy, Play, RotateCcw, X, Check, ArrowLeft } from 'lucide-react';
// Плавные анимации карточек
import { motion, AnimatePresence } from 'framer-motion';
import './CrocodileGame.css';

// Максимально полная база слов
const WORDS = {
  easy: ['Кошка', 'Телефон', 'Арбуз', 'Зеркало', 'Гитара', 'Корона', 'Лампа', 'Книга'],
  medium: ['Кинотеатр', 'Стоматолог', 'Пылесос', 'Бумеранг', 'Сковорода', 'Шахматы'],
  hard: ['Адреналин', 'Гравитация', 'Сарказм', 'Ностальгия', 'Синхронизация']
};

const CrocodileGame = ({ onBack }) => {
  // Базовые настройки состояний
  const [stage, setStage] = useState('menu'); // menu, play, result, final
  const [diff, setDiff] = useState('easy');
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [round, setRound] = useState(1);

  // Логика таймера
  // // Следит за временем и переключает на экран итогов при 0
  useEffect(() => {
    let interval;
    if (stage === 'play' && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0) {
      setStage('result');
    }
    return () => clearInterval(interval);
  }, [stage, time]);

  // Выбор нового слова
  // // Берет случайный элемент из выбранной категории сложности
  const getRandomWord = () => {
    const list = WORDS[diff];
    const newWord = list[Math.floor(Math.random() * list.length)];
    setWord(newWord);
  };

  // Старт игры
  // // Сбрасывает счетчики и запускает первый раунд
  const startGame = () => {
    setScore(0);
    setTime(60);
    setRound(1);
    getRandomWord();
    setStage('play');
  };

  // Обработка кнопки "Угадано"
  // // Прибавляет балл и сразу дает новое слово
  const handleSuccess = () => {
    setScore(s => s + 1);
    getRandomWord();
  };

  // Обработка кнопки "Пропустить"
  // // Просто меняет слово без начисления баллов
  const handleSkip = () => {
    getRandomWord();
  };

  // --- ЭКРАНЫ ---

  // 1. ГЛАВНОЕ МЕНЮ ИГРЫ
  if (stage === 'menu') {
    return (
      <div className="croc-container jungle-theme">
        <button className="croc-back" onClick={onBack}><ArrowLeft /></button>
        <h1 className="croc-logo">CROC!</h1>
        <div className="croc-setup">
          <p className="croc-label">СЛОЖНОСТЬ</p>
          <div className="croc-diff-selector">
            {Object.keys(WORDS).map(k => (
              <button key={k} className={diff === k ? 'active' : ''} onClick={() => setDiff(k)}>
                {k === 'easy' ? 'Изи' : k === 'medium' ? 'Мид' : 'Хард'}
              </button>
            ))}
          </div>
        </div>
        <button className="croc-main-btn" onClick={startGame}><Play size={20}/> ИГРАТЬ</button>
      </div>
    );
  }

  // 2. ИГРОВОЙ ПРОЦЕСС
  if (stage === 'play') {
    return (
      <div className="croc-container play-mode jungle-theme">
        <div className="croc-top">
          <div className={`croc-timer ${time < 10 ? 'low' : ''}`}><Timer size={18}/> {time}с</div>
          <div className="croc-score">ОЧКИ: {score}</div>
        </div>
        <div className="croc-card-wrap">
          <AnimatePresence mode="wait">
            <motion.div 
              key={word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="croc-card"
            >
              <h2>{word}</h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="croc-actions">
          <button className="btn-skip" onClick={handleSkip}><X size={30}/></button>
          <button className="btn-ok" onClick={handleSuccess}><Check size={30}/></button>
        </div>
      </div>
    );
  }

  // 3. ИТОГИ РАУНДА
  return (
    <div className="croc-container result-mode jungle-theme">
      <Trophy size={80} color="#ffe600" className="trophy-anim" />
      <h1 className="res-title">ВРЕМЯ ВЫШЛО!</h1>
      <div className="res-score-box">
        <p>ВАШ РЕЗУЛЬТАТ:</p>
        <h2>{score}</h2>
      </div>
      <div className="res-btns">
        <button className="btn-retry" onClick={startGame}><RotateCcw /> ЕЩЕ РАЗ</button>
        <button className="btn-exit" onClick={onBack}>В МЕНЮ</button>
      </div>
    </div>
  );
};

export default CrocodileGame;

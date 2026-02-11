import React, { useState, useEffect, useCallback } from 'react';
// Плавные анимации
import { motion, AnimatePresence } from 'framer-motion';
// Иконки
import { Timer, Trophy, Play, RotateCcw, X, Check, ArrowLeft } from 'lucide-react';
import './CrocodileGame.css';

// Расширенная база слов
const WORDS = {
  easy: ['Кошка', 'Телефон', 'Арбуз', 'Зеркало', 'Гитара', 'Корона', 'Лампа', 'Книга', 'Пицца', 'Диван'],
  medium: ['Кинотеатр', 'Стоматолог', 'Пылесос', 'Бумеранг', 'Сковорода', 'Шахматы', 'Официант', 'Магнит'],
  hard: ['Адреналин', 'Гравитация', 'Сарказм', 'Ностальгия', 'Синхронизация', 'Метафора', 'Престиж']
};

const CrocodileGame = ({ onBack }) => {
  // Основные состояния
  const [stage, setStage] = useState('menu'); 
  const [diff, setDiff] = useState('easy');
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);

  // Умная функция смены слова
  // // Гарантирует, что новое слово не будет повторять предыдущее
  const getRandomWord = useCallback(() => {
    const list = WORDS[diff];
    setWord(prevWord => {
      let nextWord = list[Math.floor(Math.random() * list.length)];
      // Если выпало то же самое слово, берем другое
      while (nextWord === prevWord && list.length > 1) {
        nextWord = list[Math.floor(Math.random() * list.length)];
      }
      return nextWord;
    });
  }, [diff]);

  // Таймер раунда
  useEffect(() => {
    let interval;
    if (stage === 'play' && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('result');
    }
    return () => clearInterval(interval);
  }, [stage, time]);

  // Старт игры
  const startGame = () => {
    setScore(0);
    setTime(60);
    getRandomWord();
    setStage('play');
  };

  // Обработка кнопки "Угадано" (Галочка)
  // // Используем функциональное обновление стейта для мгновенной реакции
  const handleSuccess = () => {
    setScore(prevScore => prevScore + 1);
    getRandomWord();
  };

  // Обработка кнопки "Пропустить" (Крестик)
  const handleSkip = () => {
    getRandomWord();
  };

  // --- РЕНДЕР ---

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

  if (stage === 'play') {
    return (
      <div className="croc-container play-mode jungle-theme">
        <div className="croc-top">
          <div className={`croc-timer ${time < 10 ? 'low' : ''}`}><Timer size={18}/> {time}с</div>
          <div className="croc-score">ОЧКИ: {score}</div>
        </div>
        <div className="croc-card-wrap">
          <AnimatePresence mode="wait">
            {/* key={word + score} заставляет React перерисовывать карточку мгновенно */}
            <motion.div 
              key={word + score} 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.15 }}
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

  return (
    <div className="croc-container result-mode jungle-theme">
      <Trophy size={80} color="#ffe600" className="trophy-anim" />
      <h1 className="res-title">ФИНИШ!</h1>
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

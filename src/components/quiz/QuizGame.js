import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Подключаем стили
import './QuizGame.css';

// --- БАЗА ВОПРОСОВ ---
const QUIZ_DATA = [
  { q: "Что на Руси называли «жидким золотом»?", a: ["Мед", "Пиво", "Масло", "Квас"], correct: 0 },
  { q: "Какой орган человека не чувствует боли?", a: ["Сердце", "Мозг", "Печень", "Легкие"], correct: 1 },
  { q: "Сколько клавиш у стандартного пианино?", a: ["76", "82", "88", "94"], correct: 2 },
  { q: "В какой стране изобрели бумагу?", a: ["Индия", "Египет", "Китай", "Греция"], correct: 2 }
];

export default function QuizGame({ onBack }) {
  // --- СОСТОЯНИЯ ---
  const [step, setStep] = useState('start'); // start, play, result
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // --- ТАЙМЕР ---
  useEffect(() => {
    let timer;
    if (step === 'play' && timeLeft > 0 && !isLocked) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !isLocked) {
      handleAnswer(null); // Время вышло
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isLocked]);

  // --- ЛОГИКА ---
  const handleAnswer = (index) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelected(index);

    if (index === QUIZ_DATA[currentQ].correct) {
      setScore(s => s + 1);
    }

    // Задержка перед следующим вопросом, чтобы увидеть результат
    setTimeout(() => {
      if (currentQ < QUIZ_DATA.length - 1) {
        setCurrentQ(c => c + 1);
        setTimeLeft(15);
        setSelected(null);
        setIsLocked(false);
      } else {
        setStep('result');
      }
    }, 1200);
  };

  return (
    <div className="quiz-container">
      <button className="quiz-exit" onClick={onBack}>ВЫЙТИ</button>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: СТАРТ */}
        {step === 'start' && (
          <motion.div key="start" className="quiz-card" initial={{scale:0}} animate={{scale:1}}>
            <div className="quiz-logo">
              <span className="logo-top">MEGA</span>
              <span className="logo-bottom">QUIZ</span>
            </div>
            <p className="quiz-intro">4 вопроса • 15 секунд на каждый</p>
            <button className="quiz-main-btn" onClick={() => setStep('play')}>ПОГНАЛИ!</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ИГРА */}
        {step === 'play' && (
          <motion.div key="play" className="quiz-play-zone" initial={{x: 100, opacity: 0}} animate={{x: 0, opacity: 1}}>
            <div className="quiz-header">
              <div className="quiz-progress">Вопрос {currentQ + 1}/{QUIZ_DATA.length}</div>
              <div className={`quiz-timer ${timeLeft < 5 ? 'timer-low' : ''}`}>{timeLeft}</div>
            </div>

            <h2 className="quiz-question">{QUIZ_DATA[currentQ].q}</h2>

            <div className="quiz-options">
              {QUIZ_DATA[currentQ].a.map((opt, i) => {
                let status = '';
                if (selected !== null) {
                  if (i === QUIZ_DATA[currentQ].correct) status = 'correct';
                  else if (i === selected) status = 'wrong';
                }
                return (
                  <button 
                    key={i} 
                    className={`quiz-opt-btn ${status}`}
                    onClick={() => handleAnswer(i)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 3: ФИНАЛ */}
        {step === 'result' && (
          <motion.div key="res" className="quiz-card result-card" initial={{y: 50}} animate={{y: 0}}>
            <h2 className="res-title">ФИНИШ!</h2>
            <div className="res-score-circle">
              <span className="res-num">{score}</span>
              <span className="res-total">/{QUIZ_DATA.length}</span>
            </div>
            <p className="res-rank">
              {score === QUIZ_DATA.length ? "ТЫ ГЕНИЙ!" : "МОЖНО ЛУЧШЕ!"}
            </p>
            <button className="quiz-main-btn" onClick={() => window.location.reload()}>ЕЩЕ РАЗ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

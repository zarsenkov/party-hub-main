import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// База для Крокодила
const CROC_WORDS = ["Шлагбаум", "Электрический ток", "Бутерброд"];

export default function CrocodileGame({ onBack }) {
  const [screen, setScreen] = useState('menu');
  const [word, setWord] = useState('');

  // Функция для получения нового задания
  const generateTask = () => {
    setWord(CROC_WORDS[Math.floor(Math.random() * CROC_WORDS.length)]);
    setScreen('play');
  };

  return (
    <div className="app-shell" style={{backgroundColor: '#C6F6D5'}}>
      {/* Кнопка возврата на лендинг */}
      <button className="btn-back" onClick={onBack}>← МЕНЮ</button>

      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div key="menu" className="pop-screen active">
            <h1 className="pop-title">КРОКО<span>ДИЛ</span></h1>
            <button className="btn-pop-main" onClick={generateTask}>К ЗАДАНИЮ</button>
          </motion.div>
        )}
        {screen === 'play' && (
          <motion.div key="play" className="pop-screen active">
            <div className="word-card">{word}</div>
            <button className="btn-pop-main" onClick={() => setScreen('menu')}>ГОТОВО</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

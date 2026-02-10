import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// База слов для Alias
const DICTIONARY = {
  "❤️ ХОТ": ["Свидание", "Поцелуй", "Романтика", "Страсть"],
  "🥳 ПАТИ": ["Танцы", "Караоке", "Коктейль", "Музыка"],
  "🧠 УМ": ["Интеллект", "Логика", "Философия", "Космос"]
};

// Принимаем функцию onBack из главного файла
export default function AliasGame({ onBack }) {
  const [screen, setScreen] = useState('setup'); 
  const [teams, setTeams] = useState([{ name: 'Команда 1', score: 0 }, { name: 'Команда 2', score: 0 }]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [category, setCategory] = useState("❤️ ХОТ");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  // Логика таймера: считает каждую секунду
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setScreen('results');
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Выбор следующего слова
  const nextWord = useCallback(() => {
    const list = DICTIONARY[category];
    setCurrentWord(list[Math.floor(Math.random() * list.length)]);
  }, [category]);

  return (
    <div className="app-shell">
      {/* Кнопка выхода в главное меню */}
      <button className="btn-back" onClick={onBack}>← МЕНЮ</button>
      
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div key="setup" className="pop-screen active">
            <h1 className="pop-title">ALIAS<span>POP</span></h1>
            <button className="btn-pop-main" onClick={() => {setTimer(60); setScreen('play'); setIsActive(true); nextWord();}}>ИГРАТЬ</button>
          </motion.div>
        )}
        {/* Остальные экраны игры (play, results) будут тут так же, как мы писали раньше */}
      </AnimatePresence>
    </div>
  );
}

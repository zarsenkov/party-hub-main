import React, { useState } from 'react';
// // Импорт базы вопросов
import { NEVER_QUESTIONS } from './neverData';

const NeverHaveIEver = () => {
  const [screen, setScreen] = useState('menu'); 
  const [level, setLevel] = useState('soft');
  const [index, setIndex] = useState(0);

  // // Ссылка на главную страницу LoveCouple
  const goHome = () => window.location.href = 'https://lovecouple.ru';

  // // Функция выбора уровня сложности
  const selectLevel = (lvl) => {
    setLevel(lvl);
    // // Генерируем случайный стартовый индекс
    const randomIndex = Math.floor(Math.random() * NEVER_QUESTIONS[lvl].length);
    setIndex(randomIndex);
    setScreen('game');
  };

  // // Функция перехода к следующему случайному вопросу
  const nextStep = () => {
    const questions = NEVER_QUESTIONS[level];
    const newIndex = Math.floor(Math.random() * questions.length);
    // // Чтобы вопрос не повторился дважды подряд
    if (newIndex === index) {
      nextStep();
    } else {
      setIndex(newIndex);
    }
  };

  return (
    <div className="neon-root">
      <style>{neonStyles}</style>

      {/* Кнопка выхода на лендинг */}
      <button className="neon-back" onClick={goHome}>EXIT</button>

      {/* ЭКРАН ВЫБОРА */}
      {screen === 'menu' && (
        <div className="neon-menu fade-in">
          <h1 className="neon-logo">Я НИКОГДА<span>НЕ</span></h1>
          
          <div className="neon-list">
            <button className="neon-item blue" onClick={() => selectLevel('soft')}>
              SOFT <span>• Для всех</span>
            </button>
            <button className="neon-item yellow" onClick={() => selectLevel('party')}>
              PARTY <span>• Туса</span>
            </button>
            <button className="neon-item red" onClick={() => selectLevel('spicy')}>
              HARD <span>• 18+</span>
            </button>
          </div>
        </div>
      )}

      {/* ИГРОВОЙ ПРОЦЕСС */}
      {screen === 'game' && (
        <div className="neon-game fade-in">
          <div className={`neon-card ${level}`}>
            <div className="card-glare"></div>
            {/* Берем текст вопроса из внешнего файла по индексу */}
            <p className="neon-text">“{NEVER_QUESTIONS[level][index]}”</p>
          </div>

          <div className="neon-controls">
            <button className="neon-btn small" onClick={() => setScreen('menu')}>МЕНЮ</button>
            <button className="neon-btn big" onClick={nextStep}>ДАЛЬШЕ</button>
          </div>
        </div>
      )}
    </div>
  );
};

// // Стили оставляем те же, что и были (Неоновый бар)
const neonStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Monoton&family=Orbitron:wght@400;900&display=swap');
  /* ... (весь предыдущий CSS без изменений) ... */
`;

export default NeverHaveIEver;

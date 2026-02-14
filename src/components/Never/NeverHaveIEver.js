import React, { useState } from 'react';
// // Убедись, что neverData.js лежит в этой же папке!
import { NEVER_QUESTIONS } from './neverData';

// // Принимаем onBack как проп, чтобы возвращаться на лендинг
const NeverHaveIEver = ({ onBack }) => {
  const [screen, setScreen] = useState('menu'); 
  const [level, setLevel] = useState('soft');
  const [index, setIndex] = useState(0);

  // // Функция выбора уровня сложности
  const selectLevel = (lvl) => {
    setLevel(lvl);
    const randomIndex = Math.floor(Math.random() * NEVER_QUESTIONS[lvl].length);
    setIndex(randomIndex);
    setScreen('game');
  };

  // // Функция перехода к следующему вопросу
  const nextStep = () => {
    const questions = NEVER_QUESTIONS[level];
    let newIndex = Math.floor(Math.random() * questions.length);
    // // Проверка на повтор
    if (newIndex === index) newIndex = (index + 1) % questions.length;
    setIndex(newIndex);
  };

  return (
    <div className="neon-root">
      <style>{neonStyles}</style>

      {/* Кнопка выхода на лендинг через проп onBack */}
      <button className="neon-back" onClick={onBack}>EXIT</button>

      {/* ЭКРАН ВЫБОРА */}
      {screen === 'menu' && (
        <div className="neon-menu fade-in">
          <h1 className="neon-logo">Я НИКОГДА<span>НЕ</span></h1>
          
          <div className="neon-list">
            <button className="neon-item blue" onClick={() => selectLevel('soft')}>
              SOFT <span className="n-desc">• Для всех</span>
            </button>
            <button className="neon-item yellow" onClick={() => selectLevel('party')}>
              PARTY <span className="n-desc">• Туса</span>
            </button>
            <button className="neon-item red" onClick={() => selectLevel('spicy')}>
              HARD <span className="n-desc">• 18+</span>
            </button>
          </div>
        </div>
      )}

      {/* ИГРОВОЙ ПРОЦЕСС */}
      {screen === 'game' && (
        <div className="neon-game fade-in">
          <div className={`neon-card ${level}`}>
            <div className="card-glare"></div>
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

// // ПОЛНЫЙ CSS (БЕЗ КОММЕНТАРИЕВ, С ПРИОРИТЕТОМ)
const neonStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Monoton&family=Orbitron:wght@400;900&display=swap');

  .neon-root {
    position: fixed !important; inset: 0 !important;
    background: #0a0a0c !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    font-family: 'Orbitron', sans-serif !important;
    z-index: 10000 !important; color: #fff !important;
  }

  .neon-back {
    position: absolute !important; top: 30px !important; left: 20px !important;
    background: none !important; border: 1px solid #444 !important;
    color: #888 !important; padding: 5px 15px !important; border-radius: 5px !important;
    cursor: pointer !important; z-index: 10001 !important;
  }

  .neon-logo {
    font-family: 'Monoton', cursive !important; font-size: 3rem !important;
    text-align: center !important; color: #fff !important;
    text-shadow: 0 0 10px #ff00de, 0 0 20px #ff00de !important;
    margin-bottom: 40px !important; line-height: 1.2 !important;
  }
  .neon-logo span { display: block !important; font-size: 2rem !important; color: #00f7ff !important; text-shadow: 0 0 10px #00f7ff !important; }

  .neon-list { display: flex !important; flex-direction: column !important; gap: 20px !important; width: 100% !important; max-width: 320px !important; padding: 20px !important; }
  
  .neon-item {
    background: rgba(255,255,255,0.02) !important; border: 2px solid !important;
    padding: 20px !important; border-radius: 12px !important;
    font-family: 'Orbitron', sans-serif !important; font-weight: 900 !important;
    font-size: 1.2rem !important; cursor: pointer !important; text-align: left !important;
    display: flex !important; flex-direction: column !important;
  }
  .n-desc { font-size: 0.7rem !important; opacity: 0.6 !important; font-weight: 400 !important; margin-top: 4px !important; }

  .blue { color: #00f7ff !important; border-color: #00f7ff !important; box-shadow: 0 0 10px #00f7ff !important; }
  .yellow { color: #fff600 !important; border-color: #fff600 !important; box-shadow: 0 0 10px #fff600 !important; }
  .red { color: #ff0055 !important; border-color: #ff0055 !important; box-shadow: 0 0 10px #ff0055 !important; }

  .neon-game { width: 100% !important; max-width: 350px !important; display: flex !important; flex-direction: column !important; gap: 30px !important; }
  
  .neon-card {
    height: 350px !important; background: rgba(255,255,255,0.03) !important;
    border: 3px solid !important; border-radius: 20px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 30px !important; text-align: center !important; position: relative !important;
  }
  .neon-card.soft { color: #00f7ff !important; border-color: #00f7ff !important; }
  .neon-card.party { color: #fff600 !important; border-color: #fff600 !important; }
  .neon-card.spicy { color: #ff0055 !important; border-color: #ff0055 !important; }

  .neon-text { font-size: 1.6rem !important; font-weight: 700 !important; line-height: 1.4 !important; text-shadow: 0 0 5px currentColor !important; }

  .neon-controls { display: grid !important; grid-template-columns: 1fr 2fr !important; gap: 15px !important; }
  
  .neon-btn {
    background: none !important; border: 2px solid #fff !important; color: #fff !important;
    font-family: 'Orbitron', sans-serif !important; font-weight: 900 !important;
    cursor: pointer !important; border-radius: 10px !important; padding: 15px !important;
  }
  .neon-btn.big { background: #fff !important; color: #000 !important; }

  .fade-in { animation: fIn 0.5s ease !important; }
  @keyframes fIn { from { opacity: 0; } to { opacity: 1; } }
`;

export default NeverHaveIEver;

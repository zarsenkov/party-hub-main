import React, { useState } from 'react';
import { VOICES_QUESTIONS } from './voicesData';

// // Компонент игры "Голоса в голове" в стиле Psychedelic Glitch
const QuizGame = ({ onBack }) => {
  const [screen, setScreen] = useState('menu'); // // menu, play
  const [category, setCategory] = useState('casual');
  const [index, setIndex] = useState(0);

  // // Запуск игры с перемешиванием
  const startGame = (cat) => {
    setCategory(cat);
    setIndex(Math.floor(Math.random() * VOICES_QUESTIONS[cat].length));
    setScreen('play');
  };

  // // Следующий случайный вопрос
  const nextQuestion = () => {
    const list = VOICES_QUESTIONS[category];
    setIndex(Math.floor(Math.random() * list.length));
  };

  return (
    <div className="voices-root">
      <style>{voicesStyles}</style>

      <button className="voices-exit" onClick={onBack}>← В МЕНЮ</button>

      {/* ЭКРАН ВЫБОРА */}
      {screen === 'menu' && (
        <div className="voices-container fade-in">
          <h1 className="voices-title">ГОЛОСА<span>В ГОЛОВЕ</span></h1>
          <p className="voices-subtitle">Кто из вас скорее всего...</p>
          
          <div className="voices-menu">
            <button className="v-btn purple" onClick={() => startGame('casual')}>БЫТОВУХА</button>
            <button className="v-btn lime" onClick={() => startGame('crazy')}>БЕЗУМИЕ</button>
            <button className="v-btn pink" onClick={() => startGame('love')}>РОМАНТИКА</button>
          </div>
        </div>
      )}

      {/* ЭКРАН ИГРЫ */}
      {screen === 'play' && (
        <div className="voices-play-view fade-in">
          <div className="glitch-card">
            <div className="glitch-layer"></div>
            <p className="v-question">“{VOICES_QUESTIONS[category][index]}”</p>
            <div className="v-hint">На счет ТРИ покажите пальцем на этого человека!</div>
          </div>

          <div className="v-controls">
            <button className="v-control-btn back" onClick={() => setScreen('menu')}>К ТЕМАМ</button>
            <button className="v-control-btn next" onClick={nextQuestion}>ДАЛЬШЕ →</button>
          </div>
        </div>
      )}
    </div>
  );
};

const voicesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;900&display=swap');

  .voices-root {
    position: fixed !important; inset: 0 !important;
    background: #110022 !important; /* Глубокий фиолетовый */
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    font-family: 'Unbounded', sans-serif !important;
    color: #fff !important; padding: 20px !important;
    z-index: 100000 !important; overflow: hidden !important;
  }

  .voices-exit {
    position: absolute !important; top: 30px !important; left: 20px !important;
    background: rgba(255,255,255,0.1) !important; border: 2px solid #fff !important;
    color: #fff !important; padding: 10px 15px !important; border-radius: 0 !important;
    font-size: 0.7rem !important; cursor: pointer !important; font-weight: 900 !important;
  }

  .voices-title {
    font-size: 2.5rem !important; font-weight: 900 !important; text-align: center !important;
    line-height: 0.9 !important; margin-bottom: 40px !important;
    text-transform: uppercase !important; transform: skewX(-5deg) !important;
  }
  .voices-title span { display: block !important; color: #ccff00 !important; font-size: 2rem !important; }

  .voices-subtitle { text-align: center !important; opacity: 0.7 !important; margin-bottom: 30px !important; font-size: 0.8rem !important; }

  .voices-menu { display: flex !important; flex-direction: column !important; gap: 15px !important; width: 100% !important; max-width: 320px !important; }

  .v-btn {
    padding: 22px !important; border: none !important; font-family: 'Unbounded' !important;
    font-weight: 900 !important; font-size: 1.1rem !important; cursor: pointer !important;
    text-transform: uppercase !important; transition: 0.2s !important;
    position: relative !important;
  }
  .v-btn.purple { background: #8800ff !important; color: #fff !important; box-shadow: 6px 6px 0 #ccff00 !important; }
  .v-btn.lime { background: #ccff00 !important; color: #000 !important; box-shadow: 6px 6px 0 #ff00ff !important; }
  .v-btn.pink { background: #ff00ff !important; color: #fff !important; box-shadow: 6px 6px 0 #00ffff !important; }
  .v-btn:active { transform: translate(3px, 3px) !important; box-shadow: 0 0 0 !important; }

  /* Игровой экран */
  .voices-play-view { width: 100% !important; max-width: 400px !important; display: flex !important; flex-direction: column !important; gap: 30px !important; }
  
  .glitch-card {
    background: #220044 !important; border: 4px solid #fff !important;
    padding: 50px 30px !important; min-height: 300px !important;
    display: flex !important; flex-direction: column !important;
    justify-content: center !important; align-items: center !important;
    text-align: center !important; position: relative !important;
  }
  .glitch-card::after { /* Эффект смещения слоев */
    content: ''; position: absolute; inset: -10px; border: 2px solid #ff00ff; z-index: -1; opacity: 0.5;
  }

  .v-question { font-size: 1.6rem !important; font-weight: 900 !important; line-height: 1.2 !important; margin-bottom: 30px !important; z-index: 2 !important; }
  .v-hint { font-size: 0.7rem !important; color: #ccff00 !important; font-weight: 400 !important; text-transform: uppercase !important; letter-spacing: 1px !important; }

  .v-controls { display: grid !important; grid-template-columns: 1fr 1.5fr !important; gap: 15px !important; }
  .v-control-btn {
    padding: 18px !important; border: 2px solid #fff !important; font-family: 'Unbounded' !important;
    font-weight: 900 !important; cursor: pointer !important; font-size: 0.8rem !important;
  }
  .v-control-btn.back { background: transparent !important; color: #fff !important; }
  .v-control-btn.next { background: #fff !important; color: #000 !important; box-shadow: 0 0 20px rgba(255,255,255,0.4) !important; }

  .fade-in { animation: vFadeIn 0.4s ease-out !important; }
  @keyframes vFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

export default QuizGame;

import React, { useState, useEffect } from 'react';
// // Данные вопросов (убедись, что файл существует)
import { VOICES_QUESTIONS } from './voicesData';

const QuizGame = ({ onBack }) => {
  // === СОСТОЯНИЕ ===
  const [screen, setScreen] = useState('menu'); // setup, play
  const [category, setCategory] = useState('casual');
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]); // // Для исключения повторов

  // === ЛОГИКА ===

  // // Запуск игры и инициализация очереди
  const startGame = (cat) => {
    const questions = VOICES_QUESTIONS[cat];
    if (!questions || questions.length === 0) return;

    const firstIndex = Math.floor(Math.random() * questions.length);
    setCategory(cat);
    setIndex(firstIndex);
    setHistory([firstIndex]); // // Запоминаем первый вопрос
    setScreen('play');
  };

  // // Выбор следующего вопроса без повторов
  const nextQuestion = () => {
    const questions = VOICES_QUESTIONS[category];
    
    // // Если все вопросы просмотрены — сбрасываем историю
    if (history.length >= questions.length) {
      const firstIndex = Math.floor(Math.random() * questions.length);
      setIndex(firstIndex);
      setHistory([firstIndex]);
      return;
    }

    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * questions.length);
    } while (history.includes(nextIdx)); // // Ищем тот, которого еще не было

    setIndex(nextIdx);
    setHistory([...history, nextIdx]);
  };

  return (
    <div className="doodle-root">
      <style>{doodleStyles}</style>

      <button className="doodle-exit" onClick={onBack}>← ВЫХОД</button>

      {/* ЭКРАН 1: МЕНЮ (ВЫБОР КАТЕГОРИИ) */}
      {screen === 'menu' && (
        <div className="doodle-container fade-in">
          <div className="doodle-header">
            <h1 className="doodle-title">ГОЛОСА<span>В ГОЛОВЕ</span></h1>
            <div className="scribble-line"></div>
          </div>
          <p className="doodle-desc">Кто из вас скорее всего...</p>
          
          <div className="doodle-menu">
            <button className="d-btn blue" onClick={() => startGame('casual')}>
              БЫТОВУХА
              <span className="btn-decoration">✎</span>
            </button>
            <button className="d-btn yellow" onClick={() => startGame('crazy')}>
              БЕЗУМИЕ
              <span className="btn-decoration">⚡</span>
            </button>
            <button className="d-btn pink" onClick={() => startGame('love')}>
              РОМАНТИКА
              <span className="btn-decoration">♥</span>
            </button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ИГРА */}
      {screen === 'play' && (
        <div className="doodle-play-view fade-in">
          <div className="paper-card">
            <div className="paper-clip"></div>
            <div className="card-content">
              <p className="d-question">“{VOICES_QUESTIONS[category][index]}”</p>
              <div className="d-divider"></div>
              <p className="d-hint">Покажи пальцем на виновного!</p>
            </div>
            <div className="paper-shadow"></div>
          </div>

          <div className="d-controls">
            <button className="d-ctrl-btn secondary" onClick={() => setScreen('menu')}>К ТЕМАМ</button>
            <button className="d-ctrl-btn primary" onClick={nextQuestion}>ДАЛЬШЕ →</button>
          </div>
          
          <div className="d-counter">Вопрос {history.length} из {VOICES_QUESTIONS[category].length}</div>
        </div>
      )}
    </div>
  );
};

// // CSS СТИЛИ: DOODLE / SKETCH STYLE
const doodleStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Unbounded:wght@400;900&display=swap');

  .doodle-root {
    position: fixed !important; inset: 0 !important;
    background: #fdfdfd !important;
    background-image: 
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px) !important;
    background-size: 20px 20px !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    font-family: 'Unbounded', sans-serif !important;
    color: #333 !important; padding: 20px !important;
    z-index: 100000 !important;
  }

  .doodle-exit {
    position: absolute !important; top: 20px !important; left: 20px !important;
    background: none !important; border: 2px solid #333 !important;
    color: #333 !important; padding: 8px 15px !important; border-radius: 5px !important;
    font-size: 0.7rem !important; cursor: pointer !important; font-weight: 900 !important;
  }

  .doodle-header { position: relative !important; margin-bottom: 30px !important; }
  .doodle-title {
    font-size: 2.2rem !important; font-weight: 900 !important; text-align: center !important;
    line-height: 1 !important; text-transform: uppercase !important;
  }
  .doodle-title span { display: block !important; font-family: 'Caveat', cursive !important; color: #00bcd4 !important; font-size: 2.5rem !important; transform: rotate(-5deg); }

  .scribble-line { height: 4px; background: #333; width: 100%; border-radius: 50% 10% 50% 10%; margin-top: 5px; }

  .doodle-desc { font-size: 0.9rem !important; text-align: center !important; margin-bottom: 30px !important; font-weight: 400 !important; }

  .doodle-menu { display: flex !important; flex-direction: column !important; gap: 15px !important; width: 100% !important; max-width: 300px !important; }

  .d-btn {
    padding: 20px !important; border: 3px solid #333 !important; border-radius: 12px 50px 12px 40px !important;
    font-family: 'Unbounded' !important; font-weight: 900 !important; font-size: 1rem !important;
    cursor: pointer !important; transition: 0.2s !important; position: relative !important;
    display: flex !important; justify-content: space-between !important; align-items: center !important;
  }
  .d-btn.blue { background: #e3f2fd !important; }
  .d-btn.yellow { background: #fffde7 !important; }
  .d-btn.pink { background: #fce4ec !important; }
  
  .btn-decoration { font-size: 1.5rem !important; opacity: 0.3; }
  
  .d-btn:active { transform: scale(0.98) rotate(1deg) !important; }

  /* Карточка игры */
  .paper-card {
    background: #fff !important; border: 2px solid #333 !important;
    padding: 40px 25px !important; position: relative !important;
    width: 100% !important; min-height: 280px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    box-shadow: 10px 10px 0px rgba(0,0,0,0.05) !important;
  }
  .paper-clip {
    position: absolute !important; top: -15px !important; left: 50% !important;
    transform: translateX(-50%) !important; width: 40px; height: 15px;
    background: #999; border-radius: 10px 10px 0 0; border: 2px solid #333;
  }
  
  .d-question { 
    font-family: 'Caveat', cursive !important; font-size: 2rem !important; 
    line-height: 1.2 !important; margin-bottom: 20px !important; 
  }
  .d-divider { height: 2px; border-top: 2px dashed #333; margin: 20px 0; opacity: 0.3; }
  .d-hint { font-size: 0.7rem !important; text-transform: uppercase !important; opacity: 0.6; letter-spacing: 1px; }

  .d-controls { display: grid !important; grid-template-columns: 1fr 1.5fr !important; gap: 12px !important; margin-top: 20px !important; }
  .d-ctrl-btn {
    padding: 15px !important; border: 3px solid #333 !important; font-family: 'Unbounded' !important;
    font-weight: 900 !important; cursor: pointer !important; font-size: 0.8rem !important;
    border-radius: 10px !important;
  }
  .d-ctrl-btn.secondary { background: #fff !important; }
  .d-ctrl-btn.primary { background: #00bcd4 !important; color: #fff !important; }
  
  .d-counter { text-align: center !important; font-size: 0.6rem !important; margin-top: 15px !important; opacity: 0.4; }

  .fade-in { animation: doodleIn 0.3s ease-out !important; }
  @keyframes doodleIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default QuizGame;

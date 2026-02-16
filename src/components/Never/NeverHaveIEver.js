import React, { useState } from 'react';
// // Данные вопросов
import { NEVER_QUESTIONS } from './neverData';

const NeverHaveIEver = ({ onBack }) => {
  // // Состояния экрана, уровня и индекса вопроса
  const [screen, setScreen] = useState('menu'); 
  const [level, setLevel] = useState('soft');
  const [index, setIndex] = useState(0);

  // // Состояния для системы игроков
  const [players, setPlayers] = useState(['Игрок 1', 'Игрок 2']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // // Логика управления списком игроков
  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (idx) => {
    if (players.length > 2) setPlayers(players.filter((_, i) => i !== idx));
  };

  // // Выбор сложности
  const selectLevel = (lvl) => {
    setLevel(lvl);
    setScreen('setup');
  };

  // // Старт игры
  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * NEVER_QUESTIONS[level].length);
    setIndex(randomIndex);
    setCurrentPlayerIndex(0);
    setScreen('game');
  };

  // // Переход к следующему шагу
  const nextStep = () => {
    const questions = NEVER_QUESTIONS[level];
    let newIndex = Math.floor(Math.random() * questions.length);
    if (questions.length > 1 && newIndex === index) newIndex = (index + 1) % questions.length;
    
    setIndex(newIndex);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  return (
    <div className="brutal-root">
      <style>{brutalStyles}</style>

      {/* Кнопка выхода */}
      <button className="brutal-back" onClick={onBack}>ВЫЙТИ</button>

      {/* ЭКРАН 1: МЕНЮ */}
      {screen === 'menu' && (
        <div className="brutal-container fade-in">
          <div className="brutal-title-box">
            <h1 className="brutal-logo">Я НИКОГДА<span>НЕ</span></h1>
          </div>
          <p className="brutal-label">ВЫБИРАЙ УРОВЕНЬ:</p>
          <div className="brutal-grid">
            <button className="brutal-card-btn soft" onClick={() => selectLevel('soft')}>SOFT</button>
            <button className="brutal-card-btn party" onClick={() => selectLevel('party')}>PARTY</button>
            <button className="brutal-card-btn spicy" onClick={() => selectLevel('spicy')}>18+</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ИГРОКИ */}
      {screen === 'setup' && (
        <div className="brutal-container fade-in">
          <h2 className="brutal-h2">КТО В ИГРЕ?</h2>
          <div className="brutal-input-group">
            <input 
              type="text" 
              className="brutal-input" 
              placeholder="ИМЯ..." 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button className="brutal-add-btn" onClick={addPlayer}>+</button>
          </div>

          <div className="brutal-player-list">
            {players.map((p, i) => (
              <div key={i} className="brutal-chip">
                {p} <span className="brutal-del" onClick={() => removePlayer(i)}>×</span>
              </div>
            ))}
          </div>

          <div className="brutal-actions">
            <button className="brutal-btn secondary" onClick={() => setScreen('menu')}>НАЗАД</button>
            <button className="brutal-btn primary" onClick={startGame}>ИГРАТЬ!</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ИГРА */}
      {screen === 'game' && (
        <div className="brutal-game-box fade-in">
          <div className="brutal-turn">
            СЕЙЧАС: <mark>{players[currentPlayerIndex]}</mark>
          </div>

          <div className={`brutal-main-card ${level}`}>
            <div className="brutal-word-wrap">
              <p className="brutal-question">{NEVER_QUESTIONS[level][index]}</p>
            </div>
          </div>

          <div className="brutal-actions">
            <button className="brutal-btn secondary" onClick={() => setScreen('menu')}>МЕНЮ</button>
            <button className="brutal-btn primary" onClick={nextStep}>ДАЛЬШЕ →</button>
          </div>
        </div>
      )}
    </div>
  );
};

// // CSS В СТИЛЕ НЕОБРУТАЛИЗМ
const brutalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Inter:wght@400;800&display=swap');

  .brutal-root {
    position: fixed !important; inset: 0 !important;
    background-color: #f0f0f0 !important;
    background-image: radial-gradient(#000 0.5px, transparent 0.5px) !important;
    background-size: 20px 20px !important; /* Точечный фон как на бумаге */
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-family: 'Inter', sans-serif !important; z-index: 10000 !important; color: #000 !important;
    padding: 20px !important;
  }

  /* Кнопка выхода */
  .brutal-back {
    position: absolute !important; top: 20px !important; left: 20px !important;
    background: #fff !important; border: 3px solid #000 !important;
    box-shadow: 4px 4px 0px #000 !important; padding: 8px 15px !important;
    font-weight: 800 !important; font-size: 12px !important; cursor: pointer !important;
  }
  .brutal-back:active { transform: translate(2px, 2px) !important; box-shadow: 2px 2px 0px #000 !important; }

  /* Контейнеры */
  .brutal-container {
    background: #fff !important; border: 4px solid #000 !important;
    box-shadow: 12px 12px 0px #000 !important; padding: 30px !important;
    width: 100% !important; max-width: 380px !important; text-align: center !important;
  }

  .brutal-title-box {
    background: #A3E635 !important; border: 4px solid #000 !important;
    padding: 15px !important; transform: rotate(-2deg) !important; margin-bottom: 30px !important;
  }
  .brutal-logo { font-family: 'Unbounded' !important; font-weight: 900 !important; font-size: 1.8rem !important; line-height: 1 !important; }
  .brutal-logo span { display: block !important; font-size: 1.4rem !important; text-decoration: underline !important; }

  .brutal-label { font-weight: 800 !important; margin-bottom: 15px !important; font-size: 0.9rem !important; text-transform: uppercase !important; }

  /* Кнопки выбора уровней */
  .brutal-grid { display: flex !important; flex-direction: column !important; gap: 15px !important; }
  .brutal-card-btn {
    padding: 18px !important; font-family: 'Unbounded' !important; font-weight: 900 !important;
    font-size: 1.2rem !important; border: 4px solid #000 !important; cursor: pointer !important;
    transition: 0.1s !important; box-shadow: 6px 6px 0px #000 !important;
  }
  .brutal-card-btn:active { transform: translate(3px, 3px) !important; box-shadow: 0px 0px 0px #000 !important; }
  
  .soft { background-color: #60A5FA !important; }
  .party { background-color: #F472B6 !important; }
  .spicy { background-color: #F87171 !important; }

  /* Игроки */
  .brutal-h2 { font-family: 'Unbounded' !important; font-size: 1.2rem !important; margin-bottom: 20px !important; }
  .brutal-input-group { display: flex !important; gap: 10px !important; margin-bottom: 20px !important; }
  .brutal-input {
    flex: 1 !important; border: 3px solid #000 !important; padding: 12px !important;
    font-weight: 700 !important; font-size: 1rem !important; outline: none !important;
  }
  .brutal-add-btn {
    background: #000 !important; color: #fff !important; border: none !important;
    padding: 0 20px !important; font-size: 24px !important; font-weight: 900 !important; cursor: pointer !important;
  }

  .brutal-player-list { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; justify-content: center !important; margin-bottom: 25px !important; }
  .brutal-chip {
    background: #fff !important; border: 2px solid #000 !important; padding: 5px 12px !important;
    font-weight: 800 !important; font-size: 0.8rem !important; box-shadow: 3px 3px 0px #000 !important;
  }
  .brutal-del { color: #EF4444 !important; margin-left: 8px !important; cursor: pointer !important; }

  /* Экран игры */
  .brutal-game-box { width: 100% !important; max-width: 400px !important; }
  .brutal-turn { 
    font-family: 'Unbounded' !important; background: #000 !important; color: #fff !important;
    display: inline-block !important; padding: 5px 15px !important; margin-bottom: 15px !important;
    font-size: 0.8rem !important;
  }
  .brutal-turn mark { background: #A3E635 !important; padding: 0 5px !important; }

  .brutal-main-card {
    background: #fff !important; border: 5px solid #000 !important;
    box-shadow: 15px 15px 0px #000 !important; min-height: 320px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 30px !important; margin-bottom: 40px !important; position: relative !important;
  }
  .brutal-question {
    font-family: 'Unbounded' !important; font-size: 1.6rem !important;
    line-height: 1.3 !important; font-weight: 900 !important; text-align: center !important;
  }

  /* Кнопки управления */
  .brutal-actions { display: grid !important; grid-template-columns: 1fr 2fr !important; gap: 15px !important; }
  .brutal-btn {
    padding: 15px !important; font-family: 'Unbounded' !important; font-weight: 900 !important;
    border: 4px solid #000 !important; cursor: pointer !important; font-size: 1rem !important;
  }
  .brutal-btn.primary { background: #A3E635 !important; box-shadow: 6px 6px 0px #000 !important; }
  .brutal-btn.secondary { background: #fff !important; box-shadow: 6px 6px 0px #000 !important; }
  .brutal-btn:active { transform: translate(3px, 3px) !important; box-shadow: 0px 0px 0px #000 !important; }

  .fade-in { animation: fIn 0.3s ease-out !important; }
  @keyframes fIn { from { opacity: 0; transform: scale(0.9) rotate(1deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
`;

export default NeverHaveIEver;

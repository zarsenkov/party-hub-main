import React, { useState, useEffect, useRef } from 'react';
import { WHO_AM_I_CATEGORIES } from './whoAmI_data';

// // Компонент игры "Кто я?" в стиле "Поп-арт Комиксы"
const WhoAmIGame = () => {
  const [screen, setScreen] = useState('setup'); // // setup, deal, play
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // // 60 секунд на персонажа
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const characterDisplayRef = useRef(null); // // Для анимации угадывания

  // // Ссылка на главную
  const goHome = () => window.location.href = 'https://lovecouple.ru';

  // // Подготовка персонажей из выбранных категорий
  const prepareGame = () => {
    if (selectedCategories.length === 0) return;

    let allCharacters = [];
    selectedCategories.forEach(catId => {
      const category = WHO_AM_I_CATEGORIES.find(c => c.id === catId);
      if (category) {
        allCharacters = allCharacters.concat(category.characters);
      }
    });

    // // Перемешиваем персонажей
    setCharacterList(allCharacters.sort(() => Math.random() - 0.5));
    setCurrentCharacterIndex(0);
    setScore(0);
    setTimeLeft(60); // // Сброс таймера для первого персонажа
    setScreen('play');
    setIsTimerRunning(true);
  };

  // // Логика таймера
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleSkip(); // // Если время вышло, пропускаем персонажа
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  // // Переключение категорий
  const toggleCategory = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // // Обработка угадывания
  const handleGuess = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      // // Анимация "POW!"
      if (characterDisplayRef.current) {
        characterDisplayRef.current.classList.add('animate-pow');
        setTimeout(() => {
          characterDisplayRef.current.classList.remove('animate-pow');
          nextCharacter();
        }, 500); // // Длительность анимации
      }
    } else {
      nextCharacter();
    }
  };

  // // Переход к следующему персонажу
  const nextCharacter = () => {
    if (currentCharacterIndex < characterList.length - 1) {
      setCurrentCharacterIndex(prev => prev + 1);
      setTimeLeft(60); // // Сброс таймера для нового персонажа
    } else {
      setScreen('setup'); // // Игра окончена, возвращаемся к настройкам
      setIsTimerRunning(false);
    }
  };

  // // Обработка пропуска
  const handleSkip = () => {
    nextCharacter();
  };

  // // Текущий персонаж
  const currentCharacter = characterList[currentCharacterIndex];

  return (
    <div className="popart-root">
      <style>{popartStyles}</style>

      <button className="comic-btn btn-back" onClick={goHome}>← МЕНЮ</button>

      {/* ЭКРАН 1: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="comic-panel setup-panel fade-in">
          <h1 className="comic-title">КТО Я?!</h1>
          <p className="subtitle">ВЫБЕРИТЕ КАТЕГОРИИ</p>

          <div className="category-grid">
            {WHO_AM_I_CATEGORIES.map(category => (
              <button 
                key={category.id} 
                className={`category-tag ${selectedCategories.includes(category.id) ? 'active' : ''}`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button 
            className="comic-btn play-btn" 
            onClick={prepareGame} 
            disabled={selectedCategories.length === 0}
          >
            НАЧАТЬ ИГРУ!
          </button>
        </div>
      )}

      {/* ЭКРАН 2: ИГРА */}
      {screen === 'play' && (
        <div className="comic-panel play-panel fade-in">
          <div className="score-display">СЧЕТ: {score}</div>
          <div className="timer-comic">{timeLeft}</div>

          <div ref={characterDisplayRef} className="character-display">
            <span className="who-am-i-text">Я...</span>
            <div className="character-name">{currentCharacter}</div>
            <div className="pow-effect">POW!</div>
          </div>

          <div className="action-buttons">
            <button className="comic-btn skip-btn" onClick={() => handleGuess(false)}>ПРОПУСТИТЬ</button>
            <button className="comic-btn guess-btn" onClick={() => handleGuess(true)}>УГАДАЛ!</button>
          </div>
        </div>
      )}
    </div>
  );
};

const popartStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Press+Start+2P&family=Inter:wght@700;900&display=swap');

  .popart-root {
    position: fixed; inset: 0; width: 100vw; height: 100vh;
    background: #FFD700; /* Ярко-желтый фон */
    background-image: radial-gradient(#FFDD33 10%, #FFD700 30%, #FFCC00 100%);
    font-family: 'Inter', sans-serif;
    color: #333; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .comic-btn {
    background: #E60023; /* Красный акцент */
    color: white; border: 4px solid #000;
    padding: 15px 25px; font-family: 'Bangers', cursive;
    font-size: 1.2rem; text-transform: uppercase;
    box-shadow: 8px 8px 0 #000; /* Жирная тень */
    cursor: pointer; position: relative;
    transition: all 0.1s ease-out;
    letter-spacing: 1px;
  }
  .comic-btn:active {
    top: 4px; left: 4px; box-shadow: 4px 4px 0 #000;
  }
  .comic-btn.btn-back {
    position: absolute; top: 20px; left: 20px;
    background: #000; color: #FFD700; font-family: 'Inter', sans-serif;
    font-size: 0.8rem; box-shadow: none; padding: 10px 15px; border-radius: 5px;
  }

  /* Комиксные панели */
  .comic-panel {
    background: #FFF; border: 6px solid #000;
    width: 90%; max-width: 400px;
    padding: 40px 25px; text-align: center;
    box-shadow: 15px 15px 0 #000; /* Основная тень панели */
    position: relative;
  }
  .comic-panel::before { /* Декоративный уголок */
    content: ''; position: absolute; bottom: -15px; right: -15px;
    width: 30px; height: 30px; background: #E60023; border: 6px solid #000;
    transform: rotate(45deg);
  }

  /* Настройки */
  .comic-title {
    font-family: 'Bangers', cursive; font-size: 3rem; color: #E60023;
    -webkit-text-stroke: 2px #000; color: #FFF; /* Обводка текста */
    line-height: 1; margin-bottom: 20px;
  }
  .subtitle { font-family: 'Press Start 2P', cursive; font-size: 0.8rem; margin-bottom: 30px; }

  .category-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px;
  }
  .category-tag {
    background: #F0F0F0; border: 3px solid #000; padding: 12px 15px;
    font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 700;
    box-shadow: 5px 5px 0 #000; cursor: pointer;
    transition: all 0.1s ease-out;
  }
  .category-tag.active {
    background: #00BFFF; /* Ярко-синий */
    color: white; box-shadow: 5px 5px 0 #000;
  }
  .category-tag:active { top: 3px; left: 3px; box-shadow: 2px 2px 0 #000; }

  .play-btn { background: #00BFFF; box-shadow: 8px 8px 0 #000; margin-top: 20px; }
  .play-btn:disabled { 
    background: #CCC; border-color: #999; box-shadow: 8px 8px 0 #999; cursor: not-allowed; 
  }
  .play-btn:disabled:active { top: 0; left: 0; box-shadow: 8px 8px 0 #999; }

  /* Экран игры */
  .score-display { 
    position: absolute; top: 15px; left: 15px; background: #000; 
    color: #FFD700; padding: 5px 10px; font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem; border: 2px solid #000; /* Добавляем рамку для стиля */
  }
  .timer-comic {
    font-family: 'Bangers', cursive; font-size: 4rem; color: #E60023;
    -webkit-text-stroke: 2px #000; color: #FFF;
    margin-bottom: 30px;
  }

  .character-display {
    background: #F0F0F0; border: 4px solid #000;
    padding: 30px 20px; min-height: 200px;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    margin-bottom: 40px; position: relative;
  }
  .character-display .who-am-i-text {
    font-family: 'Press Start 2P', cursive; font-size: 1rem; color: #888;
    position: absolute; top: 15px; left: 15px;
  }
  .character-name {
    font-family: 'Bangers', cursive; font-size: 3rem; color: #E60023;
    -webkit-text-stroke: 1.5px #000; color: #FFF;
    text-align: center; line-height: 1.2;
  }

  .action-buttons {
    display: flex; justify-content: space-between; gap: 20px;
  }
  .skip-btn { background: #555; box-shadow: 8px 8px 0 #333; }
  .skip-btn:active { top: 4px; left: 4px; box-shadow: 4px 4px 0 #333; }
  .guess-btn { background: #00BFFF; box-shadow: 8px 8px 0 #000; }
  .guess-btn:active { top: 4px; left: 4px; box-shadow: 4px 4px 0 #000; }

  /* Анимация POW! */
  .pow-effect {
    font-family: 'Bangers', cursive;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0);
    font-size: 5rem;
    color: #FFD700;
    -webkit-text-stroke: 4px #E60023;
    opacity: 0;
    pointer-events: none;
  }
  .animate-pow .pow-effect {
    animation: powBlast 0.5s ease-out forwards;
  }
  @keyframes powBlast {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  }


  /* Анимация появления */
  .fade-in { animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default WhoAmIGame;

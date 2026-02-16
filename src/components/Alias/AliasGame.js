import React, { useState, useEffect, useRef } from 'react';
// // 1. ИМПОРТ ВСЕГДА В САМОМ ВЕРХУ (вне компонента)
import { wordBanks, ALIAS_CATEGORIES } from './aliasData';

// // Компонент AliasGame — основной контейнер игры
const AliasGame = ({ onBack }) => {
  // === СОСТОЯНИЕ (STATE) ===
  const [screen, setScreen] = useState('menu'); 
  const [words, setWords] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [score, setScore] = useState(0); 
  const [log, setLog] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isRunning, setIsRunning] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('all'); // // Храним ID выбранной категории
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 

  // // Настройки
  const [teamName, setTeamName] = useState('Команда 1');
  const [timeInput, setTimeInput] = useState(60);

  const timerRef = useRef(null);

  // === ЭФФЕКТЫ (ТАЙМЕР) ===
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      endGame();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // === НАВИГАЦИЯ ===
  const backToMenu = () => {
    setIsRunning(false);
    setScore(0);
    setLog([]);
    setCurrentIndex(0);
    setIsConfirmModalOpen(false);
    setScreen('menu');
  };

  // === ЛОГИКА ИГРЫ ===
  const startGame = () => {
    // // 1. Выбираем слова на основе категории
    let finalWords = [];
    if (selectedCategory === 'all') {
      finalWords = Object.values(wordBanks).flat();
    } else {
      finalWords = wordBanks[selectedCategory] || [];
    }

    // // 2. Если слов нет (на всякий случай)
    if (finalWords.length === 0) return alert("Слова не найдены!");

    // // 3. Перемешиваем
    const shuffled = [...finalWords].sort(() => Math.random() - 0.5);
    
    // // 4. Запуск
    setWords(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setLog([]);
    setTimeLeft(timeInput);
    setIsRunning(true);
    setScreen('game'); // // Переходим на экран игры
  };

  const handleGuessed = () => {
    if (!isRunning) return;
    const word = words[currentIndex];
    setLog(prev => [...prev, { word, ok: true }]);
    setScore(prev => prev + 1);
    moveToNext();
  };

  const handleSkip = () => {
    if (!isRunning) return;
    const word = words[currentIndex];
    setLog(prev => [...prev, { word, ok: false }]);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex + 1 >= words.length) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const endGame = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setScreen('results');
  };

  return (
    <div id="app" style={{ height: '100%', width: '100%', display: 'flex' }}>
      <style>{`
        /* ... твои стили без изменений ... */
        .container { position: fixed; inset: 0; padding: 16px; display: flex; flex-direction: column; z-index: 1000; color: #fff; overflow: hidden; }
        .container.blue { background: #3FB6FF; }
        .container.pink { background: #FF3D7F; }
        .container.white { background: #fff; color: #000; overflow-y: auto; }
        .btn-main { background: #FFD32D; color: #000; padding: 18px; border: 4px solid #000; border-radius: 16px; font-weight: 900; font-size: 1.2rem; box-shadow: 8px 8px 0 #000; cursor: pointer; width: 100%; }
        .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .cat-card { background: #fff; border: 3px solid #000; padding: 15px; border-radius: 15px; cursor: pointer; text-align: center; color: #000; transition: 0.2s; }
        .cat-card.active { transform: translate(3px, 3px); box-shadow: none ! contention; }
      `}</style>

      {/* ЭКРАН 1: МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={onBack}>← ВЫХОД</button>
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <button className="btn-main" onClick={() => setScreen('setup')}>ИГРАТЬ 🚀</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: НАСТРОЙКИ И ВЫБОР КАТЕГОРИИ */}
      {screen === 'setup' && (
        <div className="container pink" style={{ overflowY: 'auto' }}>
          <button className="btn-back-home" onClick={() => setScreen('menu')}>← НАЗАД</button>
          
          <h2 style={{ fontWeight: 900, marginBottom: '15px' }}>1. ВЫБЕРИ ТЕМУ:</h2>
          <div className="category-grid">
            {ALIAS_CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                className="cat-card"
                onClick={() => setSelectedCategory(cat.id)}
                style={{ 
                  background: selectedCategory === cat.id ? cat.color : '#fff',
                  boxShadow: selectedCategory === cat.id ? 'none' : '4px 4px 0 #000',
                  transform: selectedCategory === cat.id ? 'translate(2px, 2px)' : 'none'
                }}
              >
                <div style={{ fontSize: '24px' }}>{cat.icon}</div>
                <div style={{ fontWeight: 900, fontSize: '12px' }}>{cat.title}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontWeight: 900, marginBottom: '15px' }}>2. НАСТРОЙКИ:</h2>
          <div style={{ background: '#fff', color: '#000', borderRadius: '16px', padding: '16px', border: '4px solid #000' }}>
             <label style={{ display: 'block', fontWeight: 900, marginBottom: '5px' }}>ВРЕМЯ (СЕК)</label>
             <input 
               type="number" 
               className="setting-input" 
               value={timeInput} 
               onChange={e => setTimeInput(Number(e.target.value))} 
             />
          </div>

          <button className="btn-main" style={{ marginTop: '20px' }} onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ЭКРАН 3: ИГРА */}
      {screen === 'game' && (
        <div className="container pink">
           {/* Твой существующий код экрана игры */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <div className={`pill timer ${timeLeft <= 10 ? 'warning' : ''}`}>⏱️ {timeLeft}</div>
             <div className="pill score">ОЧКИ: {score}</div>
             <button className="btn-menu" onClick={() => setIsConfirmModalOpen(true)}>МЕНЮ</button>
           </div>
           <div className="card">
             <div className="card-label">ОБЪЯСНИ:</div>
             <div className="word-display">{words[currentIndex]}</div>
           </div>
           <div className="btn-grid">
             <button className="btn-action btn-skip" onClick={handleSkip}>✕</button>
             <button className="btn-action btn-guess" onClick={handleGuessed}>✓</button>
           </div>
        </div>
      )}

      {/* ЭКРАН 4: РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="container white">
           <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '2rem' }}>ИТОГ: {score}</h2>
           <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0', border: '4px solid #000', borderRadius: '15px' }}>
              {log.map((item, idx) => (
                <div key={idx} className="log-item">
                  <span>{item.word}</span>
                  <span className={item.ok ? 'log-success' : 'log-fail'}>{item.ok ? '✓' : '✕'}</span>
                </div>
              ))}
           </div>
           <button className="btn-main" onClick={backToMenu}>К МЕНЮ</button>
        </div>
      )}

      {/* МОДАЛКА (без изменений) */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '5px solid #000', color: '#000', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 900 }}>ВЫЙТИ?</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-main" style={{ background: '#ff5c5c' }} onClick={backToMenu}>ДА</button>
              <button className="btn-main" onClick={() => setIsConfirmModalOpen(false)}>НЕТ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

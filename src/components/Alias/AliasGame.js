import React, { useState, useEffect, useRef } from 'react';
// // Импорт данных из внешнего файла
import { wordBanks, ALIAS_CATEGORIES } from './aliasData';

const AliasGame = ({ onBack }) => {
  // === СОСТОЯНИЕ (STATE) ===
  const [screen, setScreen] = useState('menu'); 
  const [words, setWords] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [score, setScore] = useState(0); 
  const [log, setLog] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isRunning, setIsRunning] = useState(false); 
  const [selectedCategories, setSelectedCategories] = useState(new Set()); 
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
  
  // // Настройки
  const [roundsInput, setRoundsInput] = useState(10);
  const [timeInput, setTimeInput] = useState(60);
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [showWordsGroup, setShowWordsGroup] = useState(false);

  const timerRef = useRef(null);

  // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
  // // Виброотклик
  const triggerHaptic = (type = 'light') => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(type === 'heavy' ? [50, 30, 50] : 30);
    }
  };

  // // Таймер
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      endGame();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // === НАВИГАЦИЯ ===
  const backToMenu = () => {
    setIsRunning(false);
    setIsConfirmModalOpen(false);
    setScreen('menu');
  };

  const toggleCategory = (id) => {
    triggerHaptic();
    const newCats = new Set(selectedCategories);
    if (newCats.has(id)) newCats.delete(id);
    else newCats.add(id);
    setSelectedCategories(newCats);
  };

  // === ЛОГИКА ИГРЫ ===
  const startGame = () => {
    let finalWords = [];
    if (showWordsGroup) {
      finalWords = customWordsInput.split(',').map(s => s.trim()).filter(s => s !== "");
    } else {
      selectedCategories.forEach(cat => {
        finalWords = [...finalWords, ...wordBanks[cat]];
      });
    }

    if (finalWords.length === 0) return alert("Выберите категорию или введите слова!");

    setWords([...finalWords].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setLog([]);
    setTimeLeft(timeInput);
    setIsRunning(true);
    setScreen('game');
  };

  const handleAction = (isGuessed) => {
    if (!isRunning) return;
    triggerHaptic(isGuessed ? 'light' : 'heavy');
    const word = words[currentIndex];
    setLog(prev => [...prev, { word, ok: isGuessed }]);
    if (isGuessed) setScore(s => s + 1);
    
    if (currentIndex + 1 >= roundsInput || currentIndex + 1 >= words.length) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // // Функция смены статуса слова в логе (Работа над ошибками)
  const toggleLogStatus = (index) => {
    const newLog = [...log];
    const item = newLog[index];
    item.ok = !item.ok;
    setLog(newLog);
    setScore(prev => item.ok ? prev + 1 : prev - 1);
    triggerHaptic();
  };

  const endGame = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setScreen('results');
  };

  return (
    <div id="app" style={{ height: '100%', width: '100%', display: 'flex' }}>
      <style>{`
        .container { position: fixed; inset: 0; padding: 16px; display: flex; flex-direction: column; z-index: 1000; transition: filter 0.3s; }
        .blur { filter: blur(10px) grayscale(0.5); pointer-events: none; }
        .blue { background: #3FB6FF; }
        .pink { background: #FF3D7F; }
        .white { background: #fff; color: #000; overflow-y: auto; }
        
        /* Кнопки плитки */
        .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
        .cat-item { 
          background: #fff; border: 3px solid #000; border-radius: 16px; padding: 16px; 
          text-align: center; cursor: pointer; box-shadow: 4px 4px 0 #000; transition: 0.1s;
        }
        .cat-item:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0 #000; }
        .cat-item.selected { transform: translate(2px, 2px); box-shadow: none; border-color: #000; }

        /* Анимация таймера */
        .timer-anim { animation: ${timeLeft <= 10 ? 'pulse 0.6s infinite' : 'none'}; transform: scale(${timeLeft <= 10 ? 1.1 : 1}); transition: 0.3s; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        .btn-main { background: #FFD32D; color: #000; padding: 18px; border: 4px solid #000; border-radius: 16px; font-weight: 900; box-shadow: 6px 6px 0 #000; cursor: pointer; width: 100%; text-transform: uppercase; }
        .btn-main:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
      `}</style>

      {/* ЭКРАН 1: МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={onBack}>← ВЫХОД</button>
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <button className="btn-main" onClick={() => setScreen('source')}>ИГРАТЬ 🚀</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ВЫБОР ИСТОЧНИКА */}
      {screen === 'source' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen('menu')}>← НАЗАД</button>
          <div className="source-grid">
            <button className="btn-source" onClick={() => setScreen('bank')}>📚 БАНК СЛОВ</button>
            <button className="btn-source" onClick={() => { setShowWordsGroup(true); setScreen('setup'); }}>✏️ СВОИ СЛОВА</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ПЛИТКА КАТЕГОРИЙ */}
      {screen === 'bank' && (
        <div className="container blue">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn-back-home" onClick={() => setScreen('source')}>← НАЗАД</button>
            <h2 style={{ fontWeight: 900, color: '#fff' }}>ТЕМЫ</h2>
          </div>
          <div className="cat-grid" style={{ overflowY: 'auto' }}>
            {ALIAS_CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                className={`cat-item ${selectedCategories.has(cat.id) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat.id)}
                style={{ background: selectedCategories.has(cat.id) ? cat.color : '#fff' }}
              >
                <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 900, fontSize: '0.7rem' }}>{cat.title}</div>
              </div>
            ))}
          </div>
          {selectedCategories.size > 0 && (
            <button className="btn-main" onClick={() => { setShowWordsGroup(false); setScreen('setup'); }}>ДАЛЕЕ →</button>
          )}
        </div>
      )}

      {/* ЭКРАН 4: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen(showWordsGroup ? 'source' : 'bank')}>← НАЗАД</button>
          <div style={{ background: '#fff', padding: '20px', border: '4px solid #000', borderRadius: '20px' }}>
            <label style={{ color: '#000', fontWeight: 900 }}>⏱️ ВРЕМЯ: {timeInput}с</label>
            <input type="range" min="10" max="120" step="10" style={{ width: '100%', margin: '15px 0' }} value={timeInput} onChange={e => setTimeInput(Number(e.target.value))} />
            
            <label style={{ color: '#000', fontWeight: 900 }}>🔢 СЛОВ: {roundsInput}</label>
            <input type="range" min="5" max="50" step="5" style={{ width: '100%', margin: '15px 0' }} value={roundsInput} onChange={e => setRoundsInput(Number(e.target.value))} />
            
            {showWordsGroup && (
              <textarea 
                className="setting-input" 
                placeholder="Введите слова через запятую..." 
                value={customWordsInput} 
                onChange={e => setCustomWordsInput(e.target.value)}
                style={{ height: '100px', marginTop: '10px' }}
              />
            )}
          </div>
          <button className="btn-main" style={{ marginTop: '20px' }} onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ЭКРАН 5: ИГРА (с блюром при паузе) */}
      {screen === 'game' && (
        <div className={`container pink ${isConfirmModalOpen ? 'blur' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={`pill timer timer-anim ${timeLeft <= 10 ? 'warning' : ''}`}>⏱️ {timeLeft}</div>
            <div className="pill score">СЧЕТ: {score}</div>
            <button className="btn-menu" onClick={() => { setIsConfirmModalOpen(true); triggerHaptic(); }}>ПАУЗА</button>
          </div>
          <div className="card">
             <div className="card-label">ОБЪЯСНИ:</div>
             <div className="word-display">{words[currentIndex]}</div>
          </div>
          <div className="btn-grid">
            <button className="btn-action btn-skip" onClick={() => handleAction(false)}>✕</button>
            <button className="btn-action btn-guess" onClick={() => handleAction(true)}>✓</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 6: РЕЗУЛЬТАТЫ (с правкой ошибок) */}
      {screen === 'results' && (
        <div className="container white">
          <h2 style={{ textAlign: 'center', fontWeight: 950, fontSize: '2rem' }}>ИТОГ: {score}</h2>
          <p style={{ textAlign: 'center', fontSize: '12px', marginBottom: '10px' }}>Нажми на значок, если ошибся при подсчете</p>
          <div style={{ flex: 1, border: '4px solid #000', borderRadius: '16px', overflowY: 'auto', marginBottom: '16px' }}>
            {log.map((item, idx) => (
              <div key={idx} className="log-item" onClick={() => toggleLogStatus(idx)} style={{ cursor: 'pointer' }}>
                <span>{item.word}</span>
                <span className={item.ok ? 'log-success' : 'log-fail'} style={{ fontSize: '1.5rem' }}>
                  {item.ok ? '✓' : '✕'}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-main" onClick={backToMenu}>В МЕНЮ</button>
        </div>
      )}

      {/* МОДАЛКА ПАУЗЫ */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ background: '#fff', border: '6px solid #000', borderRadius: '24px', padding: '30px', textAlign: 'center', color: '#000' }}>
            <h2 style={{ fontWeight: 900 }}>ПАУЗА</h2>
            <p style={{ margin: '15px 0' }}>Продолжим игру или выйдем?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-main" style={{ background: '#58E08E' }} onClick={() => setIsConfirmModalOpen(false)}>ИГРАТЬ</button>
              <button className="btn-main" style={{ background: '#FF5C5C' }} onClick={backToMenu}>ВЫЙТИ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

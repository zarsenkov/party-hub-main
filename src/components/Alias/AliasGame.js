import React, { useState, useEffect, useRef } from 'react';
// // Импорт данных из внешнего файла
import { wordBanks } from './aliasData';

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
  const [roundsInput, setRoundsInput] = useState(5);
  const [timeInput, setTimeInput] = useState(60);
  const [customWordsInput, setCustomWordsInput] = useState('Кот,Дом,Любовь,Музыка,Звезда,Танец,Радость,Река,Гора,Книга,Цветок,Небо,Огонь,Вода,Луна,Солнце,Ветер,Дерево,Птица,Рыба');
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
  const goToHome = () => onBack ? onBack() : window.location.href = 'https://lovecouple.ru';

  const backToMenu = () => {
    setIsRunning(false);
    setScore(0);
    setLog([]);
    setCurrentIndex(0);
    setWords([]);
    setSelectedCategories(new Set());
    setIsConfirmModalOpen(false);
    setScreen('menu');
  };

  const backToSource = () => {
    setIsRunning(false);
    setSelectedCategories(new Set());
    setScreen('source');
  };

  const chooseBank = () => { setWords([]); setSelectedCategories(new Set()); setScreen('bank'); };
  const chooseCustom = () => { setWords([]); setShowWordsGroup(true); setScreen('setup'); };

  const toggleCategory = (categoryKey) => {
    triggerHaptic();
    const newCats = new Set(selectedCategories);
    if (newCats.has(categoryKey)) newCats.delete(categoryKey);
    else newCats.add(categoryKey);
    setSelectedCategories(newCats);
  };

  const nextAfterCategories = () => {
    let combined = [];
    selectedCategories.forEach(cat => { combined = [...combined, ...wordBanks[cat]]; });
    setWords(combined);
    setShowWordsGroup(false);
    setScreen('setup');
  };

  // === ЛОГИКА ИГРЫ ===
  const startGame = () => {
    let finalWords = showWordsGroup 
      ? customWordsInput.split(',').map(s => s.trim()).filter(s => s !== "")
      : words;
    
    if (finalWords.length === 0) return alert("Слова не выбраны!");

    setWords([...finalWords].sort(() => Math.random() - 0.5));
    setTimeLeft(timeInput);
    setScore(0);
    setLog([]);
    setCurrentIndex(0);
    setIsRunning(true);
    setScreen('game');
  };

  const handleGuessed = () => {
    if (!isRunning) return;
    triggerHaptic('light');
    setLog(prev => [...prev, { word: words[currentIndex], ok: true }]);
    setScore(prev => prev + 1);
    moveToNext();
  };

  const handleSkip = () => {
    if (!isRunning) return;
    triggerHaptic('heavy');
    setLog(prev => [...prev, { word: words[currentIndex], ok: false }]);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex + 1 >= roundsInput || currentIndex + 1 >= words.length) endGame();
    else setCurrentIndex(prev => prev + 1);
  };

  const toggleLogStatus = (idx) => {
    const newLog = [...log];
    newLog[idx].ok = !newLog[idx].ok;
    setLog(newLog);
    setScore(prev => newLog[idx].ok ? prev + 1 : prev - 1);
    triggerHaptic();
  };

  const endGame = () => { clearInterval(timerRef.current); setIsRunning(false); setScreen('results'); };

  return (
    <div id="app" style={{ height: '100%', width: '100%', display: 'flex' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden; height: 100%; width: 100%; }
        
        /* ГЛАВНЫЙ КОНТЕЙНЕР — теперь всегда центрирует содержимое */
        .container { 
          position: fixed; inset: 0; padding: 16px; 
          display: flex; flex-direction: column; 
          align-items: center; justify-content: center; /* Центрирование */
          z-index: 1000; color: #fff; overflow: hidden; transition: filter 0.3s; 
        }
        .container.blue { background: #3FB6FF; }
        .container.pink { background: #FF3D7F; }
        .container.white { background: #fff; color: #000; overflow-y: auto; justify-content: flex-start; } /* Итоги скроллятся сверху */

        .blur-effect { filter: blur(10px); pointer-events: none; }

        .btn-back-home { position: absolute; top: 16px; left: 16px; background: #000; color: #fff; border: none; padding: 10px 15px; border-radius: 10px; font-weight: bold; font-size: 12px; cursor: pointer; z-index: 10; }
        
        .menu-content { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; }
        
        .menu-title { background: #fff; padding: 12px 24px; border: 6px solid #000; box-shadow: 8px 8px 0 #000; transform: rotate(-3deg); margin-bottom: 24px; }
        .menu-title h1 { font-size: 3rem; font-weight: 950; color: #000; line-height: 1; }

        .source-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 300px; }
        
        .btn-main { background: #FFD32D; color: #000; padding: 18px; border: 4px solid #000; border-radius: 16px; font-weight: 900; font-size: 1.2rem; box-shadow: 8px 8px 0 #000; cursor: pointer; width: 100%; max-width: 300px; }
        .btn-main:active { transform: translate(3px, 3px); box-shadow: 0px 0px 0 #000; }

        .btn-source { background: #fff; border: 6px solid #000; border-radius: 16px; padding: 24px 16px; cursor: pointer; box-shadow: 8px 8px 0 #000; display: flex; flex-direction: column; align-items: center; color: #000; font-weight: 900; text-transform: uppercase; width: 100%; }

        .btn-category { background: #fff; border: 4px solid #000; border-radius: 12px; padding: 12px 14px; font-weight: 700; color: #000; cursor: pointer; text-align: left; box-shadow: 4px 4px 0 #000; width: 100%; margin-bottom: 12px; }
        .btn-category.selected { background: #58E08E; }

        .pill { border: 4px solid #000; padding: 10px 15px; border-radius: 50px; font-weight: 900; box-shadow: 4px 4px 0 #000; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .pill.timer { background: #3FB6FF; color: #fff; }
        .pill.timer.warning { background: #FF5C5C; animation: pulse 0.6s infinite; }
        .pill.score { background: #FFD32D; color: #000; }
        
        .card { background: #fff; border: 6px solid #000; border-radius: 24px; padding: 28px 16px; text-align: center; margin: 16px 0; box-shadow: 10px 10px 0 #000; width: 100%; max-width: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; position: relative; min-height: 200px; }
        .card-label { position: absolute; top: -16px; left: 16px; background: #FFD32D; border: 3px solid #000; padding: 4px 12px; font-weight: 900; color: #000; font-size: 11px; }
        .word-display { font-size: 2.2rem; font-weight: 900; text-transform: uppercase; line-height: 1.1; word-break: break-word; }

        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 340px; }
        .btn-action { border: 4px solid #000; padding: 20px; border-radius: 16px; box-shadow: 6px 6px 0 #000; cursor: pointer; font-weight: 900; font-size: 1.5rem; transition: 0.1s; }
        .btn-action:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0 #000; }
        .btn-skip { background: #FF5C5C; color: #fff; }
        .btn-guess { background: #58E08E; color: #fff; }

        .setting-input { width: 100%; padding: 12px; background: #F5F5F5; border: 3px solid #000; border-radius: 10px; font-weight: 600; font-size: 16px; }
        .log-item { padding: 12px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; font-weight: 800; text-transform: uppercase; width: 100%; }
        
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>

      {/* ЭКРАН 1: МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={goToHome}>← ВЫХОД</button>
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <p style={{ fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ!</p>
            <button className="btn-main" onClick={() => setScreen('source')}>ПОЕХАЛИ! 🚀</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ВЫБОР ИСТОЧНИКА */}
      {screen === 'source' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={backToMenu}>← НАЗАД</button>
          <div className="source-grid">
            <button className="btn-source" onClick={chooseBank}>📚 БАНК СЛОВ</button>
            <button className="btn-source" onClick={chooseCustom}>✏️ СВОИ СЛОВА</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 3: КАТЕГОРИИ */}
      {screen === 'bank' && (
        <div className="container blue" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
          <button className="btn-back-home" onClick={backToSource}>← НАЗАД</button>
          <div style={{ width: '100%', maxWidth: '320px', overflowY: 'auto', paddingBottom: '20px' }}>
            {Object.keys(wordBanks).map(cat => (
              <button key={cat} className={`btn-category ${selectedCategories.has(cat) ? 'selected' : ''}`} onClick={() => toggleCategory(cat)}>
                {cat === 'animals' ? '🐾 Животные' : cat === 'food' ? '🍕 Еда' : cat === 'movies' ? '🎬 Фильмы' : cat === 'sports' ? '⚽ Спорт' : cat === 'professions' ? '👔 Профессии' : cat === 'countries' ? '🌍 Страны' : '🎯 Микс'}
              </button>
            ))}
            {selectedCategories.size > 0 && <button className="btn-main" style={{ marginTop: '10px' }} onClick={nextAfterCategories}>ДАЛЕЕ →</button>}
          </div>
        </div>
      )}

      {/* ЭКРАН 4: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen(showWordsGroup ? 'source' : 'bank')}>← НАЗАД</button>
          <div style={{ background: '#fff', color: '#000', borderRadius: '16px', padding: '20px', border: '4px solid #000', boxShadow: '8px 8px 0 #000', width: '100%', maxWidth: '320px' }}>
            <label style={{ display: 'block', fontWeight: 900, fontSize: '12px', marginBottom: '5px' }}>⏱️ ВРЕМЯ (СЕК)</label>
            <input type="number" className="setting-input" value={timeInput} onChange={e => setTimeInput(Number(e.target.value))} />
            <br/><br/>
            <label style={{ display: 'block', fontWeight: 900, fontSize: '12px', marginBottom: '5px' }}>🔢 СЛОВ В РАУНДЕ</label>
            <input type="number" className="setting-input" value={roundsInput} onChange={e => setRoundsInput(Number(e.target.value))} />
            {showWordsGroup && <><br/><textarea className="setting-input" style={{ height: '80px' }} value={customWordsInput} onChange={e => setCustomWordsInput(e.target.value)} /></>}
          </div>
          <button className="btn-main" style={{ marginTop: '20px' }} onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ЭКРАН 5: ИГРА */}
      {screen === 'game' && (
        <div className={`container pink ${isConfirmModalOpen ? 'blur-effect' : ''}`}>
          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className={`pill timer ${timeLeft <= 10 ? 'warning' : ''}`}>⏱️ {timeLeft}</div>
            <div className="pill score">ОЧКИ: {score}</div>
            <button style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }} onClick={() => setIsConfirmModalOpen(true)}>ПАУЗА</button>
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

      {/* ЭКРАН 6: РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="container white" style={{ paddingTop: '40px' }}>
          <h2 style={{ fontWeight: 950, marginBottom: '20px' }}>ИТОГИ: {score}</h2>
          <div style={{ width: '100%', maxWidth: '340px', border: '4px solid #000', borderRadius: '16px', background: '#F0F0F0', overflowY: 'auto', marginBottom: '20px' }}>
            {log.map((item, idx) => (
              <div key={idx} className="log-item" onClick={() => toggleLogStatus(idx)}>
                <span style={{ maxWidth: '80%' }}>{item.word}</span>
                <span className={item.ok ? 'log-success' : 'log-fail'}>{item.ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
          <button className="btn-main" onClick={backToMenu}>↻ МЕНЮ</button>
        </div>
      )}

      {/* МОДАЛКА ПАУЗЫ */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 2000 }}>
          <div style={{ background: '#fff', border: '6px solid #000', borderRadius: '20px', padding: '24px', boxShadow: '12px 12px 0 #000', maxWidth: '280px', textAlign: 'center', color: '#000' }}>
            <h3 style={{ fontWeight: 900, marginBottom: '20px' }}>ПАУЗА</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button className="btn-main" style={{ background: '#FF5C5C', fontSize: '1rem', padding: '12px' }} onClick={backToMenu}>ВЫЙТИ</button>
              <button className="btn-main" style={{ background: '#58E08E', fontSize: '1rem', padding: '12px' }} onClick={() => setIsConfirmModalOpen(false)}>ИГРАТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

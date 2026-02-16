import React, { useState, useEffect, useRef } from 'react';
// // Импорт данных
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
  
  // // Поля ввода
  const [teamName, setTeamName] = useState('Команда 1');
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
    stopTimer();
    setScore(0);
    setLog([]);
    setCurrentIndex(0);
    setWords([]);
    setSelectedCategories(new Set());
    setIsConfirmModalOpen(false);
    setScreen('menu');
  };

  const backToSource = () => {
    stopTimer();
    setSelectedCategories(new Set());
    setScreen('source');
  };

  const chooseBank = () => { setWords([]); setSelectedCategories(new Set()); setScreen('bank'); };
  const chooseCustom = () => { setWords([]); setShowWordsGroup(true); setScreen('setup'); };

  const toggleCategory = (categoryKey) => {
    const newCats = new Set(selectedCategories);
    if (newCats.has(categoryKey)) newCats.delete(categoryKey);
    else newCats.add(categoryKey);
    setSelectedCategories(newCats);
    triggerHaptic();
  };

  const nextAfterCategories = () => {
    let combined = [];
    selectedCategories.forEach(cat => { combined = [...combined, ...wordBanks[cat]]; });
    setWords(combined);
    setShowWordsGroup(false);
    setScreen('setup');
  };

  // === ЛОГИКА ИГРЫ ===
  const stopTimer = () => { clearInterval(timerRef.current); setIsRunning(false); };

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

  // // Работа над ошибками в результатах
  const toggleLogStatus = (idx) => {
    const newLog = [...log];
    newLog[idx].ok = !newLog[idx].ok;
    setLog(newLog);
    setScore(prev => newLog[idx].ok ? prev + 1 : prev - 1);
    triggerHaptic();
  };

  const endGame = () => { stopTimer(); setScreen('results'); };

  return (
    <div id="app" style={{ height: '100%', width: '100%', display: 'flex' }}>
      <style>{`
        /* Твой оригинальный CSS */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden; height: 100%; width: 100%; }
        .container { position: fixed; inset: 0; padding: 16px; display: flex; flex-direction: column; z-index: 1000; color: #fff; overflow: hidden; transition: filter 0.3s; }
        .container.blue { background: #3FB6FF; }
        .container.pink { background: #FF3D7F; }
        .container.white { background: #fff; color: #000; overflow-y: auto; }
        .blur-effect { filter: blur(10px); pointer-events: none; }
        .btn-back-home { background: #000; color: #fff; border: none; padding: 10px 15px; border-radius: 10px; width: fit-content; font-weight: bold; display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 16px; flex-shrink: 0; }
        .btn-menu { background: #000; color: #fff; border: 3px solid #000; padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 11px; cursor: pointer; text-transform: uppercase; box-shadow: 4px 4px 0 #000; }
        .pill { border: 4px solid #000; padding: 10px 20px; border-radius: 50px; font-weight: 900; box-shadow: 4px 4px 0 #000; display: flex; align-items: center; gap: 8px; }
        .pill.timer { background: #3FB6FF; color: #fff; }
        .pill.timer.warning { background: #FF5C5C; animation: pulse 0.6s infinite; transform: scale(1.1); }
        .pill.score { background: #FFD32D; color: #000; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .card { background: #fff; border: 6px solid #000; border-radius: 24px; padding: 28px 16px; text-align: center; margin: 16px 0; box-shadow: 10px 10px 0 #000; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; position: relative; min-height: 180px; }
        .card-label { position: absolute; top: -16px; left: 16px; background: #FFD32D; border: 3px solid #000; padding: 4px 12px; font-weight: 900; color: #000; font-size: 11px; }
        .word-display { font-size: 2.2rem; font-weight: 900; text-transform: uppercase; line-height: 1.1; word-break: break-word; }
        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px; flex-shrink: 0; }
        .btn-action { border: 4px solid #000; padding: 16px; border-radius: 16px; box-shadow: 6px 6px 0 #000; cursor: pointer; display: flex; justify-content: center; align-items: center; font-weight: 900; font-size: 1.3rem; transition: 0.1s; }
        .btn-action:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0 #000; }
        .btn-skip { background: #FF5C5C; color: #fff; }
        .btn-guess { background: #58E08E; color: #fff; }
        .btn-main { background: #FFD32D; color: #000; padding: 18px; border: 4px solid #000; border-radius: 16px; font-weight: 900; font-size: 1.2rem; box-shadow: 8px 8px 0 #000; cursor: pointer; }
        .btn-main:active { transform: translate(3px, 3px); box-shadow: 0px 0px 0 #000; }
        .btn-source { background: #fff; border: 6px solid #000; border-radius: 16px; padding: 24px 16px; cursor: pointer; box-shadow: 8px 8px 0 #000; display: flex; flex-direction: column; align-items: center; color: #000; font-weight: 900; text-transform: uppercase; }
        .btn-category { background: #fff; border: 4px solid #000; border-radius: 12px; padding: 12px 14px; font-weight: 700; color: #000; cursor: pointer; text-align: left; box-shadow: 4px 4px 0 #000; width: 100%; margin-bottom: 10px; }
        .btn-category.selected { background: #58E08E; font-weight: 900; }
        .setting-input { width: 100%; padding: 10px; background: #F5F5F5; border: 3px solid #000; border-radius: 10px; font-weight: 600; }
        .log-item { padding: 10px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; font-weight: 800; text-transform: uppercase; }
        .log-success { color: #2ecc71; }
        .log-fail { color: #ff4747; }
        @media (min-width: 768px) { .menu-title h1 { font-size: 5rem; } .word-display { font-size: 4rem; } }
      `}</style>

      {/* ЭКРАН 1: МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={goToHome}>← ВЫХОД</button>
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <p style={{ fontWeight: 800, marginBottom: '32px' }}>ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ!</p>
            <button className="btn-main" onClick={() => setScreen('source')}>ПОЕХАЛИ! 🚀</button>
          </div>
        </div>
      )}

      {/* ЭКРАН 2: ИСТОЧНИК */}
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
        <div className="container blue">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button className="btn-back-home" onClick={backToSource}>← НАЗАД</button>
            {selectedCategories.size > 0 && <button className="btn-back-home" onClick={nextAfterCategories}>ДАЛЕЕ →</button>}
          </div>
          <div style={{ overflowY: 'auto' }}>
            {Object.keys(wordBanks).map(cat => (
              <button key={cat} className={`btn-category ${selectedCategories.has(cat) ? 'selected' : ''}`} onClick={() => toggleCategory(cat)}>
                {cat === 'animals' ? '🐾 Животные' : cat === 'food' ? '🍕 Еда' : cat === 'movies' ? '🎬 Фильмы' : cat === 'sports' ? '⚽ Спорт' : cat === 'professions' ? '👔 Профессии' : cat === 'countries' ? '🌍 Страны' : '🎯 Микс'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ЭКРАН 4: НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={backToSource}>← НАЗАД</button>
          <div style={{ background: '#fff', color: '#000', borderRadius: '16px', padding: '16px', border: '4px solid #000', boxShadow: '8px 8px 0 #000' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px' }}>⏱️ ВРЕМЯ (СЕК)</label>
            <input type="number" className="setting-input" value={timeInput} onChange={e => setTimeInput(parseInt(e.target.value))} />
            <br/><br/>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '13px' }}>🔢 СЛОВ В РАУНДЕ</label>
            <input type="number" className="setting-input" value={roundsInput} onChange={e => setRoundsInput(parseInt(e.target.value))} />
            {showWordsGroup && <><br/><textarea className="setting-input" style={{ height: '80px' }} value={customWordsInput} onChange={e => setCustomWordsInput(e.target.value)} /></>}
          </div>
          <button className="btn-main" style={{ width: '100%', marginTop: '16px' }} onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ЭКРАН 5: ИГРА */}
      {screen === 'game' && (
        <div className={`container pink ${isConfirmModalOpen ? 'blur-effect' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className={`pill timer ${timeLeft <= 10 ? 'warning' : ''}`}>⏱️ {timeLeft}</div>
            <div className="pill score">ОЧКИ: {score}</div>
            <button className="btn-menu" onClick={() => setIsConfirmModalOpen(true)}>ПАУЗА</button>
          </div>
          <div className="card">
            <div className="card-label">СЛОВО:</div>
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
        <div className="container white">
          <h2 style={{ textAlign: 'center', fontWeight: 950 }}>ИТОГИ: {score}</h2>
          <div style={{ flex: 1, border: '4px solid #000', borderRadius: '16px', padding: '10px', background: '#F0F0F0', overflowY: 'auto', margin: '16px 0' }}>
            {log.map((item, idx) => (
              <div key={idx} className="log-item" onClick={() => toggleLogStatus(idx)}>
                <span>{item.word}</span>
                <span className={item.ok ? 'log-success' : 'log-fail'}>{item.ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
          <button className="btn-main" style={{ width: '100%' }} onClick={backToMenu}>↻ МЕНЮ</button>
        </div>
      )}

      {/* МОДАЛКА ВЫХОДА */}
      {isConfirmModalOpen && (
        <div className="container white" style={{ alignItems: 'center', justifyContent: 'center', zIndex: 2000, background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#fff', border: '6px solid #000', borderRadius: '20px', padding: '24px', boxShadow: '12px 12px 0 #000', maxWidth: '300px', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 900 }}>ПАУЗА</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
              <button className="btn-main" style={{ background: '#FF5C5C' }} onClick={backToMenu}>ВЫЙТИ</button>
              <button className="btn-main" style={{ background: '#58E08E' }} onClick={() => setIsConfirmModalOpen(false)}>ИГРАТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

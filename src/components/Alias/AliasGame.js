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
  // // Виброотклик (Haptic Feedback)
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

  const toggleCategory = (categoryKey) => {
    triggerHaptic();
    const newCats = new Set(selectedCategories);
    if (newCats.has(categoryKey)) newCats.delete(categoryKey);
    else newCats.add(categoryKey);
    setSelectedCategories(newCats);
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

  const handleAction = (guessed) => {
    if (!isRunning) return;
    triggerHaptic(guessed ? 'light' : 'heavy');
    setLog(prev => [...prev, { word: words[currentIndex], ok: guessed }]);
    if (guessed) setScore(s => s + 1);
    
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
        
        .container { 
          position: fixed; inset: 0; padding: 16px; 
          display: flex; flex-direction: column; 
          align-items: center; justify-content: center;
          z-index: 1000; color: #fff; overflow: hidden; transition: filter 0.3s;
          text-align: center;
        }
        .container.blue { background: #3FB6FF; }
        .container.pink { background: #FF3D7F; }
        .container.white { background: #fff; color: #000; overflow-y: auto; justify-content: flex-start; }

        .blur-effect { filter: blur(10px); pointer-events: none; }

        .btn-back-home { position: absolute; top: 16px; left: 16px; background: #000; color: #fff; border: none; padding: 10px 15px; border-radius: 10px; font-weight: bold; font-size: 12px; cursor: pointer; z-index: 10; }
        
        .menu-title { background: #fff; padding: 12px 24px; border: 6px solid #000; box-shadow: 8px 8px 0 #000; transform: rotate(-3deg); margin-bottom: 24px; display: inline-block; }
        .menu-title h1 { font-size: 3.5rem; font-weight: 950; color: #000; line-height: 1; }

        .btn-main { background: #FFD32D; color: #000; padding: 20px; border: 4px solid #000; border-radius: 16px; font-weight: 900; font-size: 1.3rem; box-shadow: 8px 8px 0 #000; cursor: pointer; width: 90%; max-width: 400px; margin: 0 auto; text-transform: uppercase; }
        .btn-main:active { transform: translate(3px, 3px); box-shadow: 0px 0px 0 #000; }

        .source-grid { display: flex; flex-direction: column; gap: 16px; width: 90%; max-width: 400px; margin: 0 auto; }
        .btn-source { background: #fff; border: 6px solid #000; border-radius: 16px; padding: 24px 16px; cursor: pointer; box-shadow: 8px 8px 0 #000; display: flex; flex-direction: column; align-items: center; color: #000; font-weight: 900; text-transform: uppercase; width: 100%; }

        /* СПИСОК: Поправил высоту и отступы */
        .list-container { 
            width: 90%; 
            max-width: 400px; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            overflow-y: auto; 
            padding: 20px 10px 120px 10px; /* Нижний отступ для кнопки Далее */
            max-height: 75vh; 
        }
        .btn-category { background: #fff; border: 4px solid #000; border-radius: 12px; padding: 16px; font-weight: 700; color: #000; cursor: pointer; box-shadow: 4px 4px 0 #000; width: 100%; margin-bottom: 12px; text-align: left; }
        .btn-category.selected { background: #58E08E; }

        /* Кнопка Далее зафиксирована снизу для удобства */
        .sticky-footer { position: absolute; bottom: 24px; left: 0; right: 0; display: flex; justify-content: center; z-index: 20; }

        .pill { border: 4px solid #000; padding: 10px 18px; border-radius: 50px; font-weight: 900; box-shadow: 4px 4px 0 #000; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .pill.timer.warning { background: #FF5C5C; animation: pulse 0.6s infinite; }
        
        .card { background: #fff; border: 6px solid #000; border-radius: 24px; padding: 32px 20px; margin: 20px auto; box-shadow: 10px 10px 0 #000; width: 90%; max-width: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; position: relative; min-height: 220px; }
        .card-label { position: absolute; top: -16px; left: 20px; background: #FFD32D; border: 3px solid #000; padding: 6px 16px; font-weight: 900; color: #000; font-size: 12px; text-transform: uppercase; }
        .word-display { font-size: 3rem; font-weight: 950; text-transform: uppercase; line-height: 1.1; word-wrap: break-word; }

        .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 90%; max-width: 500px; margin: 0 auto; }
        .btn-action { border: 4px solid #000; padding: 22px; border-radius: 20px; box-shadow: 6px 6px 0 #000; cursor: pointer; font-weight: 900; font-size: 1.8rem; }
        
        .setting-card { background: #fff; color: #000; border: 4px solid #000; border-radius: 16px; padding: 24px; box-shadow: 8px 8px 0 #000; width: 90%; max-width: 400px; margin: 0 auto; text-align: left; }
        .setting-input { width: 100%; padding: 14px; border: 3px solid #000; border-radius: 12px; font-weight: 800; font-size: 18px; margin-top: 8px; background: #F8F9FA; }

        .log-container { width: 90%; max-width: 400px; border: 4px solid #000; border-radius: 20px; background: #F0F0F0; overflow-y: auto; margin: 20px auto; padding: 8px; }
        .log-item { padding: 14px; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; align-items: center; font-weight: 800; text-transform: uppercase; }
        
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>

      {/* МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={goToHome}>← ВЫХОД</button>
          <div className="menu-title"><h1>ALIAS</h1></div>
          <p style={{ fontWeight: 800, marginBottom: '32px', fontSize: '1.1rem' }}>ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ!</p>
          <button className="btn-main" onClick={() => setScreen('source')}>ПОЕХАЛИ! 🚀</button>
        </div>
      )}

      {/* ИСТОЧНИК */}
      {screen === 'source' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={backToMenu}>← НАЗАД</button>
          <div className="source-grid">
            <button className="btn-source" onClick={() => { setWords([]); setScreen('bank'); }}>📚 БАНК СЛОВ</button>
            <button className="btn-source" onClick={() => { setWords([]); setShowWordsGroup(true); setScreen('setup'); }}>✏️ СВОИ СЛОВА</button>
          </div>
        </div>
      )}

      {/* КАТЕГОРИИ */}
      {screen === 'bank' && (
        <div className="container blue" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
          <button className="btn-back-home" onClick={() => setScreen('source')}>← НАЗАД</button>
          <div className="list-container">
            {Object.keys(wordBanks).map(cat => (
              <button key={cat} className={`btn-category ${selectedCategories.has(cat) ? 'selected' : ''}`} onClick={() => toggleCategory(cat)}>
                {cat === 'animals' ? '🐾 Животные' : cat === 'food' ? '🍕 Еда' : cat === 'movies' ? '🎬 Фильмы' : cat === 'sports' ? '⚽ Спорт' : cat === 'professions' ? '👔 Профессии' : cat === 'countries' ? '🌍 Страны' : '🎯 Микс'}
              </button>
            ))}
          </div>
          {selectedCategories.size > 0 && (
            <div className="sticky-footer">
              <button className="btn-main" onClick={() => {
                let combined = [];
                selectedCategories.forEach(cat => { combined = [...combined, ...wordBanks[cat]]; });
                setWords(combined);
                setShowWordsGroup(false);
                setScreen('setup');
              }}>ДАЛЕЕ →</button>
            </div>
          )}
        </div>
      )}

      {/* НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen(showWordsGroup ? 'source' : 'bank')}>← НАЗАД</button>
          <div className="setting-card">
            <label style={{ fontWeight: 900, fontSize: '14px' }}>⏱️ ВРЕМЯ (СЕК)</label>
            <input type="number" className="setting-input" value={timeInput} onChange={e => setTimeInput(Number(e.target.value))} />
            <div style={{ height: '24px' }} />
            <label style={{ fontWeight: 900, fontSize: '14px' }}>🔢 СЛОВ В РАУНДЕ</label>
            <input type="number" className="setting-input" value={roundsInput} onChange={e => setRoundsInput(Number(e.target.value))} />
            {showWordsGroup && <textarea className="setting-input" style={{ height: '100px', marginTop: '15px' }} value={customWordsInput} onChange={e => setCustomWordsInput(e.target.value)} />}
          </div>
          <button className="btn-main" style={{ marginTop: '30px' }} onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ИГРА */}
      {screen === 'game' && (
        <div className={`container pink ${isConfirmModalOpen ? 'blur-effect' : ''}`}>
          <div style={{ width: '90%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className={`pill timer ${timeLeft <= 10 ? 'warning' : ''}`}>⏱️ {timeLeft}</div>
            <div className="pill score">ОЧКИ: {score}</div>
            <button style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 'bold' }} onClick={() => setIsConfirmModalOpen(true)}>ПАУЗА</button>
          </div>
          <div className="card">
            <div className="card-label">ОБЪЯСНИ:</div>
            <div className="word-display">{words[currentIndex]}</div>
          </div>
          <div className="btn-grid">
            <button className="btn-action" style={{ background: '#FF5C5C' }} onClick={() => handleAction(false)}>✕</button>
            <button className="btn-action" style={{ background: '#58E08E' }} onClick={() => handleAction(true)}>✓</button>
          </div>
        </div>
      )}

      {/* ИТОГИ */}
      {screen === 'results' && (
        <div className="container white" style={{ paddingTop: '40px' }}>
          <h2 style={{ fontWeight: 950, fontSize: '2.5rem', marginBottom: '10px' }}>ИТОГИ: {score}</h2>
          <div className="log-container">
            {log.map((item, idx) => (
              <div key={idx} className="log-item" onClick={() => toggleLogStatus(idx)}>
                <span>{item.word}</span>
                <span style={{ color: item.ok ? '#2ecc71' : '#ff4747' }}>{item.ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
          <button className="btn-main" onClick={backToMenu}>↻ МЕНЮ</button>
        </div>
      )}

      {/* ПАУЗА */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
          <div style={{ background: '#fff', border: '6px solid #000', borderRadius: '24px', padding: '30px', width: '85%', maxWidth: '320px', color: '#000', boxShadow: '15px 15px 0 #000' }}>
            <h2 style={{ fontWeight: 950, marginBottom: '25px' }}>ПАУЗА</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button className="btn-main" style={{ background: '#FF5C5C', fontSize: '1rem', padding: '14px', width: '100%', boxShadow: '4px 4px 0 #000' }} onClick={backToMenu}>ВЫЙТИ</button>
              <button className="btn-main" style={{ background: '#58E08E', fontSize: '1rem', padding: '14px', width: '100%', boxShadow: '4px 4px 0 #000' }} onClick={() => setIsConfirmModalOpen(false)}>ИГРАТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

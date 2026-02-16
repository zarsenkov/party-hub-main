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
    
    if (finalWords.length === 0) return alert("Выберите хотя бы одну категорию!");

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
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { 
          font-family: 'Nunito', sans-serif; 
          background-color: #2D3436; 
          overflow: hidden; 
          height: 100%; width: 100%;
        }

        .container {
          position: fixed; inset: 0; padding: 24px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #4834D4; /* Основной глубокий цвет */
          color: #fff;
          text-align: center;
        }

        .bg-menu { background: #686DE0; }
        .bg-setup { background: #EB4D4B; }
        .bg-game { background: #4834D4; }
        .bg-results { background: #F9F9F9; color: #2D3436; }

        /* Кнопка выхода */
        .btn-top-left {
          position: absolute; top: 16px; left: 16px;
          background: rgba(255,255,255,0.2);
          border: none; padding: 10px 18px;
          border-radius: 12px; color: #fff;
          font-weight: 900; font-size: 14px;
          cursor: pointer; z-index: 100;
        }

        /* Заголовок */
        .game-title {
          font-size: 5rem; font-weight: 900;
          color: #FFF; margin-bottom: 20px;
          text-shadow: 0 8px 0 rgba(0,0,0,0.1);
        }

        /* Кнопки "Конфеты" */
        .btn-candy {
          background: #BADC58;
          color: #2D3436;
          border: none;
          padding: 20px 40px;
          border-radius: 24px;
          font-size: 1.5rem;
          font-weight: 900;
          box-shadow: 0 8px 0 #6AB04C;
          cursor: pointer;
          width: 90%; max-width: 320px;
          transition: all 0.1s;
          text-transform: uppercase;
        }
        .btn-candy:active {
          transform: translateY(4px);
          box-shadow: 0 4px 0 #6AB04C;
        }

        .btn-secondary {
          background: #F0932B;
          box-shadow: 0 8px 0 #D35400;
        }
        .btn-secondary:active { box-shadow: 0 4px 0 #D35400; }

        /* Игровая карточка */
        .game-card {
          background: #FFF;
          width: 100%; max-width: 400px;
          padding: 60px 20px;
          border-radius: 40px;
          box-shadow: 0 15px 0 rgba(0,0,0,0.1);
          margin: 30px 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .card-label { color: #686DE0; font-size: 14px; font-weight: 900; margin-bottom: 10px; opacity: 0.6; }
        .word-text { color: #2D3436; font-size: 3.5rem; font-weight: 900; line-height: 1; }

        /* Список категорий */
        .cat-list {
          width: 100%; max-width: 400px;
          overflow-y: auto; flex: 1;
          display: flex; flex-direction: column; gap: 12px;
          padding: 20px 0;
        }
        .cat-item {
          background: rgba(255,255,255,0.1);
          padding: 20px; border-radius: 20px;
          font-weight: 900; font-size: 1.2rem;
          cursor: pointer; display: flex; justify-content: space-between;
          border: 4px solid transparent;
        }
        .cat-item.active {
          background: #BADC58; color: #2D3436;
          border-color: #FFF;
        }

        /* Статус раунда */
        .status-row {
          width: 100%; max-width: 400px;
          display: flex; justify-content: space-between;
          margin-bottom: 20px;
        }
        .stat-badge {
          background: rgba(255,255,255,0.2);
          padding: 10px 20px; border-radius: 50px;
          font-weight: 900; font-size: 18px;
        }
        .timer-warning { background: #FF7979; animation: pulse 0.6s infinite; }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

        /* Инпуты */
        .custom-field {
          width: 100%; padding: 15px; border-radius: 15px;
          border: none; background: #FFF; color: #2D3436;
          font-family: inherit; font-weight: 900; font-size: 1.1rem;
          margin-top: 5px;
        }

        .blur-filter { filter: blur(8px); pointer-events: none; }
      `}</style>

      {/* МЕНЮ */}
      {screen === 'menu' && (
        <div className="container bg-menu">
          <button className="btn-top-left" onClick={goToHome}>ВЫХОД</button>
          <div className="game-title">ALIAS</div>
          <p style={{ fontWeight: 900, marginBottom: '40px', opacity: 0.8 }}>Объясни как можно больше слов!</p>
          <button className="btn-candy" onClick={() => setScreen('source')}>ПОЕХАЛИ! 🚀</button>
        </div>
      )}

      {/* ВЫБОР ИСТОЧНИКА */}
      {screen === 'source' && (
        <div className="container bg-menu">
          <button className="btn-top-left" onClick={backToMenu}>НАЗАД</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
            <button className="btn-candy" onClick={() => { setWords([]); setScreen('bank'); }}>📚 БАНК СЛОВ</button>
            <button className="btn-candy btn-secondary" onClick={() => { setWords([]); setShowWordsGroup(true); setScreen('setup'); }}>✏️ СВОИ СЛОВА</button>
          </div>
        </div>
      )}

      {/* КАТЕГОРИИ */}
      {screen === 'bank' && (
        <div className="container bg-menu" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
          <button className="btn-top-left" onClick={() => setScreen('source')}>НАЗАД</button>
          <div className="cat-list">
            {Object.keys(wordBanks).map(cat => (
              <div 
                key={cat} 
                className={`cat-item ${selectedCategories.has(cat) ? 'active' : ''}`} 
                onClick={() => toggleCategory(cat)}
              >
                <span>{cat === 'animals' ? '🐾 ЖИВОТНЫЕ' : cat === 'food' ? '🍕 ЕДА' : cat === 'movies' ? '🎬 ФИЛЬМЫ' : cat === 'sports' ? '⚽ СПОРТ' : cat === 'professions' ? '👔 ПРОФЕССИИ' : cat === 'countries' ? '🌍 СТРАНЫ' : '🎯 МИКС'}</span>
                {selectedCategories.has(cat) && <span>✓</span>}
              </div>
            ))}
          </div>
          {selectedCategories.size > 0 && (
            <button className="btn-candy" style={{ margin: '20px 0' }} onClick={() => {
              let combined = [];
              selectedCategories.forEach(cat => { combined = [...combined, ...wordBanks[cat]]; });
              setWords(combined);
              setShowWordsGroup(false);
              setScreen('setup');
            }}>ПРОДОЛЖИТЬ →</button>
          )}
        </div>
      )}

      {/* НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container bg-setup">
          <button className="btn-top-left" onClick={() => setScreen(showWordsGroup ? 'source' : 'bank')}>НАЗАД</button>
          <div style={{ width: '100%', maxWidth: '360px', textAlign: 'left', marginBottom: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 900, fontSize: '14px' }}>⏱️ ВРЕМЯ РАУНДА (СЕК)</label>
              <input type="number" className="custom-field" value={timeInput} onChange={e => setTimeInput(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 900, fontSize: '14px' }}>🔢 СЛОВ В РАУНДЕ</label>
              <input type="number" className="custom-field" value={roundsInput} onChange={e => setRoundsInput(Number(e.target.value))} />
            </div>
            {showWordsGroup && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 900, fontSize: '14px' }}>📝 ВАШИ СЛОВА (ЧЕРЕЗ ЗАПЯТУЮ)</label>
                <textarea className="custom-field" style={{ height: '100px', resize: 'none' }} value={customWordsInput} onChange={e => setCustomWordsInput(e.target.value)} />
              </div>
            )}
          </div>
          <button className="btn-candy" onClick={startGame}>СТАРТ! 🎮</button>
        </div>
      )}

      {/* ИГРА */}
      {screen === 'game' && (
        <div className={`container bg-game ${isConfirmModalOpen ? 'blur-filter' : ''}`}>
          <div className="status-row">
            <div className={`stat-badge ${timeLeft <= 10 ? 'timer-warning' : ''}`}>⏱️ {timeLeft}</div>
            <div className="stat-badge">⭐ {score}</div>
          </div>
          
          <div className="game-card">
            <div className="card-label">ОБЪЯСНИ СЛОВО:</div>
            <div className="word-text">{words[currentIndex]}</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%', maxWidth: '400px' }}>
            <button className="btn-candy btn-secondary" style={{ width: '100%' }} onClick={() => handleAction(false)}>ПРОПУСК</button>
            <button className="btn-candy" style={{ width: '100%' }} onClick={() => handleAction(true)}>ГОТОВО</button>
          </div>

          <button 
            style={{ marginTop: '30px', background: 'none', border: 'none', color: '#fff', fontWeight: 900, opacity: 0.6, fontSize: '16px' }}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            ПАУЗА
          </button>
        </div>
      )}

      {/* ИТОГИ */}
      {screen === 'results' && (
        <div className="container bg-results">
          <div className="game-title" style={{ color: '#4834D4', fontSize: '3rem' }}>РЕЗУЛЬТАТ</div>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: '#F0932B', marginBottom: '10px' }}>{score}</div>
          <div style={{ width: '100%', maxWidth: '400px', flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
            {log.map((item, idx) => (
              <div key={idx} style={{ padding: '15px', borderBottom: '2px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900 }}>
                <span style={{ opacity: item.ok ? 1 : 0.4 }}>{item.word}</span>
                <span style={{ color: item.ok ? '#BADC58' : '#EB4D4B' }}>{item.ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
          <button className="btn-candy" onClick={backToMenu}>В МЕНЮ ↻</button>
        </div>
      )}

      {/* ПАУЗА (МОДАЛКА) */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 2000 }}>
          <div style={{ background: '#FFF', padding: '40px 20px', borderRadius: '40px', width: '85%', maxWidth: '320px', color: '#2D3436' }}>
            <div className="game-title" style={{ color: '#4834D4', fontSize: '2.5rem', textShadow: 'none' }}>ПАУЗА</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <button className="btn-candy" onClick={() => setIsConfirmModalOpen(false)}>ПРОДОЛЖИТЬ</button>
              <button className="btn-candy btn-secondary" onClick={backToMenu}>ВЫЙТИ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

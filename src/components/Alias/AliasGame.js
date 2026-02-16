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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Space Grotesk', sans-serif; 
          background-color: #f0f0f0; 
          color: #1a1a1a;
          overflow: hidden;
        }

        /* Текстурный шум на фон */
        #app::before {
          content: "";
          position: fixed; inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
          opacity: 0.05;
          pointer-events: none;
          z-index: 9999;
        }

        .container {
          position: fixed; inset: 0; padding: 20px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: all 0.2s steps(4);
        }

        /* Кнопка выхода - как бирка */
        .btn-tag {
          position: absolute; top: 0; left: 20px;
          background: #1a1a1a; color: #fff;
          padding: 30px 10px 10px 10px;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
          border: none; font-weight: 700; font-size: 10px;
          cursor: pointer; z-index: 100;
        }

        /* Заголовок - Эффект вырезки */
        .title-cutout {
          background: #1a1a1a;
          color: #ccff00; /* Кислотный лайм */
          padding: 10px 30px;
          font-size: 4.5rem;
          font-weight: 900;
          transform: rotate(-2deg);
          box-shadow: 10px 10px 0 rgba(26,26,26,0.2);
          margin-bottom: 40px;
          text-transform: uppercase;
        }

        /* Кнопки - Стилистика грубого наброска */
        .btn-raw {
          background: #fff;
          border: 3px solid #1a1a1a;
          padding: 20px 40px;
          font-size: 1.5rem;
          font-weight: 700;
          position: relative;
          cursor: pointer;
          transition: 0.1s steps(2);
          text-transform: uppercase;
        }
        .btn-raw::after {
          content: "";
          position: absolute; inset: 4px;
          border: 1px solid #1a1a1a;
        }
        .btn-raw:active {
          transform: translate(4px, 4px);
          background: #ccff00;
        }

        /* Категории - Список как в блокноте */
        .notebook-list {
          width: 100%; max-width: 400px;
          max-height: 60vh; overflow-y: auto;
          border-left: 4px solid #1a1a1a;
          padding-left: 15px;
        }
        .note-item {
          padding: 15px;
          margin-bottom: 10px;
          border-bottom: 1px dashed #1a1a1a;
          text-align: left;
          font-weight: 500;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex; justify-content: space-between;
        }
        .note-item.selected {
          background: #1a1a1a; color: #ccff00;
        }

        /* Игровая карточка - Рваная бумага */
        .paper-card {
          background: #fff;
          width: 90%; max-width: 450px;
          min-height: 300px;
          padding: 40px;
          position: relative;
          box-shadow: 5px 5px 0 #1a1a1a;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          clip-path: polygon(0% 2%, 98% 0%, 100% 95%, 2% 100%, 0% 50%);
        }
        .paper-card::before {
          content: "EXPLAIN THIS:";
          position: absolute; top: 15px; left: 20px;
          font-size: 12px; font-weight: 900; color: #aaa;
        }
        .word-main {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          color: #1a1a1a;
          text-decoration: underline;
        }

        /* Статус бары */
        .info-strip {
          position: fixed; bottom: 20px; left: 20px; right: 20px;
          display: flex; justify-content: space-between;
          font-weight: 700; text-transform: uppercase;
        }
        .stat-block { background: #1a1a1a; color: #fff; padding: 5px 15px; }
        .stat-block.warning { background: #ff4400; animation: flash 0.5s steps(2) infinite; }

        @keyframes flash {
          from { opacity: 1; } to { opacity: 0; }
        }

        .blur-effect { filter: grayscale(1) blur(5px); pointer-events: none; }

        /* Итоги - Инверсия */
        .results-wrap {
          background: #1a1a1a; color: #fff;
          width: 100%; height: 100%;
          padding-top: 60px;
        }
        .log-row {
          padding: 10px 20px;
          border-bottom: 1px solid #333;
          display: flex; justify-content: space-between;
        }
      `}</style>

      {/* МЕНЮ */}
      {screen === 'menu' && (
        <div className="container">
          <button className="btn-tag" onClick={goToHome}>EXIT</button>
          <div className="title-cutout">ALIAS</div>
          <p style={{ fontWeight: 500, marginBottom: '30px', maxWidth: '250px' }}>
            // INDIE GAME MODE_ <br/> NO RULES, JUST EXPLAIN.
          </p>
          <button className="btn-raw" onClick={() => setScreen('source')}>START_SESSION</button>
        </div>
      )}

      {/* ИСТОЧНИК */}
      {screen === 'source' && (
        <div className="container">
          <button className="btn-tag" onClick={backToMenu}>BACK</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '80%' }}>
            <button className="btn-raw" onClick={() => { setWords([]); setScreen('bank'); }}>[ WORD_BANK ]</button>
            <button className="btn-raw" onClick={() => { setWords([]); setShowWordsGroup(true); setScreen('setup'); }}>[ MANUAL_INPUT ]</button>
          </div>
        </div>
      )}

      {/* КАТЕГОРИИ */}
      {screen === 'bank' && (
        <div className="container" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
          <button className="btn-tag" onClick={() => setScreen('source')}>BACK</button>
          <div className="notebook-list">
            {Object.keys(wordBanks).map(cat => (
              <div 
                key={cat} 
                className={`note-item ${selectedCategories.has(cat) ? 'selected' : ''}`} 
                onClick={() => toggleCategory(cat)}
              >
                <span>{cat.toUpperCase()}</span>
                {selectedCategories.has(cat) && <span>[X]</span>}
              </div>
            ))}
          </div>
          {selectedCategories.size > 0 && (
            <button className="btn-raw" style={{ marginTop: '30px' }} onClick={() => {
              let combined = [];
              selectedCategories.forEach(cat => { combined = [...combined, ...wordBanks[cat]]; });
              setWords(combined);
              setShowWordsGroup(false);
              setScreen('setup');
            }}>CONFIRM_SELECTION</button>
          )}
        </div>
      )}

      {/* НАСТРОЙКИ */}
      {screen === 'setup' && (
        <div className="container">
          <button className="btn-tag" onClick={() => setScreen(showWordsGroup ? 'source' : 'bank')}>BACK</button>
          <div style={{ background: '#fff', border: '3px solid #1a1a1a', padding: '30px', width: '90%', maxWidth: '400px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900 }}>TIME_LIMIT (SEC)</label>
              <input type="number" style={{ width: '100%', border: 'none', borderBottom: '3px solid #1a1a1a', fontSize: '2rem', outline: 'none' }} value={timeInput} onChange={e => setTimeInput(Number(e.target.value))} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900 }}>WORDS_AMOUNT</label>
              <input type="number" style={{ width: '100%', border: 'none', borderBottom: '3px solid #1a1a1a', fontSize: '2rem', outline: 'none' }} value={roundsInput} onChange={e => setRoundsInput(Number(e.target.value))} />
            </div>
            {showWordsGroup && <textarea style={{ width: '100%', height: '80px', border: '1px solid #1a1a1a', padding: '10px' }} value={customWordsInput} onChange={e => setCustomWordsInput(e.target.value)} />}
          </div>
          <button className="btn-raw" style={{ marginTop: '20px', width: '90%', maxWidth: '400px' }} onClick={startGame}>EXECUTE_GAME</button>
        </div>
      )}

      {/* ИГРА */}
      {screen === 'game' && (
        <div className={`container ${isConfirmModalOpen ? 'blur-effect' : ''}`} style={{ backgroundColor: '#1a1a1a' }}>
          <div className="paper-card">
            <div className="word-main">{words[currentIndex]}</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '90%', maxWidth: '450px', marginTop: '30px' }}>
            <button className="btn-raw" style={{ background: '#1a1a1a', color: '#fff' }} onClick={() => handleAction(false)}>SKIP</button>
            <button className="btn-raw" onClick={() => handleAction(true)}>DONE</button>
          </div>

          <div className="info-strip">
            <div className={`stat-block ${timeLeft <= 10 ? 'warning' : ''}`}>T: {timeLeft}S</div>
            <button style={{ background: '#fff', border: 'none', fontWeight: 900, padding: '5px 10px' }} onClick={() => setIsConfirmModalOpen(true)}>PAUSE</button>
            <div className="stat-block">SCORE: {score}</div>
          </div>
        </div>
      )}

      {/* ИТОГИ */}
      {screen === 'results' && (
        <div className="container results-wrap">
          <div className="title-cutout" style={{ fontSize: '2.5rem' }}>SESSION_OVER</div>
          <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>{score}</h2>
          <div style={{ width: '90%', maxWidth: '400px', flex: 1, overflowY: 'auto', marginTop: '20px' }}>
            {log.map((item, idx) => (
              <div key={idx} className="log-row" onClick={() => toggleLogStatus(idx)}>
                <span style={{ textDecoration: item.ok ? 'none' : 'line-through', opacity: item.ok ? 1 : 0.5 }}>{item.word}</span>
                <span style={{ color: item.ok ? '#ccff00' : '#ff4400' }}>{item.ok ? '[OK]' : '[X]'}</span>
              </div>
            ))}
          </div>
          <button className="btn-raw" style={{ margin: '20px 0' }} onClick={backToMenu}>REBOOT_SYSTEM</button>
        </div>
      )}

      {/* ПАУЗА */}
      {isConfirmModalOpen && (
        <div className="container" style={{ background: 'rgba(204, 255, 0, 0.9)', zIndex: 2000 }}>
          <div className="title-cutout" style={{ fontSize: '3rem' }}>PAUSED</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '80%' }}>
            <button className="btn-raw" style={{ background: '#1a1a1a', color: '#fff' }} onClick={backToMenu}>ABORT_GAME</button>
            <button className="btn-raw" onClick={() => setIsConfirmModalOpen(false)}>RESUME</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

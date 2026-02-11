import React, { useState, useEffect } from 'react';
// Подключаем нужные иконки
import { Timer, X, Check, ArrowLeft, Trophy, Play } from 'lucide-react';

const CROC_WORDS = ['Зубная щетка', 'Вертолет', 'Шаурма', 'Береза', 'Дирижер', 'Фламинго', 'Пылесос', 'Гарри Поттер', 'Йога', 'Кофемашина', 'Скейтборд', 'Человек-паук'];

const CrocodileGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play, results
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);

  // Смена слова
  // // Выбирает новое случайное слово
  const nextWord = () => {
    const random = CROC_WORDS[Math.floor(Math.random() * CROC_WORDS.length)];
    setWord(random);
  };

  // Таймер
  useEffect(() => {
    let t = null;
    if (stage === 'play' && time > 0) {
      t = setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('results');
    }
    return () => { if (t) clearInterval(t); };
  }, [stage, time]);

  const startGame = () => {
    setScore(0);
    setTime(60);
    nextWord();
    setStage('play');
  };

  // --- СТИЛИ (Jungle Pop-Art) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#2D5A27', // Глубокий зеленый
      color: '#fff', fontFamily: '"Segoe UI", Roboto, sans-serif', overflow: 'hidden'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    timerPill: {
      background: '#FFD32D', border: '4px solid #000', padding: '10px 20px',
      borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem',
      boxShadow: '4px 4px 0 #000', display: 'flex', alignItems: 'center', gap: '8px', color: '#000'
    },
    scorePill: {
      background: '#fff', border: '4px solid #000', padding: '10px 20px',
      borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem',
      boxShadow: '4px 4px 0 #000', color: '#000'
    },
    card: {
      background: '#fff', border: '6px solid #000', borderRadius: '30px',
      padding: '40px 20px', textAlign: 'center', margin: '20px 0',
      boxShadow: '12px 12px 0 #153112', flex: 1, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#000', position: 'relative'
    },
    word: { fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', color: '#2D5A27' },
    btnGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' },
    btnYes: {
      background: '#58E08E', border: '4px solid #000', padding: '20px',
      borderRadius: '20px', boxShadow: '6px 6px 0 #153112', cursor: 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    btnNo: {
      background: '#FF5C5C', border: '4px solid #000', padding: '20px',
      borderRadius: '20px', boxShadow: '6px 6px 0 #153112', cursor: 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    mainBtn: {
      background: '#FFD32D', color: '#000', padding: '22px', border: '4px solid #000',
      borderRadius: '20px', fontWeight: '900', fontSize: '1.5rem',
      boxShadow: '8px 8px 0 #153112', cursor: 'pointer'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={{...styles.container, background: '#4BAE4F'}}>
        <button onClick={onBack} style={{background: '#000', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '10px', width: 'fit-content', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
          <ArrowLeft size={18}/> ВЫХОД
        </button>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{background: '#FFD32D', padding: '15px 40px', border: '6px solid #000', boxShadow: '10px 10px 0 #000', transform: 'rotate(2deg)', marginBottom: '40px'}}>
            <h1 style={{fontSize: '3.5rem', fontWeight: '950', color: '#000', margin: 0}}>CROC!</h1>
          </div>
          <p style={{fontWeight: '800', fontSize: '1.3rem', textAlign: 'center', maxWidth: '80%', lineHeight: 1.4}}>ПОКАЖИ ЖЕСТАМИ ЗАГАДАННОЕ СЛОВО!</p>
          <div style={{marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px', width: '100%'}}>
             <button style={styles.mainBtn} onClick={startGame}>НАЧАТЬ ИГРУ</button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ИГРА
  if (stage === 'play') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{...styles.timerPill, background: time < 10 ? '#FF5C5C' : '#FFD32D'}}>
            <Timer size={24} /> {time}
          </div>
          <div style={styles.scorePill}>СЧЕТ: {score}</div>
        </div>
        
        <div style={styles.card}>
          <div style={{position: 'absolute', top: -20, right: 20, background: '#4BAE4F', border: '3px solid #000', padding: '5px 15px', fontWeight: '900', color: '#fff'}}>ПОКАЖИ:</div>
          <h2 style={styles.word}>{word}</h2>
        </div>

        <div style={styles.btnGrid}>
          <button style={styles.btnNo} onClick={nextWord}>
            <X size={45} strokeWidth={3} color="#000" />
          </button>
          <button style={styles.btnYes} onClick={() => { setScore(s => s + 1); nextWord(); }}>
            <Check size={45} strokeWidth={3} color="#000" />
          </button>
        </div>
      </div>
    );
  }

  // 3. ИТОГИ
  return (
    <div style={{...styles.container, background: '#FFD32D', color: '#000'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Trophy size={80} color="#000" strokeWidth={2.5} />
        <h2 style={{fontSize: '3rem', fontWeight: '950', margin: '20px 0'}}>ГОТОВО!</h2>
        <div style={{background: '#fff', border: '5px solid #000', padding: '20px 50px', borderRadius: '20px', boxShadow: '8px 8px 0 #000'}}>
          <p style={{fontSize: '1.2rem', fontWeight: '800', margin: 0}}>ВАШ СЧЕТ:</p>
          <p style={{fontSize: '4rem', fontWeight: '950', margin: 0, textAlign: 'center'}}>{score}</p>
        </div>
        <button style={{...styles.mainBtn, background: '#000', color: '#fff', width: '80%', marginTop: '40px'}} onClick={onBack}>
          В МЕНЮ ИГР
        </button>
      </div>
    </div>
  );
};

export default CrocodileGame;

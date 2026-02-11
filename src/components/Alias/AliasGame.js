import React, { useState, useEffect } from 'react';
// Подключаем иконки
import { Timer, X, Check, ArrowLeft, RotateCcw, Award } from 'lucide-react';

const WORDS_LIST = ['Марсоход', 'Пломбир', 'Дирижер', 'Инстаграм', 'Эверест', 'Гладиатор', 'Телепортация', 'Смузи', 'Йога', 'Пират', 'Виниловая пластинка', 'Детектив'];

const AliasGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); 
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [log, setLog] = useState([]);

  // Функция смены слова
  // // Ищет новое слово, исключая текущее
  const nextWord = () => {
    const random = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
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

  const startAlias = () => {
    setScore(0);
    setTime(60);
    setLog([]);
    nextWord();
    setStage('play');
  };

  // --- СТИЛИ (Дизайнерский Pop-Art) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#FF3D7F', // Яркий розовый фон
      color: '#fff', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflow: 'hidden'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'
    },
    timerPill: {
      background: '#3FB6FF', border: '4px solid #000', padding: '10px 20px',
      borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem',
      boxShadow: '4px 4px 0 #000', display: 'flex', alignItems: 'center', gap: '8px'
    },
    scorePill: {
      background: '#FFD32D', border: '4px solid #000', padding: '10px 20px',
      borderRadius: '50px', fontWeight: '900', fontSize: '1.2rem',
      boxShadow: '4px 4px 0 #000', color: '#000'
    },
    card: {
      background: '#fff', border: '6px solid #000', borderRadius: '30px',
      padding: '40px 20px', textAlign: 'center', margin: '20px 0',
      boxShadow: '12px 12px 0 #000', flex: 1, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#000', position: 'relative'
    },
    word: { fontSize: '2.8rem', fontWeight: '900', textTransform: 'uppercase', lineHeight: 1.1 },
    btnGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' },
    btnYes: {
      background: '#58E08E', border: '4px solid #000', padding: '20px',
      borderRadius: '20px', boxShadow: '6px 6px 0 #000', cursor: 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    btnNo: {
      background: '#FF5C5C', border: '4px solid #000', padding: '20px',
      borderRadius: '20px', boxShadow: '6px 6px 0 #000', cursor: 'pointer',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    menuBtn: {
      background: '#FFD32D', color: '#000', padding: '22px', border: '4px solid #000',
      borderRadius: '20px', fontWeight: '900', fontSize: '1.5rem',
      boxShadow: '8px 8px 0 #000', cursor: 'pointer', marginTop: '40px'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={{...styles.container, background: '#3FB6FF'}}>
        <button onClick={onBack} style={{background: '#000', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '10px', width: 'fit-content', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
          <ArrowLeft size={18}/> ВЫХОД
        </button>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{background: '#fff', padding: '10px 30px', border: '6px solid #000', boxShadow: '10px 10px 0 #000', transform: 'rotate(-3deg)'}}>
            <h1 style={{fontSize: '4.5rem', fontWeight: '950', color: '#000', margin: 0}}>ALIAS</h1>
          </div>
          <p style={{marginTop: '30px', fontWeight: '800', fontSize: '1.2rem', textAlign: 'center'}}>ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ ЗА 60 СЕКУНД!</p>
          <button style={styles.menuBtn} onClick={startAlias}>ПОЕХАЛИ! 🚀</button>
        </div>
      </div>
    );
  }

  // 2. ИГРА
  if (stage === 'play') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{...styles.timerPill, background: time < 10 ? '#FF5C5C' : '#3FB6FF'}}>
            <Timer size={24} /> {time}
          </div>
          <div style={styles.scorePill}>ОЧКИ: {score}</div>
        </div>
        
        <div style={styles.card}>
          <div style={{position: 'absolute', top: -20, left: 20, background: '#FFD32D', border: '3px solid #000', padding: '5px 15px', fontWeight: '900', color: '#000'}}>СЛОВО:</div>
          <h2 style={styles.word}>{word}</h2>
        </div>

        <div style={styles.btnGrid}>
          <button style={styles.btnNo} onClick={() => { setLog(p => [...p, {w: word, ok: false}]); nextWord(); }}>
            <X size={45} strokeWidth={3} color="#000" />
          </button>
          <button style={styles.btnYes} onClick={() => { setScore(s => s + 1); setLog(p => [...p, {w: word, ok: true}]); nextWord(); }}>
            <Check size={45} strokeWidth={3} color="#000" />
          </button>
        </div>
      </div>
    );
  }

  // 3. ИТОГИ
  return (
    <div style={{...styles.container, background: '#fff', color: '#000', overflowY: 'auto'}}>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <Award size={60} color="#FFD32D" strokeWidth={2.5} style={{filter: 'drop-shadow(3px 3px 0 #000)'}}/>
        <h2 style={{fontSize: '2.5rem', fontWeight: '950', margin: '10px 0'}}>ИТОГИ: {score}</h2>
      </div>
      
      <div style={{flex: 1, border: '4px solid #000', borderRadius: '20px', padding: '10px', background: '#F0F0F0', boxShadow: 'inset 4px 4px 0 rgba(0,0,0,0.1)'}}>
        {log.map((item, i) => (
          <div key={i} style={{padding: '12px', borderBottom: '2px solid #ddd', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem'}}>
            <span style={{textTransform: 'uppercase'}}>{item.w}</span>
            <span style={{color: item.ok ? '#2ecc71' : '#ff4747'}}>{item.ok ? '✓' : '✕'}</span>
          </div>
        ))}
      </div>

      <button style={{...styles.menuBtn, width: '100%'}} onClick={onBack}>
        <RotateCcw size={20} style={{marginRight: 10}}/> ВЕРНУТЬСЯ
      </button>
    </div>
  );
};

export default AliasGame;

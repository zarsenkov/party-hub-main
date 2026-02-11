import React, { useState, useEffect } from 'react';
// Импорт иконок из lucide-react
import { Timer, X, Check, ArrowLeft } from 'lucide-react';

// Список слов для игры
const WORDS_LIST = ['Космос', 'Пицца', 'Гитара', 'Метро', 'Робот', 'Зомби', 'Спорт', 'Кино', 'Ниндзя', 'Акула', 'Зеркало', 'Поезд'];

const AliasGame = ({ onBack }) => {
  // Состояния игры
  const [stage, setStage] = useState('menu'); 
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [log, setLog] = useState([]);

  // Функция для выбора нового случайного слова
  // // Исключает повторение того же слова подряд
  const nextWord = () => {
    const random = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
    setWord(random);
  };

  // Таймер обратного отсчета
  // // Управляет временем раунда и переходом к результатам
  useEffect(() => {
    let t = null;
    if (stage === 'play' && time > 0) {
      t = setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (time === 0 && stage === 'play') {
      setStage('results');
    }
    return () => { if (t) clearInterval(t); };
  }, [stage, time]);

  // Запуск игры
  // // Сбрасывает счет и таймер
  const startAlias = () => {
    setScore(0);
    setTime(60);
    setLog([]);
    nextWord();
    setStage('play');
  };

  // Объект стилей (Inline Styles)
  // // Исправлен zIndex и другие свойства для стабильной сборки
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      background: '#ffcc00',
      color: '#000',
      fontFamily: 'sans-serif'
    },
    card: {
      background: '#fff',
      border: '4px solid #000',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      margin: '20px 0',
      boxShadow: '10px 10px 0 #000',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnMain: {
      background: '#000',
      color: '#fff',
      padding: '20px',
      border: 'none',
      borderRadius: '15px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      cursor: 'pointer'
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '20px' 
    },
    pill: { 
      background: '#fff', 
      border: '3px solid #000', 
      padding: '10px 20px', 
      borderRadius: '30px', 
      fontWeight: '900',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    btnGrid: { 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '20px' 
    },
    btnAction: { 
      padding: '20px', 
      borderRadius: '15px', 
      border: '3px solid #000', 
      color: '#fff', 
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  // 1. Экран Меню
  if (stage === 'menu') {
    return (
      <div style={{...styles.container, background: '#fff'}}>
        <button onClick={onBack} style={{background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold'}}>
          <ArrowLeft size={20} /> Назад
        </button>
        <h1 style={{fontSize: '4rem', textAlign: 'center', marginTop: '100px', fontWeight: '900'}}>ALIAS</h1>
        <button style={{...styles.btnMain, marginTop: 'auto'}} onClick={startAlias}>ИГРАТЬ</button>
      </div>
    );
  }

  // 2. Экран Игры
  if (stage === 'play') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.pill}><Timer size={20} /> {time}с</div>
          <div style={styles.pill}>СЧЕТ: {score}</div>
        </div>
        
        <div style={styles.card}>
          <h2 style={{fontSize: '2.5rem', fontWeight: '900', margin: 0}}>{word}</h2>
        </div>

        <div style={styles.btnGrid}>
          <button 
            style={{...styles.btnAction, background: '#ff4747'}} 
            onClick={() => { setLog(p => [...p, {w: word, ok: false}]); nextWord(); }}
          >
            <X size={40} />
          </button>
          <button 
            style={{...styles.btnAction, background: '#2ecc71'}} 
            onClick={() => { setScore(s => s + 1); setLog(p => [...p, {w: word, ok: true}]); nextWord(); }}
          >
            <Check size={40} />
          </button>
        </div>
      </div>
    );
  }

  // 3. Экран Итогов
  return (
    <div style={{...styles.container, background: '#fff', overflowY: 'auto'}}>
      <h2 style={{textAlign: 'center', fontSize: '2rem', fontWeight: '900'}}>ФИНИШ! СЧЕТ: {score}</h2>
      <div style={{margin: '20px 0', flex: 1}}>
        {log.map((item, i) => (
          <div key={i} style={{padding: '12px', borderBottom: '2px solid #eee', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
            <span>{item.w}</span>
            <span style={{color: item.ok ? '#2ecc71' : '#ff4747'}}>{item.ok ? '+1' : '-1'}</span>
          </div>
        ))}
      </div>
      <button style={styles.btnMain} onClick={onBack}>В МЕНЮ ИГР</button>
    </div>
  );
};

export default AliasGame;

import React, { useState, useEffect } from 'react';
// Иконки в строгом стиле
import { Brain, ArrowLeft, RotateCcw, Zap, HelpCircle } from 'lucide-react';

const QUIZ_DATA = [
  {
    q: "Какой химический элемент составляет более 90% атомов во Вселенной?",
    a: ["Гелий", "Кислород", "Водород", "Углерод"],
    correct: 2
  },
  {
    q: "В каком году произошел первый полет человека в космос?",
    a: ["1957", "1961", "1965", "1969"],
    correct: 1
  },
  {
    q: "Кто из этих художников отрезал себе мочку уха?",
    a: ["Пабло Пикассо", "Сальвадор Дали", "Винсент Ван Гог", "Клод Моне"],
    correct: 2
  }
];

const QuizGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play, result
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Обработка ответа
  // // Исправлена логика подсчета очков и перехода
  const handleAnswer = (idx) => {
    if (isLocked) return;
    
    setSelectedIdx(idx);
    setIsLocked(true);

    const isCorrect = idx === QUIZ_DATA[currentQ].correct;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1); // Используем функциональный апдейт
    }

    // Задержка перед следующим шагом
    setTimeout(() => {
      // Проверяем, есть ли следующий вопрос
      if (currentQ + 1 < QUIZ_DATA.length) {
        setCurrentQ(prev => prev + 1);
        setSelectedIdx(null);
        setIsLocked(false);
      } else {
        // Если вопросы кончились — переходим к результатам
        setStage('result');
      }
    }, 800);
  };

  const restart = () => {
    setScore(0);
    setCurrentQ(0);
    setSelectedIdx(null);
    setIsLocked(false);
    setStage('play');
  };

  // --- СТИЛИ (Brutalist Bauhaus Style) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '30px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#F0F0F0', color: '#000', fontFamily: '"Arial Black", sans-serif'
    },
    header: { 
      borderBottom: '8px solid #000', paddingBottom: '10px', marginBottom: '30px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
    },
    qCard: {
      background: '#fff', border: '8px solid #000', padding: '20px', marginBottom: '30px'
    },
    ansBtn: (idx) => {
      let bg = '#fff';
      if (selectedIdx === idx) {
        bg = idx === QUIZ_DATA[currentQ].correct ? '#00FF00' : '#FF3D00';
      }
      return {
        width: '100%', padding: '15px', marginBottom: '15px', background: bg,
        border: '6px solid #000', color: '#000', fontSize: '1.2rem', fontWeight: '900',
        textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between'
      };
    },
    bigBtn: {
      background: '#FF3D00', color: '#fff', border: '8px solid #000',
      padding: '20px', fontSize: '1.8rem', fontWeight: '900', cursor: 'pointer',
      width: '100%', textTransform: 'uppercase'
    },
    scoreBadge: {
      background: '#000', color: '#fff', padding: '5px 15px', fontSize: '1rem'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={styles.container}>
        <div style={{...styles.header, borderBottom: 'none'}}>
          <button onClick={onBack} style={{background: '#000', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: '900'}}>BACK</button>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h1 style={{fontSize: '5rem', lineHeight: 0.8, margin: '0 0 20px 0', letterSpacing: '-4px'}}>QUIZ<br/>LAB.</h1>
          <p style={{fontSize: '1.2rem', borderLeft: '8px solid #FF3D00', paddingLeft: '15px', fontWeight: 'bold'}}>ИНТЕЛЛЕКТУАЛЬНЫЙ ТЕСТ №01</p>
          <div style={{marginTop: '50px'}}>
            <button style={styles.bigBtn} onClick={() => setStage('play')}>START</button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ИГРА
  if (stage === 'play') {
    const q = QUIZ_DATA[currentQ];
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={{fontSize: '2rem'}}>Q{currentQ + 1}</span>
          <div style={styles.scoreBadge}>SCORE: {score}</div>
        </div>

        <div style={styles.qCard}>
          <h2 style={{fontSize: '1.6rem', margin: 0, textTransform: 'uppercase'}}>{q.q}</h2>
        </div>

        <div style={{flex: 1}}>
          {q.a.map((ans, i) => (
            <button key={i} style={styles.ansBtn(i)} onClick={() => handleAnswer(i)}>
              {ans}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. РЕЗУЛЬТАТЫ
  return (
    <div style={{...styles.container, background: '#000', color: '#fff'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
        <h2 style={{fontSize: '4rem', margin: 0}}>FINISH</h2>
        <div style={{fontSize: '10rem', color: '#FF3D00', lineHeight: 1}}>{score}</div>
        <p style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '50px'}}>ОЧКОВ ИЗ {QUIZ_DATA.length}</p>
        
        <button style={{...styles.bigBtn, background: '#fff', color: '#000'}} onClick={restart}>RETRY</button>
        <button onClick={onBack} style={{marginTop: '30px', color: '#fff', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 'bold'}}>EXIT TO HUB</button>
      </div>
    </div>
  );
};

export default QuizGame;

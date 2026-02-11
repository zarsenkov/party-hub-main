import React, { useState } from 'react';
// Иконки
import { Brain, ArrowLeft, RotateCcw, Zap, Target } from 'lucide-react';

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
  const [stage, setStage] = useState('menu');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Обработка клика по ответу
  // // Фиксирует выбор и переключает вопрос через секунду
  const handleAnswer = (idx) => {
    if (isLocked) return;
    setSelectedIdx(idx);
    setIsLocked(true);

    if (idx === QUIZ_DATA[currentQ].correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQ + 1 < QUIZ_DATA.length) {
        setCurrentQ(prev => prev + 1);
        setSelectedIdx(null);
        setIsLocked(false);
      } else {
        setStage('result');
      }
    }, 1000);
  };

  // Стили в стиле Ретро-Футуризма (Synthwave)
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#0d0221', color: '#fb00ff', fontFamily: '"Courier New", monospace',
      overflow: 'hidden'
    },
    // Эффект светящейся сетки на фоне
    gridBg: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: 'linear-gradient(rgba(251, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 0, 255, 0.1) 1px, transparent 1px)',
      backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)',
      transformOrigin: 'center top', zIndex: -1, opacity: 0.5
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', textShadow: '0 0 10px #fb00ff' },
    qCard: {
      background: 'rgba(13, 2, 33, 0.8)', border: '2px solid #00f2ff', borderRadius: '4px',
      padding: '25px', marginBottom: '30px', boxShadow: '0 0 20px #00f2ff',
      position: 'relative'
    },
    ansBtn: (idx) => {
      let color = '#00f2ff'; // Дефолтный голубой
      if (selectedIdx === idx) {
        color = idx === QUIZ_DATA[currentQ].correct ? '#39ff14' : '#ff003c';
      }
      return {
        width: '100%', padding: '15px', marginBottom: '15px', background: 'transparent',
        border: `2px solid ${color}`, color: color, fontSize: '1rem', fontWeight: 'bold',
        cursor: 'pointer', textTransform: 'uppercase', textAlign: 'left',
        boxShadow: selectedIdx === idx ? `0 0 15px ${color}` : 'none',
        transition: 'all 0.2s', clipPath: 'polygon(90% 0, 100% 30%, 100% 100%, 0 100%, 0 0)'
      };
    },
    startBtn: {
      background: 'transparent', border: '3px solid #fb00ff', color: '#fb00ff',
      padding: '20px 40px', fontSize: '1.5rem', fontWeight: '900', cursor: 'pointer',
      boxShadow: '0 0 20px #fb00ff', textTransform: 'uppercase'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={styles.container}>
        <div style={styles.gridBg}></div>
        <button onClick={onBack} style={{background: 'none', border: 'none', color: '#00f2ff', cursor: 'pointer'}}><ArrowLeft/></button>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Zap size={80} color="#fb00ff" style={{filter: 'drop-shadow(0 0 15px #fb00ff)', marginBottom: '20px'}}/>
          <h1 style={{fontSize: '3.5rem', margin: 0, textAlign: 'center'}}>NEO<br/>QUIZ</h1>
          <p style={{color: '#00f2ff', margin: '20px 0'}}>ВХОД В СИСТЕМУ ЗНАНИЙ...</p>
          <button style={styles.startBtn} onClick={() => setStage('play')}>START</button>
        </div>
      </div>
    );
  }

  // 2. ИГРА
  if (stage === 'play') {
    const q = QUIZ_DATA[currentQ];
    return (
      <div style={styles.container}>
        <div style={styles.gridBg}></div>
        <div style={styles.header}>
          <span>DATA_CHUNK: {currentQ + 1}</span>
          <span>SCORE: {score}</span>
        </div>

        <div style={styles.qCard}>
          <div style={{position: 'absolute', top: -10, left: 10, background: '#0d0221', padding: '0 10px', fontSize: '0.8rem', color: '#00f2ff'}}>QUESTION_LOG</div>
          <h2 style={{margin: 0, color: '#fff', fontSize: '1.2rem', lineHeight: 1.5}}>{q.q}</h2>
        </div>

        <div>
          {q.a.map((ans, i) => (
            <button key={i} style={styles.ansBtn(i)} onClick={() => handleAnswer(i)}>
              {`> ${ans}`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. ИТОГИ
  return (
    <div style={styles.container}>
      <div style={styles.gridBg}></div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Target size={100} color="#00f2ff" style={{filter: 'drop-shadow(0 0 20px #00f2ff)'}}/>
        <h2 style={{fontSize: '2rem', marginTop: '30px'}}>MISS_COMPLETED</h2>
        <div style={{fontSize: '4rem', color: '#fff', margin: '20px 0'}}>{score}/{QUIZ_DATA.length}</div>
        <button style={styles.startBtn} onClick={restart}>REBOOT</button>
        <button onClick={onBack} style={{marginTop: '30px', background: 'none', border: 'none', color: '#00f2ff', cursor: 'pointer', fontWeight: 'bold'}}>ВЫЙТИ В ХАБ</button>
      </div>
    </div>
  );
};

export default QuizGame;

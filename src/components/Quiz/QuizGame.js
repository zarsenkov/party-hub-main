import React, { useState } from 'react';
// Иконки, которые подходят под аркадный стиль
import { Gamepad2, ArrowLeft, RotateCcw, Star, Ghost } from 'lucide-react';

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

  // Обработка ответа
  // // Логика подсчета очков через prevState и защита от вылета за пределы массива
  const handleAnswer = (idx) => {
    if (isLocked) return;
    setSelectedIdx(idx);
    setIsLocked(true);

    if (idx === QUIZ_DATA[currentQ].correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQ + 1 < QUIZ_DATA.length) {
        setCurrentQ(prev => prev + 1);
        setSelectedIdx(null);
        setIsLocked(false);
      } else {
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

  // --- СТИЛИ (Arcade Retro Style) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#303EAD', // Классический синий из аркад
      color: '#fff', fontFamily: '"Press Start 2P", "Courier New", monospace', // Имитация пикселей
    },
    innerBorder: {
      flex: 1, border: '6px solid #fff', borderRadius: '10px', padding: '20px',
      display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 0 4px #000'
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '4px solid #fff', paddingBottom: '10px' },
    qCard: {
      background: '#000', border: '4px solid #FFD700', padding: '15px', marginBottom: '20px',
      boxShadow: '4px 4px 0 #000'
    },
    ansBtn: (idx) => {
      let borderColor = '#fff';
      let shadowColor = '#000';
      if (selectedIdx === idx) {
        borderColor = idx === QUIZ_DATA[currentQ].correct ? '#4ADE80' : '#F87171';
        shadowColor = idx === QUIZ_DATA[currentQ].correct ? '#166534' : '#991B1B';
      }
      return {
        width: '100%', padding: '15px', marginBottom: '15px', background: '#000',
        border: `4px solid ${borderColor}`, color: borderColor, fontSize: '0.9rem',
        fontWeight: 'bold', cursor: 'pointer', textAlign: 'left',
        boxShadow: `6px 6px 0 ${shadowColor}`, textTransform: 'uppercase'
      };
    },
    startBtn: {
      background: '#E11D48', color: '#fff', border: '4px solid #fff',
      padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
      boxShadow: '8px 8px 0 #000', textTransform: 'uppercase'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={styles.container}>
        <div style={styles.innerBorder}>
          <button onClick={onBack} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer'}}><ArrowLeft/></button>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
            <Gamepad2 size={60} color="#FFD700" style={{marginBottom: '20px'}}/>
            <h1 style={{fontSize: '2rem', marginBottom: '40px', textShadow: '4px 4px 0 #000'}}>SUPER QUIZ</h1>
            <button style={styles.startBtn} onClick={() => setStage('play')}>PRESS START</button>
            <p style={{marginTop: '30px', fontSize: '0.7rem', color: '#FFD700'}}>INSERT COIN TO PLAY</p>
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
        <div style={styles.innerBorder}>
          <div style={styles.header}>
            <span style={{fontSize: '0.7rem'}}>LVL {currentQ + 1}</span>
            <span style={{fontSize: '0.7rem'}}>PTS: {score * 100}</span>
          </div>

          <div style={styles.qCard}>
            <p style={{fontSize: '0.9rem', lineHeight: '1.5', margin: 0}}>{q.q}</p>
          </div>

          <div style={{flex: 1}}>
            {q.a.map((ans, i) => (
              <button key={i} style={styles.ansBtn(i)} onClick={() => handleAnswer(i)}>
                {`${i + 1}. ${ans}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. РЕЗУЛЬТАТ
  return (
    <div style={styles.container}>
      <div style={{...styles.innerBorder, background: '#000'}}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          {score === QUIZ_DATA.length ? <Star size={80} color="#FFD700" /> : <Ghost size={80} color="#fff" />}
          <h2 style={{fontSize: '1.5rem', margin: '20px 0'}}>GAME OVER</h2>
          <div style={{fontSize: '2rem', color: '#FFD700', marginBottom: '40px'}}>
            FINAL SCORE:<br/>{score * 100}
          </div>
          <button style={styles.startBtn} onClick={restart}>CONTINUE?</button>
          <button onClick={onBack} style={{marginTop: '30px', color: '#fff', background: 'none', border: 'none', fontSize: '0.8rem', cursor: 'pointer'}}>EXIT</button>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;

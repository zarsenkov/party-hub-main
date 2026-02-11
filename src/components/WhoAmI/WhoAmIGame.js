import React, { useState } from 'react';
// Иконки для вечеринки
import { User, RefreshCcw, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';

const CHARACTERS = [
  'Человек-паук', 'Гарри Поттер', 'Шрек', 'Мона Лиза', 'Майкл Джексон', 
  'Терминатор', 'Пикачу', 'Джек Воробей', 'Бэтмен', 'Альберт Эйнштейн', 
  'Клеопатра', 'Дарт Вейдер', 'Эльза', 'Губка Боб', 'Шерлок Холмс'
];

const WhoAmIGame = ({ onBack }) => {
  const [stage, setStage] = useState('menu'); // menu, play
  const [character, setCharacter] = useState('');

  // Выбор нового персонажа
  const nextCharacter = () => {
    const random = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    setCharacter(random);
  };

  const startGame = () => {
    nextCharacter();
    setStage('play');
  };

  // --- СТИЛИ (Neon Party Style) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#12002f', // Глубокий фиолетовый
      color: '#fff', fontFamily: '"Segoe UI", sans-serif', overflow: 'hidden'
    },
    header: {
      display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '40px'
    },
    backBtn: {
      position: 'absolute', left: 0, top: 0, background: 'none', border: 'none', color: '#00f2ff', cursor: 'pointer'
    },
    neonTitle: {
      fontSize: '2.5rem', fontWeight: '900', color: '#fff',
      textShadow: '0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 40px #ff00de',
      textAlign: 'center', margin: 0, textTransform: 'uppercase'
    },
    neonCard: {
      flex: 1, background: 'rgba(255, 255, 255, 0.05)', border: '4px solid #00f2ff',
      borderRadius: '30px', margin: '20px 0', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      boxShadow: '0 0 20px #00f2ff, inset 0 0 20px #00f2ff', padding: '20px'
    },
    charText: {
      fontSize: '3.5rem', fontWeight: '900', color: '#fff',
      textShadow: '0 0 15px #00f2ff', margin: 0, lineHeight: '1.1'
    },
    btnStart: {
      background: '#ff00de', color: '#fff', border: 'none', padding: '20px',
      borderRadius: '50px', fontSize: '1.5rem', fontWeight: 'bold',
      boxShadow: '0 0 20px #ff00de', cursor: 'pointer', marginTop: 'auto'
    },
    btnNext: {
      background: 'none', border: '3px solid #00f2ff', color: '#00f2ff',
      padding: '15px 30px', borderRadius: '50px', fontSize: '1.2rem',
      fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center',
      gap: '10px', boxShadow: '0 0 10px #00f2ff'
    },
    hint: {
      color: '#00f2ff', opacity: 0.8, fontSize: '0.9rem', marginTop: '15px', fontWeight: 'bold'
    }
  };

  // 1. МЕНЮ
  if (stage === 'menu') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}><ArrowLeft size={30}/></button>
          <h1 style={styles.neonTitle}>КТО Я?</h1>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{position: 'relative', marginBottom: '30px'}}>
             <HelpCircle size={100} color="#ff00de" style={{filter: 'drop-shadow(0 0 10px #ff00de)'}} />
             <Sparkles size={40} color="#00f2ff" style={{position: 'absolute', top: -10, right: -10}} />
          </div>
          <p style={{textAlign: 'center', fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '600'}}>
            Прислони телефон ко лбу!<br/>
            Друзья должны объяснить,<br/>
            какой персонаж на экране.
          </p>
          <button style={{...styles.btnStart, width: '100%'}} onClick={startGame}>ИГРАТЬ</button>
        </div>
      </div>
    );
  }

  // 2. ИГРА
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{...styles.neonTitle, fontSize: '1.5rem'}}>ОТГАДАЙ КТО ТЫ:</h1>
      </div>
      
      <div style={styles.neonCard}>
        <h2 style={styles.charText}>{character}</h2>
        <p style={styles.hint}>ПОКАЖИТЕ ЭКРАН ДРУЗЬЯМ</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
        <button style={styles.btnNext} onClick={nextCharacter}>
          <RefreshCcw size={24} /> СЛЕДУЮЩИЙ
        </button>
      </div>
      
      <button style={{background: 'none', border: 'none', color: '#666', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setStage('menu')}>
        ЗАКОНЧИТЬ
      </button>
    </div>
  );
};

export default WhoAmIGame;

import React, { useState } from 'react';
// Уютные иконки
import { Eraser, CheckCircle, ArrowLeft, RotateCcw, Palmtree } from 'lucide-react';

const TARGET_WORD = "АРБУЗ";
const ALPHABET = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю']
];

const FiveLettersGame = ({ onBack }) => {
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState('playing');

  // Добавление буквы
  // // Обновляет строку, если она еще не заполнена
  const addLetter = (char) => {
    if (gameState !== 'playing' || guesses[currentRow].length >= 5) return;
    const newGuesses = [...guesses];
    newGuesses[currentRow] += char;
    setGuesses(newGuesses);
  };

  // Удаление буквы
  // // Стирает последний введенный символ
  const removeLetter = () => {
    if (gameState !== 'playing' || guesses[currentRow].length === 0) return;
    const newGuesses = [...guesses];
    newGuesses[currentRow] = newGuesses[currentRow].slice(0, -1);
    setGuesses(newGuesses);
  };

  // Проверка слова
  // // Сравнивает результат и переводит на новую строку или завершает игру
  const submitGuess = () => {
    if (gameState !== 'playing' || guesses[currentRow].length !== 5) return;

    if (guesses[currentRow] === TARGET_WORD) {
      setGameState('won');
    } else if (currentRow === 5) {
      setGameState('lost');
    } else {
      setCurrentRow(prev => prev + 1);
    }
  };

  // --- СТИЛИ (Paper Cutout Style) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '15px', display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#FFF9EB', // Цвет старой бумаги
      color: '#433422', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'
    },
    grid: {
      display: 'grid', gridTemplateRows: 'repeat(6, 1fr)', gap: '10px',
      maxWidth: '320px', margin: '0 auto', width: '100%'
    },
    tile: (char, colIdx, rowIdx) => {
      let bg = '#FFF';
      let rotate = (colIdx % 2 === 0 ? '1deg' : '-1deg'); // Легкая кривизна "вырезанной" бумаги
      let border = '2px solid #E6D5B8';

      if (rowIdx < currentRow || (gameState !== 'playing' && rowIdx === currentRow)) {
        if (TARGET_WORD[colIdx] === char) {
          bg = '#A7D397'; // Зеленый картон
        } else if (TARGET_WORD.includes(char)) {
          bg = '#F7BB64'; // Желтый картон
        } else {
          bg = '#D2DEEB'; // Серый/голубой картон
        }
        border = '2px solid rgba(0,0,0,0.1)';
      }

      return {
        aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', fontWeight: '900', background: bg, border,
        transform: `rotate(${rotate})`,
        boxShadow: '3px 3px 0px rgba(67, 52, 34, 0.1)', // Тень как у бумаги
        borderRadius: '4px'
      };
    },
    keyboard: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
    key: {
      background: '#FFF', border: '2px solid #433422', color: '#433422', borderRadius: '8px',
      padding: '10px 4px', fontSize: '0.9rem', cursor: 'pointer', flex: 1,
      fontWeight: 'bold', boxShadow: '2px 2px 0px #433422'
    },
    statusBox: {
      background: '#FF8B8B', color: '#FFF', padding: '15px', borderRadius: '15px',
      textAlign: 'center', border: '3px solid #433422', boxShadow: '5px 5px 0px #433422',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={{background: '#433422', border: 'none', color: '#FFF', padding: '8px', borderRadius: '10px'}}><ArrowLeft size={20}/></button>
        <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: '900'}}>5 БУКВ</h2>
        <Palmtree color="#A7D397" />
      </div>

      <div style={styles.grid}>
        {guesses.map((row, rIdx) => (
          <div key={rIdx} style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px'}}>
            {Array(5).fill('').map((_, cIdx) => (
              <div key={cIdx} style={styles.tile(row[cIdx], cIdx, rIdx)}>
                {row[cIdx]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameState !== 'playing' && (
        <div style={styles.statusBox}>
          <h3 style={{margin: 0}}>{gameState === 'won' ? 'УРА! ОТГАДАЛИ!' : `УПС! ЭТО БЫЛО: ${TARGET_WORD}`}</h3>
          <button 
            onClick={() => window.location.reload()} 
            style={{marginTop: '10px', background: '#FFF', border: '2px solid #433422', padding: '5px 15px', borderRadius: '8px', fontWeight: 'bold'}}
          >
            ЕЩЁ РАЗ
          </button>
        </div>
      )}

      <div style={styles.keyboard}>
        {ALPHABET.map((row, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'center', gap: '5px'}}>
            {row.map(char => (
              <button key={char} style={styles.key} onClick={() => addLetter(char)}>{char}</button>
            ))}
          </div>
        ))}
        <div style={{display: 'flex', gap: '10px'}}>
          <button style={{...styles.key, background: '#FF8B8B', flex: 1}} onClick={removeLetter}><Eraser size={18}/></button>
          <button style={{...styles.key, background: '#A7D397', flex: 2}} onClick={submitGuess}><CheckCircle size={18}/> ГОТОВО</button>
        </div>
      </div>
    </div>
  );
};

export default FiveLettersGame;

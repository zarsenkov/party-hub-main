import React, { useState } from 'react';
// // Используем только необходимые иконки
import { Eraser, CheckCircle, ArrowLeft, Palmtree, RefreshCcw } from 'lucide-react';

// // Список простых слов для игры
const WORDS_BANK = ["АРБУЗ", "ЭКРАН", "ПОЕЗД", "ОКЕАН", "СПОРТ", "КНИГА", "РУЧКА"];

const FiveLettersGame = ({ onBack }) => {
  const [wordIdx, setWordIdx] = useState(0); // Индекс текущего слова
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost

  const TARGET_WORD = WORDS_BANK[wordIdx];

  const ALPHABET = [
    ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
    ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
    ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю']
  ];

  // // Логика добавления буквы в текущую строку
  const addLetter = (char) => {
    if (gameState !== 'playing' || guesses[currentRow].length >= 5) return;
    const newGuesses = [...guesses];
    newGuesses[currentRow] += char;
    setGuesses(newGuesses);
  };

  // // Удаление буквы
  const removeLetter = () => {
    if (gameState !== 'playing' || guesses[currentRow].length === 0) return;
    const newGuesses = [...guesses];
    newGuesses[currentRow] = newGuesses[currentRow].slice(0, -1);
    setGuesses(newGuesses);
  };

  // // Проверка слова и переход к следующему или финал
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

  // // Сброс для следующего слова
  const nextWord = () => {
    if (wordIdx + 1 < WORDS_BANK.length) {
      setWordIdx(prev => prev + 1);
      setGuesses(Array(6).fill(''));
      setCurrentRow(0);
      setGameState('playing');
    } else {
      alert("Вы прошли все слова!");
      onBack();
    }
  };

  // --- СТИЛИ (Paper Cutout с фиксом высоты) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, 
      padding: '10px 15px env(safe-area-inset-bottom, 20px)', // Фикс для iPhone
      display: 'flex', flexDirection: 'column',
      zIndex: 1000, background: '#FFF9EB', color: '#433422'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px'
    },
    grid: {
      display: 'grid', gridTemplateRows: 'repeat(6, 1fr)', gap: '6px',
      maxWidth: '280px', margin: '10px auto', width: '100%', flex: 1
    },
    tile: (char, colIdx, rowIdx) => {
      let bg = '#FFF';
      let border = '2px solid #E6D5B8';
      if (rowIdx < currentRow || (gameState !== 'playing' && rowIdx === currentRow)) {
        if (TARGET_WORD[colIdx] === char) bg = '#A7D397';
        else if (TARGET_WORD.includes(char)) bg = '#F7BB64';
        else bg = '#D2DEEB';
        border = '2px solid rgba(0,0,0,0.1)';
      }
      return {
        aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', fontWeight: '900', background: bg, border,
        transform: `rotate(${colIdx % 2 === 0 ? '1deg' : '-1deg'})`,
        boxShadow: '2px 2px 0px rgba(67, 52, 34, 0.1)', borderRadius: '6px'
      };
    },
    keyboard: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '10px' },
    key: {
      background: '#FFF', border: '2px solid #433422', color: '#433422', borderRadius: '5px',
      padding: '10px 0', fontSize: '0.8rem', cursor: 'pointer', flex: 1, fontWeight: '900',
      boxShadow: '2px 2px 0px #433422'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={{background: '#433422', border: 'none', color: '#FFF', padding: '5px 10px', borderRadius: '8px'}}><ArrowLeft size={20}/></button>
        <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Palmtree size={18} color="#A7D397" /><span style={{fontWeight: 900}}>СЛОВО {wordIdx + 1}</span></div>
        <div style={{width: 40}}></div>
      </div>

      <div style={styles.grid}>
        {guesses.map((row, rIdx) => (
          <div key={rIdx} style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px'}}>
            {Array(5).fill('').map((_, cIdx) => (
              <div key={cIdx} style={styles.tile(row[cIdx], cIdx, rIdx)}>{row[cIdx]}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={styles.keyboard}>
        {gameState !== 'playing' && (
          <div style={{background: '#433422', color: '#FFF', padding: '10px', borderRadius: '10px', textAlign: 'center', marginBottom: '10px'}}>
            <p style={{margin: '0 0 5px 0'}}>{gameState === 'won' ? 'ВЕРНО!' : `ОШИБКА! ЭТО: ${TARGET_WORD}`}</p>
            <button onClick={gameState === 'won' ? nextWord : () => window.location.reload()} style={{background: '#A7D397', border: 'none', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold'}}>
              {gameState === 'won' ? 'СЛЕДУЮЩЕЕ' : 'ПОВТОРИТЬ'}
            </button>
          </div>
        )}

        {ALPHABET.map((row, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'center', gap: '4px'}}>
            {row.map(char => (
              <button key={char} style={styles.key} onClick={() => addLetter(char)}>{char}</button>
            ))}
          </div>
        ))}
        
        <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
          <button style={{...styles.key, background: '#FF8B8B', color: '#FFF', flex: 1}} onClick={removeLetter}><Eraser size={20}/></button>
          <button style={{...styles.key, background: '#A7D397', color: '#FFF', flex: 2}} onClick={submitGuess}><CheckCircle size={20}/> ГОТОВО</button>
        </div>
      </div>
    </div>
  );
};

export default FiveLettersGame;

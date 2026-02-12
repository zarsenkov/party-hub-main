import React, { useState, useEffect } from 'react';

// // Компонент MemoryGame — игра на поиск парных карточек
const MemoryGame = () => {
  // === КОНСТАНТЫ ===
  // // Список эмодзи для карточек (можно заменить на пути к картинкам)
  const EMOJIS = ['❤️', '🥂', '🏠', '✈️', '💍', '🍕', '🎬', '🎁'];
  
  // === СОСТОЯНИЕ (STATE) ===
  const [cards, setCards] = useState([]); // // Массив объектов карточек
  const [flippedCards, setFlippedCards] = useState([]); // // Индексы открытых карточек
  const [matchedPairs, setMatchedPairs] = useState([]); // // Найденные пары
  const [moves, setMoves] = useState(0); // // Количество ходов
  const [isWon, setIsWon] = useState(false); // // Статус победы

  // === ИНИЦИАЛИЗАЦИЯ ИГРЫ ===
  // // Функция для создания и перемешивания колоды
  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji, isFlipped: false }));
    
    setCards(deck);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsWon(false);
  };

  // // Запуск игры при первом рендере
  useEffect(() => {
    initGame();
  }, []);

  // === ЛОГИКА ХОДА ===
  // // Обработка клика по карточке
  const handleCardClick = (index) => {
    // // Игнорируем клик, если карточка уже открыта или если уже открыты две другие
    if (flippedCards.length === 2 || matchedPairs.includes(index) || flippedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // // Если открыли вторую карточку — проверяем совпадение
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      
      if (cards[firstIndex].content === cards[secondIndex].content) {
        // // Если совпали — добавляем в список найденных
        setMatchedPairs(prev => {
          const updated = [...prev, firstIndex, secondIndex];
          if (updated.length === cards.length) setIsWon(true);
          return updated;
        });
        setFlippedCards([]);
      } else {
        // // Если не совпали — закрываем через секунду
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className="game-container">
      <style>{`
        .game-container { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; background: #FFF0F5; min-height: 100vh; padding: 20px; }
        .stats { margin-bottom: 20px; font-weight: bold; color: #D63384; font-size: 1.2rem; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 400px; width: 100%; }
        .card { height: 80px; background: #FF3D7F; border: 3px solid #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; box-shadow: 4px 4px 0 #000; transition: transform 0.2s; position: relative; }
        .card.flipped { background: #fff; transform: rotateY(180deg); }
        .card.matched { background: #58E08E; cursor: default; }
        .win-message { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 100; }
        .btn-restart { margin-top: 15px; padding: 10px 20px; background: #FFD32D; border: 3px solid #000; font-weight: 900; border-radius: 10px; cursor: pointer; box-shadow: 4px 4px 0 #000; }
      `}</style>

      <h1 style={{ fontWeight: 900, marginBottom: '10px' }}>MEMORY LOVE</h1>
      <div className="stats">Ходов: {moves} | Пары: {matchedPairs.length / 2} / {EMOJIS.length}</div>

      <div className="grid">
        {cards.map((card, index) => {
          const isFlipped = flippedCards.includes(index) || matchedPairs.includes(index);
          const isMatched = matchedPairs.includes(index);

          return (
            <div 
              key={card.id} 
              className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {isFlipped ? card.content : '?'}
            </div>
          );
        })}
      </div>

      {isWon && (
        <div className="win-message">
          <h2 style={{ fontSize: '2rem' }}>ВЫ — ИДЕАЛЬНАЯ ПАРА! ❤️</h2>
          <p>Все совпадения найдены за {moves} ходов</p>
          <button className="btn-restart" onClick={initGame}>ЕЩЕ РАЗ ↻</button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Подключаемся к серверу (адрес определится после деплоя на Amvera)
const socket = io('https://твой-адрес.amvera.io'); 

const OnlineLoveStory = () => {
  const [screen, setScreen] = useState('menu');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomId, setRoomId] = useState('12345'); // ID комнаты для пары
  const [words, setWords] = useState(['Любовь', 'Свидание', 'Поцелуй']); // Для примера
  const [timeLeft, setTimeLeft] = useState(60);

  // === ЭФФЕКТ ОНЛАЙНА ===
  useEffect(() => {
    // Слушаем обновления от партнера
    socket.on('update_game', (data) => {
      if (data.score !== undefined) setScore(data.score);
      if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
      if (data.screen !== undefined) setScreen(data.screen);
    });

    return () => socket.off('update_game');
  }, []);

  // Функция для отправки своего действия партнеру
  const sendAction = (updates) => {
    socket.emit('game_action', {
      roomId,
      ...updates
    });
  };

  // Пример функции угадывания с синхронизацией
  const handleGuessed = () => {
    const newScore = score + 1;
    const newIndex = currentIndex + 1;
    
    setScore(newScore);
    setCurrentIndex(newIndex);
    
    // Отправляем партнеру новые данные
    sendAction({ score: newScore, currentIndex: newIndex });
  };

  const joinRoom = () => {
    socket.emit('join_room', roomId);
    setScreen('setup');
  };

  return (
    <div className="container pink">
      {screen === 'menu' && (
        <div style={{textAlign: 'center'}}>
          <input 
            style={{padding: '10px', borderRadius: '10px', border: '3px solid #000'}}
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)} 
            placeholder="Введите ID комнаты"
          />
          <button className="btn-main" onClick={joinRoom}>СОЗДАТЬ/ВОЙТИ</button>
        </div>
      )}
      
      {screen === 'game' && (
        <div className="card">
          <h2>Счет партнера и ваш: {score}</h2>
          <h1>{words[currentIndex]}</h1>
          <button className="btn-action btn-guess" onClick={handleGuessed}>УГАДАНО</button>
        </div>
      )}
      {/* Остальной UI как в обычном LoveStory */}
    </div>
  );
};

export default OnlineLoveStory;

// src/OnlineLoveStory.jsx

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './OnlineLoveStory.css';

// ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
// На локалке используй 'http://localhost:3001'. Для Amvera измени на свой URL.
const socket = io('http://localhost:3001');

const OnlineLoveStory = () => {
  // === ВСЕ СОСТОЯНИЯ ИЗ CANVA ===
  const [screen, setScreen] = useState('menu'); // menu, create, join, waiting, game, results
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameLog, setGameLog] = useState([]);
  
  const timerInterval = useRef(null);

  // === БАНК СЛОВ ===
  const wordBanks = [
    'Свидание', 'Кольцо', 'Любовь', 'Сердце', 'Поцелуй', 'Цветы', 'Романтика', 'Ужин', 'Шоколад', 'Прогулка'
  ];

  // === СЕТЕВАЯ СИНХРОНИЗАЦИЯ ===
  useEffect(() => {
    // Обновление списка игроков
    socket.on('update_players', (playerList) => {
      setPlayers(playerList);
    });

    // Слушаем команды от партнера
    socket.on('update_game', (data) => {
      if (data.start) {
        setWords(data.words);
        setTimeLeft(data.time);
        setScreen('game');
        startTimer();
      }
      if (data.score !== undefined) setScore(data.score);
      if (data.currentIndex !== undefined) setCurrentIndex(data.currentIndex);
      if (data.gameLog !== undefined) setGameLog(data.gameLog);
    });

    return () => {
      socket.off('update_players');
      socket.off('update_game');
    };
  }, []);

  // === ФУНКЦИИ ТАЙМЕРА ===
  const startTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          setScreen('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // === ОБРАБОТЧИКИ КНОПОК ===

  // // Создание комнаты
  const handleCreateRoom = () => {
    if (!playerName) return alert("Введите имя!");
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsHost(true);
    socket.emit('join_room', { code, name: playerName, isHost: true });
    setScreen('waiting');
  };

  // // Вход в комнату
  const handleJoinRoom = () => {
    if (!playerName || !roomCode) return alert("Введите имя и код!");
    setIsHost(false);
    socket.emit('join_room', { code: roomCode, name: playerName, isHost: false });
    setScreen('waiting');
  };

  // // Старт игры (только Хост)
  const handleStartGame = () => {
    const shuffled = [...wordBanks].sort(() => Math.random() - 0.5);
    const initialTime = 60;
    
    // Отправляем всем команду начать
    socket.emit('game_action', {
      code: roomCode,
      start: true,
      words: shuffled,
      time: initialTime
    });

    setWords(shuffled);
    setTimeLeft(initialTime);
    setScreen('game');
    startTimer();
  };

  // // Кнопка "Угадано"
  const handleGuess = () => {
    const newScore = score + 1;
    const nextIndex = currentIndex + 1;
    const newLog = [...gameLog, { word: words[currentIndex], ok: true }];

    setScore(newScore);
    setCurrentIndex(nextIndex);
    setGameLog(newLog);

    // Синхронизируем с партнером
    socket.emit('game_action', {
      code: roomCode,
      score: newScore,
      currentIndex: nextIndex,
      gameLog: newLog
    });
  };

  // // Кнопка "Пропустить"
  const handleSkip = () => {
    const nextIndex = currentIndex + 1;
    const newLog = [...gameLog, { word: words[currentIndex], ok: false }];

    setCurrentIndex(nextIndex);
    setGameLog(newLog);

    // Синхронизируем
    socket.emit('game_action', {
      code: roomCode,
      currentIndex: nextIndex,
      gameLog: newLog
    });
  };

  return (
    <div id="app">
      {/* МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <p style={{fontWeight: 800, marginBottom: '32px'}}>ОБЪЯСНИ СЛОВА ОНЛАЙН!</p>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '400px'}}>
              <button className="btn-main" onClick={() => setScreen('create')}>➕ СОЗДАТЬ</button>
              <button className="btn-main" onClick={() => setScreen('join')}>🔗 ВОЙТИ</button>
            </div>
          </div>
        </div>
      )}

      {/* СОЗДАНИЕ */}
      {screen === 'create' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen('menu')}>← НАЗАД</button>
          <div className="menu-content">
             <div style={{background: '#fff', padding: '10px', border: '4px solid #000', borderRadius: '15px', color: '#000', width: '100%'}}>
                <h3>НАСТРОЙКИ</h3>
                <input className="setting-input" placeholder="Твое имя" onChange={(e) => setPlayerName(e.target.value)} />
                <button className="btn-main" onClick={handleCreateRoom}>СОЗДАТЬ КОМНАТУ</button>
             </div>
          </div>
        </div>
      )}

      {/* ВВОД КОДА */}
      {screen === 'join' && (
        <div className="container purple">
          <button className="btn-back-home" onClick={() => setScreen('menu')}>← НАЗАД</button>
          <div className="menu-content">
             <input className="setting-input" placeholder="Твое имя" onChange={(e) => setPlayerName(e.target.value)} />
             <input className="setting-input" placeholder="Код комнаты" onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
             <button className="btn-main" onClick={handleJoinRoom}>ПРИСОЕДИНИТЬСЯ</button>
          </div>
        </div>
      )}

      {/* ОЖИДАНИЕ */}
      {screen === 'waiting' && (
        <div className="container blue">
          <div className="room-code-display">{roomCode}</div>
          <div className="card">
            <h3 style={{color: '#000'}}>ИГРОКИ В КОМНАТЕ:</h3>
            {players.map((p, i) => (
              <div key={i} style={{fontSize: '1.2rem', fontWeight: 700}}>
                {p.isHost ? '👑 ' : '👤 '}{p.name}
              </div>
            ))}
          </div>
          {isHost && players.length > 1 && (
            <button className="btn-main" onClick={handleStartGame}>СТАРТ ИГРЫ ✓</button>
          )}
        </div>
      )}

      {/* ИГРА */}
      {screen === 'game' && (
        <div className="container pink">
          <div className="game-header" style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className={`pill ${timeLeft < 10 ? 'warning' : ''}`} style={{background: '#3FB6FF'}}>⏱️ {timeLeft}</div>
            <div className="pill" style={{background: '#FFD32D', color: '#000'}}>ОЧКИ: {score}</div>
          </div>
          <div className="card">
            <div className="word-display">{words[currentIndex] || "СЛОВА ЗАКОНЧИЛИСЬ"}</div>
          </div>
          <div className="btn-grid">
            <button className="btn-action btn-skip" onClick={handleSkip}>✕</button>
            <button className="btn-action btn-guess" onClick={handleGuess}>✓</button>
          </div>
        </div>
      )}

      {/* РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="container white">
          <div className="menu-content">
            <h2 style={{fontSize: '2rem'}}>ИТОГ: {score}</h2>
            <div style={{width: '100%', maxHeight: '300px', overflowY: 'auto', border: '3px solid #000', borderRadius: '10px', margin: '20px 0'}}>
              {gameLog.map((item, i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee'}}>
                  <span>{item.word}</span>
                  <span>{item.ok ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
            <button className="btn-main" onClick={() => window.location.reload()}>В МЕНЮ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineLoveStory;

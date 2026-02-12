// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Создаем сервер сокетов с разрешением CORS для Amvera/Локалки
const io = new Server(server, {
  cors: {
    origin: "*", // Разрешаем доступ всем (для разработки)
    methods: ["GET", "POST"]
  }
});

// Хранилище комнат (в памяти сервера)
const rooms = {};

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  // Обработка входа в комнату
  socket.on('join_room', (data) => {
    const { code, name, isHost } = data;
    socket.join(code);
    
    if (!rooms[code]) {
      rooms[code] = [];
    }
    
    // Добавляем игрока в список комнаты
    rooms[code].push({ id: socket.id, name, isHost });
    
    // Рассылаем всем в комнате обновленный список игроков
    io.to(code).emit('update_players', rooms[code]);
    console.log(`Игрок ${name} вошел в ${code}`);
  });

  // Пересылка игровых действий (клики, очки, старт)
  socket.on('game_action', (data) => {
    // data должна содержать roomCode
    socket.to(data.code).emit('update_game', data);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
    // Здесь можно добавить логику удаления игрока из списка комнат
  });
});

// Порт для Amvera или 3001 для локалки
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

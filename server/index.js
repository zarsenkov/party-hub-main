// Импортируем необходимые библиотеки
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Настраиваем Socket.io с разрешением CORS для твоего домена
const io = new Server(server, {
  cors: {
    origin: "*", // В продакшене лучше указать конкретный домен
    methods: ["GET", "POST"]
  }
});

// Логика подключений
io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  // Игрок заходит в комнату (например, по ID пары)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Игрок ${socket.id} зашел в комнату: ${roomId}`);
  });

  // Передача игрового состояния (слово, таймер, счет) второму игроку
  socket.on('send_update', (data) => {
    // Рассылаем данные всем в комнате, кроме отправителя
    socket.to(data.roomId).emit('receive_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

// Запуск сервера на порту 3001 или том, что даст Amvera
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

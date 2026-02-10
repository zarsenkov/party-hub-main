import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Подключаем компоненты игр из папок
import AliasGame from './components/Alias/AliasGame';
import CrocodileGame from './components/Crocodile/CrocodileGame';

// Твой CSS файл
import './App.css';

// --- ДАННЫЕ ИГР С ТВОИМИ КЛАССАМИ ---
const GAMES = [
  {
    id: 'alias',
    className: 'alias', // Использует --card-alias
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость, не называя запретных слов.',
    footer: '2+ ИГРОКА',
    badge: 'NEW',
    ready: true
  },
  {
    id: 'crocodile',
    className: 'crocodile', // Использует --card-croc
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Классика пантомимы: показывай слова только жестами.',
    footer: '3+ ИГРОКА',
    ready: true
  },
  {
    id: 'whoami',
    className: 'whoami', // Использует --card-whoami
    title: 'КТО Я?',
    icon: '👤',
    desc: 'Угадай персонажа на своем лбу, задавая вопросы друзьям.',
    footer: '2-8 ИГРОКОВ',
    ready: false
  },
  {
    id: 'quiz',
    className: 'quiz',
    title: 'ВИКТОРИНА',
    icon: '🧠',
    desc: 'Битва умов: отвечайте на интересные вопросы.',
    footer: '1-10 ИГРОКОВ',
    ready: false
  },
  {
    id: '5-letters',
    className: 'one-letter', // Твой класс для 5 букв
    title: '5 БУКВ',
    icon: '📝',
    desc: 'Угадай секретное слово за шесть попыток.',
    footer: '1 ИГРОК',
    ready: false
  },
  {
    id: 'cities',
    className: 'city-quest',
    title: 'ГОРОДА РФ',
    icon: '🇷🇺',
    desc: 'Интересные места и факты со всей России.',
    footer: '1-4 ИГРОКА',
    ready: false
  },
  {
    id: 'bunker',
    className: 'danetki', // Можно использовать фиолетовый для бункера
    title: 'БУНКЕР',
    icon: '🛡️',
    desc: 'Убеди всех, что именно ты должен выжить.',
    footer: '4-12 ИГРОКОВ',
    ready: false
  },
  {
    id: 'spy',
    className: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого, пока он не раскрыл локацию.',
    footer: '3-10 ИГРОКОВ',
    ready: false
  },
  {
    id: 'couples',
    className: 'couples',
    title: 'LOVE MOMENTS',
    icon: '❤️',
    desc: 'Задания для самых близких и укрепления отношений.',
    footer: '2 ИГРОКА',
    badge: 'HOT',
    ready: false
  }
];

export default function App() {
  // Состояние для переключения между лендингом и игрой
  const [activeGame, setActiveGame] = useState(null);

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ---

  // Если открыта игра Alias
  if (activeGame === 'alias') {
    return <AliasGame onBack={() => setActiveGame(null)} />;
  }

  // Если открыта игра Крокодил
  if (activeGame === 'crocodile') {
    return <CrocodileGame onBack={() => setActiveGame(null)} />;
  }

  // Основной лендинг
  return (
    <div className="neo-wrapper">
      {/* Шапка по твоему дизайну */}
      <header className="neo-header">
        <h1 className="neo-logo">LOVECOUPLE</h1>
        <p className="neo-subtitle">ТВОЯ ПЛАНЕТА РАЗВЛЕЧЕНИЙ</p>
      </header>

      {/* Сетка карточек */}
      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            // Формируем классы: neo-card + цвет + locked (если не готова)
            className={`neo-card ${game.className} ${!game.ready ? 'locked' : ''}`}
            // Анимация из Framer Motion (легкое нажатие)
            whileTap={game.ready ? { scale: 0.95 } : {}}
            onClick={() => {
              if (game.ready) {
                setActiveGame(game.id);
              } else {
                alert("Эта игра скоро появится!");
              }
            }}
          >
            {/* Твой значок (Badge) */}
            {game.badge && <div className="neo-badge">{game.badge}</div>}
            
            {/* Твои элементы карточки */}
            <div className="neo-icon">{game.icon}</div>
            <h2 className="neo-title">{game.title}</h2>
            <p className="neo-desc">{game.desc}</p>
            
            {/* Твой футер внутри карточки */}
            <div className="neo-footer">{game.footer}</div>
          </motion.div>
        ))}
      </main>

      {/* Твой футер со ссылками */}
      <footer className="neo-footer-links">
        <a href="https://lovecouple.ru" className="footer-link">LOVECOUPLE.RU</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM CHANNEL</a>
      </footer>
    </div>
  );
}

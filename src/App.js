import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Импорты твоих игр
import AliasGame from './components/Alias/AliasGame';
import CrocodileGame from './components/Crocodile/CrocodileGame';

import './App.css';

// --- ДАННЫЕ С УЧЕТОМ ТВОИХ КЛАССОВ ---
const GAMES = [
  {
    id: 'alias',
    className: 'alias', // Соответствует var(--card-alias)
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость!',
    footer: '2+ ИГРОКА',
    badge: 'NEW',
    ready: true
  },
  {
    id: 'crocodile',
    className: 'crocodile', // Соответствует var(--card-croc)
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Показывай жестами без слов!',
    footer: '3+ ИГРОКА',
    ready: true
  },
  {
    id: 'spy',
    className: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого среди своих.',
    footer: '3-10 ИГРОКОВ',
    ready: false
  },
  {
    id: 'couples',
    className: 'couples',
    title: 'LOVE MOMENTS',
    icon: '❤️',
    desc: 'Задания для самых близких.',
    footer: '2 ИГРОКА',
    badge: 'HOT',
    ready: false
  },
  {
    id: 'whoami',
    className: 'whoami',
    title: 'КТО Я?',
    icon: '👤',
    desc: 'Угадай персонажа на лбу.',
    footer: '2-8 ИГРОКОВ',
    ready: false
  },
  {
    id: 'mafia',
    className: 'mafia',
    title: 'МАФИЯ',
    icon: '🎭',
    desc: 'Город засыпает...',
    footer: '6-16 ИГРОКОВ',
    ready: false
  }
];

export default function App() {
  // Состояние текущей игры
  const [activeGame, setActiveGame] = useState(null);

  // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ---
  if (activeGame === 'alias') return <AliasGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'crocodile') return <CrocodileGame onBack={() => setActiveGame(null)} />;

  return (
    <div className="neo-wrapper">
      {/* Шапка сайта */}
      <header className="neo-header">
        <h1 className="neo-logo">LOVECOUPLE</h1>
        <p className="neo-subtitle">ТВОЯ ПЛАНЕТА РАЗВЛЕЧЕНИЙ</p>
      </header>

      {/* Сетка карточек */}
      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            // Формируем строку классов: neo-card + класс цвета + класс locked (если не готова)
            className={`neo-card ${game.className} ${!game.ready ? 'locked' : ''}`}
            whileHover={game.ready ? { scale: 1.02 } : {}}
            whileTap={game.ready ? { scale: 0.95 } : {}}
            onClick={() => game.ready ? setActiveGame(game.id) : null}
          >
            {/* Твой бейдж */}
            {game.badge && <div className="neo-badge">{game.badge}</div>}
            
            {/* Твоя иконка */}
            <div className="neo-icon">{game.icon}</div>
            
            {/* Твой заголовок и описание */}
            <h2 className="neo-title">{game.title}</h2>
            <p className="neo-desc">{game.desc}</p>
            
            {/* Твой футер карточки */}
            <div className="neo-footer">{game.footer}</div>
          </motion.div>
        ))}
      </main>

      {/* Твой футер со ссылками */}
      <footer className="neo-footer-links">
        <a href="https://lovecouple.ru" className="footer-link">LOVECOUPLE.RU</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM</a>
      </footer>
    </div>
  );
}

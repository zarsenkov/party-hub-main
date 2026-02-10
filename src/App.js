// --- ИМПОРТЫ ---
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Подключаем файлы игр, которые ты только что создал
import AliasGame from './components/Alias/AliasGame'; 
import CrocodileGame from './components/Crocodile/CrocodileGame';

// Подключаем стили
import './App.css';

// --- СПИСОК ИГР ДЛЯ ЛЕНДИНГА ---
const GAMES = [
  {
    id: 'alias',
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость!',
    color: '#B2F5EA', // Мятный
  },
  {
    id: 'crocodile',
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Показывай жестами без слов!',
    color: '#C6F6D5', // Зеленый
  },
  {
    id: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого среди своих.',
    color: '#FFD93D',
  }
];

export default function App() {
  // Состояние: какая игра сейчас открыта. null = лендинг.
  const [activeGame, setActiveGame] = useState(null);

  // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ ---

  // 1. Если выбрали Alias
  if (activeGame === 'alias') {
    return <AliasGame onBack={() => setActiveGame(null)} />;
  }

  // 2. Если выбрали Крокодила
  if (activeGame === 'crocodile') {
    return <CrocodileGame onBack={() => setActiveGame(null)} />;
  }

  // 3. Если ничего не выбрано — показываем ЛЕНДИНГ
  return (
    <div className="neo-wrapper">
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="neo-logo">LOVECOUPLE</h1>
        <p className="subtitle-style">ТВОЯ ПЛАНЕТА РАЗВЛЕЧЕНИЙ</p>
      </header>

      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="neo-card"
            style={{ backgroundColor: game.color }}
            // При клике меняем состояние, и React сам переключит экран
            onClick={() => setActiveGame(game.id)}
          >
            <div style={{ fontSize: '54px', marginBottom: '25px' }}>{game.icon}</div>
            <h2 className="title-style">{game.title}</h2>
            <p className="desc-style">{game.desc}</p>
          </motion.div>
        ))}
      </main>

      <footer className="footer-links-style">
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM NEWS</a>
      </footer>
    </div>
  );
}

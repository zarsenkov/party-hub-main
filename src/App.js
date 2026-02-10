// --- ИМПОРТЫ ---
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Импортируем готовые компоненты игр
import AliasGame from './components/Alias/AliasGame'; 
import CrocodileGame from './components/Crocodile/CrocodileGame';

// Подключаем стили хаба
import './App.css';

// --- ПОЛНЫЙ СПИСОК ИГР ДЛЯ ЛЕНДИНГА ---
const GAMES = [
  {
    id: 'alias',
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость!',
    color: '#B2F5EA', // Мятный
    ready: true
  },
  {
    id: 'crocodile',
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Показывай жестами без слов!',
    color: '#C6F6D5', // Зеленый
    ready: true
  },
  {
    id: 'who-am-i',
    title: 'КТО Я?',
    icon: '👤',
    desc: 'Угадай персонажа на своем лбу.',
    color: '#FEFCBF', // Желтый
    ready: false
  },
  {
    id: 'quiz',
    title: 'ВИКТОРИНА',
    icon: '🧠',
    desc: 'Битва умов для компании.',
    color: '#BEE3F8', // Голубой
    ready: false
  },
  {
    id: '5-letters',
    title: '5 БУКВ',
    icon: '📝',
    desc: 'Угадай слово из 5 букв.',
    color: '#FED7E2', // Розовый
    ready: false
  },
  {
    id: 'cities-rf',
    title: 'ГОРОДА РФ',
    icon: '🇷🇺',
    desc: 'Интересные места России.',
    color: '#E9D8FD', // Фиолетовый
    ready: false
  },
  {
    id: 'bunker',
    title: 'БУНКЕР',
    icon: '🛡️',
    desc: 'Выживи в апокалипсисе.',
    color: '#FEEBC8', // Оранжевый
    ready: false
  },
  {
    id: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого среди своих.',
    color: '#FFD93D',
    ready: false
  }
];

export default function App() {
  // Состояние: какая игра сейчас открыта. null = лендинг.
  const [activeGame, setActiveGame] = useState(null);

  // --- ФУНКЦИЯ ОБРАБОТКИ КЛИКА ---
  const handleGameClick = (game) => {
    if (game.ready) {
      // Если игра готова — открываем её
      setActiveGame(game.id);
    } else {
      // Если игра в разработке — показываем сообщение
      alert(`Игра "${game.title}" находится в разработке и скоро появится!`);
    }
  };

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ИГР ---
  // 1. Alias
  if (activeGame === 'alias') {
    return <AliasGame onBack={() => setActiveGame(null)} />;
  }

  // 2. Crocodile
  if (activeGame === 'crocodile') {
    return <CrocodileGame onBack={() => setActiveGame(null)} />;
  }

  // --- ГЛАВНЫЙ ЭКРАН (ЛЕНДИНГ) ---
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
            style={{ 
              backgroundColor: game.color,
              opacity: game.ready ? 1 : 0.8 // Немного приглушаем не готовые игры
            }}
            onClick={() => handleGameClick(game)}
          >
            {/* Если игра не готова, можно добавить значок "Скоро" */}
            {!game.ready && <div className="soon-badge">SOON</div>}
            
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

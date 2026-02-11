import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Подключаем компоненты игр из папок
import AliasGame from './components/Alias/AliasGame';
import CrocodileGame from './components/Crocodile/CrocodileGame';
import SpyGame from './components/Spy/SpyGame';
import QuizGame from './components/Quiz/QuizGame';
import WhoamiGame from './components/WhoAmi';


// Твой CSS файл
import './App.css';

// --- ДАННЫЕ ИГР С ТВОИМИ КЛАССАМИ ---
const GAMES = [
  {
    id: 'alias',
    className: 'alias', // Розовый
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость, не называя однокоренных.',
    footer: '2+ ИГРОКА',
    badge: 'NEW',
    ready: true
  },
  {
    id: 'crocodile',
    className: 'crocodile', // Зеленый
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Показывай слова жестами и мимикой без лишних звуков.',
    footer: '3+ ИГРОКА',
    ready: true
  },
  {
    id: 'spy',
    className: 'spy', // Мятный
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли шпиона по глупым ответам на вопросы.',
    footer: '3-10 ИГРОКОВ',
    ready: true
  },
  {
    id: 'whoami',
    className: 'whoami', // Бежевый
    title: 'КТО Я?',
    icon: '👤',
    desc: 'Угадай персонажа на своем лбу, задавая вопросы "Да" или "Нет".',
    footer: '2-8 ИГРОКОВ',
    ready: true
  },
  {
    id: 'quiz',
    className: 'quiz', // Голубой
    title: 'ВИКТОРИНА',
    icon: '🧠',
    desc: 'Сразись интеллектом в разных категориях знаний.',
    footer: '1-10 ИГРОКОВ',
    ready: true
  },
  {
    id: '5-letters',
    className: 'one-letter', // Бирюзовый
    title: '5 БУКВ',
    icon: '📝',
    desc: 'Ежедневная головоломка: угадай слово из 5 букв.',
    footer: '1 ИГРОК',
    ready: false
  },
  {
    id: 'city-quest',
    className: 'city-quest', // Желтый
    title: 'ГОРОДА РФ',
    icon: '🇷🇺',
    desc: 'Проверь, как хорошо ты знаешь географию своей страны.',
    footer: '1-4 ИГРОКА',
    ready: false
  },
  {
    id: 'bunker',
    className: 'danetki', // Фиолетовый
    title: 'БУНКЕР',
    icon: '🛡️',
    desc: 'Убеди остальных, что ты достоин места в убежище.',
    footer: '4-12 ИГРОКОВ',
    ready: false
  },
  {
    id: 'couples',
    className: 'couples', // Светло-розовый
    title: 'LOVE MOMENTS',
    icon: '❤️',
    desc: 'Укрепляйте отношения через милые и честные задания.',
    footer: '2 ИГРОКА',
    badge: 'HOT',
    ready: false
  },
  {
    id: 'mafia',
    className: 'mafia', // Серый
    title: 'МАФИЯ',
    icon: '🎭',
    desc: 'Город засыпает... Проверь свою интуицию и блеф.',
    footer: '6-16 ИГРОКОВ',
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
  
// Если открыта игра Шпион
  if (activeGame === 'spy') {
    return <SpyGame onBack={() => setActiveGame(null)} />;
  }
  
  // Если открыта игра Квиз
  if (activeGame === 'quiz') {
    return <QuizGame onBack={() => setActiveGame(null)} />;
  }
  
  // Если открыта игра Квиз
  if (activeGame === 'whoami') {
    return <WhoAmiGame onBack={() => setActiveGame(null)} />;
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

      {/* Футер со ссылками */}
      <footer className="neo-footer-links">
        <a href="https://lovecouple.ru" className="footer-link">LOVECOUPLE.RU</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM CHANNEL</a>
      </footer>
    </div>
  );
}

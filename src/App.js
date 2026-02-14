import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Подключаем компоненты игр из папок
import AliasGame from './components/Alias/AliasGame';
import NeverHaveIEver from './components/Never/NeverHaveIEver';
import SpyGame from './components/Spy/SpyGame';
import QuizGame from './components/Quiz/QuizGame';
import WhoAmIGame from './components/WhoAmI/WhoAmIGame';
import FiveLettersGame from './components/FiveLetters/FiveLettersGame';
import CityGuide from './components/CityGuide/CityGuide';
import MafiaGame from './components/Mafia/MafiaGame';
import LoveStory from './components/LoveStory/LoveStory';

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
    id: 'Never',
    className: 'Never', // Зеленый
    title: 'Я никогда не',
    icon: '🤯',
    desc: 'Признавайся в самых курьезных поступках и узнавай тайны друзей',
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
  id: 'voices',            // Новый ID
  className: 'quiz',      // Голубой цвет из CSS
  title: 'ГОЛОСА В ГОЛОВЕ',
  icon: '👥',             // Иконка группы людей
  desc: 'Выбирайте, кто из вас вероятнее всего совершит безумный поступок.',
  footer: '3+ ИГРОКА',
  ready: true
},
    {
    id: 'city-guide',
    className: 'mafia', // Или создай в App.css класс .archive { background: #e4e0d9; }
    title: 'РФ-АРХИВ',
    icon: '🇷🇺',
    desc: 'Небанальные места в городах России: бары, секретные локации, ивенты.',
    footer: 'ГИД', // Добавил футер для единообразия
    ready: true
  },
  {
    id: 'couples',
    className: 'couples', // Светло-розовый
    title: 'LOVE STORY',
    icon: '❤️',
    desc: 'Укрепляйте отношения через милые и честные задания.',
    footer: '2 ИГРОКА',
    badge: 'HOT',
    ready: true
  },
  {
    id: 'mafia',
    className: 'mafia', // Серый
    title: 'МАФИЯ',
    icon: '🎭',
    desc: 'Город засыпает... Проверь свою интуицию и блеф.',
    footer: '6-16 ИГРОКОВ',
    ready: true
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
  if (activeGame === 'Never') {
    return <NeverGame onBack={() => setActiveGame(null)} />;
  }
  
// Если открыта игра Шпион
  if (activeGame === 'spy') {
    return <SpyGame onBack={() => setActiveGame(null)} />;
  }
  
  // Если открыта игра Квиз
  if (activeGame === 'quiz') {
    return <QuizGame onBack={() => setActiveGame(null)} />;
  }
  
  // Если открыта игра КТО Я
  if (activeGame === 'whoami') {
    return <WhoAmIGame onBack={() => setActiveGame(null)} />;
  }
  
    // Если открыта игра 5 БУКВ
  if (activeGame === '5-letters') {
    return <FiveLettersGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'city-guide') return <CityGuide onBack={() => setActiveGame(null)} />;
  
  if (activeGame === 'mafia') return <MafiaGame onBack={() => setActiveGame(null)} />;

  if (activeGame === 'couples') {
    return <LoveStory onBack={() => setActiveGame(null)} />;
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

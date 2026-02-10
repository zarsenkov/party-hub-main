import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- ДАННЫЕ ИГР (РАСШИРЕННЫЙ СПИСОК) ---
const GAMES = [
  {
    id: 'alias',
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова на скорость, не называя запретных слов.',
    footer: '2+ ИГРОКА',
    color: '#B2F5EA', // Мятный
    badge: 'NEW',
    url: 'https://alias-pop.vercel.app'
  },
  {
    id: 'who-am-i',
    title: 'КТО Я?',
    icon: '👤',
    desc: 'Угадай персонажа на своем лбу, задавая вопросы друзьям.',
    footer: '2-8 ИГРОКОВ',
    color: '#FEFCBF', // Желтый
    url: '#' 
  },
  {
    id: 'quiz',
    title: 'ВИКТОРИНА',
    icon: '🧠',
    desc: 'Битва умов: отвечай на вопросы из разных областей знаний.',
    footer: '1-10 ИГРОКОВ',
    color: '#BEE3F8', // Голубой
    url: '#'
  },
  {
    id: 'crocodile',
    title: 'КРОКОДИЛ',
    icon: '🐊',
    desc: 'Классика пантомимы: показывай слова только жестами.',
    footer: '3+ ИГРОКА',
    color: '#C6F6D5', // Зеленоватый
    url: '#'
  },
  {
    id: '5-letters',
    title: '5 БУКВ',
    icon: '📝',
    desc: 'Угадай секретное слово из пяти букв за шесть попыток.',
    footer: '1 ИГРОК',
    color: '#FED7E2', // Розовый
    url: '#'
  },
  {
    id: 'cities-rf',
    title: 'ГОРОДА РФ',
    icon: '🇷🇺',
    desc: 'Путешествуй по России: угадывай интересные места и факты.',
    footer: '1-4 ИГРОКА',
    color: '#E9D8FD', // Фиолетовый
    url: '#'
  },
  {
    id: 'bunker',
    title: 'БУНКЕР',
    icon: '🛡️',
    desc: 'Дискуссионная игра: убеди всех, что именно ты должен выжить.',
    footer: '4-12 ИГРОКОВ',
    color: '#FEEBC8', // Оранжевый
    url: '#'
  },
  {
    id: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого среди своих, пока он не раскрыл локацию.',
    footer: '3-10 ИГРОКОВ',
    color: '#FFD93D',
    url: 'https://spy-pop-party.vercel.app'
  },
  {
    id: 'couples',
    title: 'LOVE MOMENTS',
    icon: '❤️',
    desc: 'Укрепляйте отношения: задания для самых близких.',
    footer: '2 ИГРОКА',
    color: '#FFB7B2',
    badge: 'HOT',
    url: 'https://love-moments.vercel.app'
  }
];

export default function App() {
  const [isFading, setIsFading] = useState(false);

  // --- ФУНКЦИЯ ПЕРЕХОДА ---
  const handleGameClick = (url) => {
    // Если ссылки еще нет (стоит #), ничего не делаем
    if (url === '#') {
      alert("Эта игра скоро появится!");
      return;
    }
    
    setIsFading(true);
    // Ждем анимации перед редиректом
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  return (
    <div className="neo-wrapper">
      {/* Плавный черный экран при переходе */}
      <AnimatePresence>
        {isFading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={overlayStyle}
          />
        )}
      </AnimatePresence>

      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="neo-logo">LOVECOUPLE</h1>
        <p style={subtitleStyle}>ТВОЯ ПЛАНЕТА РАЗВЛЕЧЕНИЙ</p>
      </header>

      {/* Сетка карточек подстраивается под количество игр автоматически */}
      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="neo-card"
            style={{ backgroundColor: game.color }}
            onClick={() => handleGameClick(game.url)}
          >
            {/* Значки "NEW", "HOT" и т.д. */}
            {game.badge && <div style={badgeStyle}>{game.badge}</div>}
            
            {/* Иконка игры */}
            <div style={{ fontSize: '54px', marginBottom: '25px' }}>{game.icon}</div>
            
            {/* Заголовок и описание */}
            <h2 style={titleStyle}>{game.title}</h2>
            <p style={descStyle}>{game.desc}</p>
            
            {/* Нижняя часть карточки */}
            <div style={footerStyle}>{game.footer}</div>
          </motion.div>
        ))}
      </main>

      <footer style={footerLinksStyle}>
        <a href="http://lovecouple.ru/" className="footer-link">LOVECOUPLE.RU</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM CHANNEL</a>
      </footer>
    </div>
  );
}

// --- СТИЛИ (ОСТАЮТСЯ ПРЕЖНИМИ ДЛЯ ЕДИНООБРАЗИЯ) ---
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: '#1A202C', zIndex: 9999, pointerEvents: 'all'
};

const subtitleStyle = { fontWeight: 800, letterSpacing: '4px', fontSize: '12px', opacity: 0.6 };
const badgeStyle = { position: 'absolute', top: '20px', right: '20px', background: '#1A202C', color: 'white', padding: '6px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: 900 };
const titleStyle = { fontFamily: 'Unbounded', fontSize: '24px', marginBottom: '12px', fontWeight: 900 };
const descStyle = { fontSize: '15px', fontWeight: 600, opacity: 0.8, marginBottom: '40px' };
const footerStyle = { marginTop: 'auto', fontSize: '11px', fontWeight: 900, opacity: 0.5 };
const footerLinksStyle = { marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' };

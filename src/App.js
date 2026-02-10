import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- СПИСОК ВСЕХ ИГР ---
// Добавляем Alias и настраиваем цвета под наш Neo-Pop стиль
const GAMES = [
  {
    id: 'alias',
    title: 'ALIAS NEO',
    icon: '🗣️',
    desc: 'Объясняй слова, не называя их. Динамичная игра для любой компании.',
    footer: '2+ ИГРОКА',
    color: '#B2F5EA', // Мятный (Mint)
    badge: 'NEW',
    url: 'https://alias-pop.vercel.app' // Сюда вставь ссылку на свой Alias
  },
  {
    id: 'couples',
    title: 'LOVE MOMENTS',
    icon: '❤️',
    desc: 'Укрепляйте отношения: задания и вопросы для самых близких.',
    footer: '2 ИГРОКА',
    color: '#FFB7B2',
    badge: 'HOT',
    url: 'https://love-moments.vercel.app'
  },
  {
    id: 'spy',
    title: 'ШПИОН',
    icon: '🕵️',
    desc: 'Вычисли чужого, пока он не узнал локацию.',
    footer: '3-10 ИГРОКОВ',
    color: '#FFD93D',
    badge: 'POP-RETRO',
    url: 'https://spy-pop-party.vercel.app'
  },
  {
    id: 'mafia',
    title: 'МАФИЯ',
    icon: '🎭',
    desc: 'Город засыпает... Сможешь ли ты вычислить убийцу?',
    footer: '6-16 ИГРОКОВ',
    color: '#CBD5E0',
    url: 'https://mafia-noir.vercel.app/'
  },
  {
    id: 'danetki',
    title: 'ДАНЕТКИ',
    icon: '💡',
    desc: 'Запутанные истории, где важен только твой вопрос.',
    footer: '2+ ИГРОКА',
    color: '#E9D8FD',
    url: 'https://danetki-offline.vercel.app/'
  }
];

export default function App() {
  // Состояние для анимации затухания экрана
  const [isFading, setIsFading] = useState(false);

  // Функция для плавного перехода по ссылке
  const handleGameClick = (url) => {
    setIsFading(true); // Включаем черный оверлей
    // Через полсекунды (время анимации) делаем редирект
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  return (
    <div className="neo-wrapper">
      {/* Анимация черного экрана при переходе на игру */}
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

      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            // Анимация при наведении и нажатии
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="neo-card"
            style={{ backgroundColor: game.color }}
            onClick={() => handleGameClick(game.url)}
          >
            {/* Показываем значок (HOT, NEW и т.д.), если он есть */}
            {game.badge && <div style={badgeStyle}>{game.badge}</div>}
            
            <div style={{ fontSize: '54px', marginBottom: '25px' }}>{game.icon}</div>
            <h2 style={titleStyle}>{game.title}</h2>
            <p style={descStyle}>{game.desc}</p>
            <div style={footerStyle}>{game.footer}</div>
          </motion.div>
        ))}
      </main>

      <footer style={footerLinksStyle}>
        <a href="http://lovecouple.ru/" className="footer-link">LOVECOUPLE.RU</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM</a>
      </footer>
    </div>
  );
}

// --- ИНЛАЙН СТИЛИ ---
// Оверлей для эффекта "киношного" затухания
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: '#1A202C', zIndex: 9999, pointerEvents: 'all'
};

// Подзаголовок под логотипом
const subtitleStyle = { fontWeight: 800, letterSpacing: '4px', fontSize: '12px', opacity: 0.6 };

// Маленькие плашки (Badges) на карточках
const badgeStyle = { 
  position: 'absolute', top: '20px', right: '20px', 
  background: '#1A202C', color: 'white', padding: '6px 14px', 
  borderRadius: '100px', fontSize: '10px', fontWeight: 900 
};

// Стили заголовка внутри карточки
const titleStyle = { fontFamily: 'Unbounded', fontSize: '24px', marginBottom: '12px', fontWeight: 900 };

// Описание игры в карточке
const descStyle = { fontSize: '15px', fontWeight: 600, opacity: 0.8, marginBottom: '40px' };

// Нижняя часть карточки (кол-во игроков)
const footerStyle = { marginTop: 'auto', fontSize: '11px', fontWeight: 900, opacity: 0.5 };

// Навигация в самом низу страницы
const footerLinksStyle = { marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' };

import React, { useState, useEffect } from 'react'; // // Добавили useEffect
import { motion } from 'framer-motion';

// Подключаем компоненты игр
import AliasGame from './components/Alias/AliasGame';
import NeverHaveIEver from './components/Never/NeverHaveIEver';
import SpyGame from './components/Spy/SpyGame';
import QuizGame from './components/Voice/QuizGame';
import WhoAmIGame from './components/WhoAmI/WhoAmIGame';
import CityGuide from './components/CityGuide/CityGuide';
import MafiaGame from './components/Mafia/MafiaGame';
import LoveStory from './components/LoveStory/LoveStory';

import './App.css';

const GAMES = [
  /* ... твой массив GAMES без изменений ... */
  { id: 'alias', className: 'alias', title: 'ALIAS NEO', icon: '🗣️', desc: 'Объясняй слова на скорость, не называя однокоренных.', footer: '2+ ИГРОКА', badge: 'NEW', ready: true },
  { id: 'Never', className: 'Never', title: 'Я никогда не', icon: '🤯', desc: 'Признавайся в самых курьезных поступках и узнавай тайны друзей', footer: '3+ ИГРОКА', ready: true },
  { id: 'spy', className: 'spy', title: 'ШПИОН', icon: '🕵️', desc: 'Вычисли шпиона по глупым ответам на вопросы.', footer: '3-10 ИГРОКОВ', ready: true },
  { id: 'whoami', className: 'whoami', title: 'КТО Я?', icon: '👤', desc: 'Угадай персонажа на своем лбу, задавая вопросы "Да" или "Нет".', footer: '2-8 ИГРОКОВ', ready: true },
  { id: 'voices', className: 'quiz', title: 'ГОЛОСА В ГОЛОВЕ', icon: '👥', desc: 'Выбирайте, кто из вас вероятнее всего совершит безумный поступок.', footer: '3+ ИГРОКА', ready: true },
  { id: 'city-guide', className: 'mafia', title: 'РФ-АРХИВ', icon: '🇷🇺', desc: 'Небанальные места в городах России: бары, секретные локации, ивенты.', footer: 'ГИД', ready: true },
  { id: 'couples', className: 'couples', title: 'LOVE STORY', icon: '❤️', desc: 'Укрепляйте отношения через милые и честные задания.', footer: '2 ИГРОКА', badge: 'HOT', ready: true },
  { id: 'mafia', className: 'mafia', title: 'МАФИЯ', icon: '🎭', desc: 'Город засыпает... Проверь свою интуицию и блеф.', footer: '6-16 ИГРОКОВ', ready: true }
];

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  // // СОСТОЯНИЯ ДЛЯ PWA (ANDROID И IOS)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // // ЭФФЕКТ ДЛЯ ОПРЕДЕЛЕНИЯ УСТРОЙСТВА
  useEffect(() => {
    // Логика для Android: ловим системное событие установки
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    // Логика для iOS: проверяем, что это Safari и не PWA режим
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIos && !isStandalone) {
      setShowInstallPrompt(true);
    }
  }, []);

  // // ФУНКЦИЯ УСТАНОВКИ ДЛЯ ANDROID
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      setShowInstallPrompt(false);
    }
  };

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ИГР ---
  if (activeGame === 'alias') return <AliasGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'Never') return <NeverHaveIEver onBack={() => setActiveGame(null)} />;
  if (activeGame === 'spy') return <SpyGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'voices') return <QuizGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'whoami') return <WhoAmIGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'city-guide') return <CityGuide onBack={() => setActiveGame(null)} />;
  if (activeGame === 'mafia') return <MafiaGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'couples') return <LoveStory onBack={() => setActiveGame(null)} />;

  return (
    <div className="neo-wrapper">
      <header className="neo-header">
        <h1 className="neo-logo">LOVECOUPLE</h1>
        <p className="neo-subtitle">ТВОЯ ПЛАНЕТА РАЗВЛЕЧЕНИЙ</p>
      </header>

      <main className="neo-grid">
        {GAMES.map((game) => (
          <motion.div
            key={game.id}
            className={`neo-card ${game.className} ${!game.ready ? 'locked' : ''}`}
            whileTap={game.ready ? { scale: 0.95 } : {}}
            onClick={() => game.ready ? setActiveGame(game.id) : alert("Скоро!")}
          >
            {game.badge && <div className="neo-badge">{game.badge}</div>}
            <div className="neo-icon">{game.icon}</div>
            <h2 className="neo-title">{game.title}</h2>
            <p className="neo-desc">{game.desc}</p>
            <div className="neo-footer">{game.footer}</div>
          </motion.div>
        ))}
      </main>

      <footer className="neo-footer-links">
        <a href="https://pay.cloudtips.ru/p/d2723585" className="footer-link">ПОДДЕРЖАТЬ ПРОЕКТ</a>
        <a href="https://t.me/LoveCouple_news" className="footer-link">TELEGRAM CHANNEL</a>
      </footer>

{showInstallPrompt && (
  <div className="install-prompt fade-in">
    <div className="install-prompt-content">
      {deferredPrompt ? (
        // --- ВИД ДЛЯ ANDROID С ДВУМЯ КНОПКАМИ ---
        <>
          <p>Установи <b>LOVECOUPLE</b> на рабочий стол</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={handleInstallClick} className="close-prompt">УСТАНОВИТЬ</button>
            {/* Кнопка "ОК/ПОЗЖЕ" просто скрывает плашку */}
            <button 
              onClick={() => setShowInstallPrompt(false)} 
              className="close-prompt" 
              style={{ background: '#eee', color: '#333' }}
            >
              ПОЗЖЕ
            </button>
          </div>
        </>
      ) : (
              // Вид для iOS
              <>
                <p>Добавь игру на экран <b>«Домой»</b></p>
                <div className="install-hint">
                  Нажми <span className="ios-share-icon">⎋</span> а затем <b>«На экран Домой»</b>
                </div>
                <button onClick={() => setShowInstallPrompt(false)} className="close-prompt">ОК</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

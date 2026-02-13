import React, { useState } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Иконка сердца
const HeartIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E94560" : "none"} stroke={active ? "#E94560" : "currentColor"} strokeWidth="2">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// // Иконка стрелки
const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const LoveStoryApp = () => {
  const [screen, setScreen] = useState('menu');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState([]);

  // // Склонение имен
  const dec = (n, t) => {
    if (!n) return ''; n = n.trim(); const l = n.toLowerCase(); const s = l.slice(-1);
    const stems = { 'я': { gen: 'и', dat: 'е' }, 'default': { gen: 'а', dat: 'у' } };
    const res = stems[s] || stems['default'];
    return t === 'gen' ? n.slice(0, s === 'я' ? -1 : n.length) + res.gen : t === 'dat' ? n.slice(0, s === 'я' ? -1 : n.length) + res.dat : n;
  };

  // // Обработка текста
  const parse = (t) => t
    .replace(/\[1:nom\]/g, names.name1).replace(/\[1:gen\]/g, dec(names.name1, 'gen'))
    .replace(/\[2:nom\]/g, names.name2).replace(/\[2:gen\]/g, dec(names.name2, 'gen'));

  const toggleFav = (cardText) => {
    const t = parse(cardText);
    setFavs(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);
  };

  return (
    <div className="game-root">
      <style>{fullScreenStyles}</style>

      {/* ШАПКА ВСЕГДА СВЕРХУ */}
      <header className="game-header">
        <button className="icon-btn" onClick={() => screen === 'menu' ? window.location.href='https://lovecouple.ru' : setScreen('menu')}>
          <ArrowIcon />
        </button>
        <div className="game-logo">MOMENTS</div>
        <button className="icon-btn" onClick={() => setScreen('favs')}>
          <HeartIcon active={favs.length > 0} />
        </button>
      </header>

      {/* КОНТЕНТ ЭКРАНОВ */}
      <main className="game-content">
        
        {screen === 'menu' && (
          <div className="view-full fade-in">
            <h1 className="hero-title">Love <br/> Story</h1>
            <p className="hero-sub">Игра для двоих, которая сближает</p>
            <div className="input-group">
              <input type="text" placeholder="Твое имя" value={names.name1} onChange={e => setNames({...names, name1: e.target.value})} />
              <input type="text" placeholder="Имя партнера" value={names.name2} onChange={e => setNames({...names, name2: e.target.value})} />
            </div>
            <button className="btn-main-action" onClick={() => names.name1 && names.name2 && setScreen('cats')}>
              НАЧАТЬ ИГРУ
            </button>
          </div>
        )}

        {screen === 'cats' && (
          <div className="view-full fade-in">
            <h2 className="screen-label">Выберите уровень</h2>
            <div className="cats-list">
              {CATEGORIES.map(c => (
                <div key={c.id} className="cat-card-full" onClick={() => { setCurrentCat(c.id); setIdx(0); setScreen('game'); }}>
                  <span className="cat-emoji-big">{c.emoji}</span>
                  <div className="cat-texts">
                    <div className="cat-name-big">{c.name}</div>
                    <div className="cat-desc-small">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'game' && currentCat && (
          <div className="view-full fade-in">
            <div className="game-play-area">
              <div className="play-tag">{CARDS[currentCat][idx].type}</div>
              <div className="play-text-main">{parse(CARDS[currentCat][idx].text)}</div>
              <div className="play-controls">
                <button className="btn-circle-fav" onClick={() => toggleFav(CARDS[currentCat][idx].text)}>
                   <HeartIcon active={favs.includes(parse(CARDS[currentCat][idx].text))} />
                </button>
                <button className="btn-next-card" onClick={() => setIdx((idx + 1) % CARDS[currentCat].length)}>
                  СЛЕДУЮЩИЙ ВОПРОС
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'favs' && (
          <div className="view-full fade-in">
            <h2 className="screen-label">Избранное</h2>
            <div className="favs-container">
              {favs.length === 0 ? <p className="empty">Список пуст</p> : 
                favs.map((f, i) => <div key={i} className="fav-item-full">{f}</div>)
              }
            </div>
            <button className="btn-main-action secondary" onClick={() => setScreen('cats')}>НАЗАД</button>
          </div>
        )}

      </main>
    </div>
  );
};

// // CSS: ПОЛНОЭКРАННЫЙ РЕЖИМ
const fullScreenStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Playfair+Display:ital,wght@1,700&display=swap');

  :root {
    --bg: #0F0C29;
    --accent: #E94560;
    --card-bg: rgba(255, 255, 255, 0.05);
  }

  /* РАСТЯГИВАЕМ НА ВЕСЬ ЭКРАН */
  .game-root {
    position: fixed; inset: 0;
    background: linear-gradient(135deg, #0F0C29, #302B63, #24243E);
    color: #fff; font-family: 'Montserrat', sans-serif;
    display: flex; flex-direction: column; overflow: hidden;
  }

  /* ХЕДЕР */
  .game-header {
    height: 70px; display: flex; justify-content: space-between; align-items: center;
    padding: 0 20px; z-index: 10;
  }
  .game-logo { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.4rem; letter-spacing: 2px; }
  .icon-btn { background: none; border: none; color: #fff; cursor: pointer; padding: 10px; }

  /* КОНТЕНТНАЯ ОБЛАСТЬ */
  .game-content { flex: 1; position: relative; display: flex; flex-direction: column; padding: 0 25px 30px; }
  .view-full { flex: 1; display: flex; flex-direction: column; justify-content: center; }

  /* ТИПОГРАФИКА */
  .hero-title { font-size: 4rem; line-height: 0.9; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; }
  .hero-sub { opacity: 0.6; font-size: 1rem; margin-bottom: 40px; }
  .screen-label { font-size: 1.5rem; text-transform: uppercase; margin-bottom: 25px; text-align: center; letter-spacing: 3px; }

  /* ПОЛЯ ВВОДА */
  .input-group input {
    width: 100%; background: var(--card-bg); border: 2px solid rgba(255,255,255,0.1);
    padding: 20px; border-radius: 15px; color: #fff; font-size: 1.1rem; margin-bottom: 15px;
    font-family: inherit; transition: 0.3s;
  }
  .input-group input:focus { border-color: var(--accent); outline: none; background: rgba(255,255,255,0.1); }

  /* КНОПКИ */
  .btn-main-action {
    background: var(--accent); color: #fff; border: none; padding: 22px;
    border-radius: 18px; font-weight: 900; font-size: 1.1rem; cursor: pointer;
    box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4); text-transform: uppercase;
  }
  .btn-main-action.secondary { background: rgba(255,255,255,0.1); box-shadow: none; margin-top: 20px; }

  /* КАРТОЧКИ КАТЕГОРИЙ */
  .cats-list { display: flex; flex-direction: column; gap: 15px; }
  .cat-card-full {
    background: var(--card-bg); padding: 25px; border-radius: 20px;
    display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.05);
    transition: 0.3s; cursor: pointer;
  }
  .cat-card-full:active { transform: scale(0.98); background: var(--accent); }
  .cat-emoji-big { font-size: 2.5rem; }
  .cat-name-big { font-size: 1.3rem; font-weight: 900; text-transform: uppercase; }
  .cat-desc-small { font-size: 0.8rem; opacity: 0.5; }

  /* ИГРОВАЯ ЗОНА */
  .game-play-area {
    background: #fff; color: #000; border-radius: 35px; padding: 40px 30px;
    min-height: 70vh; display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  }
  .play-tag { font-size: 0.8rem; font-weight: 900; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; text-align: center; }
  .play-text-main { font-family: 'Playfair Display', serif; font-size: 2rem; font-style: italic; line-height: 1.2; text-align: center; margin: 40px 0; }
  
  .play-controls { display: flex; gap: 15px; align-items: center; }
  .btn-next-card { flex: 1; background: #000; color: #fff; border: none; padding: 20px; border-radius: 15px; font-weight: 900; cursor: pointer; }
  .btn-circle-fav { background: #f0f0f0; border: none; width: 60px; height: 60px; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

  /* ИЗБРАННОЕ */
  .favs-container { flex: 1; overflow-y: auto; }
  .fav-item-full { background: var(--card-bg); padding: 20px; border-radius: 15px; margin-bottom: 10px; font-size: 0.9rem; border-left: 4px solid var(--accent); }

  /* АНИМАЦИЯ */
  .fade-in { animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default LoveStoryApp;

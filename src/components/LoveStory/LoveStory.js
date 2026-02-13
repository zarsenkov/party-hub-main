import React, { useState, useEffect } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Минималистичная иконка сердца (Stroke style)
const HeartIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E94560" : "none"} stroke={active ? "#E94560" : "currentColor"} strokeWidth="1.5">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// // Иконка навигации назад
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const LoveStoryApp = () => {
  const [screen, setScreen] = useState('names');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState([]);

  // // Склонение (сокращенная версия для чистоты кода)
  const dec = (n, t) => {
    if (!n) return ''; n = n.trim(); const l = n.toLowerCase(); const s = l.slice(-1);
    const stems = { 'я': { gen: 'и', dat: 'е' }, 'default': { gen: 'а', dat: 'у' } };
    const res = stems[s] || stems['default'];
    return t === 'gen' ? n.slice(0, s === 'я' ? -1 : n.length) + res.gen : t === 'dat' ? n.slice(0, s === 'я' ? -1 : n.length) + res.dat : n;
  };

  const parse = (t) => t.replace(/\[1:nom\]/g, names.name1).replace(/\[1:gen\]/g, dec(names.name1, 'gen')).replace(/\[2:nom\]/g, names.name2).replace(/\[2:gen\]/g, dec(names.name2, 'gen'));

  const toggleFav = (cardText) => {
    const t = parse(cardText);
    setFavs(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);
  };

  return (
    <div className="dark-theme-root">
      <style>{styles}</style>

      {/* ШАПКА С КНОПКОЙ НА ЛЕНДИНГ */}
      <header className="app-header">
        <a href="https://lovecouple.ru" className="landing-link">
          <ArrowLeft /> <span>lovecouple.ru</span>
        </a>
        <div className="logo">MOMENTS</div>
      </header>

      <main className="container">
        {screen === 'names' && (
          <div className="view-center">
            <h2 className="fade-in">Представьтесь</h2>
            <div className="input-box">
              <input type="text" placeholder="Твое имя" value={names.name1} onChange={e => setNames({...names, name1: e.target.value})} />
              <input type="text" placeholder="Его/Ее имя" value={names.name2} onChange={e => setNames({...names, name2: e.target.value})} />
            </div>
            <button className="btn-next" onClick={() => names.name1 && names.name2 && setScreen('cats')}>Начать</button>
          </div>
        )}

        {screen === 'cats' && (
          <div className="view-cats fade-in">
            <div className="section-title">Выберите атмосферу</div>
            <div className="grid">
              {CATEGORIES.map(c => (
                <div key={c.id} className="card-cat" onClick={() => { setCurrentCat(c.id); setIdx(0); setScreen('game'); }}>
                  <div className="cat-meta">
                    <span className="cat-name">{c.name}</span>
                    <span className="cat-desc">{c.desc}</span>
                  </div>
                  <span className="cat-emoji">{c.emoji}</span>
                </div>
              ))}
              <div className="card-cat fav-card" onClick={() => setScreen('favs')}>
                <div className="cat-meta"><span className="cat-name">Избранное</span></div>
                <HeartIcon active={true} />
              </div>
            </div>
          </div>
        )}

        {screen === 'game' && currentCat && (
          <div className="view-game fade-in">
            <button className="back-btn" onClick={() => setScreen('cats')}><ArrowLeft /> Назад</button>
            <div className="play-card">
              <div className="play-header">
                <span className="tag">{CARDS[currentCat][idx].type}</span>
                <button className="fav-trigger" onClick={() => toggleFav(CARDS[currentCat][idx].text)}>
                  <HeartIcon active={favs.includes(parse(CARDS[currentCat][idx].text))} />
                </button>
              </div>
              <div className="play-content">{parse(CARDS[currentCat][idx].text)}</div>
              <div className="play-footer">
                <button className="btn-secondary" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>Назад</button>
                <button className="btn-primary-next" onClick={() => setIdx((idx + 1) % CARDS[currentCat].length)}>Далее</button>
              </div>
            </div>
          </div>
        )}

        {screen === 'favs' && (
          <div className="view-favs fade-in">
            <button className="back-btn" onClick={() => setScreen('cats')}><ArrowLeft /> Назад</button>
            <h3>Сохраненное</h3>
            {favs.length === 0 ? <p className="empty">Тут пока пусто</p> : 
              favs.map((f, i) => <div key={i} className="fav-row">{f}</div>)
            }
          </div>
        )}
      </main>
    </div>
  );
};

// // Элегантный темный стиль
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@1,600&display=swap');

  .dark-theme-root {
    min-height: 100vh; background: #0F3460; color: #E9E9E9;
    font-family: 'Inter', sans-serif; padding: 20px;
    background: radial-gradient(circle at top right, #16213E, #0F3460);
  }

  .app-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 0 40px; }
  .logo { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.5rem; letter-spacing: 2px; }
  .landing-link { display: flex; align-items: center; gap: 8px; color: #E94560; text-decoration: none; font-size: 0.9rem; font-weight: 600; }

  .view-center { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 20vh; }
  .input-box input {
    background: rgba(255,255,255,0.05); border: none; border-bottom: 1px solid rgba(255,255,255,0.2);
    padding: 15px; color: white; width: 280px; margin-bottom: 20px; font-size: 1.1rem; transition: 0.3s;
  }
  .input-box input:focus { border-bottom-color: #E94560; outline: none; background: rgba(255,255,255,0.1); }

  .btn-next, .btn-primary-next {
    background: #E94560; color: white; border: none; padding: 15px 40px; border-radius: 4px;
    font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
  }
  .btn-secondary { background: none; border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px 25px; cursor: pointer; border-radius: 4px; }

  .grid { display: grid; gap: 20px; margin-top: 30px; }
  .card-cat {
    background: #16213E; border-radius: 12px; padding: 25px;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; transition: 0.3s; border: 1px solid rgba(255,255,255,0.05);
  }
  .card-cat:hover { transform: translateY(-5px); border-color: #E94560; box-shadow: 0 10px 30px rgba(233, 69, 96, 0.2); }
  .cat-name { display: block; font-size: 1.2rem; font-weight: 600; margin-bottom: 5px; }
  .cat-desc { font-size: 0.8rem; opacity: 0.5; }
  .cat-emoji { font-size: 1.5rem; opacity: 0.8; }

  .play-card {
    background: #16213E; padding: 40px; border-radius: 20px; min-height: 400px;
    display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3); position: relative;
  }
  .play-content { font-family: 'Playfair Display', serif; font-size: 1.8rem; line-height: 1.4; font-style: italic; }
  .tag { text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; color: #E94560; }
  .play-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }

  .back-btn { background: none; border: none; color: white; display: flex; align-items: center; gap: 10px; cursor: pointer; opacity: 0.6; margin-bottom: 20px; }
  .fav-trigger { background: none; border: none; cursor: pointer; color: white; }
  
  .fav-row { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px; font-size: 0.9rem; }
  
  .fade-in { animation: fadeIn 0.8s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default LoveStoryApp;

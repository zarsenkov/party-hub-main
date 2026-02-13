import React, { useState, useEffect } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Уникальная иконка сердца (Neon Pulse)
const FavIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#ff4d94" : "none"} style={{ filter: active ? 'drop-shadow(0 0 5px #ff4d94)' : 'none', transition: 'all 0.3s' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={active ? "#ff4d94" : "#6b5b7a"} strokeWidth="1.5" />
  </svg>
);

// // Иконка выхода (Minimal Arrow)
const ExitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MomentsApp = () => {
  const [screen, setScreen] = useState('names');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState([]);

  // // Логика склонения
  const decline = (n, t) => {
    if (!n) return ''; n = n.trim(); const l = n.toLowerCase(); const s = l.slice(-1);
    if (s === 'я') return t === 'gen' ? n.slice(0, -1) + 'и' : t === 'dat' ? n.slice(0, -1) + 'е' : n;
    if (/[б-зк-нтф-щй]/.test(s)) return t === 'gen' ? n + 'а' : t === 'dat' ? n + 'у' : n;
    return n;
  };

  const parse = (txt) => {
    return txt
      .replace(/\[1:nom\]/g, names.name1).replace(/\[1:gen\]/g, decline(names.name1, 'gen')).replace(/\[1:dat\]/g, decline(names.name1, 'dat'))
      .replace(/\[2:nom\]/g, names.name2).replace(/\[2:gen\]/g, decline(names.name2, 'gen')).replace(/\[2:dat\]/g, decline(names.name2, 'dat'));
  };

  const handleFav = (card) => {
    const t = parse(card.text);
    favs.includes(t) ? setFavs(favs.filter(f => f !== t)) : setFavs([...favs, t]);
  };

  return (
    <div className="moments-root">
      <style>{customUI}</style>

      {/* FIXED NAV */}
      <nav className="top-nav">
        <a href="https://lovecouple.ru" className="nav-exit"><ExitIcon /></a>
        <div className="nav-logo">MOMENTS</div>
        <div className="nav-fav-count" onClick={() => setScreen('favs')}>
          <FavIcon active={favs.length > 0} />
          <span>{favs.length}</span>
        </div>
      </nav>

      <main className="main-stage">
        {screen === 'names' && (
          <section className="view-names">
            <h2 className="title-huge">First,<br/>Your Names</h2>
            <div className="input-glass-group">
              <input type="text" placeholder="Your Name" value={names.name1} onChange={e => setNames({...names, name1: e.target.value})} />
              <input type="text" placeholder="Partner's Name" value={names.name2} onChange={e => setNames({...names, name2: e.target.value})} />
            </div>
            <button className="btn-glow" onClick={() => names.name1 && names.name2 ? setScreen('cats') : null}>
              Create Magic
            </button>
          </section>
        )}

        {screen === 'cats' && (
          <section className="view-cats">
            <p className="subtitle">Choose your mood</p>
            <div className="cats-stack">
              {CATEGORIES.map(c => (
                <div key={c.id} className="cat-plate" onClick={() => { setCurrentCat(c.id); setIdx(0); setScreen('game'); }}>
                  <span className="cat-icon">{c.emoji}</span>
                  <div className="cat-info">
                    <h3>{c.name}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'game' && currentCat && (
          <section className="view-game">
             <div className="game-card-container">
                <div className="card-top-bar">
                   <span className="card-label">{CARDS[currentCat][idx].type}</span>
                   <button onClick={() => handleFav(CARDS[currentCat][idx])} className="btn-icon">
                      <FavIcon active={favs.includes(parse(CARDS[currentCat][idx].text))} />
                   </button>
                </div>
                <div className="card-body-text">{parse(CARDS[currentCat][idx].text)}</div>
                <div className="card-footer">
                   <button className="btn-text" onClick={() => setScreen('cats')}>Back to mood</button>
                   <button className="btn-next-step" onClick={() => setIdx((idx + 1) % CARDS[currentCat].length)}>Next Card</button>
                </div>
             </div>
          </section>
        )}

        {screen === 'favs' && (
          <section className="view-favs">
             <h2 className="title-small">Saved Moments</h2>
             <div className="favs-list">
                {favs.map((f, i) => <div key={i} className="fav-item">{f}</div>)}
                {favs.length === 0 && <p className="empty">No favorites yet...</p>}
             </div>
             <button className="btn-text" onClick={() => setScreen('cats')}>Back</button>
          </section>
        )}
      </main>
    </div>
  );
};

// // УНИКАЛЬНЫЙ ДИЗАЙН (Ambient UI)
const customUI = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');

  :root {
    --bg: #f8f4f9;
    --accent: #ff4d94;
    --text: #2d232e;
    --glass: rgba(255, 255, 255, 0.6);
  }

  .moments-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    padding: 20px;
    background-image: radial-gradient(circle at 10% 20%, rgba(255, 136, 204, 0.1) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(184, 143, 191, 0.1) 0%, transparent 40%);
  }

  .top-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 10px; margin-bottom: 40px;
  }
  .nav-logo { font-weight: 800; letter-spacing: -1px; font-size: 1.2rem; }
  .nav-exit, .nav-fav-count { cursor: pointer; display: flex; align-items: center; gap: 8px; color: var(--text); text-decoration: none;}

  .title-huge { font-size: 3.5rem; line-height: 0.9; font-weight: 800; margin-bottom: 40px; letter-spacing: -2px; }

  /* СТИЛЬ ИНПУТОВ */
  .input-glass-group input {
    width: 100%; background: var(--glass); border: 2px solid transparent;
    padding: 20px; border-radius: 20px; margin-bottom: 15px;
    font-family: inherit; font-size: 1.1rem; transition: 0.3s;
    backdrop-filter: blur(10px);
  }
  .input-glass-group input:focus { border-color: var(--accent); outline: none; background: #fff; }

  /* КНОПКА-ГЛОУ */
  .btn-glow {
    background: var(--text); color: #fff; border: none; padding: 20px 40px;
    border-radius: 50px; font-weight: 700; font-size: 1rem; cursor: pointer;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: 0.3s;
  }
  .btn-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255, 77, 148, 0.3); }

  /* КАРТОЧКИ КАТЕГОРИЙ */
  .cats-stack { display: flex; flex-direction: column; gap: 15px; }
  .cat-plate {
    background: #fff; padding: 25px; border-radius: 30px;
    display: flex; align-items: center; gap: 20px;
    transition: 0.3s; cursor: pointer; border: 1px solid rgba(0,0,0,0.03);
  }
  .cat-plate:hover { transform: scale(1.02); background: var(--accent); color: #fff; }
  .cat-icon { font-size: 2rem; }
  .cat-info h3 { margin: 0; font-size: 1.2rem; }
  .cat-info p { margin: 5px 0 0; font-size: 0.8rem; opacity: 0.7; }

  /* ЭКРАН ИГРЫ */
  .game-card-container {
    background: #fff; border-radius: 40px; padding: 40px; min-height: 450px;
    display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 0 30px 60px rgba(0,0,0,0.05);
  }
  .card-label { text-transform: uppercase; font-size: 0.7rem; font-weight: 800; letter-spacing: 2px; opacity: 0.4; }
  .card-body-text { font-size: 2rem; font-weight: 700; line-height: 1.2; margin: 40px 0; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; }
  
  .btn-next-step {
    background: var(--accent); color: #fff; border: none; padding: 15px 30px;
    border-radius: 20px; font-weight: 700; cursor: pointer;
  }
  .btn-text { background: none; border: none; font-weight: 700; color: var(--text); cursor: pointer; opacity: 0.5; }
  .btn-text:hover { opacity: 1; }
  .btn-icon { background: none; border: none; cursor: pointer; }

  .fav-item { background: #fff; padding: 15px; border-radius: 15px; margin-bottom: 10px; font-size: 0.9rem; }
`;

export default MomentsApp;

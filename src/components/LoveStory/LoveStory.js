import React, { useState } from 'react';
// // Данные игры: категории и сами карточки
import { CATEGORIES, CARDS } from './cardsData';

// // Иконка сердца
const HeartIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#FF4D6D" : "none"} stroke={active ? "#FF4D6D" : "currentColor"} strokeWidth="2">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LoveStoryApp = ({ onBack }) => {
  const [screen, setScreen] = useState('menu');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState([]);

  // // Улучшенное склонение имен (Русский язык)
  const declension = (name, type) => {
    if (!name) return type === 'gen' ? 'партнера' : type === 'dat' ? 'партнеру' : 'партнер';
    let n = name.trim();
    const last = n.slice(-1).toLowerCase();
    
    // // Простая логика окончаний для базовых имен
    if (type === 'gen') { // // Родительный (Кого?)
      if (['а', 'я'].includes(last)) return n.slice(0, -1) + (last === 'а' ? 'ы' : 'и');
      if (['й', 'ь'].includes(last)) return n.slice(0, -1) + 'я';
      return n + 'а';
    }
    if (type === 'dat') { // // Дательный (Кому?)
      if (['а', 'я'].includes(last)) return n.slice(0, -1) + 'е';
      if (['й', 'ь'].includes(last)) return n.slice(0, -1) + 'ю';
      return n + 'у';
    }
    return n;
  };

  // // Обработка текста карточки
  const parseText = (text) => {
    return text
      .replace(/\[1:nom\]/g, names.name1 || 'Ты')
      .replace(/\[1:gen\]/g, declension(names.name1, 'gen'))
      .replace(/\[2:nom\]/g, names.name2 || 'Партнер')
      .replace(/\[2:gen\]/g, declension(names.name2, 'gen'))
      .replace(/\[2:dat\]/g, declension(names.name2, 'dat'));
  };

  const toggleFav = (cardText) => {
    const t = parseText(cardText);
    setFavs(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);
  };

  return (
    <div className="love-root">
      <style>{silkStyles}</style>

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <nav className="love-nav">
        <button className="nav-btn" onClick={() => screen === 'menu' ? onBack() : setScreen('menu')}>
          {screen === 'menu' ? 'ВЫХОД' : 'МЕНЮ'}
        </button>
        <div className="nav-logo">MOMENTS</div>
        <button className="nav-btn fav-count" onClick={() => setScreen('favs')}>
          <HeartIcon active={favs.length > 0} />
          {favs.length > 0 && <span className="badge">{favs.length}</span>}
        </button>
      </nav>

      {/* КОНТЕНТ */}
      <main className="love-main">
        
        {screen === 'menu' && (
          <div className="view-center fade-in">
            <h1 className="love-title">Love<br/>Story</h1>
            <p className="love-subtitle">Особенные моменты для двоих</p>
            
            <div className="love-inputs">
              <input 
                type="text" 
                placeholder="Твое имя" 
                value={names.name1} 
                onChange={e => setNames({...names, name1: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Имя партнера" 
                value={names.name2} 
                onChange={e => setNames({...names, name2: e.target.value})} 
              />
            </div>
            
            <button className="btn-love-main" onClick={() => setScreen('cats')}>
              ПРОДОЛЖИТЬ
            </button>
          </div>
        )}

        {screen === 'cats' && (
          <div className="view-full fade-in">
            <h2 className="section-title">Выберите уровень</h2>
            <div className="love-cats-grid">
              {CATEGORIES.map(c => (
                <div key={c.id} className="love-cat-card" onClick={() => { setCurrentCat(c.id); setIdx(0); setScreen('game'); }}>
                  <span className="cat-emoji">{c.emoji}</span>
                  <div className="cat-info">
                    <span className="cat-name">{c.name}</span>
                    <span className="cat-desc">{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'game' && currentCat && (
          <div className="view-center fade-in">
            <div className="love-card-display">
              <div className="card-type">{CARDS[currentCat][idx].type}</div>
              <div className="card-text">“{parseText(CARDS[currentCat][idx].text)}”</div>
              
              <div className="card-footer">
                <button className="btn-fav" onClick={() => toggleFav(CARDS[currentCat][idx].text)}>
                   <HeartIcon active={favs.includes(parseText(CARDS[currentCat][idx].text))} />
                </button>
                <button className="btn-next" onClick={() => setIdx((idx + 1) % CARDS[currentCat].length)}>
                  СЛЕДУЮЩИЙ ВОПРОС
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'favs' && (
          <div className="view-full fade-in">
            <h2 className="section-title">Ваши моменты</h2>
            <div className="favs-list">
              {favs.length === 0 ? (
                <div className="empty-state">Пока здесь ничего нет...</div>
              ) : (
                favs.map((f, i) => (
                  <div key={i} className="fav-card">
                    <p>{f}</p>
                    <button className="remove-fav" onClick={() => setFavs(prev => prev.filter(item => item !== f))}>×</button>
                  </div>
                ))
              )}
            </div>
            <button className="btn-love-outline" onClick={() => setScreen('cats')}>НАЗАД</button>
          </div>
        )}

      </main>
    </div>
  );
};

// // CSS: SILK & VELVET STYLE
const silkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@300;600;800&display=swap');

  .love-root {
    position: fixed !important; inset: 0 !important;
    background: #fdfaf6 !important; /* Цвет слоновой кости */
    color: #4a3b3b !important; font-family: 'Montserrat', sans-serif !important;
    display: flex !important; flex-direction: column !important; overflow: hidden !important;
    z-index: 100000 !important;
  }

  /* НАВИГАЦИЯ */
  .love-nav {
    height: 80px !important; display: flex !important; justify-content: space-between !important;
    align-items: center !important; padding: 0 25px !important;
  }
  .nav-logo { font-family: 'Marcellus', serif !important; font-size: 1.2rem !important; letter-spacing: 4px !important; color: #8e7373 !important; }
  .nav-btn { 
    background: none !important; border: none !important; font-size: 0.7rem !important; 
    font-weight: 800 !important; letter-spacing: 1px !important; cursor: pointer !important; color: #8e7373 !important;
    position: relative !important;
  }
  .fav-count .badge {
    position: absolute; top: -5px; right: -5px; background: #FF4D6D; color: #fff;
    font-size: 10px; padding: 2px 6px; border-radius: 10px;
  }

  .love-main { flex: 1 !important; display: flex !important; flex-direction: column !important; padding: 0 25px 40px !important; position: relative !important; }
  .view-center { flex: 1 !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; text-align: center !important; }
  .view-full { flex: 1 !important; display: flex !important; flex-direction: column !important; }

  /* ЗАГОЛОВКИ */
  .love-title { font-family: 'Marcellus', serif !important; font-size: 4rem !important; line-height: 0.9 !important; margin-bottom: 15px !important; color: #4a3b3b !important; }
  .love-subtitle { font-size: 0.9rem !important; opacity: 0.6 !important; margin-bottom: 40px !important; font-weight: 300 !important; }
  .section-title { font-family: 'Marcellus', serif !important; font-size: 1.5rem !important; text-align: center !important; margin-bottom: 30px !important; }

  /* ВВОД */
  .love-inputs { width: 100% !important; max-width: 320px !important; margin-bottom: 30px !important; }
  .love-inputs input {
    width: 100% !important; background: #fff !important; border: 1px solid #e8e0d5 !important;
    padding: 18px !important; border-radius: 20px !important; margin-bottom: 12px !important;
    font-family: inherit !important; font-size: 1rem !important; text-align: center !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.02) !important;
  }

  /* КНОПКИ */
  .btn-love-main {
    background: #4a3b3b !important; color: #fff !important; border: none !important;
    padding: 20px 50px !important; border-radius: 40px !important; font-weight: 800 !important;
    letter-spacing: 2px !important; cursor: pointer !important; box-shadow: 0 10px 25px rgba(74, 59, 59, 0.2) !important;
  }
  .btn-love-outline {
    background: none !important; border: 1px solid #e8e0d5 !important; padding: 15px !important;
    border-radius: 20px !important; font-weight: 600 !important; margin-top: 20px !important; cursor: pointer !important;
  }

  /* КАТЕГОРИИ */
  .love-cats-grid { display: flex !important; flex-direction: column !important; gap: 15px !important; }
  .love-cat-card {
    background: #fff !important; padding: 20px !important; border-radius: 25px !important;
    display: flex !important; align-items: center !important; gap: 20px !important;
    cursor: pointer !important; border: 1px solid transparent !important; transition: 0.3s !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.03) !important;
  }
  .love-cat-card:active { transform: scale(0.97) !important; border-color: #8e7373 !important; }
  .cat-emoji { font-size: 2rem !important; }
  .cat-name { display: block !important; font-weight: 800 !important; font-size: 1.1rem !important; }
  .cat-desc { font-size: 0.75rem !important; opacity: 0.5 !important; }

  /* ИГРОВАЯ КАРТОЧКА */
  .love-card-display {
    background: #fff !important; width: 100% !important; max-width: 350px !important;
    min-height: 450px !important; border-radius: 40px !important; padding: 40px 30px !important;
    display: flex !important; flex-direction: column !important; justify-content: space-between !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.05) !important; border: 1px solid #f0ede9 !important;
  }
  .card-type { font-size: 0.7rem !important; font-weight: 800 !important; color: #FF4D6D !important; letter-spacing: 3px !important; text-transform: uppercase !important; }
  .card-text { font-family: 'Marcellus', serif !important; font-size: 1.8rem !important; line-height: 1.3 !important; color: #4a3b3b !important; }
  
  .card-footer { display: flex !important; gap: 15px !important; }
  .btn-next { flex: 1 !important; background: #4a3b3b !important; color: #fff !important; border: none !important; padding: 18px !important; border-radius: 20px !important; font-weight: 800 !important; cursor: pointer !important; }
  .btn-fav { width: 60px !important; background: #fdfaf6 !important; border: none !important; border-radius: 20px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; }

  /* ИЗБРАННОЕ */
  .favs-list { flex: 1 !important; overflow-y: auto !important; padding-right: 5px !important; }
  .fav-card { 
    background: #fff !important; padding: 20px !important; border-radius: 20px !important; 
    margin-bottom: 12px !important; position: relative !important; text-align: left !important;
    font-size: 0.9rem !important; line-height: 1.4 !important; border-left: 4px solid #FF4D6D !important;
  }
  .remove-fav { position: absolute !important; top: 10px !important; right: 10px !important; background: none !important; border: none !important; font-size: 1.2rem !important; color: #ccc !important; cursor: pointer !important; }
  .empty-state { opacity: 0.4 !important; text-align: center !important; margin-top: 50px !important; }

  .fade-in { animation: loveIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) !important; }
  @keyframes loveIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default LoveStoryApp;

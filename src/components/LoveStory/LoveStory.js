import React, { useState, useEffect } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Иконки вместо эмодзи
const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ff88cc" : "none"} stroke="#ff88cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const MomentsApp = () => {
  // // --- СОСТОЯНИЕ (из твоего кода) ---
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('names');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // // --- ЛОГИКА СКЛОНЕНИЯ ---
  const declineName = (name, caseType) => {
    if (!name) return name;
    name = name.trim();
    const lower = name.toLowerCase();
    const last = lower.slice(-1);
    if (last === 'я') {
      switch (caseType) {
        case 'genitive': return name.slice(0, -1) + 'и';
        case 'dative': return name.slice(0, -1) + 'е';
        case 'instrumental': return name.slice(0, -1) + 'й';
        case 'prepositional': return name.slice(0, -1) + 'е';
        default: return name;
      }
    }
    if (last === 'й' || /^[б-зк-нтф-щ]$/.test(last)) {
      if (lower.endsWith('еня') || lower.endsWith('ня')) return name.slice(0, -1) + (caseType === 'genitive' ? 'и' : 'е');
      switch (caseType) {
        case 'genitive': return name + 'а';
        case 'dative': return name + 'у';
        case 'instrumental': return name + 'ом';
        case 'prepositional': return name + 'е';
        default: return name;
      }
    }
    return name;
  };

  const interpolate = (text) => {
    return text
      .replace(/\[1:nom\]/g, names.name1).replace(/\[1:gen\]/g, declineName(names.name1, 'genitive'))
      .replace(/\[1:dat\]/g, declineName(names.name1, 'dative')).replace(/\[1:inst\]/g, declineName(names.name1, 'instrumental'))
      .replace(/\[1:prep\]/g, declineName(names.name1, 'prepositional'))
      .replace(/\[2:nom\]/g, names.name2).replace(/\[2:gen\]/g, declineName(names.name2, 'genitive'))
      .replace(/\[2:dat\]/g, declineName(names.name2, 'dative')).replace(/\[2:inst\]/g, declineName(names.name2, 'instrumental'))
      .replace(/\[2:prep\]/g, declineName(names.name2, 'prepositional'));
  };

  // // --- ДЕЙСТВИЯ ---
  const toggleFav = (card) => {
    const text = interpolate(card.text);
    const exists = favorites.find(f => f.text === text);
    if (exists) {
      setFavorites(favorites.filter(f => f.text !== text));
    } else {
      setFavorites([...favorites, { text, category: currentCat }]);
    }
  };

  return (
    <div className="app-wrapper">
      <style>{globalStyles}</style>

      {/* ЭКРАН ЗАГРУЗКИ */}
      {loading && (
        <div className="loading-screen">
          <div className="loading-emoji">💭</div>
          <div className="loading-text">Создаём моменты...</div>
        </div>
      )}

      {/* ШАПКА */}
      <div className="header">
        <a href="https://lovecouple.ru" className="back-to-landing">
          <ExternalLinkIcon /> <span>LoveCouple.ru</span>
        </a>
        <h1>MOMENTS</h1>
        <div className="header-subtitle">Для вас двоих 💕</div>
      </div>

      <div className="content">
        {/* ЭКРАН ИМЕН */}
        {screen === 'names' && (
          <div className="screen active screen-names">
            <div className="names-card">
              <div className="names-title">Привет! 👋</div>
              <div className="names-subtitle">Скажи свои имена</div>
              <div className="input-group">
                <label className="input-label">Твоё имя</label>
                <input type="text" className="input-field" value={names.name1} onChange={e => setNames({...names, name1: e.target.value})} placeholder="Оля" />
              </div>
              <div className="input-group">
                <label className="input-label">Имя партнёра</label>
                <input type="text" className="input-field" value={names.name2} onChange={e => setNames({...names, name2: e.target.value})} placeholder="Женя" />
              </div>
              <button className="btn-primary" onClick={() => (names.name1 && names.name2) ? setScreen('categories') : alert('Введите оба имени')}>ПОЕХАЛИ! 🚀</button>
            </div>
          </div>
        )}

        {/* ЭКРАН КАТЕГОРИЙ */}
        {screen === 'categories' && (
          <div className="screen active screen-categories">
            <div className="categories-container">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="category-card" onClick={() => { setCurrentCat(cat.id); setCardIdx(0); setScreen('game'); }}>
                  <div className="category-emoji">{cat.emoji}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-desc">{cat.description}</div>
                </div>
              ))}
              <div className="category-card" onClick={() => setScreen('favs')}>
                <div className="category-emoji">💗</div>
                <div className="category-name">Избранное</div>
                <div className="category-desc">{favorites.length} карточек</div>
              </div>
            </div>
          </div>
        )}

        {/* ЭКРАН ИГРЫ */}
        {screen === 'game' && currentCat && (
          <div className="screen active screen-game">
            <div className="game-header">
              <div className="game-title">{CATEGORIES.find(c => c.id === currentCat)?.name}</div>
              <button className="game-back-btn" onClick={() => setScreen('categories')}>
                <ChevronLeft /> Назад
              </button>
            </div>
            <div className="game-container">
              <div className="card-stack">
                <div className="card">
                  <div className="card-header">
                    <div className="card-type">
                      {CARDS[currentCat][cardIdx].type === 'question' ? '❓ Вопрос' : '⚡ Действие'}
                    </div>
                    <button className="card-favorite-btn" onClick={() => toggleFav(CARDS[currentCat][cardIdx])}>
                       <HeartIcon filled={favorites.some(f => f.text === interpolate(CARDS[currentCat][cardIdx].text))} />
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="card-text">{interpolate(CARDS[currentCat][cardIdx].text)}</div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-card" disabled={cardIdx === 0} onClick={() => setCardIdx(cardIdx - 1)}>← Назад</button>
                <button className="btn-card" onClick={() => setCardIdx((cardIdx + 1) % CARDS[currentCat].length)}>Далее →</button>
              </div>
            </div>
          </div>
        )}

        {/* ЭКРАН ИЗБРАННОГО */}
        {screen === 'favs' && (
          <div className="screen active screen-favorites">
            <div className="favorites-header">
              <div className="favorites-title">💗 Избранное</div>
              <button className="game-back-btn-favorites" onClick={() => setScreen('categories')}>
                <ChevronLeft /> Назад
              </button>
            </div>
            <div className="favorites-list">
              {favorites.length === 0 ? (
                <div className="empty-favorites">
                  <span className="empty-favorites-emoji">💭</span>
                  Здесь ещё нет избранных карточек
                </div>
              ) : (
                favorites.map((fav, i) => (
                  <div key={i} className="favorite-card">
                    <div className="favorite-card-content">
                      <div className="favorite-card-text">{fav.text}</div>
                      <div className="favorite-card-category">{fav.category}</div>
                    </div>
                    <button className="favorite-remove-btn" onClick={() => setFavorites(favorites.filter((_, idx) => idx !== i))}>✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// // CSS (полностью из твоего HTML + фикс кнопки на лендинг)
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap');

  .app-wrapper { height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg, #fde4f0 0%, #e8d5f2 50%, #d5e8f7 100%); font-family: 'Quicksand', sans-serif; }
  
  .back-to-landing {
    position: absolute; left: 20px; top: 38px;
    display: flex; align-items: center; gap: 6px;
    text-decoration: none; color: #b88fbf; font-size: 12px; font-weight: 700;
    background: rgba(255, 255, 255, 0.4); padding: 6px 12px; border-radius: 20px;
    transition: all 0.2s;
  }
  .back-to-landing:hover { background: rgba(255, 255, 255, 0.8); }

  .loading-screen { position: fixed; inset: 0; background: linear-gradient(135deg, #fde4f0 0%, #e8d5f2 50%, #d5e8f7 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; }
  .loading-emoji { font-size: 80px; animation: subtleFloat 3s ease-in-out infinite; }
  @keyframes subtleFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }

  .header { padding: 32px 20px; text-align: center; position: relative; }
  .header h1 { font-size: 42px; font-weight: 700; background: linear-gradient(135deg, #ff88cc, #b88fbf); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  
  .screen { display: none; flex: 1; flex-direction: column; padding: 24px; }
  .screen.active { display: flex; }
  .screen-names { justify-content: center; align-items: center; }

  .names-card { background: linear-gradient(135deg, #fce9f3 0%, #f0e9fc 100%); border-radius: 28px; padding: 40px 32px; width: 100%; max-width: 380px; box-shadow: 0 8px 32px rgba(255, 136, 204, 0.15); }
  .names-title { font-size: 32px; font-weight: 700; text-align: center; background: linear-gradient(135deg, #ff88cc, #d97ba8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  
  .input-field { width: 100%; padding: 14px 18px; border-radius: 16px; border: 1px solid rgba(255, 136, 204, 0.2); background: white; margin-bottom: 20px; }
  .btn-primary { width: 100%; padding: 16px; background: linear-gradient(135deg, #ff88cc, #ff99d8); color: white; border: none; border-radius: 16px; font-weight: 700; text-transform: uppercase; cursor: pointer; }

  .categories-container { display: grid; gap: 14px; width: 100%; max-width: 400px; margin: 0 auto; }
  .category-card { background: white; border-radius: 20px; padding: 24px; text-align: center; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.05); }

  .game-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; }
  .game-back-btn { display: flex; align-items: center; gap: 4px; border: none; background: rgba(255,255,255,0.5); padding: 8px 12px; border-radius: 12px; cursor: pointer; color: #6b5b7a; font-weight: 600; }

  .card { background: white; border-radius: 24px; padding: 28px; height: 340px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 12px 32px rgba(255,136,204,0.15); }
  .card-type { font-size: 10px; background: #fce9f3; padding: 6px 12px; border-radius: 10px; font-weight: 700; }
  .card-favorite-btn { background: none; border: none; cursor: pointer; }
  .card-text { font-size: 18px; text-align: center; line-height: 1.6; }

  .card-actions { display: flex; gap: 12px; margin-top: 20px; }
  .btn-card { flex: 1; padding: 14px; border-radius: 12px; border: none; background: white; cursor: pointer; font-weight: 600; }
  .btn-card:disabled { opacity: 0.5; }

  .favorite-card { background: white; border-radius: 16px; padding: 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .favorite-remove-btn { border: none; background: #ffd9f0; padding: 8px; border-radius: 10px; cursor: pointer; }
`;

export default MomentsApp;

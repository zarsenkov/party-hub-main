// // LoveStory.js - Обновленный дизайн кнопок и навигации
import React, { useState, useEffect } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Иконка "Сердце" (SVG) для избранного
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ff88cc" : "none"} stroke="#ff88cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// // Иконка "Назад" (SVG)
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// // Функции склонения и интерполяции (без изменений типа)
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

const interpolate = (text, n1, n2) => {
  return text
    .replace(/\[1:nom\]/g, n1).replace(/\[1:gen\]/g, declineName(n1, 'genitive'))
    .replace(/\[1:dat\]/g, declineName(n1, 'dative')).replace(/\[1:inst\]/g, declineName(n1, 'instrumental'))
    .replace(/\[1:prep\]/g, declineName(n1, 'prepositional'))
    .replace(/\[2:nom\]/g, n2).replace(/\[2:gen\]/g, declineName(n2, 'genitive'))
    .replace(/\[2:dat\]/g, declineName(n2, 'dative')).replace(/\[2:inst\]/g, declineName(n2, 'instrumental'))
    .replace(/\[2:prep\]/g, declineName(n2, 'prepositional'));
};

const MomentsApp = () => {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('names');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [currentCat, setCurrentCat] = useState(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFav = (card) => {
    const text = interpolate(card.text, names.name1, names.name2);
    const exists = favorites.find(f => f.text === text);
    if (exists) {
      setFavorites(favorites.filter(f => f.text !== text));
    } else {
      setFavorites([...favorites, { text, category: currentCat, rawText: card.text }]);
    }
  };

  return (
    <div className="app-container">
      <style>{improvedStyles}</style>

      {loading && (
        <div className="loading-screen">
          <div className="heart-loader">❤️</div>
          <div className="loading-text">Готовим романтику...</div>
        </div>
      )}

      {/* ШАПКА С КНОПКОЙ НА ЛЕНДИНГ */}
      <div className="header">
        <a href="https://lovecouple.ru" className="exit-link">
          <BackIcon /> <span>На сайт</span>
        </a>
        <h1>MOMENTS</h1>
        <div className="header-subtitle">Love Hub</div>
      </div>

      <div className="content">
        {screen === 'names' && (
          <div className="screen active">
            <div className="names-card">
              <h3>Как вас зовут?</h3>
              <input type="text" className="modern-input" placeholder="Твоё имя" value={names.name1} onChange={e => setNames({...names, name1: e.target.value})} />
              <input type="text" className="modern-input" placeholder="Имя партнёра" value={names.name2} onChange={e => setNames({...names, name2: e.target.value})} />
              <button className="btn-main" onClick={() => (names.name1 && names.name2) ? setScreen('categories') : alert('Введите имена')}>Начать игру</button>
            </div>
          </div>
        )}

        {screen === 'categories' && (
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="cat-box" onClick={() => { setCurrentCat(cat.id); setCardIdx(0); setScreen('game'); }}>
                <span className="cat-emoji">{cat.emoji}</span>
                <h4>{cat.name}</h4>
              </div>
            ))}
            <div className="cat-box fav-box" onClick={() => setScreen('favs')}>
              <HeartIcon filled />
              <h4>Избранное ({favorites.length})</h4>
            </div>
          </div>
        )}

        {screen === 'game' && currentCat && (
          <div className="game-screen">
            <button className="back-circle" onClick={() => setScreen('categories')}><BackIcon /></button>
            
            <div className="game-card">
              <div className="card-top">
                <span className="badge">{CARDS[currentCat][cardIdx].type === 'question' ? 'Вопрос' : 'Задание'}</span>
                <button className="fav-btn" onClick={() => toggleFav(CARDS[currentCat][cardIdx])}>
                  <HeartIcon filled={favorites.some(f => f.text === interpolate(CARDS[currentCat][cardIdx].text, names.name1, names.name2))} />
                </button>
              </div>
              <div className="card-main-text">
                {interpolate(CARDS[currentCat][cardIdx].text, names.name1, names.name2)}
              </div>
            </div>

            <div className="game-controls">
              <button className="btn-outline" disabled={cardIdx === 0} onClick={() => setCardIdx(cardIdx - 1)}>Назад</button>
              <button className="btn-main" onClick={() => setCardIdx((cardIdx + 1) % CARDS[currentCat].length)}>Дальше</button>
            </div>
          </div>
        )}

        {screen === 'favs' && (
          <div className="favs-screen">
             <button className="back-circle" onClick={() => setScreen('categories')}><BackIcon /></button>
             <h3>Сохраненные карточки</h3>
             {favorites.map((f, i) => (
               <div key={i} className="fav-item">{f.text}</div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

// // Улучшенные стили: чистый минимализм вместо "пастельного хаоса"
const improvedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
  
  body, html { margin: 0; padding: 0; overflow: hidden; }
  .app-container {
    font-family: 'Inter', sans-serif;
    height: 100vh;
    background: #fafafa;
    color: #2d3436;
    display: flex; flex-direction: column;
  }

  .header { padding: 20px; text-align: center; position: relative; }
  .exit-link { 
    position: absolute; left: 20px; top: 25px; 
    text-decoration: none; color: #636e72; font-size: 14px;
    display: flex; align-items: center; gap: 5px;
  }
  .header h1 { font-size: 24px; letter-spacing: 2px; margin: 0; font-weight: 600; }

  .names-card { padding: 30px; background: white; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin: 20px; }
  .modern-input {
    width: 100%; padding: 15px; border: 1px solid #eee; border-radius: 15px; margin-bottom: 15px; box-sizing: border-box; font-size: 16px;
  }

  .btn-main {
    width: 100%; padding: 16px; border-radius: 16px; border: none;
    background: #2d3436; color: white; font-weight: 600; cursor: pointer;
    transition: transform 0.2s;
  }
  .btn-main:active { transform: scale(0.98); }

  .categories-grid { 
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px;
  }
  .cat-box {
    background: white; padding: 20px; border-radius: 20px; text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer;
  }
  .cat-emoji { font-size: 30px; display: block; margin-bottom: 10px; }
  .cat-box h4 { margin: 0; font-size: 14px; color: #636e72; }

  .game-screen { padding: 20px; display: flex; flex-direction: column; align-items: center; }
  .back-circle {
    align-self: flex-start; width: 40px; height: 40px; border-radius: 50%; border: none;
    background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: center; color: #636e72;
  }

  .game-card {
    background: white; width: 100%; max-width: 400px; min-height: 350px;
    border-radius: 35px; padding: 30px; box-sizing: border-box;
    display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  }
  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .badge { background: #f1f2f6; padding: 6px 12px; border-radius: 20px; font-size: 12px; color: #a4b0be; }
  .fav-btn { border: none; background: none; cursor: pointer; padding: 5px; }

  .card-main-text { font-size: 22px; font-weight: 600; line-height: 1.4; text-align: center; flex: 1; display: flex; align-items: center; }

  .game-controls { display: flex; gap: 15px; width: 100%; max-width: 400px; margin-top: 30px; }
  .btn-outline { 
    flex: 1; padding: 16px; border-radius: 16px; border: 2px solid #eee; 
    background: transparent; color: #636e72; font-weight: 600; cursor: pointer;
  }

  .fav-item { background: white; padding: 15px; border-radius: 15px; margin-bottom: 10px; font-size: 14px; }
`;

export default MomentsApp;

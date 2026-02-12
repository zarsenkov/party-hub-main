import React, { useState, useEffect } from 'react';
import { CATEGORIES, CARDS } from './cardsData';

// // Функция для склонения имен по падежам (сохранена логика оригинала)
const declineName = (name: string, caseType: string) => {
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
    if (lower.endsWith('еня') || lower.endsWith('ня')) {
      return name.slice(0, -1) + (caseType === 'genitive' ? 'и' : 'е');
    }
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

// // Функция замены тегов [1:nom] и т.д. на реальные имена с учетом падежа
const interpolate = (text: string, n1: string, n2: string) => {
  return text
    .replace(/\[1:nom\]/g, n1).replace(/\[1:gen\]/g, declineName(n1, 'genitive'))
    .replace(/\[1:dat\]/g, declineName(n1, 'dative')).replace(/\[1:inst\]/g, declineName(n1, 'instrumental'))
    .replace(/\[1:prep\]/g, declineName(n1, 'prepositional'))
    .replace(/\[2:nom\]/g, n2).replace(/\[2:gen\]/g, declineName(n2, 'genitive'))
    .replace(/\[2:dat\]/g, declineName(n2, 'dative')).replace(/\[2:inst\]/g, declineName(n2, 'instrumental'))
    .replace(/\[2:prep\]/g, declineName(n2, 'prepositional'));
};

const MomentsApp = () => {
  // // --- СОСТОЯНИЕ (STATE) ---
  const [loading, setLoading] = useState(true); // Состояние экрана загрузки
  const [screen, setScreen] = useState('names'); // Текущий экран: names, categories, game, favs
  const [names, setNames] = useState({ name1: '', name2: '' }); // Имена игроков
  const [currentCat, setCurrentCat] = useState<string | null>(null); // Выбранная категория
  const [cardIdx, setCardIdx] = useState(0); // Индекс текущей карточки
  const [favorites, setFavorites] = useState<any[]>([]); // Список избранного

  // // Эффект для имитации загрузки при старте
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // // Переход к выбору категорий
  const startGame = () => {
    if (!names.name1 || !names.name2) return alert('Введите оба имени');
    setScreen('categories');
  };

  // // Добавление/удаление из избранного
  const toggleFav = (card: any) => {
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
      {/* Подключаем шрифты и глобальные стили пастельной темы */}
      <style>{pastelStyles}</style>

      {/* ЭКРАН ЗАГРУЗКИ */}
      {loading && (
        <div className="loading-screen">
          <div className="loading-emoji">💭</div>
          <div className="loading-text">Создаём моменты...</div>
        </div>
      )}

      {/* ШАПКА ПРИЛОЖЕНИЯ */}
      <div className="header">
        <h1>MOMENTS</h1>
        <div className="header-subtitle">Для вас двоих 💕</div>
      </div>

      <div className="content">
        {/* ЭКРАН ВВОДА ИМЕН */}
        {screen === 'names' && (
          <div className="screen active">
            <div className="names-card">
              <div className="names-title">Привет! 👋</div>
              <div className="names-subtitle">Скажи свои имена</div>
              <div className="input-group">
                <label className="input-label">Твоё имя</label>
                <input 
                  type="text" className="input-field" placeholder="Оля"
                  value={names.name1} onChange={e => setNames({...names, name1: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Имя партнёра</label>
                <input 
                  type="text" className="input-field" placeholder="Женя"
                  value={names.name2} onChange={e => setNames({...names, name2: e.target.value})}
                />
              </div>
              <button className="btn-primary" onClick={startGame}>ПОЕХАЛИ! 🚀</button>
            </div>
          </div>
        )}

        {/* ЭКРАН ВЫБОРА КАТЕГОРИЙ */}
        {screen === 'categories' && (
          <div className="screen active">
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

        {/* ЭКРАН САМОЙ ИГРЫ */}
        {screen === 'game' && currentCat && (
          <div className="screen active">
            <div className="game-header">
              <div className="game-title">{CATEGORIES.find(c => c.id === currentCat)?.name}</div>
              <button className="game-back-btn" onClick={() => setScreen('categories')}>← Назад</button>
            </div>
            <div className="game-container">
              <div className="card-stack">
                <div className="card">
                  <div className="card-header">
                    <div className="card-type">
                      {CARDS[currentCat][cardIdx].type === 'question' ? '❓ Вопрос' : '⚡ Действие'}
                    </div>
                    <button className="card-favorite-btn" onClick={() => toggleFav(CARDS[currentCat][cardIdx])}>
                      {favorites.some(f => f.text === interpolate(CARDS[currentCat][cardIdx].text, names.name1, names.name2)) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="card-text">
                      {interpolate(CARDS[currentCat][cardIdx].text, names.name1, names.name2)}
                    </div>
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
          <div className="screen active">
            <div className="favorites-header">
              <div className="favorites-title">💗 Избранное</div>
              <button className="game-back-btn" onClick={() => setScreen('categories')}>← Назад</button>
            </div>
            <div className="favorites-list">
              {favorites.length === 0 ? (
                <div className="empty-favorites">Здесь пока пусто 💭</div>
              ) : (
                favorites.map((f, i) => (
                  <div key={i} className="favorite-card">
                    <div className="favorite-card-content">
                      <div className="favorite-card-text">{f.text}</div>
                      <div className="favorite-card-category">{f.category}</div>
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

// // Стили пастельной темы (CSS-in-JS для простоты переноса)
const pastelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap');
  
  .app-container {
    font-family: 'Quicksand', sans-serif;
    height: 100vh;
    background: linear-gradient(135deg, #fde4f0 0%, #e8d5f2 50%, #d5e8f7 100%);
    color: #6b5b7a;
    display: flex;
    flex-direction: column;
  }

  .loading-screen {
    position: fixed; inset: 0; z-index: 100;
    background: linear-gradient(135deg, #fde4f0 0%, #e8d5f2 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .header { padding: 30px; text-align: center; }
  .header h1 { 
    font-size: 40px; margin: 0;
    background: linear-gradient(135deg, #ff88cc, #b88fbf);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .names-card, .card, .category-card, .favorite-card {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 25px;
    box-shadow: 0 10px 25px rgba(255, 136, 204, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .input-field {
    width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 136, 204, 0.2);
    margin: 10px 0; background: white;
  }

  .btn-primary {
    width: 100%; padding: 15px; border-radius: 15px; border: none;
    background: linear-gradient(135deg, #ff88cc, #ff99d8); color: white;
    font-weight: bold; cursor: pointer; margin-top: 15px;
  }

  .categories-container { display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px; }
  .category-card { cursor: pointer; text-align: center; }
  
  .card-stack { width: 100%; max-width: 360px; min-height: 300px; display: flex; }
  .card { width: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  
  .card-actions { display: flex; gap: 10px; margin-top: 20px; width: 100%; max-width: 360px; }
  .btn-card { flex: 1; padding: 12px; border-radius: 10px; border: none; background: #ffd9f0; color: #6b5b7a; cursor: pointer; }

  .favorite-card { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; width: 100%; }
  .favorite-remove-btn { border: none; background: #ffd9f0; padding: 5px 10px; border-radius: 8px; cursor: pointer; }
`;

export default MomentsApp;

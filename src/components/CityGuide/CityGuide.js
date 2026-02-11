import React, { useState, useMemo } from 'react';
// Иконки для навигации
import { ArrowLeft, MapPin, Search, Filter, Bookmark } from 'lucide-react';

// // База данных мест (твои данные)
const CARDS_DATA = [
  {
    city: 'msk',
    category: 'bar',
    title: 'Кабинет 3.14',
    desc: 'Секретный бар за зеркальной стеной бутика. Авторские коктейли, мистическая атмосфера, индивидуальный подбор напитка.',
    hint: 'Закройте камеру смартфона перед входом, не снимайте интерьер.',
    address: 'Трубная ул., 32, стр. 3'
  },
  {
    city: 'spb',
    category: 'place',
    title: 'Ротонда на Гороховой',
    desc: 'Легендарная ротонда в парадной с необычной акустикой и мистической репутацией.',
    hint: 'Договоритесь об экскурсии — вход по коду.',
    address: 'Гороховая ул., 57'
  },
  {
    city: 'sochi',
    category: 'bar',
    title: 'Cocos',
    desc: 'Коктейльный бар с локальными ингредиентами: фейхоа, зизифор, чага.',
    hint: 'Не пропустите коктейль «Helper» — виски на чаге.',
    address: 'ул. Воровского, 3'
  },
  // ... (остальные твои данные вставляются сюда аналогично)
];

const CITY_NAMES = {
  all: { main: "РОССИЯ", sub: "ПУТЕВОДИТЕЛЬ" },
  msk: { main: "МОСКВА", sub: "ДЕФОЛТ-СИТИ" },
  spb: { main: "ПИТЕР", sub: "КУЛЬТУРНО" },
  sochi: { main: "СОЧИ", sub: "НА ЮГАХ" },
  ekb: { main: "ЕКБ", sub: "УРАЛЬСКИЙ ВАЙБ" },
  kzn: { main: "КАЗАНЬ", sub: "ТРЕТЬЯ СТОЛИЦА" }
};

const CityGuide = ({ onBack }) => {
  const [currentCity, setCurrentCity] = useState('all');
  const [currentCat, setCurrentCat] = useState('all');

  // // Фильтрация данных на основе выбранного города и категории
  const filteredCards = useMemo(() => {
    return CARDS_DATA.filter(item => {
      const cityMatch = currentCity === 'all' || item.city === currentCity;
      const catMatch = currentCat === 'all' || item.category === currentCat;
      return cityMatch && catMatch;
    });
  }, [currentCity, currentCat]);

  // --- СТИЛИ (Zine Archive Style) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, background: '#e4e0d9', color: '#1a1a1a',
      fontFamily: '"JetBrains Mono", monospace', overflowY: 'auto', zIndex: 1000,
      paddingBottom: '50px'
    },
    paperOverlay: {
      position: 'fixed', inset: 0, opacity: 0.3, pointerEvents: 'none', zIndex: 10,
      backgroundImage: `url('https://www.transparenttextures.com/patterns/recycled-paper-texture.png')`
    },
    header: {
      padding: '20px', borderBottom: '3px solid #1a1a1a', display: 'flex', 
      justifyContent: 'space-between', alignItems: 'center', background: '#e4e0d9',
      position: 'sticky', top: 0, zIndex: 100
    },
    logo: {
      background: '#1a1a1a', color: '#e4e0d9', padding: '5px 12px', 
      fontWeight: '900', fontSize: '1.2rem', transform: 'rotate(-2deg)'
    },
    hero: { padding: '40px 20px', position: 'relative', textAlign: 'left' },
    heroTitle: { fontSize: '3rem', margin: 0, lineHeight: 0.9, fontWeight: '900' },
    heroSub: { color: '#ff0033', fontSize: '1.5rem', display: 'block', fontStyle: 'italic' },
    stamp: {
      position: 'absolute', right: '20px', top: '20px', border: '3px double #ff0033',
      color: '#ff0033', padding: '5px 10px', transform: 'rotate(15deg)', 
      fontWeight: '900', opacity: 0.6, fontSize: '0.7rem'
    },
    filterNav: {
      padding: '0 20px 20px', display: 'flex', gap: '10px', overflowX: 'auto',
      scrollbarWidth: 'none'
    },
    btn: (active) => ({
      background: active ? '#fbff00' : '#fff', border: '2px solid #1a1a1a',
      padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer',
      boxShadow: active ? '0 0 0 #1a1a1a' : '4px 4px 0 #1a1a1a',
      transform: active ? 'translate(3px, 3px)' : 'none', whiteSpace: 'nowrap'
    }),
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px', padding: '20px'
    },
    card: (idx) => ({
      background: '#fff', padding: '20px', border: '1px solid #ccc',
      boxShadow: '10px 10px 20px rgba(0,0,0,0.05)', position: 'relative',
      transform: `rotate(${idx % 2 === 0 ? '1deg' : '-1deg'})`
    }),
    badge: {
      background: '#fff', border: '2px solid #1a1a1a', padding: '5px 10px',
      boxShadow: '4px 4px 0 #1a1a1a', fontWeight: '900'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.paperOverlay} />
      
      {/* HEADER */}
      <header style={styles.header}>
        <button onClick={onBack} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          <ArrowLeft />
        </button>
        <div style={styles.logo}>РФ<span>АРХИВ</span></div>
        <div style={styles.badge}>
          <select 
            value={currentCity} 
            onChange={(e) => setCurrentCity(e.target.value)}
            style={{border: 'none', fontWeight: '900', outline: 'none', background: 'transparent'}}
          >
            <option value="all">ВСЯ РФ</option>
            <option value="msk">МОСКВА</option>
            <option value="spb">ПИТЕР</option>
            <option value="sochi">СОЧИ</option>
            <option value="ekb">ЕКБ</option>
            <option value="kzn">КАЗАНЬ</option>
          </select>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          {CITY_NAMES[currentCity].main}
          <span style={styles.heroSub}>{CITY_NAMES[currentCity].sub}</span>
        </h1>
        <div style={styles.stamp}>КОПИЯ ВЕРНА</div>
      </section>

      {/* CATEGORIES */}
      <nav style={styles.filterNav}>
        {[
          {id: 'all', label: 'ВСЁ'},
          {id: 'bar', label: 'ВЫПИТЬ'},
          {id: 'place', label: 'ГЛЯНУТЬ'},
          {id: 'event', label: 'ДВИЖ'}
        ].map(cat => (
          <button 
            key={cat.id} 
            style={styles.btn(currentCat === cat.id)}
            onClick={() => setCurrentCat(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* GRID */}
      <div style={styles.grid}>
        {filteredCards.map((card, index) => (
          <div key={index} style={styles.card(index)}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px', marginBottom: '10px'}}>
              <span>{card.city.toUpperCase()} // {card.category.toUpperCase()}</span>
              <span>ID:{1000 + index}</span>
            </div>
            
            <h3 style={{background: '#fbff00', display: 'inline', fontSize: '1.2rem', fontWeight: '900'}}>
              {card.title}
            </h3>
            
            <p style={{fontSize: '0.9rem', marginTop: '15px'}}>{card.desc}</p>
            
            <div style={{marginTop: '15px', fontSize: '0.8rem', border: '1px dashed #1a1a1a', padding: '5px'}}>
              <strong style={{color: '#ff0033'}}>LOC:</strong> {card.address}
            </div>

            <div style={{marginTop: '15px', padding: '8px', borderLeft: '4px solid #ff0033', background: '#f9f9f9', fontStyle: 'italic', fontSize: '0.9rem'}}>
              "{card.hint}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityGuide;

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Palmtree } from 'lucide-react';
// // Импортируем данные из соседнего файла
import { cardsData } from './cardsData';

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

  // // Фильтрация импортированных данных
  const filteredCards = useMemo(() => {
    return cardsData.filter(item => {
      const cityMatch = currentCity === 'all' || item.city === currentCity;
      const catMatch = currentCat === 'all' || item.category === currentCat;
      return cityMatch && catMatch;
    });
  }, [currentCity, currentCat]);

  const styles = {
    container: {
      position: 'fixed', inset: 0, background: '#e4e0d9', color: '#1a1a1a',
      fontFamily: 'monospace', overflowY: 'auto', zIndex: 1000, paddingBottom: '40px'
    },
    paperOverlay: {
      position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none', zIndex: 5,
      backgroundImage: `url('https://www.transparenttextures.com/patterns/recycled-paper-texture.png')`
    },
    header: {
      padding: '15px 20px', borderBottom: '3px solid #1a1a1a', display: 'flex', 
      justifyContent: 'space-between', alignItems: 'center', background: '#e4e0d9',
      position: 'sticky', top: 0, zIndex: 100
    },
    hero: { padding: '30px 20px', position: 'relative' },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px', padding: '0 20px'
    },
    card: (idx) => ({
      background: '#fff', padding: '20px', border: '1px solid #1a1a1a',
      boxShadow: '6px 6px 0px rgba(0,0,0,0.1)', position: 'relative',
      transform: `rotate(${idx % 2 === 0 ? '0.8deg' : '-0.8deg'})`,
      marginBottom: '20px'
    }),
    filterBtn: (active) => ({
      background: active ? '#fbff00' : '#fff', border: '2px solid #1a1a1a',
      padding: '6px 12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer',
      boxShadow: active ? '0 0 0 #1a1a1a' : '3px 3px 0 #1a1a1a',
      transform: active ? 'translate(2px, 2px)' : 'none'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.paperOverlay} />
      
      <header style={styles.header}>
        <button onClick={onBack} style={{background: '#1a1a1a', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '4px'}}><ArrowLeft size={20}/></button>
        <div style={{background: '#1a1a1a', color: '#fff', padding: '4px 10px', fontWeight: '900', transform: 'rotate(-1deg)'}}>РФ-АРХИВ</div>
        <select 
          value={currentCity} 
          onChange={(e) => setCurrentCity(e.target.value)}
          style={{border: '2px solid #1a1a1a', fontWeight: '900', padding: '4px', background: '#fff', outline: 'none'}}
        >
          <option value="all">ВСЯ РФ</option>
          <option value="msk">МОСКВА</option>
          <option value="spb">ПИТЕР</option>
          <option value="sochi">СОЧИ</option>
          <option value="ekb">ЕКБ</option>
          <option value="kzn">КАЗАНЬ</option>
        </select>
      </header>

      <section style={styles.hero}>
        <h1 style={{fontSize: '2.5rem', margin: 0, fontWeight: '900', lineHeight: 1}}>
          {CITY_NAMES[currentCity].main}
          <span style={{display: 'block', color: '#ff0033', fontSize: '1.2rem', fontStyle: 'italic'}}>{CITY_NAMES[currentCity].sub}</span>
        </h1>
      </section>

      <div style={{display: 'flex', gap: '8px', padding: '0 20px 20px', overflowX: 'auto'}}>
        {['all', 'bar', 'place', 'event'].map(cat => (
          <button key={cat} style={styles.filterBtn(currentCat === cat)} onClick={() => setCurrentCat(cat)}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredCards.map((card, index) => (
          <div key={index} style={styles.card(index)}>
            <div style={{fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px'}}>
              <span>{card.city.toUpperCase()} // {card.category.toUpperCase()}</span>
              <span>#{1000 + index}</span>
            </div>
            <h3 style={{background: '#fbff00', display: 'inline', padding: '2px 5px', fontWeight: '900'}}>{card.title}</h3>
            <p style={{fontSize: '0.9rem', margin: '15px 0'}}>{card.desc}</p>
            <div style={{fontSize: '0.8rem', border: '1px dashed #1a1a1a', padding: '5px', background: 'rgba(0,0,0,0.02)'}}>
              <span style={{color: '#ff0033', fontWeight: 'bold'}}>LOC:</span> {card.address}
            </div>
            <div style={{marginTop: '10px', paddingLeft: '10px', borderLeft: '3px solid #ff0033', fontStyle: 'italic', fontSize: '0.85rem'}}>
              "{card.hint}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityGuide;

import React, { useState } from 'react';
import './LoveStory.css';
import { STORIES } from './LoveData';

export default function LoveStory({ onBack }) {
  const [currentStory, setCurrentStory] = useState(null);
  const [step, setStep] = useState(0);

  // // Если история не выбрана — показываем список "кинолент"
  if (!currentStory) {
    return (
      <div className="ls-container">
        <div className="ls-grain" />
        <h1 className="ls-story-title">ВЫБЕРИТЕ СЮЖЕТ</h1>
        <div style={{ display: 'grid', gap: '20px' }}>
          {Object.entries(STORIES).map(([id, s]) => (
            <div 
              key={id} 
              onClick={() => setCurrentStory(s)}
              style={{ borderBottom: '1px solid #222', padding: '20px 0', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '0.6rem', color: '#ff4d6d' }}>0{id === 'spark' ? 1 : 2}</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '300', marginTop: '5px' }}>{s.title.toUpperCase()}</h2>
            </div>
          ))}
        </div>
        <button onClick={onBack} className="ls-btn-next" style={{ marginTop: '40px' }}>ВЫЙТИ</button>
      </div>
    );
  }

  // // Текущая карточка (убираем NPC, оставляем только чистый контент)
  const allCards = currentStory.phases.flatMap(p => p.cards);
  const card = allCards[step];

  return (
    <div className="ls-container">
      <div className="ls-grain" />
      <div className="ls-story-title">{currentStory.title} — SCENE {step + 1}</div>
      
      <div className="ls-card" key={step}>
        <p className="ls-phrase">
          {card.text.replace(/{name1}/g, 'Ты').replace(/{name2}/g, 'Партнер')}
        </p>
        <span className="ls-instruction">
          {card.type === 'action' ? 'Действие' : 'Вопрос'}
        </span>
      </div>

      <div className="ls-nav">
        <button className="ls-btn-next" onClick={() => step > 0 ? setStep(s => s - 1) : setCurrentStory(null)}>
          {step === 0 ? 'К СПИСКУ' : 'НАЗАД'}
        </button>
        {step < allCards.length - 1 ? (
          <button className="ls-btn-next" onClick={() => setStep(s => s + 1)}>СЛЕДУЮЩИЙ КАДР</button>
        ) : (
          <button className="ls-btn-next" onClick={onBack}>ФИНАЛ</button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import './LoveStory.css';
import { STORIES } from './LoveData';

export default function LoveStory({ onBack }) {
  const [activeStory, setActiveStory] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [names, setNames] = useState({
    p1: localStorage.getItem('ls_p1') || "",
    p2: localStorage.getItem('ls_p2') || ""
  });
  const [showSetup, setShowSetup] = useState(!names.p1 || !names.p2);

  // // Функция склонения (Кого? Чего? - Родительный падеж)
  const getGenitive = (name) => {
    if (!name) return "";
    const last = name.slice(-1).toLowerCase();
    if (['а', 'я'].includes(last)) return name.slice(0, -1) + (last === 'а' ? 'ы' : 'и');
    if (['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ'].includes(last)) return name + 'а';
    return name;
  };

  const formatText = (text) => {
    return text
      .replace(/{name1}/g, names.p1)
      .replace(/{name2}/g, names.p2)
      .replace(/{name1_gen}/g, getGenitive(names.p1))
      .replace(/{name2_gen}/g, getGenitive(names.p2));
  };

  // // Экран ввода имен
  if (showSetup) {
    return (
        <div className="ls-engine">
            <div className="ls-interface" style={{justifyContent: 'center'}}>
                <div className="ls-quest-card">
                    <h2 className="ls-main-text">КТО ИГРАЕТ?</h2>
                    <input className="ls-btn-next" style={{background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '10px'}} 
                           placeholder="Имя 1" value={names.p1} onChange={e => setNames({...names, p1: e.target.value})} />
                    <input className="ls-btn-next" style={{background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '20px'}} 
                           placeholder="Имя 2" value={names.p2} onChange={e => setNames({...names, p2: e.target.value})} />
                    <button className="ls-btn-next" onClick={() => {
                        localStorage.setItem('ls_p1', names.p1);
                        localStorage.setItem('ls_p2', names.p2);
                        setShowSetup(false);
                    }}>ВОЙТИ</button>
                </div>
            </div>
        </div>
    );
  }

  // // Лобби (Список историй)
  if (!activeStory) {
    return (
      <div className="ls-engine">
        <div className="ls-interface">
          <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
             <button onClick={onBack} style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem'}}>✕</button>
             <span style={{fontFamily: 'Unbounded', fontSize: '0.8rem'}}>LOVE MOMENTS</span>
             <button onClick={() => setShowSetup(true)} style={{background: 'none', border: 'none', color: '#fff'}}><i className="fas fa-user-edit"></i></button>
          </header>
          
          <h1 style={{fontFamily: 'Unbounded', marginTop: '30px', fontSize: '2rem'}}>КУДА<br/>ОТПРАВИМСЯ?</h1>
          
          <div className="ls-lobby-grid">
            {Object.entries(STORIES).map(([id, s]) => (
              <div key={id} className="ls-story-item" onClick={() => { setActiveStory(id); setStepIdx(0); }}>
                <div style={{position: 'absolute', inset: 0, background: s.gradient, opacity: 0.2}}></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const story = STORIES[activeStory];
  const currentStep = story.steps[stepIdx];
  const progress = (stepIdx / story.steps.length) * 100;

  return (
    <div className="ls-engine" style={{'--story-gradient': story.gradient}}>
      <div className="ls-bg-layer" />
      <div className="ls-interface">
        <header style={{display: 'flex', justifyContent: 'space-between', opacity: 0.6}}>
           <button onClick={() => setActiveStory(null)} style={{background: 'none', border: 'none', color: '#fff'}}>В ЛОББИ</button>
           <span>{stepIdx + 1} / {story.steps.length}</span>
        </header>

        <div className="ls-progress-bar">
          <div className="ls-progress-fill" style={{width: `${progress}%`}}></div>
        </div>

        <div className="ls-quest-card" key={stepIdx}>
          <div className="ls-story-tag">{currentStep.type}</div>
          <p className="ls-main-text">{formatText(currentStep.text)}</p>
          <button className="ls-btn-next" onClick={() => {
            if (stepIdx < story.steps.length - 1) setStepIdx(stepIdx + 1);
            else setActiveStory(null);
          }}>
            {stepIdx === story.steps.length - 1 ? "ЗАВЕРШИТЬ" : "ДАЛЬШЕ"}
          </button>
        </div>
      </div>
    </div>
  );
}

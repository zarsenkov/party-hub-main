import React, { useState } from 'react';
import './LoveStory.css';
import { STORIES } from './LoveData';

export default function LoveStory({ onBack }) {
  // // Имена сбрасываются при инициализации (каждый раз при входе)
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [showSetup, setShowSetup] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  // // Сброс данных и выход в главное меню
  const handleFullExit = () => {
    setNames({ p1: "", p2: "" });
    setShowSetup(true);
    setActiveStory(null);
    onBack();
  };

  // // Склонение в родительный падеж (Кого? Чего?)
  const getGenitive = (name) => {
    if (!name) return "";
    let n = name.trim();
    const last = n.slice(-1).toLowerCase();
    const prev = n.slice(-2, -1).toLowerCase();

    if (n.toLowerCase().endsWith('ий')) return n.slice(0, -2) + 'ия';
    if (n.toLowerCase().endsWith('ей')) return n.slice(0, -2) + 'ея';
    if (last === 'а') return "жчшщгкх".includes(prev) ? n.slice(0, -1) + 'и' : n.slice(0, -1) + 'ы';
    if (last === 'я') return n.slice(0, -1) + 'и';
    if ("бвгджзклмнпрстфхцчшщ".includes(last)) return n + 'а';
    if (last === 'ь') return n.slice(0, -1) + 'я';
    return n;
  };

  const formatText = (text) => {
    return text
      .replace(/{name1}/g, names.p1)
      .replace(/{name2}/g, names.p2)
      .replace(/{name1_gen}/g, getGenitive(names.p1))
      .replace(/{name2_gen}/g, getGenitive(names.p2));
  };

  // // ЭКРАН 1: ВВОД ИМЕН (Магический Неоморфизм)
  if (showSetup) {
    return (
      <div className="app-shell" style={{background: '#fff0f3'}}>
        <div className="npc-block" style={{paddingTop: '60px'}}>
           <div className="amalia-avatar">🌸</div>
           <h2 style={{fontFamily: 'Unbounded', fontSize: '1.2rem', textAlign: 'center'}}>КТО ИГРАЕТ?</h2>
        </div>
        <div className="clay-box" style={{margin: '30px 20px'}}>
            <input className="joy-input" placeholder="Имя первого" style={{marginBottom: '10px'}}
                   value={names.p1} onChange={e => setNames({...names, p1: e.target.value})} />
            <input className="joy-input" placeholder="Имя второго" style={{marginBottom: '25px'}}
                   value={names.p2} onChange={e => setNames({...names, p2: e.target.value})} />
            <button className="btn-clay primary" onClick={() => {
                if (names.p1.trim() && names.p2.trim()) setShowSetup(false);
                else alert("Введите имена героев 🌸");
            }}>ВОЙТИ В ИСТОРИЮ</button>
            <button onClick={onBack} style={{marginTop: '20px', background: 'none', border: 'none', color: '#ff8fa3', width: '100%', fontWeight: 'bold'}}>НАЗАД</button>
        </div>
      </div>
    );
  }

  // // ЭКРАН 2: ВЫБОР СЮЖЕТА (ЛОББИ)
  if (!activeStory) {
    return (
      <div className="app-shell" style={{background: '#fff0f3', overflowY: 'auto'}}>
        <div style={{padding: '30px 20px'}}>
            <button className="btn-mini" onClick={handleFullExit}>✕</button>
            <h1 style={{fontFamily: 'Unbounded', margin: '25px 0', fontSize: '1.8rem'}}>СЮЖЕТЫ</h1>
            <div style={{display: 'grid', gap: '20px'}}>
                {Object.entries(STORIES).map(([id, s]) => (
                    <div key={id} className="clay-box" onClick={() => {setActiveStory(id); setStepIdx(0);}} style={{cursor: 'pointer'}}>
                        <h3 style={{fontFamily: 'Unbounded', color: s.color, marginBottom: '5px'}}>{s.title}</h3>
                        <p style={{fontSize: '0.85rem', opacity: 0.7}}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  // // ЭКРАН 3: ИГРОВОЙ ПРОЦЕСС
  const story = STORIES[activeStory];
  const step = story.steps[stepIdx];

  return (
    <div className="app-shell" style={{background: story.bg}}>
      <div className="npc-block" style={{paddingTop: '40px'}}>
          <div className="amalia-avatar">✨</div>
          <div style={{fontSize: '0.8rem', fontWeight: 'bold', color: story.color}}>ШАГ {stepIdx + 1} / {story.steps.length}</div>
      </div>
      <div className="clay-box" style={{margin: '30px 20px', minHeight: '240px', display: 'flex', alignItems: 'center', textAlign: 'center'}}>
          <p style={{fontSize: '1.3rem', fontWeight: '700', width: '100%', color: '#4a3a3d'}}>{formatText(step.text)}</p>
      </div>
      <div style={{padding: '0 20px'}}>
          <button className="btn-clay primary" style={{backgroundColor: story.color}} onClick={() => {
              if (stepIdx < story.steps.length - 1) setStepIdx(stepIdx + 1);
              else setActiveStory(null);
          }}>
              {stepIdx === story.steps.length - 1 ? "ЗАВЕРШИТЬ" : "ДАЛЬШЕ"}
          </button>
          <button onClick={() => setActiveStory(null)} style={{marginTop: '15px', background: 'none', border: 'none', color: '#888', width: '100%'}}>К выбору истории</button>
      </div>
    </div>
  );
}

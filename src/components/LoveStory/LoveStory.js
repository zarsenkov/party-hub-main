import React, { useState } from 'react';
import './LoveStory.css';
import { STORIES } from './LoveData';

export default function LoveStory({ onBack }) {
  // // Имена всегда пустые при старте компонента (сброс)
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [showSetup, setShowSetup] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  // // Функция очистки имен и выход
  const exitToLobby = () => {
    localStorage.removeItem('ls_p1');
    localStorage.removeItem('ls_p2');
    setNames({ p1: "", p2: "" });
    onBack(); // Возвращаемся в главное меню App.js
  };

  // // Исправленная функция падежей (Родительный: Кого?)
  const getGenitive = (name) => {
    if (!name) return "";
    let n = name.trim();
    const last = n.slice(-1).toLowerCase();
    const beforeLast = n.slice(-2, -1).toLowerCase();

    if (n.toLowerCase().endsWith('ий')) return n.slice(0, -2) + 'ия';
    if (n.toLowerCase().endsWith('ей')) return n.slice(0, -2) + 'ея';
    if (last === 'а') {
        if ("жчшщгкх".includes(beforeLast)) return n.slice(0, -1) + 'и';
        return n.slice(0, -1) + 'ы';
    }
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

  // // 1. ЭКРАН ВВОДА ИМЕН (Твой стиль)
  if (showSetup) {
    return (
      <div className="app-shell" style={{background: '#fff0f3'}}>
        <div className="npc-block" style={{marginTop: '20%'}}>
           <div className="amalia-avatar">🌸</div>
           <h2 style={{fontFamily: 'Unbounded', fontSize: '1.2rem'}}>КАК ВАС ЗОВУТ?</h2>
        </div>
        <div className="clay-box" style={{margin: '20px'}}>
            <input className="joy-input" placeholder="Имя первого" style={{marginBottom: '10px'}}
                   value={names.p1} onChange={e => setNames({...names, p1: e.target.value})} />
            <input className="joy-input" placeholder="Имя второго" style={{marginBottom: '20px'}}
                   value={names.p2} onChange={e => setNames({...names, p2: e.target.value})} />
            <button className="btn-clay primary" onClick={() => {
                if (names.p1 && names.p2) setShowSetup(false);
                else alert("Введите имена 🌸");
            }}>НАЧАТЬ</button>
            <button onClick={onBack} style={{marginTop: '20px', background: 'none', border: 'none', color: '#888', width: '100%'}}>Назад</button>
        </div>
      </div>
    );
  }

  // // 2. ЛОББИ СЮЖЕТОВ
  if (!activeStory) {
    return (
      <div className="app-shell" style={{background: '#fff0f3', overflowY: 'auto'}}>
        <div style={{padding: '20px'}}>
            <button className="btn-mini" onClick={exitToLobby}><i className="fas fa-times"></i></button>
            <h1 style={{fontFamily: 'Unbounded', margin: '20px 0'}}>СЮЖЕТЫ</h1>
            {Object.entries(STORIES).map(([id, s]) => (
                <div key={id} className="clay-box" onClick={() => setActiveStory(id)} style={{marginBottom: '15px', cursor: 'pointer'}}>
                    <h3 style={{fontFamily: 'Unbounded', color: s.color}}>{s.title}</h3>
                    <p style={{fontSize: '0.8rem', opacity: 0.7}}>{s.desc}</p>
                </div>
            ))}
        </div>
      </div>
    );
  }

  // // 3. ИГРОВОЙ ПРОЦЕСС
  const story = STORIES[activeStory];
  const step = story.steps[stepIdx];

  return (
    <div className="app-shell" style={{background: story.bg}}>
      <div className="npc-block">
          <div className="amalia-avatar">✨</div>
          <div style={{fontSize: '0.7rem', opacity: 0.5}}>ШАГ {stepIdx + 1} / {story.steps.length}</div>
      </div>
      <div className="clay-box" style={{margin: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <p style={{fontSize: '1.2rem', fontWeight: '700'}}>{formatText(step.text)}</p>
      </div>
      <div style={{padding: '0 20px'}}>
          <button className="btn-clay primary" onClick={() => {
              if (stepIdx < story.steps.length - 1) setStepIdx(stepIdx + 1);
              else setActiveStory(null);
          }}>
              {stepIdx === story.steps.length - 1 ? "ФИНАЛ" : "ДАЛЬШЕ"}
          </button>
          <button onClick={() => setActiveStory(null)} style={{marginTop: '15px', background: 'none', border: 'none', color: '#888', width: '100%'}}>К выбору сюжета</button>
      </div>
    </div>
  );
}

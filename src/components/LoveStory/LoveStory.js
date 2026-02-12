import React, { useState, useEffect } from 'react';
import './LoveStory.css';
import { STORIES } from './LoveData';

export default function LoveStory({ onBack }) {
  const [names, setNames] = useState({ p1: "", p2: "" });
  const [showSetup, setShowSetup] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  // // Функция очистки при выходе
  const handleExit = () => {
    localStorage.removeItem('ls_p1');
    localStorage.removeItem('ls_p2');
    setNames({ p1: "", p2: "" });
    setShowSetup(true);
    setActiveStory(null);
    onBack(); // Возврат на главный лендинг
  };

  // // Улучшенная функция склонения (Родительный падеж: Кого?)
  const getGenitive = (name) => {
    if (!name) return "";
    let n = name.trim();
    const last = n.slice(-1).toLowerCase();
    const beforeLast = n.slice(-2, -1).toLowerCase();

    // Мужские на -ий (Евгений -> Евгения)
    if (n.toLowerCase().endsWith('ий')) return n.slice(0, -2) + 'ия';
    // Мужские на -ей (Алексей -> Алексея)
    if (n.toLowerCase().endsWith('ей')) return n.slice(0, -2) + 'ея';
    // Женские на -а (Ольга -> Ольги, но Наташа -> Наташи)
    if (last === 'а') {
        if ("жчшщгкх".includes(beforeLast)) return n.slice(0, -1) + 'и';
        return n.slice(0, -1) + 'ы';
    }
    // Женские на -я (Мария -> Марии)
    if (last === 'я') return n.slice(0, -1) + 'и';
    // Мужские на согласную (Антон -> Антона)
    if ("бвгджзклмнпрстфхцчшщ".includes(last)) return n + 'а';
    // Мягкий знак (Игорь -> Игоря)
    if (last === 'ь') return n.slice(0, -1) + 'я';

    return n;
  };

  const formatText = (text) => {
    if (!text) return "";
    return text
      .replace(/{name1}/g, names.p1)
      .replace(/{name2}/g, names.p2)
      .replace(/{name1_gen}/g, getGenitive(names.p1))
      .replace(/{name2_gen}/g, getGenitive(names.p2));
  };

  // // 1. Экран ввода имен
  if (showSetup) {
    return (
      <div className="ls-engine">
        <div className="ls-interface" style={{justifyContent: 'center'}}>
          <div className="ls-quest-card setup-anim">
            <div className="ls-story-tag">РЕГИСТРАЦИЯ ГЕРОЕВ</div>
            <h2 className="ls-main-text" style={{fontSize: '1.2rem'}}>КАК ВАС ЗОВУТ?</h2>
            <input 
              className="ls-input-field" 
              placeholder="Имя первого"
              value={names.p1}
              onChange={e => setNames({...names, p1: e.target.value})}
            />
            <input 
              className="ls-input-field" 
              placeholder="Имя второго"
              value={names.p2}
              onChange={e => setNames({...names, p2: e.target.value})}
            />
            <button className="ls-btn-next" onClick={() => {
              if (names.p1.length > 1 && names.p2.length > 1) setShowSetup(false);
              else alert("Введите настоящие имена 🌸");
            }}>НАЧАТЬ ПРИКЛЮЧЕНИЕ</button>
            <button onClick={onBack} className="ls-btn-exit">ВЕРНУТЬСЯ</button>
          </div>
        </div>
      </div>
    );
  }

  // // 2. Лобби выбора историй
  if (!activeStory) {
    return (
      <div className="ls-engine">
        <div className="ls-interface">
          <header className="ls-header-mini">
             <button onClick={handleExit} className="ls-btn-back">✕ ВЫЙТИ</button>
             <span className="ls-logo-text">LOVE STORIES</span>
          </header>
          
          <h1 className="ls-lobby-title">ВЫБЕРИТЕ ВАШ<br/>СЮЖЕТ</h1>
          
          <div className="ls-lobby-grid">
            {Object.entries(STORIES).map(([id, s]) => (
              <div key={id} className="ls-story-card-item" onClick={() => { setActiveStory(id); setStepIdx(0); }}>
                <div className="ls-card-bg" style={{background: s.gradient}}></div>
                <div className="ls-card-info">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                </div>
                <div className="ls-card-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // // 3. Сама игра
  const story = STORIES[activeStory];
  const currentStep = story.steps[stepIdx];
  const progress = ((stepIdx + 1) / story.steps.length) * 100;

  return (
    <div className="ls-engine" style={{'--story-gradient': story.gradient}}>
      <div className="ls-bg-blur" />
      <div className="ls-interface">
        <header className="ls-game-header">
           <button onClick={() => setActiveStory(null)} className="ls-btn-back">← В ЛОББИ</button>
           <span className="ls-step-counter">ШАГ {stepIdx + 1} / {story.steps.length}</span>
        </header>

        <div className="ls-progress-container">
          <div className="ls-progress-bar" style={{width: `${progress}%`}}></div>
        </div>

        <div className="ls-quest-card" key={stepIdx}>
          <div className={`ls-type-tag ${currentStep.type}`}>{currentStep.type}</div>
          <p className="ls-main-text">{formatText(currentStep.text)}</p>
          
          <button className="ls-btn-next-action" onClick={() => {
            if (stepIdx < story.steps.length - 1) setStepIdx(stepIdx + 1);
            else {
                setActiveStory(null);
                alert("Поздравляем! Вы прошли историю до конца 🌸");
            }
          }}>
            {stepIdx === story.steps.length - 1 ? "ЗАВЕРШИТЬ" : "ДАЛЬШЕ"}
          </button>
        </div>
      </div>
    </div>
  );
}

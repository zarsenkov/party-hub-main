import React, { useState } from 'react';
import './LoveStory.css';

// // Вспомогательная функция для падежей (упрощенная)
const getCaseName = (name, targetCase) => {
  if (!name) return "";
  // // Логика: если имя на "а/я" -> "и/е", на согл -> "а"
  const lastChar = name.slice(-1).toLowerCase();
  if (targetCase === 'genitive') { // // Кого? (Для кого)
    if (['а', 'я'].includes(lastChar)) return name.slice(0, -1) + (lastChar === 'а' ? 'ы' : 'и');
    return name + 'а';
  }
  return name;
};

const SCENES = [
  {
    id: 'intro',
    location: 'ПРИХОЖАЯ ПАМЯТИ',
    bgTop: '#2c3e50', bgBot: '#000000',
    text: "Добро пожаловать. Сегодня этот мир принадлежит только вам двоим. Введите ваши имена, чтобы ключи подошли к дверям.",
    type: 'setup'
  },
  {
    id: 'garden',
    location: 'САД ПЕРВЫХ ВСТРЕЧ',
    bgTop: '#1d334a', bgBot: '#1a1a1a',
    text: "{name1}, расскажи, какой аромат или звук из того дня, когда вы встретились, навсегда останется в твоем сердце?",
    type: 'question'
  },
  {
    id: 'lake',
    location: 'ОЗЕРО ОТКРОВЕНИЙ',
    bgTop: '#434343', bgBot: '#000000',
    text: "Посмотрите на отражение друг друга. {name2}, какое качество партнера ты считаешь своим спасательным кругом?",
    type: 'question'
  }
];

export default function LoveStory({ onBack }) {
  const [step, setStep] = useState(0);
  const [names, setNames] = useState({ p1: localStorage.getItem('ls_p1') || "", p2: localStorage.getItem('ls_p2') || "" });
  const [isGameStarted, setIsGameStarted] = useState(names.p1 && names.p2);

  const currentScene = SCENES[step];

  // // Обработка текста с именами
  const formatText = (text) => {
    return text
      .replace(/{name1}/g, names.p1)
      .replace(/{name2}/g, names.p2)
      .replace(/{name1_gen}/g, getCaseName(names.p1, 'genitive'))
      .replace(/{name2_gen}/g, getCaseName(names.p2, 'genitive'));
  };

  const next = () => {
    if (step < SCENES.length - 1) setStep(step + 1);
    else onBack(); // // Возврат в лобби App.js
  };

  return (
    <div className="ls-wrapper" style={{ 
      '--bg-color-top': currentScene.bgTop, 
      '--bg-color-bot': currentScene.bgBot 
    }}>
      <div className="ls-scene-bg" />
      <div className="ls-particles" />

      <div className="ls-content">
        <div className="ls-top-bar">
          <button className="ls-btn-outline" onClick={onBack}>ВЫЙТИ</button>
          {isGameStarted && <div className="ls-location-name">ЭТАП {step + 1} / {SCENES.length}</div>}
        </div>

        {!isGameStarted ? (
          <div className="ls-glass-card">
            <h2 className="ls-location-name">ПОДГОТОВКА</h2>
            <p className="ls-main-text">Прежде чем войти, назовите себя...</p>
            <input 
              className="ls-btn-outline" 
              style={{width: '100%', marginBottom: '10px', textAlign: 'center'}}
              placeholder="Имя первого"
              value={names.p1}
              onChange={e => setNames({...names, p1: e.target.value})}
            />
            <input 
              className="ls-btn-outline" 
              style={{width: '100%', marginBottom: '20px', textAlign: 'center'}}
              placeholder="Имя второго"
              value={names.p2}
              onChange={e => setNames({...names, p2: e.target.value})}
            />
            <button className="ls-btn" onClick={() => {
              if(names.p1 && names.p2) {
                localStorage.setItem('ls_p1', names.p1);
                localStorage.setItem('ls_p2', names.p2);
                setIsGameStarted(true);
                setStep(1); // // Переходим к первой сцене
              }
            }}>НАЧАТЬ ПУТЬ</button>
          </div>
        ) : (
          <div className="ls-glass-card" key={step}>
            <h2 className="ls-location-name">{currentScene.location}</h2>
            <p className="ls-main-text">{formatText(currentScene.text)}</p>
            <button className="ls-btn" onClick={next}>
              {step === SCENES.length - 1 ? "ЗАВЕРШИТЬ ПУТЕШЕСТВИЕ" : "ИДТИ ДАЛЬШЕ"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

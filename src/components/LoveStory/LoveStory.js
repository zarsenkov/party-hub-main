import React, { useState, useEffect } from ‘react’;
import { STORIES } from ‘./LoveData’;
import ‘./LoveStory.css’;

const getGenitive = (name) => {
if (!name) return ‘’;
const lastName = name.trim();
const lastChar = lastName.slice(-1).toLowerCase();
if (lastChar === ‘а’ || lastChar === ‘я’) {
if (lastChar === ‘а’) return lastName.slice(0, -1) + ‘ы’;
if (lastChar === ‘я’) return lastName.slice(0, -1) + ‘и’;
}
if (lastChar === ‘й’ || lastChar === ‘ь’) {
return lastName.slice(0, -1) + ‘я’;
}
return lastName + ‘а’;
};

const replacePlaceholders = (text, name1, name2) => {
if (!text) return ‘’;
return text
.replace(/{name1_gen}/g, getGenitive(name1))
.replace(/{name2_gen}/g, getGenitive(name2))
.replace(/{name1}/g, name1)
.replace(/{name2}/g, name2);
};

function LoveStory() {
const [screen, setScreen] = useState(‘landing’);
const [name1, setName1] = useState(’’);
const [name2, setName2] = useState(’’);
const [selectedStory, setSelectedStory] = useState(null);
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [answers, setAnswers] = useState([]);

useEffect(() => {
return () => {
setName1(’’);
setName2(’’);
};
}, []);

const handleExitToLanding = () => {
setScreen(‘landing’);
setName1(’’);
setName2(’’);
setSelectedStory(null);
setCurrentStepIndex(0);
setAnswers([]);
};

const handleStartRegistration = () => {
setScreen(‘registration’);
};

const handleRegistrationSubmit = (e) => {
e.preventDefault();
if (name1.trim() && name2.trim()) {
setScreen(‘lobby’);
}
};

const handleStorySelect = (storyKey) => {
setSelectedStory(storyKey);
setCurrentStepIndex(0);
setAnswers([]);
setScreen(‘quest’);
};

const handleAnswer = (answer, event) => {
if (event && event.currentTarget) {
event.currentTarget.blur();
}
setAnswers([…answers, answer]);
setTimeout(() => {
const story = STORIES[selectedStory];
if (currentStepIndex < story.steps.length - 1) {
setCurrentStepIndex(currentStepIndex + 1);
} else {
setScreen(‘final’);
}
}, 150);
};

const handleRestart = () => {
setCurrentStepIndex(0);
setAnswers([]);
setScreen(‘lobby’);
};

const currentStory = selectedStory ? STORIES[selectedStory] : null;
const currentStep = currentStory ? currentStory.steps[currentStepIndex] : null;

return (
<div className="love-story-app">
{screen === ‘landing’ && (
<div className="screen landing-screen">
<div className="amalia-intro">
<div className="amalia-avatar">✨</div>
<p className="amalia-text">
Привет! Я — Амалия, ваш проводник в мир историй для двоих.
Готовы к приключению?
</p>
</div>
<h1 className="main-title">Love Story Online</h1>
<p className="subtitle">Интерактивные квесты для пар</p>
<button className="cta-button" onClick={handleStartRegistration}>
Начать путешествие
</button>
</div>
)}

```
  {screen === 'registration' && (
    <div className="screen registration-screen">
      <button className="back-button" onClick={handleExitToLanding}>
        ← Назад
      </button>
      <div className="amalia-intro">
        <div className="amalia-avatar">🌸</div>
        <p className="amalia-text">
          Давайте знакомиться! Как зовут вас двоих?
        </p>
      </div>
      <form className="registration-form" onSubmit={handleRegistrationSubmit}>
        <div className="input-group">
          <label>Первый игрок</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Введите имя"
            required
          />
        </div>
        <div className="input-group">
          <label>Второй игрок</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Введите имя"
            required
          />
        </div>
        <button type="submit" className="cta-button">
          Продолжить
        </button>
      </form>
    </div>
  )}

  {screen === 'lobby' && (
    <div className="screen lobby-screen">
      <button className="back-button" onClick={handleExitToLanding}>
        ← На главную
      </button>
      <div className="amalia-intro">
        <div className="amalia-avatar">💖</div>
        <p className="amalia-text">
          Отлично, {name1} и {name2}! Выберите вашу историю:
        </p>
      </div>
      <div className="stories-grid">
        {Object.entries(STORIES).map(([key, story]) => (
          <div key={key} className="story-card" onClick={() => handleStorySelect(key)}>
            <div className="story-icon">{story.icon}</div>
            <h3 className="story-title">{story.title}</h3>
            <p className="story-description">{story.description}</p>
            <div className="story-meta">
              <span>⏱ {story.duration}</span>
              <span>{story.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {screen === 'quest' && currentStep && (
    <div className="screen quest-screen">
      <div className="quest-header">
        <button className="back-button" onClick={handleRestart}>
          ← К выбору истории
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentStepIndex + 1) / currentStory.steps.length) * 100}%` }} />
        </div>
        <span className="step-counter">
          Шаг {currentStepIndex + 1} / {currentStory.steps.length}
        </span>
      </div>
      <div className="quest-content">
        <div className="amalia-narration">
          <div className="amalia-avatar">🌸</div>
          <div className="narration-text">
            {replacePlaceholders(currentStep.narration, name1, name2)}
          </div>
        </div>
        <div className="question-card">
          <h3 className="question-text">
            {replacePlaceholders(currentStep.question, name1, name2)}
          </h3>
          <div className="options-list">
            {currentStep.options.map((option, index) => (
              <button key={index} className="option-button" onClick={(e) => handleAnswer(option, e)}>
                {replacePlaceholders(option, name1, name2)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {screen === 'final' && (
    <div className="screen final-screen">
      <div className="amalia-intro">
        <div className="amalia-avatar">✨</div>
        <p className="amalia-text">
          Браво, {name1} и {name2}! Вы прошли историю «{currentStory?.title}». Надеюсь, это было волшебно!
        </p>
      </div>
      <div className="final-stats">
        <h2>Ваше путешествие завершено</h2>
        <p>Пройдено шагов: {answers.length}</p>
        <p>История: {currentStory?.title}</p>
      </div>
      <div className="final-actions">
        <button className="cta-button" onClick={handleRestart}>
          Выбрать другую историю
        </button>
        <button className="secondary-button" onClick={handleExitToLanding}>
          Завершить игру
        </button>
      </div>
    </div>
  )}
</div>
```

);
}

export default LoveStory;
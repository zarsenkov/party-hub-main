import React, { useState, useEffect } from 'react';

// Массив вопросов с сюжетом вашей истории
// ЗАМЕНИТЕ ссылки на реальные фото!
const quizData = [
  {
    question: "Наш самый первый день: 22 июня 2018 года. Где мы познакомились?",
    options: ["В парке", "В универе", "На вечеринке"],
    correct: 0, // Индекс правильного ответа (0 - первый вариант)
    photo: "https://via.placeholder.com/300x200/ffc0cb/ffffff?text=НАША+ВСТРЕЧА"
  },
  {
    question: "Какой подарок от меня тебе запомнился больше всего?",
    options: ["Цветы", "Украшение", "Эмоции"],
    correct: 2, // Индекс правильного ответа (2 - третий вариант)
    photo: "https://via.placeholder.com/300x200/ffe4e1/ffffff?text=МОЙ+ПОДАРОК"
  },
  {
    question: "10 августа 2023 года — день нашей свадьбы. Какого цвета было небо?",
    options: ["Ясно-голубое", "Закатно-розовое", "С облаками"],
    correct: 1, // Индекс правильного ответа (1 - второй вариант)
    photo: "https://via.placeholder.com/300x200/e6e6fa/ffffff?text=НАША+СВАДЬБА"
  },
  {
    question: "Что я больше всего люблю в тебе?",
    options: ["Твой смех", "Твои глаза", "Всё целиком!"],
    correct: 2, // Индекс правильного ответа (2 - третий вариант)
    photo: "https://via.placeholder.com/300x200/fff0f5/ffffff?text=Я+ТЕБЯ+ЛЮБЛЮ"
  }
];

const Quest8 = ({ onBack }) => {
  // === СОСТОЯНИЯ ===
  const [pass, setPass] = useState('');           // Введенный пароль
  const [isUnlocked, setIsUnlocked] = useState(false);  // Открыт ли доступ
  const [step, setStep] = useState(0);            // Текущий вопрос
  const [isFinished, setIsFinished] = useState(false);   // Статус завершения
  const [showHint, setShowHint] = useState(false);       // Показывать подсказку
  const [hearts, setHearts] = useState([]);              // Анимация сердечек
  const [wrongAttempts, setWrongAttempts] = useState(0); // Счетчик ошибок

  // Эффект для подсказки пароля
  useEffect(() => {
    if (!isUnlocked && pass.length === 8 && pass !== '22062018') {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pass, isUnlocked]);

  // Эффект для подсказки при неправильных ответах
  useEffect(() => {
    if (wrongAttempts >= 2 && !isFinished && isUnlocked) {
      const timer = setTimeout(() => {
        alert("❤️ Подсказка: вспомни самый счастливый момент, связанный с этим вопросом! ❤️");
        setWrongAttempts(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [wrongAttempts, isFinished, isUnlocked]);

  // Функция создания сердечек
  const createHearts = (count = 8) => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      size: 15 + Math.random() * 25
    }));
    setHearts([...hearts, ...newHearts]);
    setTimeout(() => setHearts([]), 1500);
  };

  // Проверка пароля
  const handleLogin = () => {
    if (pass === '22062018') {
      createHearts(12);
      setTimeout(() => setIsUnlocked(true), 500);
    } else {
      alert("❤️ Не тот день, любимая. Вспомни начало нашей истории! ❤️");
      setPass('');
    }
  };

  // Обработка ответов
  const handleAnswer = (index) => {
    if (index === quizData[step].correct) {
      createHearts(10);
      if (step + 1 < quizData.length) {
        setTimeout(() => setStep(step + 1), 400);
      } else {
        setTimeout(() => setIsFinished(true), 400);
      }
      setWrongAttempts(0);
    } else {
      alert("😘 Попробуй еще раз, родная! 😘");
      setWrongAttempts(prev => prev + 1);
    }
  };

  // Нажатие Enter в поле пароля
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // 1. Экран ввода пароля
  if (!isUnlocked) {
    return (
      <div className="px-root">
        <style>{romanticPixelStyles}</style>
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="px-floating-heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`
            }}
          >
            ❤️
          </div>
        ))}
        <button className="px-back" onClick={onBack}>← НАЗАД</button>
        <div className="px-box">
          <div className="px-title">💕 8 BIT LOVE STORY 💕</div>
          <div className="px-heart-animation">❤️</div>
          <p className="px-text">
            Введи дату нашего знакомства
          </p>
          <p className="px-small-text">
            (день, когда всё началось)
          </p>
          <input 
            type="password" 
            className="px-input" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="ДДММГГГГ"
            maxLength="8"
            autoFocus
          />
          {showHint && (
            <div className="px-hint">
              💭 22 июня 2018 года 💭
            </div>
          )}
          <button className="px-btn" onClick={handleLogin}>
            ❤️ НАЧАТЬ ИСТОРИЮ ❤️
          </button>
        </div>
      </div>
    );
  }

  // 2. Экран финала
  if (isFinished) {
    return (
      <div className="px-root">
        <style>{romanticPixelStyles}</style>
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="px-floating-heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`
            }}
          >
            ❤️
          </div>
        ))}
        <button className="px-back" onClick={onBack}>← МЕНЮ</button>
        <div className="px-box px-final-box">
          <div className="px-title">✨ ТЫ ПРОШЛА ВЕСЬ ПУТЬ! ✨</div>
          <div className="px-big-heart">💝</div>
          <p className="px-text">
            Спасибо, что прошла этот квиз,<br />
            как мы прошли вместе все эти годы
          </p>
          <p className="px-love-text">
            Я люблю тебя больше жизни! ❤️
          </p>
          <div className="px-surprise">
            <span className="px-surprise-title">🎁 СЮРПРИЗ 🎁</span>
            <p className="px-surprise-text">
              Сегодня в 16:00 мы едем в секретное место!<br />
              <span className="px-small">(одевайся красиво, тебя ждёт сюрприз)</span>
            </p>
            <p className="px-surprise-details">
              🍽️ Ужин при свечах<br />
              💐 Море цветов<br />
              ✨ И кое-что особенное...
            </p>
          </div>
          <p className="px-signature">
            Твой любимый навсегда ❤️
          </p>
          <button className="px-btn" onClick={onBack}>
            ❤️ В МЕНЮ ❤️
          </button>
        </div>
      </div>
    );
  }

  // 3. Экран квиза
  return (
    <div className="px-root">
      <style>{romanticPixelStyles}</style>
      {hearts.map(heart => (
        <div 
          key={heart.id}
          className="px-floating-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`
          }}
        >
          ❤️
        </div>
      ))}
      <div className="px-header">
        <span>❤️ ВОПРОС {step + 1}/{quizData.length} ❤️</span>
      </div>
      <button className="px-back" onClick={() => {
        if (window.confirm('Вернуться в меню? Прогресс сбросится')) {
          onBack();
        }
      }}>← МЕНЮ</button>
      
      <div className="px-box px-quiz-box">
        <div className="px-img-container">
          <img 
            src={quizData[step].photo} 
            alt={`Наше воспоминание ${step + 1}`} 
            className="px-img" 
          />
          <div className="px-img-overlay">
            <span>❤️</span>
          </div>
        </div>
        
        <p className="px-question">{quizData[step].question}</p>
        
        <div className="px-options">
          {quizData[step].options.map((opt, i) => (
            <button 
              key={i} 
              className="px-btn-opt"
              onClick={() => handleAnswer(i)}
            >
              <span className="px-opt-letter">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          ))}
        </div>
        
        <div className="px-progress">
          <div 
            className="px-progress-bar" 
            style={{ width: `${((step + 1) / quizData.length) * 100}%` }}
          >
            <span className="px-progress-text">
              {Math.round(((step + 1) / quizData.length) * 100)}%
            </span>
          </div>
        </div>
        
        <p className="px-hint-text">
          💭 Выбери правильный ответ, любимая
        </p>
      </div>
    </div>
  );
};

// === РОМАНТИЧНЫЙ ПИКСЕЛЬНЫЙ ДИЗАЙН ===
const romanticPixelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .px-root { 
    position: fixed !important; 
    inset: 0 !important; 
    background: linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%) !important; 
    font-family: 'Press Start 2P', cursive !important; 
    display: flex !important; 
    align-items: center !important; 
    justify-content: center !important; 
    z-index: 200000 !important; 
    padding: 20px !important; 
    color: #5d4037 !important; 
    overflow: hidden !important;
  }
  
  .px-box { 
    background: rgba(255, 255, 255, 0.95) !important; 
    border: 4px solid #ffb6c1 !important; 
    padding: 30px 20px !important; 
    max-width: 500px !important; 
    width: 90% !important;
    text-align: center !important; 
    box-shadow: 8px 8px 0px #ffc0cb, 0 10px 20px rgba(0,0,0,0.1) !important; 
    position: relative !important;
    z-index: 10 !important;
    animation: px-appear 0.5s ease-out !important;
  }
  
  @keyframes px-appear {
    from { 
      opacity: 0; 
      transform: scale(0.9) translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  .px-title { 
    font-size: clamp(10px, 3vw, 14px) !important; 
    color: #ff69b4 !important; 
    margin-bottom: 20px !important; 
    text-shadow: 2px 2px 0px #ffc0cb !important;
    line-height: 1.5 !important;
  }
  
  .px-text { 
    font-size: clamp(7px, 2vw, 8px) !important; 
    margin-bottom: 15px !important; 
    line-height: 1.8 !important; 
  }
  
  .px-small-text {
    font-size: 6px !important;
    color: #ff69b4 !important;
    margin-bottom: 15px !important;
  }
  
  .px-question { 
    font-size: clamp(8px, 2.5vw, 10px) !important; 
    margin: 20px 0 !important; 
    line-height: 1.8 !important; 
    color: #5d4037 !important;
    min-height: 60px !important;
    padding: 0 10px !important;
  }
  
  .px-input { 
    width: 200px !important; 
    max-width: 80% !important;
    border: 3px solid #ffb6c1 !important; 
    padding: 12px !important; 
    margin: 15px auto !important; 
    text-align: center !important; 
    font-family: inherit !important; 
    font-size: clamp(8px, 2vw, 10px) !important;
    display: block !important;
    transition: all 0.3s !important;
    background: white !important;
  }
  
  .px-input:focus {
    outline: none !important;
    border-color: #ff69b4 !important;
    box-shadow: 0 0 10px #ffb6c1 !important;
    transform: scale(1.02) !important;
  }
  
  .px-input::placeholder {
    color: #ffb6c1 !important;
    font-size: 6px !important;
  }
  
  .px-btn { 
    background: #ffb6c1 !important; 
    color: white !important; 
    border: none !important; 
    padding: 12px 24px !important; 
    cursor: pointer !important; 
    font-family: inherit !important;
    font-size: clamp(7px, 2vw, 8px) !important;
    transition: all 0.3s !important;
    border: 2px solid transparent !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  .px-btn:hover {
    background: #ff69b4 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 15px rgba(255,105,180,0.4) !important;
  }
  
  .px-btn:active {
    transform: translateY(0) !important;
  }
  
  .px-btn::after {
    content: "";
    position: absolute !important;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }
  
  .px-btn:hover::after {
    width: 100px;
    height: 100px;
  }
  
  .px-btn-opt { 
    width: 100% !important; 
    background: #fff5f7 !important; 
    border: 3px solid #ffb6c1 !important; 
    margin: 8px 0 !important; 
    padding: 15px 10px !important; 
    cursor: pointer !important; 
    font-size: clamp(7px, 2vw, 8px) !important; 
    color: #5d4037 !important; 
    font-family: inherit !important;
    transition: all 0.3s !important;
    position: relative !important;
    overflow: hidden !important;
    text-align: left !important;
    padding-left: 35px !important;
  }
  
  .px-opt-letter {
    position: absolute !important;
    left: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    color: #ff69b4 !important;
    font-weight: bold !important;
    font-size: 10px !important;
  }
  
  .px-btn-opt:hover {
    background: #ffe4e1 !important;
    transform: translateX(5px) !important;
    border-color: #ff69b4 !important;
  }
  
  .px-btn-opt::before {
    content: "❤️";
    position: absolute !important;
    right: -20px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    opacity: 0 !important;
    transition: all 0.3s !important;
    font-size: 12px !important;
  }
  
  .px-btn-opt:hover::before {
    right: 15px !important;
    opacity: 1 !important;
  }
  
  .px-btn-opt:active {
    transform: scale(0.98) translateX(5px) !important;
  }
  
  .px-surprise { 
    background: #fff0f5 !important; 
    border: 3px dashed #ff69b4 !important; 
    padding: 20px !important; 
    font-size: clamp(7px, 2vw, 8px) !important; 
    margin: 25px 0 !important; 
    line-height: 2 !important;
    animation: px-pulse 2s infinite !important;
    border-radius: 10px !important;
  }
  
  @keyframes px-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  .px-surprise-title {
    display: block !important;
    font-size: clamp(9px, 2.5vw, 12px) !important;
    color: #ff69b4 !important;
    margin-bottom: 15px !important;
    font-weight: bold !important;
  }
  
  .px-surprise-text {
    margin-bottom: 15px !important;
    line-height: 1.8 !important;
  }
  
  .px-surprise-details {
    background: white !important;
    padding: 15px !important;
    border-radius: 8px !important;
    font-size: clamp(6px, 1.8vw, 7px) !important;
    color: #ff69b4 !important;
    line-height: 2 !important;
  }
  
  .px-header { 
    position: absolute !important; 
    top: 20px !important; 
    left: 50% !important;
    transform: translateX(-50%) !important;
    font-size: clamp(7px, 2vw, 8px) !important; 
    color: #ff69b4 !important;
    background: white !important;
    padding: 10px 20px !important;
    border: 3px solid #ffb6c1 !important;
    box-shadow: 4px 4px 0 #ffc0cb !important;
    z-index: 20 !important;
    white-space: nowrap !important;
  }
  
  .px-img-container {
    position: relative !important;
    width: 100% !important;
    margin-bottom: 20px !important;
    overflow: hidden !important;
    border: 4px solid #ffb6c1 !important;
    box-shadow: 4px 4px 0 #ffc0cb !important;
  }
  
  .px-img { 
    width: 100% !important; 
    height: auto !important; 
    display: block !important;
    transition: all 0.5s !important;
  }
  
  .px-img:hover {
    transform: scale(1.05) !important;
  }
  
  .px-img-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: linear-gradient(45deg, rgba(255,182,193,0.2), rgba(255,105,180,0.2)) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    opacity: 0 !important;
    transition: opacity 0.3s !important;
    pointer-events: none !important;
  }
  
  .px-img-container:hover .px-img-overlay {
    opacity: 1 !important;
  }
  
  .px-img-overlay span {
    font-size: 40px !important;
    animation: px-heartbeat 1s infinite !important;
  }
  
  .px-back { 
    position: absolute !important; 
    top: 20px !important; 
    left: 20px !important; 
    background: white !important; 
    border: 3px solid #ffb6c1 !important; 
    color: #ff69b4 !important; 
    padding: 8px 16px !important; 
    font-family: 'Press Start 2P' !important; 
    font-size: clamp(6px, 1.8vw, 7px) !important; 
    cursor: pointer !important;
    z-index: 20 !important;
    transition: all 0.3s !important;
    box-shadow: 2px 2px 0 #ffc0cb !important;
  }
  
  .px-back:hover {
    background: #ffb6c1 !important;
    color: white !important;
    transform: translateX(-2px) !important;
  }
  
  .px-back:active {
    transform: translateX(0) !important;
  }
  
  .px-heart-animation {
    font-size: clamp(30px, 8vw, 40px) !important;
    animation: px-heartbeat 1.5s ease-in-out infinite !important;
    margin: 10px 0 !important;
  }
  
  @keyframes px-heartbeat {
    0% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1); }
    75% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .px-floating-heart {
    position: absolute !important;
    bottom: -20px !important;
    animation: px-float 1.5s ease-out forwards !important;
    pointer-events: none !important;
    z-index: 5 !important;
    text-shadow: 0 0 10px rgba(255,105,180,0.5) !important;
  }
  
  @keyframes px-float {
    0% { 
      transform: translateY(0) rotate(0deg) scale(1); 
      opacity: 1; 
    }
    100% { 
      transform: translateY(-100vh) rotate(360deg) scale(0); 
      opacity: 0; 
    }
  }
  
  .px-hint {
    font-size: 7px !important;
    color: #ff69b4 !important;
    margin: 10px 0 20px !important;
    animation: px-fadeIn 0.3s !important;
    background: #fff0f5 !important;
    padding: 10px !important;
    border: 2px dashed #ffb6c1 !important;
  }
  
  @keyframes px-fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .px-progress {
    width: 100% !important;
    height: 20px !important;
    background: #ffe4e1 !important;
    margin: 25px 0 15px !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    border: 2px solid #ffb6c1 !important;
    position: relative !important;
  }
  
  .px-progress-bar {
    height: 100% !important;
    background: linear-gradient(90deg, #ffb6c1, #ff69b4) !important;
    transition: width 0.5s ease !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
  }
  
  .px-progress-text {
    color: white !important;
    font-size: 7px !important;
    padding: 0 8px !important;
    text-shadow: 1px 1px 0 #00000033 !important;
  }
  
  .px-hint-text {
    font-size: 6px !important;
    color: #ff69b4 !important;
    margin-top: 10px !important;
    opacity: 0.8 !important;
  }
  
  .px-big-heart {
    font-size: clamp(40px, 10vw, 60px) !important;
    margin: 20px 0 !important;
    animation: px-spin 4s linear infinite !important;
    display: inline-block !important;
  }
  
  @keyframes px-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .px-love-text {
    font-size: clamp(8px, 2.2vw, 10px) !important;
    color: #ff69b4 !important;
    margin: 20px 0 !important;
    line-height: 1.8 !important;
  }
  
  .px-signature {
    font-size: 8px !important;
    color: #ff69b4 !important;
    margin: 20px 0 10px !important;
    font-style: italic !important;
  }
  
  .px-small {
    font-size: 5px !important;
    opacity: 0.8 !important;
    display: block !important;
    margin-top: 5px !important;
  }
  
  .px-quiz-box {
    max-width: 550px !important;
    width: 95% !important;
    padding: 25px !important;
  }
  
  .px-final-box {
    max-width: 500px !important;
  }
  
  /* Адаптивность для мобильных */
  @media (max-width: 480px) {
    .px-box { 
      padding: 20px 15px !important; 
    }
    
    .px-title { 
      font-size: 10px !important; 
    }
    
    .px-question { 
      font-size: 8px !important; 
      min-height: 50px !important;
    }
    
    .px-btn-opt { 
      padding: 12px 8px 12px 30px !important; 
      font-size: 7px !important;
    }
    
    .px-opt-letter {
      left: 8px !important;
      font-size: 8px !important;
    }
    
    .px-back {
      padding: 6px 12px !important;
    }
    
    .px-header {
      padding: 8px 16px !important;
    }
    
    .px-surprise-details {
      padding: 10px !important;
    }
  }
  
  /* Для очень маленьких экранов */
  @media (max-width: 320px) {
    .px-box {
      padding: 15px 10px !important;
    }
    
    .px-btn-opt {
      padding: 10px 8px 10px 25px !important;
    }
    
    .px-title {
      font-size: 8px !important;
    }
  }
  
  /* Запрет выделения текста */
  .px-root * {
    user-select: none !important;
    -webkit-user-select: none !important;
  }
  
  /* Разрешаем ввод в инпуте */
  .px-input {
    user-select: text !important;
    -webkit-user-select: text !important;
  }
`;

export default Quest8;

import React, { useState, useEffect } from 'react';

const quizData = [
  {
    question: "Наш самый первый день: 22 июня 2018 года. Где мы познакомились?",
    options: ["В парке", "В универе", "На вечеринке"],
    correct: 1,
    photo: "https://via.placeholder.com/300x200/ffc0cb/ffffff?text=НАШЕ+ЗНАКОМСТВО", // ← замени на реальную фотографию!
  },
  {
    question: "Какой подарок от меня тебе запомнился больше всего?",
    options: ["Цветы", "Украшение", "Эмоции"],
    correct: 2,
    photo: "https://via.placeholder.com/300x200/ffe4e1/ffffff?text=ПОДАРОК", // ← замени!
  },
  {
    question: "10 августа 2023 года — день нашей свадьбы. Какого цвета было небо?",
    options: ["Ясно-голубое", "Закатно-розовое", "С облаками"],
    correct: 1,
    photo: "https://via.placeholder.com/300x200/e6e6fa/ffffff?text=СВАДЬБА", // ← замени!
  },
  {
    question: "Что я больше всего люблю в тебе?",
    options: ["Твой смех", "Твои глаза", "Всё целиком!"],
    correct: 2,
    photo: "https://via.placeholder.com/300x200/fff0f5/ffffff?text=ЛЮБЛЮ+ТЕБЯ", // ← замени!
  },
];

const wrongReplies = [
  "Ой, любимая… это было бы слишком просто 😏",
  "Ты меня проверяешь, да? 🥺",
  "Неееет, вспомни наши вечера…",
  "А вот тут я даже чуть-чуть обиделся 😤❤️",
  "Ты же знаешь правду, давай ещё разочек…",
  "Сердце подсказывает другое, правда? 💕",
];

const Quest8 = ({ onBack }) => {
  const [pass, setPass] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Автоматический фокус на поле ввода пароля
  useEffect(() => {
    if (!isUnlocked) {
      document.querySelector('.px-input')?.focus();
    }
  }, [isUnlocked]);

  const handleLogin = () => {
    if (pass === '22062018') {
      setIsUnlocked(true);
    } else {
      alert("Не тот день, родная. Вспомни, когда всё началось! ❤️");
    }
  };

  const handleAnswer = (index) => {
    if (index === quizData[step].correct) {
      if (step + 1 < quizData.length) {
        setStep(step + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      const msg = wrongReplies[Math.floor(Math.random() * wrongReplies.length)];
      alert(msg);
    }
  };

  // Обработка Enter для пароля
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isUnlocked) {
    return (
      <div className="px-root">
        <style>{romanticPixelStyles}</style>
        <button className="px-back" onClick={onBack}>←</button>
        <div className="px-box">
          <div className="px-title">8 BIT LOVE STORY</div>
          <p className="px-text">Введи дату нашего знакомства (ДДММГГГГ)</p>
          <input
            type="password"
            className="px-input"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="22062018"
          />
          <button className="px-btn" onClick={handleLogin}>НАЧАТЬ ПУТЬ</button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="px-root">
        <style>{romanticPixelStyles}</style>
        {/* Можно вставить вашу любимую песню — лучше короткий отрывок 30–60 сек */}
        <audio autoPlay loop volume="0.25">
          <source src="https://example.com/your-romantic-song.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="px-box finish-box">
          <div className="px-title">LEVEL COMPLETE! 💍</div>
          <img
            src="https://via.placeholder.com/320x320/fff0f5/000000?text=НАШЕ+СЧАСТЬЕ" // ← самое красивое ваше общее фото!
            alt="Мы"
            className="px-img finish-img"
          />
          <p className="px-text" style={{ fontSize: '10px', margin: '15px 0' }}>
            Ты прошла весь путь со мной… как и всегда ❤️
          </p>
          <div className="px-surprise">
            В 16:00 мы едем в секретное место.<br />
            Надень то самое платье с нашей свадьбы…<br />
            Сегодня будет особенный день. Готовься к приключению! 🌹
          </div>
          <button className="px-btn" onClick={onBack}>В МЕНЮ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-root">
      <style>{romanticPixelStyles}</style>
      <div className="px-header">
        {quizData.map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              color: i <= step ? '#ff69b4' : '#ffb6c1',
              opacity: i > step ? 0.4 : 1,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="px-box">
        <img
          src={quizData[step].photo}
          alt="Memory"
          className="px-img"
        />
        <p className="px-question">{quizData[step].question}</p>
        <div className="px-options">
          {quizData[step].options.map((opt, i) => (
            <button
              key={i}
              className="px-btn-opt"
              onClick={() => handleAnswer(i)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Стили (дополнены анимациями, градиентом, сердечками)
const romanticPixelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .px-root {
    position: fixed !important; inset: 0 !important;
    background: linear-gradient(135deg, #fff0f5 0%, #ffe4e9 100%) !important;
    font-family: 'Press Start 2P', cursive !important;
    display: flex !important; align-items: center !important;
    justify-content: center !important; z-index: 200000 !important;
    padding: 20px !important; color: #5d4037 !important;
    overflow: hidden !important;
  }

  .px-root::before {
    content: '♥♥♥♥♥♥♥♥♥♥';
    position: absolute; inset: 0;
    color: #ffb6c1; opacity: 0.12;
    font-size: 80px; line-height: 0.7;
    pointer-events: none;
    animation: floatHearts 40s linear infinite;
    white-space: pre;
  }

  @keyframes floatHearts {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-120vh) rotate(360deg); }
  }

  .px-box {
    background: rgba(255,255,255,0.92) !important;
    border: 4px solid #ffb6c1 !important;
    padding: 24px !important;
    max-width: 420px !important;
    width: 90vw !important;
    text-align: center !important;
    box-shadow: 8px 8px 0 #ffc0cb !important;
    border-radius: 12px !important;
  }

  .finish-box { padding: 30px !important; }

  .px-title { font-size: 14px !important; color: #ff69b4 !important; margin-bottom: 20px !important; letter-spacing: 2px; }
  .px-text { font-size: 9px !important; margin-bottom: 20px !important; line-height: 1.5 !important; }
  .px-question { font-size: 11px !important; margin: 0 0 24px !important; line-height: 1.6 !important; }

  .px-input {
    width: 85% !important; border: 3px solid #ffb6c1 !important;
    padding: 12px !important; margin-bottom: 20px !important;
    text-align: center !important; font-family: inherit !important;
    font-size: 14px !important;
  }

  .px-btn {
    background: #ff69b4 !important; color: white !important;
    border: none !important; padding: 12px 28px !important;
    cursor: pointer !important; font-family: inherit !important;
    font-size: 11px !important; margin-top: 8px !important;
    transition: all 0.2s;
  }

  .px-btn:hover { transform: scale(1.08); background: #ff1493 !important; }

  .px-btn-opt {
    width: 100% !important; background: #fff5f7 !important;
    border: 2px solid #ffb6c1 !important; margin-bottom: 10px !important;
    padding: 12px !important; cursor: pointer !important;
    font-size: 9px !important; color: #5d4037 !important;
    font-family: inherit !important;
    transition: all 0.18s;
  }

  .px-btn-opt:hover {
    background: #ff69b4 !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 0 #ff1493;
  }

  .px-surprise {
    background: #fff0f5 !important; border: 3px dashed #ff69b4 !important;
    padding: 16px !important; font-size: 9px !important;
    margin: 24px 0 !important; line-height: 1.7 !important;
    border-radius: 8px !important;
  }

  .px-header {
    position: absolute !important; top: 20px !important;
    font-size: 20px !important; letter-spacing: 6px !important;
  }

  .heart { margin: 0 4px; }

  .px-img {
    width: 100% !important; max-height: 280px !important;
    object-fit: cover !important;
    border: 3px solid #ffb6c1 !important;
    margin-bottom: 20px !important;
    border-radius: 8px !important;
    box-shadow: 4px 4px 0 #ffc0cb !important;
    animation: fadeIn 1.2s ease-out;
  }

  .finish-img {
    border-radius: 50% !important;
    width: 180px !important; height: 180px !important;
    object-fit: cover !important;
    margin: 10px auto 20px !important;
  }

  .px-back {
    position: absolute !important; top: 20px !important; left: 20px !important;
    background: none !important; border: 2px solid #ffb6c1 !important;
    color: #ff69b4 !important; padding: 6px 12px !important;
    font-family: inherit !important; font-size: 10px !important;
    cursor: pointer !important;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default Quest8;

import React, { useState } from 'react';

// // Массив вопросов с сюжетом вашей истории
// // Сюда нужно будет вставить реальные ссылки на ваши фото
const quizData = [
  {
    question: "Наш самый первый день: 22 июня 2018 года. Где мы познакомились?",
    options: ["В парке", "В универе", "На вечеринке"],
    correct: 1, // // Индекс правильного ответа
    photo: "https://via.placeholder.com/300x200/ffc0cb/ffffff?text=FIRST+MEETING"
  },
  {
    question: "Какой подарок от меня тебе запомнился больше всего?",
    options: ["Цветы", "Украшение", "Эмоции"],
    correct: 2,
    photo: "https://via.placeholder.com/300x200/ffe4e1/ffffff?text=OUR+MEMORY"
  },
  {
    question: "10 августа 2023 года — день нашей свадьбы. Какого цвета было небо?",
    options: ["Ясно-голубое", "Закатно-розовое", "С облаками"],
    correct: 1,
    photo: "https://via.placeholder.com/300x200/e6e6fa/ffffff?text=WEDDING+DAY"
  },
  {
    question: "Что я больше всего люблю в тебе?",
    options: ["Твой смех", "Твои глаза", "Всё целиком!"],
    correct: 2,
    photo: "https://via.placeholder.com/300x200/fff0f5/ffffff?text=LOVE+YOU"
  }
];

const Quest8 = ({ onBack }) => {
  // // === СОСТОЯНИЕ ===
  const [pass, setPass] = useState('');      // // Введенный пароль
  const [isUnlocked, setIsUnlocked] = useState(false); // // Открыт ли доступ
  const [step, setStep] = useState(0);       // // Текущий вопрос
  const [isFinished, setIsFinished] = useState(false); // // Статус завершения

  // // Проверка пароля (дата знакомства: 22 июня 2018)
  const handleLogin = () => {
    if (pass === '22062018') {
      setIsUnlocked(true);
    } else {
      alert("Не тот день, любимая. Вспомни начало нашей истории! ❤️");
    }
  };

  // // Логика ответа
  const handleAnswer = (index) => {
    if (index === quizData[step].correct) {
      if (step + 1 < quizData.length) {
        setStep(step + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      alert("Попробуй еще раз, родная! 😘");
    }
  };

  // // 1. Экран ввода пароля
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
            placeholder="ДДММГГГГ" 
          />
          <button className="px-btn" onClick={handleLogin}>START</button>
        </div>
      </div>
    );
  }

  // // 2. Экран финала (Сюрприз)
  if (isFinished) {
    return (
      <div className="px-root">
        <style>{romanticPixelStyles}</style>
        <div className="px-box">
          <div className="px-title">LEVEL COMPLETE! 💍</div>
          <p className="px-text">Ты прошла этот путь со мной!</p>
          <div className="px-surprise">
            ВАЖНО: В 16:00 мы едем в секретное место. <br/>Будь готова к приключениям! ❤️
          </div>
          <button className="px-btn" onClick={onBack}>В МЕНЮ</button>
        </div>
      </div>
    );
  }

  // // 3. Экран Квиза
  return (
    <div className="px-root">
      <style>{romanticPixelStyles}</style>
      <div className="px-header">QUEST: {step + 1}/{quizData.length}</div>
      <div className="px-box">
        <img src={quizData[step].photo} alt="Quest" className="px-img" />
        <p className="px-question">{quizData[step].question}</p>
        <div className="px-options">
          {quizData[step].options.map((opt, i) => (
            <button key={i} className="px-btn-opt" onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// // === РОМАНТИЧНЫЙ ПИКСЕЛЬНЫЙ ДИЗАЙН ===
const romanticPixelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .px-root { 
    position: fixed !important; inset: 0 !important; 
    background: #fff0f5 !important; 
    font-family: 'Press Start 2P', cursive !important; 
    display: flex !important; align-items: center !important; 
    justify-content: center !important; z-index: 200000 !important; 
    padding: 20px !important; color: #5d4037 !important; 
  }
  
  .px-box { 
    background: #fff !important; border: 4px solid #ffb6c1 !important; 
    padding: 20px !important; max-width: 400px !important; 
    text-align: center !important; box-shadow: 8px 8px 0px #ffc0cb !important; 
  }
  
  .px-title { font-size: 12px !important; color: #ff69b4 !important; margin-bottom: 20px !important; }
  .px-text { font-size: 8px !important; margin-bottom: 20px !important; line-height: 1.4 !important; }
  .px-question { font-size: 10px !important; margin-bottom: 20px !important; line-height: 1.6 !important; }
  
  .px-input { 
    width: 80% !important; border: 2px solid #ffb6c1 !important; 
    padding: 10px !important; margin-bottom: 20px !important; 
    text-align: center !important; font-family: inherit !important; 
  }
  
  .px-btn { 
    background: #ffb6c1 !important; color: white !important; 
    border: none !important; padding: 10px 20px !important; 
    cursor: pointer !important; font-family: inherit !important;
  }
  
  .px-btn-opt { 
    width: 100% !important; background: #fff5f7 !important; 
    border: 2px solid #ffb6c1 !important; margin-bottom: 8px !important; 
    padding: 10px !important; cursor: pointer !important; 
    font-size: 8px !important; color: #5d4037 !important; 
    font-family: inherit !important;
  }
  
  .px-surprise { 
    background: #fff0f5 !important; border: 2px dashed #ff69b4 !important; 
    padding: 10px !important; font-size: 8px !important; 
    margin: 20px 0 !important; line-height: 1.8 !important;
  }
  
  .px-header { position: absolute !important; top: 20px !important; font-size: 8px !important; }
  
  .px-img { 
    width: 100% !important; height: auto !important; 
    border: 2px solid #ffb6c1 !important; margin-bottom: 15px !important; 
  }
  
  .px-back { 
    position: absolute !important; top: 20px !important; left: 20px !important; 
    background: none !important; border: 2px solid #ffb6c1 !important; 
    color: #ff69b4 !important; padding: 5px 10px !important; 
    font-family: 'Press Start 2P' !important; font-size: 8px !important; 
    cursor: pointer !important;
  }
`;

export default Quest8;

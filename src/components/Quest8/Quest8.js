import React, { useState } from 'react';

// // Массив вопросов квиза
// // Каждому вопросу можно добавить свою ссылку на фото
const quizData = [
  {
    question: "Кто самая красивая девочка в этом приложении?",
    options: ["Моя жена", "Анджелина Джоли", "Та, что сейчас смотрит в экран"],
    correct: 2, // Индекс правильного ответа
    photo: "https://via.placeholder.com/150?text=LOVE" // // Сюда вставь ссылку на её фото
  },
  {
    question: "Какое наше любимое блюдо, которое мы заказываем чаще всего?",
    options: ["Пицца", "Суши", "Бургеры"],
    correct: 1,
    photo: "https://via.placeholder.com/150?text=FOOD"
  },
  {
    question: "Где мы сделали наше самое крутое фото в прошлом году?",
    options: ["В парке", "На море", "Дома в зеркале"],
    correct: 1,
    photo: "https://via.placeholder.com/150?text=TRAVEL"
  }
];

const Quest8 = ({ onBack }) => {
  // // === СОСТОЯНИЕ ===
  const [pass, setPass] = useState(''); // // Пароль
  const [isUnlocked, setIsUnlocked] = useState(false); // // Доступ
  const [step, setStep] = useState(0); // // Текущий вопрос
  const [isFinished, setIsFinished] = useState(false); // // Финиш квеста

  // // Проверка секретного пароля
  const handleLogin = () => {
    // // Замени '0803' на ваш пароль
    if (pass === '0803') {
      setIsUnlocked(true);
    } else {
      alert("Доступ запрещен! Только для избранных ❤️");
    }
  };

  // // Проверка ответа в квизе
  const handleAnswer = (index) => {
    if (index === quizData[step].correct) {
      if (step + 1 < quizData.length) {
        setStep(step + 1);
      } else {
        setIsFinished(true);
      }
    } else {
      alert("Попробуй еще раз, ты точно это знаешь! 😘");
    }
  };

  // // 1. Экран входа (Пароль)
  if (!isUnlocked) {
    return (
      <div className="px-root">
        <style>{pixelStyles}</style>
        <button className="px-back" onClick={onBack}>ESC</button>
        <div className="px-box fade-in">
          <div className="px-title">LEVEL: 8 MARCH</div>
          <p className="px-text">ВВЕДИ ПАРОЛЬ</p>
          <input 
            type="password" 
            className="px-input" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)}
            placeholder="****"
          />
          <button className="px-btn" onClick={handleLogin}>START</button>
        </div>
      </div>
    );
  }

  // // 2. Экран финала (Поздравление и сюрприз)
  if (isFinished) {
    return (
      <div className="px-root">
        <style>{pixelStyles}</style>
        <div className="px-box fade-in">
          <div className="px-title">YOU WIN! 🏆</div>
          <img src="https://via.placeholder.com/200?text=HEART" alt="Final" className="px-img" />
          <p className="px-text">Любимая, поздравляю с 8 марта!</p>
          <div className="px-surprise">
            ВАЖНО: В 16:00 мы едем в секретное место. <br/>Будь готова! ❤️
          </div>
          <button className="px-btn" onClick={onBack}>В МЕНЮ</button>
        </div>
      </div>
    );
  }

  // // 3. Экран Квиза
  return (
    <div className="px-root">
      <style>{pixelStyles}</style>
      <div className="px-header">QUEST: {step + 1}/{quizData.length}</div>
      <div className="px-box fade-in">
        <img src={quizData[step].photo} alt="Quest" className="px-img" />
        <p className="px-question">{quizData[step].question}</p>
        <div className="px-options">
          {quizData[step].options.map((opt, i) => (
            <button key={i} className="px-btn-opt" onClick={() => handleAnswer(i)}>
              {i + 1}. {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// // === ПИКСЕЛЬНЫЙ ДИЗАЙН (Точечные стили) ===
const pixelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .px-root {
    position: fixed !important; inset: 0 !important;
    background: #222 !important;
    font-family: 'Press Start 2P', cursive !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    z-index: 200000 !important; padding: 20px !important; color: #fff !important;
  }

  .px-box {
    background: #333 !important; border: 4px solid #fff !important;
    padding: 30px 20px !important; width: 100% !important; max-width: 400px !important;
    box-shadow: 8px 8px 0px #000 !important; text-align: center !important;
  }

  .px-title { font-size: 14px !important; color: #00ff00 !important; margin-bottom: 20px !important; line-height: 1.5 !important; }
  .px-text { font-size: 10px !important; margin-bottom: 20px !important; }
  .px-question { font-size: 12px !important; margin-bottom: 25px !important; line-height: 1.6 !important; }

  .px-input {
    width: 100% !important; background: #000 !important; border: 2px solid #fff !important;
    color: #00ff00 !important; padding: 10px !important; font-family: 'Press Start 2P' !important;
    text-align: center !important; margin-bottom: 20px !important; outline: none !important;
  }

  .px-btn {
    background: #ff00ff !important; color: #fff !important; border: none !important;
    padding: 15px 30px !important; font-family: 'Press Start 2P' !important;
    font-size: 12px !important; cursor: pointer !important; box-shadow: 4px 4px 0px #000 !important;
  }

  .px-btn-opt {
    width: 100% !important; background: #444 !important; border: 2px solid #fff !important;
    color: #fff !important; padding: 12px 10px !important; font-family: 'Press Start 2P' !important;
    font-size: 9px !important; margin-bottom: 10px !important; text-align: left !important;
    cursor: pointer !important;
  }

  .px-img { width: 100% !important; height: 150px !important; object-fit: cover !important; border: 2px solid #fff !important; margin-bottom: 20px !important; }
  
  .px-surprise { 
    background: #000 !important; border: 2px dashed #ff00ff !important; 
    padding: 15px !important; font-size: 8px !important; line-height: 2 !important; color: #00ffff !important;
    margin-bottom: 20px !important;
  }

  .px-header { position: absolute !important; top: 20px !important; font-size: 10px !important; }
  .px-back { 
    position: absolute !important; top: 20px !important; left: 20px !important; 
    background: none !important; border: 2px solid #fff !important; color: #fff !important;
    padding: 5px 10px !important; font-family: 'Press Start 2P' !important; font-size: 8px !important;
  }
`;

export default Quest8;

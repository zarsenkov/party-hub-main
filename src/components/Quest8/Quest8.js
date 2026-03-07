import React, { useState, useEffect } from 'react';

// // Код перенесен из Canva без изменений дизайна и логики
const quizData = [
  {
    stage: "СЦЕНА 1: ШКОЛЬНЫЕ ДНИ 🎓",
    quest: "Помнишь? Мы были в параллельных классах, но близко не общались. Когда мы по-настоящему друг друга заметили?",
    options: ["В 9 классе на школьных мероприятиях", "В 10 классе, когда объединили классы", "После последнего звонка в 11 классе, когда я провожал тебя 💕"],
    correct: 2,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=SCHOOL+DAYS",
    hint: "💭 Это было в конце 11 класса... помнишь, как я провожал тебя до подъезда? Это был момент... 🌙",
    reward: "✅ Наша история началась! 📖"
  },
  {
    stage: "СЦЕНА 2: НАШЕ ГНЕЗДЫШКО 🏠",
    quest: "Какое наше самое любимое место в мире?",
    options: ["Парк Горького 🌳", "Наш дом - где мы работаем дома и это идеально! 💻❤️", "Капитан Шаурма"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=OUR+HOME",
    hint: "💭 Там, где мы работаем удаленно, где вместе, где только мы двое... 🤍",
    reward: "✅ Дом - это там, где ты 🏠"
  },
  {
    stage: "СЦЕНА 3: МЕСТО ВОЛШЕБСТВА ✨",
    quest: "Помнишь кафе 'Белка'? Что произошло там 2 апреля 2023?",
    options: ["Мы просто пили кофе", "Я сделал тебе ПРЕДЛОЖЕНИЕ! 💍✨", "Мы отмечали день рождения"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/fff0f5/ffffff?text=BELKA+CAFE",
    hint: "💭 Самый важный момент нашей жизни... кольцо, твои слёзы счастья... 💎💕",
    reward: "✅ Ты сказала ДА! 💍🎉"
  },
  {
    stage: "СЦЕНА 4: ЧТО ТЫ ЕШЬ 🍣",
    quest: "Ты вообще всё ешь! 😄 Но если выбирать твой фаворит?",
    options: ["Пицца", "Роллы! 🍣", "Бургеры"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=SUSHI",
    hint: "💭 То, что ты заказываешь чаще всего, когда мы не хотим готовить дома 🍱",
    reward: "✅ Знаю твой вкус! 😋"
  },
  {
    stage: "СЦЕНА 5: КАК ТЫ МЕНЯ ЗОВЕШЬ 💕",
    quest: "Как мило ты меня называешь в повседневной жизни?",
    options: ["Милый 💕", "мУжка! 😍 (мило же)", "Любимый"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=CUTE+NAME",
    hint: "💭 Когда ты это говоришь, я таю... это звучит так мило только из твоих уст 🥰",
    reward: "✅ Ты зовёшь меня 'мУжка' 🥺❤️"
  },
  {
    stage: "СЦЕНА 6: ТВОЙ СТИЛЬ И КРАСОТА ✨",
    quest: "Что ты делаешь со своими волосами, что мне так нравится?",
    options: ["Ухаживаешь за ними", "Делаешь красивые КУДРЯШКИ! 💁‍♀️", "Красишь в яркие цвета"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=BEAUTIFUL+CURLS",
    hint: "💭 Когда ты делаешь кудри, я не могу оторвать от тебя глаз... ты выглядишь волшебно 💫",
    reward: "✅ Твои кудряшки - просто класс! 💁‍♀️✨"
  },
  {
    stage: "СЦЕНА 7: ТВОЙ АКСЕССУАР 👜",
    quest: "Что ты обожаешь носить с собой?",
    options: ["Рюкзак", "Красивую СУМОЧКУ 👜", "Клатч"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=BEAUTIFUL+BAG",
    hint: "💭 Твоя верная спутница на каждый день... ты её очень любишь 👜💕",
    reward: "✅ Со своей любимой сумочкой! 👜"
  },
  {
    stage: "СЦЕНА 8: Наш локальный мем 😄💄",
    quest: "Помнишь мем про 8 Марта 2019? Что я подарил тебе...",
    options: ["Духи", "КОНСИЛЕР", "Помаду"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=CONCEALER+MEME",
    hint: "💭 Каждый раз когда ты хочешь его купить, я говорю 'я же покупал!' 😂",
    reward: "✅ Наш личный мем! 😄💄"
  },
  {
    stage: "СЦЕНА 9: УДАЛЕННАЯ РАБОТА 💻",
    quest: "Что значит для нас работа на удалёнке?",
    options: ["Просто экономим время на дорогу", "Больше времени ВМЕСТЕ целый день! ❤️💻", "Просто так получилось"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/fff0f5/ffffff?text=WORK+FROM+HOME",
    hint: "💭 Мы видим друг друга каждый день, пьём кофе вместе, обедаем вместе... это блаженство 🤍",
    reward: "✅ Вместе каждый день! 👨‍💻👩‍💻❤️"
  },
  {
    stage: "СЦЕНА 10: НАША БУДУЩЕЕ 🌈",
    quest: "О чём мы мечтаем вместе?",
    options: ["О путешествиях по миру", "О своём уютном доме и счастливой жизни вместе", "О карьерном успехе"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=OUR+DREAM",
    hint: "💭 Жизнь, которую мы планируем... с тобой, в нашем доме, счастливые 🏡💕",
    reward: "✅ Мечтаем о будущем вместе! 🌟"
  },
  {
    stage: "СЦЕНА 11: ПОЧЕМУ 8 МАРТА? 💐",
    quest: "Что для меня значит 8 Марта?",
    options: ["Просто календарный праздник", "День, когда все дарят подарки", "День, когда я говорю спасибо за то, что ты рядом ❤️"],
    correct: 2,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=8+MARCH",
    hint: "💭 Потому что каждый день с тобой - праздник, но в этот день я особенно об этом думаю 💕",
    reward: "✅ 8 Марта - день благодарности! 🌹"
  },
  {
    stage: "СЦЕНА 12: НА ВОЛНЕ ЛЮБВИ 🌊",
    quest: "Помнишь? В прошлом году мы поехали отдыхать. Куда?",
    options: ["В Турцию (Бодрум) 🏖️", "На Крит", "В Грецию"],
    correct: 0,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=BODRUM+TRIP",
    hint: "💭 Там было красиво... ты была счастлива...",
    reward: "✅ Бодрум - наше волшебное путешествие! 🌊💕"
  },
  {
    stage: "СЦЕНА 13: ЯРКИЕ МОМЕНТЫ 📸",
    quest: "Какой подарок я дал тебе в новый год?",
    options: ["Украшение", "Пленочный ФОТОАППАРАТ! 📷", "Книгу"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=FILM+CAMERA",
    hint: "💭 Чтобы ты фотографировала нашу жизнь, и каждый кадр был бы волшебным 📸✨",
    reward: "✅ Пленочный аппарат - для наших воспоминаний! 📷"
  },
  {
    stage: "СЦЕНА 14: КУЛИНАРНАЯ СТУДИЯ 🍳",
    quest: "Помнишь наше свидание? Мы готовили вместе и блюда были...",
    options: ["Салат и пицца", "САЛАТ НИСУАЗ с тунцом и СТЕЙК из свинины с перечным соусом! 🍽️", "Суши"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=COOKING+DATE",
    hint: "💭 В кулинарной студии... мы готовили вместе, смеялись, целовались... это был волшебный день 👨‍🍳👩‍🍳❤️",
    reward: "✅ Кулинарное путешествие вместе! 🍽️💕"
  },
  {
    stage: "СЦЕНА 15: КАМЕРА, МОТОР 🎬",
    quest: "Что мы сейчас смотрим каждый вечер за ужином?",
    options: ["Квартал 95", "ИГРА ПРЕСТОЛОВ! ⚔️", "Ещё один день"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/fff0f5/ffffff?text=GAME+OF+THRONES",
    hint: "💭 Мы смотрим и сидим обнявшись... каждая серия - новое приключение с тобой 📺❤️",
    reward: "✅ Наш любимый сериал! 🎬🍿"
  },
  {
    stage: "СЦЕНА 16: Еще один локальный мем 😂🧻",
    quest: "Помнишь мем про Ашан? Раньше там был отдел животных, а сейчас...",
    options: ["Техника", "ТУАЛЕТНАЯ БУМАГА!", "Одежда"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=AHAN+JOKE",
    hint: "💭 Каждый раз когда она говорит 'наш любимый отдел с мамой' - мы оба смеёмся 😂💕",
    reward: "✅ Ашан-мем на века! 🧻❤️"
  },
  {
    stage: "СЦЕНА 17: ТВОЯ УЛЫБКА 🌸",
    quest: "Когда ты расцветаешь, как цветочек?",
    options: ["Когда спишь", "Когда СЧАСТЛИВА и РАДОСТНА! 🌸✨", "Когда ешь"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffe4e1/ffffff?text=YOUR+SMILE",
    hint: "💭 Твоя улыбка - моё солнце, мой свет... я влюбляюсь в тебя заново каждый раз 🌞💕",
    reward: "✅ Твоя улыбка - мой счастье! 🌸😍"
  },
  {
    stage: "СЦЕНА 18: Обстановочка",
    quest: "Что ты коллекционируешь и очень любишь?",
    options: ["Обувь", "Домашние растения! 🌿 Фикусы, суккуленты...", "Парфюмерию"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/fff0f5/ffffff?text=PLANTS",
    hint: "💭 Ты ухаживаешь за ними, как за детьми... они распускаются под твоей лаской 🌱❤️",
    reward: "✅ Твой сад любви! 🌿🌸"
  },
  {
    stage: "СЦЕНА 19: НАША ПЕСНЯ 🎵",
    quest: "Какая песня была НАШЕЙ ещё в 2018, когда я бегал за тобой?",
    options: ["Ещё один день", "ФРЕНДЗОНА - BOYCHIK! 🎵", "Без тебя"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/ffc0cb/ffffff?text=FRIENDZONE+SONG",
    hint: "💭 'Она не видит меня'... но потом она всё же увидела 💕🎵",
    reward: "✅ Френдзона - наша история! 🎵❤️"
  },
  {
    stage: "ФИНАЛ: МОЁ ВЕЧНОЕ ПРИЗНАНИЕ 💍",
    quest: "Я люблю тебя, моя королева. Что ты для меня?",
    options: ["Просто жена", "Мой весь мир! Моя половинка, мой дом, мой смысл, моя радость, моя вселенная! 🌍💕✨", "Как все"],
    correct: 1,
    photo: "https://via.placeholder.com/400x250/fff0f5/ffffff?text=FOREVER+LOVE",
    hint: "💭 Ты - причина моей улыбки, моя мотивация, моё счастье каждый день 🥰💕",
    reward: "✅ Ты всё для меня! 💕✨👑"
  }
];

const Quest8 = ({ onBack }) => {
  // // === СОСТОЯНИЯ ===
  const [screen, setScreen] = useState('login'); // login, quiz, final
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedRewards, setCompletedRewards] = useState([]);
  const [notification, setNotification] = useState({ text: '', show: false, isError: false });

  // // Константы
  const maxHints = 3;
  const correctPassword = '22062018';

  // // Показ уведомления (как в оригинале)
  const triggerNotification = (text, isError = false) => {
    setNotification({ text, show: true, isError });
    setTimeout(() => setNotification({ text: '', show: false, isError: false }), 2000);
  };

  // // Проверка пароля
  const handleLogin = () => {
    if (password === correctPassword) {
      triggerNotification('✨ Добро пожаловать! ✨');
      setTimeout(() => setScreen('quiz'), 500);
    } else {
      triggerNotification('Не тот день, любимая 💔', true);
      setPassword('');
    }
  };

  // // Обработка ответа
  const handleAnswer = (selectedIndex) => {
    const data = quizData[currentStep];
    if (selectedIndex === data.correct) {
      const newScore = score + 10;
      setScore(newScore);
      setCompletedRewards([...completedRewards, data.reward]);
      triggerNotification(`✨ ${data.reward}`);
      
      setTimeout(() => {
        if (currentStep + 1 < quizData.length) {
          setCurrentStep(currentStep + 1);
          setShowHint(false);
        } else {
          setScreen('final');
        }
      }, 1000);
    } else {
      triggerNotification('Попробуй ещё раз 💕', true);
    }
  };

  // // Использование подсказки
  const useHint = () => {
    if (hintsUsed < maxHints) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
    }
  };

  // // Рейтинг в конце
  const getRating = () => {
    if (score >= 100) return '💎 Истинный романтик!';
    if (score >= 80) return '❤️ Знаешь меня очень хорошо!';
    if (score >= 60) return '💕 Хорошо знаешь меня!';
    return '🌟 Любитель начинающий';
  };

  // // 1. ЭКРАН ВХОДА
  if (screen === 'login') {
    return (
      <div className="love-app">
        <style>{canvasStyles}</style>
        <div className="login-screen">
          <button className="btn" style={{position: 'absolute', top: '10px', left: '10px', padding: '5px'}} onClick={onBack}>ESC</button>
          <div className="title">8 BIT<br/>LOVE STORY</div>
          <div className="subtitle">Введи дату, когда мы начали встречаться<br/>(ДДММГГГГ)</div>
          <div className="input-group">
            <input 
              type="password" 
              className="password-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ДДММГГГГ"
            />
          </div>
          <button className="btn" onClick={handleLogin}>START</button>
        </div>
        {notification.show && <div className={`notification ${notification.isError ? 'error' : 'success'}`}>{notification.text}</div>}
      </div>
    );
  }

  // // 2. ЭКРАН КВИЗА
  if (screen === 'quiz') {
    const data = quizData[currentStep];
    const progress = ((currentStep + 1) / quizData.length) * 100;

    return (
      <div className="love-app">
        <style>{canvasStyles}</style>
        <div className="quiz-screen">
          <div className="header">
            <span>QUEST: {currentStep + 1}/{quizData.length}</span>
            <span>⭐ {score}</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          <img className="quiz-photo" src={data.photo} alt="Quest" />
          <div className="quiz-question">
            <strong>{data.stage}</strong><br/><br/>{data.quest}
          </div>
          <div className="options-container">
            {data.options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => handleAnswer(i)}>{opt}</button>
            ))}
          </div>
          
          {completedRewards.length > 0 && (
            <div className="rewards-box">
              <strong>✨ Собрано {completedRewards.length}:</strong><br/>
              {completedRewards.slice(-2).join(' | ')}
            </div>
          )}

          <div className="hints-container">
            <button className="hint-btn" onClick={useHint} disabled={hintsUsed >= maxHints || showHint}>
              💭 ПОДСКАЗКА ({maxHints - hintsUsed})
            </button>
            {showHint && <div className="hint-text">{data.hint}</div>}
          </div>
        </div>
        {notification.show && <div className={`notification ${notification.isError ? 'error' : 'success'}`}>{notification.text}</div>}
      </div>
    );
  }

  // // 3. ЭКРАН ФИНАЛА
  return (
    <div className="love-app">
      <style>{canvasStyles}</style>
      <div className="final-screen">
        <div className="final-title">LEVEL COMPLETE! 💍</div>
        <div className="score-display">
          Твой результат: <span className="score-big">{score}</span>/200
        </div>
        <div className="rating-box">{getRating()}</div>
        
        <div className="final-message">
          Я люблю тебя, моя жина. Ты моё счастье и радость в этом мире. Я очень рад, что ты у меня есть. Благодаря тебе я мотивирую себя на всё. Я очень надеюсь, что у нас всё будет хорошо и мы добьемся всего. Будь всегда счастливой, оптимистичной - ты отличный компаньон! У тебя будет миллион подружек, миллион счастливых моментов. А я всегда тебя во всём поддержу. 💕✨
        </div>

        <div className="heart-animation">💕 💕 💕</div>

        <div className="surprise-box">
          ВАЖНО:<br/>К 16:00 мы едем в<br/>секретное место 🌹<br/>Будь готова заранее! ❤️
        </div>
        <button className="btn" style={{width: '100%'}} onClick={onBack}>В МЕНЮ</button>
      </div>
    </div>
  );
};

// // === ВСЕ СТИЛИ ИЗ CANVA (БЕЗ ИЗМЕНЕНИЙ) ===
const canvasStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .love-app {
    position: fixed; inset: 0;
    font-family: 'Press Start 2P', cursive;
    background: linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; overflow-y: auto; padding: 20px;
  }

  .login-screen, .quiz-screen, .final-screen {
    background: white; border: 4px solid #ffb6c1; padding: 30px;
    max-width: 450px; width: 100%; text-align: center;
    box-shadow: 8px 8px 0px #ffc0cb; animation: popIn 0.5s ease;
  }

  .title { font-size: 14px; color: #ff69b4; margin-bottom: 30px; text-shadow: 2px 2px 0px #ffb6c1; }
  .subtitle { font-size: 8px; color: #5d4037; margin-bottom: 30px; line-height: 1.6; }
  
  .password-input {
    width: 100%; border: 2px solid #ffb6c1; padding: 12px;
    text-align: center; font-family: 'Press Start 2P'; font-size: 9px;
    background: #fff5f7; margin-bottom: 20px;
  }

  .btn {
    background: linear-gradient(135deg, #ffb6c1, #ff69b4);
    color: white; border: 2px solid #ff1493; padding: 12px 24px;
    font-family: 'Press Start 2P'; font-size: 8px; cursor: pointer;
    box-shadow: 4px 4px 0px rgba(255, 20, 147, 0.3);
  }

  .header { display: flex; justify-content: space-between; font-size: 8px; color: #ff69b4; margin-bottom: 15px; }
  
  .progress-container { background: #fff5f7; border: 2px solid #ffb6c1; height: 15px; margin-bottom: 20px; }
  .progress-bar { height: 100%; background: #ff69b4; transition: width 0.5s; display: flex; align-items: center; justify-content: center; font-size: 6px; color: white; }

  .quiz-photo { width: 100%; height: 180px; object-fit: cover; border: 3px solid #ffb6c1; margin-bottom: 15px; }
  .quiz-question { font-size: 9px; color: #5d4037; margin-bottom: 20px; line-height: 1.5; text-align: left; }

  .options-container { display: flex; flex-direction: column; gap: 8px; }
  .option-btn {
    background: #fff5f7; border: 2px solid #ffb6c1; padding: 12px;
    font-family: 'Press Start 2P'; font-size: 7px; color: #5d4037;
    cursor: pointer; transition: 0.2s;
  }
  .option-btn:hover { background: #ffb6c1; color: white; }

  .hint-btn { background: #fff0f5; border: 1px solid #ffb6c1; padding: 8px; font-family: 'Press Start 2P'; font-size: 6px; color: #ff69b4; margin-top: 15px; width: 100%; }
  .hint-text { background: #ffe4e1; border: 1px dashed #ff69b4; padding: 8px; margin-top: 10px; font-size: 7px; color: #ff1493; }

  .rewards-box { background: #fff5f7; border: 2px solid #ffb6c1; padding: 10px; font-size: 7px; color: #ff69b4; margin: 15px 0; }

  .final-title { font-size: 14px; color: #ff69b4; margin-bottom: 15px; }
  .score-display { font-size: 10px; margin-bottom: 10px; }
  .score-big { font-size: 16px; color: #ff69b4; }
  .final-message { font-size: 8px; line-height: 1.8; color: #5d4037; margin-top: 20px; }
  .surprise-box { background: #fff0f5; border: 3px dashed #ff69b4; padding: 15px; font-size: 9px; color: #ff1493; margin: 20px 0; line-height: 1.6; }

  .notification {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    padding: 15px 25px; background: white; border: 3px solid #ffb6c1;
    z-index: 100000; font-size: 10px; box-shadow: 4px 4px 0px #ffc0cb;
  }
  .notification.error { border-color: #ff6b9d; color: #c2185b; }
  
  @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  .heart-animation { font-size: 20px; margin: 15px 0; animation: pulse 1s infinite; }
  @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
`;

export default Quest8;

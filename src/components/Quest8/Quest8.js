<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>8 BIT LOVE STORY 💕</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --pink: #ff69b4;
      --light-pink: #ffb6c1;
      --pale: #fff0f5;
      --pale2: #ffe4e1;
      --brown: #5d4037;
      --deep-pink: #ff1493;
      --shadow: #ffc0cb;
      --white: #ffffff;
      --red: #ff6b6b;
    }

    html, body, #root {
      height: 100%;
      width: 100%;
      font-family: 'Press Start 2P', cursive;
      background: linear-gradient(135deg, var(--pale) 0%, var(--pale2) 100%);
      overflow-x: hidden;
    }

    body { overscroll-behavior: none; }

    /* PIXEL SCROLLBAR */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--pale); }
    ::-webkit-scrollbar-thumb { background: var(--light-pink); }

    /* ANIMATIONS */
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.4) rotate(-5deg); }
      70% { transform: scale(1.08) rotate(2deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.3); }
      50% { transform: scale(1.1); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.04); opacity: 0.9; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    @keyframes timerWarning {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.4); }
      50% { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
    }
    @keyframes confettiFall {
      to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes starPop {
      0% { transform: scale(0) rotate(-20deg); opacity: 0; }
      60% { transform: scale(1.3) rotate(10deg); opacity: 1; }
      100% { transform: scale(1) rotate(0); opacity: 1; }
    }
    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px var(--pink); }
      50% { text-shadow: 0 0 25px var(--pink), 0 0 50px var(--light-pink); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes progressFill {
      from { width: 0; }
    }
    @keyframes notifSlide {
      0% { opacity: 0; transform: translate(-50%, -60%) scale(0.8); }
      15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); }
    }
  </style>
</head>
<body>
<div id="root"></div>

<script type="text/babel">
const { useState, useEffect, useRef, useCallback } = React;

// ===================== ДАННЫЕ =====================

const PASSWORD = "22062018"; // Дата знакомства ДДММГГГГ

// Фото: замени URL на свои (Imgur, Google Photos, etc.)
// Пример: "https://i.imgur.com/XXXXX.jpg"
const PHOTOS = {
  intro:  "https://i.imgur.com/placeholder1.jpg",  // ← вставь свою ссылку
  q1:     "https://i.imgur.com/placeholder2.jpg",
  q2:     "https://i.imgur.com/placeholder3.jpg",
  q3:     "https://i.imgur.com/placeholder4.jpg",
  q4:     "https://i.imgur.com/placeholder5.jpg",
  q5:     "https://i.imgur.com/placeholder6.jpg",
  q6:     "https://i.imgur.com/placeholder7.jpg",
  q7:     "https://i.imgur.com/placeholder8.jpg",
  final:  "https://i.imgur.com/placeholder9.jpg",
};

// Заглушка-градиент, пока нет реального фото
const FALLBACK_PHOTOS = {
  intro:  "linear-gradient(135deg,#ffb6c1,#ff69b4)",
  q1:     "linear-gradient(135deg,#ffc0cb,#ffb6c1)",
  q2:     "linear-gradient(135deg,#ffe4e1,#ffc0cb)",
  q3:     "linear-gradient(135deg,#fff0f5,#ffe4e1)",
  q4:     "linear-gradient(135deg,#ffb6c1,#ffe4e1)",
  q5:     "linear-gradient(135deg,#ffc0cb,#fff0f5)",
  q6:     "linear-gradient(135deg,#ffe4e1,#ffb6c1)",
  q7:     "linear-gradient(135deg,#ff69b4,#ffc0cb)",
  final:  "linear-gradient(135deg,#ff1493,#ff69b4)",
};

// Сюжетные карточки МЕЖДУ вопросами
const STORY_CARDS = [
  {
    emoji: "🌟",
    title: "ПРОЛОГ",
    text: "Сегодня особенный день — 8 марта!\nЯ спрятал для тебя маленькое приключение.\nПройди 7 уровней, и тебя ждёт сюрприз. 💕\nГотова?",
    btnText: "ПОЕХАЛИ! ▶",
  },
  {
    emoji: "💌",
    title: "ГЛАВА 1",
    text: "Вспомни тот день, когда мы познакомились...\nКакими мы были тогда?\nЯ точно помню, что влюбился сразу. 🥹",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "🌸",
    title: "ГЛАВА 2",
    text: "А ещё — наши первые совместные прогулки.\nМы могли говорить часами ни о чём\nи было хорошо просто рядом. 🌷",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "🎵",
    title: "ГЛАВА 3",
    text: "Помнишь, как мы открывали\nлюбимые песни друг другу?\nМузыка теперь навсегда наша! 🎶",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "🍕",
    title: "ГЛАВА 4",
    text: "А наши совместные вечера дома...\nКогда мы готовим вместе\nи смеёмся над чем-то — это лучшее. 🏡",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "✈️",
    title: "ГЛАВА 5",
    text: "Каждое наше путешествие — это история.\nДаже поездка за продуктами\nс тобой становится приключением! 🗺️",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "🌙",
    title: "ГЛАВА 6",
    text: "Тихие вечера, когда мы просто\nлежим рядом и смотрим что-то.\nЭти моменты — мои любимые. 💫",
    btnText: "ПРОДОЛЖИТЬ ▶",
  },
  {
    emoji: "💍",
    title: "ГЛАВА 7: ФИНАЛЬНЫЙ УРОВЕНЬ",
    text: "Последний вопрос!\nОтветь правильно — и тебя\nждёт сюрприз этим вечером. 🎁",
    btnText: "ПОСЛЕДНИЙ ВОПРОС ▶",
  },
];

const QUESTIONS = [
  {
    photoKey: "q1",
    emoji: "💑",
    question: "Что мы делаем в первую очередь, когда оба дома и никуда не торопимся?",
    options: [
      "🛋️ Падаем на диван и включаем сериал",
      "🍳 Идём что-нибудь вместе готовить",
      "🤗 Просто обнимаемся и никуда не спешим",
    ],
    correct: 2,
    hint: "💭 Помни: самые простые моменты — самые тёплые...",
    correctText: "Конечно! Просто обняться — и весь мир становится лучше 🤍",
    wrongText: "Попробуй ещё раз, любимая 💕",
  },
  {
    photoKey: "q2",
    emoji: "🎬",
    question: "Какой жанр фильмов мы чаще всего выбираем вместе вечером?",
    options: [
      "😂 Комедии — смеяться вместе",
      "😱 Триллеры — держаться за руки",
      "💕 Всё равно что — главное вместе",
    ],
    correct: 2,
    hint: "💭 Подумай: нам важен фильм или процесс? 😏",
    correctText: "Именно! С тобой любой фильм становится любимым 🎬",
    wrongText: "Не то, милая 💕 Попробуй ещё!",
  },
  {
    photoKey: "q3",
    emoji: "☕",
    question: "Утро начинается правильно, когда рядом есть...",
    options: [
      "☕ Кофе и тишина",
      "😴 Ещё 5 минут сна вместе",
      "💋 Поцелуй и доброе утро",
    ],
    correct: 2,
    hint: "💭 Кофе подождёт, сон подождёт... а вот это — нет 😊",
    correctText: "Поцелуй — лучшее начало любого утра! 🌅",
    wrongText: "Ты точно знаешь ответ 💕 Ещё раз!",
  },
  {
    photoKey: "q4",
    emoji: "🍽️",
    question: "Мы едем в кафе на двоих. Что ты закажешь для нас обоих?",
    options: [
      "🍝 Пасту — мы её любим вместе",
      "🍕 Пиццу на двоих — делим пополам",
      "То, что ты хочешь, и то, что хочу я — и пробуем оба! 😋",
    ],
    correct: 2,
    hint: "💭 Мы же всегда пробуем блюда друг друга 😄",
    correctText: "Это наш любимый ритуал в кафе! Всё пробовать 😄",
    wrongText: "Думай о нашей традиции в кафе 💕",
  },
  {
    photoKey: "q5",
    emoji: "🗺️",
    question: "Куда мы хотим поехать вместе в этом году?",
    options: [
      "🏖️ На море — тепло, солнце, волны",
      "🏔️ В горы — свежий воздух, виды",
      "🌍 Куда угодно — лишь бы вместе!",
    ],
    correct: 2,
    hint: "💭 Главное же не место, правда? 🥹",
    correctText: "Вместе — это и есть самое важное направление! 🌍",
    wrongText: "Вспомни, что мы всегда говорим о путешествиях 💕",
  },
  {
    photoKey: "q6",
    emoji: "🎁",
    question: "Какой подарок от меня тебя порадует больше всего?",
    options: [
      "💐 Цветы и сюрприз-прогулка",
      "💍 Что-то красивое для тебя",
      "💕 Внимание, время вместе и забота",
    ],
    correct: 2,
    hint: "💭 Самый ценный подарок нельзя купить в магазине 🛍️",
    correctText: "Ты знаешь! Моё время и внимание — твои навсегда 💕",
    wrongText: "Вспомни, что всегда важнее вещей 💕",
  },
  {
    photoKey: "q7",
    emoji: "💞",
    question: "Как звучит наша история, если описать одним словом?",
    options: [
      "🔥 Страсть",
      "🌟 Приключение",
      "🏡 Дом",
    ],
    correct: 2,
    hint: "💭 Там, где ты — там я дома. Всегда. 🥺",
    correctText: "Ты — мой дом. Где бы мы ни были 🏡💕",
    wrongText: "Самое тёплое слово на свете... попробуй ещё 💕",
  },
];

// ===================== КОМПОНЕНТЫ =====================

// Конфетти
function Confetti() {
  const colors = ['#ffb6c1','#ff69b4','#ff1493','#fff0f5','#ffc0cb','#ffe4e1','#ffffff'];
  const pieces = Array.from({length: 60}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    duration: 2.5 + Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    rotate: Math.random() > 0.5 ? 'rotate' : 'skew',
  }));

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:9999}}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          left: p.left + 'vw',
          top: '-20px',
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }} />
      ))}
    </div>
  );
}

// Фото с fallback
function QuestPhoto({ photoKey, style = {} }) {
  const [hasError, setHasError] = useState(false);
  const src = PHOTOS[photoKey];
  const isPlaceholder = src.includes('placeholder');

  if (isPlaceholder || hasError) {
    return (
      <div style={{
        width:'100%',
        height:'200px',
        background: FALLBACK_PHOTOS[photoKey] || 'linear-gradient(135deg,#ffb6c1,#ff69b4)',
        border: '3px solid var(--light-pink)',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:'18px',
        ...style,
      }}>
        <div style={{fontSize:'32px',marginBottom:'8px'}}>📸</div>
        <div style={{fontSize:'6px',color:'#fff',textAlign:'center',lineHeight:1.8,padding:'0 10px'}}>
          Вставь URL своего фото<br/>в переменную PHOTOS["{photoKey}"]
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="quest"
      onError={() => setHasError(true)}
      style={{
        width:'100%',
        height:'200px',
        objectFit:'cover',
        border:'3px solid var(--light-pink)',
        marginBottom:'18px',
        display:'block',
        animation:'fadeIn 0.5s ease',
        ...style,
      }}
    />
  );
}

// Уведомление
function Notification({ message, type, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position:'fixed',
      top:'50%',
      left:'50%',
      transform:'translate(-50%,-50%)',
      background:'white',
      border:`3px solid ${type === 'error' ? '#ff6b6b' : 'var(--light-pink)'}`,
      padding:'16px 24px',
      textAlign:'center',
      zIndex:10000,
      fontSize:'9px',
      color: type === 'error' ? '#c2185b' : 'var(--pink)',
      boxShadow:'6px 6px 0 var(--shadow)',
      animation:'notifSlide 2s ease forwards',
      maxWidth:'260px',
      lineHeight:1.8,
    }}>
      {message}
    </div>
  );
}

// Кнопка
function Btn({ children, onClick, style = {}, disabled = false, big = false }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onClick={onClick}
      style={{
        background: disabled
          ? '#ddd'
          : 'linear-gradient(135deg, var(--light-pink), var(--pink))',
        color: disabled ? '#aaa' : 'white',
        border: `2px solid ${disabled ? '#ccc' : 'var(--deep-pink)'}`,
        padding: big ? '16px 28px' : '12px 22px',
        fontFamily:"'Press Start 2P', cursive",
        fontSize: big ? '10px' : '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: pressed ? '2px 2px 0 rgba(255,20,147,0.3)' : '5px 5px 0 rgba(255,20,147,0.3)',
        transform: pressed ? 'translate(3px,3px)' : 'translate(0,0)',
        transition:'all 0.12s',
        width:'100%',
        lineHeight:1.6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Сердечки жизни
function Hearts({ count, max = 3 }) {
  return (
    <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
      {Array.from({length: max}).map((_, i) => (
        <span key={i} style={{fontSize:'14px', filter: i < count ? 'none' : 'grayscale(1) opacity(0.3)'}}>❤️</span>
      ))}
    </div>
  );
}

// Таймер
function Timer({ timeLeft, maxTime = 30 }) {
  const pct = timeLeft / maxTime;
  const isWarning = timeLeft <= 7;
  const color = isWarning ? '#ff6b6b' : 'var(--pink)';

  return (
    <div style={{
      width:'70px',
      height:'70px',
      border: `4px solid ${color}`,
      borderRadius:'50%',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      background:'var(--pale)',
      animation: isWarning ? 'timerWarning 0.6s infinite' : 'pulse 1.5s infinite',
      flexShrink: 0,
    }}>
      <span style={{fontSize:'22px', color, fontWeight:'bold'}}>{timeLeft}</span>
    </div>
  );
}

// ===================== ЭКРАНЫ =====================

// ЭКРАН ВХОДА
function LoginScreen({ onSuccess }) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const [notif, setNotif] = useState(null);

  const check = () => {
    if (value === PASSWORD) {
      setNotif({msg:'✨ С 8 марта, любимая! ✨', type:'success'});
      setTimeout(onSuccess, 900);
    } else {
      setShake(true);
      setNotif({msg:'Не та дата 💔\nПодсказка: когда мы познакомились?', type:'error'});
      setValue('');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setNotif(null), 2200);
    }
  };

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', padding:'20px',
    }}>
      {notif && <Notification message={notif.msg} type={notif.type} visible />}
      <div style={{
        background:'white',
        border:'4px solid var(--light-pink)',
        padding:'36px 28px',
        maxWidth:'360px',
        width:'100%',
        textAlign:'center',
        boxShadow:'8px 8px 0 var(--shadow)',
        animation:'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{fontSize:'32px', marginBottom:'12px', animation:'heartbeat 1.2s infinite'}}>💕</div>
        <div style={{
          fontSize:'13px',
          color:'var(--pink)',
          marginBottom:'8px',
          textShadow:'2px 2px 0 var(--light-pink)',
          letterSpacing:'2px',
          lineHeight:1.6,
        }}>
          8 BIT<br/>LOVE STORY
        </div>
        <div style={{
          fontSize:'7px',
          color:'var(--brown)',
          marginBottom:'28px',
          lineHeight:2,
        }}>
          Специально для тебя<br/>
          в честь 8 марта 🌷<br/><br/>
          Введи дату нашего знакомства<br/>
          (ДДММГГГГ)
        </div>

        <input
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={value}
          onChange={e => setValue(e.target.value.replace(/\D/,'').slice(0,8))}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="ДДММГГГГ"
          style={{
            width:'100%',
            border:'2px solid var(--light-pink)',
            padding:'13px',
            textAlign:'center',
            fontFamily:"'Press Start 2P', cursive",
            fontSize:'11px',
            color:'var(--pink)',
            background:'var(--pale)',
            marginBottom:'18px',
            letterSpacing:'3px',
            animation: shake ? 'shake 0.4s ease' : 'none',
            outline:'none',
          }}
        />

        <Btn onClick={check} big>▶ START GAME</Btn>

        <div style={{
          marginTop:'24px',
          fontSize:'6px',
          color:'var(--light-pink)',
          lineHeight:2,
        }}>
          ★ 7 уровней ★ ~10 минут ★<br/>
          ★ сюрприз в конце ★
        </div>
      </div>
    </div>
  );
}

// СЮЖЕТНАЯ КАРТОЧКА
function StoryCard({ card, onNext, isFirst }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', padding:'20px',
    }}>
      <div style={{
        background:'white',
        border:'4px solid var(--light-pink)',
        padding:'36px 28px',
        maxWidth:'380px',
        width:'100%',
        textAlign:'center',
        boxShadow:'8px 8px 0 var(--shadow)',
        animation:'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{fontSize:'40px', marginBottom:'16px', animation:'bounce 1s infinite'}}>{card.emoji}</div>
        <div style={{
          fontSize:'10px',
          color:'var(--pink)',
          marginBottom:'20px',
          letterSpacing:'2px',
          textShadow:'1px 1px 0 var(--light-pink)',
        }}>
          {card.title}
        </div>
        <div style={{
          fontSize:'8px',
          color:'var(--brown)',
          lineHeight:2.2,
          marginBottom:'30px',
          whiteSpace:'pre-line',
        }}>
          {card.text}
        </div>
        <Btn onClick={onNext} big>{card.btnText}</Btn>
      </div>
    </div>
  );
}

// ЭКРАН ВОПРОСА
function QuizScreen({ questionIndex, totalQ, onAnswer, score, hearts }) {
  const [timeLeft, setTimeLeft] = useState(25);
  const [hintUsed, setHintUsed] = useState(false);
  const [answered, setAnswered] = useState(null); // null | 'correct' | 'wrong'
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [notif, setNotif] = useState(null);
  const timerRef = useRef(null);
  const q = QUESTIONS[questionIndex];

  // Сброс при смене вопроса
  useEffect(() => {
    setTimeLeft(25);
    setHintUsed(false);
    setAnswered(null);
    setSelectedIdx(null);
  }, [questionIndex]);

  // Таймер
  useEffect(() => {
    if (answered) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Время вышло = неправильно
          showNotif('⏰ Время вышло! Попробуй ещё раз 💕', 'error');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [questionIndex, answered]);

  const showNotif = (msg, type) => {
    setNotif({msg, type});
    setTimeout(() => setNotif(null), 2200);
  };

  const handleSelect = (idx) => {
    if (answered === 'correct' || selectedIdx !== null) return;
    setSelectedIdx(idx);

    if (idx === q.correct) {
      setAnswered('correct');
      clearInterval(timerRef.current);
      showNotif('✨ ' + q.correctText, 'success');
      setTimeout(() => onAnswer(true, 25 + Math.round(timeLeft / 25 * 10)), 1200);
    } else {
      showNotif(q.wrongText, 'error');
      setTimeout(() => setSelectedIdx(null), 900);
      onAnswer(false, 0);
      setTimeLeft(25); // сброс таймера
    }
  };

  const progress = ((questionIndex) / totalQ) * 100;

  const optionStyle = (idx) => {
    let bg = 'var(--pale)';
    let border = '2px solid var(--light-pink)';
    let color = 'var(--brown)';

    if (selectedIdx === idx) {
      if (idx === q.correct) { bg = '#d4edda'; border = '2px solid #28a745'; color = '#155724'; }
      else { bg = '#f8d7da'; border = '2px solid #dc3545'; color = '#721c24'; }
    }

    return {
      background: bg,
      border,
      padding:'14px 12px',
      fontFamily:"'Press Start 2P', cursive",
      fontSize:'7px',
      color,
      cursor: (answered === 'correct' || selectedIdx !== null) ? 'not-allowed' : 'pointer',
      transition:'all 0.2s',
      textAlign:'left',
      lineHeight:1.8,
      width:'100%',
      display:'block',
    };
  };

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      minHeight:'100vh', padding:'16px',
    }}>
      {notif && <Notification message={notif.msg} type={notif.type} visible />}

      <div style={{
        background:'white',
        border:'4px solid var(--light-pink)',
        padding:'22px 20px',
        maxWidth:'420px',
        width:'100%',
        boxShadow:'8px 8px 0 var(--shadow)',
        animation:'slideUp 0.5s ease',
        marginTop:'8px',
        marginBottom:'8px',
      }}>
        {/* Шапка */}
        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:'14px',
          fontSize:'7px',
          color:'var(--pink)',
        }}>
          <Hearts count={hearts} />
          <span>УРОВЕНЬ {questionIndex+1}/{totalQ}</span>
          <span>⭐ {score}</span>
        </div>

        {/* Прогресс */}
        <div style={{
          background:'var(--pale)',
          border:'2px solid var(--light-pink)',
          height:'14px',
          marginBottom:'14px',
          overflow:'hidden',
          position:'relative',
        }}>
          <div style={{
            height:'100%',
            background:'linear-gradient(90deg, var(--light-pink), var(--pink))',
            width: progress + '%',
            transition:'width 0.6s ease',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
          }}>
            <span style={{fontSize:'6px',color:'white'}}>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Таймер + вопрос */}
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'14px'}}>
          <Timer timeLeft={timeLeft} maxTime={25} />
          <div style={{fontSize:'9px', color:'var(--pink)'}}>{q.emoji}</div>
          <div style={{
            fontSize:'8px',
            color:'var(--brown)',
            lineHeight:1.9,
            flex:1,
          }}>
            {q.question}
          </div>
        </div>

        {/* Фото */}
        <QuestPhoto photoKey={q.photoKey} />

        {/* Варианты */}
        <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px'}}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={optionStyle(i)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Подсказка */}
        <div style={{borderTop:'2px solid var(--pale2)', paddingTop:'12px'}}>
          {!hintUsed ? (
            <button
              onClick={() => setHintUsed(true)}
              style={{
                width:'100%',
                background:'var(--pale)',
                border:'2px solid var(--light-pink)',
                padding:'10px',
                fontFamily:"'Press Start 2P', cursive",
                fontSize:'7px',
                color:'var(--pink)',
                cursor:'pointer',
              }}
            >
              💭 ПОДСКАЗКА (-5 очков)
            </button>
          ) : (
            <div style={{
              background:'var(--pale2)',
              border:'2px dashed var(--pink)',
              padding:'10px',
              fontSize:'7px',
              color:'var(--deep-pink)',
              lineHeight:1.9,
              animation:'fadeIn 0.3s ease',
            }}>
              {q.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ФИНАЛЬНЫЙ ЭКРАН
function FinalScreen({ score, totalQ, onRestart }) {
  const maxScore = totalQ * 35;
  const pct = Math.round((score / maxScore) * 100);

  let rating, ratingEmoji;
  if (pct >= 85) { rating = 'ИДЕАЛЬНАЯ ПАРА!'; ratingEmoji = '💎'; }
  else if (pct >= 65) { rating = 'ЗНАЕШЬ МЕНЯ ХОРОШО!'; ratingEmoji = '❤️'; }
  else if (pct >= 45) { rating = 'МЫ УЗНАЁМ ДРУГ ДРУГА!'; ratingEmoji = '💕'; }
  else { rating = 'ЛЮБОВЬ — ЭТО ПУТЬ!'; ratingEmoji = '🌱'; }

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      minHeight:'100vh', padding:'20px',
    }}>
      <Confetti />
      <div style={{
        background:'white',
        border:'4px solid var(--light-pink)',
        padding:'32px 24px',
        maxWidth:'400px',
        width:'100%',
        textAlign:'center',
        boxShadow:'8px 8px 0 var(--shadow)',
        animation:'popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        marginTop:'8px',
        marginBottom:'8px',
      }}>
        <div style={{fontSize:'36px', marginBottom:'10px', animation:'bounce 0.8s infinite'}}>🎊</div>

        <div style={{
          fontSize:'11px',
          color:'var(--pink)',
          marginBottom:'6px',
          textShadow:'2px 2px 0 var(--light-pink)',
          animation:'glow 2s infinite',
        }}>
          LEVEL COMPLETE!
        </div>
        <div style={{fontSize:'8px', color:'var(--brown)', marginBottom:'20px'}}>
          Ты прошла игру! 💕
        </div>

        {/* Фото финальное */}
        <QuestPhoto photoKey="final" />

        {/* Счёт */}
        <div style={{
          background:'var(--pale)',
          border:'2px solid var(--light-pink)',
          padding:'16px',
          marginBottom:'14px',
          borderRadius:'4px',
        }}>
          <div style={{fontSize:'7px', color:'var(--brown)', marginBottom:'8px'}}>ТВОЙ РЕЗУЛЬТАТ:</div>
          <div style={{fontSize:'20px', color:'var(--pink)', fontWeight:'bold', animation:'starPop 0.5s ease'}}>{score} очков</div>
        </div>

        {/* Рейтинг */}
        <div style={{
          background:'linear-gradient(135deg,var(--pale),var(--pale2))',
          border:'3px solid var(--light-pink)',
          padding:'14px',
          marginBottom:'20px',
          fontSize:'9px',
          color:'var(--pink)',
          lineHeight:1.8,
        }}>
          {ratingEmoji} {rating}
        </div>

        {/* Сюрприз */}
        <div style={{
          background:'linear-gradient(135deg,var(--pale),var(--pale2))',
          border:'3px dashed var(--deep-pink)',
          padding:'20px',
          marginBottom:'24px',
          fontSize:'8px',
          color:'var(--deep-pink)',
          lineHeight:2.2,
          animation:'pulse 1.5s infinite',
          fontWeight:'bold',
        }}>
          🎁 СЮРПРИЗ СЕГОДНЯ! 🎁<br/><br/>
          В 16:00 мы едем в<br/>
          секретное место 🌹<br/><br/>
          Будь готова! ❤️<br/><br/>
          Я люблю тебя больше всего<br/>на свете 💕
        </div>

        <div style={{fontSize:'22px', marginBottom:'20px', animation:'heartbeat 0.8s infinite'}}>
          💕 💕 💕
        </div>

        <Btn onClick={onRestart}>↺ СЫГРАТЬ СНОВА</Btn>
      </div>
    </div>
  );
}

// ===================== ГЛАВНЫЙ КОМПОНЕНТ =====================

export default function App() {
  const [phase, setPhase] = useState('login');
  // login → story → quiz → story → quiz → ... → final
  const [storyIdx, setStoryIdx] = useState(0);  // какую story показываем
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);

  const totalQ = QUESTIONS.length;

  const handleLogin = () => {
    setPhase('story');
    setStoryIdx(0);
  };

  const handleStoryNext = () => {
    // Story cards: 0=пролог, 1=глава1, 2=глава2 ... 7=глава7
    // Quiz:        storyIdx - 1 = questionIdx
    // После пролога (storyIdx=0) → quiz[0]
    // После story[1] → quiz[1], и т.д.
    const qIdx = storyIdx === 0 ? 0 : storyIdx - 1;
    setQuestionIdx(qIdx);
    setPhase('quiz');
  };

  const handleAnswer = (correct, points) => {
    if (correct) {
      setScore(s => s + points);
      const nextQ = questionIdx + 1;
      if (nextQ >= totalQ) {
        // Все вопросы пройдены → финал
        setTimeout(() => setPhase('final'), 400);
      } else {
        // Показываем следующую сюжетную карточку
        // story[nextQ + 1] = "Глава N" перед question[nextQ]
        setStoryIdx(nextQ + 1);
        setTimeout(() => setPhase('story'), 400);
      }
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };

  return (
    <div style={{minHeight:'100vh'}}>
      {phase === 'login' && (
        <LoginScreen onSuccess={handleLogin} />
      )}
      {phase === 'story' && (
        <StoryCard
          card={STORY_CARDS[storyIdx]}
          onNext={handleStoryNext}
        />
      )}
      {phase === 'quiz' && (
        <QuizScreen
          questionIndex={questionIdx}
          totalQ={totalQ}
          onAnswer={handleAnswer}
          score={score}
          hearts={hearts}
        />
      )}
      {phase === 'final' && (
        <FinalScreen
          score={score}
          totalQ={totalQ}
          onRestart={() => {
            setPhase('login');
            setScore(0);
            setHearts(3);
            setStoryIdx(0);
            setQuestionIdx(0);
          }}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
</body>
</html>

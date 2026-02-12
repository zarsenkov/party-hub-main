import React, { useState, useEffect, useRef } from 'react';
import './AliasGame.css';

// // Объект с наборами слов по категориям
const WORD_BANKS = {
  animals: ['Кот', 'Собака', 'Слон', 'Жираф', 'Лев', 'Тигр', 'Медведь', 'Волк', 'Лиса', 'Заяц', 'Крокодил', 'Акула', 'Орел', 'Пингвин', 'Кит', 'Дельфин', 'Обезьяна', 'Коала', 'Зебра', 'Лошадь'],
  food: ['Пицца', 'Бургер', 'Суши', 'Тако', 'Паста', 'Торт', 'Пончик', 'Печенье', 'Мороженое', 'Яблоко', 'Банан', 'Апельсин', 'Клубника', 'Арбуз', 'Сыр', 'Хлеб', 'Яйцо', 'Молоко', 'Масло', 'Салат'],
  movies: ['Аватар', 'Титаник', 'Матрица', 'Интерстеллар', 'Один дома', 'Назад в будущее', 'Звёздные войны', 'Завтрак у Тиффани', 'Король лев', 'Зелёная миля', 'Крик', 'Шрек', 'Ледниковый период', 'Рапунцель', 'Гарри Поттер', 'Спайдермен', 'Железный человек', 'Минионы', 'Ну погоди', 'Плиточка'],
  sports: ['Футбол', 'Баскетбол', 'Теннис', 'Волейбол', 'Хоккей', 'Бокс', 'Карате', 'Йога', 'Плавание', 'Бег', 'Велосипед', 'Серфинг', 'Сноуборд', 'Лыжи', 'Гимнастика', 'Штанга', 'Танцы', 'Дзюдо', 'Фехтование', 'Гольф'],
  professions: ['Врач', 'Учитель', 'Пилот', 'Повар', 'Полицейский', 'Пожарный', 'Строитель', 'Художник', 'Музыкант', 'Актер', 'Писатель', 'Журналист', 'Фотограф', 'Парикмахер', 'Сантехник', 'Электрик', 'Плотник', 'Дизайнер', 'Программист', 'Бизнесмен'],
  countries: ['США', 'Россия', 'Япония', 'Франция', 'Англия', 'Испания', 'Италия', 'Германия', 'Китай', 'Индия', 'Бразилия', 'Канада', 'Австралия', 'Мексика', 'Швейцария', 'Голландия', 'Греция', 'Турция', 'Таиланд', 'Индонезия'],
  mixed: ['Кот', 'Пицца', 'Аватар', 'Футбол', 'Врач', 'США', 'Собака', 'Бургер', 'Титаник', 'Баскетбол', 'Учитель', 'Россия', 'Слон', 'Суши', 'Матрица', 'Теннис', 'Пилот', 'Япония', 'Жираф', 'Торт']
};

const AliasGame = () => {
  // // Состояния экрана и данных игры
  const [screen, setScreen] = useState('menu'); // menu, source, bank, setup, game, results
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  
  // // Состояния настроек
  const [teamName, setTeamName] = useState('Команда 1');
  const [totalRounds, setTotalRounds] = useState(5);
  const [setupTime, setSetupTime] = useState(60);
  const [customWords, setCustomWords] = useState('Кот,Дом,Любовь,Музыка,Звезда,Танец,Радость,Река,Гора,Книга');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const timerRef = useRef(null);

  // // Логика таймера
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // // Функции навигации
  const goToMenu = () => {
    stopGame();
    setScreen('menu');
  };

  const startSetup = (custom = false) => {
    setIsCustomMode(custom);
    setScreen('setup');
  };

  // // Запуск игрового процесса
  const startGame = () => {
    let selectedWords = [];
    if (isCustomMode) {
      selectedWords = customWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
    } else {
      selectedWords = [...words];
    }

    if (selectedWords.length < totalRounds) {
      alert(`Нужно хотя бы ${totalRounds} слов!`);
      return;
    }

    setWords(selectedWords.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setLog([]);
    setTimeLeft(setupTime);
    setIsRunning(true);
    setScreen('game');
  };

  const stopGame = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const endGame = () => {
    stopGame();
    setScreen('results');
  };

  // // Обработка ответов
  const handleAnswer = (isGuessed) => {
    const currentWord = words[currentIndex];
    const newLog = [...log, { word: currentWord, ok: isGuessed }];
    setLog(newLog);
    
    if (isGuessed) setScore(prev => prev + 1);
    
    if (currentIndex + 1 >= totalRounds) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // // Рендер компонентов экрана
  return (
    <div className="alias-app">
      {/* Экран МЕНЮ */}
      {screen === 'menu' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={() => window.location.href = 'https://lovecouple.ru'}>← ВЫХОД</button>
          <div className="menu-content">
            <div className="menu-title"><h1>ALIAS</h1></div>
            <p className="menu-subtitle">ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ!</p>
            <button className="btn-main" onClick={() => setScreen('source')}>ПОЕХАЛИ! 🚀</button>
          </div>
        </div>
      )}

      {/* Выбор источника */}
      {screen === 'source' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen('menu')}>← НАЗАД</button>
          <div className="section-title-box"><h2>ВЫБЕРИ ИСТОЧНИК</h2></div>
          <div className="source-grid">
            <button className="btn-source" onClick={() => setScreen('bank')}>
              <span className="source-icon">📚</span> БАНК СЛОВ
            </button>
            <button className="btn-source" onClick={() => startSetup(true)}>
              <span className="source-icon">✏️</span> СВОИ СЛОВА
            </button>
          </div>
        </div>
      )}

      {/* Выбор категории */}
      {screen === 'bank' && (
        <div className="container blue">
          <button className="btn-back-home" onClick={() => setScreen('source')}>← НАЗАД</button>
          <div className="section-title-box"><h2>КАТЕГОРИИ</h2></div>
          <div className="categories-list">
            {Object.keys(WORD_BANKS).map(cat => (
              <button key={cat} className="btn-category" onClick={() => { setWords(WORD_BANKS[cat]); startSetup(false); }}>
                {cat === 'animals' && '🐾 Животные'}
                {cat === 'food' && '🍕 Еда'}
                {cat === 'movies' && '🎬 Фильмы'}
                {cat === 'sports' && '⚽ Спорт'}
                {cat === 'professions' && '👔 Профессии'}
                {cat === 'countries' && '🌍 Страны'}
                {cat === 'mixed' && '🎯 Микс'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Настройки */}
      {screen === 'setup' && (
        <div className="container pink">
          <button className="btn-back-home" onClick={() => setScreen('source')}>← НАЗАД</button>
          <div className="section-title-box"><h2>НАСТРОЙКИ</h2></div>
          <div className="settings-container">
            <div className="setting-group">
              <label>👥 КОМАНДА</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </div>
            <div className="setting-group">
              <label>🔢 СЛОВ В РАУНДЕ</label>
              <input type="number" value={totalRounds} onChange={(e) => setTotalRounds(e.target.value)} />
            </div>
            <div className="setting-group">
              <label>⏱️ ВРЕМЯ (СЕК)</label>
              <input type="number" value={setupTime} onChange={(e) => setSetupTime(e.target.value)} />
            </div>
            {isCustomMode && (
              <div className="setting-group">
                <label>📝 ВАШИ СЛОВА (через запятую)</label>
                <textarea value={customWords} onChange={(e) => setCustomWords(e.target.value)} />
              </div>
            )}
          </div>
          <button className="btn-main w-full" onClick={startGame}>СТАРТ 🎮</button>
        </div>
      )}

      {/* ИГРА */}
      {screen === 'game' && (
        <div className="container pink">
          <div className="header">
            <div className={`pill timer ${timeLeft <= 10 ? 'warning' : ''}`}>
              <span>⏱️ {timeLeft}</span>
            </div>
            <div className="pill score">ОЧКИ: {score}</div>
          </div>
          <div className="card">
            <div className="card-label">СЛОВО:</div>
            <div className="word-display">{words[currentIndex]}</div>
          </div>
          <div className="btn-grid">
            <button className="btn-action btn-skip" onClick={() => handleAnswer(false)}>✕</button>
            <button className="btn-action btn-guess" onClick={() => handleAnswer(true)}>✓</button>
          </div>
        </div>
      )}

      {/* РЕЗУЛЬТАТЫ */}
      {screen === 'results' && (
        <div className="container white overflow-auto">
          <div className="results-header">
            <div className="results-icon">🏆</div>
            <h2 className="results-score">ИТОГИ: {score}</h2>
          </div>
          <div className="results-log">
            {log.map((item, idx) => (
              <div key={idx} className="log-item">
                <span>{item.word}</span>
                <span className={item.ok ? 'log-success' : 'log-fail'}>{item.ok ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
          <button className="btn-main w-full" onClick={goToMenu}>↻ МЕНЮ</button>
        </div>
      )}
    </div>
  );
};

export default AliasGame;

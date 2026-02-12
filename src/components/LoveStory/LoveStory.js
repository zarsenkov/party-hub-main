import React, { useEffect } from 'react';
import './LoveStory.css';

// // Перенос компонента без изменения логики
const AliasGame = () => {
  // // Инициализация логики из твоего скрипта при загрузке компонента
  useEffect(() => {
    // === БАНК СЛОВ ===
    const wordBanks = {
      animals: ['Кот', 'Собака', 'Слон', 'Жираф', 'Лев', 'Тигр', 'Медведь', 'Волк', 'Лиса', 'Заяц', 'Крокодил', 'Акула', 'Орел', 'Пингвин', 'Кит', 'Дельфин', 'Обезьяна', 'Коала', 'Зебра', 'Лошадь'],
      food: ['Пицца', 'Бургер', 'Суши', 'Тако', 'Паста', 'Торт', 'Пончик', 'Печенье', 'Мороженое', 'Яблоко', 'Банан', 'Апельсин', 'Клубника', 'Арбуз', 'Сыр', 'Хлеб', 'Яйцо', 'Молоко', 'Масло', 'Салат'],
      movies: ['Аватар', 'Титаник', 'Матрица', 'Интерстеллар', 'Один дома', 'Назад в будущее', 'Звёздные войны', 'Завтрак у Тиффани', 'Король лев', 'Зелёная миля', 'Крик', 'Шрек', 'Ледниковный период', 'Рапунцель', 'Гарри Поттер', 'Спайдермен', 'Железный человек', 'Минионы', 'Ну погоди', 'Плиточка'],
      sports: ['Футбол', 'Баскетбол', 'Теннис', 'Волейбол', 'Хоккей', 'Бокс', 'Карате', 'Йога', 'Плавание', 'Бег', 'Велосипед', 'Серфинг', 'Сноуборд', 'Лыжи', 'Гимнастика', 'Штанга', 'Танцы', 'Дзюдо', 'Фехтование', 'Гольф'],
      professions: ['Врач', 'Учитель', 'Пилот', 'Повар', 'Полицейский', 'Пожарный', 'Строитель', 'Художник', 'Музыкант', 'Актер', 'Писатель', 'Журналист', 'Фотограф', 'Парикмахер', 'Сантехник', 'Электрик', 'Плотник', 'Дизайнер', 'Программист', 'Бизнесмен'],
      countries: ['США', 'Россия', 'Япония', 'Франция', 'Англия', 'Испания', 'Италия', 'Германия', 'Китай', 'Индия', 'Бразилия', 'Канада', 'Австралия', 'Мексика', 'Швейцария', 'Голландия', 'Греция', 'Турция', 'Таиланд', 'Индонезия'],
      mixed: ['Кот', 'Пицца', 'Аватар', 'Футбол', 'Врач', 'США', 'Собака', 'Бургер', 'Титаник', 'Баскетбол', 'Учитель', 'Россия', 'Слон', 'Суши', 'Матрица', 'Теннис', 'Пилот', 'Япония', 'Жираф', 'Торт']
    };

    // === СОСТОЯНИЕ ===
    const gameState = {
      words: [],
      currentIndex: 0,
      score: 0,
      log: [],
      totalRounds: 5,
      roundTime: 60,
      timeLeft: 60,
      timerInterval: null,
      isRunning: false
    };

    // === НАВИГАЦИЯ ===
    // // Функция показа экранов
    window.showScreen = (screenId) => {
      document.querySelectorAll('[id$="-screen"]').forEach(el => el.classList.add('hidden'));
      document.getElementById(screenId).classList.remove('hidden');
    };

    // // Функция выхода
    window.goToHome = () => {
      window.location.href = 'https://lovecouple.ru';
    };

    // // Возврат в меню
    window.backToMenu = () => {
      window.stopTimer();
      gameState.score = 0;
      gameState.log = [];
      gameState.currentIndex = 0;
      window.showScreen('menu-screen');
    };

    // // Выбор источника
    window.chooseSource = () => {
      window.showScreen('source-screen');
    };

    // // Назад к источнику
    window.backToSource = () => {
      window.stopTimer();
      window.showScreen('source-screen');
    };

    // // Выбор банка слов
    window.chooseBank = () => {
      window.showScreen('bank-screen');
    };

    // // Выбор своих слов
    window.chooseCustom = () => {
      document.getElementById('words-group').style.display = 'block';
      window.showScreen('setup-screen');
    };

    // // Выбор категории
    window.selectCategory = (categoryKey) => {
      gameState.words = [...wordBanks[categoryKey]];
      document.getElementById('words-group').style.display = 'none';
      window.showScreen('setup-screen');
    };

    // === ЗАПУСК ИГРЫ ===
    // // Функция старта раунда
    window.startGame = () => {
      const rounds = parseInt(document.getElementById('rounds-input').value);
      const time = parseInt(document.getElementById('time-input').value);
      const wordsText = document.getElementById('words-input').value;

      if (gameState.words.length === 0) {
        const words = wordsText.split(',').map(w => w.trim()).filter(w => w.length > 0);
        if (words.length === 0) {
          alert('Введи хотя бы одно слово!');
          return;
        }
        gameState.words = words;
      }

      if (gameState.words.length < rounds) {
        alert(`Нужно как минимум ${rounds} слов!`);
        return;
      }

      gameState.words = gameState.words.sort(() => Math.random() - 0.5);
      gameState.totalRounds = rounds;
      gameState.roundTime = time;
      gameState.timeLeft = time;
      gameState.score = 0;
      gameState.log = [];
      gameState.currentIndex = 0;
      gameState.isRunning = true;

      window.showScreen('game-screen');
      window.displayWord();
      window.startTimer();
    };

    // === ОТОБРАЖЕНИЕ СЛОВА ===
    // // Отрисовка текущего слова
    window.displayWord = () => {
      if (gameState.currentIndex >= gameState.totalRounds) {
        window.endGame();
        return;
      }
      const word = gameState.words[gameState.currentIndex];
      document.getElementById('word-display').textContent = word;
      document.getElementById('score-display').textContent = gameState.score;
      document.getElementById('timer-display').textContent = gameState.timeLeft;
    };

    // === ТАЙМЕР ===
    // // Запуск обратного отсчета
    window.startTimer = () => {
      if (gameState.timerInterval) clearInterval(gameState.timerInterval);
      gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer-display').textContent = gameState.timeLeft;
        const timerPill = document.getElementById('timer-pill');
        if (gameState.timeLeft <= 10) {
          timerPill.classList.add('warning');
        } else {
          timerPill.classList.remove('warning');
        }
        if (gameState.timeLeft <= 0) {
          window.endGame();
        }
      }, 1000);
    };

    // // Остановка таймера
    window.stopTimer = () => {
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
      }
    };

    // === ДЕЙСТВИЯ ===
    // // Обработка угаданного слова
    window.guessed = () => {
      if (!gameState.isRunning) return;
      const word = gameState.words[gameState.currentIndex];
      gameState.log.push({ word, ok: true });
      gameState.score++;
      document.getElementById('score-display').textContent = gameState.score;
      window.nextWord();
    };

    // // Обработка пропуска слова
    window.skip = () => {
      if (!gameState.isRunning) return;
      const word = gameState.words[gameState.currentIndex];
      gameState.log.push({ word, ok: false });
      window.nextWord();
    };

    // // Переход к следующему слову
    window.nextWord = () => {
      gameState.currentIndex++;
      if (gameState.currentIndex >= gameState.totalRounds) {
        window.endGame();
      } else {
        window.displayWord();
      }
    };

    // // Завершение игры и показ результатов
    window.endGame = () => {
      gameState.isRunning = false;
      window.stopTimer();
      document.getElementById('final-score').textContent = gameState.score;
      const logHtml = gameState.log.map(item => 
        `<div class="log-item">
          <span>${item.word}</span>
          <span class="${item.ok ? 'log-success' : 'log-fail'}">
            ${item.ok ? '✓' : '✕'}
          </span>
        </div>`
      ).join('');
      document.getElementById('results-log').innerHTML = logHtml;
      window.showScreen('results-screen');
    };

    // Чистим интервалы при размонтировании
    return () => window.stopTimer();
  }, []);

  return (
    <div id="app">
      {/* МЕНЮ */}
      <div id="menu-screen" className="container blue">
        <button className="btn-back-home" onClick={() => window.goToHome()}>← ВЫХОД</button>
        <div className="menu-content">
          <div className="menu-title"><h1>ALIAS</h1></div>
          <p className="menu-subtitle">ОБЪЯСНИ КАК МОЖНО БОЛЬШЕ СЛОВ ЗА 60 СЕКУНД!</p>
          <button className="btn-main" onClick={() => window.chooseSource()}>ПОЕХАЛИ! 🚀</button>
        </div>
      </div>

      {/* ВЫБОР ИСТОЧНИКА */}
      <div id="source-screen" className="container pink hidden">
        <button className="btn-back-home" onClick={() => window.backToMenu()}>← НАЗАД</button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="title-wrapper">
            <h2 className="title-text">ВЫБЕРИ ИСТОЧНИК</h2>
          </div>
        </div>
        <div className="source-grid">
          <button className="btn-source" onClick={() => window.chooseBank()}>
            <div className="source-icon">📚</div> БАНК СЛОВ
          </button>
          <button className="btn-source" onClick={() => window.chooseCustom()}>
            <div className="source-icon">✏️</div> СВОИ СЛОВА
          </button>
        </div>
      </div>

      {/* БАНК СЛОВ */}
      <div id="bank-screen" className="container blue hidden">
        <button className="btn-back-home" onClick={() => window.backToSource()}>← НАЗАД</button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="title-wrapper-static">
            <h2 className="title-text">КАТЕГОРИИ</h2>
          </div>
        </div>
        <div className="categories-list">
          <button className="btn-category" onClick={() => window.selectCategory('animals')}>🐾 Животные</button>
          <button className="btn-category" onClick={() => window.selectCategory('food')}>🍕 Еда</button>
          <button className="btn-category" onClick={() => window.selectCategory('movies')}>🎬 Фильмы</button>
          <button className="btn-category" onClick={() => window.selectCategory('sports')}>⚽ Спорт</button>
          <button className="btn-category" onClick={() => window.selectCategory('professions')}>👔 Профессии</button>
          <button className="btn-category" onClick={() => window.selectCategory('countries')}>🌍 Страны</button>
          <button className="btn-category" onClick={() => window.selectCategory('mixed')}>🎯 Микс</button>
        </div>
      </div>

      {/* НАСТРОЙКИ */}
      <div id="setup-screen" className="container pink hidden">
        <button className="btn-back-home" onClick={() => window.backToSource()}>← НАЗАД</button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="title-wrapper-rotated">
            <h2 className="title-text">НАСТРОЙКИ</h2>
          </div>
        </div>
        <div className="settings-container">
          <div className="setting-group">
            <label className="setting-label">👥 КОМАНДА</label>
            <input id="team-name-input" type="text" className="setting-input" defaultValue="Команда 1" />
          </div>
          <div className="setting-group">
            <label className="setting-label">🔢 РАУНДОВ</label>
            <input id="rounds-input" type="number" className="setting-input" defaultValue="5" min="1" max="10" />
          </div>
          <div className="setting-group">
            <label className="setting-label">⏱️ ВРЕМЯ (СЕК)</label>
            <input id="time-input" type="number" className="setting-input" defaultValue="60" min="30" max="180" />
          </div>
          <div className="setting-group" id="words-group" style={{ display: 'none' }}>
            <label className="setting-label">📝 СЛОВА</label>
            <textarea id="words-input" className="setting-input" style={{ resize: 'vertical', minHeight: '100px' }} defaultValue="Кот,Дом,Любовь,Музыка,Звезда,Танец,Радость,Река,Гора,Книга,Цветок,Небо,Огонь,Вода,Луна,Солнце,Ветер,Дерево,Птица,Рыба" />
          </div>
        </div>
        <button className="btn-main" style={{ width: '100%', marginTop: '20px' }} onClick={() => window.startGame()}>СТАРТ 🎮</button>
      </div>

      {/* ИГРА */}
      <div id="game-screen" className="container pink hidden">
        <div className="header">
          <div className="pill timer" id="timer-pill">
            <span>⏱️</span> <span id="timer-display">60</span>
          </div>
          <div className="pill score">
            ОЧКИ: <span id="score-display">0</span>
          </div>
        </div>
        <div className="card">
          <div className="card-label">СЛОВО:</div>
          <div className="word-display" id="word-display">ЗАГРУЗКА...</div>
        </div>
        <div className="btn-grid">
          <button className="btn-action btn-skip" onClick={() => window.skip()}>✕</button>
          <button className="btn-action btn-guess" onClick={() => window.guessed()}>✓</button>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ */}
      <div id="results-screen" className="container white hidden">
        <div className="results-header">
          <div className="results-icon">🏆</div>
          <h2 className="results-score">ИТОГИ: <span id="final-score">0</span></h2>
        </div>
        <div className="results-log" id="results-log"></div>
        <button className="btn-main" style={{ width: '100%' }} onClick={() => window.backToMenu()}> ↻ МЕНЮ </button>
        <button className="btn-back-home" style={{ width: '100%', marginTop: '10px' }} onClick={() => window.goToHome()}>← ДОМОЙ</button>
      </div>
    </div>
  );
};

export default AliasGame;

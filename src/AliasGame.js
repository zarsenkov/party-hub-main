import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- БАЗА СЛОВ ---
const DICTIONARY = {
  "❤️ ХОТ": ["Свидание", "Поцелуй", "Романтика", "Страсть", "Флирт", "Сердце", "Ужин", "Свечи", "Шоколад", "Кольцо", "Отель", "Вино", "Медовый месяц"],
  "🥳 ПАТИ": ["Танцы", "Караоке", "Коктейль", "Музыка", "Друзья", "Вечеринка", "Смех", "Диджей", "Торт", "Шарики", "Конфетти", "Бар", "Тост"],
  "🧠 УМ": ["Интеллект", "Логика", "Философия", "Космос", "Наука", "Квант", "Теория", "Атомы", "Галактика", "Микроскоп", "Робот", "Генетика"]
};

export default function App() {
  // --- СОСТОЯНИЯ (STATE) ---
  
  // Экраны: setup (меню), ready (подготовка), game (процесс), results (итоги раунда), winner (финал игры)
  const [screen, setScreen] = useState('setup'); 
  
  // Команды и их настройки
  const [teams, setTeams] = useState([
    { name: 'Команда 1', score: 0 },
    { name: 'Команда 2', score: 0 }
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  
  // Настройки игры
  const [category, setCategory] = useState("❤️ ХОТ");
  const [roundTime, setRoundTime] = useState(60); // Выбранное время раунда
  const [winScore, setWinScore] = useState(20); // Сколько нужно для победы
  
  // Состояния раунда
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [wordsLog, setWordsLog] = useState([]); // Лог слов текущего раунда

  // --- ЛОГИКА ТАЙМЕРА ---
  // Уменьшает таймер каждую секунду
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setScreen('results'); // Когда время вышло — показываем итоги раунда
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- ФУНКЦИИ ---

  // Выбор случайного слова (исключая повторы в текущем раунде)
  const nextWord = useCallback(() => {
    const list = DICTIONARY[category];
    const word = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(word);
  }, [category]);

  // Подготовка раунда (вызывается при нажатии "К ИГРЕ")
  const prepareRound = () => {
    setTimer(roundTime); // Устанавливаем таймер из настроек
    setWordsLog([]); // Очищаем историю слов
    setScreen('ready');
  };

  // Запуск процесса угадывания
  const startRound = () => {
    setScreen('game');
    setIsActive(true);
    nextWord();
  };

  // Обработка ответа игрока
  const handleScore = (isCorrect) => {
    // Добавляем слово в лог для экрана итогов
    setWordsLog(prev => [{ word: currentWord, correct: isCorrect }, ...prev]);
    
    // Обновляем очки текущей команды
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += isCorrect ? 1 : -1;
    setTeams(newTeams);
    
    nextWord(); // Даем следующее слово
  };

  // Завершение хода (вызывается после просмотра итогов раунда)
  const finishTurn = () => {
    // Проверка: набрал ли кто-то очки для победы?
    if (teams[currentTeamIdx].score >= winScore) {
      setScreen('winner');
    } else {
      // Передаем ход другой команде и идем в меню
      setCurrentTeamIdx(currentTeamIdx === 0 ? 1 : 0);
      setScreen('setup');
    }
  };

  // Сброс всей игры к началу
  const resetAll = () => {
    setTeams([
      { name: 'Команда 1', score: 0 },
      { name: 'Команда 2', score: 0 }
    ]);
    setCurrentTeamIdx(0);
    setScreen('setup');
  };

  return (
    <div className="app-shell">
      
      {/* ВЕРХНЯЯ ПАНЕЛЬ (Инфо во время игры) */}
      <header className={`pop-header ${screen === 'game' ? 'visible' : ''}`}>
        <div className="timer-bubble">⏱ {timer}s</div>
        <div className="score-pill">🏆 {teams[currentTeamIdx].score}</div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: НАСТРОЙКИ (SETUP) */}
        {screen === 'setup' && (
          <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pop-screen active">
            <h1 className="pop-title">ALIAS<span>POP</span></h1>
            
            <div className="section-label">Категория</div>
            <div className="chips-group">
              {Object.keys(DICTIONARY).map(cat => (
                <button key={cat} className={`pop-chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="section-label">Время (сек)</div>
            <div className="chips-group">
              {[30, 60, 90].map(t => (
                <button key={t} className={`pop-chip ${roundTime === t ? 'active' : ''}`} onClick={() => setRoundTime(t)}>
                  {t}
                </button>
              ))}
            </div>

            <div className="summary-box">
              Ход: <span style={{color: 'var(--accent)'}}>{teams[currentTeamIdx].name}</span><br/>
              Счет: {teams[currentTeamIdx].score} / {winScore}
            </div>

            <button className="btn-pop-main" onClick={prepareRound}>ПОГНАЛИ</button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ПОДГОТОВКА (READY) */}
        {screen === 'ready' && (
          <motion.div key="ready" initial={{scale:0.8}} animate={{scale:1}} className="pop-screen active">
            <div className="team-ready-box">
              <div className="section-label">Объясняет</div>
              <h3>{teams[currentTeamIdx].name}</h3>
              <p style={{marginTop: '10px', fontWeight: 800}}>Приготовьтесь!</p>
            </div>
            <button className="btn-pop-main" onClick={startRound}>НАЧАТЬ РАУНД</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: ИГРА (GAME) */}
        {screen === 'game' && (
          <motion.div key="game" initial={{y:50}} animate={{y:0}} className="pop-screen active">
            <div className="card-container">
              <div className="word-card">
                <div id="word-display">{currentWord}</div>
              </div>
            </div>
            <div className="game-actions">
              <button className="btn-pop-main btn-skip" onClick={() => handleScore(false)}>ПРОПУСК -1</button>
              <button className="btn-pop-main btn-check" onClick={() => handleScore(true)}>УГАДАНО +1</button>
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 4: ИТОГИ РАУНДА (RESULTS) */}
        {screen === 'results' && (
          <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="pop-screen active">
            <h2 className="pop-title" style={{fontSize: '2rem'}}>ИТОГИ</h2>
            <div className="pop-list">
              {wordsLog.length > 0 ? wordsLog.map((item, i) => (
                <div key={i} className="word-row">
                  <span>{item.word}</span>
                  <div className={`status-icon ${item.correct ? 'status-ok' : 'status-err'}`}>
                    {item.correct ? '✔' : '✘'}
                  </div>
                </div>
              )) : <p style={{padding: '20px', textAlign: 'center'}}>Нет ответов</p>}
            </div>
            <button className="btn-pop-main" onClick={finishTurn}>ПРОДОЛЖИТЬ</button>
          </motion.div>
        )}

        {/* ЭКРАН 5: ПОБЕДИТЕЛЬ (WINNER) */}
        {screen === 'winner' && (
          <motion.div key="winner" initial={{scale:0.5}} animate={{scale:1}} className="pop-screen active">
            <div className="team-ready-box" style={{background: 'var(--purple)'}}>
              <h1 style={{fontSize: '3rem'}}>🎉</h1>
              <h2>ПОБЕДА!</h2>
              <h3>{teams[currentTeamIdx].name}</h3>
              <p>Вы лучшие!</p>
            </div>
            <button className="btn-pop-main" onClick={resetAll}>ИГРАТЬ ЕЩЕ РАЗ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

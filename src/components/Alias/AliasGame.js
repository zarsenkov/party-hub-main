import React, { useState, useEffect } from 'react';
// Анимации для появления слов
import { motion, AnimatePresence } from 'framer-motion';
// Иконки в стиле техно
import { Zap, Users, Play, RotateCcw, Check, X, Settings, Trophy, ArrowLeft } from 'lucide-react';
import './AliasGame.css';

// База слов (можно расширять)
const WORDS_COLLECTION = [
    "Синхрофазотрон", "Криптовалюта", "Инстаграм", "Космонавт", "Метро", 
    "Апокалипсис", "Гармония", "Шаурма", "Детектив", "Пирамида"
];

const AliasGame = ({ onBack }) => {
    // Состояния: setup, ready, play, results, winner
    const [gameState, setGameState] = useState('setup');
    const [settings, setSettings] = useState({ time: 60, goal: 30, penalty: true });
    const [teams, setTeams] = useState([
        { id: 1, name: 'НЕОН', score: 0 },
        { id: 2, name: 'КВАНТ', score: 0 }
    ]);
    const [currentTeam, setCurrentTeam] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentWords, setCurrentWords] = useState([]); // Список слов текущего раунда
    const [wordIndex, setWordIndex] = useState(0);

    // Таймер раунда
    // // Запускает обратный отсчет, если мы в режиме 'play'
    useEffect(() => {
        let timer;
        if (gameState === 'play' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'play') {
            setGameState('results');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Генерация слов для раунда
    // // Перемешивает базу и сбрасывает индекс
    const prepareRound = () => {
        const shuffled = [...WORDS_COLLECTION].sort(() => Math.random() - 0.5);
        setCurrentWords(shuffled.map(w => ({ text: w, status: null })));
        setWordIndex(0);
        setTimeLeft(settings.time);
        setGameState('play');
    };

    // Ответ: Угадано (true) или Пропуск (false)
    // // Записывает результат в массив слов и переходит к следующему
    const handleAnswer = (isCorrect) => {
        const updated = [...currentWords];
        updated[wordIndex].status = isCorrect ? 'correct' : 'skipped';
        setCurrentWords(updated);
        setWordIndex(i => i + 1);
    };

    // Подсчет итогов раунда
    // // Считает +1 за угаданное и -1 за пропуск (если включен штраф)
    const applyResults = () => {
        const roundPoints = currentWords.reduce((acc, w) => {
            if (w.status === 'correct') return acc + 1;
            if (w.status === 'skipped' && settings.penalty) return acc - 1;
            return acc;
        }, 0);

        const newTeams = [...teams];
        newTeams[currentTeam].score += roundScore(roundPoints);
        setTeams(newTeams);

        // Проверка победы
        if (newTeams[currentTeam].score >= settings.goal) {
            setGameState('winner');
        } else {
            setCurrentTeam(currentTeam === 0 ? 1 : 0);
            setGameState('ready');
        }
    };

    // Вспомогательная функция, чтобы счет не уходил в минус (опционально)
    const roundScore = (p) => Math.max(-100, p);

    // --- ЭКРАНЫ ---

    // 1. Настройка
    if (gameState === 'setup') {
        return (
            <div className="alias-neon setup-screen">
                <button className="back-link" onClick={onBack}><ArrowLeft size={20}/> НАЗАД</button>
                <div className="neon-logo"><Zap size={40} className="zap-icon"/> ALIAS</div>
                <div className="settings-grid">
                    <div className="setting-card">
                        <label>ЦЕЛЬ: {settings.goal} ОЧКОВ</label>
                        <input type="range" min="10" max="100" step="10" value={settings.goal} 
                               onChange={e => setSettings({...settings, goal: +e.target.value})} />
                    </div>
                    <div className="setting-card">
                        <label>ВРЕМЯ: {settings.time}с</label>
                        <input type="range" min="30" max="90" step="15" value={settings.time} 
                               onChange={e => setSettings({...settings, time: +e.target.value})} />
                    </div>
                </div>
                <button className="neon-btn main-action" onClick={() => setGameState('ready')}>ПОДКЛЮЧИТЬСЯ</button>
            </div>
        );
    }

    // 2. Готовность команды
    if (gameState === 'ready') {
        return (
            <div className="alias-neon center">
                <Users size={50} className="glow-icon" />
                <p className="ready-text">ГОТОВИТСЯ КОМАНДА</p>
                <h1 className="team-display">{teams[currentTeam].name}</h1>
                <button className="neon-btn pulse" onClick={prepareRound}>СТАРТ</button>
            </div>
        );
    }

    // 3. Игра (Play)
    if (gameState === 'play') {
        return (
            <div className="alias-neon play-screen">
                <div className="neon-header">
                    <div className="neon-timer">{timeLeft}</div>
                    <div className="neon-score">{teams[currentTeam].name}: {teams[currentTeam].score}</div>
                </div>
                <div className="word-portal">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={wordIndex}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="neon-word-card"
                        >
                            {currentWords[wordIndex]?.text}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="neon-controls">
                    <button className="ctrl-btn x-btn" onClick={() => handleAnswer(false)}><X size={35}/></button>
                    <button className="ctrl-btn ok-btn" onClick={() => handleAnswer(true)}><Check size={35}/></button>
                </div>
            </div>
        );
    }

    // 4. Результаты раунда
    if (gameState === 'results') {
        return (
            <div className="alias-neon results-screen">
                <h2 className="neon-title-sm">ИТОГИ СЕССИИ</h2>
                <div className="words-scroll">
                    {currentWords.filter(w => w.status).map((w, i) => (
                        <div key={i} className={`word-row ${w.status}`}>
                            {w.text} <span>{w.status === 'correct' ? '+1' : '-1'}</span>
                        </div>
                    ))}
                </div>
                <button className="neon-btn" onClick={applyResults}>ПРИНЯТЬ ДАННЫЕ</button>
            </div>
        );
    }

    // 5. Победитель
    return (
        <div className="alias-neon center">
            <Trophy size={80} className="winner-icon" />
            <h1 className="winner-name">{teams[currentTeam].name} WIN</h1>
            <button className="neon-btn" onClick={onBack}>В МЕНЮ</button>
        </div>
    );
};

export default AliasGame;

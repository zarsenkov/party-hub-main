import React, { useState, useEffect, useRef } from 'react';
import './LoveStory.css';

export default function LoveStory({ onBack }) {
    // // СОСТОЯНИЕ ИГРЫ
    const [screen, setScreen] = useState('setup'); // 'setup' или 'game'
    const [teamName, setTeamName] = useState("Команда 1");
    const [rounds, setRounds] = useState(5);
    const [roundTime, setRoundTime] = useState(60);
    const [wordsInput, setWordsInput] = useState("Кот,Дом,Любовь,Музыка,Звезда,Танец,Радость,Река,Гора,Книга,Цветок,Небо,Огонь,Вода,Луна,Солнце,Ветер,Дерево,Птица,Рыба");
    
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    
    // // Модальное окно
    const [modal, setModal] = useState({ active: false, title: "", text: "", buttons: [] });

    // // Таймер
    useEffect(() => {
        let interval = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            endRound();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    // // Функция показа модалки
    const showModal = (title, text, buttons = null) => {
        const defaultButtons = [{ text: 'OK', primary: true, onclick: () => setModal({ ...modal, active: false }) }];
        setModal({ active: true, title, text, buttons: buttons || defaultButtons });
    };

    // // ЗАПУСК ИГРЫ
    const startGame = () => {
        const wordsArr = wordsInput.split(',').map(w => w.trim()).filter(w => w.length > 0);

        if (wordsArr.length === 0) {
            showModal('Ошибка', 'Пожалуйста, введи хотя бы одно слово');
            return;
        }
        if (wordsArr.length < rounds) {
            showModal('Ошибка', `Нужно как минимум ${rounds} слов для ${rounds} раундов`);
            return;
        }

        setWords(wordsArr.sort(() => Math.random() - 0.5));
        setCurrentWordIndex(0);
        setScore(0);
        setTimeLeft(roundTime);
        setIsRunning(true);
        setScreen('game');
    };

    // // Обработка: Угадали
    const handleGuessed = () => {
        if (!isRunning) return;
        setScore(prev => prev + 1);
        createConfetti();
        nextWord();
    };

    // // Обработка: Пропустить
    const handleSkip = () => {
        if (!isRunning) return;
        nextWord();
    };

    // // Переход к следующему слову
    const nextWord = () => {
        if (currentWordIndex + 1 >= rounds) {
            endRound();
        } else {
            setCurrentWordIndex(prev => prev + 1);
            // Если хочешь, чтобы время сбрасывалось каждое слово — расскомментируй:
            // setTimeLeft(roundTime); 
        }
    };

    // // КОНЕЦ РАУНДА
    const endRound = () => {
        setIsRunning(false);
        showModal(
            'Раунд завершён! 🎉',
            `Вы угадали ${score} из ${rounds} слов!`,
            [{
                text: 'Новая игра',
                primary: true,
                onclick: () => {
                    setModal({ ...modal, active: false });
                    setScreen('setup');
                }
            }]
        );
    };

    // // Функция для конфетти (эффект пузырьков)
    const createConfetti = () => {
        const colors = ['#ffd4c4', '#e8d4f0', '#d4ede8', '#f5d4e0', '#f0c890'];
        for (let i = 0; i < 12; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'confetti-bubble';
            bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
            bubble.style.width = (Math.random() * 25 + 8) + 'px';
            bubble.style.height = bubble.style.width;
            bubble.style.left = (Math.random() * window.innerWidth) + 'px';
            bubble.style.top = (window.innerHeight - 60) + 'px';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 1500);
        }
    };

    return (
        <div id="app-sandbox">
            {/* ЭКРАН НАСТРОЕК */}
            {screen === 'setup' && (
                <div className="setup-screen">
                    <div className="setup-container">
                        <div className="setup-title">Soft Pastel Alias</div>
                        <div className="setup-subtitle">Объясняй слова, угадывай команда!</div>
                        
                        <div className="setup-group">
                            <label className="setup-label">Название команды</label>
                            <input type="text" className="setup-input" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                        </div>
                        <div className="setup-group">
                            <label className="setup-label">Количество раундов</label>
                            <input type="number" className="setup-input" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value))} />
                        </div>
                        <div className="setup-group">
                            <label className="setup-label">Время на раунд (сек)</label>
                            <input type="number" className="setup-input" value={roundTime} onChange={(e) => setRoundTime(parseInt(e.target.value))} />
                        </div>
                        <div className="setup-group">
                            <label className="setup-label">Слова (через запятую)</label>
                            <textarea className="setup-input" style={{ minHeight: '80px' }} value={wordsInput} onChange={(e) => setWordsInput(e.target.value)} />
                        </div>
                        
                        <button className="btn-start" onClick={startGame}>НАЧАТЬ ИГРУ 🫧</button>
                    </div>
                </div>
            )}

            {/* ЭКРАН ИГРЫ */}
            {screen === 'game' && (
                <div className="game-screen">
                    <div className="game-title">{teamName}</div>
                    <div className="game-card">
                        <div className="role-display">👋 Ты объясняешь:</div>
                        <div className="word-display">{words[currentWordIndex]}</div>
                        
                        <div className="score-display">
                            Раунд <strong>{currentWordIndex + 1}</strong>/<strong>{rounds}</strong> | <strong>{score}</strong>
                        </div>

                        <div className="timer-container">
                            <div className="timer-label">⏱️ ВРЕМЯ:</div>
                            <div className="timer-bar">
                                <div 
                                    className={`timer-progress ${timeLeft <= 10 ? 'warning' : ''}`} 
                                    style={{ width: `${(timeLeft / roundTime) * 100}%` }}
                                ></div>
                            </div>
                            <div className="timer-display">{timeLeft}</div>
                        </div>

                        <div className="controls">
                            <button className="btn-action" onClick={handleGuessed}>✅ УГАДАЛИ</button>
                            <button className="btn-action" onClick={handleSkip}>⏭️ ПРОПУСТИТЬ</button>
                            <button className="btn-action danger" onClick={() => setScreen('setup')}>🛑 КОНЕЦ</button>
                        </div>
                    </div>
                </div>
            )}

            {/* МОДАЛЬНОЕ ОКНО */}
            {modal.active && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-title">{modal.title}</div>
                        <div className="modal-text">{modal.text}</div>
                        <div className="modal-buttons">
                            {modal.buttons.map((btn, idx) => (
                                <button key={idx} className={`modal-btn ${btn.primary ? 'primary' : ''}`} onClick={btn.onclick}>
                                    {btn.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

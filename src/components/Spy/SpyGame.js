import React, { useState, useEffect } from 'react';
import { EyeOff, ShieldAlert, ArrowLeft, User, Search } from 'lucide-react';
import './SpyGame.css';

const LOCATIONS = ["Орбитальная станция", "Пиратский корабль", "Подводная лодка", "Казино", "Цирк", "Отель"];

const SpyGame = ({ onBack }) => {
  const [stage, setStage] = useState('setup'); // setup, pass, play
  const [players, setPlayers] = useState(4);
  const [data, setData] = useState({ loc: '', spy: 0 });
  const [cur, setCur] = useState(0);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(300);

  useEffect(() => {
    let t = null;
    if (stage === 'play' && time > 0) {
      t = setInterval(() => setTime(p => p - 1), 1000);
    }
    return () => { if (t) clearInterval(t); };
  }, [stage, time]);

  const start = () => {
    setData({ loc: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)], spy: Math.floor(Math.random() * players) });
    setCur(0);
    setShow(false);
    setStage('pass');
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (stage === 'setup') {
    return (
      <div className="spy-wrap black center">
        <button className="back-s" onClick={onBack}><ArrowLeft /> Назад</button>
        <ShieldAlert size={50} color="red" />
        <h1 className="s-title">ШПИОН</h1>
        <div className="s-box">
          <p>Игроков: {players}</p>
          <input type="range" min="3" max="10" value={players} onChange={e => setPlayers(Number(e.target.value))} />
        </div>
        <button className="s-btn" onClick={start}>НАЧАТЬ</button>
      </div>
    );
  }

  if (stage === 'pass') {
    const isSpy = cur === data.spy;
    return (
      <div className="spy-wrap black center">
        <div className="s-badge">ИГРОК {cur + 1}</div>
        <div className="s-card" onClick={() => setShow(!show)}>
          {!show ? (
            <div className="c-close"><EyeOff size={50}/><p>НАЖМИ, ЧТОБЫ УЗНАТЬ РОЛЬ</p></div>
          ) : (
            <div className="c-open">
              {isSpy ? <Search size={50} color="red"/> : <User size={50}/>}
              <h2>{isSpy ? 'ВЫ ШПИОН' : data.loc}</h2>
              <p>Нажми, чтобы скрыть</p>
            </div>
          )}
        </div>
        {show && (
          <button className="s-btn" onClick={() => { if (cur + 1 < players) { setCur(cur + 1); setShow(false); } else { setStage('play'); } }}>
            {cur + 1 < players ? 'СЛЕДУЮЩИЙ' : 'К ОБСУЖДЕНИЮ'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="spy-wrap black center">
      <h2>ОБСУЖДЕНИЕ</h2>
      <div className="s-timer">{formatTime(time)}</div>
      <button className="s-btn" onClick={() => setStage('setup')}>ЗАКОНЧИТЬ</button>
    </div>
  );
};

export default SpyGame;

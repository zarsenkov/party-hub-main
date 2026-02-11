import React, { useState } from 'react';
// Иконки для нуарного стиля
import { Moon, Sun, Skull, Shield, Eye, ArrowLeft, RefreshCw, Users } from 'lucide-react';
import { mafiaRoles } from './mafiaData';

const MafiaGame = ({ onBack }) => {
  const [phase, setPhase] = useState('night'); // night или day
  const [showRole, setShowRole] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // Смена фазы дня и ночи
  // // Переключает визуальную тему и состояние игры
  const togglePhase = () => setPhase(prev => prev === 'night' ? 'day' : 'night');

  // Показать случайную роль (для раздачи ролей по кругу)
  // // Выбирает роль из базы и показывает её игроку
  const getRandomRole = () => {
    const random = mafiaRoles[Math.floor(Math.random() * mafiaRoles.length)];
    setCurrentRole(random);
    setShowRole(true);
  };

  // --- СТИЛИ (Noir UI) ---
  const styles = {
    container: {
      position: 'fixed', inset: 0, padding: '20px',
      background: phase === 'night' ? '#0a0a0a' : '#f5f5f5',
      color: phase === 'night' ? '#fff' : '#000',
      transition: 'all 0.8s ease', display: 'flex', flexDirection: 'column', zIndex: 1000
    },
    card: {
      background: phase === 'night' ? '#1a1a1a' : '#fff',
      border: `2px solid ${phase === 'night' ? '#333' : '#000'}`,
      padding: '30px 20px', borderRadius: '15px', textAlign: 'center',
      boxShadow: phase === 'night' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 20px rgba(0,0,0,0.1)',
      marginTop: '40px'
    },
    phaseBtn: {
      marginTop: 'auto', padding: '15px', borderRadius: '12px',
      background: phase === 'night' ? '#fff' : '#000',
      color: phase === 'night' ? '#000' : '#fff',
      border: 'none', fontWeight: '900', fontSize: '1.2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
    },
    roleTitle: (side) => ({
      fontSize: '2rem', fontWeight: '900', color: side === 'evil' ? '#ff4444' : (side === 'good' ? '#44ff44' : '#ffaa00'),
      marginBottom: '10px', textTransform: 'uppercase'
    })
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={onBack} style={{background: 'none', border: 'none', color: 'inherit'}}><ArrowLeft/></button>
        <div style={{fontWeight: '900', letterSpacing: '2px'}}>MAFIA_MODERATOR</div>
        <Users size={20}/>
      </div>

      {/* Main Content */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        {!showRole ? (
          <div style={{textAlign: 'center'}}>
            <h2 style={{fontSize: '1.5rem', marginBottom: '30px'}}>
              {phase === 'night' ? 'ГОРОД ЗАСЫПАЕТ...' : 'ГОРОД ПРОСЫПАЕТСЯ.'}
            </h2>
            <div style={{fontSize: '5rem', opacity: 0.2, marginBottom: '20px'}}>
              {phase === 'night' ? <Moon size={100}/> : <Sun size={100}/>}
            </div>
            <button 
              onClick={getRandomRole}
              style={{background: 'none', border: `1px solid ${phase === 'night' ? '#fff' : '#000'}`, color: 'inherit', padding: '10px 20px', borderRadius: '20px'}}
            >
              УЗНАТЬ СВОЮ РОЛЬ
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <div style={styles.roleTitle(currentRole.side)}>{currentRole.name}</div>
            <p style={{fontSize: '1.1rem', lineHeight: '1.4', opacity: 0.8}}>{currentRole.desc}</p>
            <button 
              onClick={() => setShowRole(false)}
              style={{marginTop: '25px', background: '#ff4444', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', fontWeight: 'bold'}}
            >
              Я ПОНЯЛ, СКРЫТЬ
            </button>
          </div>
        )}
      </div>

      {/* Phase Switcher */}
      <button style={styles.phaseBtn} onClick={togglePhase}>
        {phase === 'night' ? <Sun /> : <Moon />}
        {phase === 'night' ? 'НАСТАЛ ДЕНЬ' : 'НАСТАЛА НОЧЬ'}
      </button>
    </div>
  );
};

export default MafiaGame;

import React, { useState, useEffect } from 'react';
import PatternLock from './components/PatternLock';
import MainApp from './components/MainApp';

const SESSION_KEY = 'mi_crecimiento_session_2024';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const sessionTime = parseInt(session, 10);
      if (Date.now() - sessionTime < SESSION_DURATION) {
        setIsUnlocked(true);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsChecking(false);
  }, []);

  const handleUnlock = () => {
    localStorage.setItem(SESSION_KEY, Date.now().toString());
    setIsUnlocked(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
  };

  if (isChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '48px' }}>🌱</div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <PatternLock onUnlock={handleUnlock} />;
  }

  return <MainApp onLogout={handleLogout} />;
}

export default App;

import React, { useState, useRef, useEffect } from 'react';

const PATTERN_KEY = 'mi_crecimiento_pattern_2024';
const DOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function PatternLock({ onUnlock }) {
  const [pattern, setPattern] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('check'); // 'check', 'create', 'confirm'
  const [tempPattern, setTempPattern] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const savedPattern = localStorage.getItem(PATTERN_KEY);
    if (!savedPattern) {
      setMode('create');
      setMessage('Crea tu patrón de desbloqueo');
    } else {
      setMessage('Dibuja tu patrón para entrar');
    }
  }, []);

  const getDotPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { row, col };
  };

  const getDotFromPoint = (x, y, rect) => {
    const dotSize = rect.width / 3;
    const col = Math.floor((x - rect.left) / dotSize);
    const row = Math.floor((y - rect.top) / dotSize);
    
    if (col >= 0 && col < 3 && row >= 0 && row < 3) {
      return row * 3 + col;
    }
    return -1;
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setPattern([]);
    setError('');
    
    const point = e.touches ? e.touches[0] : e;
    const rect = containerRef.current.getBoundingClientRect();
    const dot = getDotFromPoint(point.clientX, point.clientY, rect);
    
    if (dot >= 0) {
      setPattern([dot]);
    }
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const point = e.touches ? e.touches[0] : e;
    const rect = containerRef.current.getBoundingClientRect();
    const dot = getDotFromPoint(point.clientX, point.clientY, rect);
    
    if (dot >= 0 && !pattern.includes(dot)) {
      setPattern(prev => [...prev, dot]);
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
    
    if (pattern.length < 4) {
      setError('El patrón debe tener al menos 4 puntos');
      setPattern([]);
      return;
    }

    const patternStr = pattern.join('-');

    if (mode === 'create') {
      setTempPattern(pattern);
      setMode('confirm');
      setMessage('Confirma tu patrón');
      setPattern([]);
    } else if (mode === 'confirm') {
      if (patternStr === tempPattern.join('-')) {
        localStorage.setItem(PATTERN_KEY, patternStr);
        setMessage('¡Patrón creado!');
        setTimeout(() => onUnlock(), 500);
      } else {
        setError('Los patrones no coinciden');
        setMode('create');
        setTempPattern([]);
        setMessage('Crea tu patrón de desbloqueo');
      }
      setPattern([]);
    } else {
      const savedPattern = localStorage.getItem(PATTERN_KEY);
      if (patternStr === savedPattern) {
        setMessage('¡Bienvenido!');
        setTimeout(() => onUnlock(), 300);
      } else {
        setError('Patrón incorrecto');
        setPattern([]);
      }
    }
  };

  const resetPattern = () => {
    if (window.confirm('¿Estás seguro de resetear el patrón? Esto borrará tu patrón actual.')) {
      localStorage.removeItem(PATTERN_KEY);
      setMode('create');
      setMessage('Crea tu nuevo patrón');
      setPattern([]);
      setTempPattern([]);
      setError('');
    }
  };

  const getLineStyle = (from, to) => {
    const fromPos = getDotPosition(from);
    const toPos = getDotPosition(to);
    
    const x1 = (fromPos.col + 0.5) * 33.33;
    const y1 = (fromPos.row + 0.5) * 33.33;
    const x2 = (toPos.col + 0.5) * 33.33;
    const y2 = (toPos.row + 0.5) * 33.33;
    
    return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      userSelect: 'none'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(to right, #fbbf24, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Mi Crecimiento Personal
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{message}</p>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>{error}</p>
        )}
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          width: '280px',
          height: '280px',
          position: 'relative',
          touchAction: 'none'
        }}
      >
        {/* Líneas SVG */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          {pattern.slice(1).map((dot, i) => {
            const line = getLineStyle(pattern[i], dot);
            return (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#f97316"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Puntos */}
        {DOTS.map((dot) => {
          const pos = getDotPosition(dot);
          const isActive = pattern.includes(dot);
          
          return (
            <div
              key={dot}
              style={{
                position: 'absolute',
                left: `${(pos.col + 0.5) * 33.33}%`,
                top: `${(pos.row + 0.5) * 33.33}%`,
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: isActive ? '24px' : '16px',
                height: isActive ? '24px' : '16px',
                borderRadius: '50%',
                background: isActive 
                  ? 'linear-gradient(135deg, #fbbf24, #f97316)' 
                  : 'rgba(255,255,255,0.2)',
                boxShadow: isActive 
                  ? '0 0 20px rgba(249, 115, 22, 0.5)' 
                  : 'none',
                transition: 'all 0.15s ease'
              }} />
            </div>
          );
        })}
      </div>

      <button
        onClick={resetPattern}
        style={{
          marginTop: '40px',
          padding: '12px 24px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: '#64748b',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        Resetear patrón
      </button>
    </div>
  );
}

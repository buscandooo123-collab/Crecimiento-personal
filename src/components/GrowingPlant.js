import React from 'react';

// Etapas de crecimiento de la planta
const PLANT_STAGES = [
  { min: 0, name: 'semilla', emoji: '🌱' },
  { min: 3, name: 'brote', emoji: '🌿' },
  { min: 7, name: 'planta pequeña', emoji: '☘️' },
  { min: 12, name: 'planta mediana', emoji: '🪴' },
  { min: 20, name: 'arbusto', emoji: '🌳' },
  { min: 30, name: 'árbol', emoji: '🌲' },
  { min: 50, name: 'árbol frutal', emoji: '🍀' },
  { min: 75, name: 'jardín', emoji: '🌸' },
  { min: 100, name: 'bosque', emoji: '🌺' }
];

export default function GrowingPlant({ totalLogros }) {
  const getCurrentStage = () => {
    let current = PLANT_STAGES[0];
    for (const stage of PLANT_STAGES) {
      if (totalLogros >= stage.min) {
        current = stage;
      }
    }
    return current;
  };

  const getNextStage = () => {
    for (const stage of PLANT_STAGES) {
      if (totalLogros < stage.min) {
        return stage;
      }
    }
    return null;
  };

  const getProgress = () => {
    const current = getCurrentStage();
    const next = getNextStage();
    
    if (!next) return 100;
    
    const progressInStage = totalLogros - current.min;
    const stageSize = next.min - current.min;
    return Math.round((progressInStage / stageSize) * 100);
  };

  const stage = getCurrentStage();
  const nextStage = getNextStage();
  const progress = getProgress();

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center'
    }}>
      {/* Planta animada */}
      <div style={{
        fontSize: '80px',
        marginBottom: '16px',
        animation: 'float 3s ease-in-out infinite',
        filter: 'drop-shadow(0 10px 20px rgba(34, 197, 94, 0.3))'
      }}>
        {stage.emoji}
      </div>

      {/* Nombre de la etapa */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: '4px',
        textTransform: 'capitalize'
      }}>
        {stage.name}
      </h3>

      {/* Contador de logros */}
      <p style={{
        fontSize: '14px',
        color: '#94a3b8',
        marginBottom: '16px'
      }}>
        {totalLogros} logro{totalLogros !== 1 ? 's' : ''} alcanzado{totalLogros !== 1 ? 's' : ''}
      </p>

      {/* Barra de progreso hacia siguiente etapa */}
      {nextStage && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <span>{stage.emoji} {stage.name}</span>
            <span>{nextStage.emoji} {nextStage.name}</span>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            marginTop: '8px'
          }}>
            {nextStage.min - totalLogros} logro{(nextStage.min - totalLogros) !== 1 ? 's' : ''} más para evolucionar
          </p>
        </div>
      )}

      {/* Mensaje cuando alcanzas el máximo */}
      {!nextStage && (
        <p style={{
          fontSize: '14px',
          color: '#22c55e',
          fontWeight: '600'
        }}>
          🎉 ¡Has alcanzado el nivel máximo!
        </p>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

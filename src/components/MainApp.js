import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import GrowingPlant from './GrowingPlant';

const CATEGORIAS = [
  { id: 'salud', nombre: 'Salud', emoji: '🏥', color: 'emerald' },
  { id: 'estetica', nombre: 'Estética', emoji: '✨', color: 'pink' },
  { id: 'habilidad', nombre: 'Habilidad', emoji: '🎯', color: 'blue' },
  { id: 'educacion', nombre: 'Educación', emoji: '📚', color: 'purple' },
  { id: 'habito', nombre: 'Hábito', emoji: '🔄', color: 'amber' },
  { id: 'fitness', nombre: 'Fitness', emoji: '💪', color: 'orange' },
  { id: 'finanzas', nombre: 'Finanzas', emoji: '💰', color: 'green' },
  { id: 'proyecto', nombre: 'Proyecto', emoji: '🚀', color: 'indigo' },
  { id: 'otro', nombre: 'Otro', emoji: '📌', color: 'slate' }
];

const colorStyles = {
  emerald: { bg: '#d1fae5', text: '#047857', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  pink: { bg: '#fce7f3', text: '#be185d', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
  blue: { bg: '#dbeafe', text: '#1d4ed8', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  purple: { bg: '#ede9fe', text: '#7c3aed', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  amber: { bg: '#fef3c7', text: '#b45309', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  orange: { bg: '#ffedd5', text: '#c2410c', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  green: { bg: '#dcfce7', text: '#15803d', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  indigo: { bg: '#e0e7ff', text: '#4338ca', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  slate: { bg: '#f1f5f9', text: '#475569', gradient: 'linear-gradient(135deg, #64748b, #475569)' }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: 'white',
    paddingBottom: '100px'
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px'
  },
  header: {
    textAlign: 'center',
    padding: '24px 0'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(to right, #fbbf24, #f97316, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  statIcon: {
    fontSize: '24px',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700'
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  addButton: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
  },
  select: {
    flex: 1,
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '14px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none'
  },
  form: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '14px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    resize: 'none',
    minHeight: '80px'
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  btnPrimary: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer'
  },
  btnSecondary: {
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer'
  },
  metaCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    marginBottom: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  metaContent: {
    padding: '20px'
  },
  metaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px'
  },
  metaTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  metaDate: {
    fontSize: '12px',
    color: '#64748b'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  metaStats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '12px',
    flexWrap: 'wrap'
  },
  metaStat: {
    fontSize: '13px'
  },
  metaStatLabel: {
    color: '#64748b'
  },
  metaStatValue: {
    fontWeight: '700'
  },
  description: {
    background: 'rgba(255,255,255,0.05)',
    padding: '12px',
    borderRadius: '12px',
    borderLeft: '3px solid #f59e0b',
    marginBottom: '12px'
  },
  descText: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  goalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  avancesList: {
    marginTop: '12px',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  avanceItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  avanceIcon: {
    fontSize: '16px'
  },
  avanceText: {
    flex: 1
  },
  avanceDate: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px'
  },
  avanceForm: {
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    marginBottom: '12px'
  },
  avanceButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap'
  },
  avanceTypeBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    flexWrap: 'wrap'
  },
  actionBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyEmoji: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  emptyText: {
    color: '#64748b'
  },
  logoutBtn: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '10px',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer'
  }
};

export default function MainApp({ onLogout }) {
  const [metas, setMetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [expandedId, setExpandedId] = useState(null);
  const [avanceForm, setAvanceForm] = useState({});
  
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'habilidad',
    descripcion: '',
    fechaInicio: '',
    inversion: '',
    metaFinal: '',
    estado: 'activo'
  });

  useEffect(() => {
    const q = query(collection(db, 'metas'), orderBy('fechaCreacion', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const metasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMetas(metasData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!formData.titulo.trim()) return;
    
    try {
      await addDoc(collection(db, 'metas'), {
        ...formData,
        avances: [],
        fechaCreacion: new Date().toISOString()
      });
      
      setFormData({
        titulo: '',
        categoria: 'habilidad',
        descripcion: '',
        fechaInicio: '',
        inversion: '',
        metaFinal: '',
        estado: 'activo'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar. Verifica tu conexión.');
    }
  };

  const addAvance = async (metaId, texto, resultado) => {
    if (!texto.trim()) return;
    
    const meta = metas.find(m => m.id === metaId);
    if (!meta) return;

    const nuevoAvance = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      texto,
      resultado
    };

    try {
      await updateDoc(doc(db, 'metas', metaId), {
        avances: [...(meta.avances || []), nuevoAvance]
      });
      setAvanceForm({});
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateEstado = async (metaId, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'metas', metaId), { estado: nuevoEstado });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMeta = async (metaId) => {
    if (!window.confirm('¿Eliminar esta meta?')) return;
    
    try {
      await deleteDoc(doc(db, 'metas', metaId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const metasFiltradas = filtroCategoria === 'todas' 
    ? metas 
    : metas.filter(m => m.categoria === filtroCategoria);

  const totalLogros = metas.reduce((sum, m) => {
    const logrosEnMeta = (m.avances || []).filter(a => a.resultado === 'positivo').length;
    const metaLograda = m.estado === 'logrado' ? 1 : 0;
    return sum + logrosEnMeta + metaLograda;
  }, 0);

  const stats = {
    total: metas.length,
    activas: metas.filter(m => m.estado === 'activo').length,
    logradas: metas.filter(m => m.estado === 'logrado').length,
    inversion: metas.reduce((sum, m) => sum + (parseFloat(m.inversion) || 0), 0)
  };

  const getCategoria = (id) => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[8];

  if (isLoading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
          <p style={{ color: '#94a3b8' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={onLogout} style={styles.logoutBtn}>
        🔒 Bloquear
      </button>

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Mi Crecimiento Personal</h1>
          <p style={styles.subtitle}>Registra, aprende y crece cada día</p>
        </header>

        {/* Planta que crece */}
        <GrowingPlant totalLogros={totalLogros} />

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Metas', value: stats.total, icon: '📊' },
            { label: 'Activas', value: stats.activas, icon: '🔥' },
            { label: 'Logradas', value: stats.logradas, icon: '🏆' },
            { label: 'Invertido', value: `$${stats.inversion.toLocaleString()}`, icon: '💵' }
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtros y Agregar */}
        <div style={styles.filterRow}>
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            + Nueva Meta
          </button>
          
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={styles.select}
          >
            <option value="todas">Todas</option>
            {CATEGORIAS.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={styles.form}>
            <h2 style={styles.formTitle}>Nueva Meta de Crecimiento</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>¿Qué quieres lograr?</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(p => ({ ...p, titulo: e.target.value }))}
                placeholder="Ej: Aprender guitarra, Ortodoncia..."
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData(p => ({ ...p, categoria: e.target.value }))}
                style={styles.input}
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.nombre}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Descripción / Detalles</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Describe tu meta, el plan..."
                style={styles.textarea}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Fecha inicio</label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData(p => ({ ...p, fechaInicio: e.target.value }))}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Inversión $</label>
                <input
                  type="number"
                  value={formData.inversion}
                  onChange={(e) => setFormData(p => ({ ...p, inversion: e.target.value }))}
                  placeholder="0"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Meta final / Objetivo</label>
              <input
                type="text"
                value={formData.metaFinal}
                onChange={(e) => setFormData(p => ({ ...p, metaFinal: e.target.value }))}
                placeholder="Ej: Tocar 5 canciones, Certificarme..."
                style={styles.input}
              />
            </div>

            <div style={styles.formButtons}>
              <button onClick={handleSubmit} style={styles.btnPrimary}>
                Guardar Meta
              </button>
              <button onClick={() => setShowForm(false)} style={styles.btnSecondary}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Metas */}
        {metasFiltradas.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyEmoji}>🌱</div>
            <h3 style={styles.emptyTitle}>Comienza tu viaje</h3>
            <p style={styles.emptyText}>Agrega tu primera meta y empieza a crecer</p>
          </div>
        ) : (
          metasFiltradas.map(meta => {
            const cat = getCategoria(meta.categoria);
            const colors = colorStyles[cat.color];
            const avances = meta.avances || [];
            const positivos = avances.filter(a => a.resultado === 'positivo').length;
            const porcentaje = avances.length > 0 ? Math.round((positivos / avances.length) * 100) : 0;
            const isExpanded = expandedId === meta.id;
            const showAvanceForm = avanceForm[meta.id];

            return (
              <div key={meta.id} style={styles.metaCard}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '4px', background: colors.gradient }} />
                  
                  <div style={styles.metaContent}>
                    {/* Header */}
                    <div style={styles.metaHeader}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '24px' }}>{cat.emoji}</span>
                          <h3 style={styles.metaTitle}>{meta.titulo}</h3>
                        </div>
                        {meta.fechaInicio && (
                          <p style={styles.metaDate}>
                            Inicio: {new Date(meta.fechaInicio).toLocaleDateString('es-MX')}
                          </p>
                        )}
                      </div>
                      
                      <span style={{
                        ...styles.badge,
                        background: meta.estado === 'logrado' ? 'rgba(34,197,94,0.2)' :
                                    meta.estado === 'pausado' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
                        color: meta.estado === 'logrado' ? '#22c55e' :
                               meta.estado === 'pausado' ? '#ef4444' : '#3b82f6'
                      }}>
                        {meta.estado === 'logrado' ? '🏆 Logrado' : 
                         meta.estado === 'pausado' ? '⏸️ Pausado' : '🔥 Activo'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div style={styles.metaStats}>
                      {meta.inversion && parseFloat(meta.inversion) > 0 && (
                        <div style={styles.metaStat}>
                          <span style={styles.metaStatLabel}>Inversión: </span>
                          <span style={{ ...styles.metaStatValue, color: '#f59e0b' }}>
                            ${parseFloat(meta.inversion).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div style={styles.metaStat}>
                        <span style={styles.metaStatLabel}>Avances: </span>
                        <span style={styles.metaStatValue}>{avances.length}</span>
                      </div>
                      {avances.length > 0 && (
                        <div style={styles.metaStat}>
                          <span style={styles.metaStatLabel}>Éxito: </span>
                          <span style={{
                            ...styles.metaStatValue,
                            color: porcentaje >= 70 ? '#22c55e' : porcentaje >= 40 ? '#f59e0b' : '#ef4444'
                          }}>
                            {porcentaje}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    {meta.descripcion && (
                      <div style={styles.description}>
                        <p style={styles.descText}>{meta.descripcion}</p>
                      </div>
                    )}

                    {/* Meta final */}
                    {meta.metaFinal && (
                      <div style={{ ...styles.goalBadge, background: colors.bg, color: colors.text }}>
                        <span>🎯</span>
                        <span>{meta.metaFinal}</span>
                      </div>
                    )}

                    {/* Historial de avances */}
                    {avances.length > 0 && (
                      <div>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : meta.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '13px',
                            cursor: 'pointer',
                            padding: '8px 0'
                          }}
                        >
                          {isExpanded ? '▼ Ocultar avances' : `▶ Ver ${avances.length} avance(s)`}
                        </button>
                        
                        {isExpanded && (
                          <div style={styles.avancesList}>
                            {[...avances].reverse().map(avance => (
                              <div key={avance.id} style={styles.avanceItem}>
                                <span style={{
                                  ...styles.avanceIcon,
                                  color: avance.resultado === 'positivo' ? '#22c55e' : '#ef4444'
                                }}>
                                  {avance.resultado === 'positivo' ? '✓' : '✗'}
                                </span>
                                <div style={styles.avanceText}>
                                  <p>{avance.texto}</p>
                                  <p style={styles.avanceDate}>
                                    {new Date(avance.fecha).toLocaleDateString('es-MX', {
                                      day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Formulario de avance */}
                    {showAvanceForm && (
                      <div style={styles.avanceForm}>
                        <input
                          type="text"
                          value={showAvanceForm.texto || ''}
                          onChange={(e) => setAvanceForm(p => ({
                            ...p,
                            [meta.id]: { ...p[meta.id], texto: e.target.value }
                          }))}
                          placeholder="¿Qué avance tuviste?"
                          style={{ ...styles.input, marginBottom: '12px' }}
                        />
                        
                        <div style={styles.avanceButtons}>
                          <button
                            onClick={() => setAvanceForm(p => ({
                              ...p,
                              [meta.id]: { ...p[meta.id], resultado: 'positivo' }
                            }))}
                            style={{
                              ...styles.avanceTypeBtn,
                              background: showAvanceForm.resultado === 'positivo' ? '#22c55e' : 'rgba(255,255,255,0.1)',
                              color: 'white'
                            }}
                          >
                            ✓ Cumplí
                          </button>
                          <button
                            onClick={() => setAvanceForm(p => ({
                              ...p,
                              [meta.id]: { ...p[meta.id], resultado: 'negativo' }
                            }))}
                            style={{
                              ...styles.avanceTypeBtn,
                              background: showAvanceForm.resultado === 'negativo' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                              color: 'white'
                            }}
                          >
                            ✗ Fallé
                          </button>
                          
                          <div style={{ flex: 1 }} />
                          
                          <button
                            onClick={() => addAvance(meta.id, showAvanceForm.texto, showAvanceForm.resultado || 'positivo')}
                            style={{ ...styles.avanceTypeBtn, background: '#f59e0b', color: 'white' }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setAvanceForm(p => ({ ...p, [meta.id]: null }))}
                            style={{ ...styles.avanceTypeBtn, background: 'rgba(255,255,255,0.1)', color: 'white' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div style={styles.actions}>
                      <button
                        onClick={() => setAvanceForm(p => ({ ...p, [meta.id]: { texto: '', resultado: 'positivo' } }))}
                        style={{ ...styles.actionBtn, background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      >
                        + Avance
                      </button>
                      
                      {meta.estado !== 'logrado' ? (
                        <button
                          onClick={() => updateEstado(meta.id, 'logrado')}
                          style={{ ...styles.actionBtn, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                        >
                          🏆 Lograda
                        </button>
                      ) : (
                        <button
                          onClick={() => updateEstado(meta.id, 'activo')}
                          style={{ ...styles.actionBtn, background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}
                        >
                          🔄 Reactivar
                        </button>
                      )}
                      
                      {meta.estado === 'activo' && (
                        <button
                          onClick={() => updateEstado(meta.id, 'pausado')}
                          style={{ ...styles.actionBtn, background: 'rgba(249,115,22,0.2)', color: '#f97316' }}
                        >
                          ⏸️
                        </button>
                      )}
                      
                      {meta.estado === 'pausado' && (
                        <button
                          onClick={() => updateEstado(meta.id, 'activo')}
                          style={{ ...styles.actionBtn, background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}
                        >
                          ▶️
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteMeta(meta.id)}
                        style={{ ...styles.actionBtn, background: 'rgba(239,68,68,0.1)', color: '#ef4444', marginLeft: 'auto' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

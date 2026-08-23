import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemarios } from '../data/helpers';
import PrimaryButton from '../components/PrimaryButton';

const OPCIONES_CANTIDAD = [5, 10, 15, 20];

export default function HomeScreen() {
  const navigate = useNavigate();
  const temarios = getTemarios();
  const [temarioSeleccionado, setTemarioSeleccionado] = useState(temarios[0]?.nombre ?? null);
  const [cantidad, setCantidad] = useState(10);

  const temarioActual = temarios.find((t) => t.nombre === temarioSeleccionado);
  const maxPreguntas = temarioActual?.total ?? 0;

  const empezarTest = () => {
    if (!temarioSeleccionado) return;
    navigate('/test', {
      state: { temario: temarioSeleccionado, cantidad: Math.min(cantidad, maxPreguntas) },
    });
  };

  return (
    <div className="app-shell">
      <h1 className="title">Tests desde Temario</h1>
      <p className="subtitle">Elige un temario y pon a prueba lo que sabes</p>

      <p className="section-label">Temario</p>
      {temarios.length === 0 && <p className="subtitle">No hay preguntas cargadas todavía.</p>}
      <div className="temario-list">
        {temarios.map((t) => (
          <button
            type="button"
            key={t.nombre}
            onClick={() => setTemarioSeleccionado(t.nombre)}
            className={`temario-card ${temarioSeleccionado === t.nombre ? 'is-selected' : ''}`}
          >
            <div className="temario-nombre">{t.nombre}</div>
            <div className="temario-count">{t.total} preguntas disponibles</div>
          </button>
        ))}
      </div>

      <p className="section-label">Número de preguntas</p>
      <div className="cantidad-row">
        {OPCIONES_CANTIDAD.map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setCantidad(n)}
            disabled={n > maxPreguntas}
            className={`cantidad-chip ${cantidad === n ? 'is-selected' : ''}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="actions">
        <PrimaryButton title="Comenzar test" onClick={empezarTest} disabled={!temarioSeleccionado} />
        <PrimaryButton title="Ver historial" variant="outline" onClick={() => navigate('/historial')} />
      </div>
    </div>
  );
}

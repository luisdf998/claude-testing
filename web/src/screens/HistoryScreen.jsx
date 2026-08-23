import { useEffect, useState } from 'react';
import { obtenerHistorial, obtenerPreguntasMasFalladas } from '../db/database';
import SimpleBarChart from '../components/SimpleBarChart';

function formatearFecha(iso) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function HistoryScreen() {
  const [historial, setHistorial] = useState([]);
  const [masFalladas, setMasFalladas] = useState([]);

  useEffect(() => {
    setHistorial(obtenerHistorial());
    setMasFalladas(obtenerPreguntasMasFalladas(5));
  }, []);

  const datosGrafico = [...historial]
    .slice(0, 6)
    .reverse()
    .map((t) => ({
      label: formatearFecha(t.fecha),
      value: Math.round((t.puntuacion / t.total) * 100),
    }));

  return (
    <div className="app-shell">
      <h1 className="title">Historial</h1>

      {historial.length === 0 ? (
        <p className="subtitle">Todavía no has hecho ningún test.</p>
      ) : (
        <>
          <p className="section-label">Evolución</p>
          <SimpleBarChart data={datosGrafico} />

          {masFalladas.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: 32 }}>
                Preguntas para repasar
              </p>
              {masFalladas.map((f) => (
                <div key={f.pregunta_id} className="repaso-item">
                  <span className="repaso-texto">{f.pregunta_texto}</span>
                  <span className="repaso-count">{f.veces_fallada}×</span>
                </div>
              ))}
            </>
          )}

          <p className="section-label" style={{ marginTop: 32 }}>
            Tests realizados
          </p>
          {historial.map((item) => (
            <div key={item.id} className="test-item">
              <div>
                <div className="temario-nombre">{item.temario}</div>
                <div className="test-item-fecha">{formatearFecha(item.fecha)}</div>
              </div>
              <span className="test-item-score">
                {item.puntuacion}/{item.total}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

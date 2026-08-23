import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { guardarResultadoTest } from '../db/database';
import PrimaryButton from '../components/PrimaryButton';

export default function ResultScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { temario, total, aciertos, falladas } = state ?? {};
  const guardadoRef = useRef(false);

  useEffect(() => {
    if (!temario) {
      navigate('/', { replace: true });
      return;
    }
    if (!guardadoRef.current) {
      guardarResultadoTest({ temario, puntuacion: aciertos, total, preguntasFalladas: falladas });
      guardadoRef.current = true;
    }
  }, [temario, navigate, aciertos, total, falladas]);

  if (!temario) {
    return null;
  }

  const porcentaje = Math.round((aciertos / total) * 100);
  const colorPuntuacion = porcentaje >= 60 ? 'var(--color-correct)' : 'var(--color-incorrect)';

  return (
    <div className="app-shell result-shell">
      <p className="result-temario">{temario}</p>

      <div className="score-circle" style={{ borderColor: colorPuntuacion }}>
        <span className="score-number" style={{ color: colorPuntuacion }}>
          {porcentaje}%
        </span>
      </div>

      <p className="result-detalle">
        {aciertos} de {total} preguntas correctas
      </p>

      {falladas.length > 0 && (
        <div className="falladas-box">
          <p className="falladas-titulo">Preguntas falladas</p>
          {falladas.map((f) => (
            <p key={f.id} className="fallada-item">
              • {f.pregunta}
            </p>
          ))}
        </div>
      )}

      <div className="actions" style={{ width: '100%' }}>
        <PrimaryButton title="Volver al inicio" onClick={() => navigate('/', { replace: true })} />
        <PrimaryButton title="Ver historial" variant="outline" onClick={() => navigate('/historial')} />
      </div>
    </div>
  );
}

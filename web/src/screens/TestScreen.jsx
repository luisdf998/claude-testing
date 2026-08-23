import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPreguntasAleatorias } from '../data/helpers';
import ProgressBar from '../components/ProgressBar';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';

export default function TestScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { temario, cantidad } = state ?? {};

  const [preguntas] = useState(() => (temario ? getPreguntasAleatorias(temario, cantidad) : []));
  const [indice, setIndice] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [falladas, setFalladas] = useState([]);

  useEffect(() => {
    if (!temario) {
      navigate('/', { replace: true });
    }
  }, [temario, navigate]);

  if (!temario) {
    return null;
  }

  const preguntaActual = preguntas[indice];
  const esUltima = indice === preguntas.length - 1;

  const seleccionarOpcion = (opcionIndex) => {
    if (respondida) return;
    setSeleccionada(opcionIndex);
    setRespondida(true);

    if (opcionIndex === preguntaActual.correcta) {
      setAciertos((prev) => prev + 1);
    } else {
      setFalladas((prev) => [...prev, preguntaActual]);
    }
  };

  const siguiente = () => {
    if (esUltima) {
      navigate('/resultado', {
        replace: true,
        state: { temario, total: preguntas.length, aciertos, falladas },
      });
      return;
    }

    setIndice((prev) => prev + 1);
    setSeleccionada(null);
    setRespondida(false);
  };

  const getEstadoOpcion = (opcionIndex) => {
    if (!respondida) return 'default';
    if (opcionIndex === preguntaActual.correcta) return 'correct';
    if (opcionIndex === seleccionada) return 'incorrect';
    return 'muted';
  };

  if (!preguntaActual) {
    return (
      <div className="app-shell">
        <p>No hay preguntas disponibles para este temario.</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ProgressBar progress={indice / preguntas.length} />
      <p className="test-contador">
        Pregunta {indice + 1} de {preguntas.length}
      </p>

      <div className="test-body" key={indice}>
        <h2 className="test-pregunta">{preguntaActual.pregunta}</h2>

        <div>
          {preguntaActual.opciones.map((opcion, i) => (
            <OptionButton
              key={i}
              label={opcion}
              state={getEstadoOpcion(i)}
              onClick={() => seleccionarOpcion(i)}
            />
          ))}
        </div>
      </div>

      {respondida && (
        <PrimaryButton title={esUltima ? 'Ver resultado' : 'Siguiente'} onClick={siguiente} />
      )}
    </div>
  );
}

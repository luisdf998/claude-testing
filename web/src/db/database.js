const TESTS_KEY = 'tdt_tests';
const FALLOS_KEY = 'tdt_fallos';

function leer(clave) {
  const raw = localStorage.getItem(clave);
  return raw ? JSON.parse(raw) : [];
}

function escribir(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function siguienteId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function guardarResultadoTest({ temario, puntuacion, total, preguntasFalladas }) {
  const fecha = new Date().toISOString();

  const tests = leer(TESTS_KEY);
  const testId = siguienteId(tests);
  tests.push({ id: testId, temario, fecha, puntuacion, total });
  escribir(TESTS_KEY, tests);

  const fallos = leer(FALLOS_KEY);
  let nextFalloId = siguienteId(fallos);
  for (const pregunta of preguntasFalladas) {
    fallos.push({
      id: nextFalloId++,
      test_id: testId,
      pregunta_id: pregunta.id,
      pregunta_texto: pregunta.pregunta,
      fecha,
    });
  }
  escribir(FALLOS_KEY, fallos);

  return testId;
}

export function obtenerHistorial() {
  return leer(TESTS_KEY).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

export function obtenerPreguntasMasFalladas(limite = 10) {
  const fallos = leer(FALLOS_KEY);
  const conteo = new Map();

  for (const f of fallos) {
    const actual = conteo.get(f.pregunta_id);
    if (actual) {
      actual.veces_fallada += 1;
    } else {
      conteo.set(f.pregunta_id, {
        pregunta_id: f.pregunta_id,
        pregunta_texto: f.pregunta_texto,
        veces_fallada: 1,
      });
    }
  }

  return Array.from(conteo.values())
    .sort((a, b) => b.veces_fallada - a.veces_fallada)
    .slice(0, limite);
}

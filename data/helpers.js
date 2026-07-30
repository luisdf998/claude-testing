import preguntas from './preguntas.json';

export function getTemarios() {
  const mapa = new Map();
  for (const p of preguntas) {
    mapa.set(p.temario, (mapa.get(p.temario) || 0) + 1);
  }
  return Array.from(mapa.entries()).map(([nombre, total]) => ({ nombre, total }));
}

export function getPreguntasAleatorias(temario, cantidad) {
  const disponibles = preguntas.filter((p) => p.temario === temario);
  const barajadas = [...disponibles].sort(() => Math.random() - 0.5);
  return barajadas.slice(0, Math.min(cantidad, barajadas.length));
}

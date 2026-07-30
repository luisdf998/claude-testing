import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tests.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temario TEXT NOT NULL,
      fecha TEXT NOT NULL,
      puntuacion INTEGER NOT NULL,
      total INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fallos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER NOT NULL,
      pregunta_id TEXT NOT NULL,
      pregunta_texto TEXT NOT NULL,
      fecha TEXT NOT NULL,
      FOREIGN KEY (test_id) REFERENCES tests (id)
    );
  `);
}

export function guardarResultadoTest({ temario, puntuacion, total, preguntasFalladas }) {
  const fecha = new Date().toISOString();

  const result = db.runSync(
    'INSERT INTO tests (temario, fecha, puntuacion, total) VALUES (?, ?, ?, ?)',
    [temario, fecha, puntuacion, total]
  );

  const testId = result.lastInsertRowId;

  for (const pregunta of preguntasFalladas) {
    db.runSync(
      'INSERT INTO fallos (test_id, pregunta_id, pregunta_texto, fecha) VALUES (?, ?, ?, ?)',
      [testId, pregunta.id, pregunta.pregunta, fecha]
    );
  }

  return testId;
}

export function obtenerHistorial() {
  return db.getAllSync('SELECT * FROM tests ORDER BY fecha DESC');
}

export function obtenerPreguntasMasFalladas(limite = 10) {
  return db.getAllSync(
    `SELECT pregunta_id, pregunta_texto, COUNT(*) as veces_fallada
     FROM fallos
     GROUP BY pregunta_id
     ORDER BY veces_fallada DESC
     LIMIT ?`,
    [limite]
  );
}

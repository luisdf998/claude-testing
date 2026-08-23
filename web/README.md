# Tests desde Temario — Web

Versión web (navegador de PC) de la app de tests. Proyecto independiente en React + Vite, sin Expo/React Native. Funciona 100% offline una vez cargada la página (no necesita servidor ni base de datos externa).

## Stack

- React + Vite
- React Router (`HashRouter`)
- `localStorage` del navegador para historial y estadísticas (en vez de SQLite)
- Banco de preguntas en `src/data/preguntas.json`

## Cómo ejecutarla

```bash
cd web
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`) en tu navegador.

## Build de producción

```bash
npm run build
npm run preview
```

`npm run build` genera una carpeta `dist/` con HTML/CSS/JS estáticos que puedes abrir directamente o servir con cualquier servidor estático — no requiere Node en el PC donde se use, solo para generarla.

## Banco de preguntas

`src/data/preguntas.json` contiene actualmente **preguntas de ejemplo** (Cultura General e Historia). Para usar tu temario real, sustituye el contenido de ese archivo por preguntas con el mismo formato:

```json
{
  "id": "t1-001",
  "temario": "Nombre del temario",
  "pregunta": "¿Qué es X?",
  "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correcta": 2
}
```

No hace falta tocar nada más: los temarios disponibles se detectan automáticamente a partir del campo `temario`.

## Estructura

```
src/
  screens/     Home, Test, Resultado, Historial
  components/  Botones, barra de progreso, gráfico de barras
  data/        Banco de preguntas y helpers
  db/          Persistencia en localStorage
  index.css    Variables de tema (colores, tipografía, espaciados)
```

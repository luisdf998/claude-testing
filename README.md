# Tests desde Temario

App para hacer tests de opción múltiple sobre uno o varios temarios. Las preguntas están precargadas y todo funciona 100% offline.

Este repo tiene dos versiones independientes:

- **Raíz** (esta carpeta): app móvil Android/iOS con Expo + React Native (documentada abajo).
- **`/web`**: app web para PC con React + Vite, pensada para usarse en el navegador del ordenador. Ver `web/README.md`.

## App móvil (Expo)

## Stack

- React Native + Expo
- React Navigation (native-stack)
- expo-sqlite (historial de tests y estadísticas)
- Banco de preguntas en `data/preguntas.json`

## Cómo probarla en tu móvil Android

1. Instala la app **Expo Go** desde Google Play.
2. En este proyecto, instala dependencias y arranca el servidor de desarrollo:

   ```bash
   npm install
   npx expo start
   ```

3. Escanea el código QR que aparece en la terminal con la app Expo Go (Android) o con la cámara (iOS).
4. La app se abrirá en tu teléfono, conectado por wifi a tu ordenador (misma red).

## Estructura del proyecto

```
/screens     Pantallas: Home, Test, Resultado, Historial
/components  Componentes reutilizables (botones, barra de progreso, gráfico)
/data        Banco de preguntas (preguntas.json) y helpers
/db          Acceso a SQLite (historial y estadísticas)
/theme       Colores, tipografía y espaciados
```

## Banco de preguntas

`data/preguntas.json` contiene actualmente **preguntas de ejemplo** (Cultura General e Historia) para poder probar la app de inmediato. Para sustituirlas por las preguntas reales de tu temario:

1. Genera el JSON con el mismo formato:

   ```json
   {
     "id": "t1-001",
     "temario": "Nombre del temario",
     "pregunta": "¿Qué es X?",
     "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
     "correcta": 2
   }
   ```

2. Sustituye o añade el contenido de `data/preguntas.json`.
3. No hace falta tocar ningún otro archivo: la app detecta automáticamente los temarios disponibles a partir del campo `temario`.

## Generar el APK para instalar en tu móvil sin Expo Go

Cuando quieras una versión instalable sin depender de Expo Go:

```bash
npx expo prebuild -p android
cd android && ./gradlew assembleRelease
```

El APK se genera en `android/app/build/outputs/apk/release/`.

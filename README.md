# 🌱 Mi Crecimiento Personal

Aplicación para seguimiento de metas y crecimiento personal con Firebase y patrón de bloqueo.

## ✨ Características

- 🔒 **Patrón de bloqueo** - Protege tu información personal
- 🌱 **Planta que crece** - Visualiza tu progreso con una planta que evoluciona con tus logros
- 📊 **9 categorías** - Salud, Estética, Habilidades, Educación, Hábitos, Fitness, Finanzas, Proyectos y más
- ☁️ **Sincronización en la nube** - Tus datos se guardan en Firebase
- 📱 **PWA** - Instálala en tu celular como app nativa
- 🆔 **ID único** - No se confunde con otras apps instaladas

## 🚀 Configuración

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (ej: "mi-crecimiento-personal")
3. Ve a **Configuración del proyecto** > **General**
4. En "Tus apps", haz clic en el ícono web (`</>`)
5. Registra la app con un nombre (ej: "mi-crecimiento-web")
6. Copia la configuración que te da

### 2. Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (o configura reglas después)
4. Selecciona una ubicación cercana a ti

### 3. Actualizar credenciales

Abre el archivo `src/firebase.js` y reemplaza los valores:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 4. Instalar y ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Crear versión de producción
npm run build
```

## 📱 Instalar en tu celular

### Opción A: Usando GitHub Pages (recomendado)

1. Sube el proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `gh-pages` o configura GitHub Actions
4. Abre la URL en tu celular
5. En el navegador, selecciona "Agregar a pantalla de inicio"

### Opción B: Usando Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Inicializar hosting
firebase init hosting

# Desplegar
npm run build
firebase deploy
```

### Opción C: Usando Vercel o Netlify

1. Conecta tu repositorio de GitHub
2. Configura el build command: `npm run build`
3. Configura el output directory: `build`
4. Despliega

## 🌱 Etapas de la planta

Tu planta evoluciona con cada logro:

| Logros | Etapa | Emoji |
|--------|-------|-------|
| 0-2 | Semilla | 🌱 |
| 3-6 | Brote | 🌿 |
| 7-11 | Planta pequeña | ☘️ |
| 12-19 | Planta mediana | 🪴 |
| 20-29 | Arbusto | 🌳 |
| 30-49 | Árbol | 🌲 |
| 50-74 | Árbol frutal | 🍀 |
| 75-99 | Jardín | 🌸 |
| 100+ | Bosque | 🌺 |

## 🔐 Patrón de bloqueo

- La primera vez que abras la app, crea tu patrón (mínimo 4 puntos)
- Confirma el patrón para guardarlo
- La sesión dura 30 minutos
- Puedes resetear el patrón desde la pantalla de bloqueo

## 📂 Estructura del proyecto

```
mi-crecimiento-app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── icon-192.png (agregar)
│   └── icon-512.png (agregar)
├── src/
│   ├── components/
│   │   ├── PatternLock.js
│   │   ├── MainApp.js
│   │   └── GrowingPlant.js
│   ├── firebase.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 🎨 Personalización

### Cambiar colores

Edita los colores en `MainApp.js` en el objeto `colorStyles`.

### Agregar categorías

Agrega nuevas categorías en el array `CATEGORIAS` en `MainApp.js`.

### Cambiar etapas de la planta

Edita el array `PLANT_STAGES` en `GrowingPlant.js`.

## 🐛 Solución de problemas

### "Error al guardar"
- Verifica que tus credenciales de Firebase sean correctas
- Asegúrate de tener conexión a internet
- Revisa las reglas de Firestore

### La app no se instala en el celular
- Asegúrate de acceder por HTTPS
- Verifica que el manifest.json esté correcto
- Agrega los íconos icon-192.png y icon-512.png

### El patrón no funciona
- Usa al menos 4 puntos
- Si olvidaste el patrón, usa el botón "Resetear patrón"

## 📄 Licencia

Uso personal. Creado con ❤️ para tu crecimiento personal.

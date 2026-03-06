# Setup - Campaña Nicolás Murillo #3

## Estado del Proyecto ✅

### ✅ Completado
- **HTML Refactorizado:** Layout pixel-perfect con Tailwind CSS, responsive mobile-first
- **Secciones Implementadas:**
  - ✅ Navbar con navegación fija
  - ✅ Hero section con candidato
  - ✅ Perfil
  - ✅ Propuestas (4 tarjetas)
  - ✅ Galería (6 slots para fotos)
  - ✅ Super Nico #3 Game section
  - ✅ Leaderboard
  - ✅ Footer
- **Game Loop Implementado:**
  - ✅ Canvas interactivo
  - ✅ Player con física de gravedad
  - ✅ Obstáculos (números 1, 2)
  - ✅ Power-ups (número 3) con efectos visuales
  - ✅ Colisiones y detección
  - ✅ Sistema de vidas y puntuación
  - ✅ Dificultad progresiva
  - ✅ Modal GameOver
  - ✅ Input handling: teclado y touch
- **Assets & Structure:**
  - ✅ Carpeta Assets/fotos/ para galería
  - ✅ Spritesheet placeholder preparado

### ⏳ Próximos Pasos (Supabase Backend)

1. **Configurar Supabase:**
   ```bash
   # Crear proyecto en https://supabase.com
   # Copiar API keys
   ```

2. **Crear Tabla en Supabase:**
   ```sql
   CREATE TABLE Puntajes (
     id BIGSERIAL PRIMARY KEY,
     nombre VARCHAR(100) NOT NULL,
     curso VARCHAR(50) NOT NULL,
     puntaje INTEGER NOT NULL,
     tiempo INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE INDEX idx_puntaje ON Puntajes(puntaje DESC);
   ```

3. **Instalar Supabase JS Client en el proyecto:**
   ```bash
   npm install @supabase/supabase-js
   # O incluir vía CDN en el HTML
   ```

4. **Descomentar/Implementar en game.js:**
   - Línea ~350: `fetchTop10()` - Conectar a Supabase
   - Línea ~365: `checkIfTopScorer()` - Validar contra BD
   - Línea ~380: `submitScore()` - Insertar en Supabase

---

## Archivos del Proyecto

```
nico_landing_dino/
├── index.html                 # Landing page (refactorizado)
├── game.js                    # Game loop (nuevo)
├── tailwind.config.js         # Tailwind configuration object (externalized)
├── style.css                  # Additional custom styles & utilities
├── LICENSE
├── PRD_Dino3_Landing.md       # Especificaciones
├── SETUP.md                   # Este archivo
│
└── Assets/
    ├── README.md              # Instrucciones assets
    ├── spritesheet.png        # (Pendiente: usuario debe agregar)
    │
    └── fotos/                 # Galería
        ├── foto-1.jpg         # (Pendiente)
        ├── foto-2.jpg         # (Pendiente)
        ├── foto-3.jpg         # (Pendiente)
        ├── foto-4.jpg         # (Pendiente)
        ├── foto-5.jpg         # (Pendiente)
        └── foto-6.jpg         # (Pendiente)
```

---

## Instalación & Local Development

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Python 3 (para servidor local) O Node.js (para alternativas)
- [Opcional] Node/npm si deseas recompilar Tailwind localmente con el archivo `tailwind.config.js`

### Pasos

1. **Clonar/Descargar el repositorio**
   ```bash
   cd nico_landing_dino
   ```

2. **Iniciar servidor local**
   ```bash
   # Opción 1: Python
   python -m http.server 8000
   
   # Opción 2: Node.js (http-server)
   npx http-server
   
   # Opción 3: Live Server (VS Code extension)
   # Click derecho en index.html → Open with Live Server
   ```
> **Build con Tailwind (opcional)**
> Si prefieres no depender del CDN durante el desarrollo, puedes usar `tailwind.config.js` junto con el CLI:
> ```bash
> npm install -D tailwindcss postcss autoprefixer
> npx tailwindcss init
> # crea un archivo input.css que importe @tailwind base, components, utilities
> npx tailwindcss -i ./src/input.css -o ./style.css --watch
> ```
> Ajusta tus rutas según sea necesario; `style.css` ya es referenciado en el `<head>` de la página.
3. **Acceder en navegador**
   ```
   http://localhost:8000
   ```

4. **Testing del Juego**
   - Desplazarse a la sección "Super Nico #3"
   - Hacer click en "Iniciar Juego"
   - Usar **SPACEBAR** (desktop) o **TAP** (mobile) para saltar
   - Recolectar #3 (oro) = +50 puntos
   - Evitar 1 y 2 (rojo/naranja) = -1 vida
   - Game Over en 0 vidas
   - Llenar nombre/aula y guardar si es Top 10 (después de Supabase)

---

## Agregar Assets (Fotos & Spritesheet)

### Fotos Galería
1. Preparar 6 imágenes (800x800px mín, <200KB cada una)
2. Guardar como:
   - `Assets/fotos/foto-1.jpg`
   - `Assets/fotos/foto-2.jpg`
   - ... etc

### Spritesheet Personaje
1. Crear/descargar spritesheet PNG con sprites de:
   - Jugador (Nico saltando)
   - Obstáculos (números 1, 2)
   - Power-ups (número 3)
2. Guardar en raíz como `Assets/sprite_sheet.png`
3. (Opcional) Ajustar coordenadas de subimágenes en game.js si es necesario

---

## Configuración de Deployment (Hostinger)

### Git Integration en Hostinger
1. Conectar repositorio GitHub en hPanel → Git Integration
2. Apuntar branch: `main` (o tu rama activa)
3. Root path: `/` (raíz del repositorio)

### Build (si aplica)
Como es HTML + JS vanilla, **no requiere build**. Hostinger sirve directamente.

### Custom Domain
1. Actualizar DNS en tu registrador
2. O usar subdominio de Hostinger
3. Vincular en hPanel → Dominio

---

## Funcionalidades Especiales

### Mobile Responsividad
- ✅ Hero section se adapta a pantalla
- ✅ Grid de propuestas: 4 col (desktop) → 2 col (tablet) → 1 col (mobile)
- ✅ Galería: 3 col → 2 col → 1 col
- ✅ Canvas del juego escala proporcionalmente
- ✅ Leaderboard se posiciona debajo del canvas en mobile

### Efectos Visuales
- ✅ Glassmorphism en Hero y componentes
- ✅ Gradientes radiales de fondo
- ✅ Animación rebote en badge #3
- ✅ Hover effects en cards
- ✅ Partículas al recoger power-up
- ✅ Escala de zoom al pasar sobre galerías

### Gameplay
- ✅ 3 vidas iniciales (❤️ visual)
- ✅ Puntuación incrementa por power-ups (+50)
- ✅ Dificultad progresiva (velocidad +0.5 cada 500 puntos)
- ✅ Timer en tiempo real
- ✅ Game Over modal con resumen

---

## Troubleshooting

### Juego no inicia
- ✅ Verificar consola (F12 → Console) para errores
- ✅ Asegurar que `game.js` esté en la raíz del proyecto
- ✅ Limpiar caché del navegador (Ctrl+Shift+Delete)

### Canvas no se ve
- ✅ Abrir DevTools (F12)
- ✅ Buscar errores en Console
- ✅ Verificar resolución del canvas (800x400 por defecto)

### Input no funciona
- ✅ En desktop: Spacebar o Arrow Up
- ✅ En mobile: Tap en el canvas
- ✅ Verificar que el juego esté `running: true`

### Fotos galería no cargan
- ✅ Verificar ruta: `./Assets/fotos/foto-N.jpg`
- ✅ Asegurar que el nombre coincida exactamente
- ✅ Verificar formato: PNG o JPG (no WEBP sin soporte)

---

## Variables de Entorno (Supabase - Futuro)

Después de implementar Supabase, crear archivo `.env`:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-api-key
```

Luego importar en `game.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## Contacto & Soporte

- **Candidato:** Nicolás Murillo Serrano
- **Institución:** José Eustasio Rivera, Cubarral – Meta
- **Campaña:** Contralor 2026

---

**Última actualización:** 4 de marzo de 2026  
**Versión:** 1.0 - MVP (Game Loop + Frontend)

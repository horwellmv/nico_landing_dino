# Assets para Campaña Nicolás Murillo #3

Esta carpeta contiene todos los recursos de imagen y multimedia del proyecto.

## Estructura

### `/fotos`
Contiene las imágenes para la sección **Galería** de la landing page.

**Archivos esperados:**
- `foto-1.jpg` - Momento de campaña 1
- `foto-2.jpg` - Momento de campaña 2 (con estudiantes)
- `foto-3.jpg` - Momento de campaña 3 (transparencia)
- `foto-4.jpg` - Momento de campaña 4 (compromiso)
- `foto-5.jpg` - Momento de campaña 5 (liderazgo)
- `foto-6.jpg` - Momento de campaña 6 (juntos #3)

**Formato recomendado:**
- Resolución mínima: 800x800px
- Formato: JPG u PNG
- Optimización: Comprimir a <200KB por imagen

### `/game` (opcional)
Reservado para sprites personalizados del juego si en el futuro se decide usar imágenes.

**Archivos opcionales:**
- `player.png` - Avatar del jugador (Nico)
- `obstacle-1.png` - Obstáculo número 1
- `obstacle-2.png` - Obstáculo número 2
- `powerup-3.png` - Power-up número 3
- `bg-game.png` - Fondo del juego

## Spritesheet

El archivo `spritesheet.png` debe colocarse en la **raíz del proyecto** (al mismo nivel que `index.html` y `game.js`).

**Especificaciones del spritesheet:**
- Debe contener sprites para: jugador, obstáculos (1, 2) y power-ups (3)
- Formato PNG con transparencia
- Resolución recomendada: 256x256px o superior
- Se carga automáticamente en `game.js` desde `./Assets/spritesheet.png`

## Notas

- Las imágenes se cargan automáticamente desde las rutas relativas definidas en el HTML/JS
- Si falta algún archivo, el navegador mostrará un icono de imagen rota
- Para optimización de carga, considera usar un CDN o servicio de optimización de imágenes

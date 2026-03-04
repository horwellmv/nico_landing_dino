# Project Requirements Document (PRD): Landing Page Nicolás Murillo Serrano

## 1. Contexto del Proyecto
- **Objetivo:** Campaña política estudiantil para la Contraloría (Número 3).
- **Target:** Estudiantes de 7 a 16 años (enfoque en gamificación).
- **Concepto:** Landing page interactiva con un "Dino Game de google" personalizado para generar recordación del número de tarjera.

## 2. Stack Tecnológico
- **Frontend:** HTML5, Tailwind CSS (Mobile-first).
- **Lógica del Juego:** Vanilla JavaScript (Canvas API).
- **Database (Leaderboard):** Supabase (PostgreSQL) para persistencia en tiempo real.
- **Deployment:** Hostinger Business Plan (vía Git Integration).

## 3. Arquitectura de la Landing Page (Secciones)
1. **Hero Section:** Nombre del candidato: "Nicolas Murillo Serrano", eslogan: "Transparencia que construye confianza" y énfasis visual en el "Número 3", Nuemero en el tarjeton: 3, Postulacion: "Contralor 2026", Institucion Educativa: "José Eustasio Rivera".
2. **Sobre Mí:** Perfil breve adaptado a lenguaje juvenil: "Hola, Soy Nicolas, Estudiante comprometido con los valores de esta intitución, Honestidad, Responsabilidad y Respeto. Soy organizado y con liderazgo; Creo en la transparencia como base para fortalecer nuestra institución; Comprometido a velar por nuestros recursos y escuchar a mis compañeros "
3. **Propuestas:** Cards dinámicas con iconos llamativos: (1, transparencia Total: Informes claros sobre el uso de nuestros recursos, rendicion de cuentas periodicas; 2, Participación estudiantil: Espacios para escuchar tus inquietudes, Buzón fisico y digital de sugerencias; 3, Seguimiento Responsable: Supervisión de proyectos escolares, Acompañamiento a iniciativas estudiantiles; 4, Trabajo en equipo: Trabajo en equipo: Apoyo al gobierno escolar, promoción del respeto y la convivencia.)
4. **Galería:** Grid de imágenes con interacción en carpeta Assets/fotos (hover effects).
5. **Dino Game "Dino 3":** El core de interacción.
6. **Leaderboard:** Tabla de posiciones (Top 10) consultada desde Supabase.

## 4. Especificaciones del Juego "Dino 3"
### Mecánicas principales:
- **Obstáculos:** Números 1, 2. Al colisionar: -1 vida (Total: 3 vidas).
- **Power-ups:** Número 3. Al recogerlo: +50 puntos y efecto visual de "brillo/boost".
- **Dificultad:** Aumento progresivo de `speed` en el Game Loop.

### Flujo del Leaderboard:
- Al terminar el juego (GameOver), verificar si el puntaje entra en el Top 10.
- Si califica, desplegar un `Modal` de Tailwind para capturar "Nombre" y "Curso".
- Enviar datos: (nombre, curso, puntaje, tiempo) a Supabase mediante `INSERT`.

## 5. Tareas Técnicas para el IDE
- [ ] Configurar el boilerplate de HTML5 con CLI de Tailwind.
- [ ] Implementar el Game Loop base en un archivo `game.js`.
- [ ] Definir los Assets en carpeta Assets/game (Sprites) para el avatar y los obstáculos.
- [ ] Configurar el cliente de Supabase para fetching y posting de datos. Nombre de Tabla: Puntajes; datos de tabla: id(pk), nombre, curso,puntaje, tiempo. 
- [ ] Optimizar la visualización para dispositivos móviles (Responsive design).

## 6. Configuración de Deployment (Hostinger)
- Configurar el Webhook de GitHub en el hPanel de Hostinger.
- Apuntar el dominio a la subcarpeta del repositorio.
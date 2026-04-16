# Portfolio — Windows XP Style Portfolio

Descripción
-----------
Portfolio personal que recrea la estética de Windows XP usando Angular. Incluye pantalla de arranque, login inspirado en XP y un escritorio con iconos y taskbar.

Propósito
--------
- Mostrar trabajos y enlaces en una experiencia retro y visualmente cuidada.
- Servir como demostración técnica de UI, animaciones y i18n en Angular.

Tecnologías principales
----------------------
- Angular 19 (componentes standalone)
- Angular Material (componentes UI)
- GSAP (animaciones)
- ngx-translate (internacionalización — ES/EN/FR)
- SCSS para estilos y theming

Componentes clave
-----------------
- `DesktopIcon`: iconos reutilizables para el escritorio.
- `XpTaskbar`: taskbar inferior con botón Start, selector de idioma y reloj.
- `boot-screen`, `login`, `desktop`: páginas principales del flujo.

Recursos
--------
- Imágenes y fondo en `src/assets/images/` (ej. `background_xp.jpg`, `logo_xp.png`).
- Traducciones en `src/assets/i18n/`.

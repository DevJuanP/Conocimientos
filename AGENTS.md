# AGENTS.md — Conocimientos

Vault personal de conocimiento (Obsidian / VS Code / GitHub / MkDocs). Las reglas de
`00-meta/convenciones.md` mandan; este archivo solo fija el comportamiento por defecto
del agente en este repo.

## Al guardar conocimiento (permiso permanente)

Cuando el usuario pida guardar algo ("agrega/guarda esto en conocimientos"):

1. Lee `00-meta/convenciones.md` y `00-meta/tags.md` antes de escribir.
2. Decide la mejor ubicación sin preguntar: conocimiento duradero va a su carpeta
   (`20-...`, `30-...`, etc.), borrador rápido a `99-inbox/`.
3. Analiza si conviene fragmentar: revisa la conversación que tuvieron (si el usuario
   lo pide) o el tema hablado. Si hay dos temas distintos, o un tema tan extenso que
   se puede separar en dos o hasta tres archivos, hazlo. Muestra la propuesta
   ("Mira, tengo 2 (o 3) archivos .md: ...") con título y ruta propuesta para cada
   uno, y pregunta: "¿Quieres que suba los archivos por separado o quieres subir
   todo como un solo archivo .md a tus conocimientos?". Solo genera el contenido
   final después de su respuesta.
4. Tienes permiso permanente para crear carpetas en raíz y todas las subcarpetas necesarias.
   Crea estructura solo si aporta orden (ej. separar concepto general de uso
   concreto en una herramienta); no sobre-fragmentes ni reorganices lo existente
   sin que te lo pidan.
5. Formato: `kebab-case` sin tildes, frontmatter completo
   (`title`, `area`, `tags`, `created`, `updated`, `related`), enlaces Markdown
   relativos (nunca `[[wikilinks]]` ni rutas absolutas en notas finales), tags solo
   de `tags.md` (máx. 5), sección `## Ver también` al final.
6. Enlaza cada nota nueva en el `_index.md` (MOC) de su carpeta. Sin ese enlace es invisible.
7. Valida con `npm run check-links` y reporta el resultado al usuario.

## Al editar notas

Actualiza `updated` (fecha de hoy) solo si cambia contenido real, no por typos.
No inventes tags: si hace falta uno nuevo, proponlo primero en `00-meta/tags.md`.

# AGENTS.md — Conocimientos

Vault personal de conocimiento (Obsidian / VS Code / GitHub / MkDocs). Las reglas de
`00-meta/convenciones.md` mandan; este archivo solo fija el comportamiento por defecto
del agente en este repo.

## Al responder cualquier pregunta (verificación obligatoria)

Este vault solo guarda conocimiento real y verificable. Esto aplica a toda
respuesta, no solo a las que terminan en una nota.

1. **No inventes.** Si no tienes el dato, dilo. Nunca rellenes huecos con lo que
   "suena plausible": versiones, firmas de API, números, fechas, leyes, precios
   y URLs inventadas son el peor fallo posible aquí.
2. **Busca antes de afirmar.** Librerías, SDKs, CLIs y APIs → `ctx7`
   (`npx ctx7@latest library` y luego `docs`). Actualidad, comparativas,
   precios, noticias o cualquier dato posterior al corte de conocimiento →
   `websearch` / `webfetch`. Si la búsqueda no es concluyente, dilo; no la
   sustituyas por memoria.
3. **Exento de búsqueda:** leer archivos del repo, ejecutar scripts locales,
   aritmética trivial y preguntas sobre esta misma configuración.
4. **Nunca cites una URL que no abriste en esta conversación.** Si `webfetch`
   falla, se reporta el fallo; no se cita igual. Nunca inventes citas textuales:
   parafrasea o entrecomilla solo lo copiado literalmente.
5. **Jerarquía de fuentes:** doc oficial > estándar/RFC/paper > repo oficial >
   secundarias. Si chocan, gana la oficial y menciona la discrepancia con fecha.
6. **Etiqueta la certeza** en la respuesta: `Verificado` (con enlace),
   `Inferido` (razonamiento a partir de X), `No verificado` (sin fuente: no se
   guarda como conocimiento).

### Fuentes en las notas

Toda nota con afirmaciones técnicas externas termina con esta sección, **entre
el cuerpo y `## Ver también`** (si no hay fuentes, la sección se omite):

```markdown
## Fuentes

* [Título de la página](https://url) — consultado: 2026-10-23
* [Nombre del estándar](https://url) — consultado: 2026-10-23
```

Se valida con `npm run check-sources`.

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

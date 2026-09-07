# Conocimientos

Repositorio personal de conocimientos organizado en Markdown portable.
Funciona en **Obsidian** (recomendado), **VS Code**, **GitHub** y **MkDocs** sin cambios.

## Mapa rápido

| Carpeta | Contenido |
|---|---|
| [00-meta](00-meta/convenciones.md) | Reglas, plantillas, glosario y tags. Leer primero. |
| [10-instituto](10-instituto/_index.md) | Cursos del instituto, organizados por **tema**. |
| [20-desarrollo-sistemas](20-desarrollo-sistemas/_index.md) | Programación, arquitectura, DevOps, buenas prácticas. |
| [30-electronica](30-electronica/_index.md) | Componentes, circuitos, proyectos. |
| [40-ciencias](40-ciencias/_index.md) | Evolución y otras ciencias. |
| [90-cursos-extras](90-cursos-extras/_index.md) | Cursos fuera del instituto. |
| [99-inbox](99-inbox/README.md) | Bandeja de entrada. Todo lo nuevo entra aquí. |

## Cómo usar

1. **Crear nota nueva:** crea el archivo en `99-inbox/` con nombre en `kebab-case`. Ej: `99-inbox/2026-09-07-idea-fuente-regulable.md`. Usa una plantilla de `00-meta/plantillas/`.
2. **Procesar:** mueve la nota a su carpeta definitiva (`10-...`, `20-...`, etc.), completa el frontmatter y enlázala desde el `_index.md` de esa carpeta.
3. **Enlazar:** usa enlaces Markdown relativos estándar:
   ```markdown
   [Ley de Kirchhoff](../circuitos/ley-de-kirchhoff.md)
   ```
   No uses `[[wikilinks]]` salvo en borradores del inbox. Ver [convenciones](00-meta/convenciones.md).
4. **Verificar:** ejecuta `python tools/check-links.py` para detectar enlaces rotos y frontmatter incompleto.

## Convenciones en 30 segundos

* Nombres: `kebab-case`, sin tildes ni espacios. Apuntes de clase: `YYYY-MM-DD-tema.md`.
* Cada nota lleva frontmatter (`title`, `area`, `tags`, `created`, `updated`, `related`).
* Cada carpeta tiene un `_index.md` (MOC) que cura los enlaces importantes.
* Tags solo de la lista en [00-meta/tags.md](00-meta/tags.md).

## Herramientas

* **Obsidian:** abre esta carpeta como vault. Ya trae `.obsidian/` configurado para enlaces Markdown relativos.
* **VS Code:** ya trae `.vscode/settings.json` con sugerencias para Markdown.
* **Web (MkDocs):** `pip install -r requirements.txt && mkdocs serve`. Ver `mkdocs.yml`.

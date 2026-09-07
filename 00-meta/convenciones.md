---
title: Convenciones
area: meta
tags: [meta, meta/convencion]
created: 2026-09-07
updated: 2026-09-07
related: ["./tags.md", "./glosario.md"]
---

# Convenciones

Reglas del repo. Si dudas, este archivo manda.

## 1. Nombres de archivos y carpetas

* Todo en minúsculas, `kebab-case`, sin tildes, ñ ni espacios.
  * Bien: `ley-de-ohm.md`, `base-de-datos/`, `seleccion-natural.md`
  * Mal: `Ley de Ohm.md`, `Evolución.md`, `analisis_y_reqs.md`
* Apuntes fechados (clases, labs): `YYYY-MM-DD-tema.md`. Ej: `2026-09-06-clase-transistores.md`.
* Notas concepto: solo tema. Ej: `resistencia.md`, `requerimientos-funcionales-vs-no-funcionales.md`.
* Carpetas temáticas en minúsculas con guiones. Las top-level llevan prefijo numérico (`10-`, `20`...) para orden estable.

## 2. Frontmatter

Toda nota (salvo `_index.md` y `README.md`) lleva este encabezado:

```yaml
---
title: Título legible
area: instituto | desarrollo | electronica | ciencias | cursos-extras | meta
tags: [area, subtema]
created: 2026-09-07
updated: 2026-09-07
related: []
---
```

* `area`: una de las de arriba. Los apuntes del instituto usan `instituto` aunque hablen de electrónica.
* `tags`: solo de [tags.md](tags.md).
* `related`: lista de rutas relativas a notas relacionadas. Ej: `["../circuitos/ley-de-ohm.md"]`.
* Actualiza `updated` cada vez que edites contenido real (no por typos).

## 3. Enlaces entre notas

* Usa **Markdown estándar con ruta relativa**. Es lo único que funciona en Obsidian + VS Code + GitHub + MkDocs a la vez.
  ```markdown
  [Resistencia](../componentes/resistencia.md)
  [Requerimientos funcionales](../../10-instituto/analisis-y-requerimientos/requerimientos-funcionales-vs-no-funcionales.md)
  ```
* No uses `[[wikilinks]]` en notas finales. Solo se toleran en `99-inbox/` como borrador.
* Enlaces a secciones: `[Ley de Ohm](ley-de-ohm.md#definicion)`.
* Cada nota importante debe estar enlazada desde el `_index.md` de su carpeta (MOC). Si no está ahí, es invisible.
* No enlaces a rutas absolutas (`D:\...`) ni a URLs `file://`.

## 4. Estructura de una nota

1. `# Título` (igual que `title` del frontmatter).
2. Intro de 2-3 líneas.
3. Cuerpo con `##` secciones.
4. `## Ver también` al final con lista de enlaces.

Ver plantillas en `plantillas/`.

## 5. Tags

* Formato: `area` o `area/subtema`. Ej: `electronica`, `programacion/python`, `instituto/ciclo-3`.
* Máximo 5 tags por nota. Si necesitas más, la nota es demasiado grande: divídela.
* No inventes tags: proponlo primero en [tags.md](tags.md).

## 6. Workflow inbox

```
99-inbox/ (idea rápida) → carpeta destino → enlazar en _index.md → validar
```

1. Crea en `99-inbox/` sin miedo, con fecha.
2. Al procesar, mueve (no copies) a su carpeta final con nombre definitivo.
3. Agrega frontmatter completo y sección `Ver también`.
4. Agrega enlace en el `_index.md` correspondiente.
5. Corre `npm run check-links`.

## 7. Qué va en cada área

* `10-instituto/`: apuntes, tareas y exámenes por materia. Si un tema sirve fuera del instituto, crea nota general en `20/30/40` y enlázala desde el apunte.
* `20-desarrollo-sistemas/`: conocimiento duradero de software.
* `30-electronica/`: idem electrónica.
* `40-ciencias/`: evolución y ciencias.
* `90-cursos-extras/`: cursos externos (misma lógica que instituto pero con `area: cursos-extras`).
* `00-meta/`: reglas del sistema, no conocimiento.

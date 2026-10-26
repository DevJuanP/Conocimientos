---
title: Dónde viven las historias
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas, devops]
created: 2026-10-25
updated: 2026-10-25
related: ["./flujo-propuesto-equipo.md", "./monorepo-migraciones-y-contratos.md"]
---

# Dónde viven las historias

Decisión pendiente del proyecto. La pregunta es dónde guardar historias, tareas y trabajo pendiente. Aquí están las opciones con criterios de decisión, y una recomendación.

**Restricción ya decidida:** monorepo. Eso descarta de entrada todo lo que separe tracker y código en sistemas distintos.

**Segundo criterio, menos obvio:** el tracker no es documentación. Es una lista de trabajo. Si hay que mantener el tracker al día como obligación de proceso, se abandona en dos semanas. Por eso el criterio real es: **¿cuánto mantenimiento exige y qué ya está gratis?**

## Opción A: GitHub Issues + Projects

**Qué es:** issues en el repositorio, tablero en Projects (vista de tabla o kanban sobre esas issues).

**A favor:**

* El issue ya está en el mismo sitio que el código y el PR. Un PR cierra un issue con una palabra clave.
* El `Requires: #N` de `/backlog` no hay que inventarlo: GitHub tiene **dependencias nativas entre issues** (`blocked by` / `blocking`), y los issues bloqueados se marcan con un icono "Blocked" en el tablero y en la lista. Está disponible en Free, Pro, Team y Enterprise Cloud, y también por CLI (`gh issue create --blocked-by ...`), lo que permite automatizarlo desde el agente.
* Las fronteras de una historia y el mapa del PR viven en el mismo objeto.
* No hay que construir ni mantener nada.

**En contra:**

* Projects es más rígido que un tablero diseñado a medida.
* Ruido: incidencias, PRs e issues conviven.
* Dependes de GitHub en un proyecto académico o personal.

**Cuándo gana:** es el valor por defecto. Si no hay una razón fuerte en contra, esta es la respuesta.

## Opción B: archivos markdown en el monorepo

**Qué es:** un `docs/backlog.md` o un `backlog/` con un archivo por historia.

**A favor:**

* Cero herramientas. Versionado con el código. Se lee en el editor.
* Agentes lo leen sin fricción.
* Portable: no depende de ninguna plataforma.

**En contra:**

* **Se desactualiza en silencio.** Es exactamente lo que le pasó a la carpeta `specs/` del proyecto anterior: el archivo deja de ser la fuente de verdad y se convierte en un archivo más que mantener.
* Estado de un vistazo cuesta trabajo (hay que leer archivos para saber qué está en curso).
* Sin discusión adjunta: los comentarios van en el PR y se separan de la historia.

**Cuándo gana:** proyectos de una persona, o como cuaderno de ideas previo al backlog. **No** como tracker principal de un equipo.

## Opción C: aplicación propia

**Qué es:** construir un tracker a medida.

**A favor:**

* Se adapta exactamente al flujo. Se conoce el código porque se escribió.

**En contra:**

* Es la trampa clásica: **construir la herramienta en lugar del producto**. Consume el mismo tiempo que las historias que ibas a gestionar.
* Un tracker propio también se convierte en código que alguien debe mantener, entender y explicar. Añade un proyecto al coste del proyecto.
* Nadie más lo conoce. Los compañeros nuevos tienen que aprender tu herramienta antes de aprender el sistema.

**Cuándo gana:** casi nunca como primer paso. Es defendible como proyecto de aprendizaje **aparte**, nunca como infraestructura de otro proyecto con fecha.

## Opción D: Jira, Trello, Linear, Notion

**A favor:** tableros maduros, filtros, campos personalizados, informes.

**En contra:** superficie de configuración que se come el tiempo del equipo pequeño; el trabajo real está en otro sitio que el código; para tres programadores es maquinaria pesada.

**Cuándo gana:** si alguien externo (una empresa, un cliente, un profesor con requisitos de gestión) ya lo exige. Si no, no se elige.

## Recomendación

**GitHub Issues + Projects, con dos reglas que evitan el desastre:**

1. **Un issue = una historia.** No issues técnicos, no épicas que viven meses, no sub-tareas. La épica se expresa con `Requires: #N`.
2. **Plantilla de issue que obliga a lo mínimo.** El cuerpo del issue es el bloque que genera `/historia`:

```markdown
## Historia
As a <actor>, I want <action>, so that <benefit>.

## Criterios de aceptación
- [ ] Given <contexto>, when <acción>, then <resultado>.
- [ ] ...

## Plan
- ...

## Fuera de alcance
- ...

## Fronteras
- toca: <módulos>

## Requiere
- #N
```

Así el tracker no es papeleo: **es la entrada que el agente necesita para trabajar**. Escribir el issue es el paso de refinamiento, no un trámite posterior.

### Columnas mínimas

| Columna | Significado |
|---|---|
| Backlog | Existe, no está lista (le faltan criterios o plan) |
| Lista | Tiene criterios, plan, fuera de alcance y fronteras aprobados |
| En curso | Una persona, una rama, WIP = 1 |
| Revisión | PR abierto, mapa escrito, demo pendiente |
| Hecha | En `main`, demo verificada por alguien que no lo escribió |

Cinco columnas. Si se necesitan más, el problema está en el tamaño de las historias.

## Lo que no se debe hacer

* **Dos fuentes de verdad.** Un `backlog.md` **y** issues. Se desincronizan en una semana.
* **Historias que no caben en un issue.** Si el cuerpo necesita scroll, se parte.
* **Estado en la descripción.** El estado va en la columna, no en el texto, o se pudre.
* **Tracker como documentación.** El mapa vive en el PR; el tracker vive el presente.

## Coste real de esta decisión

`Inferido`: al no haber usado todavía el flujo con este equipo, el coste estimado es una tarde de configuración (plantilla de issue, plantilla de PR, tablero con cinco columnas). No hay coste de mantenimiento porque no hay nada que mantener.

## Lo que queda por decidir

* ¿Repositorio público o privado? Issues y Projects están disponibles en repositorios privados del plan Free, pero Projects tiene límites por plan; conviene confirmar el plan actual antes de depender de vistas avanzadas.
* ¿Se usa GitHub Projects o solo la lista de issues? Con tres personas, la lista puede bastar; el tablero se añade cuando haga falta ver el estado de un vistazo.

## Fuentes

* [Creating issue dependencies — GitHub Docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies) — consultado: 2026-10-25
* [About Projects — GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) — consultado: 2026-10-25

## Ver también

* [Flujo propuesto para el equipo](./flujo-propuesto-equipo.md)
* [Monorepo, migraciones y contratos](./monorepo-migraciones-y-contratos.md)

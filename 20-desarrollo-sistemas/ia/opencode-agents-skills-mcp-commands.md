---
title: OpenCode - AGENTS.md vs skill vs agent vs MCP vs command
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas]
created: 2026-09-15
updated: 2026-10-16
related: ["./_index.md", "./opencode-orquestacion-agentes.md"]
---

# OpenCode - AGENTS.md vs skill vs agent vs MCP vs command

Guia de criterio para elegir donde poner una instruccion o capacidad repetitiva en OpenCode: contexto siempre activo, conocimiento bajo demanda, persona con permisos, herramienta externa o atajo manual. Campos y rutas verificados contra OpenCode 2.x.

## Capas

OpenCode funciona por capas: el agente decide, la skill aporta comportamiento reutilizable y el MCP aporta capacidad externa.

* **AGENTS.md:** contexto siempre activo. Se inyecta en cada sesion.
* **Skill:** instruccion reutilizable bajo demanda. El agente la carga solo si aplica.
* **Agente:** persona con system prompt, modelo y permisos propios. No agrega capacidad, controla acceso y comportamiento.
* **MCP:** herramienta externa nueva (API, servicio, busqueda de docs, base de datos).
* **Command:** atajo de prompt que disparas tu con `/nombre`.

## Cuando usar cada uno

### AGENTS.md

Usar cuando la regla aplica a casi toda tarea en ese directorio: comandos de build, lint y test, arquitectura no obvia, convenciones, gotchas operativos.

Caracteristicas:

* Siempre suma tokens, mantener conciso (ideal <30 lineas por tema).
* Hay version por proyecto (`AGENTS.md` en raiz) y global (`~/.config/opencode/AGENTS.md`).
* Si algo es corto y universal, va aca. Por eso para un caso simple repetitivo conviene mas que crear una skill.

### Skill

Usar para flujo repetitivo pero no omnipresente, multi-paso o con conocimiento de dominio: releases, checklist de review, como guardar notas, como hacer commits.

Caracteristicas:

* Vive en `.opencode/skills/<skill-id>/SKILL.md` (proyecto) o `~/.config/opencode/skills/<skill-id>/SKILL.md` (global). V2 tambien descubre `.opencode/skill/`.
* Frontmatter recomendado: `name` (etiqueta de display) y `description`. El ID se deriva de la ruta (kebab-case), no del `name`.
* El agente ve `id + name + description` y la carga con el tool `skill` usando el ID exacto (`{"id": "..."}`). Tambien se puede invocar mencionandola como `@skill-id`.
* Ahorra contexto frente a AGENTS.md, pero exige una buena `description` para que el agente la elija bien.
* Se controla por permisos: accion `skill`, recurso = ID, efecto `allow`/`ask`/`deny` con patrones tipo `internal-*`.
* Rutas y URLs extra se declaran en un unico array `skills` en config (V2 unifica `skills.paths` + `skills.urls`).

### Agente

Usar cuando necesitas distinto rol, distinto modelo o distintos limites: reviewer solo lectura (permiso `edit` denegado), planificador sin edicion, explorador para busquedas paralelas sin ensuciar el contexto principal.

Caracteristicas:

* Se define en `.opencode/agents/<nombre>.md` o bajo `agents` en `opencode.jsonc`.
* Campos tipicos en V2: `description`, `mode` (`primary`, `subagent`, `all`), `model` (`provider/model#variant`), `system`, `permissions`, `steps`, `hidden`, `color`, `disabled`, `request`.
* Los built-in son `build`, `plan` (primarios) y `general`, `explore` (subagentes). Ademas hay agentes ocultos de mantenimiento (`compaction`, `title`, `summary`) que no se seleccionan a mano.
* Un `subagent` corre en sesion hija con contexto limpio, en primer plano o background; el permiso `subagent` del padre decide que agentes puede lanzar.
* Reutiliza skills y MCP existentes, solo cambia quien puede usarlos.

### MCP

Usar solo cuando el LLM necesita hacer algo imposible con herramientas nativas: consultar Sentry, GitHub, Context7 para docs, base de datos, browser.

Caracteristicas:

* Se declara en `opencode.jsonc` bajo `mcp.servers` como `local` (command) o `remote` (url).
* En V2 la clave `enabled` pasa a `disabled` (inverso) y `timeout` es un objeto con `catalog` y `execution`.
* Cada servidor suma definiciones de tools al contexto. Con muchos MCP se agota el contexto rapido.
* Recomendacion: desactivar globalmente (`disabled: true`) y activar solo en el agente que lo necesita.

### Command

Usar para tareas que tu disparas siempre igual con `/x`: `/test`, `/review-changes`, `/nueva-nota`.

Caracteristicas:

* Vive en `.opencode/commands/<nombre>.md`. El nombre del archivo es el comando.
* Frontmatter: `description`, `agent`, `model`, `subtask`. El contenido es el `template` del prompt.
* Soporta `$ARGUMENTS` / `$1 $2`, salida de shell con `` !`comando` `` y archivos con `@ruta`.
* Con `subagent: true` corre en una sesion hija en background y no ensucia tu contexto (`subtask` es alias deprecado en V2).
* Puede invocar una skill en su template (ej: `usa la skill git-release`).

## Arbol de decision

1. ¿Necesita llamar API o servicio externo? Si -> `MCP`.
2. ¿Necesita rol, modelo o permisos distintos, o aislar contexto? Si -> `agente` nuevo.
3. ¿La instruccion vale para mas del 80% de los prompts? Si -> `AGENTS.md`.
4. ¿Es procedimiento especializado, ocasional y reutilizable? Si -> `skill`.
5. ¿Lo disparas tu siempre igual con `/x`? Si -> `command`.

Regla practica: empezar en `AGENTS.md`. Si crece, es ocasional o se quiere reusar global, extraer a `skill`. Si hay que prohibir herramientas, envolver en `agente`. Si faltan datos o acciones externas, agregar `MCP`.

## Skill vs command (confusion comun)

No son lo mismo aunque se parezcan. La invocacion es opuesta:

* `/ship` con slash busca un `command` llamado `ship`. Si no existe `.opencode/commands/ship.md`, no existe el slash.
* `ship` sin slash es la `skill` cuya `description` dice `Use when user says ship...`. Tu dices `ship` o `sube los cambios` en lenguaje natural y el agente decide llamar `skill({name: "ship"})`.

Para verificar: teclear `/` en el TUI solo lista `commands`. Decir `ship` sin `/` hace que el agente cargue la skill sola. Patron util: crear `ship.md` como command cuyo template sea `usa la skill ship` para tener ambas vias.

## Antipatrones

* Meter todo en `AGENTS.md`: infla contexto y diluye instrucciones.
* Crear skill para un one-liner universal: sobrecarga de descubrimiento innecesaria.
* Crear MCP cuando basta un prompt en una skill.
* Crear agente nuevo cuando solo cambia el texto del prompt: alcanza con skill o command.

## Ver también

* [IA (MOC)](_index.md)
* [Itsfree.ai - APIs de IA gratis](itsfree-ai-apis-gratis.md)
* [v0 de Vercel - guia de uso](v0-vercel.md)
* [Herramientas](../herramientas/_index.md)

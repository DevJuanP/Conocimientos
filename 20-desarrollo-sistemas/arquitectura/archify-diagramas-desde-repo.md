---
title: Archify - diagramas desde repo
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-09
updated: 2026-09-09
related: []
---

# Archify - diagramas desde repo

Skill open-source de IA que convierte un repositorio o una descripción en lenguaje natural en un mapa técnico interactivo, con diagramas de arquitectura, flujos, secuencias y estados.

Origen de la nota: `Notas a procesar/Nota 001.md` - "sirve para generar diagramas a partir de un repo, con flujos, etc, lo vi en Midu en tiktok".

## Qué es

* Proyecto: `tt-a1i/archify`, licencia MIT.
* No es una app web, es un **Agent Skill** para Cursor, Claude Code, Codex CLI, OpenCode y Raven.
* Fork y rewrite de `Cocoon-AI/architecture-diagram-generator` v1.0.
* Salida: un **HTML autocontenido** (sin dependencias, sin servidor) que se abre en cualquier navegador, con tema dark/light, y exportable a PNG, JPEG, WebP, SVG y WebM.

## Qué tipos de diagramas genera

* **Architecture:** componentes, servicios, DB, cache, boundaries, infra AWS/GCP/Azure.
* **Workflow:** procesos, CI/CD, aprobaciones, runbooks, tool calls.
* **Sequence:** llamadas API, ciclo de request, cache-miss, auth, trazas async.
* **Data Flow:** pipelines, ETL/ELT, linaje, PII, consumidores.
* **Lifecycle:** máquinas de estado, retries, esperas, cancelaciones, estados terminales.

## Cómo funciona

No deja que la IA dibuje libremente, para evitar alucinar componentes:

1. **Generate:** el agente analiza el repo y genera un JSON tipado IR (Intermediate Representation) con entidades, relaciones y rutas.
2. **Validate:** Archify valida ese JSON contra schemas estrictos con `node bin/archify.mjs validate`. Si falla, no dibuja.
3. **Deliver:** solo si pasa, compila deterministicamente a HTML + SVG.
4. **Iterate:** se refina por chat: "add Redis", "muestra solo el auth path".

Funciones útiles:

* **Repo Evidence:** badge `SRC` en nodos que salta al archivo, commit y líneas exactas que prueban el componente.
* **Trace reach:** ver upstream/downstream y rutas exactas de un nodo.
* **Guided stories:** recorridos guiados por un path principal.
* **Architecture Delta:** compara dos snapshots validados como Before / Delta / After para review de PRs.
* **Deep links, búsqueda semántica y semantic camera.**

## Cómo se usa

1. Instalar el skill global:

```bash
npx skills add tt-a1i/archify -g
```

2. Pedir al agente con alcance acotado (8-12 nodos, un path principal):

```text
Use archify to map this repository's runtime architecture.
Scope:
- entry points and long-running processes
- API, worker, database, cache and external services
- one primary request path
- authentication and trust boundaries
Constraints:
- 8-12 main nodes
- do not infer services not present in source
- put secondary detail in cards
```

## Limitaciones

* Requiere un flujo con agente IA, no es standalone.
* Si el prompt es vago ("mapea este repo") genera demasiados nodos y bordes confusos. Hay que acotar.
* GitHub no renderiza el HTML interactivo en el README, para docs hay que exportar PNG/SVG.
* No reemplaza revisión de código, config de deploy ni logs.

## Ver también

* [Desarrollo de sistemas](../_index.md)
* Repo: https://github.com/tt-a1i/archify
* Demo: https://tt-a1i.github.io/archify/

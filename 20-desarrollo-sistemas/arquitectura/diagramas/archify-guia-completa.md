---
title: Archify - guia completa
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-17
updated: 2026-09-17
related: ["./archify-diagramas-desde-repo.md", "../_index.md"]
---

# Archify - guia completa

Skill de IA (`tt-a1i/archify`, MIT, v2.17) que genera diagramas tecnicos como HTML autocontenido explorable: SVG inline, temas dark/light, pan/zoom, busqueda, trazado de relaciones y exportacion a PNG/JPEG/WebP/SVG/WebM. No requiere instalacion; solo `node >=18`.

## Como funciona

Flujo determinista en 4 pasos (no dibujo libre, para no alucinar componentes):

1. **Especificacion JSON tipada:** describes nodos, relaciones y semantica, no coordenadas a mano.
2. **Validacion:** `node bin/archify.mjs validate <tipo> <candidato.json> --quality showcase --json`. Showcase exige 9 checks con 0 errores y 0 warnings (4 checks es solo validacion basica).
3. **Entrega:** `node bin/archify.mjs deliver <tipo> <candidato.json> <salida.html> --quality showcase --json`. Congela el JSON en un snapshot, renderiza y reporta SHA-256 + bytes de spec y artefacto. Un exit distinto de cero nunca es exito.
4. **Evidencia en navegador:** `node bin/archify.mjs visual-check <salida.html> --json`. No modifica el HTML; mide el artefacto real en desktop (`1440x900`, `1600x1000`, `1920x1080`).

Capacidades del viewer ya incluidas sin trabajo extra: cambio de tema, pan/zoom, Node Finder, Semantic Lens, pasaporte semantico con deep-link copiable, Route Probe sobre relaciones dirigidas, vistas guiadas (`meta.views`, max. 5 capitulos), Presentation Stage y exports canonicos. Animacion `trace` solo si se pide (`meta.animation: "trace"`).

## Que diagramas crea

| Tipo | Usalo para |
|---|---|
| `architecture` | Componentes, servicios, cloud/seguridad, infraestructura |
| `workflow` | Procesos, aprobaciones, tool calls, runbooks, CI/CD |
| `sequence` | Cadenas de llamadas API, request lifecycle, trazas async, returns |
| `dataflow` | Pipelines, ETL/ELT, linaje, gobernanza, consumidores |
| `lifecycle` | Maquinas de estado, reintentos, esperas y estados terminales |

Acepta requisitos en lenguaje natural o Mermaid pegado: `flowchart/graph` -> `workflow` o `architecture`; `sequenceDiagram` -> `sequence`; `stateDiagram` -> `lifecycle`. El Mermaid se relee por topologia y significado, no se copia su estilo.

## Cuando usarlo y cuando no

Usalo para visualizar arquitectura, infra, topologia cloud/seguridad/red, workflows tecnicos, secuencias API, pipelines de datos o maquinas de estado; para convertir o embellecer un Mermaid; o cuando necesites un artefacto presentable y compartible sin dependencias.

No lo uses cuando quieras editar Mermaid/PlantUML/draw.io a mano; para mapas densos de mas de 12 nodos primarios sin simplificar (parte de un camino principal obvio, ramas cortas y etiquetas escasas; perfil `standard` solo si pides densidad explicita); para variantes por dispositivo movil (genera un artefacto responsive de escritorio); ni esperes motion/demo por defecto (hay que pedirla).

## Guia de uso paso a paso

1. Elige tipo (`architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`). Si es ambiguo: `node bin/archify.mjs guide "<escenario>" --json`.
2. Autoria del candidato JSON: IDs estables nuevos, un camino principal, max. 12 nodos primarios, `meta.quality_profile: "showcase"`, rutas automaticas. No anadas `via`, `channelX`, `channelY` ni `labelAt` antes de que un diagnostico lo pida (max. un control geometrico por reparacion). Workflows nuevos usan `schema_version: 2`.
3. Valida tras cada edicion y antes de entregar (ver comando arriba). En workflow v2, para diagnostico fino: `node bin/archify.mjs validate workflow <f>.json --layout-json`.
4. Entrega una sola vez con `deliver`. Tras un `deliver` fallido no ejecutes `visual-check` (inspeccionaria el HTML viejo, no el candidato).
5. Recoge evidencia con `visual-check` y reporta por separado: `deliver` prueba artefacto determinista, `visual-check` prueba comportamiento en navegador real, y el pulido perceptual requiere revision humana.

Comandos utiles:

```bash
node bin/archify.mjs doctor
node bin/archify.mjs demo <dir-salida>
node bin/archify.mjs examples
node bin/archify.mjs inspect <tipo> <in.json>
node bin/archify.mjs check <out.html>
node bin/archify.mjs preview <tipo> <in.json> <out.html> --quality showcase
node bin/archify.mjs migrate workflow <old.json> <new.json> --to-schema 2 --json
node bin/archify.mjs brands "<Postgres|Redis|AWS...>" --json
```

## Estructura minima por tipo

Comun: `meta.title`, `meta.quality_profile: "showcase"`, `meta.views[]` (max. 5, con `id,label,focus[],note?`), `cards[]` (`dot,title,items[]`). Tipos de componente: `frontend,backend,database,cloud,security,messagebus,external`. Variantes: `default,emphasis,security,dashed`.

Architecture (`schemas/architecture.schema.json`, ejemplo `examples/web-app.architecture.json`): `components[]` con `id,type,label,pos,size`, `boundaries[]` (`kind,label,wraps[]`), `connections[]` (`id,from,to,label?,variant?`).

```json
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": {"title": "Sample Web App", "quality_profile": "showcase"},
  "components": [
    {"id": "api", "type": "backend", "label": "API Server", "sublabel": "FastAPI :8000", "pos": [670, 300], "size": [130, 60]}
  ],
  "boundaries": [{"kind": "region", "label": "AWS Region", "wraps": ["api"]}],
  "connections": [{"id": "lb-to-api", "from": "lb", "to": "api", "label": "HTTPS"}]
}
```

Workflow v2 (`examples/agent-tool-call.workflow.json`): `lanes[]`, `phases[]` (col `0..5`), `mainPath[]`, `nodes[]` (`lane,col,type,label,width`), `edges[]`.

```json
{
  "schema_version": 2,
  "diagram_type": "workflow",
  "meta": {"title": "Mi flujo", "quality_profile": "showcase"},
  "lanes": [{"id": "ui", "label": "User Interface"}],
  "phases": [{"id": "intake", "label": "Intake", "fromCol": 0, "toCol": 1}],
  "mainPath": ["user", "chat", "final"],
  "nodes": [{"id": "user", "lane": "ui", "col": 0, "type": "external", "label": "User", "width": 132}],
  "edges": [{"id": "a-b", "from": "user", "to": "chat"}]
}
```

Sequence (`examples/cache-miss-request.sequence.json`): `participants[]`, `messages[]` con `y` ordenada, `activations[]`, `segments[]`. Usa `variant: return/dashed/security` con significado. `column_fit: spread` solo si el viewBox ancho queda vacio.

Dataflow (`examples/product-analytics.dataflow.json`): `stages[]`, `nodes[]` con `stage,row`, `flows[]` con `label` de contrato de datos y `classification`.

Lifecycle (`examples/agent-run.lifecycle.json`): fases main en `col 0..4`, bandas waiting/terminal en `col 0..2` (columna `N` alineada bajo `N+2`). Fallo recuperable = `type: failure` + transicion real de vuelta a activo.

## Personalizacion

* Animacion/presentacion: `meta.animation: "trace"` (por defecto estatico).
* Estilo: omite `meta.visual_preset` (= `classic`); solo `signal-flow`, `blueprint` o `editorial` si se pide.
* Subtitulo: omitelo salvo peticion explicita; nunca repitas titulo/nodos/cards.
* Leyenda: omitela (= `auto`); solo `mode: auto|all|hidden`.
* Marca real: `brand` con ID canonico; si no existe y hay URL oficial, `brands capture <url> --json` con pin digest.
* Idioma: contenido en el idioma dominante de la conversacion; `meta.locale` solo `en`/`zh-CN` para la UI del viewer (en espanol se omite y la UI fija queda en ingles, avisandolo). Nombres de producto, identificadores, comandos, protocolos y rutas API se preservan intactos.

## Reparacion de errores

Orden: `quality_profile` -> overlap/fuera de rango -> edge-through-node/direccion -> cruces/corredores/bordes/ritmo -> labels. Corre solo el `subject` diagnosticado con sus `supportedFixes`, un control por vez, y revalida. Si dos rondas no bajan el conteo de errores, para e informa. Una validacion final en verde congela el candidato: no lo edites despues.

## Ver también

* [Archify - diagramas desde repo](archify-diagramas-desde-repo.md)
* [Desarrollo de sistemas](../_index.md)

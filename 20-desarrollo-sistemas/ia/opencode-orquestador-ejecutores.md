---
title: OpenCode - Orquestador y ejecutores con contexto limpio
area: desarrollo
tags: [desarrollo, desarrollo/ia, arquitectura]
created: 2026-10-17
updated: 2026-10-17
related: ["./opencode-orquestacion-agentes.md", "./contrato-de-ejecucion-para-agentes.md", "./opencode-go-suscripcion-10-usd.md"]
---

# OpenCode - Orquestador y ejecutores con contexto limpio

Patrón para ejecutar planes largos con OpenCode sin que los agentes ejecutores se inflen hasta
el límite de contexto (~200K) leyendo archivos crudos. Un orquestador divide el plan en **shards**
y cada shard corre en una **sesión hija con contexto limpio**; el traspaso entre shards va por
archivo, no por contexto. En el proyecto destino la implementación es un solo archivo:
`opencode.jsonc` (más `PLAN.md` y `PROGRESS.md`, que son datos de trabajo, no configuración).

## El problema

En un agente de coding la caché es el 80-90% del costo, y un ejecutor que lee muchos archivos
crudos llega a ~200K en pocos turnos. Además, un plan largo ejecutado en una sola sesión arrastra
contexto sucio de una tarea a la siguiente.

**Contexto limpio equivale a sesión nueva.** La compactación (`/compact`) *no* limpia: reemplaza la
conversación vieja por un resumen y lo arrastra hacia adelante, y el resumen se degrada con cada
compactación sucesiva. Para trabajo divisible en partes independientes, la sesión nueva gana en
todo: es limpia, es determinista y no depende de que el modelo se acuerde de una instrucción.

## Arquitectura

```text
PLAN.md  (input)
   │
   ▼
orquestador (primary, modelo barato, sin permiso de leer codigo)
   │  divide en shards S1..Sn
   │
   ├─► subagente explore   ──► devuelve resumen corto (mapeo, sin editar)
   │
   ├─► ejecutor(S1)  ──► sesion nueva, contexto limpio ──► edita codigo ──► escribe PROGRESS.md ──► muere
   ├─► ejecutor(S2)  ──► sesion nueva, contexto limpio ──► ...
   └─► ejecutor(Sn)  ──► ...
                         │
                         ▼
                    PROGRESS.md  (handoff entre shards)
```

Reglas estructurales:

1. **Un shard = una sesión de subagente.** Nunca un shard dentro de la sesión del orquestador.
2. **El handoff va por archivo** (`PROGRESS.md`): interfaces, decisiones, hechos. Así el shard N
   hereda 40 líneas, no 200K de historia.
3. **Las lecturas masivas van dentro de `execute` (Code Mode)**, que devuelve solo el resultado
   procesado al contexto del modelo en vez de cada valor intermedio.
4. **Nunca le pidas al modelo que ejecute `/compact`**: es un comando de la TUI, no una
   herramienta. No existe un tool `compact` en el catálogo, así que el modelo no puede invocarlo.
5. **`steps` cierra cada shard**: al agotarse, OpenCode quita las tools y pide un resumen en texto,
   que es el entregable natural del shard.
6. **`compaction.auto` queda encendido** como red de seguridad, no como mecanismo principal.

## Configuracion: `opencode.jsonc`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // ---- Modelo por defecto: barato y de cache economica (no uno con tramo >100K caro)
  "model": "opencode/deepseek-v4.1-flash-free",
  "default_agent": "orquestador",

  // ---- Red de seguridad: compacta ~buffer tokens antes del limite del modelo
  "compaction": {
    "auto": true,
    "keep": { "tokens": 15000 },
    "buffer": 40000 // subilo si tu prompt fijo (AGENTS.md + tools + referencias) es grande
  },

  // ---- Declarar limites explicitos del modelo (200000/32000 son los fallbacks de OpenCode)
  "providers": {
    "opencode": {
      "models": {
        "deepseek-v4.1-flash-free": {
          "limit": { "context": 200000, "output": 32000 }
        }
      }
    }
  },

  "agents": {
    // ---------------- ORQUESTADOR ----------------
    "orquestador": {
      "description": "Divide PLAN.md en shards y delega cada uno a un ejecutor",
      "mode": "primary",
      "model": "opencode/deepseek-v4.1-flash-free",
      "steps": 30,
      "system": "Sos un orquestador. NO lees ni editas codigo.\n\nProtocolo:\n1. Lee PLAN.md y PROGRESS.md.\n2. Divide el trabajo en shards de una sola responsabilidad, cada uno independiente.\n3. Si necesitas ubicar archivos, delega a 'explore' y quedate solo con el resumen.\n4. Por cada shard lanza UN subagente 'ejecutor' con un brief corto: ID del shard, objetivo,\n   archivos permitidos, criterio de terminado, y que debe escribir en PROGRESS.md.\n5. Un shard por llamada. No mandes dos shards al mismo ejecutor.\n6. Al cerrar cada shard, actualiza PROGRESS.md con estado y decisiones.\n\nNunca le pidas a un ejecutor que ejecute /compact: no existe como herramienta.\nSi un shard es demasiado grande, partilo en dos sesiones nuevas en lugar de pedir compactacion.",
      "permissions": [
        { "action": "*", "resource": "*", "effect": "deny" },
        { "action": "glob", "resource": "*", "effect": "allow" },
        { "action": "read", "resource": "PLAN.md", "effect": "allow" },
        { "action": "read", "resource": "PROGRESS.md", "effect": "allow" },
        { "action": "edit", "resource": "PLAN.md", "effect": "allow" },
        { "action": "edit", "resource": "PROGRESS.md", "effect": "allow" },
        { "action": "subagent", "resource": "explore", "effect": "allow" },
        { "action": "subagent", "resource": "ejecutor", "effect": "allow" }
      ]
    },

    // ---------------- EJECUTOR ----------------
    "ejecutor": {
      "description": "Ejecuta UN shard del plan, edita solo lo permitido y reporta en PROGRESS.md",
      "mode": "subagent",
      "model": "opencode/deepseek-v4.1-flash-free",
      "steps": 15,
      "system": "Ejecutas un solo shard. Reglas:\n- Lee PROGRESS.md antes de empezar (ahi esta el handoff de los shards anteriores).\n- Para leer muchos archivos de una, usa 'execute' (Code Mode) y devolve solo lo relevante.\n- No explores el repo por curiosidad: lee unicamente lo que el shard necesita.\n- Si el shard no se puede terminar, deja el estado parcial y decilo en PROGRESS.md.\n- Al terminar, actualiza PROGRESS.md: estado, archivos tocados, decisiones, interfaces, siguiente paso.\n- Cerra con un resumen en texto de maximo 10 lineas.",
      "permissions": [
        { "action": "external_directory", "resource": "*", "effect": "deny" },
        { "action": "read", "resource": "*", "effect": "deny" },
        { "action": "read", "resource": "PROGRESS.md", "effect": "allow" },
        { "action": "read", "resource": "src/**", "effect": "allow" },
        { "action": "read", "resource": "tests/**", "effect": "allow" },
        { "action": "edit", "resource": "src/**", "effect": "allow" },
        { "action": "edit", "resource": "tests/**", "effect": "allow" },
        { "action": "edit", "resource": "PROGRESS.md", "effect": "allow" },
        { "action": "webfetch", "resource": "*", "effect": "deny" },
        { "action": "websearch", "resource": "*", "effect": "deny" },
        { "action": "subagent", "resource": "*", "effect": "deny" }
      ]
    }
  }
}
```

Notas de configuración:

* **Ajustar los globs de `read`/`edit`** (`src/**`, `tests/**`) a la estructura real del repo.
  El `deny` amplio va **primero** y las excepciones después: en permisos **gana la última regla
  que matchea**.
* `shell` queda sin regla a propósito: los ejecutores necesitan correr tests. Para restringirlo,
  agregar reglas `shell` (el recurso es el texto del comando).
* `explore` es un **subagente incorporado** de OpenCode (lee y busca sin editar), por eso no se
  define acá; el orquestador solo tiene permiso para lanzarlo.
* **El campo `request` por agente todavía no se envía** en OpenCode V2. Los caps de output van en
  `providers.<id>.models.<id>` o en una variante, nunca en el agente.
* `limit.context` y `buffer` son ejemplos: 200000 y 32000 son los valores de *fallback* que
  OpenCode asume para modelos no declarados. Verificar el límite real en el catálogo y declararlo.
* **Elegir el modelo mirando la caché, no el input/output.** Con contexto mayor a 100K conviene
  descartar modelos de caché cara (Haiku 5.5 por encima de 100K, Grok 4.7, Kimi K3, GLM-5.2).

## Plantillas de handoff

### `PLAN.md` (input del orquestador)

```md
# Plan: <objetivo general>

## Restricciones
- Stack: <...>
- No tocar: <...>
- Criterio global de terminado: <...>

## S1 — <titulo>
- Objetivo: <una sola cosa>
- Archivos: src/..., tests/...
- Terminado cuando: <criterio verificable>
- Depende de: —

## S2 — <titulo>
- Objetivo: <una sola cosa>
- Archivos: src/..., tests/...
- Terminado cuando: <criterio verificable>
- Depende de: S1
```

### `PROGRESS.md` (handoff compartido)

```md
# Progreso

## Estado
| Shard | Estado      | Notas |
| ----- | ----------- | ----- |
| S1    | hecho       | ...   |
| S2    | en curso    | ...   |
| S3    | pendiente   | ...   |

## Contratos / interfaces fijados
- `<funcion>`: recibe `<...>`, devuelve `<...>`  ← cualquier shard posterior debe respetar esto.

## Decisiones
- <decision> — motivo — shard que la tomo

## Pendientes / bloqueos
- <...>

## Ultimo paso
- <que haria el proximo shard>
```

`PROGRESS.md` es lo que reemplaza al contexto: si algo importa para el shard siguiente y no está
ahí, se pierde.

## Variante determinista (sin depender del juicio del modelo)

Si se prefiere que el corte entre shards no dependa de que el agente se acuerde, no conviene usar
un orquestador-agente: cada shard se corre desde un script. Cada `opencode run` es un proceso y una
sesión nuevos, así que el contexto limpio queda garantizado.

```bash
#!/usr/bin/env bash
# run-shards.sh — ejecuta cada shard de PLAN.md en una sesion nueva
set -euo pipefail

MODEL="opencode/deepseek-v4.1-flash-free"

for shard in $(grep -oE '^## S[0-9]+' PLAN.md | awk '{print $2}'); do
  echo "== Ejecutando $shard =="
  opencode run --model "$MODEL" \
    "Ejecuta el shard $shard de PLAN.md. Lee PROGRESS.md primero. Hace solo ese shard y al terminar actualiza PROGRESS.md (estado, archivos, decisiones, siguiente paso)."
done
```

Para compactar explícitamente **entre** shards, hacerlo desde el runner con la API, nunca
pidiéndoselo al modelo:

```bash
opencode api post /api/session/<sessionID>/compact --data '{}'
```

## Verificacion

1. Después de cada shard, revisar **`PROGRESS.md`**: si el handoff está incompleto, el shard
   siguiente va a reexplorar y el ahorro desaparece.
2. Mirar el **consumo real** (tokens de input, caché y output por sesión). El objetivo es que la
   caché por shard se mantenga acotada y no crezca de shard a shard.
3. Observar los eventos **`session.compaction.*`**: si la compactación se dispara en cada shard,
   el `buffer` está chico o los shards son demasiado grandes.
4. Si un ejecutor llega igual al límite, la causa casi siempre es **lectura cruda de archivos**:
   mover esas lecturas a `execute` y estrechar los globs de `read`.

## Reglas de oro y limites

1. Un shard = una sesión nueva.
2. El traspaso va por archivo, no por contexto.
3. Nunca pedirle al modelo que corra `/compact`: no es un tool.
4. Lecturas masivas dentro de `execute` (Code Mode).
5. Permisos estrechos: `deny read:*` y excepciones por carpeta.
6. `steps` para cerrar shards.
7. Dejar `compaction.auto` encendido como red de seguridad.

Limites y advertencias:

* **Los modelos `-free` son "limited time".** No construir algo crítico sobre su permanencia y
  dejar el ID del modelo en un solo lugar para poder cambiarlo.
* **La compactación no crea espacio** si el prompt fijo ya llena la ventana. Ejemplo de la doc:
  `128k = 120k instrucciones + 8k conversación` → no ayuda.
* **El orquestador también acumula**: cada subagente devuelve su resultado al padre. Mantener los
  reportes cortos y que el orquestador use un modelo barato.
* **No hay tool de compactación** en el catálogo. Si se quiere disparada por el modelo, hace falta
  un plugin que exponga el tool.
* **Fragmentar de más cuesta**: cada sesión nueva recalienta caché y reexplora. Con un modelo free
  es solo latencia; con un modelo pagado puede salir más caro que una sesión larga.
* **Cuándo no usar esto**: si la tarea es monolítica y necesita continuidad, una sola sesión con
  compactación es mejor que fragmentar.

## Como llevarlo a otro proyecto

Implementación en el proyecto destino:

1. Crear `opencode.jsonc` con el bloque de arriba.
2. Crear `PLAN.md` con shards realmente independientes (si dos shards comparten estado mutable,
   van en el mismo shard) y `PROGRESS.md` vacío con la plantilla.
3. Ajustar el modelo, los globs de `read`/`edit` y el `buffer` a ese proyecto.
4. Verificar el límite real de contexto y output del modelo y declararlo en `limit`.
5. Correr **un** shard, revisar tokens y `PROGRESS.md`, y recién ahí largar el plan completo.

Checklist de adaptación:

- [ ] Cambiar `model` y el modelo de cada agente por los del proveedor conectado en ese proyecto.
- [ ] Ajustar los globs a la estructura real (`src/**`, `app/**`, `packages/**/*`).
- [ ] Declarar `limit.context` y `limit.output` según el catálogo real del modelo.
- [ ] Ajustar `compaction.buffer` al tamaño del prompt fijo del proyecto.
- [ ] Escribir `PLAN.md` con shards independientes y crear `PROGRESS.md`.

Prompt sugerido para la IA del otro proyecto:

```text
Implementa este patron en el proyecto: crea el opencode.jsonc exactamente como esta en la seccion
"Configuracion", ajustando el modelo y los globs de read/edit a la estructura de este repo.
Despues crea PLAN.md y PROGRESS.md con las plantillas. No cambies nada mas.
```

## Ver también

* [OpenCode - Orquestación de agentes e IA](./opencode-orquestacion-agentes.md)
* [Contrato de ejecución para agentes](./contrato-de-ejecucion-para-agentes.md)
* [OpenCode Go - suscripción 10 USD vs Zen saldo](./opencode-go-suscripcion-10-usd.md)
* [IA (MOC)](./_index.md)

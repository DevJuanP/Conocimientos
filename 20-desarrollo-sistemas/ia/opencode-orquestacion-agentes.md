---
title: Guía de Orquestación de Agentes e IA con OpenCode
area: desarrollo
tags: [desarrollo, desarrollo/ia, arquitectura]
created: 2026-10-05
updated: 2026-10-17
related: ["./opencode-agents-skills-mcp-commands.md", "./contrato-de-ejecucion-para-agentes.md", "./_index.md"]
---

# Guía de Orquestación de Agentes e IA con OpenCode

Cómo una IA orquestadora (supervisor) invoca, delega y ejecuta tareas en subagentes de forma automática y programática, emulando el trabajo de un desarrollador en la terminal. Contenido verificado contra OpenCode **2.x** (`opencode v2.0.21`).

## Modo interactivo vs. modo programático

Cuando un usuario interactúa manualmente con OpenCode lo hace mediante la interfaz interactiva (TUI o chat de la terminal). Cuando una IA orquestadora invoca a otro agente, no abre pestañas visuales ni escribe en cuadros de texto; utiliza el modo programático (headless) o llamadas a herramientas (tool calling).

| Característica | Modo interactivo (humano) | Modo programático / headless (IA) |
| :--- | :--- | :--- |
| Entrada | Teclado, prompt en tiempo real | Argumentos CLI, archivos de contexto, JSON |
| Interfaz | Ventana interactiva, TUI con colores | Ejecución silenciosa en segundo plano |
| Apertura de subagentes | Abrir pestañas o cambiar de modelo manualmente | Ejecución de comandos de consola o tool calls |
| Salida | Respuesta progresiva en pantalla | Archivos modificados + código de salida / JSON (`--format json`) |

## Método A: ejecución directa mediante CLI (modo headless)

`opencode run` envía un prompt sin abrir la TUI. En V2 es no interactivo por diseño: el mensaje va como **argumento posicional**. El flag `--prompt` sigue existiendo para pre-rellenar prompts en la TUI, y `--auto` permite auto-aprobar permisos en modo desatendido (no existe `--non-interactive`).

Comando de ejemplo que ejecuta la IA orquestadora:

```bash
opencode run \
  --model anthropic/claude-3-5-haiku \
  --agent db-agent \
  --format json \
  "Lee ./specs/03-database-migrations.md e impleméntalo en ./prisma/schema.prisma"
```

Flags relevantes para orquestar (según `opencode run --help` en V2):

| Flag | Para qué sirve |
| :--- | :--- |
| `--agent <id>` | Ejecuta con un agente o subagente concreto. |
| `--model provider/model#variant` | Modelo y variante (`#variant` reemplaza al viejo `effort`). |
| `--format json` | Salida estructurada para que el orquestador la parsee. |
| `--auto` | Auto-aprueba permisos no denegados explícitamente (headless desatendido). |
| `--standalone` / `--server <url>` | Servidor privado o remoto en vez del servicio compartido de fondo. |
| `--file`, `--session/-s`, `--continue/-c`, `--fork` | Adjuntar archivos y gestionar sesiones. |

Flujo de ejecución interno:

1. El orquestador envía el comando a la terminal del sistema.
2. La terminal inicia un proceso en segundo plano (invisible para el usuario).
3. La nueva instancia de OpenCode lee la especificación asignada y ejecuta el modelo/agente especificado.
4. Al finalizar los cambios, el proceso termina devolviendo el resultado en texto o JSON y un código de salida al orquestador principal.

## Método B: subagentes e invocación de herramientas (tool calling)

En configuraciones avanzadas, los subagentes no se abren mediante comandos de terminal, sino mediante definiciones que se exponen como herramientas al orquestador. En V2 los agentes se declaran bajo la clave **`agents`** (plural) y **no existe `effort`**: la variante se pega al modelo con `#`.

### 1. Definición de subagentes

Ubicación preferida para un archivo por agente: `.opencode/agents/<nombre>.md` y `~/.config/opencode/agents/<nombre>.md`. El **cuerpo del documento Markdown** sirve como system prompt del agente; no uses un campo `system` en el frontmatter (eso solo aplica a JSON). También puede declararse en JSON:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agents": {
    "db-agent": {
      "model": "anthropic/claude-3-5-haiku",
      "description": "Especialista en migraciones SQL, esquemas de BD y ORM."
    },
    "backend-agent": {
      "model": "anthropic/claude-3-5-sonnet#high",
      "description": "Especialista en arquitectura, controladores REST y reglas de negocio."
    },
    "frontend-agent": {
      "model": "anthropic/claude-3-5-haiku#medium",
      "description": "Especialista en componentes de UI y consumo de APIs."
    }
  }
}
```

Renombres de campos V2 respecto de V1: `prompt`→`system`, `disable`→`disabled`, `permission`→`permissions` (array ordenado), `maxSteps`→`steps`, y `temperature`/`top_p`/`options`→`request.body`. El `mode` sigue siendo `primary`, `subagent` o `all` (un agente custom nuevo por defecto es `primary`).

### 2. Evento interno de delegación (tool call)

En V2 la herramienta de delegación se llama **`subagent`** (en V1 era `task`). El orquestador la invoca indicando el id del agente y la instrucción; OpenCode abre una **sesión hija con contexto limpio** y le devuelve el resultado.

```json
{
  "tool": "subagent",
  "agent": "db-agent",
  "instruction": "Ejecuta las especificaciones de specs/01-db.md"
}
```

Los subagentes corren en primer plano o en background y siempre con contexto propio. El permiso `subagent` del **padre** controla qué agentes puede lanzar; el **hijo** usa sus propios permisos.

```jsonc
{
  "agents": {
    "orchestrator": {
      "permissions": [
        { "action": "subagent", "resource": "*", "effect": "deny" },
        { "action": "subagent", "resource": "db-agent", "effect": "allow" }
      ]
    }
  }
}
```

### 3. Delegación en background mediante comandos

Puedes delegar trabajo a un subagente definiendo un command con `agent` y `mode: subagent`. El subagente corre en una **sesión hija con contexto propio**; el padre permanece disponible y recibe el resultado del hijo al terminar. Consulta `opencode agent create --help` para las opciones disponibles; el comportamiento exacto de delegation en commands puede variar entre versiones de V2.

```md title=".opencode/commands/audit.md"
---
description: Auditoría de migraciones
agent: db-agent
subagent: true
---

Audita $ARGUMENTS y reporta los riesgos por severidad.
```

## Orquestación vía API / SDK

Para orquestar fuera del CLI, V2 expone un HTTP API rediseñado (cambio incompatible respecto de V1). Levanta un servidor con `opencode serve` y consume la API con `@opencode-ai/client` (el SDK oficial de V2) para integraciones programáticas.

## Replicación manual por un desarrollador

Cualquier flujo que realice una IA orquestadora puede ejecutarse manualmente con múltiples pestañas de terminal y asignación de modelos según la complejidad del trabajo.

1. Terminal 1 (base de datos / migraciones - modelo rápido):

   ```bash
   opencode --model anthropic/claude-3-5-haiku
   ```

   Prompt: "Lee `specs/01-database.md` y genera las migraciones SQL necesarias."

2. Terminal 2 (backend / reglas de negocio - modelo de alto razonamiento):

   ```bash
   opencode --model anthropic/claude-3-5-sonnet#high
   ```

   Prompt: "Lee `specs/02-backend-contracts.md` e implementa los controladores REST e integración con las migraciones creadas."

3. Orquestador humano: el desarrollador actúa como supervisor que valida el trabajo de la terminal 1 antes de dar luz verde a la terminal 2 para continuar.

## Ver también

* [IA (MOC)](_index.md)
* [OpenCode - AGENTS.md vs skill vs agent vs MCP vs command](opencode-agents-skills-mcp-commands.md)
* [Contrato de ejecución para agentes](contrato-de-ejecucion-para-agentes.md)

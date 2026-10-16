---
title: Guía de Orquestación de Agentes e IA con OpenCode
area: desarrollo
tags: [desarrollo, desarrollo/ia, arquitectura]
created: 2026-10-05
updated: 2026-10-05
related: ["./opencode-agents-skills-mcp-commands.md", "./_index.md"]
---

# Guía de Orquestación de Agentes e IA con OpenCode

Cómo una IA orquestadora (supervisor) invoca, delega y ejecuta tareas en subagentes de forma automática y programática, emulando el trabajo de un desarrollador en la terminal.

## Modo interactivo vs. modo programático

Cuando un usuario interactúa manualmente con OpenCode lo hace mediante la interfaz interactiva (TUI o chat de la terminal). Cuando una IA orquestadora invoca a otro agente, no abre pestañas visuales ni escribe en cuadros de texto; utiliza el modo programático (headless) o llamadas a herramientas (tool calling).

| Característica | Modo interactivo (humano) | Modo programático / headless (IA) |
| :--- | :--- | :--- |
| Entrada | Teclado, prompt en tiempo real | Argumentos CLI, archivos de contexto, JSON |
| Interfaz | Ventana interactiva, TUI con colores | Ejecución silenciosa en segundo plano |
| Apertura de subagentes | Abrir pestañas o cambiar de modelo manualmente | Ejecución de comandos de consola o API tool calls |
| Salida | Respuesta progresiva en pantalla | Archivos modificados + código de salida / JSON |

## Método A: ejecución directa mediante CLI (modo headless)

Si la IA orquestadora tiene habilitada la capacidad de ejecutar comandos en la terminal (`execute_command` o `bash`), puede lanzar instancias de OpenCode para subagentes con modelos específicos y parámetros delimitados.

Comando de ejemplo que ejecuta la IA orquestadora:

```bash
opencode run \
  --model anthropic/claude-3-5-haiku \
  --prompt "Lee ./specs/03-database-migrations.md e impleméntalo en ./prisma/schema.prisma" \
  --non-interactive
```

Flujo de ejecución interno:

1. El orquestador envía el comando a la terminal del sistema.
2. La terminal inicia un proceso en segundo plano (invisible para el usuario).
3. La nueva instancia de OpenCode lee la especificación asignada y ejecuta el modelo especificado (`--model`).
4. Al finalizar los cambios en los archivos, el proceso termina devolviendo el resultado en texto o JSON al orquestador principal.

## Método B: subagentes e invocación de herramientas (tool calling)

En configuraciones avanzadas, los subagentes no se abren mediante comandos de terminal, sino mediante un archivo de definición que se expone como herramientas para el orquestador.

### 1. Archivo de configuración de subagentes

Ejemplo de definición (p. ej. `.opencode/agents.json` u `opencode.json` según versión):

```json
{
  "db-agent": {
    "model": "anthropic/claude-3-5-haiku",
    "effort": "low",
    "description": "Especialista en migraciones SQL, esquemas de BD y ORM."
  },
  "backend-agent": {
    "model": "anthropic/claude-3-5-sonnet",
    "effort": "high",
    "description": "Especialista en arquitectura, controladores REST y reglas de negocio."
  },
  "frontend-agent": {
    "model": "anthropic/claude-3-5-haiku",
    "effort": "medium",
    "description": "Especialista en componentes de UI y consumo de APIs."
  }
}
```

### 2. Evento interno de delegación (tool call)

Cuando el orquestador decide asignar una tarea según el plan, emite una llamada de herramienta con formato estructurado:

```json
{
  "tool": "delegate_task",
  "agent": "db-agent",
  "instruction": "Ejecuta las especificaciones de specs/01-db.md"
}
```

OpenCode procesa esta solicitud internamente, ejecuta la consulta con el modelo `db-agent` y le devuelve el resultado al orquestador.

## Replicación manual por un desarrollador

Cualquier flujo que realice una IA orquestadora puede ejecutarse manualmente con múltiples pestañas de terminal y asignación de modelos según la complejidad del trabajo.

1. Terminal 1 (base de datos / migraciones - modelo rápido):

   ```bash
   opencode --model anthropic/claude-3-5-haiku
   ```

   Prompt: "Lee `specs/01-database.md` y genera las migraciones SQL necesarias."

2. Terminal 2 (backend / reglas de negocio - modelo de alto razonamiento):

   ```bash
   opencode --model anthropic/claude-3-5-sonnet
   ```

   Prompt: "Lee `specs/02-backend-contracts.md` e implementa los controladores REST e integración con las migraciones creadas."

3. Orquestador humano: el desarrollador actúa como supervisor que valida el trabajo de la terminal 1 antes de dar luz verde a la terminal 2 para continuar.

## Ver también

* [IA (MOC)](_index.md)
* [OpenCode - AGENTS.md vs skill vs agent vs MCP vs command](opencode-agents-skills-mcp-commands.md)

---
title: Migrar OpenCode 1.x a 2.x
area: desarrollo
tags: [desarrollo, devops, desarrollo/ia]
created: 2026-10-01
updated: 2026-10-02
related: ["../devops/_index.md", "../ia/_index.md"]
---

# Migrar OpenCode 1.x a 2.x

Guía para este PC (Windows, Git Bash) para desinstalar OpenCode 1.x (instalado por script) e instalar OpenCode 2.x sin perder configuración ni historial. El agente no puede auto-desinstalarse porque mataría su propia sesión: los pasos 2 a 5 se ejecutan a mano.

## Contexto

En este PC solo hay una instalación 1.x (v1.18.34):

* Script: `C:\Users\juan2\.opencode\bin\opencode.exe` (173 MB), primero en el PATH.
* npm global: limpio, sin `opencode-ai` ni `@opencode/cli`.

En 2.x los nombres cambian: script en `https://opencode.ai/v2/install` y npm como `@opencode/cli` (versión actual 2.0.6). Según la docu oficial hay que quitar 1.x primero para evitar choques en el PATH.

Backup previo (ya hecho, 2026-10-01): `D:\Backups\opencode_01_10_2026\` con `config-global/` (opencode.json con MCPs context7 y chrome-devtools, opencode.jsonc, tui.jsonc, AGENTS.md, commands/, opencode-quota/), `data/` (auth.json, opencode.db en copia consistente vía `sqlite3 .backup`, storage/, snapshot/, repos/) y `agents-skills/` (11 skills), más `install-info.txt` y `RESTORE.md`. Ojo: opencode.json y auth.json contienen tokens, no copiar sus valores a esta nota.

Del backup, `config-global/opencode.json` y `tui.jsonc` ya no sirven en 2.x: toda la
config valida quedo unificada en `config-global/opencode.jsonc` (2026-10-02). Ver la
sección "Limpieza posterior a la migración".

## 1. Verificar estado inicial

```bash
ls "D:/Backups/opencode_01_10_2026/"
opencode --version
which -a opencode
npm list -g --depth=0 | grep -i opencode || echo "npm limpio"
```

Esperado en 1.x: versión `1.18.34` y una sola ruta (`/c/Users/juan2/.opencode/bin/opencode`).

## 2. Desinstalar 1.x por npm (verificación)

En este PC nunca se instaló por npm, solo comprobar:

```bash
npm uninstall -g opencode-ai || echo "no estaba por npm"
npm list -g --depth=0 | grep -i opencode || echo "npm limpio"
```

## 3. Borrar binario del script

```bash
rm -rf ~/.opencode
ls -la ~/.opencode || echo "script limpio"
```

No borrar: `~/.config/opencode/`, `~/.local/share/opencode/`, `~/.agents/` ni `D:/Backups/opencode_01_10_2026/`.

## 4. Limpiar PATH

El instalador puso `/c/Users/juan2/.opencode/bin` al frente del PATH. Comprobar:

```bash
echo "$PATH" | tr ':' '\n' | grep -i opencode
grep -n opencode ~/.bashrc 2>/dev/null || echo "bashrc limpio"
```

Si aparece en `~/.bashrc`, borrar esas líneas y recargar con `source ~/.bashrc`. Si viene de las Variables de entorno de Windows, quitarlo en Sistema > Variables de entorno y reabrir la terminal.

## 5. Verificar limpieza total

```bash
which -a opencode || echo "limpio total"
opencode --version || echo "limpio total"
hash -r
```

## 6. Instalar 2.x

Opción A (recomendada, script nuevo):

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

Opción B (npm, paquete nuevo):

```bash
npm install -g @opencode/cli
```

Nota: en Windows los gestores Chocolatey/Scoop no están soportados para el CLI 2.x; la docu oficial ofrece binario standalone `.zip` y app Desktop `.exe`.

## 7. Verificar e iniciar

```bash
which opencode
opencode --version
```

Debe mostrar `2.x` (ej. `2.0.6`). Luego:

```text
opencode
/connect
```

## 8. Rollback a 1.x

Con opencode cerrado (detalle completo en `RESTORE.md` dentro del backup):

```bash
curl -fsSL https://opencode.ai/install | bash
cp "D:/Backups/opencode_01_10_2026/config-global/opencode.jsonc" ~/.config/opencode/
cp -r "D:/Backups/opencode_01_10_2026/agents-skills/." ~/.agents/
cp "D:/Backups/opencode_01_10_2026/data/auth.json" ~/.local/share/opencode/
cp "D:/Backups/opencode_01_10_2026/data/opencode.db" ~/.local/share/opencode/
rm -f ~/.local/share/opencode/opencode.db-shm ~/.local/share/opencode/opencode.db-wal
```

Del backup solo se restaura `opencode.jsonc`: `opencode.json` y `tui.jsonc` ya no son
validos en 2.x (ver "Limpieza posterior a la migración").

## Limpieza posterior a la migración (hecho 2026-10-02)

2.x cambio la forma de la config y de los plugins. Esto es lo que quedo sin coherencia
tras migrar y como se resolvio (todo verificado con `opencode debug config`,
`opencode plugin list` y `opencode mcp list`):

### Claves que 2.x renombro

2.x sigue aceptando las claves de 1.x por una capa de compatibilidad, asi que funcionan,
pero la forma canonica es la nueva:

| 1.x | 2.x |
| --- | --- |
| `plugin` | `plugins` |
| `provider` | `providers` |
| `mcp: { nombre: {...} }` (plano) | `mcp: { servers: { nombre: {...} } }` |
| `small_model` | `agents.title.model` (objeto `providerID` + `model`) |
| `command` / `agent` / `mode` / `autoupdate` | `commands` / `agents` / `agents` / `update` |

`formatter` y `lsp` no cambian: aceptan `true` o un mapa por servidor.

### Archivos que 2.x dejo de leer

* `tui.jsonc`: no existe en 2.x. Los nombres de config global son solo `opencode.json` y
  `opencode.jsonc`, y la config de TUI ahora es `cli.json`. Era un leftover de
  opencode-quota 4.x; en 5.x una sola entrada en la config principal carga servidor y TUI.
* `package.json` + `node_modules` dentro de `~/.config/opencode/`: 1.x instalaba ahi los
  plugins. En 2.x se instalan en `~/.cache/opencode/npm/`; el `package-lock.json` de
  `~/.cache/opencode/packages/` es de 1.x.

### Reglas de fusion entre archivos (por si alguna vez hay dos)

Si existen los dos archivos en el mismo directorio, 2.x carga **los dos** y los fusiona,
pero no de forma uniforme:

* mapas (`mcp.servers`, `providers`, `commands`): se fusionan por clave, gana el de mayor prioridad
* arrays (`plugins`, `permissions`): se **concatenan**
* escalares (`formatter`, `model`, `lsp`...): gana el **ultimo** documento, sin avisar

Ademas, cuando opencode escribe config elige siempre el ultimo archivo existente
(`opencode.jsonc` si estan los dos). Por eso todo quedo unificado en un solo
`opencode.jsonc`.

### Plugins: la API cambio y es la causa del error de Warp

El cargador de 2.x exige que el modulo exporte por defecto una definicion:

```ts
export default { id: "mi-plugin", effect: (ctx) => { /* ... */ } }
// o la variante Promise: { id, setup: async (ctx) => { /* ... */ } }
```

No hay fallback a exports con nombre. Un plugin de 1.x que solo haga
`export const MiPlugin = async (ctx) => ({...})` falla con
*"Plugin must export a default definition with an id and an effect or setup function"*.

En esta maquina:

* `@slkiser/opencode-quota@latest` -> 5.0.1, correcto (`@slkiser/opencode-quota.server`).
* `@warp-dot-dev/opencode-warp@0.1.5` -> **failed**: sigue en la API v1. Ni la 0.1.7
  (la ultima) lo arregla. Resuelto con un plugin local propio, ver la seccion siguiente.

### Notificaciones de Warp: plugin local en el TUI (resuelto 2026-10-02)

El plugin oficial de Warp no se puede arreglar solo adapts su export: aunque cargara,
**no tendria terminal donde escribir**. En 2.x el servidor es un servicio en background
que el CLI lanza con `detached: true` y `stdio: ["ignore", "ignore", "pipe"]`
(`packages/client/src/service-contender.ts`), asi que no tiene tty controladora. El
protocolo de Warp es escribir una secuencia OSC 777 en la terminal, y eso solo puede
hacerlo el proceso del TUI.

Solucion: un plugin **de directorio** en `~/.config/opencode/plugins/warp-notify/` con
dos entrypoints.

* `server.js`: obligatorio (si no, opencode no registra el plugin) y vacio a proposito.
* `tui.js`: la logica real. Se ejecuta en el proceso del TUI, que si es dueno de la
  terminal.

El TUI solo carga plugins que sean **directorios** (`packages/tui/src/plugin/discovery.ts`
descarta los ficheros `.js`), y el servidor acepta ficheros y directorios
(`packages/core/src/plugin/source-directory.ts`). De ahi la forma: directorio con
`package.json` (`"type": "module"`), `server.js` y `tui.js`.

La API del TUI (`@opencode/plugin/tui`) es distinta de la del servidor: no hay
`ctx.event.subscribe`, sino `context.data.on(tipo, handler)` tipado, mas
`context.data.session.get(id)` (su `parentID` delata los subagentes),
`context.attention.notify()` y `context.ui.toast.show()`. Plantilla:
`packages/tui/src/feature-plugins/system/notifications.ts`.

Los eventos tambien se renombraron, asi que el mapeo v1 -> v2 no es directo:

| Plugin de Warp (v1) | Evento v2 que se usa |
| --- | --- |
| `session.created` | `session.created` (el `parentID` marca subagentes) |
| `chat.message` | `session.inbox.enqueued` (`data.item.payload.text` = prompt) |
| `session.idle` (deprecado) | `session.execution.succeeded` / `.failed` / `.interrupted` |
| `message.updated` (para el texto) | `session.text.ended` (`data.text`) |
| `permission.updated` / `permission.asked` | `permission.asked` (`data.action` en vez de `data.type`) |
| `permission.replied` | `permission.replied` (`data.reply`) |
| `tool.execute.before` (question) | `session.tool.called` + `session.tool.input.started` (trae `name`) |
| `tool.execute.after` | `session.tool.success` / `session.tool.failed` |

Detalles quearoni al implementarlo:

* El envelope del evento es `{id, type, location, data}`: los campos van en `data`, no en
  `properties` como en v1.
* `session.tool.*` no lleva el nombre de la herramienta; hay que cachearlo desde
  `session.tool.input.started` usando el `id` de la llamada.
* El servicio es **compartido entre proyectos**, asi que el TUI recibe eventos de sesiones
  ajenas. Se filtran por `event.location.directory` contra el directorio del TUI, y tambien
  se descartan las sesiones de subagente para no duplicar avisos.
* Solo emite si existe `WARP_CLI_AGENT_PROTOCOL_VERSION`, igual que el plugin oficial, para
  no escribir basura en otras terminales ni por SSH.

Limites conocidos: solo funciona con el TUI (`opencode`), no con `opencode run`; y como el
plugin escribe en `stdout` a mitad de render, si Warp no consumiera la secuencia se veria
algo de ruido en pantalla.

Verificado end-to-end: con un `opencode run` real contra el mismo servicio, el proceso del
TUI emite `session_start`, `prompt_submit`, `tool_complete` y `stop` como OSC 777 en su
stdout, una sola vez por evento y sin colarse de otras sesiones.

```bash
opencode plugin list   # debe aparecer warp-notify.server (local)
```

### Credenciales

La API key de context7 paso a la variable de entorno `CONTEXT7_API_KEY` (Windows, nivel
usuario) y la config usa `"Authorization": "Bearer {env:CONTEXT7_API_KEY}"`. Recordar:
tras un `setx` hay que abrir terminal nueva, porque la sustitucion se hace al leer el
archivo.

### Comandos de diagnostico

```bash
opencode --version                # 2.0.22
opencode debug paths              # home, data, cache, config, state, db
opencode debug config             # config ya normalizada, documento por documento
opencode plugin list              # ID + version de cada plugin cargado (los que fallan salen con "-")
opencode plugin check             # busca actualizaciones
opencode mcp list                 # MCPs conectados
```

## Ver también

* [Herramientas](./_index.md)
* [DevOps](../devops/_index.md)
* [IA](../ia/_index.md)

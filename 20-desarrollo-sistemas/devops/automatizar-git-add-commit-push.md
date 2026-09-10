---
title: Automatizar git add, commit y push en una acción
area: desarrollo
tags: [desarrollo, devops, buenas-practicas]
created: 2026-09-07
updated: 2026-09-10
related: ["./_index.md"]
---

# Automatizar git add, commit y push en una acción

Subir cambios a un repo siempre son 3 pasos (`add` + `commit` + `push`).
Hay varias formas de reducirlo a una sola acción, con y sin IA.

## Definición

El flujo manual:

```bash
git add -A
git commit -m "docs: actualiza nota de electrónica"
git push
```

Las alternativas automatizan todo o parte: el mensaje lo escribes tú o lo genera la IA a partir del diff.

## Opciones

### 1. Alias de git (consola, sin IA)

Una línea en tu `.gitconfig`:

```bash
git config --global alias.ship '!f() { git add -A && git commit -m "$@" && git push; }; f'
```

Uso:

```bash
git ship "docs: actualiza nota de electrónica"
```

Cero dependencias. Pero tú escribes el mensaje y no hay revisiones de seguridad.

### 2. lazygit (consola, interactivo)

TUI de terminal ([jesseduffield/lazygit](https://github.com/jesseduffield/lazygit)):
stage, commit y push en pocas teclas, con vista del diff.
El mensaje sigue siendo manual. Ideal si trabajas sin IA.

### 3. Comando de IA `/ship` (recomendado aquí)

Un slash command de OpenCode que hace todo en una invocación:

```
/ship
/ship actualiza reglas de enlaces
```

Documentado con fuente completa en [Comando `/ship` de OpenCode](comando-ship.md),
sigue este flujo: inspecciona `status`/`diff` → frena si hay secretos o no hay
cambios → `git add -A` → genera mensaje Conventional Commits desde el diff real
→ commit → push (con `-u origin` si la rama no tiene upstream).

Cómo crear uno propio: archivo `.md` en `.opencode/commands/` (proyecto) o
`~/.config/opencode/commands/` (global), con frontmatter `description` y el
prompt como cuerpo. Soporta `$ARGUMENTS` y salida de shell con `` !`comando` ``.
Reiniciar OpenCode tras crearlo.

### 4. Skills de la comunidad

Existen skills genéricas (`smart-git-automation`, comandos `/commit`, etc.) con
agrupado por módulo, ramas y PRs. Potentes, pero pesadas y con confirmaciones
en cada paso: overkill para un repo personal donde eres el único que pushea.

### 5. ¿Y un MCP?

No: MCP es para conectar servicios externos. Esto es orquestación local, la
capa correcta es un slash command, sin servidor que mantener.

## Comparativa

| Opción | Mensaje | Revisiones | Una acción | Dependencias |
|---|---|---|---|---|
| Alias `git ship` | manual | no | sí (consola) | ninguna |
| lazygit | manual | visual | casi (TUI) | instalar lazygit |
| `/ship` (IA) | generado del diff | secretos, hooks, upstream | sí (`/ship`) | OpenCode |
| Skill comunidad | generado | muchas (lento) | sí | instalar skill |
| MCP propio | generado | las que programes | sí | mantener servidor |

## Guardarraíles mínimos (cualquier opción)

* Revisar el `diff` antes del `add`: el `git add -A` ciego es el riesgo clásico.
* Nunca commitear secretos (`.env`, tokens, claves).
* Si falla un hook, detenerse (no `--no-verify` sin preguntar).
* Nunca amend, rebase ni force-push en un flujo automático.

## Ver también

* [DevOps (MOC)](_index.md)
* [Comando `/ship` de OpenCode](comando-ship.md)
* [Mapa del repo](../../README.md)
* [Convenciones](../../00-meta/convenciones.md)

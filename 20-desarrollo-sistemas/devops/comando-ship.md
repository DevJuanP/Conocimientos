---
title: Comando ship de OpenCode - referencia completa
area: desarrollo
tags: [desarrollo, devops]
created: 2026-09-07
updated: 2026-09-07
related: ["./automatizar-git-add-commit-push.md", "./_index.md"]
---

# Comando `/ship` de OpenCode - referencia completa

Comando personalizado de OpenCode que sube los cambios de un repo en **una sola
acción**: inspecciona el diff, genera el mensaje de commit con IA, hace
`git add -A` + `commit` + `push`. Diseñado para compartir: cópialo y funciona.

## Características

| Característica | Detalle |
|---|---|
| Nombre | `/ship` |
| Qué hace | `status` → revisa secretos → `add -A` → mensaje IA → `commit` → `push` |
| Mensajes | Conventional Commits en español, generados del diff real |
| Argumentos | Acepta contexto extra: `/ship actualiza reglas de enlaces` |
| Estado inyectado | `git status --short` y `git diff --stat` entran solos al prompt |
| Upstream | Si la rama no tiene remoto, usa `push -u origin <rama>` automáticamente |
| Guardarraíles | Frena sin cambios, frena con secretos, frena si falla un hook |
| Prohibido | Amend, rebase y force-push (nunca los hace) |
| Scope | Archivo del proyecto: vale para ese repo y se versiona con él |
| Dependencias | Ninguna (solo git + OpenCode) |

## Requisitos

* OpenCode instalado (cualquier proveedor/modelo).
* Repo git con remoto configurado (`git remote -v` debe mostrar `origin`).
* Reiniciar OpenCode después de instalar el comando (la config se carga al inicio).

## Instalación

### Opción A: en un proyecto (recomendado para compartir)

Crea `.opencode/commands/ship.md` en la raíz del repo con el código fuente de
[abajo](#código-fuente-completo). Se versiona con el proyecto y le sirve a todo
el equipo.

### Opción B: global (todos tus repos)

El mismo archivo en `~/.config/opencode/commands/ship.md`.

### Opción C: inline en `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "ship": {
      "description": "Añade, commitea con mensaje conventional y pushea",
      "template": "<pega aquí el cuerpo del comando, con $ARGUMENTS>"
    }
  }
}
```

## Uso

```text
/ship
/ship corrige el cálculo de totales
```

* Sin argumentos: mensaje 100% generado del diff.
* Con argumentos: tu texto se usa como base y la IA lo pule al formato.

## Comportamiento paso a paso

1. **Inspecciona**: si `status` está limpio, lo dice y termina sin tocar nada.
2. **Seguridad**: lee el `diff` completo. Con secretos (tokens, passwords, claves
   privadas, `.env`) se detiene y avisa. Sin excepciones.
3. **Añade**: `git add -A` (todo lo trackeado + nuevo, menos lo ignorado).
4. **Mensaje**: Conventional Commits en español desde el diff real, no del stat:
   `<tipo>: <descripción breve en minúsculas, sin punto final>`.
5. **Commit**: un solo `git commit -m`. Si un hook lo rechaza, muestra el error y
   se detiene (jamás `--no-verify` por su cuenta).
6. **Push**: detecta si hay upstream; si no, `git push -u origin <rama>`.
7. **Reporta**: 2 líneas (mensaje del commit + resultado del push).
8. **Divide si toca**: si el diff mezcla dos temas no relacionados, pregunta antes
   de hacer dos commits en vez de uno.

## Tipos de commit soportados

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| `docs` | notas y documentación `.md` | `docs: agrega nota de automatización git` |
| `feat` | contenido o funcionalidad nueva | `feat: agrega comando ship al proyecto` |
| `fix` | correcciones | `fix: repara enlace roto en índice de electrónica` |
| `chore` | tooling, config, scripts | `chore: migra validador a node` |
| `refactor` | reordenar sin cambiar comportamiento | `refactor: simplifica validador de enlaces` |

## Personalización

Copia el archivo y ajusta a gusto:

* **Idioma**: cambia "en español" por "en inglés" en el paso 4.
* **Tipos**: agrega `test`, `perf`, `ci` a la lista del paso 4.
* **Sin push automático**: elimina el paso 6 si prefieres solo commitear.
* **Prefijo por repo**: añade contexto fijo (ej: `[conocimientos]`) al formato.

## Cuándo NO usarlo

* Ramas compartidas con más gente y cambios grandes sin revisar.
* Repos con hooks lentos que exigen revisión manual previa.
* Cuando el diff incluye archivos generados enormes (`node_modules`, `dist`,
  `.env`): primero al `.gitignore`, como hace este repo.

## Código fuente completo

Copia esto tal cual en `.opencode/commands/ship.md` (o ruta global):

```markdown
---
description: Añade, commitea con mensaje conventional y pushea los cambios actuales
---

Haz commit y push de los cambios actuales del repo, en este orden:

Estado actual del repo:

!`git status --short`
!`git diff --stat HEAD`

Pasos:

1. **Inspecciona**: si no hay cambios, dilo y termina sin hacer nada.
2. **Seguridad**: revisa `git diff HEAD` completo. Si hay secretos (tokens, passwords, claves privadas, `.env`), NO continúes y avísame.
3. **Añade**: `git add -A`.
4. **Mensaje**: genera un mensaje Conventional Commits en español, basado en el diff real (no en el stat):
   - Formato: `<tipo>: <descripción breve en minúsculas, sin punto final>`
   - Tipos: `docs` (notas .md), `feat` (contenido nuevo), `fix` (correcciones), `chore` (tooling/config), `refactor`
   - Si hay contexto extra del usuario: $ARGUMENTS. Úsalo como base del mensaje y pule al formato.
5. **Commit**: `git commit -m "<mensaje>"`. Si falla por hooks, muestra el error y detente (no uses `--no-verify` sin preguntar).
6. **Push**: comprueba upstream con `git rev-parse --abbrev-ref --symbolic-full-name @{u}`. Si falla, `git push -u origin <rama-actual>`; si no, `git push` a secas.
7. **Reporta** en 2 líneas: mensaje del commit + resultado del push.

Reglas: si el diff mezcla dos temas no relacionados, pregunta antes de dividir en dos commits. Nunca hagas amend, rebase ni force-push.
```

## Ver también

* [Automatizar git add, commit y push en una acción](automatizar-git-add-commit-push.md)
* [DevOps (MOC)](_index.md)
* [Comando /ship de este repo](../../.opencode/commands/ship.md)

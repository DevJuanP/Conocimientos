---
title: Publicar skills de agente
area: desarrollo
tags: [desarrollo, devops]
created: 2026-09-07
updated: 2026-09-07
related: ["./_index.md", "./comando-ship.md"]
---

# Publicar skills de agente

Flujo para convertir un `.md` suelto en una skill instalable por cualquiera con un comando. Vale para OpenCode, Claude Code, Cursor, Copilot y cualquier agente que lea el estándar `SKILL.md`.

## Formato obligatorio (Agent Skills)

Una skill es una carpeta con un `SKILL.md` dentro. Nada más es estrictamente obligatorio:

```text
mi-skill/
  SKILL.md
  README.md
  LICENSE
```

`SKILL.md` empieza siempre con frontmatter YAML:

```markdown
---
name: mi-skill
description: Qué hace Y cuándo usarlo. Ej: Genera changelogs desde PRs. Usa cuando...
license: MIT
---

# Mi Skill
(instrucciones, ejemplos)
```

## Reglas de validación

* Archivo en mayúsculas: `SKILL.md`, no `skill.md`.
* `name`: 1-64 caracteres, `^[a-z0-9]+(-[a-z0-9]+)*$`, igual al nombre de la carpeta.
* `description`: 1-1024 caracteres, obligatoria. En tercera persona, con palabras de disparo ("usa cuando..."). Sin ella el agente nunca la carga.
* Solo estos campos son reconocidos: `name`, `description`, `license`, `compatibility`, `metadata`. El resto se ignora.
* Sin secretos ni binarios grandes en la carpeta.

## Flujo de publicación

### 1. Normalizar tu `.md`

1. Crea la carpeta `mi-skill/` y mueve tu contenido a `mi-skill/SKILL.md`.
2. Agrega el frontmatter de arriba.
3. Reescribe la `description` pensando en el modelo y en el humano que la lee en el listado.

### 2. Subir a GitHub público (esto ya te hace instalable)

No hay registro central obligatorio. Con el repo público basta:

```bash
git init
git add -A && git commit -m "feat: agrega mi-skill" && git push
gh repo create TU-USUARIO/mi-skill --public --source=. --push
gh repo edit TU-USUARIO/mi-skill --add-topic agent-skill --add-topic claude-skill --add-topic opencode
```

Pon al inicio del `README.md` el comando de instalación. Es lo que la gente espera y lo que alimenta el ranking de `skills.sh`:

```md
npx skills add TU-USUARIO/mi-skill
```

Desde ese momento cualquiera puede instalar con:

```bash
npx skills add TU-USUARIO/mi-skill
# repo con varias skills:
npx skills add https://github.com/TU-USUARIO/mi-repo --skill mi-skill
# versión reproducible:
npx skills add TU-USUARIO/mi-skill@<tag-o-commit>
```

### 3. Aparecer en skills.sh y directorios

* **Automático:** `skills.sh` lista por telemetría de instalaciones. Haz tú la primera instalación para acelerar.
* **Manual:** `npx skills publish` dentro de la carpeta (pide login con GitHub, valida y sube), o pide indexación en `vercel-labs/skills`.
* **Long-tail:** los crawlers (SkillsMP, claudeskills.info, `gh skill search`) recogen solos los repos públicos con topic `agent-skill`. Para releases formales: `gh skill publish --tag v0.1.0`.

### 4. Solo si necesitas plugin de OpenCode (opcional)

Si tu skill es solo instrucciones, no necesitas esto. Solo si llevas hooks, MCP o herramientas:

* **Plugin npm:** publicas a npm y el usuario agrega en `opencode.json`: `"plugin": ["tu-paquete@latest"]`. OpenCode lo instala solo con Bun al arrancar.
* **CLI instaladora:** publicas un bin en npm y el usuario corre `npx tu-paquete install --global`, que por dentro copia a `~/.config/opencode/skills/`.

## Dónde cae cada skill en OpenCode

* Proyecto: `.opencode/skills/<nombre>/SKILL.md`
* Global: `~/.config/opencode/skills/<nombre>/SKILL.md`
* Compatibles (también los lee): `.claude/skills/`, `.agents/skills/` y sus equivalentes globales.
* Tras instalar o cambiar config: reiniciar OpenCode (la config se carga al inicio).

## Errores comunes

* Nombre de carpeta distinto de `name` del frontmatter: la skill no aparece.
* `description` genérica ("ayuda con código"): el agente nunca la elige.
* Repo privado: `npx skills add` falla y ningún indexer te ve.
* `README.md` de un párrafo sin comando de instalación: nadie la instala.
* Subir `.env`, tokens o `node_modules`: el escáner de seguridad te marca.

## Ver también

* [DevOps (MOC)](_index.md)
* [Comando `/ship` de OpenCode - referencia completa](comando-ship.md)

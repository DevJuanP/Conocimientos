---
title: Migrar OpenCode 1.x a 2.x
area: desarrollo
tags: [desarrollo, devops, desarrollo/ia]
created: 2026-10-01
updated: 2026-10-01
related: ["../devops/_index.md", "../ia/_index.md"]
---

# Migrar OpenCode 1.x a 2.x

Guía manual para desinstalar OpenCode 1.x (instalado por script + npm) e instalar OpenCode 2.x sin perder configuración ni historial. El agente no puede auto-desinstalarse porque mataría su propia sesión.

## Contexto

En 1.x convivían dos instalaciones que proveen el mismo binario `opencode`:

* Script: `/root/.opencode/bin/opencode` (v1.18.x, 184 MB), primero en el PATH.
* npm global: paquete `opencode-ai` con symlink en `/usr/bin/opencode`.

En 2.x los nombres cambian: script en `https://opencode.ai/v2/install` y npm como `@opencode/cli`. Hay que quitar 1.x primero para evitar choques en el PATH.

Backup previo (ya hecho): `/sdcard/Repos/opencode_backup/` con `opencode.jsonc`, `models.json`, `opencode.db` y `storage/session_diff`.

## 1. Verificar estado inicial

```bash
ls "/sdcard/Repos/opencode_backup/"
opencode --version
which -a opencode
```

Esperado en 1.x: versión `1.18.x` y dos rutas (`/root/.opencode/bin/opencode` y `/usr/bin/opencode`).

## 2. Desinstalar 1.x por npm

```bash
npm uninstall -g opencode-ai
ls -l /usr/bin/opencode || echo "npm limpio"
npm list -g --depth=0 | grep -i opencode || echo "npm limpio"
```

## 3. Borrar binario del script

```bash
rm -rf /root/.opencode
ls -la /root/.opencode || echo "script limpio"
```

No borrar: `/root/.config/opencode/`, `/root/.local/share/opencode/opencode.db`, ni `/sdcard/Repos/opencode_backup/`.

## 4. Limpiar PATH en la shell

```bash
grep -n opencode ~/.bashrc
```

Borrar estas líneas con nano o vim:

```text
# opencode
export PATH=/root/.opencode/bin:$PATH
```

Recargar:

```bash
source ~/.bashrc
```

## 5. Verificar limpieza total

```bash
which -a opencode || echo "limpio total"
opencode --version || echo "limpio total"
hash -r
```

## 6. Instalar 2.x

Opción A (recomendada, mismo path que antes):

```bash
curl -fsSL https://opencode.ai/v2/install | bash
source ~/.bashrc
```

Opción B (npm, paquete nuevo):

```bash
npm install -g @opencode/cli
```

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

```bash
npm install -g opencode-ai@1.18.29
curl -fsSL https://opencode.ai/install | bash
cp /sdcard/Repos/opencode_backup/config-global/opencode.jsonc /root/.config/opencode/
cp /sdcard/Repos/opencode_backup/data/opencode.db /root/.local/share/opencode/
```

## Ver también

* [Herramientas](./_index.md)
* [DevOps](../devops/_index.md)
* [IA](../ia/_index.md)

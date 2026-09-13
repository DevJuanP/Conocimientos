---
title: LSP en OpenCode
area: desarrollo
tags: [desarrollo, devops, desarrollo/ia]
created: 2026-09-13
updated: 2026-09-13
related: ["./lsp-language-server-protocol.md", "../../devops/_index.md", "../../ia/_index.md"]
---

# LSP en OpenCode

OpenCode integra servidores LSP para dar feedback de diagnósticos al agente. No es un formateador: es contexto del lenguaje para encontrar y corregir problemas.

## Contenido

* Viene con servidores integrados por lenguaje (TypeScript, Pyright, gopls, rust-analyzer, clangd, etc.). Algunos se autoinstalan, otros exigen tener el SDK o la dependencia del proyecto.
* Está desactivado por defecto. Se activa cuando el proyecto se beneficia del feedback extra del servidor de lenguaje.
* Configuración en `opencode.json`:

```json
{ "$schema": "https://opencode.ai/config.json", "lsp": true }
```

Para desactivar uno concreto manteniendo el resto:

```json
{ "$schema": "https://opencode.ai/config.json", "lsp": { "typescript": { "disabled": true } } }
```

* Costos conocidos: pueden desincronizarse, usar bastante memoria, variar según versión del proyecto y ralentizar al agente.
* Alternativa recomendada en muchos proyectos: que el agente ejecute directo `lint`, `typecheck`, `test` o el compilador, y documentar esos comandos en `AGENTS.md` o en una skill para que los errores vuelvan al ciclo del agente sin los costos del LSP.

Fuente: docs oficiales de OpenCode (sección LSP).

## Ejemplo

Proyecto Python con errores de tipos: con Pyright activo el agente recibe el diagnóstico al leer/editar y se autocorrige. Sin LSP, lo mismo se logra con `pyright` o `mypy` por CLI documentado en `AGENTS.md`.

## Ver también

* [LSP - Language Server Protocol](./lsp-language-server-protocol.md)
* [DevOps](../../devops/_index.md)
* [IA](../../ia/_index.md)

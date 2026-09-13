---
title: LSP - Language Server Protocol
area: desarrollo
tags: [desarrollo]
created: 2026-09-13
updated: 2026-09-13
related: ["./lsp-en-opencode.md", "../_index.md"]
---

# LSP - Language Server Protocol

## Definición

Protocolo estándar (creado por Microsoft para VS Code) para que cualquier editor o agente entienda código como un IDE: diagnósticos, definiciones, referencias y símbolos por lenguaje.

## Intuición

Sin LSP cada editor reimplementaría análisis por lenguaje. Con LSP hay un servidor por lenguaje que responde preguntas ("¿dónde se define X?", "¿qué errores hay?") y el cliente (VS Code, OpenCode) solo las muestra o las usa como feedback.

## Ejemplo

Servidores típicos por lenguaje: `pyright` (.py), `typescript-language-server` (.ts/.js), `rust-analyzer` (.rs), `gopls` (.go), `jdtls` (.java), `clangd` (C/C++).

Capacidades que expone un servidor LSP:

* Diagnósticos: tipos, imports rotos, variables no definidas.
* Navegación: ir a definición, referencias, símbolos del documento.
* Info al hover: tipos y documentación.
* Acciones: formateo, rename, code actions.

## Errores comunes

* Error 1: creer que el LSP es un formateador. El formateo es solo una capacidad menor; lo central es el análisis semántico.
* Error 2: confundir linter/formateador (Prettier, Black, ESLint: reglas de estilo) con servidor de lenguaje (Pyright: entiende tipos y alcance).
* Error 3: asumir que un LSP sirve para todo lenguaje. Cada servidor cubre sus extensiones.

## Ver también

* [LSP en OpenCode](./lsp-en-opencode.md)
* [Herramientas](../_index.md)

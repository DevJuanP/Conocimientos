---
title: Flujo propuesto para el equipo
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas, devops]
created: 2026-10-25
updated: 2026-10-25
related: ["./mapa-del-codigo-y-comprension.md", "./donde-viven-las-historias.md", "./monorepo-migraciones-y-contratos.md", "./cultura-de-tests-paso-cero.md"]
---

# Flujo propuesto para el equipo

La propuesta completa. Agnóstica a la tecnología: sirve igual para React + Spring Boot que para Angular + Node o .NET.

**Contexto de equipo real:** cinco personas, de las cuales tres programan (a veces cuatro). Dos no programan y no deben quedar fuera del método: se les da un rol concreto y útil.

## Las tres decisiones que ordenan todo

### 1. El spec no vive en el repo, vive en el issue

Un `specs/` con ocho markdown por feature es lo que se pudre y nadie lee. Reparto de responsabilidades:

| Sitio | Qué vive ahí | Dueño |
|---|---|---|
| Issue | Qué y por qué: historia, criterios, plan, fuera de alcance | Quien va a construirlo |
| PR | Evidencia de que se hizo: mapa del código, tests, demo | Quien lo construyó + quien revisa |
| Repo | Código y contratos | Todos |

Tres sitios, cada uno con un dueño claro. Esto solo elimina la mitad del peso del proyecto anterior.

### 2. La unidad de trabajo es la historia vertical, no el módulo

Ver [Cortes verticales y pair programming](./cortes-verticales-y-pair-programming.md). Regla corta: si no se puede demostrar en cinco minutos al terminarla, está mal cortada.

### 3. El humano es el gate, la IA es el driver

No un agente que verifica a otro agente. El agente propone; el humano aprueba la lista de pruebas, revisa el diff y corre la demo. Lo que la IA no puede hacer es *entender por ti*.

## Mapa de artefactos

| Artefacto | Qué es | Tamaño |
|---|---|---|
| `AGENTS.md` | Núcleo del proyecto: stack, **3 comandos** (instalar, probar, correr), estructura de carpetas, reglas duras | ≤ 1 página |
| `CONTRIBUTING.md` | Normas humanas: git, PRs, roles, WIP, definición de terminado | ≤ 2 páginas |
| `docs/decisiones.md` | ADR ligero: append-only, una entrada por decisión con fecha | crece lento |
| `.github/pull_request_template.md` | Fuerza el mapa y la evidencia en cada PR | fijo |
| `.opencode/commands/*.md` | Los seis flujos que dispara el humano | — |
| `.opencode/skills/*/SKILL.md` | Referencia que el agente consulta (git, corte vertical, tests) | — |

### Lo que NO se crea

* Carpeta `specs/`.
* Un documento de arquitectura por feature.
* Un `design.md` por historia.
* Agentes verificadores.

Si aparece la tentación de añadir uno de estos, es la misma tentación que costó el proyecto anterior.

## Los seis comandos

| Comando | Hace | Nunca hace |
|---|---|---|
| `/backlog` | Idea → 10-15 historias verticales de una línea, con `Requires: #N` | Inventar requisitos, estimar, dividir por capas |
| `/historia` | Una historia → 2-3 criterios Given/When/Then, plan ≤5 bullets, **fuera de alcance**, lista de pruebas, **fronteras que toca** | Escribir código, aprobarse sola |
| `/contrato` | Si toca una superficie compartida (endpoint, tabla, evento, props), escribe el contrato en el issue | Diseñar la solución completa |
| `/pareja` | Ciclo TDD: un test → rojo → código mínimo → verde → parar | Commitear, tocar tests, añadir lo no pedido |
| `/revision` | Guía al revisor humano: criterios contra diff, sobreingeniería, tests tramposos | Ser el gate (es un asistente del revisor) |
| `/entrega` | Genera el mapa del PR y los pasos de demo | Declarar la historia terminada |

```
idea → /backlog → /historia → [/contrato] → /pareja → /entrega → PR → revisión + demo → squash a main
```

### Por qué comandos y no skills

En OpenCode V2:

* **Command:** plantilla que dispara el humano. Es un flujo.
* **Skill:** conocimiento que el agente carga cuando lo necesita. Es referencia.

Mezclarlos produce un agente que decide cuándo aplicar la metodología. Los comandos llevan `metadata.opencode/autoinvoke: false`: se ejecutan cuando el humano quiere, nunca por iniciativa del modelo.

### `/contrato`: la pieza que hola-ai no tiene

Con una persona, el modelo de datos se decide solo en la primera historia. Con tres, se decide tres veces y el merge duele.

**Regla:** si una historia necesita una superficie que no existe o la cambia, el contrato se aprueba y se mergea **antes** de que nadie dependa de él. Cinco líneas, no un diseño:

> `POST /auth/login` → 200 `{token, refreshToken}` | 401 `{error}`. Campos obligatorios: `email`, `password`. Rate limit 5/min por IP.

### Fronteras: el sistema de locks que sí hace falta

`/historia` obliga a declarar qué módulos toca. Dos historias con fronteras solapadas **no se trabajan en paralelo**. Eso es todo lo que se necesita con tres personas; no hace falta un sistema de reservas.

## Git y equipo en ocho reglas

1. `main` siempre desplegable. Nadie hace push directo, ni siquiera quien lidera.
2. Rama `h/<id>-slug`, **vida máxima dos días**. Si no cabe, la historia está mal cortada.
3. Una historia = un PR. En monorepo es un único PR; ver [Monorepo, migraciones y contratos](./monorepo-migraciones-y-contratos.md).
4. PR de más de ~400 líneas cambiadas se parte. Es un límite de revisión humana, no de estilo.
5. Squash al mergear: `main` se lee como un libro de historias, no como doscientos commits de "fix".
6. Refactor y funcionalidad en commits distintos. Nunca mezclados.
7. **El agente nunca commitea, ni pushea, ni mergea.** El humano sí.
8. WIP = 1 por persona. Si estás bloqueado, revisas el PR de otro; no empiezas otra historia. Nadie empieza una historia cuyos `Requires` no estén en `main`.

## Roles, incluidos los que no programan

| Rol | Quién | Responsabilidad |
|---|---|---|
| Navigator | Quien programa | Dirige a la IA, aprueba la lista de tests, revisa el diff |
| Revisor | Otro que programa | Corre el PR, cuestiona complejidad, no aprueba su propio trabajo |
| Demostrador externo | **Alguien que no programa** | Corre la demo con los criterios de aceptación en la mano |
| Escriba del mapa | Quien programó | Redacta el mapa del PR; el revisor lo corrige |

Ese tercer rol es el que rescata a los dos compañeros que no codean. Verificar criterios de aceptación desde fuera es trabajo real: un no-programador que detecta que la funcionalidad "no se siente bien" aporta más que otro agente diciendo que sí.

## Definition of Done de una historia

1. Criterios de aceptación cumplidos y verificados por alguien que no lo escribió.
2. Tests de la lista en verde, y el rojo se vio antes del verde.
3. Contrato respetado (o no aplicaba).
4. **Mapa del código** escrito y corregido por el revisor.
5. Demo corriendo en la máquina del revisor.
6. `main` sigue arrancando con un comando.

## Adopción en tres semanas

| Semana | Qué se introduce |
|---|---|
| 1 | Solo `AGENTS.md` + plantilla de PR + `/historia` + `/pareja`. Dos personas, dos historias |
| 2 | `/entrega` y `/revision`. Primer PR revisado por alguien que no lo escribió |
| 3 | `/backlog` y `/contrato`, cuando entra el tercer programador y empiezan las colisiones reales |

**Si solo se construyen tres cosas:** `AGENTS.md`, `/historia` y la plantilla de PR. El resto se gana su sitio cuando aparece el dolor.

## Criterios de abandono

El método no aplica a:

* Prototipos desechables y scripts de una tarde.
* Entregas con fecha imposible donde el objetivo es que compile, no que se entienda.
* Proyectos de una sola persona que nunca van a mantener otros.

Y una condición de revisión honesta: si en dos semanas no se entiende más el código, el método está mal calibrado.

## Ver también

* [El mapa del código y la comprensión](./mapa-del-codigo-y-comprension.md)
* [Dónde viven las historias](./donde-viven-las-historias.md)
* [Monorepo, migraciones y contratos](./monorepo-migraciones-y-contratos.md)
* [Cultura de tests: el paso cero](./cultura-de-tests-paso-cero.md)

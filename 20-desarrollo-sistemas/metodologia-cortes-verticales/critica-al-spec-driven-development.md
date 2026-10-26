---
title: Crítica al Spec-Driven Development
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas, arquitectura]
created: 2026-10-25
updated: 2026-10-25
related: ["./contexto-proyecto-microservicios.md", "./skills-hola-ai-analisis.md", "./cortes-verticales-y-pair-programming.md"]
---

# Crítica al Spec-Driven Development

Recopilación de las objeciones al SDD que se han revisado para este proyecto, ordenadas por autor, más una lectura propia: **el diagnóstico del video es correcto en el mecanismo pero excesivo en el alcance**. No es que el SDD no sirva; es que un spec de sistema completo, ejecutado en lote, no sirve para nada que vaya a seguir viviendo.

## El video de Hola Mundo (Nicolás Schurmann)

**Estado de verificación:** el resumen es del propio autor de estas notas. El video no se pudo abrir al redactar esta nota (YouTube devolvió HTTP 429), así que los timestamps y las citas no están verificados contra el original. Se toma como `No verificado` en su literalidad y se evalúa como argumento.

### Tesis

El SDD tiende a generar sobreingeniería, código innecesario y una carga alta de revisión manual. Propone en su lugar *Augmented Coding*: backlog de historias cortas, cortes verticales y pair programming humano-IA.

### Objeciones

| Objeción | Contenido |
|---|---|
| Planificación excesiva | Igual que cascada: se intenta resolver todo cuando menos se conoce el problema |
| Desarrollo por capas horizontales | Base de datos → API → frontend; nada se puede probar hasta el final |
| Dependencia de la IA | Se delega la decisión técnica; resultado: horas de revisión de código que nadie modeló |

### Propuesta

| Elemento | Qué aporta |
|---|---|
| Cortes verticales | Cada porción atraviesa todas las capas y entrega valor usable |
| Historias de usuario cortas | Backlog reordenable, alcance mínimo |
| AI pair programming | Humano navigator, IA driver; pasos guiados por tests |
| Arquitectura emergente | Se abstrae solo cuando algo duele, no por anticipación |

### Las tres alarmas del video

Son la parte más valiosa porque son observables y accionables:

1. La IA entra en bucles infinitos.
2. La IA añade funcionalidad no solicitada.
3. La IA hace trampa: modifica los tests para que salgan en verde.

La tercera no es una hipótesis. Kent Beck lo documentó con sus propios agentes: *"The genie doesn't want to do TDD. It wants to write the code and then write tests that pass"*, y también agentes que borraban tests que fallaban en lugar de arreglar la implementación.

### Dónde el video se pasa de frenada

El resumen sugiere "cero planificación". Pero la skill `/backlog` del propio repo pregunta por las decisiones caras de revertir (multi-tenant, roles, offline, i18n) y pide **no diseñarlas todavía**. Eso no es ausencia de planificación: es calibración. El video es más listo que su propio resumen.

## Birgitta Böckeler (Thoughtworks)

Su artículo *Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl* es el mejor mapa del espacio. Distingue tres niveles que conviene no confundir:

| Nivel | Qué significa | ¿El humano toca el código? |
|---|---|---|
| Spec-first | Se escribe un spec antes de la tarea | Sí |
| Spec-anchored | El spec se conserva y se usa para evolucionar | Sí |
| Spec-as-source | El spec es el archivo fuente; el código se genera | No |

Casi todas las herramientas son spec-first, pero se presentan como si fueran spec-anchored. Esa ambigüedad es parte del problema de expectativas.

Sus observaciones prácticas, que coinciden con la experiencia de esta carpeta:

* **Prefiere revisar código antes que montones de markdown.** El flujo de spec-kit generó ocho archivos markdown para una sola feature, repetitivos y tediosos.
* **Falsa sensación de control.** Pese a plantillas, checklists y "constituciones", el agente ignoraba el spec. En su prueba, el paso de investigación describió clases existentes y el agente las generó de nuevo, duplicándolas.
* **Sobreingeniería de proceso.** Para un bug pequeño, Kiro lo convirtió en cuatro historias con dieciséis criterios de aceptación.
* **El paralelo histórico con MDD.** Model-driven development prometía lo mismo: modelos como fuente, código generado. Murió por rigidez y sobrecarga. Los LLM quitan la rigidez y añaden no-determinismo: existe el riesgo de quedarse con los inconvenientes de ambos.

## Thoughtworks Technology Radar

El radar puso SDD en **Assess** (noviembre 2025) con una advertencia notable: los flujos son elaborados y opinados, algunos generan especificaciones demasiado largas para revisar bien, y *"puede que estemos reaprendiendo la bitter lesson: que escribir reglas detalladas a mano para la IA no escala"*.

Es la formulación más precisa del riesgo: el problema no es la IA, es **codificar el criterio humano en documentos** en lugar de ejercerlo.

## Kent Beck

Beck no ataca el SDD directamente: lo desclasifica como pregunta mal planteada.

> "Spec-driven or not spec-driven is not the question. The first question is, 'What game are we playing?'"

| Juego | Regla | SDD encaja |
|---|---|---|
| Finish Line | Queremos software que haga X. Al llegar a X, terminamos | Sí |
| Compounding | Lo primero que terminas financia lo siguiente | No |

Su argumento: *"un spec mejor nunca te llevará del dólar N al dólar N+1 para siempre"*. En un sistema longevo, el spec se convierte en otro archivo que mantener, y la complejidad acaba superando la capacidad del agente y del humano.

Añade una distinción operativa útil: **features vs futures**. Una feature es lo que entregas; un future es todo lo que puedes implementar después. El agente es malo gestionando futures. Si juegas al Finish Line estás apostando a que las features cruzan la meta antes de que se agoten los futures.

Sobre multiagente, tras usar un sistema coordinador + implementador + verificador: *"estaba gestionándolo. Mirando qué agente hacía qué. Manteniendo estado en mi cabeza que el sistema debería haber mantenido por mí"*. Y el problema abierto que más se parece a esta carpeta: *"ahora mismo cinco agentes pueden trabajar en este código simultáneamente. Cinco personas no. Eso está al revés"*.

## Instil

Artículo de ingeniería con datos, no opiniones. Tras usar SDD en varios proyectos, tres hallazgos consistentes:

1. **Muchos tokens.** Cada artefacto se razona aislado *y* en contexto de sus padres; al llegar al nivel de tarea el agente procesa toda la jerarquía en cada paso. Reportan varios múltiplos del coste de un flujo iterativo para el mismo alcance, y citan un caso (Scott Logic) de una ejecución con spec-kit **diez veces más lenta** que el prompting iterativo.
2. **Los artefactos se desincronizan.** Las tareas derivan de los planes, los planes del spec, y todo deriva del código. Nada los mantiene sincronizados. *"Una vez que el spec deja de ser la fuente de verdad, es solo otro archivo que mantener."*
3. **El resultado no fue mejor.**

Su conexión con el *context rot* es la parte técnicamente más interesante: el SDD hace lo contrario de *context engineering*. Genera muchos artefactos y arrastra el árbol entero al modelo en cada paso; el modelo se distrae con planes obsoletos y empieza a repetirse. Se paga dos veces: en la factura de entrada y en calidad de salida.

## Síntesis: qué se acepta y qué no

| Afirmación | Veredicto |
|---|---|
| Un spec de sistema completo antes de codificar es waterfall con markdown | Se acepta |
| El desarrollo por capas horizontales impide probar hasta el final | Se acepta |
| Revisar markdown es peor que revisar código | Se acepta |
| Los artefactos derivan y nadie los sincroniza | Se acepta |
| El SDD no sirve para nada | Se rechaza |
| No hace falta planificar nada | Se rechaza |

La lectura propia: **el spec sirve, pero de cambio, corto y cerca del código**. No un PRD de doscientas páginas, y no como fuente de verdad permanente. El único spec que no se pudre en silencio es un test que falla.

## Fuentes

* [Spec-driven development — Technology Radar (Thoughtworks)](https://www.thoughtworks.com/radar/techniques/spec-driven-development) — consultado: 2026-10-25
* [Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl — Birgitta Böckeler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — consultado: 2026-10-25
* [Earn *And* Learn — Kent Beck](https://tidyfirst.substack.com/p/earn-and-learn) — consultado: 2026-10-25
* [Genie Lessons: Nobody Wants Agents — Kent Beck](https://tidyfirst.substack.com/p/genie-lessons-nobody-wants-agents) — consultado: 2026-10-25
* [Spec-driven development is dead. Long live plan mode — Instil](https://instil.co/blog/spec-driven-development-is-dead-long-live-plan-mode) — consultado: 2026-10-25
* [TDD, AI agents and coding with Kent Beck — The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) — consultado: 2026-10-25
* [Spec-Driven Development (Hola Mundo) — video](https://www.youtube.com/watch?v=5JjuF1zpNbI) — consultado: 2026-10-25 (no verificable: HTTP 429 al abrir; se evalúa el resumen del autor)

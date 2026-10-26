---
title: Análisis de las skills de hola-ai
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas]
created: 2026-10-25
updated: 2026-10-25
related: ["./cortes-verticales-y-pair-programming.md", "./flujo-propuesto-equipo.md", "../ia/opencode-agents-skills-mcp-commands.md"]
---

# Análisis de las skills de hola-ai

Lectura línea a línea de las tres skills del repositorio [hola-ai](https://github.com/nschurmann/hola-ai) (112 stars, 3 commits, licencia MIT, un autor). Se analizan porque son la implementación concreta de la propuesta del video, no porque sean un estándar.

**Veredicto:** excelentes como arranque para una persona con una IA; insuficientes para un equipo. Se copian las ideas, no los archivos.

## El flujo original

```
/backlog  →  /story  →  /pair
  qué         qué exacto     cómo
```

Cada skill es invocación manual (`disable-model-invocation: true`): el agente nunca decide cuándo aplicar la metodología.

## `/backlog`

**Hace:** convierte una idea en 10-15 historias verticales de una línea.

**Conversación:**

1. Escucha la idea; si algo es ambiguo, pregunta **una cosa a la vez y con respuesta sugerida**.
2. Si es proyecto nuevo, discute el stack. Solo el stack, no la arquitectura.
3. Pregunta si aplican decisiones caras de revertir: multi-tenant, roles/permisos, offline/sync, multi-idioma/multi-moneda. **Solo pregunta, no las diseña.**
4. Propone el backlog; el humano ajusta.

**Reglas duras, y son buenas:**

* No inventar requisitos: si falta información, preguntar.
* Cada historia entrega valor por sí sola y atraviesa todas las capas. Nunca dividir por capas.
* Sin historias técnicas: el actor nunca es el desarrollador ni el sistema. "Configurar la base de datos" o "crear el modelo de usuario" no son historias; esa infraestructura se construye dentro de la primera historia que la necesita.
* Pocas historias: 10-15, mejor añadir que recortar.
* La primera historia es la más pequeña usable de punta a punta (*walking skeleton*).

**Formato de salida:** contexto, stack, decisiones caras, y lista numerada de historias con `Requires: #N` solo cuando una historia no tiene sentido sin otra.

**Lo que aporta:** el punto 3 es la calibración que salva la crítica de "cero planificación". No es no planificar: es identificar qué decisiones son caras de revertir y **aplazar su diseño**.

**Lo que le falta para un equipo:** nada sobre quién coge qué historia, ni cómo evitar que dos personas toquen lo mismo.

## `/story`

**Hace:** refina una sola historia justo antes de construirla.

**Pasos:**

1. Lee la historia y revisa el código y `CLAUDE.md` para contexto.
2. Propone 2-3 criterios de aceptación en Given/When/Then, describiendo **qué ve o recibe el usuario**, nunca cómo se implementa.
3. Si necesita más de tres criterios, **no lo infla: propone dividir la historia**.
4. Plan de máximo 5 bullets, sin código ni nombres de archivo.
5. Espera aprobación.

**Reglas duras:**

* Lo más simple que cumpla los criterios. Sin abstracciones, capas, configuración ni patrones "para el futuro".
* **Sugerir, no decidir**: un patrón solo se menciona bajo "Sugerencias" y solo si hay una señal concreta en el código (algo que ya se repite), nunca en preventiva.
* No escribir código.

**Formato de salida:** un bloque listo para pegar en el issue, con `## Out of scope`. Ese apartado es el que impide que entre la sobreingeniería por la puerta de "tenía sentido".

**Lo que le falta:** no declara qué módulos toca la historia. Con tres personas eso genera colisiones.

## `/pair`

**Hace:** pair programming con la IA como driver y el humano como navigator. Una historia por sesión.

**Paso 2, la idea clave de todo el repo:**

> Proponer **la lista de tests: solo nombres, sin escribirlos todavía**. Indicar dónde se prueba cada uno (endpoint, servicio, componente), prefiriendo el nivel más alto posible. Marcar los criterios que no se pueden testear bien (visuales) como **verificación manual**. Esperar aprobación. *"Esta lista es el spec: lo apruebo yo, no tú."*

Eso resuelve el problema del verificador que dice que sí: la verificación deja de ser la opinión de otro agente y pasa a ser un comando que devuelve rojo o verde.

**Ciclo:** un paso = un test. Escribir el test, ejecutarlo y **mostrar que falla**, escribir el **código mínimo** para que pase, ejecutarlo y mostrar que pasa. Por defecto un paso y parar.

**Condiciones de parada inmediata, incluso a mitad de lote:**

* Hace falta una decisión de diseño que no está en el plan.
* Se piensa en añadir algo no pedido, aunque parezca razonable.
* Hacer pasar un test requeriría cambiarlo, saltarlo o borrarlo.
* Dos intentos sin verde.
* El paso supera ~50 líneas o toca más de 3 archivos: proponer dividirlo.

**Reglas de test:**

* El valor esperado viene del criterio de aceptación, **nunca calculado con la misma lógica que el código**.
* Probar comportamiento a través de la interfaz pública, no detalles internos.

**Cierre:** verificar juntos los criterios manuales, sugerir un `/code-review` con contexto limpio (el agente no se autorrevisa), sugerir refactor solo con tests en verde y nunca mezclado con funcionalidad nueva, y **nunca commitear**.

## Evaluación

### Lo que se adopta tal cual

| Idea | Por qué |
|---|---|
| La lista de tests como spec aprobado por el humano | Verificación ejecutable en lugar de opinión |
| Las condiciones de parada | Son cicatrices reales de fallos documentados por Beck |
| `Out of scope` en cada historia | La principal puerta de entrada de la sobreingeniería |
| "El valor esperado no se calcula con la lógica del código" | Evita tests que pasan siempre |
| Un paso, luego parar | Mantiene al humano dentro del bucle |
| Prohibido commitear | El humano conserva el control del historial |
| No inventar requisitos; preguntar | La regla más importante de todas |

### Lo que falta para un equipo

| Hueco | Consecuencia real |
|---|---|
| No hay asignación de historias | Dos personas cogen la misma |
| No hay fronteras declaradas | Colisiones de merge constantes |
| No hay contrato compartido | La forma de la API y del modelo se decide tres veces |
| No hay revisión por otra persona | El agente se autorrevisa y el humano aprueba lo suyo |
| No hay gate de demo | Tests verdes no son producto |
| No hay criterio de "entendido" | Nadie sabe si el humano comprende lo que aprobó |
| No hay reglas de git | Ramas eternas, commits mezclados |

### Sobre el propio repo

Es un *bundle de prompts*, no un método validado: tres commits, un autor, sin casos de estudio. Y eso es un argumento a favor en este contexto: ~150 líneas que se leen en diez minutos y se pueden adaptar. Lo contrario de un framework.

## Cómo se traduce a OpenCode

En OpenCode V2 la distinción relevante es:

* **Skill** (`.opencode/skills/<id>/SKILL.md`): conocimiento que el agente carga cuando lo necesita. Puede llevar `metadata.opencode/autoinvoke: false` para no anunciarse y cargarse solo por ID.
* **Command** (`.opencode/commands/<id>.md`): plantilla de prompt que **el humano dispara** con `/id`.

Los flujos de trabajo son comandos, porque el humano decide cuándo aplicarlos. Las reglas de referencia (git, criterios de un corte vertical, cómo se escribe un test) son skills, porque el agente debe consultarlas al ejecutar.

## Fuentes

* [hola-ai — nschurmann (skills/backlog, skills/story, skills/pair)](https://github.com/nschurmann/hola-ai) — consultado: 2026-10-25
* [Skills — OpenCode V2](https://opencode.ai/v2/docs/skills/) — consultado: 2026-10-25
* [Commands — OpenCode V2](https://opencode.ai/v2/docs/commands/) — consultado: 2026-10-25
* [TDD, AI agents and coding with Kent Beck — The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) — consultado: 2026-10-25

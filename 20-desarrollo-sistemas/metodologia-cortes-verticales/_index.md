# Metodología de cortes verticales (MOC)

Método de trabajo para desarrollar software con IA en equipo, donde el humano decide, el código se entiende y cada entrega es visible y usable. Nace de un fracaso concreto: un proyecto de siete microservicios planificado entero con Spec-Driven Development.

Esta carpeta es **material en bruto para construir, en otra sesión, una plantilla diagnóstica** aplicable a proyectos relativamente grandes. No es todavía esa plantilla.

## Ruta de lectura

Si vienes de cero, en este orden:

1. [Contexto: el proyecto de microservicios](contexto-proyecto-microservicios.md) — qué pasó y por qué.
2. [Crítica al Spec-Driven Development](critica-al-spec-driven-development.md) — el video, los autores, y dónde se pasan de frenada.
3. [Análisis de las skills de hola-ai](skills-hola-ai-analisis.md) — las tres skills del video, leídas y evaluadas.
4. [Cortes verticales y pair programming](cortes-verticales-y-pair-programming.md) — los conceptos que sostienen todo.
5. [Flujo propuesto para el equipo](flujo-propuesto-equipo.md) — la propuesta completa.

## Notas

* [Contexto: el proyecto de microservicios](contexto-proyecto-microservicios.md)
* [Crítica al Spec-Driven Development](critica-al-spec-driven-development.md)
* [Análisis de las skills de hola-ai](skills-hola-ai-analisis.md)
* [Cortes verticales y pair programming](cortes-verticales-y-pair-programming.md)
* [Flujo propuesto para el equipo](flujo-propuesto-equipo.md)
* [El mapa del código y la comprensión](mapa-del-codigo-y-comprension.md)
* [Dónde viven las historias](donde-viven-las-historias.md)
* [Monorepo, migraciones y contratos](monorepo-migraciones-y-contratos.md)
* [Cultura de tests: el paso cero](cultura-de-tests-paso-cero.md)

## Las cinco reglas que resumen el método

1. El spec no vive en el repo: vive en el issue. El repo es código y contratos.
2. La unidad de trabajo es la historia vertical, no el módulo ni la capa.
3. El humano es el gate; la IA es el driver.
4. Si no puedes demostrarlo en cinco minutos, no está terminado.
5. Si no puedes explicar el recorrido clic → base de datos, la historia era demasiado grande.

## Para convertir esto en plantilla diagnóstica

Lo que falta y conviene producir después:

* Un cuestionario de arranque por proyecto (¿monorepo?, ¿tracker?, ¿tests hoy?, ¿cuántos programadores?, ¿producto vivo o entrega con fecha?).
* Una versión de los seis comandos como archivos `.opencode/commands/*.md` listos para copiar.
* Una plantilla de `AGENTS.md` y de `CONTRIBUTING.md` parametrizada por stack.
* Criterios de abandono: cuándo el método no aplica (prototipo desechable, script de una tarde, entrega con fecha imposible).

## Ver también

* [Desarrollo de sistemas](../_index.md)
* [Contrato de ejecución para agentes](../ia/contrato-de-ejecucion-para-agentes.md) — cómo se relaciona con esta propuesta.

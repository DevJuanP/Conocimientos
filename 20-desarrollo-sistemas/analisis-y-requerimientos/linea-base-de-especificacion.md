---
title: Línea base de especificación
area: desarrollo
tags: [desarrollo, analisis-requerimientos]
created: 2026-10-16
updated: 2026-10-16
related: ["../plantillas-proyecto/_index.md", "../arquitectura/integracion-apis/contratos-entre-fronteras.md", "../ia/contrato-de-ejecucion-para-agentes.md"]
---

# Línea base de especificación

Conjunto de documentos que deben estar cerrados y aprobados **antes** de planificar la construcción de un sistema. En ingeniería de requisitos se llama *baseline*: una versión congelada, verificable y trazable del *qué* y el *cómo* acordados. Su elaboración cubre SWEBOK cap. 1 (requisitos) y cap. 2 (diseño), con normas aplicables como ISO/IEC/IEEE 29148:2018, ISO/IEC 25010, arc42, C4 y WCAG 2.2.

## Regla central

Nada se planifica ni se implementa hasta que la línea base esté aprobada. Los planes de ejecución son **artefactos derivados** de ella; si se escriben antes, se construyen sobre supuestos no verificados y generan retrabajo.

## Las cuatro preguntas

| Pregunta | Dimensión | Artefactos |
|---|---|---|
| ¿Por qué y para quién? | Dirección | Visión, alcance, stakeholders, métricas |
| ¿Qué debe hacer? | Requisitos | SRS, RF, RNF, reglas de negocio |
| ¿Cómo se comporta y se ve? | Comportamiento y diseño | Flujos, design system, prototipos |
| ¿Cómo se construye y se conecta? | Arquitectura y contratos | arc42/C4, ADRs, modelo de datos, OpenAPI |

Todo lo demás (planes, tareas, sprints) es derivado y trazable hacia esos cuatro bloques.

## 1. Capa de dirección — por qué y para quién

| Documento | Propósito | Base formal |
|---|---|---|
| Visión y alcance | Problema, propuesta de valor, frontera del sistema (qué queda fuera) | IEEE 29148 §9.3 |
| Registro de stakeholders | Quién decide, opera y audita | RUP, BABOK |
| Objetivos y métricas de éxito | KPIs, criterios de éxito a nivel producto | OKR, ISO 25010 |
| Restricciones, supuestos y dependencias | Presupuesto, plazos, tecnología impuesta, terceros | IEEE 29148 §9.5 |
| Glosario y lenguaje ubicuo | Un solo significado por término | DDD (Evans) |
| Análisis de riesgos | Riesgos técnicos, de negocio y de cumplimiento | ISO 31000 |

Sin esta capa los requisitos son opinables y el diseño no tiene criterio de validez.

## 2. Capa de definición — qué debe hacer

| Documento | Contenido | Base formal |
|---|---|---|
| Especificación de Requisitos (SRS) | Requisitos funcionales, interfaces externas, restricciones | ISO/IEC/IEEE 29148 |
| Requisitos no funcionales (RNF) | Rendimiento, seguridad, usabilidad, mantenibilidad, escalabilidad | ISO/IEC 25010 |
| Reglas de negocio | Políticas, validaciones, invariantes del dominio | BABOK |
| Casos de uso e historias de usuario | Actor, disparador, flujo principal, alternos y de excepción | UML 2.5, Cockburn |
| Criterios de aceptación | Condiciones verificables, idealmente en Gherkin (Dado/Cuando/Entonces) | BDD, Cucumber |
| Modelo de dominio | Entidades, agregados, relaciones, invariantes | DDD |

Un requisito según IEEE 29148 debe ser **necesario, no ambiguo, completo, consistente, verificable y trazable**. Un requisito no verificable es un defecto de especificación y debe convertirse en métrica: "debe ser rápido" → "p95 < 300 ms con 1000 usuarios concurrentes".

## 3. Capa de comportamiento — cómo se usa

| Documento | Propósito | Notación |
|---|---|---|
| User flows y task flows | Recorrido del usuario hacia un objetivo | Diagramas de flujo, mapa de navegación |
| Diagramas de actividad y de estado | Lógica de procesos y máquinas de estado | UML 2.5 |
| Modelado de procesos de negocio | Procesos con actores, eventos y compuertas | BPMN 2.0 |
| Mapa de navegación (IA) | Jerarquía de pantallas y rutas | Sitemap |
| Especificación de interacciones | Estados vacío, carga, error, éxito, sin permisos | Heurísticas de Nielsen |
| Diagramas de secuencia | Intercambio temporal entre componentes | UML 2.5 |

Cada flujo debe declarar su criterio de éxito y sus caminos de excepción. Un flujo "feliz" sin manejo de errores es una especificación incompleta.

## 4. Capa de diseño — cómo se ve y se siente

| Documento | Contenido | Base formal |
|---|---|---|
| Sistema de diseño | Componentes, patrones, reglas de composición | Atomic Design (Frost) |
| Design tokens | Color, tipografía, espaciado, radios, sombras, motion, en formato máquina-legible | W3C Design Tokens (DTCG) |
| Paleta de color | Roles semánticos (primario, superficie, error) y contraste AA/AAA | WCAG 2.2 (≥ 4.5:1) |
| Tipografía y escala | Familias, pesos, escala modular, line-height | Escala tipográfica |
| Grid, layout y breakpoints | Rejilla, escala de espaciado, diseño responsivo | Sistemas 4/8 pt |
| Guía de estilo visual | Iconografía, ilustración, tono de voz | Style guide |
| Wireframes, mockups y prototipo | De lo estructural a lo validable | Diseño iterativo |
| Estados y accesibilidad | Foco, hover, disabled, aria, navegación por teclado | WCAG 2.2 |

Punto crítico: los design tokens deben existir como artefacto versionado (JSON o variables CSS), no solo como imagen de Figma. Eso convierte el diseño en un contrato verificable. Ver [Refero Styles y DESIGN.md](../buenas-practicas/refero-styles-design-md.md).

## 5. Capa de arquitectura y contratos — cómo se construye y se conecta

| Documento | Contenido | Base formal |
|---|---|---|
| Documento de arquitectura | Contexto, restricciones, bloques, runtime, despliegue, riesgos | arc42 |
| Vistas arquitectónicas | Contexto, contenedores, componentes, código | C4 Model |
| Vistas 4+1 | Lógica, procesos, desarrollo, despliegue, escenarios | RUP / Kruchten |
| ADRs | Decisión, contexto y consecuencias | Nygard |
| Modelo de datos | ERD, diccionario de datos, tipos, índices, migraciones | Modelo entidad-relación |
| Diagrama de despliegue | Entornos, topología, redes, CI/CD | UML Deployment, C4 |

Los contratos entre fronteras (API, eventos, errores, autenticación, versionado) tienen su propia nota: [Contratos entre fronteras](../arquitectura/integracion-apis/contratos-entre-fronteras.md).

## 6. Capa de calidad y operación

| Documento | Propósito | Base formal |
|---|---|---|
| Estrategia y plan de pruebas | Niveles (unitario, integración, E2E), cobertura, herramientas | ISO/IEC/IEEE 29119 |
| Criterios de aceptación y DoD | Cuándo una tarea está terminada | Scrum, XP |
| Matriz de trazabilidad (RTM) | Requisito → diseño → tarea → prueba | IEEE 29148 |
| Plan de accesibilidad | Nivel objetivo WCAG y auditorías | WCAG 2.2 |
| Umbrales de calidad | Cobertura, deuda técnica, latencia, performance budget | Performance budgets |
| Modelo de amenazas | Activos, adversarios, vectores, mitigaciones | STRIDE, OWASP ASVS |
| Observabilidad | Logs, métricas, trazas, alertas, dashboards | SRE (SLI/SLO, error budget) |
| Plan de despliegue y entornos | Dev/Stage/Prod, promoción, rollback | DevOps |
| Runbook y cumplimiento | Procedimientos, incidentes, retención de datos | ITIL, SRE, GDPR |

## Orden de elaboración y puertas de calidad

Cada capa depende de la anterior. La secuencia formal es dirección → requisitos → flujos → diseño → arquitectura y contratos → calidad y seguridad. Sólo entonces se autoriza el plan de ejecución.

La **puerta de aprobación** (*gate*) exige que:

1. Todos los RF y RNF son verificables y trazables.
2. Los flujos cubren caminos alternos y de excepción.
3. Los design tokens y componentes están versionados.
4. Los contratos de API son validables por herramienta.
5. La arquitectura y sus ADRs están registrados.
6. Existe estrategia de pruebas y modelo de amenazas.
7. La matriz de trazabilidad no tiene huecos.

## Trazabilidad

Toda la metodología se sostiene en una cadena, respondible en ambos sentidos:

```text
Objetivo -> Requisito -> Flujo -> Diseño -> Contrato -> Tarea -> Prueba
```

"¿Este requisito está implementado?" y "¿esta tarea responde a qué requisito?". Sin esta cadena la completitud es una opinión.

## Checklist mínimo

- Visión, alcance, stakeholders y métricas de éxito
- Glosario de lenguaje ubicuo
- SRS con requisitos funcionales verificables
- RNF con métricas (ISO 25010)
- Reglas de negocio e invariantes del dominio
- Casos de uso con criterios de aceptación (Gherkin)
- User flows con caminos de excepción y diagramas de estado
- Design system, design tokens versionados y paleta con roles
- Wireframes, mockups y prototipo validado
- Guía de accesibilidad (WCAG 2.2, nivel objetivo)
- Documento de arquitectura (arc42/C4) y ADRs
- Modelo de datos con diccionario
- Contratos OpenAPI/AsyncAPI/GraphQL validables
- Contrato de errores y de autenticación
- Estrategia de pruebas y DoD
- Modelo de amenazas (OWASP ASVS)
- Matriz de trazabilidad sin huecos
- Gate: línea base aprobada
- Contrato de ejecución (WBS, DAG, hitos, contratos de tarea, DoR)

## Anti-patrones

| Anti-patrón | Consecuencia |
|---|---|
| Planificar antes de tener requisitos verificables | Retrabajo, alcance cambiante |
| SRS en prosa sin criterios medibles | Imposible verificar |
| Diseño solo en Figma, sin tokens | Implementación inconsistente |
| Contratos de API en un documento, no en OpenAPI | Deriva front/back |
| Flujos sin caminos de excepción | Errores en producción |
| Arquitectura no documentada ni decidida | Deuda técnica estructural |
| Sin matriz de trazabilidad | No se sabe qué falta |
| Tareas sin contrato para el ejecutor | Ambigüedad e invención |

## Ver también

* [Análisis y requerimientos](./analisis-y-requerimientos.md)
* [Plantillas de proyecto](../plantillas-proyecto/_index.md)
* [Contratos entre fronteras](../arquitectura/integracion-apis/contratos-entre-fronteras.md)
* [Contrato de ejecución para agentes](../ia/contrato-de-ejecucion-para-agentes.md)
* [Refero Styles y DESIGN.md](../buenas-practicas/refero-styles-design-md.md)

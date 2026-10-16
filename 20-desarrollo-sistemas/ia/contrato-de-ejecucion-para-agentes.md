---
title: Contrato de ejecución para agentes
area: desarrollo
tags: [desarrollo, desarrollo/ia, buenas-practicas]
created: 2026-10-16
updated: 2026-10-16
related: ["../analisis-y-requerimientos/linea-base-de-especificacion.md", "../arquitectura/integracion-apis/contratos-entre-fronteras.md", "../plantillas-proyecto/03-planificacion/plan-hitos.md"]
---

# Contrato de ejecución para agentes

Artefacto que gobierna la construcción una vez que la [línea base de especificación](../analisis-y-requerimientos/linea-base-de-especificacion.md) está cerrada y aprobada. Es el acuerdo verificable entre quien especifica y quien implementa (una persona o una IA), que descompone la línea base en unidades de trabajo con entradas, salidas y criterios de aceptación, y define orden y dependencias. Se redacta **después** de la especificación, nunca antes: es un documento derivado.

## Por qué existe

Un ejecutor —humano o agente— no puede trabajar con ambigüedad. Pedir "construye la app" produce invención. Darle un contrato verificable produce implementación. Esta es la base práctica de lo que se conoce como **Spec-Driven Development** y **contract-first**: no se pide creatividad no acotada, se pide satisfacer un contrato comprobable.

## Definition of Ready (DoR)

Condiciones para que una tarea pueda iniciarse:

* Existe el requisito de origen y sus criterios de aceptación.
* Existe el contrato que consume (API, evento, token, diseño).
* Dependencias resueltas y sin bloqueadores abiertos.
* Alcance acotado: se sabe qué NO incluye.
* Definido cómo se verificará.

## Definition of Done (DoD)

Condiciones objetivas de finalización:

* Criterios de aceptación cumplidos y evidenciados.
* Pruebas definidas en la especificación pasando.
* Contrato respetado (validado por herramienta cuando aplique).
* Sin huecos en la trazabilidad de esa tarea.
* Documentación afectada actualizada.

## Descomposición del trabajo

| Elemento | Contenido |
|---|---|
| WBS | Jerarquía entregable → tarea → subtarea |
| DAG de dependencias | Qué bloquea a qué y cuál es la ruta crítica |
| Plan de fases e hitos | Entregables por fase y criterio de cierre |
| Contrato de tarea | Unidad autocontenida lista para un ejecutor |
| Control de cambios | Cómo se gestiona una desviación de la especificación |

## Contrato de tarea

La unidad mínima que un ejecutor puede recibir sin ambigüedad:

```text
TAREA:      <id y título>
CONTEXTO:   <enlaces a especificación, diseño y ADRs relevantes>
ENTRADA:    <contrato o artefacto que consume>
SALIDA:     <entregable exacto, formato y ubicación>
REGLAS:     <restricciones, convenciones, tokens, estilo>
ACEPTACION: <criterios verificables y pruebas que deben pasar>
FUERA DE:   <qué NO debe tocar>
EVIDENCIA:  <cómo probar que está hecho>
```

Cada tarea debe poder responderse en dos direcciones: qué requisito la origina y qué prueba la valida. Esto la conecta con la matriz de trazabilidad de la línea base.

## Gate de aprobación

La construcción arranca solo si: la línea base está aprobada, el DoR se cumple por tarea y existe evidencia definida de cierre. Si durante la ejecución aparece un requisito no previsto, no se improvisa: se trata como cambio contra la especificación y se reabre la línea base afectada.

## Relación con la planificación del vault

Los documentos de planificación ya existen como plantillas en [Plantillas de proyecto](../plantillas-proyecto/_index.md):

* [Plan e hitos](../plantillas-proyecto/03-planificacion/plan-hitos.md)
* [Riesgos y supuestos](../plantillas-proyecto/03-planificacion/riesgos-supuestos.md)
* [Criterios de aceptación](../plantillas-proyecto/04-calidad/criterios-aceptacion.md)
* [Plan de pruebas](../plantillas-proyecto/04-calidad/plan-pruebas.md)

El contrato de ejecución los usa como sustrato: las plantillas fijan la forma de cada documento y esta nota fija el orden y las condiciones para que la construcción esté autorizada.

## Checklist

- DoR y DoD escritos y verificables.
- WBS completa y con alcance acotado por tarea.
- DAG de dependencias con ruta crítica identificada.
- Cada tarea tiene contrato de tarea autocontenido.
- Existe proceso de control de cambios contra la especificación.
- Cada tarea es trazable a un requisito y a una prueba.

## Ver también

* [Línea base de especificación](../analisis-y-requerimientos/linea-base-de-especificacion.md)
* [Contratos entre fronteras](../arquitectura/integracion-apis/contratos-entre-fronteras.md)
* [Plantillas de proyecto](../plantillas-proyecto/_index.md)
* [OpenCode - Orquestación de agentes e IA](./opencode-orquestacion-agentes.md)

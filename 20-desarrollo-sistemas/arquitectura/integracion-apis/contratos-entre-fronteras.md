---
title: Contratos entre fronteras
area: desarrollo
tags: [desarrollo, arquitectura, analisis-requerimientos]
created: 2026-10-16
updated: 2026-10-16
related: ["../../analisis-y-requerimientos/linea-base-de-especificacion.md", "../../buenas-practicas/refero-styles-design-md.md", "../../plantillas-proyecto/02-diseno/diseno-interfaces.md"]
---

# Contratos entre fronteras

Acuerdos verificables entre dos partes del sistema —front y back, servicio y servicio, diseño e implementación— que fijan la forma exacta del intercambio antes de escribir código. Es la frontera que más errores de integración produce, y donde el enfoque **contract-first** (contrato primero) aporta más valor: el contrato es la fuente de verdad, no una descripción en prosa escrita después.

## Principio contract-first

El contrato se redacta y se valida con herramienta **antes** de implementar ambos lados. Si es ejecutable, front y back pueden desarrollarse en paralelo sin sincronización manual. Si solo existe como texto, cuando llega la integración aparece la deriva (los campos no coinciden, los errores tienen formas distintas, los estados no están previstos).

## Contratos entre servicios (back)

| Documento | Propósito | Estándar |
|---|---|---|
| Contrato de API REST | Rutas, métodos, esquemas de request/response, códigos | OpenAPI 3.1 |
| Contrato de eventos y mensajería | Canales, mensajes, esquemas asíncronos | AsyncAPI |
| Contrato GraphQL | Tipos, queries, mutaciones, suscripciones | GraphQL SDL |
| Esquemas de datos | Validación y tipos compartidos | JSON Schema |
| Formato de errores | Estructura uniforme de error y códigos | RFC 9457 (Problem Details) |
| Contrato de autenticación | Flujos, tokens, roles, scopes | OAuth 2.1 / OIDC |
| Versionado y compatibilidad | SemVer del API, política de deprecación | SemVer |

El contrato de errores merece atención propia: la mayoría de los fallos de integración no son de datos válidos, sino de cómo se comunican los datos **inválidos**. Un formato común (tipo, título, detalle, código, campo) elimina una clase entera de defectos.

## Contrato de UI ↔ API (front)

El front no consume endpoints sueltos: consume un contrato. Para cada endpoint debe quedar definido:

* Qué estado de UI dispara (carga, vacío, error, éxito, sin permisos).
* Qué campos son obligatorios y cuáles opcionales, y qué pasa si falta uno.
* Qué hacer ante cada código de error y ante fallos de red.
* Si hay paginación, caché, reintentos o invalidación.
* Si la respuesta se transforma o se consume literal.

Sin esta capa, cada pantalla reinventa el manejo de errores y el resultado es inconsistente.

## Contrato diseño ↔ implementación

El diseño también es un contrato si se expresa en formato máquina-legible. Los **design tokens** versionados (JSON según W3C DTCG, o variables CSS) fijan color, tipografía, espaciado y radios; la implementación los consume en lugar de inventar valores.

Regla: no debe existir un hex, un tamaño o un radio fuera de los tokens. Si el valor no es un token, es una desviación que se detecta en revisión. Ver [Refero Styles y DESIGN.md](../../buenas-practicas/refero-styles-design-md.md).

## Trazabilidad de contratos

Cada contrato conecta una necesidad con una implementación:

```text
Caso de uso -> Endpoint/tema -> Contrato (OpenAPI/AsyncAPI) -> Tarea -> Prueba de contrato
```

Pruebas de contrato (*contract testing*) verifican que el proveedor y el consumidor coinciden con lo especificado, sin necesidad de desplegar ambos y hacer una prueba de extremo a extremo.

## Checklist de contratos

- Existe contrato formal para cada frontera (REST, eventos, GraphQL).
- Los contratos son validables por herramienta, no solo legibles.
- El formato de errores está definido y es uniforme (RFC 9457).
- El contrato de autenticación define tokens, roles y scopes.
- Hay política de versionado y deprecación (SemVer).
- El front documenta estados de UI por endpoint.
- Los design tokens están versionados y son la única fuente de valores visuales.
- Hay pruebas de contrato entre proveedor y consumidor.

## Ver también

* [Línea base de especificación](../../analisis-y-requerimientos/linea-base-de-especificacion.md)
* [Diseño de interfaces](../../plantillas-proyecto/02-diseno/diseno-interfaces.md)
* [SOAP vs REST](./soap-vs-rest.md)
* [Refero Styles y DESIGN.md](../../buenas-practicas/refero-styles-design-md.md)
* [Integración de APIs](./_index.md)

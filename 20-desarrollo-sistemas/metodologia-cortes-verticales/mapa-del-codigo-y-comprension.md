---
title: El mapa del código y la comprensión
area: desarrollo
tags: [desarrollo, buenas-practicas, testing]
created: 2026-10-25
updated: 2026-10-25
related: ["./flujo-propuesto-equipo.md", "./contexto-proyecto-microservicios.md"]
---

# El mapa del código y la comprensión

El problema central del proyecto de siete microservicios no fue la lentitud: fue que **nadie entendía el código**. Este es el mecanismo que lo resuelve, y es la pieza que no existe en hola-ai ni en ninguna de las fuentes revisadas.

## Por qué los tests verdes no bastan

Un test en verde dice que el comportamiento observable es el esperado. No dice que el humano sepa dónde vive la decisión, ni qué se decidió **no** construir, ni por dónde entraría un cambio futuro.

Se puede tener el 100 % de cobertura y no poder explicar el sistema. Los tests protegen contra regresiones; no transfieren comprensión.

## La prueba de comprensión: cuatro preguntas

Antes de mergear, en voz alta:

1. ¿Puedo arrancarlo y usarlo?
2. ¿Puedo explicar qué pasa desde el clic hasta la base de datos?
3. ¿Puedo predecir dónde iría un cambio nuevo?
4. ¿Puedo nombrar lo que decidí **no** construir?

Si una historia no deja responder las cuatro, la historia era demasiado grande. Es una definición operativa de "código entendible", mucho más útil que la palabra "entendible".

## El mapa del PR

Cinco bullets, escritos por quien programó, corregidos por quien revisa:

```markdown
## Mapa
- Entra por:                     <archivo:línea del punto de entrada>
- Recorrido:                     <clic → ... → tabla, en 3-4 pasos>
- La decisión vive en:           <dónde está la lógica que importa>
- Para añadir X mañana, tocaría: <archivo/módulo>
- Lo que decidí NO construir:    <...>
```

### Reglas

* El agente puede redactar el borrador. **El humano lo corrige.** Si no puede corregirlo, no mergea.
* Va en la descripción del PR, no en un archivo del repo. Cero mantenimiento.
* Si el mapa tiene que explicar cinco archivos para un cambio pequeño, el diseño está mal, no la explicación.

### Por qué en el PR y no en un documento

Porque el PR ya existe, ya tiene fecha, ya tiene autor y ya tiene revisor. Un documento aparte se desactualiza el día que deja de ser obligatorio. El historial de PR de `main` se convierte en el documento de onboarding del proyecto, gratis, escrito por quien lo entendió.

## Mapa y rotación de roles

| Quién | Qué hace |
|---|---|
| Quien programó | Escribe el mapa |
| Quien revisa | Lo corrige y corre la demo |
| Quien no programa | Corre los criterios de aceptación desde fuera |

La rotación es deliberada: **el mapa lo escribe quien programó, la demo la corre quien no programó.** Eso obliga a que el código sea explicable a alguien que no lo escribió, que es exactamente la prueba que falló en el proyecto anterior.

## `AGENTS.md` como mapa permanente

El mapa del PR explica una historia. `AGENTS.md` explica el proyecto y se lee antes de cualquier sesión:

```markdown
# Proyecto X
<una línea: qué es y para quién>

## Comandos
- instalar:  <comando exacto>
- probar:    <comando exacto>
- correr:    <comando exacto>

## Estructura
- <carpeta>: <qué vive ahí, una línea por carpeta, máximo 6>

## Reglas duras
- <3-5 reglas que no se negocian>

## Contratos
- <dónde viven las superficies compartidas>
```

Una página. Si crece, se está usando como archivo, no como mapa.

## Anti-patrones que este mecanismo previene

| Anti-patrón | Cómo lo frena el mapa |
|---|---|
| PR de 2000 líneas aprobado con un "LGTM" | No se puede escribir el recorrido de 2000 líneas |
| Código que solo entiende su autor | El revisor tiene que corregir el mapa |
| Abstracciones sin dueño | "La decisión vive en" obliga a señalar un sitio concreto |
| Sobreingeniería | "Lo que decidí NO construir" hace visible lo que se añadió de más |
| Documentación muerta | Vive en el PR, no en un `docs/` que nadie abre |

## Ver también

* [Flujo propuesto para el equipo](./flujo-propuesto-equipo.md)
* [Contexto: el proyecto de microservicios](./contexto-proyecto-microservicios.md)
* [Contrato de ejecución para agentes](../ia/contrato-de-ejecucion-para-agentes.md)

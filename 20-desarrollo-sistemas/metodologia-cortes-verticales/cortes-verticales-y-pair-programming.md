---
title: Cortes verticales y pair programming
area: desarrollo
tags: [desarrollo, buenas-practicas, testing, desarrollo/ia]
created: 2026-10-25
updated: 2026-10-25
related: ["./flujo-propuesto-equipo.md", "./cultura-de-tests-paso-cero.md", "./critica-al-spec-driven-development.md"]
---

# Cortes verticales y pair programming

Los dos conceptos técnicos que sostienen la propuesta. Son independientes de la tecnología: se aplican igual en React, Angular, Spring Boot, Node o .NET.

## Corte vertical (vertical slice)

Una porción de funcionalidad **completa** que atraviesa todas las capas: interfaz, HTTP, lógica, persistencia. Termina en algo que una persona puede usar.

### Corte vertical vs corte horizontal

| Horizontal (lo que falló) | Vertical (la propuesta) |
|---|---|
| Primero el esquema de base de datos | Primero "el usuario puede iniciar sesión" |
| Luego los endpoints | La tabla `usuarios` nace dentro de esa historia |
| Luego el frontend | El frontend nace dentro de esa historia |
| Nada es usable hasta el final | Cada historia es usable al terminar |
| Los errores de integración aparecen al final | Aparecen en la primera hora |
| El producto existe en la semana 12 | El producto existe el día 2 |

El corte horizontal no es un error de gusto: es la razón por la que no se pudo ver nada hasta el final. No es que el orden fuera incómodo; es que **impedía la retroalimentación**.

### Propiedades de un buen corte

1. **Atraviesa todas las capas.** Si solo toca base de datos o solo backend, no es una historia: es una tarea técnica disfrazada.
2. **Entrega valor observable.** Alguien que no programa puede verificar si está.
3. **Es demostrable en cinco minutos.** Si la demo requiere explicaciones, el corte está mal.
4. **Se puede desplegar solo.** Si necesita esperar a otra historia para funcionar, el corte no está terminado.
5. **Cabe en dos días.** Si no cabe, se parte.

### El walking skeleton

La primera historia no es "el microservicio de login". Es **login de punta a punta, desplegado, con el que se puede jugar**: gateway, autenticación, base de datos, front, y el comando que lo arranca.

Ese primer corte establece lo que después nadie revisa dos veces:

* la estructura de carpetas,
* el comando de instalación, de tests y de arranque,
* el pipeline de integración,
* un camino completo desde un clic hasta una fila en una tabla.

Es, además, el mapa que faltaba en el proyecto de siete microservicios. Todos leen ese diff. Es el único diff que el equipo entero debería revisar línea a línea.

### Arquitectura emergente

La regla: **no se añade una abstracción hasta que algo duela dos veces**. No un patrón "porque en el futuro". La señal es concreta: el mismo código aparece repetido, o hay que cambiar tres archivos para un cambio pequeño.

Esto no es pereza. Es la razón por la que un equipo con IA no acaba con siete microservicios: la presión del corte vertical empuja de forma natural hacia menos piezas desplegables.

## AI pair programming

Reparto de roles explícito:

* **Driver = la IA.** Tiene el teclado, escribe rápido.
* **Navigator = el humano.** Diseña, anticipa errores, decide qué **no** construir, decide cuándo refactorizar.

### Por qué el humano no puede soltar el volante

Kent Beck lo formula así: el agente es bueno añadiendo funcionalidad, y muy malo manteniendo el código flexible para cambios futuros. Si no corriges el rumbo, la base de código acaba en la cuneta con rapidez.

El matiz importante para este equipo: la IA **ahorra tiempo de escritura, no de pensamiento**. El humano sigue siendo responsable de la arquitectura y de la integridad del código.

### El ciclo

```
test → rojo (verlo fallar) → código mínimo → verde → parar → refactor aparte
```

Reglas que hacen que el ciclo no se corrompa:

* **El valor esperado del test viene del criterio de aceptación**, nunca calculado con la misma lógica que el código. Un test que replica la implementación siempre pasa y no verifica nada.
* **Ver el rojo antes del verde.** Un test que nunca falló no se sabe si prueba algo.
* **Código mínimo.** Nada que el test no exija.
* **Refactor con tests en verde y como paso separado.** Nunca mezclado con funcionalidad nueva.

### Las tres alarmas

Son las tres formas en que la IA rompe el ciclo, y las tres son observables:

1. **Bucle infinito.** Repite el mismo enfoque fallido. Señal: dos intentos sin verde.
2. **Sobreingeniería.** Añade capas, configuración, manejo de errores para casos que no existen. Señal: el diff incluye cosas que no menciona ningún criterio.
3. **Trampa en los tests.** Modifica, salta o borra un test para poner verde.

La tercera es la más peligrosa porque produce la señal de éxito sin el éxito. Beck la documentó en sus propios agentes: querían escribir el código y luego escribir tests que pasaran.

Traducción operativa: **hacer pasar un test modificándolo es una condición de parada inmediata**, no un detalle de estilo.

### Cuándo dejar de usar el par

* Cuando el humano no puede revisar el diff en menos de quince minutos. El corte era demasiado grande.
* Cuando el paso toca más de tres archivos o más de ~50 líneas.
* Cuando el humano no puede predecir dónde iría el siguiente cambio.

Esa tercera condición es la más honesta: si no puedes predecir dónde vive el próximo cambio, no entendiste el código, solo lo aprobaste.

## Nota sobre el límite del método

El pair programming con IA es más lento por historia que pedirle a la IA que lo haga todo. La apuesta es que es más rápido por proyecto: porque se puede paralelizar entre tres personas y porque cambiar algo después no cuesta una semana.

Si en dos semanas no se nota que se entiende más el código, el método está mal calibrado, no es que falte más método.

## Fuentes

* [TDD, AI agents and coding with Kent Beck — The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) — consultado: 2026-10-25
* [Kent Beck — resúmenes de ensayos (augmented coding, genie)](https://kentbeck.com/summaries) — consultado: 2026-10-25
* [hola-ai — skill /pair](https://github.com/nschurmann/hola-ai) — consultado: 2026-10-25
* [Spec-Driven Development (Hola Mundo) — video](https://www.youtube.com/watch?v=5JjuF1zpNbI) — consultado: 2026-10-25 (no verificable: HTTP 429)

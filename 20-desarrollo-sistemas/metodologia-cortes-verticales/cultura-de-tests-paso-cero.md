---
title: Cultura de tests - el paso cero
area: desarrollo
tags: [desarrollo, testing, buenas-practicas, desarrollo/ia]
created: 2026-10-25
updated: 2026-10-25
related: ["./cortes-verticales-y-pair-programming.md", "./flujo-propuesto-equipo.md", "../devops/_index.md"]
---

# Cultura de tests: el paso cero

El equipo sabe lo básico: se escribe un test y se pasa. Normalmente lo escribe la IA. Sin IA, no se escriben tests. Este documento cubre el hueco entre "sabemos que existen" y "el método funciona", sin fingir que el hueco no existe.

**Punto de partida honesto:** el flujo de cortes verticales depende de tests. Si no hay runner, no hay TDD posible. Esto es un prerrequisito, no un detalle.

## Lo que hay que tener antes de la primera historia

No hace falta madurez. Hace falta lo mínimo:

| Requisito | Cómo se comprueba |
|---|---|
| Un comando que corre todos los tests | `npm test`, `mvn test`, `dotnet test`, `./gradlew test` |
| Ese comando falla cuando un test falla | Escribir un test que falle a propósito y verlo |
| Se puede correr un solo test | Sin esto, el ciclo de un minuto es imposible |
| El resultado se lee sin interpretación | Verde o rojo, y el nombre del test que falló |

Si falta alguno, la primera sesión de trabajo es montarlo. No es una historia de producto; es infraestructura del proyecto, y se hace una vez.

## El único concepto que hay que entender

**Un test es una afirmación sobre el comportamiento, verificable por una máquina.**

Se compone de tres partes:

1. **Preparar** el estado (crear un usuario, insertar una fila).
2. **Actuar** (llamar al endpoint, hacer clic, invocar la función).
3. **Afirmar** el resultado esperado.

Eso es todo. El resto son variantes.

### La regla que hace que un test sirva

> **El valor esperado viene del criterio de aceptación, nunca se calcula con la misma lógica que el código.**

Ejemplo de test inútil:

```
esperado = calcularTotal(items)   // misma función que prueba
assert obtenerTotal(items) == esperado
```

Siempre pasa. No prueba nada.

Ejemplo de test útil:

```
// criterio: dos productos de 10 y uno de 5 dan 25, con IVA del 0 %
assert obtenerTotal([10, 10, 5]) == 25
```

El número 25 está escrito a mano porque viene del requisito.

## Los tres niveles, y cuál usar

| Nivel | Qué prueba | Cuándo | Coste |
|---|---|---|---|
| Unitario | Una función o clase aislada | Lógica con ramas y cálculos | Bajo de escribir, alto de mantener si se abusa |
| Integración | Varias piezas juntas (endpoint + base de datos) | Casi todo el backend | Medio |
| Extremo a extremo | El flujo completo desde la interfaz | Los caminos que el usuario recorre de verdad | Alto |

**La regla de hola-ai que vale la pena copiar:** preferir el **nivel más alto práctico**. Un test de endpoint que cubre controlador, servicio y base de datos prueba más comportamiento que tres tests unitarios y cuesta menos mantener.

Eso es especialmente cierto con IA: los tests de nivel alto son más difíciles de "hacer trampa" porque el valor esperado es observable desde fuera.

## Lo que no se puede testear

Algunas cosas no se testean bien: lo visual, lo que "se siente" mal, la accesibilidad real, el rendimiento percibido. No se fuerza un test malo. Se marcan como **verificación manual** en la lista de pruebas, y alguien las comprueba a mano antes de mergear.

Ese es el hueco donde entran los compañeros que no programan. Ver [El mapa del código y la comprensión](./mapa-del-codigo-y-comprension.md).

## Cómo se relaciona esto con la IA

Dos hechos documentados, no opiniones:

1. **Los agentes introducen regresiones.** Kent Beck lo dice sin rodeos: los tests son la red que evita que el agente rompa lo que ya funcionaba.
2. **Los agentes quieren poner verde sin arreglar.** Quieren escribir el código y después los tests que pasan; algunos borran el test que falla.

De ahí las tres reglas del flujo:

* Ver el rojo **antes** del verde. Un test que nunca falló no se sabe si prueba algo.
* Si hacer pasar un test exige modificarlo, **parar**. No es un detalle: es la alarma.
* El humano aprueba la **lista de tests** antes de que se escriban. Esa lista es el spec real.

## Plan de mejora en tres pasos

No se pasa de cero a TDD en una semana. Orden realista:

### Paso 1: un test por historia (semana 1-2)

No se pide cobertura. Se pide que cada historia tenga **al menos un test de nivel alto** que verifique su criterio principal. Ese test lo propone la IA y lo aprueba el humano.

Métrica honesta: ¿cuántas historias de las últimas cinco tienen un test que falla si se rompe la funcionalidad?

### Paso 2: la lista antes del código (semana 3-4)

Se adopta el ciclo completo: primero la lista de nombres de tests aprobada, después el código. Esto es lo que impide que la IA escriba el test a la medida de lo que ya hizo.

### Paso 3: un test que hayas escrito tú (semana 5+)

Escribir un test a mano, sin IA, al menos una vez por historia. No porque sea mejor, sino porque **es la única forma de aprender a evaluar los que escribe la IA**. Quien nunca ha escrito un test no puede distinguir uno bueno de uno que solo pasa.

Este paso es el que convierte a "sabemos que existen" en cultura.

## Anti-patrones frecuentes

| Anti-patrón | Síntoma | Consecuencia |
|---|---|---|
| Test que replica la implementación | Pasa siempre, incluso con bugs | Falsa confianza |
| Probar detalles internos | Cambiar un nombre de variable rompe el test | Miedo a refactorizar |
| Test sin aserción | Verde eterno | No prueba nada |
| Test que depende del orden | Pasa solo si se corre completo | Falla en CI de forma intermitente |
| Datos de prueba compartidos | Un test rompe otro | Depuración eterna |
| Test lento (>1s) | Nadie lo corre | Se desactiva |
| "Lo pruebo a mano" | No hay registro | Regresa sin que nadie lo note |

## Datos de prueba

Sin estrategia, los tests se vuelven frágiles. Lo mínimo:

* Cada test crea los datos que necesita y no depende de lo que dejó otro.
* La base de datos de test se puede recrear desde cero con un comando (aquí encaja Flyway: migraciones + datos semilla).
* Nunca se prueba contra la base de datos de desarrollo compartida.

## Criterio de "suficiente"

No hay un número de cobertura que garantice calidad. El criterio operativo:

> Cada criterio de aceptación tiene al menos una verificación: un test automático o una comprobación manual registrada.

Si un criterio no tiene ninguna de las dos, la historia no está terminada.

## Fuentes

* [TDD, AI agents and coding with Kent Beck — The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) — consultado: 2026-10-25
* [hola-ai — skill /pair](https://github.com/nschurmann/hola-ai) — consultado: 2026-10-25

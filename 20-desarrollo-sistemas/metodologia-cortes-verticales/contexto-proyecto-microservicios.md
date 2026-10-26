---
title: Contexto - el proyecto de microservicios
area: desarrollo
tags: [desarrollo, arquitectura, desarrollo/ia, buenas-practicas]
created: 2026-10-25
updated: 2026-10-25
related: ["./critica-al-spec-driven-development.md", "./flujo-propuesto-equipo.md", "../ia/contrato-de-ejecucion-para-agentes.md"]
---

# Contexto: el proyecto de microservicios

Punto de partida de esta carpeta. Un proyecto final de dos cursos (Desarrollo de Aplicaciones Web 2 y Desarrollo de Servicios Web 2), construido con Spec-Driven Development y una IA orquestadora, que se entregó y aprobó pero dejó una conclusión clara: **no volver a trabajar así**.

## Qué se construyó

Siete microservicios y dos frontends:

| Pieza | Rol |
|---|---|
| API Gateway | Punto de entrada único |
| Eureka | Descubrimiento de servicios |
| RabbitMQ | Mensajería asíncrona |
| Microservicio de login | Autenticación con su propia base de datos |
| Microservicios de dominio | Ventas, almacén y compañía |
| Front público | Cliente final |
| Front de administración | Gestión interna |

La decisión de pasar de monolito a siete microservicios **no salió de una necesidad medida**. Se justificó teóricamente: saturación de red, que el módulo de ventas saturaba, que almacén saturaba. Es un razonamiento plausible escrito *antes* de tener usuarios, que es exactamente el orden equivocado.

## Cómo se construyó

1. Se planificó absolutamente todo antes de escribir código: stack, arquitectura, `DESIGN.md` de cada front, especificaciones de cada servicio, planes de implementación, y planes que se ejecutaban con OpenSpec.
2. Una IA orquestadora coordinaba cuatro agentes:
   * un agente que ejecutaba los planes;
   * un agente que verificaba si el plan se había ejecutado bien (aunque el ejecutor dijera que sí);
   * un agente revisor;
   * un agente planificador de arreglos cuando algo se rompía.
3. Todo pasaba por ramas y pull requests.

El pipeline estaba bien pensado. El problema no fue la falta de rigor: fue el **tamaño del lote**.

## Los cuatro síntomas reales

### 1. No se vio el producto hasta el final

El primer entregable demostrable fue el login: microservicio, base de datos, front. Funcionaba. Pero no había producto alrededor del login. El resto del sistema apareció de golpe al final. Durante semanas el trabajo fue invisible.

Consecuencia práctica: no hubo retroalimentación. Ni del profesor, ni entre compañeros, ni del propio criterio. Cuando por fin se pudo mirar el conjunto, ya no había tiempo para corregir el rumbo.

### 2. El código no era navegable

Cientos de archivos y carpetas generados por agentes. Un humano no puede construir un mapa mental de siete servicios leyendo diffs de mil líneas. El código era correcto y era ajeno.

### 3. El equipo se redujo a una persona

Si quien lidera no entiende el código, no puede explicárselo a nadie. Si no puede explicarlo, nadie más puede contribuir. El proyecto terminó haciéndolo una sola persona, y la metodología *causó* ese resultado en vez de evitarlo.

### 4. El resultado fue aceptable pero no propio

La calidad fue razonable. No fue la que se habría obtenido decidiendo cada pieza. La diferencia no está en los bugs: está en que no había criterio humano invertido en el diseño.

## Diagnóstico: son tres problemas, no uno

Es tentador concluir "el Spec-Driven Development no sirve". Es una conclusión demasiado cómoda y demasiado amplia. Lo que falló fueron tres cosas separables:

| Problema | Naturaleza | Se arregla con |
|---|---|---|
| No ver el producto hasta el final | Tamaño de lote | Cortes verticales, historias pequeñas |
| No entender el código | Falta de traducción | El mapa del PR, gates de demo |
| Calidad no propia | Nadie con modelo del dominio | Humano como navigator, no como aprobador de PRs ajenos |

Y un cuarto, de fondo: **se optimizó el throughput cuando el cuello de botella era la comprensión**. Cuatro agentes, ramas y PRs producen más código por hora; si lo que falta es entender lo producido, más código empeora la situación.

## El error de arquitectura, nombrado en 2016

Kent Beck describe tres fases de un producto: exploración (buscar un retorno viable), expansión (quitar cuellos de botella al crecimiento) y extracción (crecer con beneficio). Su regla para exploración es explícita: *"cualquier cosa vale mientras reduzca el coste de experimentación; usa infraestructura que no escala si acelera la experimentación"*.

Siete microservicios durante la exploración son extracción aplicada demasiado pronto. Eso dolió más que el SDD, y no lo arregla ninguna metodología de especificación: lo arregla empezar con un monolito modular y extraer servicios cuando una historia concreta duela.

## Qué se llevó de bueno el proyecto

No todo fue pérdida, y conviene no tirarlo:

* Se demostró que se puede coordinar trabajo con ramas y PRs incluso en un equipo pequeño.
* Se aprendió la diferencia entre "el agente dice que está hecho" y "está hecho".
* Quedó claro qué tipo de evidencia sí convence: algo que se arranca y se usa.

## Ver también

* [Crítica al Spec-Driven Development](./critica-al-spec-driven-development.md)
* [Flujo propuesto para el equipo](./flujo-propuesto-equipo.md)
* [Contrato de ejecución para agentes](../ia/contrato-de-ejecucion-para-agentes.md)
* [Línea base de especificación](../analisis-y-requerimientos/linea-base-de-especificacion.md)

---
title: Arquitecturas Distribuidas - Computación Distribuida, Microservicios y SOA
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-10
updated: 2026-09-10
related: []
---

# Arquitecturas Distribuidas: Computación Distribuida, Microservicios y SOA

Comparación de tres niveles relacionados pero distintos: la base de infraestructura (computación distribuida) y dos estilos de diseño de software (SOA y microservicios).

## 1. Computación Distribuida

* **Definición conceptual:** Es el nivel más cercano al hardware. Consiste en un conjunto de nodos independientes (servidores físicos o máquinas virtuales), cada uno con sus propios núcleos de CPU y memorias, que colaboran a través de una red para resolver tareas complejas como una sola unidad.
* **Características principales:**
  * Escalabilidad horizontal (permite añadir más máquinas en lugar de solo potenciar una sola).
  * Tolerancia a fallos y redundancia de datos entre múltiples nodos.
  * Procesamiento de grandes volúmenes de datos distribuidos en la red.

## 2. Arquitectura Orientada a Servicios (SOA)

* **Definición conceptual:** Es un enfoque de diseño de **software** centrado en el ámbito empresarial. Divide la lógica del negocio en servicios reutilizables e interconectados que permiten la integración de múltiples aplicaciones dentro de una organización, a menudo utilizando protocolos estándar o un bus de servicios.
* **Características principales:**
  * Enfoque global a nivel de toda la empresa o múltiples sistemas.
  * Los servicios están diseñados explícitamente para ser **reutilizables** por diferentes aplicaciones.
  * Facilita la comunicación entre distintas tecnologías heterogéneas.

## 3. Microservicios

* **Definición conceptual:** Es un estilo de diseño de **software** moderno y una evolución de SOA. Consiste en dividir una aplicación grande y compleja en un conjunto de servicios pequeños y autónomos, donde cada uno cumple una función muy específica.
* **Características principales:**
  * Enfoque específico en los objetivos de **una sola aplicación** o dominio de negocio.
  * Independencia total: cada microservicio se puede desarrollar, actualizar, desplegar y escalar de forma individual sin compilar o afectar el resto del sistema.
  * Comunicación ligera basada comúnmente en APIs REST o mensajería asíncrona.

## 4. Relación y Diferencias Clave

| Dimensión | Computación Distribuida | SOA | Microservicios |
| :--- | :--- | :--- | :--- |
| **Naturaleza** | Principalmente **Hardware / Infraestructura** | Arquitectura de **Software** | Arquitectura de **Software** |
| **Ámbito** | Red de servidores físicos/virtuales interconectados | Nivel empresarial / Multisistema | Centrado en una sola aplicación grande dividida |
| **Propósito Principal** | Proveer la base computacional y tolerancia a fallos | Integración y reutilización de servicios de negocio | Autonomía, despliegue continuo y alta especialización |

## Ver también

* [Arquitectura](_index.md)
* [Desarrollo de sistemas](../_index.md)

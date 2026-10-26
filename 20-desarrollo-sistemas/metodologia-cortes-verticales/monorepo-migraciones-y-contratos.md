---
title: Monorepo, migraciones y contratos
area: desarrollo
tags: [desarrollo, devops, arquitectura, buenas-practicas]
created: 2026-10-25
updated: 2026-10-25
related: ["./flujo-propuesto-equipo.md", "./donde-viven-las-historias.md", "../devops/_index.md"]
---

# Monorepo, migraciones y contratos

Decisiones ya tomadas o en discusión, con las consecuencias que tienen sobre el flujo de cortes verticales. Tecnología-agnóstico salvo donde se indica.

## Monorepo: decisión tomada

**Decisión:** un solo repositorio para todo el proyecto — frontends, backends, migraciones, infraestructura.

**Razón práctica:** no crear diez repositorios para un proyecto. Decir "todo el proyecto está aquí" y que sea verdad.

### Por qué encaja con cortes verticales

Un corte vertical toca interfaz, API y base de datos **en un solo movimiento**. Si esas tres cosas están en repos distintos, un corte vertical deja de ser un PR y pasa a ser tres PRs coordinados en tres repos, con tres revisiones y tres ventanas de despliegue. El corte vertical funciona mucho mejor en monorepo.

### Lo que el monorepo no resuelve solo

* **Propiedad difusa.** Sin carpetas claras, todo el mundo toca todo. Remedio: estructura explícita en `AGENTS.md` y fronteras declaradas por historia.
* **CI lento.** Sin filtros por ruta, cada push ejecuta todas las pruebas de todos los proyectos. Remedio: el pipeline se dispara por las carpetas que cambiaron.
* **Colisiones en migraciones.** Ver la sección siguiente.

### Estructura mínima sugerida

```
/
├── AGENTS.md
├── CONTRIBUTING.md
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
├── apps/
│   ├── front-publico/
│   └── front-admin/
├── services/
│   └── <servicio>/
└── db/
    └── migrations/
```

Los nombres concretos dependen del stack. Lo importante: **una carpeta por cosa desplegable** y una sola carpeta de migraciones si hay una sola base de datos.

## Migraciones con Flyway

Flyway resuelve el problema de "no sabía cómo manejar la base de datos" de forma verificable. Los conceptos que importan para trabajo en equipo:

### Migraciones versionadas vs repetibles

| Tipo | Prefijo | Se aplica | Uso |
|---|---|---|---|
| Versionada | `V` | **Una sola vez, en orden de versión** | Crear/alterar tablas, índices, claves foráneas |
| Repetible | `R` | Cada vez que cambia su checksum | Vistas, procedimientos, funciones |

Formato del nombre: `prefijo + VERSIÓN + separador + DESCRIPCIÓN + sufijo`. Con los valores por defecto: `V1.1__Mi_descripcion.sql`. La descripción es solo informativa; lo que manda es la versión.

Una migración repetible se nombra igual pero sin versión: `R__People_view.sql`.

`Verificado` en la documentación de Redgate.

### Las tres reglas que evitan el 90 % de los problemas en equipo

1. **Una migración aplicada no se edita nunca.** Flyway guarda un checksum y detecta el cambio. Si un entorno ya la aplicó, la forma correcta es **crear una migración nueva y avanzar hacia adelante** (*roll forward*), no reescribir la anterior. La documentación lo dice de forma explícita: es mejor práctica no modificar migraciones versionadas ya aplicadas en un entorno permanente.

2. **Versiones únicas y ordenadas.** La versión puede ser un entero creciente con ceros a la izquierda (`V001`, `V002`) o notación con puntos. Flyway ordena numéricamente. Con varias personas, **quien añade la migración asigna la versión más alta + 1 en el momento de crearla**, no cuando la idea surgió.

3. **El conflicto de dos migraciones simultáneas es real.** La documentación de Redgate señala que Flyway Desktop genera por defecto un *timestamp* como parte de la versión precisamente para evitar conflictos cuando dos miembros del equipo añaden migraciones a la vez. Si dos ramas crean `V005__...` con contenidos distintos, al mergear hay que renumerar una. Con versión con timestamp, no hace falta.

### Regla para el flujo de historias

**Toda migración nace dentro de la historia que la necesita.** No hay una historia "crear el esquema". Igual que la tabla `usuarios` nace en la historia de login.

Y una frontera explícita: si dos historias en curso necesitan migraciones, la numeración se resuelve al crear la segunda, no al mergear.

### Lo que Flyway no hace

* No sustituye a los tests de comportamiento. Verifica que el esquema es el esperado, no que la funcionalidad funcione.
* No hace rollback automático de datos. Los cambios destructivos (borrar una columna) necesitan su propio plan.
* No resuelve la estrategia de datos de prueba. Eso es un problema aparte: ver [Cultura de tests](./cultura-de-tests-paso-cero.md).

## Contratos: las fronteras compartidas

Con una sola persona el contrato es implícito. Con tres, se decide tres veces.

### Qué es un contrato

| Superficie | Contrato mínimo |
|---|---|
| Endpoint HTTP | Método, ruta, códigos de estado, forma del cuerpo, campos obligatorios |
| Tabla / esquema | Nombre, columnas con tipo, claves, índices que importan |
| Evento / mensaje | Nombre, campos, quién lo emite, quién lo consume |
| Componente / props | Nombre, props con tipo, comportamiento esperado |
| Función pública de un módulo | Firma, errores que lanza |

### Dónde vive

En el issue de la historia que lo introduce, bajo un apartado `## Contrato`. Cinco líneas, no un documento.

Si el proyecto crece y hay muchos contratos, se puede extraer a un archivo por superficie (`docs/contratos.md`, o un `openapi.yaml` si el stack lo permite). **Pero no se empieza ahí**: se empieza en el issue y se extrae cuando la repetición duela.

### La regla

> Si una historia necesita una superficie que no existe, o la cambia, **el contrato se aprueba y se mergea antes de que nadie dependa de él**.

Esto permite paralelizar de verdad: dos personas pueden trabajar contra el mismo contrato una vez aprobado, aunque una construya el backend y otra el frontend.

### El contrato no es un spec

Diferencia importante, porque aquí está la tentación de volver al SDD:

| Contrato | Spec |
|---|---|
| Describe una superficie | Describe un comportamiento completo |
| Cinco líneas | Varias páginas |
| Se congela y se versiona | Se espera que evolucione con el código |
| Vive donde se consume | Vive aparte y hay que mantenerlo sincronizado |

Un contrato es barato de mantener porque es pequeño y estable. Un spec de comportamiento no lo es.

## Fuentes

* [Versioned migrations — Redgate Flyway](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations) — consultado: 2026-10-25
* [Flyway — SQL migration prefix setting](https://github.com/flyway/flyway/blob/main/documentation/Reference/Configuration/Flyway%20Namespace/Flyway%20SQL%20Migration%20Prefix%20Setting.md) — consultado: 2026-10-25
* [Flyway — Tutorial: repeatable migrations](https://github.com/flyway/flyway/blob/main/documentation/Reference/Tutorials/Tutorial%20-%20Repeatable%20Migrations.md) — consultado: 2026-10-25

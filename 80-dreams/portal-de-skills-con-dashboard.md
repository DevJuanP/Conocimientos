---
title: Portal de skills con dashboard de dueño
area: desarrollo
tags: [desarrollo]
created: 2026-09-07
updated: 2026-09-07
related: ["./_index.md", "../20-desarrollo-sistemas/devops/publicar-skills.md", "../20-desarrollo-sistemas/devops/licenciar-skills.md"]
---

# Portal de skills con dashboard de dueño

Dream 1 de 3-4 para el portafolio. Un repo open source de skills (de autoría propia) con página web pública donde cualquiera puntúa y comenta, más un backend privado con dashboard solo para el dueño: métricas de instalación, temas estéticos, visibilidad de skills y moderación.

## Visión en una frase

Ser el autor y mantenedor visible de un ecosistema de skills: la comunidad usa, puntúa y propone; yo curo, mido y decido.

## Piezas del sistema

### 1. Repo de skills (open source, yo mantenedor)

* Cada skill en su carpeta con `SKILL.md`, `README.md` y `LICENSE` (MIT), según [Publicar skills](../20-desarrollo-sistemas/devops/publicar-skills.md) y [Licenciar skills](../20-desarrollo-sistemas/devops/licenciar-skills.md).
* El backend extrae la info de aquí (fuente de verdad): lee el repo por git o por API y publica el catálogo en la web.
* Acepta contribuciones externas vía PR; yo reviso y apruebo como mantenedor.
* Tarea pendiente: estudiar open source a fondo (licencias, `CONTRIBUTING.md`, código de conducta, flujo de PRs, versionado).

### 2. Web pública (Astro o Vue)

* Catálogo de skills con buscador, página de detalle, puntuación (1-5) y comentarios.
* Usuarios comunes **solo** pueden puntuar y comentar. Nada de administración.
* Recomendación: **Astro** para el portal público (rápido, orientado a contenido) y **Vue/Nuxt** si el dashboard va en el mismo frontend. Decidir al llegar a fase 1.

### 3. Backend privado + PostgreSQL sencillo

* Tablas mínimas: usuarios, roles (`owner`, `user`), skills (espejo del repo), puntuaciones, comentarios (con estado).
* Solo yo tengo cuenta `owner`. Registro público crea siempre rol `user`.
* Endpoints públicos: ver skills, puntuar, comentar. Endpoints de dueño protegidos por rol.

### 4. Dashboard del dueño

* Administración de skills: qué se ve y qué no (publicar/ocultar sin borrar del repo).
* Métricas de cuáles se instalan más: fuentes posibles por investigar — API de tráfico de GitHub (clones/vistas, ventana de 14 días), conteos de `skills.sh`, descargas si se publican en npm. Guardar histórico propio porque las APIs lo borran.
* Temas de estética activables: navidad, día de la madre, etc. (sistema de temas con variables CSS + programación por fechas).
* Gestión de usuarios: desactivar cuentas problemáticas.
* Moderación de comentarios: ocultar ofensivos; el autor del comentario lo sigue viendo en gris con un mensaje ("oculto por moderación"), el resto no lo ve.

## Roadmap por fases

1. **Fase 0:** repo de skills con 2-3 skills propias, licencia MIT, primer tag.
2. **Fase 1:** portal público que lee y muestra el catálogo del repo.
3. **Fase 2:** auth + roles + puntuación y comentarios + PostgreSQL.
4. **Fase 3:** dashboard del dueño (métricas, temas, visibilidad, moderación).
5. **Fase 4:** apertura open source real (`CONTRIBUTING.md`, issues, PRs de terceros).
6. **Fase 5:** pulir y presentar como pieza central del portafolio.

## Ideas futuras (parking, se ampliarán construyendo)

* Ranking público de skills más instaladas.
* Notificaciones al dueño ante comentarios reportados.
* Badges para contribuidores ("top contributor").
* Más dreams hasta completar 3-4 proyectos de portafolio.

## Ver también

* [Dreams (MOC)](_index.md)
* [Publicar skills de agente](../20-desarrollo-sistemas/devops/publicar-skills.md)
* [Licenciar skills de agente](../20-desarrollo-sistemas/devops/licenciar-skills.md)

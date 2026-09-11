---
title: DevOps - qué es y en qué aterriza
area: desarrollo
tags: [desarrollo, devops]
created: 2026-09-10
updated: 2026-09-10
related: ["./automatizar-git-add-commit-push.md", "./publicar-skills.md"]
---

# DevOps - qué es y en qué aterriza

DevOps une desarrollo (Dev) y operaciones (Ops): cultura y prácticas para llevar código a producción de forma rápida, segura y repetible. No es un programa ni un puesto solamente; es un ciclo.

## En qué aterriza en concreto

1. **CI (integración continua):** cada push corre tests y build automáticamente (ej: GitHub Actions). Si algo rompe, te enteras en minutos.
2. **CD (despliegue continuo):** el código aprobado llega a producción solo o con un botón, sin pasos manuales por SSH.
3. **Infraestructura como código:** servidores y configuración definidos en archivos versionados (Docker, Terraform), no "a mano".
4. **Observabilidad:** logs, métricas y alertas para saber si lo desplegado funciona o falla.
5. **Automatización de lo repetitivo:** scripts y hooks que evitan errores humanos.

## Ejemplo en este repo

* [Automatizar git add, commit y push](automatizar-git-add-commit-push.md) y el comando `/ship` → automatización del flujo de entrega.
* [Publicar skills de agente](publicar-skills.md) → empaquetado y distribución versionada.
* `npm run check-links` → verificación automática tipo CI.
* Salto siguiente típico: tests automáticos en cada push + despliegue automático de la web (MkDocs) al hacer push a `main`.

## Ver también

* [DevOps](_index.md)
* [Desarrollo de sistemas](../_index.md)

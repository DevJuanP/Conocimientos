---
title: Ramas Git en trabajo colaborativo
area: desarrollo
tags: [desarrollo, devops, buenas-practicas]
created: 2026-09-27
updated: 2026-09-27
related: ["./automatizar-git-add-commit-push.md", "./_index.md"]
---

# Ramas Git en trabajo colaborativo

En equipo se usa una rama corta por propósito que se mergea y se borra. No se usa una rama personal larga donde se acumulan todos los cambios.

## Rama por proposito vs rama personal

La rama personal (`juan`, `dev-juan`) que vive semanas acumula temas mezclados, se desincroniza de `main` y el merge se vuelve doloroso. Nadie puede revisar un PR con 15 cambios distintos, y si una cosa no esta lista bloquea todo lo demas.

La rama por proposito (`feature/login-jwt`, `fix/paginacion`) vive horas o pocos dias, tiene un solo objetivo, se revisa rapido y se borra tras el merge. `main` se mantiene siempre estable.

## Flujo basico

```bash
# 1. Ponte al dia
git switch main
git pull

# 2. Crea la rama con proposito
git switch -c feature/nombre-corto
# tipos tipicos: feature/... , fix/... , docs/... , chore/...

# 3. Trabaja y sube
git add .
git commit -m "feat: agrega login con JWT"
git push -u origin feature/nombre-corto

# 4. Abre PR a main, se revisa y se hace merge

# 5. Destruye la rama y vuelve a main
git switch main
git pull
git branch -d feature/nombre-corto
git push -d origin feature/nombre-corto
```

## Sincronizar main dentro de tu rama

Si `main` avanzo mientras trabajas:

```bash
git pull origin main
```

Hazlo seguido para evitar un merge gigante al final. PRs pequenos se mergean mas rapido.

## Caso especial: cambios ya hechos en main

Si empezaste a editar en `main` sin querer, no commitees ahi. Llevate los cambios a una rama nueva:

```bash
git switch -c feature/mi-cambio
```

El comando crea la rama y arrastra los cambios sin commitear.

## Ver también

* [DevOps (MOC)](_index.md)
* [Automatizar git add, commit y push en una acción](automatizar-git-add-commit-push.md)
* [Convenciones](../../00-meta/convenciones.md)

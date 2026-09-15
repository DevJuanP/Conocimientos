---
title: v0 de Vercel - guia de uso
area: desarrollo
tags: [desarrollo, desarrollo/ia]
created: 2026-09-14
updated: 2026-09-14
related: ["_index.md"]
---

# v0 de Vercel - guia de uso

v0 es el agente de IA de Vercel que genera apps full-stack (Next.js + Tailwind + shadcn/ui) desde un prompt en lenguaje natural. Corre en `v0.app` (antes `v0.dev`) y publica directo en infraestructura de Vercel.

## Que es

* Pair programmer en el navegador: describes la idea y devuelve codigo + UI + preview vivo.
* No es solo mockup: genera backend, conecta APIs y bases de datos, corrige errores solo.
* Cada proyecto de v0 crea un proyecto Vercel asociado (deployments, variables de entorno, dominios).
* Casos tipicos: landing pages, dashboards, blogs, chatbots, MVPs, prototipos para validar con usuarios.

## Como empezar

1. Crear cuenta en `https://v0.app` (tiene plan gratis, luego Premium y Ultra).
2. Escribir el prompt. Ejemplo: `Build me a simple blog app with homepage, post list and post detail pages`.
3. Antes de enviar, revisar dos controles:
   * **Model picker:** `v0 Max` (mas capaz), `v0 Mini` (mas liviano), o `Auto` (elige segun el prompt).
   * **Enhance prompt:** expande tu texto en un brief mas detallado antes de generar.
4. El primer prompt tarda mas; los siguientes iteran sobre lo generado.

## Flujo de trabajo

* **Iterar:** pedir cambios en lenguaje natural (`agrega dark mode`, `migra a tal feature de Next.js`). Cada iteracion es una version: se puede volver a cualquier version anterior sin perder las nuevas.
* **Inspeccionar:** pestanas `Code` y `Console` para ver el codigo real y errores mientras se genera.
* **Variables de entorno:** `Settings > Environment Variables > Open in Vercel`. Ahi se configuran APIs propias y v0 las usa.
* **Extender:** conectar integraciones, MCP servers y design systems.
* **Publicar:** boton `Publish` arriba a la derecha. Crea un deployment real en Vercel. `Inspect on Vercel` abre el proyecto en el dashboard (regiones, logs, observabilidad).

## Trabajar con un repo existente

1. En el chat, boton `+ > Import from GitHub` y pegar la URL del repo (o subir un zip con `Upload from computer`).
2. v0 importa el repo a un Sandbox de Vercel, lo usa como contexto y da preview vivo.
3. La conexion es bidireccional:
   * Crea una rama `v0/...` al primer cambio con codigo.
   * Cada cambio genera un commit automatico.
   * Desde v0 se puede crear el pull request; `Publish` lo mergea a la base y lanza el deploy a produccion (respeta checks y reviews requeridos).
4. Para la experiencia completa el repo de GitHub debe estar conectado a un proyecto Vercel.

## Uso programatico (API y SDK)

Para meter el agente de v0 dentro de otro producto:

```ts
import { v0 } from 'v0'

const result = await v0.chats.create({
  message: 'Create a project management dashboard with a kanban board',
})
```

* API v2: chats + mensajes, previews vivos embebibles via iframe autenticada, deployment a Vercel incluido.
* SDK: `npm install v0` (repo `vercel/v0-sdk`), key en `v0.app/settings`. Starter rapido: `npx create-v0-sdk-app`.
* MCP server y herramientas para AI SDK tambien disponibles.

## Enlaces

* Que es v0: `https://vercel.com/docs/v0`
* Docs y quickstart: `https://v0.app/docs`
* FAQs (GitHub, Projects, Publish, precios): `https://v0.app/docs/faqs`
* Tutorial The v0 Way: `https://vercel.com/academy/vercel-foundations/v0-way`
* API v2: `https://v0.app/docs/api/v2`
* SDK: `https://github.com/vercel/v0-sdk`
* Plantillas de la comunidad: `https://v0.app/templates`
* Precios: `https://v0.app/pricing`

## Ver también

* [IA (MOC)](_index.md)
* [Itsfree.ai - APIs de IA gratis](itsfree-ai-apis-gratis.md)
* [Herramientas](../herramientas/_index.md)

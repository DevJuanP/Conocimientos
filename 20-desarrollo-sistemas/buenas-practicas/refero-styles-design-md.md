---
title: Refero Styles y DESIGN.md
area: desarrollo
tags: [desarrollo, buenas-practicas]
created: 2026-09-11
updated: 2026-09-11
related: []
---

# Refero Styles y DESIGN.md

Refero convierte webs reales en contexto de diseño legible por agentes IA, para que no generen UI generica. Galeria en `styles.refero.design` con 1200-2000+ estilos, cada uno con `DESIGN.md` copiable para Cursor, Claude Code, Codex, v0 o Lovable.

## Que es (3 capas)

* `refero.design`: catalogo curado de webs y apps iOS reales. Inspiracion clasica.
* `styles.refero.design`: galeria de estilos extraidos de webs reales (Linear, Stripe, Mercury, Apple). Cada tarjeta trae screenshot, tesis visual y filtros por brand, mood, color, tipografia o URL.
* `doc.refero.design` + MCP + Skill: capa para agentes. Flujo `agente -> MCP over HTTP -> Refero API -> sites, apps, styles, screens, flows`.

Origen del formato: Google Stitch popularizo `DESIGN.md` como design system portable en Markdown, versionable junto al codigo como `README.md` o `AGENTS.md`.

## Que ofrece

* Gratis: explorar estilos y copiar por estilo los 4 formatos. Guias en `/ai-agents/*` y `/design-md/*`.
* Pago (Pro, Team, Lifetime): MCP con hasta 8000 tool calls por mes y usuario, plugin Figma, Skill completa.
* MCP server: `https://api.refero.design/mcp` con auth OAuth o `Authorization: Bearer <token>`.

## Como funciona: 4 niveles de investigacion

1. `Sites / Apps`: descubrimiento por empresa, dominio, industria o direccion visual. Ej: `Stripe`, `fintech products`, `minimal productivity app`.
2. `Styles`: direccion visual. Tipografia, color, layout, spacing, surfaces, componentes, imagery, reglas do/dont. Usar primero para gusto visual.
3. `Screens`: 1 pantalla real para decisiones concretas. Estructura, jerarquia, copy, estados, `page_types`, `ux_patterns`, `ui_elements`.
4. `Flows`: journey multi-paso (onboarding, checkout, cancelacion con retencion, delete, reset). Cada paso trae `goal / action / system_response`.

Busqueda devuelve registros compactos, detalle devuelve metadata completa. Screens usan UUID, flows usan ID numerico.

## Los 4 archivos por diseno

No son 4 cosas distintas, son 1 sistema en 3 lenguajes:

```text
tokens.json (canonico) -> genera -> tailwind v4 @theme O css :root
DESIGN.md (narrativa para humano + agente)
```

### 1. DESIGN.md (Compact / Extended)

Brief persistente. Se pega antes de pedir UI y se usa despues para `compliance pass`. Secciones tipicas (ejemplo Linear):

* Cabecera + tesis + `Theme: dark`
* `Tokens Colors | Typography | Spacing & Shapes` en tablas `Nombre | Valor | Token | Rol`
* `Components` (ej: `Primary Action Button Acid Lime`, `Nav Text Button`, `Card Product Screenshot Frame`)
* `Do / Dont`, `Surfaces`, `Elevation`, `Imagery`, `Layout`
* `Agent Prompt Guide` con colores rapidos y 3-5 prompts de componentes
* `Type Scale Detail`, `Similar Brands`, `Quick Start` con snippets

### 2. Tailwind v4

Bloque `@theme` listo para pegar donde importas Tailwind:

```css
@theme {
  --color-void: #08090a;
  --color-acid-lime: #e4f222;
  --font-inter-variable: 'Inter Variable', system-ui, sans-serif;
  --text-display: 72px;
  --spacing-96: 96px;
  --radius-xl: 12px;
}
```

Genera utilidades tipo `bg-void text-mist font-inter-variable`.

### 3. CSS Variables

Mismo sistema en vanilla:

```css
:root {
  --color-void: #08090a;
  --text-heading: 48px;
}
```

Para proyectos sin Tailwind (ej: MkDocs Material via `extra.css`).

### 4. Design Tokens (JSON)

Formato estilo W3C DTCG para maquinas, sin prosa. Canonico para `Style Dictionary`, Tokens Studio, Figma, iOS y Android.

## Todos son necesarios?

No. Tailwind y CSS Variables son excluyentes: usa uno o el otro.

* Prototipo Tailwind: `DESIGN.md + @theme`
* Vanilla / MkDocs: `DESIGN.md + :root`
* Sistema serio multi-plataforma: `tokens.json canonico + DESIGN.md doc`, de ahi generas los demas
* Solo probar con IA: basta pegar `DESIGN.md`

## Que es design tokens (detalle)

Variables con nombre, tipo y rol, no hex sueltos. 3 niveles con ejemplo Linear:

1. Primitivo: `void #08090a`, `acid-lime #e4f222`
2. Semantico / alias: `surface.canvas -> void`, `text.body -> mist #d0d6e0`, `border.hairline -> graphite`. Dice para que sirve.
3. Componente: `button.primary.bg -> acid-lime`, solo 1 por vista, radio `6px`.

```json
{
  "color": {
    "void": { "$value": "#08090a", "$type": "color" }
  },
  "surface": {
    "canvas": { "$value": "{color.void}", "$type": "color" }
  }
}
```

Regla Refero: preservar roles. Lima solo CTA, Berkeley Mono solo para `ENG-2703` y shortcuts, no para headings. Si cambia el token, cambia toda la UI.

## Como usar con un agente

1. Elige por job (landing, dashboard, pricing, settings), no por marca.
2. Pega `DESIGN.md` antes del pedido, indica que priorizar: paleta, tipo, spacing, densidad o todo.
3. Pide pantalla concreta: `disena pricing con toggle anual/mensual`.
4. Pide pasada de cumplimiento contra `DESIGN.md`.
5. No pidas recrear Linear o Stripe tal cual, usa la referencia para fijar gusto y describe tu producto, audiencia y restricciones.

No promedies referencias: 1 direccion primaria, secundarias solo para detalles acotados.

## MCP + Skill

Tools: `refero_search_site`, `refero_search_app`, `refero_search_styles`, `refero_get_style`, `refero_search_screens`, `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image`, `refero_search_flows`, `refero_get_flow`.

Skill `refero-design` (metodologia research-first: Discovery -> Styles first -> Screens/flows -> Synthesis con reference lock -> Implementation con reglas craft y anti-slop):

```bash
npx skills add https://github.com/referodesign/refero_skill --skill refero-design
```

Incluye guias de tipografia, color, motion, iconos, craft, copywriting y anti-AI-slop. Funciona sola, mejor con MCP conectado.

Limites: styles cubren sobre todo marketing web (landing, pricing, editorial, SaaS). Para producto interno sumar screens y flows.

## Enlaces

* Galeria: `https://styles.refero.design/`
* Ejemplo Linear: `https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1`
* Que es DESIGN.md: `https://styles.refero.design/design-md/what-is-design-md`
* Template: `https://styles.refero.design/design-md/design-md-template`
* Guia Stitch: `https://styles.refero.design/design-md/google-stitch-design-md`
* Docs MCP: `https://doc.refero.design/mcp/getting-started`
* Indice docs: `https://doc.refero.design/llms.txt`
* Skill repo: `https://github.com/referodesign/refero_skill`

## Ver también

* [Desarrollo de sistemas](../_index.md)
* [Análisis y requerimientos](../analisis-y-requerimientos.md)

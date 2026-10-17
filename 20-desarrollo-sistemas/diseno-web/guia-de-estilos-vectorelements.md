---
title: Guía de estilos de VectorElements
area: desarrollo
tags: [desarrollo]
created: 2026-10-02
updated: 2026-10-02
related: ["./_index.md", "../herramientas/_index.md"]
---

# Guía de estilos de VectorElements

Guía de estilos deducida de [vectorelements.net](https://vectorelements.net/) (marketplace de ilustraciones vectoriales, iconos SVG y gráficos) mediante screenshots con chrome-devtools, su `templates/Default/style.css` y estilos computados. Sirve como referencia de sistema de diseño oscuro + verde lima para marketplaces creativos.

## 1. Fundaciones

* **Fondo base:** `#f8fafb` (gris casi blanco).
* **Texto base:** `rgba(12, 18, 28, 0.6)` (pizarra al 60%).
* **Tipografía real:** `Arial` en body, titulares y botones. Declaran Proxima Nova auto-hospedada y Montserrat (pricing/checkout), pero el render efectivo es Arial.
* **Sin variables CSS** (`:root` vacío): colores hardcodeados en la hoja.

## 2. Paleta

| Rol | Valor |
|---|---|
| Verde marca primario (botones) | `#76d434` |
| Verde lima acento (tags, free, hover) | `#8AE749` / `#8ae749` |
| Verde hover links / SignUp | `#8ee63f` |
| Verde borde cards pares / burger móvil | `#9af14f` / `#a5f85a` |
| Verde hover oscuro botones | `#66bb2b` / `#218838` / `#7CCE42` |
| Teal secundario (botones, radios, badges) | `#00d1a3` |
| Azul enlaces / plan premium | `#1273EB` |
| Dorado (estrellas, CTA pricing, hovers) | `#fcc701` → hover `#C7A114`; `#D3A602`, `#F2BF00`; badge `#FEF4CC` |
| Tinta headings | `#222` / `#303030` / `#505050` |
| Texto pricing | `#4A5477` |
| Links top / menú | `#A5B7C6` (14px bold) / `rgba(12,18,28,.6)` (18px) |
| Bordes | `#CFD9E0` (nav), `#dcdcdc` (inputs), `#4A6375` (SignUp) |
| Footer | fondo `#000`, links `#B3B3B3` |

## 3. Tipografía (escala observada)

* **H1 hero:** 38px, bold, blanco, centrado.
* **Sub hero:** 22px, normal, blanco.
* **Secciones:** título 32px bold centrado; subtítulo de bloque 24px bold.
* **Cards categoría:** `h3` 18px, weight 600, `#222`, centrado.
* **Botones:** 14–16px, **uppercase**, bold.
* **Eyebrow:** `WHY DESIGNERS CHOOSE US`, uppercase pequeña sobre el H2.

## 4. Hero (430px, imagen de fondo a cover)

* Fondo oscuro navy/negro con formas 3D verdes (cubos, esferas, cintas) y retícula.
* Barra de búsqueda custom de 74px en 3 slices de imagen, píldora con botón **Search** verde lima, texto 20px bold blanco, radius ~26px.
* Arriba derecha: `Log in` (texto) · `Pricing` (texto) · `Sign up` (outline 2px `#4A6375`, radius 5px; hover con borde y texto `#8ee63f`).

## 5. Navegación de categorías

* Barra blanca con borde inferior `#CFD9E0`, links de 18px; item activo/hover con subrayado de 2px `#1D262D`.
* Móvil (<900px): menú hamburguesa con fondo `#283744` e icono de 3 líneas `#a5f85a`.

## 6. Cards de categoría

* Fondo `#fff`, **radius 16px**, `overflow hidden`, sombra `0 4px 12px rgba(0,0,0,.08)`.
* **Borde de 2px alternado:** impar `#000`, par `#9af14f`.
* Cabecera de título sobre degradado `linear-gradient(90deg, #f9f9f9, #f1f1f1)`.
* Hover: `translateY(-8px)`, sombra mayor, imagen con `scale(1.1)` y overlay degradado.
* Grid: 4 columnas en desktop → 3 (≤1200px) → 2 (≤900px) → 1 (≤600px).

## 7. Botones

* **Primario:** bg `#76d434`, blanco, uppercase, alto 40px, **radius 20px**, padding `9px 22px`; estado active con sombra interior.
* **Píldora grande:** `#00d1a3`, 169×44, **radius 100px**; hover `#D3A602`.
* **Rectangular:** `#76d434`, 220×45, radius 5px, uppercase 14px.
* **Tarifas:** píldora 160×44 radius 26px; plan normal bg `#1273EB` → hover `#00d1a3`; plan destacado bg `#00d1a3` → hover blanco con texto negro.
* **Tags:** píldora con outline 1px `#8ae749`, radius 100px; hover con fondo `#F1F5FC`.

## 8. Footer (negro `#000`)

* 3 columnas (25/50/25): logo + copyright | links (`#B3B3B3`, hover con underline) + fila de trust badges | "Follow our social profiles" con iconos cuadrados verde lima + email.
* Franja SEO inferior con H2 `High-Quality Graphic Resources for Digital Projects`.

## 9. Formularios y modal

* Inputs de 300×45, fondo `#fbfbfb`, borde `#dcdcdc`, radius 4px, sombra interior sutil.
* Error: fondo `#fff4f4`, borde `#f5c2c2`, texto `#b42323`, radius 12px.
* Modal: max 400px, radius 4px, overlay `rgba(0,0,0,.65)`; botón de cierre circular con rotación de 360° en hover.
* Radios custom: sin marcar con aro `#adb5bd`; marcado con relleno `#00d1a3` y punto blanco.

## 10. Voz y patrones

* Tono marketplace directo: precio primero ("from $4.99/month", "$1"), "Commercial License", "Trusted by Designers", "Multiple Formats".
* Patrón tarjeta: imagen de producto + título + overlay en hover con meta en blanco.

## Ver también

* [Diseño web](./_index.md)
* [Herramientas](../herramientas/_index.md)

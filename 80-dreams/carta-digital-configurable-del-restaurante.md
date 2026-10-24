---
title: Carta digital configurable del restaurante
area: desarrollo
tags: [desarrollo, desarrollo/ia, estado/borrador]
created: 2026-10-21
updated: 2026-10-21
related: ["./_index.md", "../20-desarrollo-sistemas/ia/_index.md"]
---

# Carta digital configurable del restaurante

Idea para retomar más adelante. En el restaurante donde trabajo existen varias cartas de menú
en imagen (`.jpg`, `.png`) y también en vectorial (`.svg`). La idea es pasar todo ese material a
una IA y que genere, a partir de ahí, **un solo HTML de carta con muchas opciones configurables**,
en vez de mantener una imagen distinta por cada versión del menú.

## Problema que resuelve

* Hoy cada carta es una imagen: cambiar un precio o un plato obliga a rehacer el archivo.
* Hay varias versiones dispersas (`.jpg`, `.png`, `.svg`) y no queda claro cuál es la vigente.
* Una imagen no se adapta a pantalla: no hay búsqueda, ni traducción, ni filtros por alérgenos.

## Visión en una frase

Un único HTML que tome los datos de la carta (platos, precios, secciones) y los renderice según
la configuración elegida, sin volver a diseñar cada vez.

## Material de partida

* Varias cartas en `.jpg` / `.png` (las versiones impresas o fotografías).
* Versiones en `.svg` (las que se puedan editar vectorialmente; probablemente la mejor fuente
  para extraer texto y estructura).
* Todo ese lote se entrega a la IA como entrada para reconstruir la información.

## Qué debería permitir configurar (borrador, a definir)

* **Contenido:** secciones (entradas, principales, postres, bebidas), platos, descripciones,
  precios, alérgenos y etiquetas (vegetariano, sin gluten, picante).
* **Presentación:** tema de color, tipografía, logo, formato vertical u horizontal, modo
  pantalla de local vs. versión imprimible.
* **Variantes de la carta:** menú del día, carta general, promociones, temporadas, idioma.
* **Edición de precios:** cambiar un valor en un solo lugar y que se actualice en todas las vistas.
* **Salida:** HTML autocontenido (un archivo, sin dependencias) y opción de imprimir o exportar a PDF.

## Preguntas abiertas

* ¿Los datos van embebidos en el HTML (simple, un archivo) o en un JSON aparte + render en JS?
* ¿La IA extrae el contenido una sola vez y luego se edita a mano, o se re-ejecuta la extracción
  cuando cambia una carta?
* ¿Dónde se hospeda? (archivo local, GitHub Pages, un subdominio del restaurante).
* ¿Cómo se valida que la IA no haya inventado precios o platos al leer las imágenes?

## Pasos siguientes cuando se retome

1. Reunir todas las cartas en una carpeta y anotar cuál es la versión vigente.
2. Probar la extracción de texto/estructura desde los `.svg` y compararla con la de las imágenes.
3. Definir el esquema de datos mínimo (secciones, platos, precio, etiquetas).
4. Generar un primer HTML con dos o tres opciones de configuración y evaluarlo con la carta real.
5. Si funciona, reemplazar las imágenes por esa fuente única de verdad.

## Ver también

* [Dreams (MOC)](_index.md)
* [IA (MOC)](../20-desarrollo-sistemas/ia/_index.md)

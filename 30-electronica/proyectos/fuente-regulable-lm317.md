---
title: Fuente regulable con LM317
area: electronica
tags: [electronica, electronica/proyectos, estado/en-proceso]
created: 2026-09-07
updated: 2026-09-07
related: ["../circuitos/ley-de-ohm.md", "../componentes/resistencia.md"]
---

# Fuente regulable con LM317

Fuente de taller 1.2–37 V para prácticas. En construcción.

## Objetivo

Tener una fuente ajustable para probar circuitos sin depender de pilas.

## Materiales

* Regulador LM317 + disipador
* Transformador, puente de diodos, capacitores de filtro
* Potenciómetro de ajuste, fusible de entrada, voltímetro

## Procedimiento

1. Armar etapa de rectificado y filtrado.
2. Montar LM317 con red de ajuste (`Vout = 1.25 × (1 + R2/R1)`).
3. Probar en vacío y con carga, medir rizado.

## Resultados / Mediciones

| Medición | Esperado | Obtenido |
|---|---|---|
| Tensión mínima | ~1.2 V | pendiente |
| Tensión máxima | ~30 V | pendiente |

## Ver también

* [Ley de Ohm](../circuitos/ley-de-ohm.md)
* [Resistencia](../componentes/resistencia.md)

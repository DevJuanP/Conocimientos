---
title: OpenCode Go suscripcion 10 USD vs Zen saldo
area: desarrollo
tags: [desarrollo, desarrollo/ia]
created: 2026-09-20
updated: 2026-09-20
related: ["./opencode-zen-modelos-free-limites.md", "./itsfree-ai-apis-gratis.md"]
---

# OpenCode Go suscripcion 10 USD vs Zen saldo

`Go` es suscripcion `$10/mes` para modelos open con acceso estable. `Zen saldo` es pay-as-you-go por tokens. `OpenRouter $10` es otra cosa: pago unico para desbloquear cuota free.

## Que es Go

* Suscripcion en `https://opencode.ai/auth`, se conecta con `/connect` > `OpenCode Go`.
* ID en config: `opencode-go/<model-id>`. Ejemplo: `opencode-go/muse-spark-1.3-contributor`.
* Solo un miembro por workspace puede suscribirse.
* Docs: `https://opencode.ai/docs/go/`.
* Pagina oficial: `https://opencode.ai/es/go`.
* Uso actual se ve en la consola de `https://opencode.ai/auth`.

## Limites por modelo en dolares

* No es una bolsa global. Cada modelo tiene su tope mensual en `$`.
* Ventanas por modelo: `5h = 20%`, `semanal = 50%`, `mensual = 100%`.
* Ejemplo tope `$60`: `$12/5h`, `$30/sem`, `$60/mes`.
* Topes tipicos: baratos `$60` (`Muse Spark Contributor`, `GLM-5.2`, `Kimi K2.7 Code`, `DeepSeek V4 Flash`), caros `$15` (`Kimi K3`, `Qwen3.8 Max`, `Grok 4.6`).
* Precios por 1M tokens en la tabla de Go. Pueden cambiar sin aviso.

## Ejemplo Muse Spark

* `Muse Spark 1.3 Contributor` en Go: `$0.10 input`, `$0.20 output`, `$0.002 cached read`, tope `$60`.
* Estimado oficial: `45.300 req/5h`, `113.300 req/sem`, `226.600 req/mes`.
* En Zen pay-as-you-go el mismo modelo cuesta `$1.25/$4.25`, rinde ~10x menos que en Go.

## Agotar un modelo no agota todos

* Al contrario del `-free`, en Go cada modelo lleva su contador.
* Si agotas `Kimi K3 (~490 req/mes)`, `Muse Spark`, `DeepSeek Flash` y demas siguen vivos.
* Si agotas uno puntual, cambia con `/models` a otro de Go.
* Si llegas al limite de Go, puedes seguir con los modelos `free`.

## Use balance

* Opcion en consola: si tienes saldo Zen y la activas, Go cae a saldo Zen al llegar al tope en vez de bloquear.
* Sin esa opcion, al llegar al tope solo queda esperar la ventana o usar `free`.

## Diferencia con Zen saldo y OpenRouter

* `Zen $10 saldo`: se consume por tokens segun tabla de `https://opencode.ai/docs/zen/`. No amplia la cuota `free`. Para seguir hay que usar el modelo pago sin `-free`. Hay `auto-reload $20` si baja de `$5` y comision de tarjeta `4.4% + $0.30`.
* `OpenRouter $10 unico`: el tier `:free` pasa de `50/dia` a `1000/dia` permanente. No es de OpenCode.
* Para quien solo usa `Muse Spark`, Go `$10/mes` rinde mucho mas que Zen saldo.

## Privacidad

* `Muse Spark Contributor` en Go y en free: `Model training: Yes`, `Data retention: Not ZDR`. Precio con descuento a cambio de usar prompts para entrenar. Ver `https://dev.meta.ai/docs/pricing-rate-limits#contributor-tier`.
* La mayoria de open models en Go: `Not used`, `0 days`. `Grok` y `GPT Luna`: `30 days`.

## Ver también

* [OpenCode Zen free - limites](./opencode-zen-modelos-free-limites.md)
* [Itsfree.ai - APIs de IA gratis](./itsfree-ai-apis-gratis.md)
* [IA (MOC)](./_index.md)

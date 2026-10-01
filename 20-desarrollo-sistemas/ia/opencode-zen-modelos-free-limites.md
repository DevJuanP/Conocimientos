---
title: OpenCode Zen free - limites
area: desarrollo
tags: [desarrollo, desarrollo/ia]
created: 2026-09-20
updated: 2026-09-20
related: ["./opencode-go-suscripcion-10-usd.md", "./itsfree-ai-apis-gratis.md"]
---

# OpenCode Zen free - limites

Los modelos `-free` de OpenCode Zen no tienen cuota fija publicada. El limite es dinamico, diario, por IP y compartido entre los free sin `rateLimit` propio.

## Como se determina

* Precio `$0` en tokens, pero con `ipRateLimiter` separado que devuelve `429 FreeUsageLimitError`.
* Codigo: `packages/console/app/src/routes/zen/util/ipRateLimiter.ts`.
* Clave diaria: `IP + YYYYMMDD`. Para los free por defecto no lleva sufijo de modelo, por eso comparten bucket.
* Solo cuenta si vienes del cliente oficial con `User-Agent: opencode/...`. Sin esos headers caes al pool `dailyRequestsFallback`, mucho mas chico.
* Respuesta oficial del equipo: `free usage is dynamic, we are always shifting based off what capacity we have vs demand`.
* Docs: `https://opencode.ai/docs/zen/` solo dice `Free / Free / Free` y `available for a limited time`.

## Cuanto puedo usar sin pagar

* Sin numero oficial. Estimados de la comunidad:
  * ~`200 requests/dia/IP/modelo`
  * ~`$0.30/dia` de valor medido con tokscale
  * ~`0.3-0.5M tokens/dia`
* En la practica: `1-2 sesiones intensas` o `4-6h` con `/compact` frecuente.
* Cada prompt reenvia todo el historial, el gasto real no es tu mensaje sino el contexto acumulado.
* Modelos free actuales: `big-pickle`, `mimo-v2.5-free`, `ling-3.0-flash-fin-free`, `nemotron-3-ultra-free`, `nemotron-3.5-lightning-free`, `muse-spark-1.3-contributor-free`, `jev-1.13-free`. Rotan sin aviso.

## Por que agotar Muse Spark bloquea los otros

* Los free por defecto usan `dailyKey = IP + fecha`, sin distincion por modelo.
* Agotas `muse-spark-1.3-contributor-free` y `big-pickle`, `mimo-v2.5-free`, etc. dan `429` hasta el reset aunque no los hayas usado.
* Cuentas nuevas tienen `daily*2` mientras `lifetime < daily*7`. Despues el diario se reduce a la mitad.
* Tener saldo Zen no lo libera: el pool free es separado. Hay que pasar a un modelo pago.

## Reset

* `Retry-After` apunta a `00:00 UTC`.
* Ejemplo: `21:33 UTC` -> reset en ~`2h30` (`00:00 UTC` = `19:00 Lima/Bogota`).
* Si el error dice `[retrying in Xh]`, espera. Reintentar con contexto grande gasta igual.

## VPN como otra IP

* Tecnicamente si: IP nueva = bucket nuevo.
* No recomendable: las VPN compartidas se agotan mas rapido, hay segunda capa por cuenta, `User-Agent` y modelo aguas arriba, y varios reportan que cambiar de red no los desbloquea.
* Es evasion de cuota y puede llevar a baneo de key o IP.

## Que hacer cuando se agota

1. Esperar al reset `00:00 UTC`.
2. Probar otro `-free` con `/models` desde el TUI oficial, a veces uno sigue en `200` mientras otro da `429`.
3. Usar `/compact` seguido y `small_model` para titulos y tareas internas.
4. Conectar segundo lane gratis en `/connect`: `Gemini AI Studio (~1500 req/dia)`, `OpenRouter :free (50/dia, 1000/dia si cargaste $10 una vez)`, `GitHub Copilot (50/mes)`, u `Ollama` local ilimitado.
5. Verificar con `GET https://opencode.ai/zen/v1/models`: `200` + `POST` en `429` = limite free, no problema de auth.

## Ver también

* [OpenCode Go suscripcion 10 USD vs Zen saldo](./opencode-go-suscripcion-10-usd.md)
* [Itsfree.ai - APIs de IA gratis](./itsfree-ai-apis-gratis.md)
* [IA (MOC)](./_index.md)

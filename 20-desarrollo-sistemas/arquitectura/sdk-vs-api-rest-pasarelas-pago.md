---
title: SDK vs API REST en pasarelas de pago
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-13
updated: 2026-09-13
related: ["./computacion-distribuida-microservicios-soa.md"]
---

# SDK vs API REST en pasarelas de pago

Las pasarelas de pago (Stripe, PayPal, MercadoPago) exponen una API REST con llaves, pero se integran usando su SDK oficial. El SDK no reemplaza a la API, la envuelve.

## Definición

* **API REST:** interfaz HTTP de la pasarela (`POST /v1/payments`) que se autentica con tokens (`sk_live_...`, `pk_test_...`).
* **SDK (Software Development Kit):** librería oficial para un lenguaje que ya arma esas peticiones HTTP por ti: headers, auth, JSON, errores, reintentos.

## Intuición

Tú llamas funciones normales en tu código y el SDK traduce eso a HTTP/HTTPS por debajo.

```text
Tu código -> SDK (funciones) -> HTTP/HTTPS -> API de la pasarela
```

Por eso lo ves en DevTools / logs como peticiones HTTP normales.

## Ejemplo

Sin SDK (manual):

```text
fetch POST https://api.pasarela.com/v1/charges
Authorization: Bearer sk_live_...
{ "amount": 1000, "currency": "usd" }
```

Con SDK (backend Node, ejemplo):

```js
stripe.paymentIntents.create({ amount: 1000, currency: "usd" });
```

Flujo típico con tarjeta:

1. SDK JS en frontend tokeniza la tarjeta.
2. Tu servidor recibe solo un token (`tok_123`), nunca el número real.
3. SDK de backend usa ese token para crear el cobro vía API REST.

## Por qué se usa SDK en pasarelas

* Menos código y menos errores: auth, formato, tipados, idempotencia.
* Seguridad / PCI: evita que tu servidor vea números de tarjeta.
* UI incluida: checkout, validación, 3D Secure.
* Webhooks: ayuda a verificar la firma de que el evento sí viene de la pasarela.
* Mantenimiento: si la API cambia, actualizas el SDK.

## SDK en general

No solo es "traductor a HTTP". Un SDK es el kit para usar un servicio o plataforma sin hacerlo desde cero: librería + tipos + docs + ejemplos y, a veces, CLI o emulador local.

Otros ejemplos: AWS SDK, Firebase SDK, Android SDK (cámara, GPS). En pasarelas el caso de uso sí es envolver HTTP; en otros casos expone hardware o gráficos.

## Errores comunes

* Pensar que SDK y API son alternativas: el SDK llama a la API por dentro.
* Llamar la API REST en crudo con tarjetas reales y romper cumplimiento PCI.
* Exponer la llave secreta (`sk_...`) en frontend: ahí va solo la llave pública (`pk_...`).
* No verificar la firma de los webhooks.

## Ver también

* [Computación distribuida, microservicios y SOA](./computacion-distribuida-microservicios-soa.md)

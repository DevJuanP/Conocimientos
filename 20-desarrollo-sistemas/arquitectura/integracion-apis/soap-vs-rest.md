---
title: SOAP vs REST - Tipos de servicios web
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-27
updated: 2026-09-27
related: ["./json-web-token-anatomia-claims.md", "./jwt-oauth2-uso-moderno-seguridad.md", "./sdk-vs-api-rest-pasarelas-pago.md"]
---

# SOAP vs REST - Tipos de servicios web

SOAP es un protocolo estricto basado en XML y REST es un estilo de arquitectura basado en HTTP y JSON. REST domina las APIs modernas; SOAP queda para sistemas enterprise heredados con requisitos estrictos.

## SOAP

* **Qué es:** protocolo (Simple Object Access Protocol) con reglas estrictas.
* **Formato:** solo XML.
* **Contrato:** WSDL define operaciones, parámetros y tipos.
* **Transporte:** HTTP, SMTP, TCP.
* **Características:** seguridad, transacciones y ACID incorporados vía WS-*.
* **Peso:** pesado y verboso.

## REST

* **Qué es:** estilo de arquitectura, no protocolo.
* **Formato:** normalmente JSON, también XML o texto.
* **Contrato:** opcional con OpenAPI/Swagger.
* **Transporte:** solo HTTP con verbos `GET, POST, PUT, PATCH, DELETE` y recursos (`/clientes/123`).
* **Características:** sin estado (stateless), simple y escalable.
* **Peso:** ligero y rápido.

## Comparativa directa

| Aspecto | SOAP | REST API |
|---|---|---|
| Tipo | Protocolo | Estilo de arquitectura |
| Formato | Solo XML | JSON, XML, texto |
| Contrato | WSDL estricto | OpenAPI/Swagger opcional |
| Transporte | HTTP, SMTP, TCP | Solo HTTP |
| Estado | Con o sin estado | Sin estado |
| Peso | Pesado | Ligero |
| Curva de aprendizaje | Alta | Baja |

## Seguridad: JWT vs WS-Security

* **REST usa JWT:** token autocontenido firmado (`header.payload.signature`) que se envía en `Authorization: Bearer <token>`.
* **SOAP usa WS-Security:** estándar OASIS con seguridad a nivel de mensaje en el header `<wsse:Security>`.
* **Equivalentes en WS-Security:**
  * `UsernameToken`: usuario y clave.
  * `BinarySecurityToken` (X.509): certificado para firma y cifrado.
  * `SAML Assertion`: verdadero equivalente a JWT, token XML firmado con claims, roles y expiración.
  * `Timestamp + firma + cifrado`: integridad y confidencialidad extremo a extremo, no solo por HTTPS.

## Cuándo usar cada uno

* **Usa REST:** APIs públicas, apps móviles, SPAs, microservicios. Es la opción por defecto para algo nuevo.
* **Usa SOAP:** banca, telecom, pagos o integraciones legacy donde exigen WSDL, WS-Security o transacciones formales.

## Ver también

* [Anatomía de un JSON Web Token](json-web-token-anatomia-claims.md)
* [JWT vs OAuth2 y uso moderno](jwt-oauth2-uso-moderno-seguridad.md)
* [SDK vs API REST en pasarelas de pago](sdk-vs-api-rest-pasarelas-pago.md)
* [Integración de APIs](_index.md)
* [Arquitectura](../_index.md)

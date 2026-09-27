---
title: Anatomía de un JSON Web Token - Header, Payload y Firma
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-27
updated: 2026-09-27
related: ["../sistemas-distribuidos/ciclo-vida-jwt-microservicios.md", "./jwt-oauth2-uso-moderno-seguridad.md"]
---

# Anatomía de un JSON Web Token - Header, Payload y Firma

Un JWT es un estándar abierto (RFC 7519) para transmitir información como objeto JSON de forma compacta y verificable. Su forma es `xxxxx.yyyyy.zzzzz`: tres partes en Base64Url separadas por puntos.

## Definición normativa

JWT no es un protocolo de autenticación, es un formato de token autocontenido. Pertenece a la suite JOSE: JWS (RFC 7515, firma), JWE (RFC 7516, cifrado), JWK (RFC 7517, claves), JWA (RFC 7518, algoritmos). El caso común es un JWT firmado (JWS Compact).

## Las tres partes

### 1. Header

Tipo de token y algoritmo de firma.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

En producción se prefiere asimétrico (`RS256`, `ES256`, `EdDSA`) con `kid` para rotación:

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-2026-01"
}
```

### 2. Payload

Claims: datos del usuario y metadatos.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["ROLE_USER"]
}
```

### 3. Signature

Garantiza que el token no fue alterado. Se calcula sobre header y payload ya codificados:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

El servidor recalcula la firma al validar. Cualquier cambio en el contenido invalida la firma.

## Codificación Base64Url

Cada segmento es JSON codificado en Base64Url (variante URL-safe sin `+`, `/` ni `=`). Es codificación, no cifrado: cualquiera puede decodificar el payload.

## Los tres tipos de claims

### Registrados

Predefinidos, no obligatorios por spec pero recomendados: `iss` (emisor), `sub` (sujeto), `exp` (expiración), `iat` (emisión), `nbf` (no válido antes de), `aud` (destinatario), `jti` (ID único).

### Públicos

Definidos por quienes usan JWT. Deben registrarse en el Registro IANA de JWT para evitar colisiones. Ejemplo: `name`, `email`.

### Privados

Afirmaciones personalizadas para compartir información específica entre las partes. Ejemplo: `roles`, `tenant_id`, `permissions`. Cada claim extra aumenta el tamaño que viaja en cada request.

## Ver también

* [Ciclo de vida de un JWT en microservicios](../sistemas-distribuidos/ciclo-vida-jwt-microservicios.md)
* [JWT vs OAuth2 y uso moderno - Ventajas, riesgos y buenas prácticas](./jwt-oauth2-uso-moderno-seguridad.md)
* [Sistemas distribuidos](../sistemas-distribuidos/_index.md)

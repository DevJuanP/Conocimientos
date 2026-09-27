---
title: JWT vs OAuth2 y uso moderno - Ventajas, riesgos y buenas prácticas
area: desarrollo
tags: [desarrollo, arquitectura, buenas-practicas]
created: 2026-09-27
updated: 2026-09-27
related: ["./json-web-token-anatomia-claims.md", "../sistemas-distribuidos/ciclo-vida-jwt-microservicios.md"]
---

# JWT vs OAuth2 y uso moderno - Ventajas, riesgos y buenas prácticas

JWT lleva el `qué` (identidad y permisos en claims); OAuth2 define el `cómo delego acceso` entre aplicaciones sin compartir contraseñas. OIDC agrega autenticación sobre OAuth2.

## Autenticación vs autorización

* **Autenticación (¿quién eres?):** verificación de identidad del usuario. OIDC emite `id_token`, siempre JWT.
* **Autorización (¿qué puedes hacer?):** permisos y alcance de acceso. OAuth2 emite `access_token` (puede ser JWT u opaco) más `refresh_token`.

Validar la firma prueba quién eres, no sustituye el control de permisos en backend.

## Flujos actuales

Hoy se usa Authorization Code + PKCE (más PAR en alta seguridad). Los flujos Implicit y Resource Owner Password están deprecated por RFC 9700 OAuth Security BCP. Referencia de implementación: `panva/jose` con `SignJWT`, `jwtVerify` para JWS y `jwtDecrypt` para JWE.

## Ventajas de JWT

* **Autónomo:** no requiere consulta a base de datos por request.
* **Portable:** funciona entre dominios y servicios.
* **Stateless:** no requiere sesión en el servidor.
* **Compacto:** viaja en headers, POST o URL.
* **Seguro:** firmado digitalmente (integridad, no confidencialidad).

## Qué vigilar en la práctica

* El tamaño del token crece con más claims y se paga en cada request.
* No es trivial revocar un token antes de su expiración; usar TTL corto más denylist de `jti` si hace falta.
* No debe llevar datos sensibles sin cifrar en el payload: es legible, no oculto. Para confidencialidad usar JWE (`jwtDecrypt`), no solo JWS.
* Nunca aceptar `alg: none`, validar siempre `exp`, `iss`, `aud` y permitir solo algoritmos fuertes (RFC 8725 JWT Best Current Practices).
* En `HS256` el secreto compartido permite emitir a quien verifica; en microservicios preferir `RS256` / `ES256` / `EdDSA` con JWKS y `kid`.

## Cómo se usa hoy

1. **SPA con BFF:** el navegador no guarda el JWT en `localStorage` (riesgo XSS). Un Backend-for-Frontend guarda tokens en cookie `HttpOnly + Secure + SameSite` y hace proxy. Ej.: Auth.js, NextAuth.
2. **Mobile:** access en memoria, refresh en Keystore / Keychain con rotación y detección de reuso.
3. **Microservicios y API Gateway:** el gateway (Kong, AWS API GW, Istio) valida firma con JWKS cacheado y propaga claims. Ver [Ciclo de vida de un JWT en microservicios](../sistemas-distribuidos/ciclo-vida-jwt-microservicios.md).
4. **SSO con IdP:** Keycloak, Auth0, Entra ID, Firebase Auth, Supabase o Clerk publican `openid-configuration` y `jwks_uri`; todas las apps verifican sin compartir secretos.
5. **Machine-to-machine:** `client_credentials` con JWT de 1-5 min, a veces con DPoP o mTLS para que un token robado no sea reutilizable.

Regla vigente: access JWT efímero y mínimo más refresh opaco rotativo, claves asimétricas con `kid` más JWKS, y validación estricta de `iss` / `aud` / `exp`.

## Ver también

* [Anatomía de un JSON Web Token - Header, Payload y Firma](./json-web-token-anatomia-claims.md)
* [Ciclo de vida de un JWT en microservicios](../sistemas-distribuidos/ciclo-vida-jwt-microservicios.md)
* [Integración de APIs](./_index.md)

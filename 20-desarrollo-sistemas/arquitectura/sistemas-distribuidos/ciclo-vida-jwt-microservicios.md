---
title: Ciclo de vida de un JWT en microservicios
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-27
updated: 2026-09-27
related: ["../integracion-apis/json-web-token-anatomia-claims.md", "../integracion-apis/jwt-oauth2-uso-moderno-seguridad.md"]
---

# Ciclo de vida de un JWT en microservicios

Cada microservicio valida el token de forma independiente, sin volver a contactar al servicio de autenticación. Esa validación local es la clave para escalar sin cuello de botella.

## 1. Emisión

El servicio de autenticación verifica credenciales y firma el JWT. Solo este servicio posee la clave privada (en esquemas asimétricos `RS256` / `ES256`).

```js
const jwt = await new jose.SignJWT({ sub: "1234567890", roles: ["ROLE_USER"] })
  .setProtectedHeader({ alg: "RS256" })
  .setIssuedAt()
  .setIssuer("urn:mi-auth")
  .setAudience("urn:mi-api")
  .setExpirationTime("15m")
  .sign(privateKey)
```

## 2. Transmisión

El cliente envía el token en cada solicitud a los servicios, normalmente como cabecera:

```
Authorization: Bearer <jwt>
```

No se envía en la URL porque queda en logs y caché.

## 3. Validación

Cada microservicio verifica firma y vigencia de forma local. Con la librería de referencia `panva/jose` se valida emisor, audiencia y expiración:

```js
const { payload } = await jose.jwtVerify(jwt, publicKey, {
  issuer: "urn:mi-auth",
  audience: "urn:mi-api"
})
```

En producción las claves públicas se obtienen una vez desde el JWKS (`/.well-known/openid-configuration` -> `jwks_uri`) y se cachean. La selección de clave usa `kid` del header, lo que permite rotar sin downtime (`createLocalJWKSet` / `createRemoteJWKSet`).

Se valida: firma, `exp`, `nbf`, `iss`, `aud`, más tolerancia de reloj (`clockTolerance`, ej. 5 segundos).

## 4. Utilización

El microservicio extrae claims para decidir autorización (RBAC / ABAC con `roles`, `scope`, `permissions`), sin consultar la base de sesiones.

## 5. Expiración

El token deja de ser válido tras el tiempo (`exp`). Como es stateless, no se revoca por defecto: se mitiga con access corto (5-15 min) más refresh rotativo, y denylist de `jti` solo para casos críticos como logout o baneo.

## Ver también

* [Anatomía de un JSON Web Token - Header, Payload y Firma](../integracion-apis/json-web-token-anatomia-claims.md)
* [JWT vs OAuth2 y uso moderno - Ventajas, riesgos y buenas prácticas](../integracion-apis/jwt-oauth2-uso-moderno-seguridad.md)
* [Arquitecturas Distribuidas: Computación Distribuida, Microservicios y SOA](./computacion-distribuida-microservicios-soa.md)

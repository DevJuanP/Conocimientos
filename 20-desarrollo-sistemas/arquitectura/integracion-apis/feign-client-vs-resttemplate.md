---
title: FeignClient vs RestTemplate
area: desarrollo
tags: [desarrollo, programacion/java, arquitectura]
created: 2026-09-15
updated: 2026-09-17
related: ["../sistemas-distribuidos/computacion-distribuida-microservicios-soa.md"]
---

# FeignClient vs RestTemplate

`@FeignClient` de Spring Cloud OpenFeign es un cliente REST declarativo: defines una interfaz Java con anotaciones y Spring genera la implementación HTTP. Evita armar URLs, `ResponseEntity` y parseo manual como se hace con `RestTemplate`.

## 1. Que problema resuelve Feign

* Con `RestTemplate` llamas de forma imperativa: URL completa, método `getForObject` / `exchange`, mapeo y manejo de errores manual.
* Con Feign declaras el contrato: `name` del servicio + `@GetMapping`, `@PathVariable`, `@RequestBody`. Feign + balanceo + descubrimiento resuelven el resto.
* Menos boilerplate, contrato legible, integración con Eureka / load balancer y configuración por atributos.

## 2. Para que sirve la anotacion @FeignClient

Marca una interfaz como cliente de otro microservicio.

```java
@FeignClient(name = "stores") // nombre logico para balanceo / descubrimiento
public interface StoreClient {
    @GetMapping("/stores")
    List<Store> getStores();
}
```

Atributos principales:

* `name` / `value`: nombre logico del servicio. Si no hay `url`, se resuelve desde aquí.
* `url`: URL directa cuando no usas descubrimiento.
* `configuration`, `contextId`: para tener varios clientes al mismo servidor con distinta configuración sin colisiones.
* Requiere activar con `@EnableFeignClients` en la app principal.

## 3. Ejemplo con Feign

```java
// 1. Activar Feign en el proyecto
@SpringBootApplication
@EnableFeignClients // escanea interfaces @FeignClient y genera la implementacion
public class OrdersApplication { }

// 2. Solo declaras la interfaz, no implementas nada
@FeignClient(name = "users-service", url = "http://localhost:8081")
public interface UserFeignClient {

    // describes QUE quieres, Feign arma la peticion HTTP por ti
    @GetMapping("/users/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
}

// 3. Uso en tu servicio
@Service
public class OrderService {
    private final UserFeignClient userClient;

    public OrderService(UserFeignClient userClient) {
        this.userClient = userClient;
    }

    public void createOrder(Long userId) {
        // llamada como si fuera un metodo local
        UserDto user = userClient.getUserById(userId);
        // seguir con la logica
    }
}
```

## 4. Ejemplo con RestTemplate

```java
// 1. Tienes que crear el bean manualmente
@Configuration
public class RestConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); // cliente HTTP generico
    }
}

// 2. Uso en tu servicio
@Service
public class OrderService {
    private final RestTemplate restTemplate;

    public OrderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void createOrder(Long userId) {
        // tu armas URL, metodo, parametros y tipo de respuesta
        String url = "http://localhost:8081/users/{id}";

        // aqui haces todo a mano: GET + convertir JSON a UserDto
        UserDto user = restTemplate.getForObject(
            url,           // URL completa a llamar
            UserDto.class, // a que clase mapear el JSON
            userId         // reemplaza {id} en la URL
        );

        // tienes que validar null y errores (404, 500, timeout) tu mismo
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
    }
}
```

## 5. Que pasa si el microservicio no responde

* Feign lanza `FeignException` o timeout. Por defecto no reintenta ni devuelve fallback.
* Para producción necesitas configurar timeouts + circuit breaker / fallback con Resilience4j.
* Con `RestTemplate` pasa lo mismo pero el manejo (`ResponseErrorHandler`, try/catch, nulls) es totalmente manual.

## 6. Comparacion rapida

| Dimension | Feign | RestTemplate |
| :--- | :--- | :--- |
| Estilo | Declarativo, interfaz + anotaciones | Imperativo, `getForObject` / `exchange` |
| URL | `name` logico o `url`, resuelta por discovery / balanceador | String armada a mano |
| Codigo | Mínimo, sin parseo manual | Más codigo, headers, status y nulls manuales |
| Integracion | Eureka, load balancing, circuit breaker | Ninguna, hay que agregarla |
| Estado | Activo en Spring Cloud | En mantenimiento, para nuevo codigo se recomienda `RestClient` o `WebClient` |

## Ver también

* [Computación distribuida, microservicios y SOA](../sistemas-distribuidos/computacion-distribuida-microservicios-soa.md)
* [Integración de APIs](_index.md)
* [Arquitectura](../_index.md)
* [Desarrollo de sistemas](../../_index.md)

---
title: Arquitecturas Distribuidas - Computación Distribuida, Microservicios y SOA
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-10
updated: 2026-09-17
related: ["./rabbitmq-vs-kafka.md"]
---

# Arquitecturas Distribuidas: Computación Distribuida, Microservicios y SOA

Apunte del curso **Desarrollo de servicios web II**.
Contenido base proveniente de la **sesión 1** (computación distribuida, SOA y microservicios) y ampliado con conocimiento de la **sesión 2** (comunicación entre programas, cliente-servidor, sockets, protocolos y arquitecturas centralizada vs descentralizada).

Comparación de tres niveles relacionados pero distintos: la base de infraestructura (computación distribuida) y dos estilos de diseño de software (SOA y microservicios).

## Sesión 1 - Base: computación distribuida, SOA y microservicios

Contenido base proveniente de la **sesión 1** del curso **Desarrollo de servicios web II**.

### 1. Computación Distribuida

* **Definición conceptual:** Es el nivel más cercano al hardware. Consiste en un conjunto de nodos independientes (servidores físicos o máquinas virtuales), cada uno con sus propios núcleos de CPU y memorias, que colaboran a través de una red para resolver tareas complejas como una sola unidad.
* **Características principales:**
  * Escalabilidad horizontal (permite añadir más máquinas en lugar de solo potenciar una sola).
  * Tolerancia a fallos y redundancia de datos entre múltiples nodos.
  * Procesamiento de grandes volúmenes de datos distribuidos en la red.

### 2. Arquitectura Orientada a Servicios (SOA)

* **Definición conceptual:** Es un enfoque de diseño de **software** centrado en el ámbito empresarial. Divide la lógica del negocio en servicios reutilizables e interconectados que permiten la integración de múltiples aplicaciones dentro de una organización, a menudo utilizando protocolos estándar o un bus de servicios.
* **Características principales:**
  * Enfoque global a nivel de toda la empresa o múltiples sistemas.
  * Los servicios están diseñados explícitamente para ser **reutilizables** por diferentes aplicaciones.
  * Facilita la comunicación entre distintas tecnologías heterogéneas.

### 3. Microservicios

* **Definición conceptual:** Es un estilo de diseño de **software** moderno y una evolución de SOA. Consiste en dividir una aplicación grande y compleja en un conjunto de servicios pequeños y autónomos, donde cada uno cumple una función muy específica.
* **Características principales:**
  * Enfoque específico en los objetivos de **una sola aplicación** o dominio de negocio.
  * Independencia total: cada microservicio se puede desarrollar, actualizar, desplegar y escalar de forma individual sin compilar o afectar el resto del sistema.
  * Comunicación ligera basada comúnmente en APIs REST o mensajería asíncrona.

### 4. Relación y Diferencias Clave

| Dimensión | Computación Distribuida | SOA | Microservicios |
| :--- | :--- | :--- | :--- |
| **Naturaleza** | Principalmente **Hardware / Infraestructura** | Arquitectura de **Software** | Arquitectura de **Software** |
| **Ámbito** | Red de servidores físicos/virtuales interconectados | Nivel empresarial / Multisistema | Centrado en una sola aplicación grande dividida |
| **Propósito Principal** | Proveer la base computacional y tolerancia a fallos | Integración y reutilización de servicios de negocio | Autonomía, despliegue continuo y alta especialización |

## Sesión 2 - Comunicación, protocolos y centralizada vs descentralizada

Conocimiento nuevo del mismo curso **Desarrollo de servicios web II**, correspondiente a la **sesión 2**.

### 5. Comunicación entre Programas

Es el concepto general que abarca cualquier método, mecanismo o tecnología que permite a dos o más aplicaciones independientes intercambiar datos y coordinar acciones. Funciona como el "tejido conectivo" de cualquier sistema distribuido.

* **Diferencia clave:** Mientras que la "comunicación entre programas" es el concepto universal de intercambiar datos (el "qué"), arquitecturas como "cliente-servidor" o "microservicios" definen cómo se estructura y organiza esa comunicación (el "cómo").

### 6. Modelo Cliente-Servidor

Es una arquitectura específica de comunicación que establece una relación estructurada y jerárquica:

* **Cliente:** El programa que inicia la comunicación y solicita un servicio o información.
* **Servidor:** El programa que recibe la petición, la procesa y devuelve una respuesta. A menudo actúa como un intermediario o gestor centralizado de los recursos para múltiples clientes.

### 7. Sockets

Son los puntos finales (endpoints) de una conexión de red bidireccional de bajo nivel.

* Permiten el flujo de información real entre dos programas a través de una red.
* Se identifican mediante una dirección IP y un número de puerto.
* Actúan como los "canales" o tuberías por los que viajan los datos en la capa de transporte.
* **Aclaración importante:** Un socket no es HTTP ni corre sobre HTTP; es al revés. Las comunicaciones web (HTTP) se apoyan por debajo en la creación de sockets para poder transmitir su información.

### 8. Protocolos de Comunicación

Los protocolos definen las reglas y el lenguaje sobre cómo se envían los datos a través de los canales de red.

* **TCP (Transmission Control Protocol):** Protocolo de la capa de transporte que opera sobre los sockets para garantizar una conexión confiable, ordenada y sin pérdida de datos. La comunicación cliente-servidor suele ir sobre TCP (ej. HTTP sobre TCP).
* **UDP (User Datagram Protocol):** Protocolo de transporte alternativo, más rápido que TCP pero sin garantía de entrega.
* **HTTP (Hypertext Transfer Protocol):** Protocolo de nivel superior (capa de aplicación) que da estructura y significado a la comunicación mediante métodos (GET, POST), encabezados y códigos de estado. Se apoya en TCP y los sockets para viajar por la red.
* **FTP (File Transfer Protocol):** Protocolo diseñado específicamente para la transferencia, subida y descarga de archivos entre un cliente y un servidor.
* **Protocolos de Streaming:** Conjunto de protocolos optimizados para la transmisión continua de audio y video en tiempo real, priorizando un flujo constante de datos (a menudo apoyándose en UDP).

### 9. Arquitecturas de Comunicación Centralizada y Descentralizada

Ambos son enfoques para construir software distribuido (comunicación entre programas), pero gestionan el flujo de datos de manera muy distinta.

> **Aclaración clave:** TCP e IP no son exclusivos de una arquitectura. IP (capa 3, red) se encarga de direccionar y enrutar: cada programa vive en una IP + puerto (eso es el socket). TCP (capa 4, transporte) se encarga de la conexión confiable sobre esa IP. Ambas arquitecturas usan lo mismo; lo que cambia no es el protocolo, sino la topología: en la centralizada todos los sockets TCP/IP apuntan al coordinador; en la descentralizada cada servicio abre sockets TCP/IP directos con quien necesita. Lo mismo vale para el modelo cliente-servidor: cada par de servicios en un sistema descentralizado puede actuar puntualmente como cliente y servidor sobre TCP/IP. La diferencia práctica está en cómo se conocen las IPs: en la centralizada basta saber la IP del centro; en la descentralizada se necesita descubrimiento (DNS, registro de servicios, DHT o broadcast).

#### Centralizada

Todo el tráfico pasa por un nodo coordinador que recibe, decide y reparte. Flujo típico: Cliente -> Servidor central / ESB / Broker -> Cliente.

* **Intuición:** como una central telefónica o un profesor que da la palabra: nadie habla sin pasar por él.
* **Ventajas:** control único, más simple de implementar, coherencia de datos, seguridad concentrada en un solo punto.
* **Desventajas:** cuello de botella, punto único de fallo (si cae el centro, cae todo), escala peor.
* **Ejemplos:** cliente-servidor clásico, SOA con ESB, FTP central, DNS principal.

#### Descentralizada

No hay jefe obligatorio. Cada servicio es pequeño, independiente y habla directo con quien necesita según lo vaya requiriendo (peer-to-peer).

* **Intuición:** como un grupo donde todos hablan con todos sin pedir permiso.
* **Ventajas:** sin punto único de fallo, escala horizontal, resiliencia, despliegues independientes.
* **Desventajas:** más complejo de operar (descubrimiento de servicios, consistencia eventual, observabilidad, manejo de red).
* **Ejemplos:** microservicios con APIs REST o mensajería, P2P / BitTorrent, blockchain.

#### Cómo se descubren las IPs

Para abrir un socket necesitas la IP + puerto del otro. Formas típicas de conseguirlas:

* **DNS (Domain Name System):** agenda jerárquica que traduce nombres (`api.miapp.com`) a IP. El cliente pregunta a un servidor DNS y recibe la IP actual. Simple y muy usado, pero depende de esos servidores.
* **Registro de servicios (Service Registry):** directorio donde cada microservicio se inscribe al arrancar ("soy pagos, estoy en 10.0.1.5:8080") y los demás lo consultan. Ej. Consul, Eureka, etcd. Es el descubrimiento típico en microservicios.
* **DHT (Distributed Hash Table):** agenda repartida sin centro. Cada nodo guarda un pedazo del mapa clave -> IP y la búsqueda salta de par en par hasta hallarla. Ej. BitTorrent (Kademlia), IPFS. Totalmente descentralizado, pero más complejo.
* **Broadcast (y multicast):** gritar a toda la red local ("¿quién es impresora?") y quien sea responde con su IP. Ej. ARP, DHCP discovery, mDNS / Bonjour. Solo sirve en LAN, no escala a internet.

#### Comparación rápida

| Dimensión | Centralizada (ej. SOA con ESB) | Descentralizada (ej. Microservicios) |
| :--- | :--- | :--- |
| **Control** | único, en el intermediario | repartido entre servicios |
| **Fallo** | el centro tumba todo | el fallo queda aislado |
| **Escala** | vertical, limitada por el centro | horizontal, por servicio |
| **Complejidad** | baja al inicio | alta al inicio (red, descubrimiento) |
| **Transporte** | sockets (IP+puerto) + TCP (todos contra el centro) | sockets (IP+puerto) + TCP/UDP (directos entre pares) |
| **Conexión con sesión 2** | cliente-servidor + TCP + HTTP pasando por un solo servidor | múltiples cliente-servidor puntuales + TCP + HTTP/mensajería entre pares |

## Ver también

* [RabbitMQ vs Kafka](rabbitmq-vs-kafka.md)
* [Sistemas distribuidos](_index.md)
* [Arquitectura](../_index.md)
* [Desarrollo de sistemas](../../_index.md)

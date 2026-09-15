---
title: RabbitMQ vs Kafka
area: desarrollo
tags: [desarrollo, arquitectura]
created: 2026-09-15
updated: 2026-09-15
related: ["./computacion-distribuida-microservicios-soa.md"]
---

# RabbitMQ vs Kafka

Dos formas distintas de mover mensajes entre servicios: RabbitMQ es un broker tradicional de colas para entregar tareas a un destinatario preciso, Kafka es un log distribuido persistente para difundir hechos a muchos consumidores.

## 1. Modelo mental

* **RabbitMQ — el cartero:** un `exchange` enruta cada mensaje a una cola exacta según su `routing key`. Un mensaje, un destinatario preciso. Ideal para tareas puntuales: "reserva este stock".
* **Kafka — la pizarra compartida:** un `topic` guarda el evento y cualquier número de consumers puede leerlo, cada uno a su ritmo. Ideal para difundir un hecho a varios interesados a la vez: "esto se vendió".

## 2. Diferencias clave

| Dimensión | RabbitMQ | Kafka |
| :--- | :--- | :--- |
| Qué es | Message broker con colas inteligentes | Log distribuido persistente |
| Enrutamiento | Exchange + routing key + cola | Topic + particiones + consumer groups + offset |
| Consumo | Destructivo: se borra con `ack` | No destructivo: persiste por retención, permite replay |
| Orden | Por cola | Por partición |
| Throughput | Miles msg/s, baja latencia | Millones msg/s, pensado para escala horizontal |
| Routing | Flexible (direct, topic, fanout, headers), reintentos y dead-letter fáciles | Simple por mensaje, el poder está en el almacenamiento y relectura |
| Operación | Más liviano para empezar | Más pesado de operar |

Regla de oro: ¿necesitas que alguien **haga algo**? RabbitMQ. ¿Necesitas que todos **se enteren de que algo pasó**? Kafka.

## 3. Cuando usar RabbitMQ (una tarea para alguien)

1. **Procesar un pago:** `pedido-creado -> cola-pagos`. Un solo worker lo cobra. Necesitas ack, reintento y dead-letter si falla.
2. **Enviar emails / SMS / push transaccionales:** encolas "envía factura #123" sin bloquear la web. Si un worker cae, otro lo toma.
3. **Tareas pesadas en background:** redimensionar imágenes o generar PDFs con work queue. Varios workers consumen de la misma cola con reparto justo.
4. **Reserva de stock / inventario:** "reserva 2 unidades del SKU X" debe llegar a un solo destinatario exacto vía routing key, sin replay de hace días que descuadre el stock.
5. **RPC entre microservicios:** request/reply nativo para `auth.check-user` o `precios.calcula`. Kafka no está pensado para esto.

## 4. Cuando usar Kafka (un hecho para muchos)

1. **Evento `esto-se-vendio` en e-commerce:** el mismo evento lo leen a la vez stock, facturación, recomendaciones y analytics, cada uno con su offset y ritmo.
2. **CDC y sincronización:** Postgres emite cambios y Kafka los guarda como log para replicar a Elastic, Redis o data warehouse. Si un destino cae, relee desde el offset.
3. **Logs, métricas e IoT:** ingesta de millones de eventos/s de sensores, apps o clicks, con retención de días para reprocesar.
4. **Auditoría y Event Sourcing:** "transferencia-hecha" como fuente de verdad en banca. Permite reconstruir el estado releyendo el topic desde cero.
5. **Detección de fraude en tiempo real:** stream de transacciones consumido por Flink / ksqlDB / Spark para detectar patrones y emitir alertas sin afectarse entre consumidores.

## Ver también

* [Computación distribuida, microservicios y SOA](computacion-distribuida-microservicios-soa.md)
* [Arquitectura](_index.md)
* [Desarrollo de sistemas](../_index.md)

---
title: Streams: Qué Son y Ventajas
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-19
updated: 2026-09-19
related: ["../../00-meta/glosario.md", "archivos-permisos-metadatos.md", "recuperacion-estado-sin-bd.md", "archivos-streams-serializacion.md"]
---

# Streams: Qué Son y Ventajas

## Concepto Central

Un **stream** (flujo) es una **secuencia de elementos disponibles en el tiempo**, procesables **incrementalmente** sin cargar todo en memoria.

---

## Tipos Principales

| Tipo | Ejemplos | Caso de Uso |
|------|----------|-------------|
| **Unix Streams** | `stdin`, `stdout`, `stderr`, pipes (`|`) | Composición CLI, redirección |
| **Language Streams** | Java `Stream<T>`, C# `IEnumerable`/`IAsyncEnumerable`, Node.js `Readable/Writable/Transform`, Go `io.Reader/Writer`, Rust `Iterator`/`Stream` | Procesamiento en memoria, lazy evaluation |
| **Data Streaming Platforms** | Kafka, Kinesis, Pulsar, Redpanda, NATS JetStream | Event-driven, logs, métricas, CDC |
| **Reactive Streams** | RxJS, Project Reactor, Akka Streams, Kotlin Flow | Backpressure, async non-blocking |

---

## Ventajas Clave

| Ventaja | Explicación |
|---------|-------------|
| **Memoria constante O(1)** | Procesas elemento a elemento; no cargas dataset completo |
| **Lazy / Pull-based** | Cómputo solo cuando se consume (ej. `filter().map().collect()`) |
| **Composición declarativa** | `source → filter → map → reduce → sink` (pipeline) |
| **Backpressure** | El consumidor controla ritmo; evita OOM en productores rápidos |
| **Resiliencia + Replay** | Kafka/Pulsar: retención, *offset management*, *exactly-once* |
| **Paralelismo natural** | `parallelStream()`, particiones Kafka, operadores `flatMapMerge` |
| **Tiempo real** | Procesamiento *event-by-event* (latencia ms) vs batch (horas) |
| **Separación productor/consumidor** | Desacoplamiento temporal y espacial |

---

## Analogía Rápida

```
Array/List:  [📦📦📦📦📦]  → Todo en RAM de golpe
Stream:      📦 → 📦 → 📦 → 📦 → 📦  → Uno a uno, "bajo demanda"
```

---

## Cuándo NO Usar Streams

- Datos pequeños que caben en memoria y necesitas acceso aleatorio (índice, búsqueda)
- Operaciones que requieren *multiple passes* (ordenar, agrupar global) → mejor materializar
- Latencia ultra-baja determinista (overhead de abstracción)

---

## Conceptos Clave del Glosario

- **Backpressure**: Mecanismo donde el consumidor controla la tasa del productor
- **Batch**: Procesamiento por lotes (acumula N registros y procesa juntos)
- **Lazy Evaluation**: Cómputo diferido hasta que se necesita el resultado
- **Pull / Push**: Pull = consumidor solicita; Push = productor envía
- **Reactive Streams**: Estándar de streams asíncronos con backpressure
- **Duplex Stream**: Stream legible y escribible a la vez (ej. socket TCP)
- **Offset**: Posición actual en un stream/archivo (cursor)

## Ver también

- [Glosario técnico](../../00-meta/glosario.md)
- [Archivos, Permisos y Metadatos](archivos-permisos-metadatos.md)
- [Recuperación de Estado sin Base de Datos](recuperacion-estado-sin-bd.md)
- [Archivos, Streams y Serialización](archivos-streams-serializacion.md)
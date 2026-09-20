---
title: Recuperación de Estado sin Base de Datos
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-19
updated: 2026-09-19
related: ["../../00-meta/glosario.md", "archivos-permisos-metadatos.md", "streams-ventajas.md", "archivos-streams-serializacion.md"]
---

# Recuperación de Estado sin Base de Datos

Patrones y arquitecturas para persistir y recuperar objetos completos (usuarios, pedidos, configuraciones) sin usar una base de datos tradicional.

## Problema

Un sistema se cierra (crash, apagón, shutdown controlado). ¿Cómo recuperar el estado completo al reiniciar sin PostgreSQL/MySQL/MongoDB?

## Patrones Principales

### 1. Write-Ahead Log (WAL) / Append-Only Log

```
Operación → Log persistente (fsync) → Aplicar a memoria → Ack
```

- **Ejemplos**: Redis AOF, Kafka, etcd/raft, RocksDB WAL
- **Recuperación**: *Replay* secuencial del log al arrancar
- **Garantía**: Durabilidad configurable (`fsync everysec` / `always` / `no`)

### 2. Snapshotting (Checkpointing)

```
Estado memoria → Serializar → Disco (periódico / por tamaño / por tiempo)
```

- **Ejemplos**: Redis RDB, MongoDB checkpoints, SQLite, Java serialization, protobuf/flatbuffers
- **Recuperación**: Cargar último snapshot + replay WAL desde offset
- **Tradeoff**: RPO (pérdida de datos) vs overhead de escritura

### 3. Event Sourcing

```
Comando → Evento (append-only store) → Proyección → Estado actual
```

- **Ejemplos**: EventStoreDB, Axon, Kafka + projections, CQRS
- **Recuperación**: *Replay* eventos desde origen o desde *snapshot* periódico
- **Ventaja**: Auditoría completa, *time-travel*, reconstrucción de vistas

### 4. Embedded Key-Value / Document Stores

| Motor | Modelo | Uso típico |
|-------|--------|------------|
| **RocksDB / LevelDB** | LSM-tree KV | Metadatos, índices, cache persistente |
| **SQLite** | SQL embebido | Config, colas, estado transaccional |
| **BoltDB / Badger** | B-tree KV | Go services, etcd backend |
| **LMDB** | B-tree mmap | Alta concurrencia, read-heavy |

### 5. Memory-Mapped Files (mmap)

- Estructuras *in-memory* mapeadas directo a disco (`mmap`, `mmapfile`, `mmap.go`, `Java MappedByteBuffer`)
- El SO gestiona *page faults* y *flush* (`msync` / `FlushViewOfFile`)
- Usado en: **LMDB**, **Redis modules**, **mmap-based caches**

### 6. Hybrid: Tiered Storage (Como usan las empresas con caché)

```
Hot:  RAM (LRU/LFU)          →  < 1ms
Warm: NVMe/SSD (RocksDB)     →  ~1ms
Cold: Object storage (S3)    →  ~10-100ms
```

- **Ejemplos**: Redis Cluster + Redis on Flash, Apache Ignite, Hazelcast, Dragonfly
- *Tiering* automático por temperatura de acceso

## Comparativa Rápida

| Patrón | Consistencia | Latencia escritura | Recuperación | Complejidad |
|--------|--------------|-------------------|--------------|-------------|
| WAL puro | Fuerte (fsync) | Media | Replay completo | Baja |
| Snapshot + WAL | Fuerte | Baja (batch) | Snapshot + replay parcial | Media |
| Event Sourcing | Eventual/Fuerte | Media | Replay eventos | Alta |
| Embedded KV (RocksDB) | Fuerte (WAL interno) | Muy baja | Abrir DB | Media |
| mmap | Débil (SO decide) | Muy baja | Instantáneo | Baja |

## Qué Usan las Grandes Empresas (Ejemplos Reales)

- **Redis**: RDB (snapshot) + AOF (WAL) híbrido
- **Kafka**: Log segmentado + índices + *log compaction*
- **etcd/Consul**: Raft + boltdb (MVCC) + snapshots periódicos
- **Cassandra**: Memtable (RAM) → SSTable (disco) + commitlog (WAL)
- **ScyllaDB/Redis-on-Flash**: Tiering RAM→NVMe automático

## Conceptos Clave del Glosario

- **WAL** (Write-Ahead Log): Log de cambios antes de aplicarlos a estructura principal
- **RPO** (Recovery Point Objective): Máxima pérdida de datos tolerada
- **RTO** (Recovery Time Objective): Tiempo máximo para recuperar servicio
- **LSM-tree**: Estructura optimizada para escrituras (RocksDB, Cassandra)
- **Log Compaction**: Retener solo última versión de cada clave
- **MVCC**: Control de concurrencia con versiones
- **Tiered Storage**: Almacenamiento en capas por temperatura de datos

## Ver también

- [Glosario técnico](../../00-meta/glosario.md)
- [Archivos, Permisos y Metadatos](archivos-permisos-metadatos.md)
- [Streams: Qué son y Ventajas](streams-ventajas.md)
- [Archivos, Streams y Serialización](archivos-streams-serializacion.md)
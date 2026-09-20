---
title: Archivos, Streams y Serialización
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-19
updated: 2026-09-19
related: ["../../00-meta/glosario.md", "archivos-permisos-metadatos.md", "streams-ventajas.md", "recuperacion-estado-sin-bd.md"]
---

# Archivos, Streams y Serialización: Conceptos Concretos

Relación práctica entre los tres pilares: archivo (persistencia), stream (transporte) y serialización (formato).

---

## 1. Archivo (File)

**Definición**: Entrada en un sistema de archivos que mapea un **nombre** → **secuencia de bytes persistente** en almacenamiento no volátil.

| Propiedad | Qué significa |
|-----------|---------------|
| **Inode / File ID** | Identificador único en el FS (metadatos: permisos, timestamps, punteros a bloques) |
| **Bloques de datos** | Unidades físicas (4KB típicos) donde viven los bytes |
| **Handle / File Descriptor** | Capacidad del proceso para operar sobre el archivo (offset actual, flags) |
| **Tipos** | Regular, directorio, symlink, device, FIFO, socket, *mmap* |

**Operaciones canónicas**: `open → read/write/seek → close` (POSIX) / `CreateFile → ReadFile/WriteFile → CloseHandle` (Win32)

---

## 2. Stream (Flujo)

**Definición**: **Abstracción de secuencia ordenada de bytes** con un **cursor de posición** y operaciones `read`/`write`/`seek`/`flush`, **desacoplada del almacenamiento subyacente**.

| Dimensión | Variantes |
|-----------|-----------|
| **Origen/Destino** | Archivo (`FileStream`), red (`NetworkStream`), memoria (`MemoryStream`), pipe, compresión (`GZipStream`), cifrado (`CryptoStream`), buffer (`BufferedStream`) |
| **Dirección** | `Readable`, `Writable`, `Duplex`/`ReadWrite` |
| **Modelo** | *Pull* (sincrónico/bloqueante) vs *Push* (async/event-driven, `IAsyncEnumerable`, Reactive Streams) |
| **Buffering** | None, line-buffered, fully-buffered (controla cuántas syscalls reales) |

**Diferencia clave con Archivo**:
- **Archivo** = recurso persistente con metadatos FS (nombre, permisos, inode)
- **Stream** = *interfaz de acceso* secuencial; un mismo archivo puede tener múltiples streams simultáneos (distintos offsets, buffering, capas de transformación)

---

## 3. Serialización de Objetos

**Definición**: Proceso de convertir un **grafo de objetos en memoria** (referencias, ciclos, polimorfismo) → **secuencia de bytes** (stream/archivo) y viceversa (deserialización).

| Aspecto | Detalle |
|---------|---------|
| **Formato** | Binario (protobuf, MessagePack, Avro, Java Serialization, .NET BinaryFormatter) / Texto (JSON, XML, YAML, TOML, CSV) |
| **Esquema** | *Schema-less* (JSON) vs *Schema-driven* (protobuf, Avro, Thrift) → evolución de versión |
| **Grafo** | Manejo de referencias compartidas, ciclos, *object identity* (ej. `$id`/`$ref` en JSON.NET, *back-references* en protobuf) |
| **Polimorfismo** | *Type discriminators* (`$type`, `oneof`, `Any`), registro de tipos conocidos |
| **Seguridad** | *Deserialization gadgets* → validación estricta, *allowlists*, evitar formatos con code-execution nativo (Java Serialization, pickle, BinaryFormatter) |
| **Versionado** | Campos opcionales, default values, *unknown fields preservation*, *schema evolution rules* (protobuf: field number nunca se reusa) |

---

## Relación entre los Tres

```
┌─────────────────────────────────────────────────────────────┐
│  OBJETO EN MEMORIA (grafo: User{Order[]{Item[]}})           │
└─────────────────────┬───────────────────────────────────────┘
                      │ Serialización (encode)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  STREAM (bytes: protobuf/JSON/MessagePack...)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ CryptoStream│→ │GZipStream   │→ │BufferedStream│         │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────┬───────────────────────────────────────┘
                      │ write() / flush()
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  ARCHIVO (persistencia: /var/data/orders.bin)               │
│  - inode, permisos, timestamps                              │
│  - bloques en disco                                         │
└─────────────────────────────────────────────────────────────┘
```

**Flujo inverso (lectura)**: Archivo → `FileStream` → capas de transformación → Deserializador → Objeto en memoria.

---

## Puntos Críticos en la Práctica

| Tema | Qué vigilar |
|------|-------------|
| **Atomicidad** | `write → fsync → rename` (POSIX) / `ReplaceFile` (Windows) para no dejar archivos corruptos |
| **Stream positioning** | `seek` solo en *seekable* streams (archivos, memoria); network streams no |
| **Buffering & flush** | `flush()` vacía buffers de usuario; `fsync`/`FlushFileBuffers` fuerza a disco |
| **Encoding** | Texto: UTF-8 siempre (BOM opcional); Binario: *endianness* explícito (little-endian default en protobuf/Avro) |
| **Límites** | `max_message_size`, `recursion_limit`, `object_graph_depth` para evitar DoS |
| **Streaming serialization** | `JsonSerializer.SerializeAsync(stream, obj)` / `Protobuf.MergeDelimitedFrom` → procesan sin materializar todo el grafo en RAM |

---

## Conceptos Clave del Glosario

- **Serialización**: Convertir grafo de objetos → secuencia de bytes
- **Deserialización**: Reconstruir objeto en memoria desde bytes
- **Schema / Esquema**: Definición formal de estructura de datos
- **Schema Evolution**: Reglas para cambiar esquema sin romper compatibilidad
- **Protobuf**: Protocol Buffers - serialización binaria con esquema (Google)
- **MessagePack**: Serialización binaria compacta, compatible con JSON
- **Avro**: Formato de serialización binario con esquema (Apache)
- **Endianness**: Orden de bytes (little-endian vs big-endian)
- **Zero-Copy**: Transferir datos sin copiar entre buffers kernel/user
- **mmap**: Memory-Mapped File - mapear archivo a memoria virtual

## Ver también

- [Glosario técnico](../../00-meta/glosario.md)
- [Archivos, Permisos y Metadatos](archivos-permisos-metadatos.md)
- [Streams: Qué son y Ventajas](streams-ventajas.md)
- [Recuperación de Estado sin Base de Datos](recuperacion-estado-sin-bd.md)
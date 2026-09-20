---
title: Glosario
area: meta
tags: [meta]
created: 2026-09-07
updated: 2026-09-19
related: ["./convenciones.md"]
---

# Glosario

Términos del sistema (no de las materias).

| Término | Significado |
|---|---|
| Nota | Un archivo `.md` con frontmatter. |
| MOC | Map of Content: un `_index.md` que cura enlaces de un tema. |
| Inbox | `99-inbox/`, bandeja de entrada sin procesar. |
| Frontmatter | Bloque YAML `---` al inicio de cada nota. |
| Enlace relativo | `[texto](./otra-nota.md)`, portable entre herramientas. |
| Wikilink | `[[otra-nota]]`, solo Obsidian/Logseq. Evitar en notas finales. |
| Área | Valor de `area` en frontmatter: `instituto`, `desarrollo`, `electronica`, `ciencias`, `cursos-extras`, `meta`. |

---

# Glosario Técnico (Conversación)

Términos técnicos mencionados en la conversación sobre archivos, streams, serialización y recuperación de estado.

## A - C

| Término | Definición |
|---|---|
| **ACL** (Access Control List) | Lista de control de acceso; mecanismo de permisos en Windows (y POSIX.1e) que asocia SID/usuarios a derechos sobre un objeto. |
| **ADS** (Alternate Data Streams) | Característica de NTFS que permite adjuntar múltiples flujos de datos a un mismo archivo (metadatos ocultos). |
| **AOF** (Append-Only File) | Formato de persistencia de Redis: log de operaciones de escritura secuenciales. |
| **API** | Interfaz de programación de aplicaciones. |
| **Atomicidad** | Propiedad de una operación: o se completa entera o no tiene efecto (todo o nada). |
| **Avro** | Formato de serialización binario con esquema (Apache), usado en Kafka/Hadoop. |
| **Backpressure** | Mecanismo donde el consumidor controla la tasa del productor para evitar saturación. |
| **Batch** | Procesamiento por lotes (acumula N registros y procesa juntos). |
| **B-tree** | Estructura de árbol balanceada para índices (búsquedas O(log n)). |
| **Buffer/Buffering** | Memoria intermedia que agrupa escrituras/lecturas para reducir syscalls. |
| **Byte** | Unidad básica de información (8 bits). |
| **Capability** (Linux) | Privilegio granular (ej. `CAP_NET_BIND_SERVICE`) que sustituye a setuid root. |
| **Caso de uso** | Escenario concreto de cómo un usuario interactúa con el sistema. |
| **CDC** (Change Data Capture) | Captura de cambios en BD para replicarlos en tiempo real. |
| **Checkpoint** | Punto de control: snapshot periódico del estado para acortar recuperación. |
| **CLI** | Command Line Interface (interfaz de línea de comandos). |
| **CoW** (Copy-on-Write) | Técnica: al modificar, se copia la página/bloque; el original queda intacto. |
| **CQRS** | Command Query Responsibility Segregation: separa modelo de escritura y lectura. |
| **Cron** | Planificador de tareas periódicas en Unix. |

## D - F

| Término | Definición |
|---|---|
| **Daemon** | Proceso en segundo plano (servicio). |
| **Deserialización** | Reconstruir objeto en memoria desde bytes (inverso de serialización). |
| **DevOps** | Prácticas que unen desarrollo y operaciones (CI/CD, infraestructura como código). |
| **Diferencial** | Backup que solo guarda cambios desde el último backup completo. |
| **Disco/Storage** | Medio no volátil (HDD, SSD, NVMe). |
| **Duplex Stream** | Stream legible y escribible a la vez (ej. socket TCP). |
| **Durabilidad** | Garantía de que datos confirmados sobreviven a fallos de energía (fsync, WAL). |
| **ELF** (Executable and Linkable Format) | Formato estándar de ejecutables y bibliotecas en Linux/Unix. |
| **Endianness** | Orden de bytes: little-endian (Intel) vs big-endian (red). |
| **Event Sourcing** | Persistir eventos (hechos) en lugar de estado actual; el estado se deriva por replay. |
| **Eventual Consistency** | Modelo donde réplicas convergen sin garantía inmediata. |
| **Extent** | Bloque contiguo de disco asignado a un archivo (vs bloques dispersos). |
| **File Descriptor / Handle** | Identificador entero que el kernel da a un proceso para operar un archivo abierto. |
| **Filesystem (FS)** | Sistema de archivos (ext4, NTFS, ZFS, btrfs, APFS...). |
| **Flush** | Forzar vaciado de buffers de usuario al kernel / disco. |
| **Fork** | Crear proceso hijo clonando al padre (Unix). |
| **fsync** | Llamada al sistema que fuerza escritura física a disco (durabilidad). |
| **FIFO / Named Pipe** | Archivo especial tipo tubería con nombre en el FS. |

## G - L

| Término | Definición |
|---|---|
| **GID** (Group ID) | Identificador numérico de grupo (POSIX). |
| **Glosario** | Lista de términos y definiciones. |
| **Gossip Protocol** | Propagación descentralizada de información entre nodos. |
| **Handle** | Ver File Descriptor (término Windows). |
| **Heap** | Memoria dinámica gestionada por runtime (malloc, GC). |
| **Inode** | Estructura de metadatos de un archivo en FS tipo Unix (número único, permisos, timestamps, punteros a bloques). |
| **IPC** (Inter-Process Communication) | Comunicación entre procesos (pipes, sockets, shared memory, D-Bus). |
| **JSON** (JavaScript Object Notation) | Formato textual de intercambio de datos (schema-less). |
| **Kafka** | Plataforma de streaming distribuida (log particionado, replicado). |
| **KV** (Key-Value) | Modelo de datos clave-valor (Redis, RocksDB, etcd). |
| **Latencia** | Tiempo entre petición y respuesta. |
| **Lazy Evaluation** | Cómputo diferido hasta que se necesita el resultado. |
| **LSM-tree** (Log-Structured Merge-tree) | Estructura de almacenamiento optimizada para escrituras (RocksDB, LevelDB, Cassandra). |
| **Log Compaction** | Retener solo la última versión de cada clave en un log (Kafka, etcd). |

## M - P

| Término | Definición |
|---|---|
| **Mach-O** | Formato de ejecutables en macOS/iOS. |
| **Mapper/Mapping** | Transformar datos de una forma a otra (ORM, serializador). |
| **mmap** (Memory-Mapped File) | Mapear archivo a memoria virtual; el SO pagina bajo demanda. |
| **MOC** | Ver arriba (Map of Content). |
| **MessagePack** | Serialización binaria compacta, compatible con JSON. |
| **Metadata / Metadatos** | Datos que describen a otros datos (tamaño, timestamps, permisos, MIME). |
| **MIME Type** | Media Type (ej. `application/json`, `image/png`). |
| **MVCC** (Multi-Version Concurrency Control) | Control de concurrencia con versiones (PostgreSQL, etcd, SQLite). |
| **Namespace** | Aislamiento de recursos (Linux: pid, net, mnt, user...). |
| **NVMe** | Non-Volatile Memory Express: protocolo SSD de alto rendimiento. |
| **Offset** | Posición actual en un stream/archivo (cursor). |
| **OOM** (Out Of Memory) | Fallo por agotar memoria disponible. |
| **Página (Page)** | Unidad de memoria virtual (4KB típicas). |
| **Page Fault** | Interrupción: página no está en RAM; el SO la carga desde disco. |
| **PE/COFF** (Portable Executable) | Formato de ejecutables en Windows (.exe, .dll). |
| **Persistencia** | Datos que sobreviven al reinicio del proceso/SO. |
| **Pipe** | Canal unidireccional entre procesos (`|` en shell). |
| **Polimorfismo** | Capacidad de tratar objetos de distinta clase mediante interfaz común. |
| **POSIX** | Estándar de API portable para sistemas Unix (IEEE 1003.1). |
| **Protocolo** | Conjunto de reglas de comunicación (HTTP, gRPC, Kafka protocol). |
| **Protobuf** (Protocol Buffers) | Serialización binaria con esquema (Google). |
| **Pull / Push** | Pull: consumidor solicita; Push: productor envía. |

## Q - S

| Término | Definición |
|---|---|
| **Raft** | Algoritmo de consenso distribuido (etcd, Consul). |
| **RDB** (Redis Database) | Snapshot binario puntual de Redis. |
| **Reactive Streams** | Estándar de streams asíncronos con backpressure (RxJS, Reactor, Flow). |
| **Registro / Registry** | Base de datos jerárquica de configuración (Windows). |
| **RPO** (Recovery Point Objective) | Máxima pérdida de datos tolerada (tiempo). |
| **RTO** (Recovery Time Objective) | Tiempo máximo para recuperar servicio. |
| **RW / RO** | Read-Write / Read-Only. |
| **Schema / Esquema** | Definición formal de estructura de datos (protobuf, Avro, JSON Schema, SQL DDL). |
| **Schema Evolution** | Reglas para cambiar esquema sin romper compatibilidad. |
| **Seek / Seekable** | Mover cursor a posición arbitraria (archivos sí, sockets no). |
| **Serialización** | Convertir grafo de objetos → secuencia de bytes. |
| **Setuid / Setgid** | Bits que hacen que un ejecutable corra con UID/GID del owner (no del que lo invoca). |
| **SID** (Security Identifier) | Identificador único de usuario/grupo en Windows. |
| **Snapshot** | Copia puntual del estado (memoria, disco, BD). |
| **Socket** | Extremo de comunicación bidireccional (red, Unix domain). |
| **SSD** (Solid State Drive) | Disco sin partes móviles (flash NAND). |
| **Stream / Flujo** | Secuencia ordenada de bytes con cursor, interfaz read/write/seek/flush. |
| **Sticky Bit** | Bit en directorio: solo owner puede borrar sus archivos (ej. `/tmp`). |
| **Syscall** | Llamada al sistema (kernel): `open`, `read`, `write`, `mmap`, `fsync`... |

## T - Z

| Término | Definición |
|---|---|
| **Thread / Hilo** | Unidad de ejecución dentro de un proceso (comparten memoria). |
| **Tiered Storage** | Almacenamiento en capas (RAM → NVMe → HDD → S3) por temperatura de datos. |
| **Timestamp** | Marca de tiempo (created, modified, accessed, birth/creation). |
| **TLV** (Type-Length-Value) | Codificación: tipo, longitud, valor (protobuf, BER). |
| **UID** (User ID) | Identificador numérico de usuario (POSIX). |
| **WAL** (Write-Ahead Log) | Log de cambios antes de aplicarlos a estructura principal (durabilidad). |
| **Watcher / Watch** | Notificación de cambios en FS (inotify, kqueue, ReadDirectoryChangesW). |
| **Xattr** (Extended Attributes) | Pares clave-valor adjuntos a inode (Linux/macOS). |
| **YAML** | Serialización legible (config, frontmatter). |
| **Zero-Copy** | Transferir datos sin copiar entre buffers de kernel/user (sendfile, splice, mmap). |
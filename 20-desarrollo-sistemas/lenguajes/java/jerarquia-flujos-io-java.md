---
title: Jerarquía de Flujos de I/O en Java
area: desarrollo
tags: [desarrollo, programacion/java]
created: 2026-09-20
updated: 2026-09-20
related: ["../../archivos-y-almacenamiento/streams-ventajas.md", "../../archivos-y-almacenamiento/archivos-streams-serializacion.md", "../../archivos-y-almacenamiento/serializacion-y-deserializacion-ejemplos.md"]
---

# Jerarquía de Flujos de I/O en Java

Mapa de la jerarquía de flujos de **bytes** de `java.io` (`InputStream`/`OutputStream`), qué rol cumple cada clase y cómo elegir la correcta en cada caso.

## Visión general

Java separa el I/O en dos mundos paralelos:

- **Flujos de bytes** (`InputStream` / `OutputStream`): 8 bits. Para datos binarios (archivos, imágenes, serialización).
- **Flujos de caracteres** (`Reader` / `Writer`): 16 bits Unicode. Para **texto**. No aparecen en el diagrama clásico, pero son la vía correcta para strings.

Ambas raíces son clases abstractas y los árboles son **simétricos**: casi toda clase de entrada tiene su espejo de salida. Aprender una rama te regala la otra.

## Árbol InputStream (lectura)

```
InputStream (abstract)
├── FileInputStream            → lee bytes de un archivo
├── FilterInputStream          → base de decoradores (envuelve otro InputStream)
│   ├── BufferedInputStream    → buffer en memoria → menos llamadas al SO
│   ├── DataInputStream        → lee primitivos (int, double, UTF) en binario
│   ├── LineNumberInputStream  → ⚠ DEPRECADA → usar LineNumberReader
│   └── PushbackInputStream    → "devuelve" bytes leídos (útil en parsers)
├── PipedInputStream           → recibe bytes de un PipedOutputStream (entre hilos)
├── SequenceInputStream        → concatena varios InputStream como uno solo
├── ByteArrayInputStream       → lee desde un byte[] en memoria
├── StringBufferInputStream    → ⚠ DEPRECADA → usar StringReader
└── ObjectInputStream          → deserializa objetos Serializable
```

## Árbol OutputStream (escritura)

```
OutputStream (abstract)
├── FileOutputStream           → escribe bytes a un archivo
├── FilterOutputStream         → base de decoradores
│   ├── BufferedOutputStream   → buffer de escritura (flush() lo vacía)
│   ├── DataOutputStream       → escribe primitivos en binario
│   └── PrintStream            → salida formateada (System.out es uno)
├── PipedOutputStream          → envía bytes a un PipedInputStream
├── ByteArrayOutputStream      → acumula bytes en memoria (toByteArray())
└── ObjectOutputStream         → serializa objetos Serializable
```

## Las clases agrupadas por rol

| Rol | Clases | Qué hacen |
|-----|--------|-----------|
| **Origen/destino real** | `File*`, `ByteArray*`, `Piped*` | Conectan con un recurso: archivo, memoria u otro hilo |
| **Decoradores** | `Filter*` y sus hijos | Envuelven otro stream y le añaden una capacidad sin cambiar la interfaz |
| **Serialización** | `ObjectInputStream` / `ObjectOutputStream` | Convierten objetos `Serializable` ↔ bytes |
| **Utilidad** | `SequenceInputStream` | Trata varios flujos de entrada como uno |

## Patrón Decorator: la idea clave

`FilterInputStream` / `FilterOutputStream` implementan el patrón **Decorator**: reciben otro stream en el constructor y delegan en él añadiendo comportamiento. Por eso Java I/O se apila en capas:

```java
// Lectura eficiente: archivo → buffer → primitivos
try (var in = new DataInputStream(
                new BufferedInputStream(
                    new FileInputStream("datos.bin")))) {
    int n = in.readInt();
}
```

Cada capa aporta algo: `FileInputStream` abre el recurso, `BufferedInputStream` lo hace rápido, `DataInputStream` sabe leer un `int`. El decorador más externo es el de más alto nivel.

## Guía rápida: ¿qué clase uso para...?

| Necesito... | Clase |
|-------------|-------|
| Leer/escribir un archivo binario | `FileInputStream` / `FileOutputStream` |
| Que sea rápido | envolver con `Buffered*` |
| Leer/escribir primitivos (`int`, `double`...) | `DataInputStream` / `DataOutputStream` |
| Guardar/cargar objetos | `ObjectInputStream` / `ObjectOutputStream` (+ `Serializable`) |
| Datos temporales en RAM | `ByteArrayInputStream` / `ByteArrayOutputStream` |
| Comunicar dos hilos | `PipedInputStream` + `PipedOutputStream` |
| Imprimir texto formateado | `PrintStream` (para texto, mejor `PrintWriter`) |
| Concatenar fuentes de entrada | `SequenceInputStream` |
| Mirar bytes y "devolverlos" | `PushbackInputStream` |

## Notas y trampas

- **Deprecadas**: `LineNumberInputStream` y `StringBufferInputStream` (desde Java 1.1) por manejar mal la conversión bytes↔caracteres. Reemplazos: `LineNumberReader` y `StringReader`.
- Para **texto** usa `Reader`/`Writer`, o el puente `InputStreamReader` / `OutputStreamWriter` con charset explícito (idealmente UTF-8). Los streams de bytes no entienden de encoding.
- `PrintStream` traga las excepciones de I/O silenciosamente (`checkError()` devuelve el estado): no usar para lógica crítica.
- Cierra siempre con **try-with-resources**; al cerrar el decorador externo se cierran todos los envueltos en cadena.
- `Buffered*` y `PrintStream` necesitan `flush()` (o `close()`) para vaciar el buffer.
- En Java moderno, para archivos la API `java.nio.file.Files` (`Files.readAllBytes`, `Files.newInputStream`...) suele ser más directa que la jerarquía clásica.

## Ver también

* [Streams: Qué son y Ventajas](../../archivos-y-almacenamiento/streams-ventajas.md)
* [Archivos, Streams y Serialización](../../archivos-y-almacenamiento/archivos-streams-serializacion.md)
* [Serialización y Deserialización con Ejemplos](../../archivos-y-almacenamiento/serializacion-y-deserializacion-ejemplos.md)

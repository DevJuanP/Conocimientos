---
title: Archivos, Permisos y Metadatos
area: desarrollo
tags: [desarrollo, arquitectura, devops]
created: 2026-09-19
updated: 2026-09-19
related: ["../../00-meta/glosario.md", "archivos-streams-serializacion.md", "streams-ventajas.md"]
---

# Archivos, Permisos y Metadatos

Visión general de conceptos fundamentales de sistemas de archivos, permisos y metadatos en sistemas operativos modernos.

## Tipos de Archivos

| Tipo | Descripción | Ejemplos |
|------|-------------|----------|
| **Regular** | Datos de usuario | `.txt`, `.pdf`, `.jpg`, binarios |
| **Ejecutable** | Código que el SO puede cargar y correr | `ELF` (Linux), `PE/.exe` (Windows), `Mach-O` (macOS) |
| **Script** | Texto interpretado por un runtime | `.sh`, `.py`, `.js`, `.bat` |
| **Especiales** | Dispositivos, pipes, sockets, symlinks | `/dev/null`, `pipe`, `socket` |

## Permisos (POSIX / Linux / macOS)

```
rwx rwx rwx
│  │  └─ Otros
│  └──── Grupo
└────── Usuario (owner)
```

- **r** = leer (4), **w** = escribir (2), **x** = ejecutar (1)
- Octal: `0755` = `rwxr-xr-x`
- **Setuid/Setgid/Sticky**: bits extra (`4xxx`, `2xxx`, `1xxx`)

### Bits Especiales en Ejecutables

| Bit | Efecto | Comando |
|-----|--------|---------|
| **setuid** (`u+s`) | Corre con UID del owner (peligroso) | `chmod u+s archivo` |
| **setgid** (`g+s`) | Corre con GID del grupo | `chmod g+s archivo` |
| **Sticky** (`+t`) | En directorio: solo owner borra sus archivos | `chmod +t directorio` |

### Capabilities (Linux)
Alternativa granular a setuid: `setcap 'cap_net_bind_service=+ep' ./bin`

## Permisos (Windows - ACL)

- Basado en **ACL** (Access Control Lists) con **SID** (Security Identifier)
- Permisos: `Full Control`, `Modify`, `Read & Execute`, `List Folder`, `Read`, `Write`, `Special Permissions`
- Herencia configurable por carpeta/archivo

## Metadatos Comunes

| Atributo | Linux/macOS | Windows |
|----------|-------------|---------|
| **Tamaño** | `stat` / `ls -l` | Propiedades → Tamaño |
| **Timestamps** | `atime` (acceso), `mtime` (modificación), `ctime` (cambio metadatos), `birthtime` (creación, en algunos FS) | `Created`, `Modified`, `Accessed` |
| **Owner/GID** | `chown`, `chgrp` | Owner (SID), no grupo POSIX |
| **Atributos extendidos** | `xattr` / `getfattr` / `setfattr` | Alternate Data Streams (ADS) |
| **Inode / File ID** | Número de inode único por FS | File Reference Number (NTFS) |
| **Tipo MIME** | `file --mime-type` | Registry / Content-Type |

## Ejecutables: Qué los Hace Correr

| SO | Formato | Cargador | Entrada |
|----|---------|----------|---------|
| Linux | ELF | `ld-linux.so` / kernel | `_start` (glibc → `main`) |
| Windows | PE/COFF | `ntdll.dll` / loader | `EntryPoint` (`mainCRTStartup` → `main`) |
| macOS | Mach-O | `dyld` | `start` → `main` |
| Scripts | Shebang (`#!/usr/bin/env python3`) | Kernel → intérprete | — |

## Atributos de Sistema de Archivos (`chattr` / `FSctl`)

| Flag | Efecto | Comando |
|------|--------|---------|
| `i` (inmutable) | No borrar, renombrar, escribir | `chattr +i archivo` |
| `a` (append-only) | Solo añadir | `chattr +a log.txt` |
| `c` (comprimido) | Compresión transparente (btrfs, ZFS, NTFS) | — |
| `e` (extent) | Usa extents (ext4, xfs) | — |
| `C` (no copy-on-write) | Desactiva CoW (btrfs) | `chattr +C` |

## Herramientas de Inspección

| Qué | Linux/macOS | Windows |
|-----|-------------|---------|
| Permisos | `ls -l`, `stat`, `getfacl` | `icacls`, `Get-Acl` (PS) |
| Metadatos | `stat`, `lsattr`, `file`, `xattr -l` | `dir /q`, `fsutil`, `Get-Item` |
| Tipo MIME | `file -b --mime-type` | `FindMimeFromData` / Registro |
| Capabilities | `getcap`, `setcap` | — |
| Hash/Integridad | `sha256sum`, `b2sum` | `Get-FileHash`, `CertUtil -hashfile` |

## Ver también

- [Glosario técnico](../../00-meta/glosario.md)
- [Archivos, Streams y Serialización](archivos-streams-serializacion.md)
- [Streams: Qué son y Ventajas](streams-ventajas.md)
- [Recuperación de Estado sin Base de Datos](recuperacion-estado-sin-bd.md)
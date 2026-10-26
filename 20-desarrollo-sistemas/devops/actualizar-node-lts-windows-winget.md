---
title: Actualizar Node.js LTS en Windows con winget
area: desarrollo
tags: [desarrollo, devops]
created: 2026-10-25
updated: 2026-10-25
related: ["./_index.md", "./instalar-lazygit-windows.md"]
---

# Actualizar Node.js LTS en Windows con winget

Procedimiento para llevar Node.js a la última versión parcheada de su línea LTS en
Windows, y para **comprobar de verdad** que la actualización quedó aplicada (no basta
con `node -v`). Incluye los fallos de seguridad de octubre de 2026 como caso real:
en este equipo se pasó de `v24.16.0` a `v24.22.1` el 2026-10-25.

## Por qué actualizar dentro de la misma línea LTS

| Línea | Soporte hasta | Cuándo usarla |
|---|---|---|
| 26.x | 2029-04-30 | LTS a partir del 2026-10-28 |
| 24.x | 2028-04-30 | LTS activo; en mantenimiento desde 2026-10-20 |
| 22.x | 2027-04-30 | LTS en mantenimiento, solo por compatibilidad |

Subir de parche dentro de la misma línea (24.16 → 24.22) **no cambia el ABI de
módulos nativos**. En `v24.x` el ABI es `137`; se mantiene mientras no saltes de
línea mayor. Por eso no hay que recompilar dependencias nativas (`better-sqlite3`,
`sharp`, `node-gyp`, etc.) al aplicar un parche: es mantenimiento sin riesgo.

Saltar de línea (24 → 26) sí cambia el ABI (`137` → `147`) y obliga a reconstruir
esos módulos. No lo hagas por un parche de seguridad.

## Procedimiento

### 1. Ver qué hay instalado y qué hay disponible

```powershell
node -v
winget list --id OpenJS.NodeJS.LTS --exact
```

La segunda línea compara instalado contra disponible. Salida del 2026-10-25:

```
Name    Id                Version Available Source
--------------------------------------------------
Node.js OpenJS.NodeJS.LTS 24.16.0 24.22.1   winget
```

Si `Source` dice `msstore` en vez de `winget`, o `Available` sale vacío, **para**:
el comando del paso 2 no aplicaría y hay que ir por el MSI oficial.

### 2. Actualizar (terminal elevada)

Node vive en `C:\Program Files\nodejs`, así que el MSI necesita permisos de
administrador. Abrir **Windows PowerShell como administrador** (la barra de título
debe decir *Administrador*) y ejecutar:

```powershell
winget upgrade --id OpenJS.NodeJS.LTS --exact
```

Usar `--id ... --exact` en lugar de `winget upgrade --all` evita arrastrar otros
paquetes que no querías tocar en ese momento.

Salida esperada: descarga de `node-v24.22.1-x64.msi` (~30 MB), verificación de hash
y `Successfully installed`.

### 3. Interpretar el código de salida

| Salida | Significado | Acción |
|---|---|---|
| `Successfully installed` | Instalado sin reinicio | Continuar |
| `exit code 3010` | Instalado, **requiere reinicio** | Reiniciar; no es un error |
| `exit code 1603` | No pudo reemplazar archivos bloqueados | Cerrar procesos `node.exe` y repetir |
| `hash does not match` | Descarga corrupta o caché de winget | Reintentar con `--force` |

### 4. Verificar la versión efectiva

```powershell
node -v
npm -v
```

Debe coincidir con lo que anunció winget (`v24.22.1` / `11.19.1`). Si `node -v`
sigue mostrando la versión vieja, es caché de `PATH` de esa ventana: cerrarla y
abrir otra. No reinstalar.

### 5. Comprobar que el reemplazo fue real

`node -v` solo prueba que el `node.exe` del disco es el nuevo. Tres comprobaciones
independientes que no engañan:

```powershell
# a) el binario en disco
(Get-Item 'C:\Program Files\nodejs\node.exe').VersionInfo.FileVersion

# b) el registro de desinstalación
Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall' |
  ForEach-Object { $p = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue;
    if ($p.DisplayName -like '*Node.js*') { '{0} | v{1}' -f $p.DisplayName, $p.DisplayVersion } }

# c) no quedó nada aparcado para el arranque
(Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager' `
  -Name PendingFileRenameOperations -ErrorAction SilentlyContinue).PendingFileRenameOperations |
  Where-Object { $_ -match 'nodejs' }
```

Si (c) devuelve líneas con `nodejs`, el instalador **no** pudo soltar los archivos y
los reemplazará en el próximo arranque: la versión del disco es nueva pero la que
corre sigue siendo la vieja hasta reiniciar.

### 6. Verificar las dependencias internas (lo que de verdad parchea)

Los CVEs de dependencias se cierran actualizando `node`, no `npm`. Comprobación:

```powershell
node -e "const v=process.versions; console.log(v.node, v.openssl, v.ares, v.undici, v.modules)"
```

Antes y después en este equipo:

| Componente | 24.16.0 | 24.22.1 |
|---|---|---|
| OpenSSL | 3.5.6 | **3.5.9** |
| c-ares | no medido | 1.34.9 |
| undici | no medido | 7.30.1 |
| ABI (`modules`) | 137 | 137 (sin cambio) |

El valor previo de OpenSSL sale del `index.json` oficial; los de c-ares y undici no
estaban medidos en este equipo antes de actualizar, así que no se afirman.

### 7. Matar el código viejo que quedó en memoria

Este es el paso que casi todo el mundo se salta. En Windows, reemplazar un `.exe`
**no afecta a los procesos que ya lo tenían cargado**: siguen ejecutando el binario
antiguo aunque consultar la versión del archivo en disco devuelva la nueva. Un
`Get-Process node` con fecha de arranque anterior a la instalación es código
vulnerable corriendo.

```powershell
Get-Process node -ErrorAction SilentlyContinue |
  Select-Object Id, StartTime |
  Sort-Object StartTime
```

Comparar `StartTime` con la hora de la instalación (columna `LastWriteTime` de
`node.exe`). Cualquier proceso anterior debe cerrarse: reiniciar el editor/IDE que
lo lanzó, o reiniciar el equipo si no está claro el origen.

En este equipo los `node.exe` residuales eran servidores MCP
(`chrome-devtools-mcp`) hijos de OpenCode, que se reinician solos al reabrir el
editor.

## El caso real: fallo de seguridad de octubre de 2026

El 2026-10-21 el proyecto Node publicó parches para las líneas 26.x, 24.x y 22.x
con **4 vulnerabilidades de severidad alta**. La versión instalada aquí era de
mayo y se había saltado **tres rondas de seguridad** (junio, julio y octubre).

CVEs que afectaban a la línea 24.x, cerrados en `24.22.1`:

| CVE | Severidad | Qué permitía |
|---|---|---|
| CVE-2026-111497 | Alta | Escritura fuera de límites en el decodificador Brotli de `node:zlib` → corrupción de memoria y posible RCE con datos comprimidos malformados |
| CVE-2026-105482 | Alta | `dns.resolve*()` trunca nombres con byte NUL: `attacker.example\0.trusted.example` resuelve el primero sin error, saltándose allowlists de dominio |
| CVE-2026-105483 | Alta | Bypass de verificación TLS con IPs en dígitos fullwidth (`１２７.0.0.1`) |
| CVE-2026-106069 | Alta | Bypass TLS con IPv4 no canónica con cero inicial (`0127.0.0.1`): el cliente valida contra una IP distinta de la conectada |
| CVE-2026-105481 | Media | Socket keep-alive puede entregar una respuesta escrita antes de enviar la petición |
| CVE-2026-106072 | Media | SAN de tipo DNS valida endpoints IP escritos de forma no canónica (`0177.0.0.1`, `2130706433`, `127.1`) |
| CVE-2026-106074 | Media | Cachés de entropía de `crypto.randomUUID()` / `randomInt()` se guardan en snapshots de arranque: procesos repetidos generan valores predecibles |
| CVE-2026-106073 | Baja | El Permission Model no aplica comprobaciones de lectura en `fs.realpathSync()` |

El mismo aviso incluyó dos CVEs de severidad baja que **solo afectan a 26.x**
(`CVE-2026-106070` en `zlib.ZipFile` y `CVE-2026-106071` en el lookup con
comodines del Permission Model), y actualizaciones de dependencias: c-ares,
certificados CA (compromiso de una CA intermedia de eMudhra), OpenSSL (solo 24.x y
22.x), SQLite (solo 22.x) y undici.

## Cuándo repetir esto

- **Cada aviso de seguridad** de nodejs.org (suelen ser trimestrales; el siguiente
  tras octubre está por anunciarse). Suscribirse a `nodejs-sec` o revisar
  [nodejs.org/en/blog/vulnerability](https://nodejs.org/en/blog/vulnerability).
- **Al cambiar de línea mayor**: en ese caso sí revisar el ABI y recompilar
  módulos nativos.
- Regla práctica: si `winget list --id OpenJS.NodeJS.LTS --exact` muestra algo en
  la columna `Available`, hay parche pendiente.

## Certeza

- Versiones, fechas, CVEs y calendario: **verificado** contra `nodejs.org` y
  `github.com/nodejs/Release` el 2026-10-25.
- Estado de este equipo (versiones antes/después, ABI, ausencia de renombrados
  pendientes): **verificado** ejecutando los comandos de arriba.
- Que los procesos anteriores a la instalación siguen con el binario viejo en
  memoria: **inferido** del comportamiento documentado de Windows al reemplazar un
  ejecutable ya mapeado por un proceso; no se inspeccionó el código cargado en
  memoria de cada PID.

## Fuentes

* [Node.js — índice oficial de versiones (dist/index.json)](https://nodejs.org/dist/index.json) — consultado: 2026-10-25
* [Node.js — avisos de vulnerabilidades](https://nodejs.org/en/blog/vulnerability) — consultado: 2026-10-25
* [Node.js — Wednesday, October 21, 2026 Security Releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) — consultado: 2026-10-25
* [Node.js — calendario de releases (schedule.json)](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json) — consultado: 2026-10-25

## Ver también

* [DevOps (MOC)](_index.md)
* [DevOps - qué es y en qué aterriza](devops.md)
* [Instalar lazygit en Windows (Git Bash, sin instalador)](instalar-lazygit-windows.md)

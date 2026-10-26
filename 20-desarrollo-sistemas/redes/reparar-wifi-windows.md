---
title: Reparar la configuración Wi-Fi en Windows
area: desarrollo
tags: [redes, redes/windows, redes/diagnostico]
created: 2026-10-25
updated: 2026-10-25
related: ["./_index.md", "./diagnostico-wifi-conecta-sin-internet.md", "./incidente-juan-p-askey-rtf8225vw.md"]
---

# Reparar la configuración Wi-Fi en Windows

Cuando la configuración de red del adaptador queda rota (DHCP apagado, IP fija
huérfana, radio desactivada por software, perfil corrupto), este script devuelve
todo a un estado limpio: **DHCP automático, adaptador encendido y conectado a la
red conocida**.

Probado y verificado en este equipo el 2026-10-25 (Windows 11 26H2).

## Cuándo usarlo

* El equipo no se conecta a **ninguna** red Wi-Fi.
* El adaptador aparece como "Software Desactivado".
* La configuración IP muestra `DHCP habilitado: No` sin que tú lo hayas cambiado.
* Ejecutaste un comando `netsh` de red y algo se rompió.

## Cuándo NO usarlo

Si la Wi-Fi funciona. Cambiar configuración que está bien solo añade variables.
Para el fallo intermitente de una red concreta, ver
[el incidente de Juan P](incidente-juan-p-askey-rtf8225vw.md).

## El script

Guardar como `reparar-wifi.bat` y **ejecutar como administrador** (clic derecho →
Ejecutar como administrador). La ventana se queda abierta al final mostrando el
resultado; no se cierra sola.

```bat
@echo off
setlocal
chcp 65001 >nul
title Reparar Wi-Fi

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Ejecutar como administrador.
    pause
    exit /b 1
)

echo [1/6] Servicio de WLAN...
sc config WlanSvc start= auto >nul 2>&1
net start WlanSvc >nul 2>&1

echo [2/6] Reactivando autoconfiguracion...
netsh wlan set autoconfig enabled=yes interface="Wi-Fi" >nul 2>&1

echo [3/6] Devolviendo IP a DHCP...
netsh interface ipv4 set address name="Wi-Fi" source=dhcp >nul 2>&1
netsh interface ipv4 set dns name="Wi-Fi" source=dhcp >nul 2>&1
netsh interface ipv4 set interface "Wi-Fi" metric=automatic >nul 2>&1

echo [4/6] Encendiendo el adaptador...
powershell -NoProfile -Command "Enable-NetAdapter -Name 'Wi-Fi' -Confirm:$false" >nul 2>&1
netsh interface set interface name="Wi-Fi" admin=enabled >nul 2>&1

echo [5/6] Esperando...
timeout /t 6 /nobreak >nul

echo [6/6] Conectando...
netsh wlan connect name="SERVINET 901715055 PEDRO" ssid="SERVINET 901715055 PEDRO" interface="Wi-Fi" >nul 2>&1
timeout /t 8 /nobreak >nul

echo.
echo --- Estado ---
netsh wlan show interfaces
echo.
echo --- IP ---
netsh interface ipv4 show config name="Wi-Fi"
echo.
echo --- Internet ---
powershell -NoProfile -Command "$r = & curl.exe -s -m 10 -o NUL -w '%%{http_code}' http://www.msftconnecttest.com/connecttest.txt; Write-Host ('HTTP = ' + $r)"
pause
```

## Cómo saber que funcionó

| Comprobación | Valor esperado |
|---|---|
| `netsh wlan show interfaces` | `Estado: conectado` + un SSID |
| `netsh interface ipv4 show config` | `DHCP habilitado: Sí` + IP `192.168.18.x` |
| Prueba de internet | `HTTP = 200` |

## La trampa que hay que conocer

**`netsh interface ipv4 add address` no añade una IP secundaria: reemplaza la
configuración y desactiva el DHCP.**

```powershell
# ESTO ROMPE LA RED si DHCP está activo:
netsh interface ipv4 add address name="Wi-Fi" address=192.168.1.50 mask=255.255.255.0
# Resultado: DHCP habilitado: No, IP fija, sin gateway, sin internet.
```

En Windows 11 la ventana de *Propiedades de TCP/IPv4 → Opciones avanzadas* tiene el
botón **Agregar… deshabilitado** mientras DHCP esté activo. No es un fallo: Windows
no permite una dirección secundaria en modo automático.

Para alcanzar un equipo en otra subred mientras se mantiene la red principal, la
vía segura es **crear una IP secundaria desde la interfaz gráfica con DHCP activo
en otra interfaz**, o hacerlo con PowerShell sobre una interfaz virtual. **No** con
`netsh add address` sobre la interfaz activa.

Si ya se rompió, el script de arriba lo deshace: `source=dhcp` elimina la IP fija.

## Errores comunes

* **Ejecutar sin administrador.** Falla en silencio en varios pasos.
* **Guardar en el escritorio equivocado.** Si OneDrive gestiona el escritorio real
  está en `C:\Users\<usuario>\OneDrive\Desktop`, no en `C:\Users\<usuario>\Desktop`.
  Comprobar con:

  ```powershell
  [Environment]::GetFolderPath('Desktop')
  ```

* **Confundir "conectado" con "con internet".** El script comprueba el HTTP 200,
  no solo el estado del adaptador.
* **Reiniciar el router equivocado.** Ver el incidente de Juan P.

## Ver también

* [Wi-Fi conecta pero no hay internet - diagnóstico por capas](diagnostico-wifi-conecta-sin-internet.md)
* [Incidente Juan P - Askey RTF8225VW](incidente-juan-p-askey-rtf8225vw.md)
* [Índice de redes](./_index.md)

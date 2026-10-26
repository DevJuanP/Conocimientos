---
title: Wi-Fi conecta pero no hay internet - diagnóstico por capas
area: desarrollo
tags: [redes, redes/diagnostico, redes/windows]
created: 2026-10-25
updated: 2026-10-25
related: ["./_index.md", "./incidente-juan-p-askey-rtf8225vw.md", "./reparar-wifi-windows.md"]
---

# Wi-Fi conecta pero no hay internet - diagnóstico por capas

Cuando el equipo dice "conectado" pero no navega, el error habitual es empezar
reiniciando cosas al azar. Este es el orden correcto: **aislar la capa** en la que
se rompe antes de tocar nada. Con cinco comandos se sabe si el fallo está en la radio,
en la entrega de IP, en el DNS o en el enrutamiento.

Método aplicado y verificado en este equipo el 2026-10-25 (Windows 11 26H2, Intel AC 7265).

## Las cinco capas

| # | Capa | Qué pregunta responde | Comando |
|---|---|---|---|
| 1 | Radio | ¿Estoy asociado al AP? | `netsh wlan show interfaces` |
| 2 | Enlace / IP | ¿Tengo dirección y puerta de enlace? | `ipconfig /all` |
| 3 | L2 unicast | ¿El gateway me contesta? | `ping <gateway>` |
| 4 | DNS | ¿Se resuelven nombres? | `nslookup www.google.com` |
| 5 | Salida | ¿Llego a internet sin DNS? | `ping 8.8.8.8` |

Se bajan en orden. El primer escalón que falla es el que importa: todo lo de arriba
queda descartado y no hay que investigarlo.

## Interpretación de resultados

### Si falla la capa 1 (no asocia)

Descarta el resto. Causas típicas: contraseña cambiada, banda no soportada,
perfil corrupto, radio apagada por software.

```powershell
netsh wlan show interfaces      # busca "Estado de radio"
netsh wlan show profiles        # ¿existe el perfil?
```

Si dice `Estado de radio: Software Desactivado`, no es un problema de red: algo
apagó el adaptador (modo avión, tecla Fn, o `netsh wlan set autoconfig enabled=no`).

### Si falla la capa 2 (sin IP válida)

| Síntoma | Significado |
|---|---|
| IP `169.254.x.x` | DHCP no respondió. El AP no reparte o el servidor está caído |
| IP correcta pero gateway vacío | El DHCP dio dirección sin puerta de enlace |
| IP de otra subred | Estás en un segmento distinto al que crees |

### Si falla la capa 3 y el resto también (el caso interesante)

Este es el patrón que más desconcierta: **el ARP resuelve pero el ping no responde**.
Significa que el tráfico broadcast atraviesa la red pero el unicast no vuelve.

```powershell
arp -a | findstr <gateway>          # ¿hay MAC asignada a la IP del gateway?
Get-NetNeighbor -IPAddress 192.168.18.1   # ver State: Reachable / Probe / Stale
```

| Estado del vecino | Lectura |
|---|---|
| `Reachable` y ping OK | Todo bien en L2 |
| `Probe` | Se pregunta "¿quién tiene esta IP?" y **nadie contesta** |
| `Reachable` y ping falla | La MAC cacheada no responde: entrada obsoleta o puente mal direccionando |
| `Stale` | Entrada vieja que aún no se ha revalidado |

**Regla práctica:** si el ARP resuelve pero el ping al gateway falla al 100%, el
problema no está en tu tarjeta. Está en el camino de vuelta.

### Separar radio de enrutamiento con IPv6

Truco muy útil cuando sospechas del adaptador: hacer ping a la dirección
**link-local IPv6 del propio punto de acceso**. Si responde, la radio y el driver
están perfectos y el fallo es solo de IPv4.

```powershell
# La MAC del AP convertida a link-local: f4:52:46:55:20:30 -> fe80::f652:46ff:fe55:2030
ping -6 fe80::f652:46ff:fe55:2030%12
```

La conversión es mecánica: se invierte el bit U/L del primer octeto (`f4` → `f6`)
y se insertan `ff:fe` en medio de la MAC.

```text
MAC  f4:52:46 : 55:20:30
     └─ f4 XOR 02 = f6
IPv6 fe80::f652:46ff:fe55:2030
```

### Si solo falla la capa 4 (DNS)

```powershell
nslookup www.google.com              # con el DNS del router
nslookup www.google.com 8.8.8.8      # con DNS externo
ipconfig /displaydns                 # ¿hay caché envenenada?
Get-DnsClientNrptPolicy              # reglas de directiva que redirigen DNS
```

Si con `8.8.8.8` funciona y con el router no, el DNS del router está roto.
Si ninguno funciona pero el ping a `8.8.8.8` sí, es DNS puro.

## Cómo distinguir "no hay internet" de "no hay red"

```powershell
Test-NetConnection 8.8.8.8 -Port 443
```

Si el ping a `8.8.8.8` va pero este comando falla, hay salida ICMP pero no TCP:
típico de un portal cautivo, un firewall o un NAT roto.

## Prueba de aislamiento: DHCP real

`ipconfig /renew` **reutiliza la concesión cacheada** y no demuestra nada.
Para forzar un ciclo DHCP completo:

```powershell
ipconfig /release "Wi-Fi"
ipconfig /renew "Wi-Fi"
```

Si el `release` deja la interfaz sin IP y el `renew` la recupera en segundos, hay
un servidor DHCP vivo y respondiendo. Ese dato descarta media lista de sospechosos.

## Errores comunes al diagnosticar

* **Reiniciar antes de medir.** Se borra la evidencia (caché ARP, tabla del puente,
  logs) y el fallo desaparece sin saber por qué. Medir primero, reiniciar después.
* **Confundir `ipconfig /renew` con un DHCP limpio.** Reutiliza la concesión.
* **Culpar al DNS sin probar una IP directa.** Sin `ping 8.8.8.8` no se sabe nada.
* **Asumir que la MAC del gateway es la del equipo que tienes delante.** En redes
  con puentes o routers en cascada puede ser otro equipo distinto.
* **Ignorar IPv6 como herramienta de descarte.** Es el test más limpio para separar
  "fallo de radio" de "fallo de enrutamiento".
* **Tocar la configuración mientras funciona.** Cambiar algo que va bien para
  "prevenir" suele romperlo (ver [reparar-wifi-windows](reparar-wifi-windows.md)).

## Ver también

* [Incidente Juan P - Askey RTF8225VW](incidente-juan-p-askey-rtf8225vw.md)
* [Reparar la configuración Wi-Fi en Windows](reparar-wifi-windows.md)
* [Índice de redes](./_index.md)

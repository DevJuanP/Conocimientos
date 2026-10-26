---
title: Incidente Juan P - conecta sin internet (Askey RTF8225VW)
area: desarrollo
tags: [redes, redes/diagnostico, redes/windows]
created: 2026-10-25
updated: 2026-10-25
related: ["./_index.md", "./diagnostico-wifi-conecta-sin-internet.md", "./reparar-wifi-windows.md"]
---

# Incidente Juan P - conecta sin internet (Askey RTF8225VW)

Registro del fallo intermitente de la red **Juan P** en el PC de trabajo: el equipo
se asocia al Wi-Fi y recibe IP, pero no pasa tráfico IPv4 hacia la puerta de enlace.
Afecta **solo a este PC**; el móvil navega sin problema en la misma red.

Ocurrió por primera vez el **2026-10-24 ~17:29** y se reprodujo el **2026-10-25**.
Al cierre de esta nota el problema está **mitigado, no resuelto**.

> **TL;DR para el futuro:** si Juan P conecta pero no navega → **reinicia el router
> Askey** (desenchufar 30 s, volver a enchufar, esperar 2 min). Vuelve a funcionar
> de inmediato. Que no cunda el pánico: la red de SERVINET sigue viva.

## Topología real

```text
Fibra
  │
  ▼
Huawei EG8145V5  (SERVINET, el que instaló el proveedor)
  192.168.18.1 · MAC e8:f6:54:e7:d3:84 · servidor DHCP · emite "SERVINET 901715055 PEDRO"
  │
  └── LAN2 ──(UTP, puerto 2)──► LAN2
                                 │
                                 ▼
                        Askey RTF8225VW  (Movistar)
                        MAC f4:52:46:55:20:30 · SIN IP en 192.168.18.0/24
                        emite "Juan P" (2.4 GHz y 5 GHz)
```

Datos verificados en el equipo el 2026-10-25:

| Elemento | Valor |
|---|---|
| SSID afectado | `Juan P` |
| BSSID 5 GHz | `f4:52:46:55:20:3e` (canal 52 tras el reinicio; antes 100) |
| BSSID 2.4 GHz | `f4:52:46:55:20:3f` |
| Link-local IPv6 del Askey | `fe80::f652:46ff:fe55:2030` |
| Gateway IPv4 en ambas redes | `192.168.18.1` → MAC `e8:f6:54:e7:d3:84` (el **Huawei**) |
| IP del PC | `192.168.18.10/24`, DHCP, DNS `192.168.18.1` |
| Enlace al asociar | 802.11ac, 5 GHz, 866 Mbps, RSSI −44, 95% señal |

**Ojo con la etiqueta del Askey:** dice `http://192.168.1.1`. Esa IP **no es
alcanzable** desde la red `192.168.18.x` porque el equipo funciona como puente y
no tiene dirección en ese segmento. El panel que aparece en `192.168.18.1` es el
del **Huawei**, no el del Askey.

## Síntoma medido

Mismo AP, misma sesión, mismo instante:

| Prueba | Resultado |
|---|---|
| Asociación Wi-Fi | ✅ 802.11ac, 866 Mbps, RSSI −44 |
| DHCP (`release` + `renew`) | ✅ IP en 3 s |
| ARP de `192.168.18.1` | ✅ resuelve a `e8:f6:54:e7:d3:84` |
| `ping 192.168.18.1` | ❌ 100% pérdida |
| `ping 8.8.8.8` / `1.1.1.1` | ❌ 100% pérdida |
| `http://192.168.18.1` | ❌ código `000` |
| `tracert` | ❌ todos los saltos `*` |
| **`ping -6 fe80::f652:46ff:fe55:2030%12`** | ✅ **4/4, 1 ms** |
| Contadores del adaptador | **102 enviados / 0 recibidos** |

La última fila es la clave del diagnóstico: el enlace de radio funciona en ambos
sentidos, pero **el unicast IPv4 no vuelve**.

Otro dato del mismo día: en una conexión posterior, sin cambiar nada, el mismo AP
respondió **6/6 pings a 1 ms**. El fallo es **intermitente**, no permanente.

## Diagnóstico

**Estado:** `Inferido`. La causa raíz no se pudo confirmar porque no se accedió al
panel del Askey.

Interpretación que encaja con todas las mediciones: la **tabla de reenvío del
puente** del Askey se queda con una entrada obsoleta. El tráfico *broadcast*
(DHCP, ARP) se inunda a todos los puertos y por eso siempre funciona; el *unicast*
se dirige a un puerto equivocado y se descarta. Reiniciar o cambiar el puerto de
red **borra esa tabla** y la obliga a reaprender, lo que explica que el parche
funcione siempre.

Hipótesis secundaria, no descartada: bug de firmware del RTF8225VW al convivir con
dos routers en la misma subred (`192.168.18.0/24`), donde el puente no tiene IP
propia pero sí reenvía tráfico hacia un gateway que pertenece a otro equipo.

### Hipótesis ya descartadas (no las vuelvas a investigar)

| Hipótesis | Cómo se descartó |
|---|---|
| Tarjeta de red / driver averiado | IPv6 al AP responde 4/4 a 1 ms |
| Señal débil | 95%, RSSI −44 |
| Canal DFS inestable | Falló y funcionó en el mismo canal 100 |
| Ahorro de energía del adaptador | Se desactivó y el fallo continuó |
| Caché ARP envenenada | Se borró con admin y el ping siguió fallando |
| DNS roto | No llega ni el ping por IP |
| DHCP caído | `release` + `renew` entrega IP en 3 s |
| Proveedor de internet | El móvil navega en la misma red |
| Router Huawei de SERVINET | Sigue dando servicio; su panel responde |
| MAC aleatoria | Deshabilitada en el perfil |
| Aislamiento de clientes | Sin evidencia; el móvil y el PC conviven |

## Procedimiento de rescate

Cuando vuelva a fallar. **Ordenado de menos a más invasivo.**

### 1. Comprobar que es esto y no otra cosa (30 s)

```powershell
netsh wlan show interfaces
ping 192.168.18.1
```

Si el SSID es `Juan P` y el ping da 100% de pérdida → es este fallo.

### 2. Reiniciar el Askey (el arreglo que funciona)

1. Desenchufar **el Askey** de la corriente.
2. Esperar **30 segundos** de verdad.
3. Volver a enchufar y esperar **2 minutos**.
4. Reconectar a `Juan P` desde el PC.

> **Reinicia el Askey, NO el Huawei.** El Huawei es el que da internet a toda la
> casa. Reiniciarlo corta la red a todos sin necesidad.

### 3. Si el reinicio no basta

Mover el cable UTP del Askey a **otro puerto LAN** (por ejemplo del 2 al 1 o al 3).
También limpia la tabla de reenvío. Es lo que funcionó el 2026-10-24.

### 4. Si sigue fallando

Tirar de la Wi-Fi del **Huawei** (`SERVINET 901715055 PEDRO`) mientras se investiga.
Es 2.4 GHz y unos 72 Mbps, mucho más lenta que Juan P, pero estable.

## Lo que NO se llegó a hacer

El arreglo de fondo requiere entrar al panel del **Askey** en `192.168.1.1`, cosa
que no se intentó por miedo a quedarse sin internet durante una clase. Lo que
habría que revisar allí, si algún día se hace:

1. Que esté en **modo puente / AP** y no en modo router con su propio DHCP activo.
2. Que el **aislamiento de clientes** (*AP isolation*) esté desactivado.
3. Que no haya **band steering** agresivo entre 2.4 y 5 GHz.
4. Actualizar el **firmware** del RTF8225VW.

Alternativa sin tocar el panel: dejar el Askey solo como AP y que el Huawei emita
la red que usa el PC. Se descartó por perder velocidad (866 → 72 Mbps).

## Lección de configuración

`netsh interface ipv4 add address` **no añade** una IP secundaria cuando DHCP está
activo: **reemplaza la configuración por una IP fija y apaga el DHCP**. Deja el
equipo sin red. Ver [reparar-wifi-windows](reparar-wifi-windows.md).

## Ver también

* [Wi-Fi conecta pero no hay internet - diagnóstico por capas](diagnostico-wifi-conecta-sin-internet.md)
* [Reparar la configuración Wi-Fi en Windows](reparar-wifi-windows.md)
* [Índice de redes](./_index.md)

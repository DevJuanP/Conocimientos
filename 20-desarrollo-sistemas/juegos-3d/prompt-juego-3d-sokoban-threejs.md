---
title: Prompt de desarrollo - Puzzle 3D de empujar bloques (Three.js)
area: desarrollo
tags: [desarrollo, programacion/javascript, arquitectura]
created: 2026-09-30
updated: 2026-09-30
related: ["../_index.md"]
---

# Prompt de desarrollo - Puzzle 3D de empujar bloques (Three.js)

Prompt cerrado y listo para copiar y pegar en un agente de IA. Especifica un juego 3D
de puzles en tercera persona sobre rejilla, hecho en Three.js sin build step, con
10 salas verificadas automáticamente como resolubles.

El documento está construido sobre **tablas de verdad única**: cada dimensión del
juego (teclas, tiempos, tiles, estados, reglas) está definida exactamente una vez, en
una tabla. Si dos reglas entran en conflicto, la tabla es la fuente de verdad.

## Cómo usar este prompt

1. Copia todo el bloque delimitado por `--- INICIO DEL PROMPT ---` y
   `--- FIN DEL PROMPT ---`.
2. Pégalo en el agente sin ninguna instrucción adicional.
3. El agente debe poder responder a "sin instalar nada, sin red más allá del CDN, ¿cómo
   lo ejecuto?".

Todo lo que está **fuera** del bloque es documentación de por qué está dentro del
bloque. El agente nunca lee la documentación, solo el prompt.

--- INICIO DEL PROMPT ---

# PROMPT - Puzzle 3D de empujar bloques

## 0. Regla de prioridad

Este documento es la especificación. Si tu criterio de diseño o de código contradice
algo de aquí, **gana este documento**.

Si crees que dos secciones de este documento se contradicen, o que una regla hace
imposible una mecánica pedida: **no improvises**. Deja el trabajo en el punto exacto
donde detectaste el problema y pregunta. No lo resuelvas por tu cuenta.

Si una tarea de la sección 18 es ambigua, implementa la interpretación más restrictiva
(la que añade menos código) y anótala en `NOTES.md`.

## 1. Qué construir

Un juego 3D de puzles en tercera persona. El jugador empuja bloques de una rejilla
para colocarlos sobre ranuras. Hay 10 salas más un hub. La mitad de las salas son
puzles de empuje puro; la otra mitad son corredores de huida con un perseguidor. No
hay combate, no hay historia escrita, no más de un enemigo en pantalla.

Se ejecuta en un navegador moderno, desde un servidor estático, sin build, sin
instalar dependencias de JavaScript. De las 10 salas, 6 son puzles de empuje puro y 4
son corredores de huida. No hay ninguna sala mixta, y esa es la decisión de diseño más
importante del proyecto: está en la sección 10 y en el apéndice.

## 2. Pilares de diseño

Si una decisión de implementación no se deriva de uno de estos cuatro pilares,
replántatela.

1. **Determinismo absoluto.** El estado del juego es un conjunto discreto de celdas.
   No hay física continua, no hay flotantes en la lógica. Cualquier sala debe poder
   verificarse reproduciendo una secuencia de pulsaciones. Si añades un valor
   continuo a la lógica, rompes este pilar.
2. **Ninguna decisión de diseño depende de un ajuste manual.** Nada de timings
   "hasta que se sienta bien". Cada duración de juego está en la tabla 3. Si algo se
   siente mal, se cambia un número de esa tabla, no el código.
3. **Cero contenido de relleno.** Ningún sistema existe sin usarse. Si un sistema no
   tiene al menos un contenido en las 10 salas, se elimina. Nada de guardado de
   partida a medias, nada de árbol de habilidades, nada de desbloqueables.
4. **Un solo lector.** Quien lea el prompt debe poder reconstruir el juego entero
   desde las tablas, sin leer código.

## 3. Tabla de tiempos y magnitudes

Única fuente de verdad. Ningún número de esta tabla se repite en el código: todos se
leen de un objeto `T` exportado por `src/core/constants.js`.

| Constante | Valor | Unidad | Significado |
|---|---|---|---|
| `CELL` | 2.0 | unidades mundo | lado de una celda de la rejilla |
| `STEP_DURATION` | 0.16 | s | duración de un paso lateral o de un empujón |
| `STEP_UP_DURATION` | 0.22 | s | duración de un escalón automático |
| `JUMP_DURATION` | 0.22 | s | duración de un salto vertical de 1 capa |
| `FALL_DURATION` | 0.12 | s por capa | duración de cada capa de caída |
| `EXIT_OPEN_DURATION` | 0.50 | s | animación de la salida al resolverse la sala |
| `EXIT_TRANSITION_DURATION` | 0.60 | s | fundido de salida de sala |
| `DEATH_FADE_OUT` | 0.40 | s | fundido a negro al morir |
| `DEATH_FADE_IN` | 0.60 | s | fundido desde negro al reaparecer |
| `STALKER_CELL_DURATION` | 0.30 | s por celda | velocidad del perseguidor en persecución |
| `STALKER_LUNGE_CELL_DURATION` | 0.18 | s por celda | velocidad del perseguidor en embestida |
| `LUNGE_RANGE` | 2 | celdas (Manhattan) | distancia a la que el perseguidor embiste |
| `CATCH_DISTANCE` | 0.6 | celdas (Manhattan) | distancia a la que el perseguidor atrapa |
| `STALKER_DORMANT_DELAY` | 0.80 | s | pausa del perseguidor al despertar |
| `CAMERA_DISTANCE` | 11.0 | u | distancia cámara-jugador |
| `CAMERA_HEIGHT_OFFSET` | 3.6 | u | altura de la cámara sobre la celda del jugador |
| `CAMERA_PITCH_DEFAULT` | 26 | grados | inclinación inicial |
| `CAMERA_PITCH_MIN` | -15 | grados | límite de mirar hacia abajo |
| `CAMERA_PITCH_MAX` | 68 | grados | límite de mirar hacia arriba |
| `CAMERA_SMOOTHING` | 12.0 | 1/s | suavizado exponencial de posición |
| `CAMERA_MIN_HEIGHT_FACTOR` | 0.40 | 0-1 | fracción de `CAMERA_HEIGHT_OFFSET` que la cámara no puede bajar |
| `MOUSE_SENSITIVITY` | 0.0022 | rad/píxel | velocidad de giro de cámara |
| `PLAYER_TURN_DURATION` | 0.10 | s | giro del modelo hacia la dirección de marcha |
| `OCCLUSION_FADE_OPACITY` | 0.22 | 0-1 | opacidad de la geometría que tapa al jugador |
| `LOGIC_TICK` | 1/60 | s | paso fijo de la lógica |
| `INPUT_BUFFER_WINDOW` | 0.15 | s | ventana para encolar una entrada |
| `DIRECTION_HYSTERESIS` | 0.12 | 0-1 | histéresis al elegir eje de movimiento |
| `MAX_PUZZLE_STATES` | 400000 | estados | tope de búsqueda del verificador |

## 4. Tabla de tiles

Única fuente de verdad. Todas las capas de una sala tienen el mismo ancho `W` y el
mismo alto `H`, sin excepción. La numeración de capas no se salta: si hay tres, son
`L0`, `L1` y `L2`, en ese orden.

**Atajo para L0.** Escribir `H` filas idénticas de suelo es ruido, y una fila de menos
es un bug silencioso. Así que una capa se puede escribir de dos formas:

- como **array** de `H` strings, que es la forma normal y la que usará L1 y las
  capas de encima;
- como **string suelto**, que es un atajo que significa "repite esta fila `H` veces",
  donde `H` es el alto de la sala. El validador lo expande antes de mirar nada.

O sea, `['#######']` quiere decir "cinco filas de siete suelos", y es exactamente
lo mismo que escribir las cinco. Si te equivocas y dejas L0 con menos filas de las
que tiene L1, hay celdas de L1 sin nada debajo: el jugador cae al aparecer y la
comprobación 1 lo detecta.

| Símbolo | Significado | ¿Bloquea al jugador? | ¿Bloquea a la caja? | ¿Es suelo para quien está en la celda de encima? | ¿Aparece en? |
|---|---|---|---|---|---|
| `#` | Bloque sólido | sí | sí | sí | todas las capas |
| `.` | Vacío | no | no | no | todas las capas |
| `C` | Caja empujable | sí | sí (ocupa su celda) | sí | solo L1 |
| `G` | Ranura objetivo | no | no | no | solo L1 |
| `X` | Ranura de paso | sí | **no** | no | solo L1 |
| `E` | Salida de la sala | en salas `puzzle`, sí mientras `solved === false`; en salas `chase` y en el hub, nunca | sí | sí | solo L1 |
| `P` | Punto de aparición del jugador | no | no | no | solo L1 |

La fila `X` es la única asimétrica, y es deliberada: es un hueco del tamaño exacto de
una caja, a ras de suelo. La caja cabe y se apoya; el jugador no cabe. Si tratas `X`
como sólido, ninguna caja podrá entrar nunca en él y las salas 9 y 10 serán imposibles
de resolver.

Sobre la columna de suelo, para que no se lea raro: `X` y `G` no son suelo, porque no
son sólidos y el apoyo se define solo con `isSolid`. Lo que ocurre es que quien está
encima se apoya en la celda de **debajo**, que es L0. Y las cajas nunca se caen,
porque la única regla de caída del juego es la del jugador.

**Invariantes de capa (validados por `tools/check-levels.mjs`):**

- **L0 es la capa de apoyo**, no la capa de juego. Solo admite `#` y `.`. Un `#` en
  L0 es suelo firme; un `.` en L0 es un **pozo**, y quien esté encima cae y muere.
- **L1 es la capa de juego**, la única por la que anda el jugador. Admite todos los
  símbolos.
- **L2 y superiores solo admiten `#` y `.`**, y existen para poder subir escalones y
  para pasar por encima del perseguidor.
- **El jugador nunca está en L0.** Su capa mínima es L1, porque L0 es lo que lo
  sostiene. Si `layers` no tiene L1, la sala es inválida.
- `P`, `E`, `C`, `G` y `X` viven **solo en L1**. Un puzle con cajas es 100 % plano
  en vertical: la altura la aportan los bloques `#`, no los objetos.
- **El número de `C` es igual a la suma de `G` más `X`**, y los tres son 0 en las
  salas de huida.
- Todas las capas tienen exactamente `W` de ancho y `H` de alto.
- Existe exactamente un `P` por sala, y está en L1.

## 5. Sistema de rejilla

Coordenadas: `x` = columna (crece a la derecha), `z` = fila dentro de la capa (crece
hacia el sur), `y` = capa (crece hacia arriba). `L0` es `y = 0`.

Centro de una celda: `worldX = x * CELL` y `worldZ = z * CELL`. La vertical tiene
desfase, porque L0 es la capa de apoyo: la cara superior de un bloque de L0 está en
`worldY = CELL / 2`, y los pies de un personaje en la capa `y` están en

    feetY(y) = CELL / 2 + (y - 1) * CELL

Un personaje en L1 apoya los pies en `CELL / 2`, sobre el suelo firme. Uno en L2 los
apoya en `CELL / 2 + CELL`, encima de un bloque de L1.

Un personaje en la capa `y` está **sostenido** si y solo si `isSolid(x, y - 1, z)`.
Esa es la única definición de "apoyado" en todo el juego, y la usan el salto, la
caída y el escalón automático. No definas "apoyado" en ningún otro sitio.

`Grid` es una clase sin dependencias de render ni de Three.js. Superficie pública:

```
constructor(data)                     // data = { width, height, layers: string[][] }
isSolid(x, y, z)   -> boolean        // '#', o caja, o salida cerrada
isPlayerBlocked(x, y, z) -> boolean  // '#', caja, 'X', o salida cerrada
isCratePassable(x, y, z) -> boolean  // no '#', no otra caja
isSupported(x, y, z) -> boolean      // y >= 1 y isSolid(x, y - 1, z)
hasCrateAt(x, z)  -> boolean
crateIdAt(x, z)   -> int | null
hasGoalAt(x, z)   -> boolean
hasSlotAt(x, z)   -> boolean
isExitAt(x, z)    -> boolean
inBounds(x, y, z) -> boolean
```

Reglas de `isSolid`: un `#` es sólido; un `C` es sólido; `G`, `.`, `P` y `X` no son
sólidos. Ojo con `X`: no es sólida para nadie, solo aparece en `isPlayerBlocked`.

Reglas de `isPlayerBlocked`: `#`, `C`, `X`, y `E` **solo si la sala es de tipo
`puzzle` y no está resuelta**. Una `E` en una sala `chase` y una `E` en el hub nunca
bloquean. Esto no es un detalle: si una `E` dependiera de `solved` y las salas de
huida nunca se resuelven, sus salidas serían muros y las cuatro salas de huida serían
injugables.

Para que no dependa de que alguien recuerde el tipo, `Grid` recibe un booleano
`exitLocked` al construirse: `exitLocked = (type === 'puzzle') && !solved`. Y
`solved` lo recalcula `room.js` cada vez que se mueve una caja. Las salas `chase` se
construyen con `exitLocked = false` desde el principio y no lo cambian nunca.

## 6. Movimiento: tres reglas y ninguna más

Este es el núcleo del juego. Si añades una cuarta regla de movimiento, has roto el
diseño.

### 6.1 Entrada de dirección

Solo hay 4 direcciones cardinales: `north` (-z), `south` (+z), `west` (-x), `east` (+x).
**No hay movimiento diagonal en ningún caso.** Ni para el jugador, ni para las cajas.

La dirección se elige a partir de la cámara, para que el jugador empuje hacia donde
mira. En cada frame se **aplana** el vector de avance de la cámara al plano XZ
—descartando su componente vertical, que si no penalizaría a la cámara mirando desde
arriba— y se proyecta sobre los 4 ejes mundo. Se elige el de mayor valor absoluto.

Para que el cambio de eje no parpadee al cruzar una diagonal, la dirección actual solo
se abandona cuando el valor del eje candidato supera al actual en
`DIRECTION_HYSTERESIS`. En empate exacto gana el orden de prioridad
`east > south > west > north`.

### 6.2 Resolución de un paso

Cuando hay una entrada de dirección pendiente, en el siguiente tick de lógica se
evalúa **una** acción. El objetivo es `target = actual + dirección`. En este orden
exacto, y parando en el primer caso que aplique:

1. **Fuera de límites** → acción descartada.
2. **`target` contiene una caja** y el jugador está en L1 → se evalúa el empujón con
   las reglas de la sección 7. Si el empujón es válido, caja y jugador se mueven; si
   no, la acción se descarta entera, sin movimiento parcial de nadie.
3. **`target` es un `#`** y `(target.x, y+1, target.z)` no es sólida, y
   `y + 1 < layers.length` → **escalón automático**: el jugador pasa a esa celda.
   Duración `STEP_UP_DURATION`. El escalón nunca deja al jugador sin apoyo, porque la
   celda que lo sostiene es el propio `target`, que es sólido.
4. **`target` es un `#`** y no se puede escalar → acción descartada. Un `#` con otro
   `#` encima, o con la sala acabada en esa capa, es un muro. **Sin esta regla el
   jugador atravesaría la geometría**, porque el caso 5 la dejaría pasar.
5. **En cualquier otro caso** → el jugador pasa a `target` en la misma capa. Duración
   `STEP_DURATION`.

El orden importa y no es arbitrario. El caso 2 va **antes** que el 3 porque una caja es
sólida, y si el escalón se evaluara primero, el jugador se subiría encima de la caja en
lugar de empujarla en cualquier sala con una capa libre encima. Y el caso 4 existe
porque sin él, un muro con techo se colaría por el caso 5.

Durante una acción en curso no se aceptan más entradas, salvo una, que queda
encolada: es el **buffer de entrada** (`INPUT_BUFFER_WINDOW`).

### 6.3 Caída

Inmediatamente después de resolver un movimiento y **después de terminar su
interpolación**, se comprueba la celda inferior `(x, y-1, z)`:

- Si es sólida, el jugador está apoyado. Fin.
- Si no es sólida, el jugador cae una capa, con `FALL_DURATION` por capa, y se repite
  la comprobación.
- Si la celda de apoyo caería en L0 o por debajo, **el jugador muere por caída**.

**Mientras el jugador cae no se acepta ninguna entrada.** No hay control aéreo.

### 6.4 Salto

`Espacio`: sube **una** capa en el sitio, sin desplazamiento horizontal, con
`JUMP_DURATION`. Se ejecuta **solo si la celda de destino cumple las tres condiciones
a la vez**; si falla cualquiera, la acción se descarta entera:

1. El jugador está apoyado.
2. `y + 1 < layers.length`.
3. `isSupported(x, y + 1, z)` es cierto.

La condición 3 es la que hace que este modelo no tenga agujeros, y no es opcional: sin
ella, saltar a una celda sin apoyo dejaría al jugador flotando, porque la regla de
caída lo devolvería abajo en el mismo instante y el salto no serviría para nada. Como
el salto solo se resuelve hacia celdas ya apoyadas, **en este juego nunca existe un
estado en el aire**, y por eso la regla de caída se puede aplicar sin excepciones
después de cada acción.

Consecuencia directa, y hay que aceptarla: **no se pueden subir dos alturas de una
vez.** Subir dos alturas exige una escalera, con un bloque en L1 y otro encima en L2,
y saltar desde lo alto del primero. Es el ritmo correcto para un sokoban, y hace que
la altura se lea en el nivel y no en la precisión de la pulsación.

El salto sirve para dos cosas, y solo para estas dos:

- Subir el segundo peldaño de una escalera de bloques.
- Mantenerse por encima del perseguidor, que solo recorre L1.

**Cruzar huecos no requiere salto.** Para pasar por encima de un bloque basta subir a
la capa de encima mediante escalón automático y caminar. Un pozo se cruza por arriba o
se cae dentro: no hay salto horizontal en este juego, y por eso el perseguidor solo
necesita recorrer una sola capa.

## 7. Reglas de empujón

Se aplican solo si el jugador está en L1 y la celda objetivo contiene una caja.
`ahead = target + dirección`.

El empujón es **válido** si y solo si se cumplen estas cuatro condiciones a la vez:

1. `ahead` está dentro de los límites de la sala.
2. `isCratePassable(ahead)` es cierto. Bloquean un `#` y la salida cerrada.
   **Un `X` no bloquea a la caja**: ese es su único propósito, y por eso tiene su
   propia consulta en lugar de colarse en `isSolid`.
3. `ahead` no contiene otra caja.
4. **La caja de destino tiene suelo**: `(ahead.x, 0, ahead.z)` es `#` en L0. Las
   cajas no tienen regla de caída, así que una caja empujada sobre un pozo se quedaría
   flotando para siempre y bloquearía la sala. No permitas que ocurra: un empujón
   hacia un pozo es un empujón inválido.
5. El empujón no deja al jugador sin suelo. Como las cajas viven en L1 y el jugador
   también, esto se cumple solo, pero ponlo igualmente: si alguien añade una caja en
   L2 en el futuro, esta comprobación es la que lo salva.

Si es válido: la caja pasa a `ahead` y el jugador pasa a `target`, ambos con
`STEP_DURATION`.

Si no es válido, **la acción se descarta por completo**. El jugador no se mueve. Esto
es deliberado: permite empujar contra una pared sin quedarse pegado a ella, que es
lo que hace jugable un sokoban.

Una caja **sí puede** empujarse fuera de una ranura `G` o `X` si ya está encima. El
jugador puede tener que hacerlo. No lo impongas.

El jugador **nunca** puede tirar de una caja. No hay acción de tirar bajo ningún
nombre, ni siquiera provisional.

## 8. Modelo de estado de una sala

`RoomState` es la única fuente de verdad de una sala en curso. Es una máquina
distinta de la de pantallas de la sección 16, y cada una se nombra en su propia tabla:
no las mezcles.

```
'loading' | 'playing' | 'paused' | 'solved' | 'exiting' | 'dead'
```

| Estado | Qué significa | Qué se acepta |
|---|---|---|
| `loading` | Se construye la geometría | nada |
| `playing` | Se resuelven entradas del jugador | dirección, salto, deshacer, pausa, reiniciar |
| `paused` | Menú de pausa abierto | reanudar, reiniciar sala, salir al hub |
| `solved` | Todas las cajas están sobre sus ranuras | dirección, salto, deshacer, pausa; la salida ya se puede pisar |
| `exiting` | El jugador entró en la salida, fundido en curso | nada |
| `dead` | Atrapado por el perseguidor o caído a un pozo | nada; se reinicia la sala |

`R` (reiniciar sala) y `Q` (volver al hub) se aceptan en cualquier estado salvo
`loading`, `exiting` y `dead`. Los añadirlos caso por caso a la tabla es como aparecen
las filas que se contradicen entre sí, así que la regla es esta y no otra.

Una sala de puzle se considera **resuelta** cuando tiene al menos una caja y, para
toda caja, su celda contiene `G` o `X`. La condición de "al menos una caja" está ahí
porque sin ella la definición se cumpliría en vacío y las salas de huida quedarían
resueltas desde el primer segundo.

Las salas de huida no tienen cajas, así que **nunca** alcanzan `solved`: su `E` es
pasable desde el principio y pasan a `exiting` en cuanto el jugador la pisa.

Al entrar en `solved`, la `E` deja de bloquearse, se reproduce un destello en la
ranura más cercana y se espera `EXIT_OPEN_DURATION`. Después el jugador debe pisar la
`E`.

## 9. Formato de datos de una sala

`src/world/levels.js` **no importa nada**. Ni Three.js, ni el DOM, ni ningún módulo
del juego. Es un módulo de datos puros. Esto es una restricción dura: es lo que
permite que `tools/check-levels.mjs` lo lea en Node sin cargar nada.

```js
export const LEVELS = [
  {
    id: 'p1',
    name: 'Primer empuje',
    type: 'puzzle',              // 'puzzle' | 'chase'
    order: 1,
    layers: [
      '#######',                  // L0 como string: se repite 5 veces, todo suelo
      [                            // L1, la capa de juego
        '#.....#',                 //   z=0
        '#.C.C.#',                 //   z=1   dos cajas
        '#.....#',                 //   z=2
        '#.G.GP#',                 //   z=3   dos ranuras y el jugador
        '#####E#',                 //   z=4   la salida, en un nicho
      ],
    ],
    solution: 'NNNWSSENNWWWSS',  // solo en salas 'puzzle'; cadena vacía si no
    stalkerStart: null,          // celda [x, z] de L1; null si no hay perseguidor
    stalkerTrigger: null,        // celdas [x, z] de L1; null si no hay perseguidor
  },
];
```

`width` y `height` se derivan de las propias capas, no se escriben a mano. Escribir un
tamaño que no cuadre con el contenido es un error de datos, y el validador lo detecta.

**El alfabeto de `solution` es de ejes de mundo, no de cámara:** `N` es `z-1`, `S` es
`z+1`, `W` es `x-1`, `E` es `x+1`. Nada de diagonales, nada de `U` para arriba. Es
deliberado: la entrada del jugador es relativa a la cámara y por tanto distinta en cada
partida, mientras que un string de solución tiene que significar lo mismo siempre para
que el verificador pueda reproducirlo. `N`, `S`, `E` y `W` son las únicas cuatro
letras válidas, y cualquier otra es un error.

### 9.1 La sala `p1`, resuelta paso a paso

Incluida para que no exista ninguna duda sobre el formato ni sobre las reglas.

Estado inicial: jugador en `(5, 3)`, cajas en `(2, 1)` y `(4, 1)`, ranuras en `(2, 3)`
y `(4, 3)`, salida en `(5, 4)`.

```
L0   #######

L1   #.....#     z=0
     #.C.C.#     z=1     C en x=2 y x=4
     #.....#     z=2
     #.G.GP#     z=3     G en x=2 y x=4, P en x=5
     #####E#     z=4     E en x=5
```

Fíjate en que **L0 es toda `#`**, así que no hay ningún pozo y todo lo que hay en L1
está apoyado. Y fíjate en que **la sala solo tiene dos capas**: por eso el escalón
automático nunca puede dispararse, porque exigiría una L2 que no existe, y por eso
tampoco hay ningún bloque suelto en L1. Es la sala más plana posible, a propósito:
su trabajo es enseñar a empujar y nada más. Los `#` que sí hay en L1 están en la fila
`z=4`, la del nicho de la salida, y no estorban porque nadie tiene que empujar contra
ellos.

Solución: `N N N W S S E N N W W W S S`, catorce pasos. Desarrollada, con `north` =
`z-1` y `south` = `z+1`:

| # | Tecla | Jugador | Cajas | Por qué |
|---|---|---|---|---|
| 1 | `N` | `(5, 3)` → `(5, 2)` | — | Celda abierta. |
| 2 | `N` | `(5, 2)` → `(5, 1)` | — | Celda abierta. |
| 3 | `N` | `(5, 1)` → `(5, 0)` | — | Celda abierta. |
| 4 | `W` | `(5, 0)` → `(4, 0)` | — | Celda abierta, y ya está encima de la caja. |
| 5 | `S` | `(4, 0)` → `(4, 1)` | `(4, 1)` → `(4, 2)` | Empuja. `ahead` es `(4, 2)`, abierta y sin caja: válido. |
| 6 | `S` | `(4, 1)` → `(4, 2)` | `(4, 2)` → `(4, 3)` | Empuja. `ahead` es `(4, 3)`, que es `G`. Una `G` no es sólida, así que la caja entra. Primera caja colocada. |
| 7 | `E` | `(4, 2)` → `(5, 2)` | — | Celda abierta. |
| 8 | `N` | `(5, 2)` → `(5, 1)` | — | Celda abierta. |
| 9 | `N` | `(5, 1)` → `(5, 0)` | — | Celda abierta. |
| 10 | `W` | `(5, 0)` → `(4, 0)` | — | Celda abierta. |
| 11 | `W` | `(4, 0)` → `(3, 0)` | — | Celda abierta. |
| 12 | `W` | `(3, 0)` → `(2, 0)` | — | Celda abierta, y ya está encima de la segunda caja. |
| 13 | `S` | `(2, 0)` → `(2, 1)` | `(2, 1)` → `(2, 2)` | Empuja. `ahead` es `(2, 2)`, abierta y sin caja: válido. |
| 14 | `S` | `(2, 1)` → `(2, 2)` | `(2, 2)` → `(2, 3)` | Empuja. `ahead` es `(2, 3)`, que es `G`. Segunda caja colocada. |

Las dos cajas están sobre `G`, así que la sala pasa a `solved` y su `E` deja de
bloquearse. La salida está en `(5, 4)`, y desde `(2, 2)` se llega con `E E E S S`,
que son cinco pasos:

| # | Tecla | Jugador | Por qué |
|---|---|---|---|
| 1 | `E` | `(2, 2)` → `(3, 2)` | Fila `z=2`, que está libre de principio a fin. |
| 2 | `E` | `(3, 2)` → `(4, 2)` | Igual. |
| 3 | `E` | `(4, 2)` → `(5, 2)` | Igual. |
| 4 | `S` | `(5, 2)` → `(5, 3)` | Bajando a la fila `z=3`. |
| 5 | `S` | `(5, 3)` → `(5, 4)` | La salida. Fin de la sala. |

**Y fíjate en la ruta que no hay que hacer.** El camino `S E E E S`, que baja
primero a la fila `z=3` y luego la recorre, **está bloqueada por la propia caja**: al
llegar a `(4, 3)` el jugador tendría que empujar la caja que ya está colocada en su
ranura, se la llevaría a `(5, 3)` y luego dentro de la salida, y la sala dejaría de
estar resuelta, con la caja enquistada en el hueco y sin forma de sacarla. Por eso la
fila `z=2` está limpia y por eso la sala no está resuelta hasta el final.

Esto es exactamente el tipo de sala que la comprobación 13 del verificador existe para
cazar: los datos son válidos, la sala es resoluble, y aun así no se puede terminar.

**Ojo con los pasos 7 a 12.** Tras el paso 6 el jugador está en `(4, 2)`, la celda
*justo encima* de la caja ya colocada. Si en vez de subir a la fila `z=0` empujara la
segunda caja desde abajo, no podría: para empujar hay que estar al norte de la caja,
nunca al sur. Por eso la solución rodea por arriba, y ese rodeo es el puzle entero.

### 9.2 Un ejemplo de sala `chase`

No hace falta que funcione, pero sí que no quede ninguna duda sobre el formato: las
salas de huida llevan `solution` a cadena vacía, y no llevan **ni una sola caja ni
ranura**. La clave existe siempre; su valor es lo que cambia.

```js
{
  id: 'c1',
  name: 'El que te sigue',
  type: 'chase',
  order: 2,
  layers: [
    '#########',                 // L0 como string: se repite 2 veces, todo firme
    [                             // L1, la capa de juego
      '#.......#',                //   z=0
      '#P.#...E#',                //   z=1   P, el bloque que hay que escalar, E
    ],
    ['#.......#'],               // L2, existe solo para poder subir al bloque
  ],
  solution: '',                 // cadena vacía: no hay empujón que resolver
  stalkerStart: [1, 0],         // de dónde sale, en L1, detrás del jugador
  stalkerTrigger: [[2, 1]],     // celdas de L1 que lo despiertan
}
```

Los dos van como pares `[x, z]` de **L1**, no como ternas: el perseguidor solo vive
en L1 y no tiene capa que especificar. Ambos campos son obligatorios, y sin ellos la
sala no dice de dónde sale el perseguidor ni cuándo arranca, que en una sala de huida
es la mitad del diseño. En las salas de puzle los dos van a `null`, sin excepción.

Fíjate también en que hay un bloque `#` en L1 con una fila L2 encima. Sin esa fila el
bloque sería inescalable, porque el salto no se resuelve hacia celdas sin apoyo, y la
sala sería injugable. El verificador lo detecta en la comprobación 13.

## 10. Las 10 salas

Orden de juego fijo. El hub abre la puerta de la siguiente sala al resolver la
anterior.

| # | id | Tipo | Cajas | Idea nueva que introduce |
|---|---|---|---|---|
| 1 | `p1` | puzle | 2 | Empujar. Dos cajas y dos ranuras, y nada más: ni pozo, ni bloque, ni perseguidor. |
| 2 | `c1` | huida | 0 | Escalar y correr. Un bloque en L1 que hay que subir, y el perseguidor detrás. |
| 3 | `p2` | puzle | 2 | Orden. Dos cajas, dos ranuras, el orden importa porque no se solapan. |
| 4 | `c2` | huida | 0 | Un pozo. Cruzar por arriba o caer. |
| 5 | `p3` | puzle | 3 | Rodear. Una caja tiene que dar la vuelta a una esquina: no se puede tirar. |
| 6 | `c3` | huida | 0 | Vertical. El perseguidor te sigue por la columna; los bloques son la única cobertura. |
| 7 | `p4` | puzle | 3 | Nicho. Hay que entrar en un hueco del que solo se sale por el mismo lado. |
| 8 | `c4` | huida | 0 | Embestida. Corredor largo, el perseguidor embiste. |
| 9 | `p5` | puzle | 4 | Ranuras `X`. La caja pasa por un hueco por el que el jugador no cabe. |
| 10 | `p6` | puzle | 5 | Finale. Cinco cajas, dos ranuras `X`, orden estricto. |

Reglas duras de la progresión:

- El **máximo es 5 cajas**. Ninguna sala puede superarlo. Si una sala con 5 cajas no
  es interesante, quítale una; no añadas una sexta.
- Cada sala introduce **exactamente una** idea. No combines.
- Las salas `c1` a `c4` **no tienen cajas ni ranuras**. Ni una. Cero.
- Ninguna sala tiene dos perseguidores.
- El título y la idea se muestran en pantalla al entrar en la sala, 1.2 s, y se
  desvanece.

## 11. El hub

El hub **no se valida con el verificador de salas**: no tiene puzles. Se construye con
una función `buildHub()` en `src/world/room.js` a partir de una rejilla generada con
las mismas primitivas de la sección 4: **una capa L0 de 9 celdas, todas `#`**, y una
capa L1 de 13 filas, con el jugador en el centro y 10 puertas: 5 en el muro norte de
L1 y 5 en el muro sur de L1, en orden de `order`.

- Una puerta **cerrada** es un `#`. Una puerta **abierta** es un `E`.
- El hub se construye con `exitLocked = false`, igual que una sala de huida, así que
  sus `E` son siempre transitables. Sus puertas cerradas son `#`, no `E` a la espera de
  una condición: el hub no tiene cajas y su `solved` nunca se calcula.
- El hub no tiene `C`, ni `G`, ni `X`, ni pozo: su L0 es toda `#`.
- Al entrar por una puerta se carga la sala correspondiente. Se vuelve al hub con la
  misma tecla, `Q`, desde dentro de una sala.
- La puerta de la sala `order` `n` se abre al resolver la sala `order` `n-1`. La puerta
  de `order` 1 está abierta desde el principio.
- Un puzle ya resuelto muestra su puerta en el color de las ranuras, para que se vea
  el avance. Un puzle sin resolver muestra su puerta en el color de los bloques.
- El hub no tiene perseguidor. Nunca.

## 12. Perseguidor

Solo se instancia en salas con `type: 'chase'`. La regla se hace cumplir en código: si
se intenta crear un perseguidor en una sala de tipo `puzzle`, lanza un error en
desarrollo. No es una convención, es una aserción.

Máquina de estados, con esta única transición en cada flecha:

```
dormant --> pursuit --> lunge --> caught --> dead
              ^           |
              `-----------'
```

- **`dormant`**: empieza en la celda `stalkerStart` y no se mueve. Se despierta
  cuando el jugador pisa cualquiera de las celdas de `stalkerTrigger`. Puede haber
  varias, y permanece dormido hasta que el jugador pisa una.
- **`dormant` → `pursuit`**: espera `STALKER_DORMANT_DELAY` antes de moverse por
  primera vez, para que el jugador vea dónde está.
- **`pursuit`**: busca camino con BFS **en L1** hacia la posición del jugador. Si el
  jugador está en L2 o superior, la BFS va hacia su **columna** en L1 y se detiene al
  llegar a la celda de debajo. Eso permite esquivarlo subiendo, y es una consecuencia
  de las reglas, no un caso especial: no escribas ninguna lógica de "persecución
  vertical", no existe y no debe existir.
- El perseguidor trata `X` como sólido para él, porque es más grande que una caja y no
  cabe. Los `#` y la salida cerrada también le bloquean.
- **`lunge`**: entra cuando la distancia entre los dos es `<= LUNGE_RANGE`. Usa
  `STALKER_LUNGE_CELL_DURATION`. Vuelve a `pursuit` en cuanto la distancia supera
  `LUNGE_RANGE + 1`.
- **`caught`**: cuando la distancia es `<= CATCH_DISTANCE`. Produce la muerte.

**Las dos distancias se miden sobre la posición interpolada, expresada en celdas
fraccionarias**, no sobre celdas enteras. En la práctica: se restan las posiciones
de mundo de los dos, se dividen por `CELL` y se saca la distancia euclídea. Es lo que
hace que `CATCH_DISTANCE = 0.6` tenga sentido, porque entre dos celdas enteras
distintas la distancia mínima es 1 y el perseguidor no podría capturar nunca. La
consecuencia de usar la posición interpolada es que el jugador tiene que **cruzar** la
posición del perseguidor para morir: estar en la celda de al lado no basta, y eso se ve
venir. Y como el perseguidor solo se mueve en L1, un jugador en L2 nunca es
capturado por distancia; para morir tiene que bajar a L1.

El perseguidor se dibuja con la geometría de la tabla 14.2, en el color de peligro,
con material emisivo. **Sin tercera luz:** las dos de la sección 14.3 son todas las
que hay, y el emisivo del material es lo que lo hace brillar. No tiene animación de
andar: avanza, y su altura oscila `+= 0.12` a 4 Hz, que es todo lo que necesita para
leerse como algo vivo.

El terror lo dan el sonido, la niebla y la imposibilidad de golpearlo, no la
geometría. No añadas detalle, ni partículas, ni efectos de pantalla para asustar.

Nunca se mueve en diagonal. Nunca atraviesa un bloque. Nunca se queda dentro de otro
enemigo, porque solo hay uno.

## 13. Cámara

Tercera persona, órbita propia. **No uses `OrbitControls`**: la cámara necesita
histéresis y clamp de pitch que el addon no expone con el comportamiento correcto, y
mezclarlos es una de las contradicciones más fáciles de introducir. La cámara vive
entera en `src/render/camera.js`, sobre la API mínima de Three.js.

- Yaw libre 360°. Pitch entre `CAMERA_PITCH_MIN` y `CAMERA_PITCH_MAX`, inicial
  `CAMERA_PITCH_DEFAULT`. El ratón mueve el yaw y el pitch; el pitch se clampea.
- Posición: el jugador mira a `celda + CAMERA_HEIGHT_OFFSET`, y la cámara se sitúa a
  `CAMERA_DISTANCE` en la dirección que resulta de yaw y pitch.
- Suavizado exponencial independiente del framerate:
  `factor = 1 - Math.exp(-CAMERA_SMOOTHING * dt)`.
- **La cámara no colisiona con la geometría.** Las paredes son losas finas, así que
  casi siempre hay línea de visión limpia, y la oclusión se resuelve con el
  desvanecido de la regla siguiente. No escribas un raycast de colisión de cámara.
- La cámara nunca baja de `CAMERA_MIN_HEIGHT_FACTOR * CAMERA_HEIGHT_OFFSET` sobre el
  suelo, para no atravesarlo.

### 13.1 Oclusión y lectura de la rejilla

Un puzle 3D sobre rejilla es ilegible si no se ve en qué celda está el jugador. Estas
tres reglas lo resuelven, y las tres son obligatorias:

1. **Desvanecido por oclusión.** Una vez por frame, traza un rayo desde la cámara al
   centro del jugador. Toda malla atravesada se pone a `OCCLUSION_FADE_OPACITY` con
   `transparent: true` y `castShadow: false`. Se restauran a opacidad 1 las que el rayo
   ya no toca. Aplica a paredes, cajas, bloques y al perseguidor, sin excepción.
2. **Pin de posición.** Debajo del jugador, una columna translúcida de radio 0.15 que
   baja desde sus pies hasta el suelo, en el color de acento. Marca su celda exacta.
3. **Marcas de rejilla.** Los bordes de las celdas de L1 se dibujan con `LineSegments`
   en un 12 % de opacidad. La rejilla debe ser visible, no insinuada.

## 14. Arte

Sin assets externos. Ni un archivo, ni un modelo, ni una textura, ni una fuente. Todo
sale de primitivas de Three.js y de colores planos. Esta restricción es la que hace el
proyecto ejecutable sin red más allá del CDN.

### 14.1 Tabla de paleta

| Elemento | Color | Material |
|---|---|---|
| Fondo (clear color) | `#12151c` | — |
| Niebla | `#12151c`, `FogExp2` densidad 0.028 | — |
| Bloque sólido `#` | `#3d4454` | `MeshLambertMaterial` |
| Suelo de L0 | `#2a2f3c` | `MeshLambertMaterial` |
| Caja `C` | `#d98b4a` | `MeshLambertMaterial` |
| Ranura `G` | `#4ad9a0`, emisiva 0.35 | `MeshStandardMaterial` |
| Ranura de paso `X` | `#7a6bd9` | `MeshLambertMaterial` |
| Salida `E` | `#4ad9a0` al abrir, `#5a3040` cerrada | `MeshStandardMaterial` |
| Jugador | `#e8e2d0` | `MeshLambertMaterial` |
| Perseguidor | `#e0484f`, emisiva 0.5 | `MeshStandardMaterial` |
| Acento | `#4ad9a0` | — |
| Pin de posición | color de acento, opacidad 0.35 | `MeshBasicMaterial` |

### 14.2 Geometría

| Elemento | Construcción |
|---|---|
| Suelo de L0 | Un `BoxGeometry(CELL, CELL / 2, CELL)` por celda `#` de L0, con la cara superior justo en `CELL / 2`, que es donde se apoyan los pies de quien está en L1 |
| Bloque `#` | Un `BoxGeometry(CELL * 0.98, CELL * 0.98, CELL * 0.98)` |
| Muro perimetral | Para toda celda `#` de L0 que tenga una celda no sólida adyacente en L1, una losa `BoxGeometry(CELL, CELL * 1.6, 0.14)` en el borde compartido, **no** un cubo lleno. La losa fina es lo que deja ver dentro de la sala desde fuera |
| Caja | `BoxGeometry(CELL * 0.8, CELL * 0.8, CELL * 0.8)` con aristas marcadas por una `LineSegments` del mismo color, para que se lea el cubo |
| Ranura | Placa `BoxGeometry(CELL * 0.8, 0.06, CELL * 0.8)` sobre el suelo |
| Salida | Marco de 2 postes y un dintel, más un plano emisivo en el hueco |
| Jugador | `BoxGeometry(0.7, 1.0, 0.7)` y una esfera de radio 0.22 encima, color de acento |
| Perseguidor | `BoxGeometry(0.7, 1.3, 0.45)` alargado en el eje de avance |

### 14.3 Luces

Exactamente dos. Ni una más, ni una menos.

- `HemisphereLight(sky #4a5570, ground #1a1d26, 0.9)`.
- `DirectionalLight(#ffffff, 1.4)` en `(6, 12, 4)`, con `castShadow: true`,
  `shadow.mapSize` 2048, y una `shadow.camera` ortográfica ajustada a la sala actual en
  cada cambio de sala. **Solo la luz direccional proyecta sombra.** El hemisférico no.

### 14.4 Ajustes del renderer

Obligatorios, y en este orden:

```
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
```

- **`THREE.PCFSoftShadowMap` está obsoleta desde r186.** La constante sigue existiendo y
  se sigue exportando, así que el código compila, pero el renderer la intercepta, escribe
  un aviso en consola y la degrada por su cuenta a `PCFShadowMap`. Es decir: el juego
  "funciona" y aparece un warning que no vas a entender. Pon tú mismo
  `THREE.PCFShadowMap`, que además es el valor por defecto, y no escribas
  `PCFSoftShadowMap` en ninguna parte.
- No hay `useLegacyLights` ni `physicallyCorrectLights`: fueron eliminados y no queda
  ninguna bandera que activar.
- No toques `outputColorSpace`. Su valor por defecto ya es el correcto, y
  `new THREE.Color(0xd98b4a)` ya se interpreta como sRGB.
- **En el handler de `resize` vuelve a aplicar `setPixelRatio` antes de `setSize`.**
  Al mover la ventana entre un monitor 1x y uno 2x cambia el `devicePixelRatio`, y si
  no lo reclamas te quedas renderizando al triple de resolución.
- Si el canvas no llena exactamente el viewport, usa un `ResizeObserver` sobre el
  **contenedor**, nunca sobre `renderer.domElement`: `setSize` muta el tamaño del
  canvas y observarlo a él dispara un bucle de realimentación. Con
  `setSize(w, h, false)` el CSS no se toca, así que el canvas necesita
  `width:100%; height:100%; display:block` y el contenedor debe tener tamaño explícito.

### 14.5 Post-proceso

No hay post-proceso. Ni bloom, ni SSAO, ni vignette por post-proceso. Si quieres un
oscurecimiento en los bordes, es un `div` con `radial-gradient` sobre el canvas. Nada
más.

## 15. Audio

100 % sintetizado con la Web Audio API. Cero archivos. Cero descargas. Cero licencias.

| Sonido | Síntesis |
|---|---|
| Paso | Ruido blanco filtrado, pasa-banda a 900 Hz, envolvente de 0.05 s, ganancia 0.08 |
| Empujón | Onda triangular a 110 Hz con caída de tono a 80 Hz en 0.12 s, ganancia 0.10 |
| Caja en ranura | Dos senos a 660 Hz y 990 Hz, 0.18 s, ganancia 0.12 |
| Salto | Onda seno de 300 a 480 Hz en 0.10 s, ganancia 0.06 |
| Caída | Ondulación de ruido con pasa-banda descendente de 600 a 200 Hz en 0.25 s |
| Muerte del jugador | Seno de 220 a 55 Hz en 0.5 s, ganancia 0.18 |
| Despertar del perseguidor | Sierra de 60 Hz con LFO de 5 Hz, ganancia 0.10, en bucle hasta `pursuit` |
| Ambiente | Dos senos desafinados (58 y 58.6 Hz), ganancia 0.02, permanentes |
| Confirmación de UI | Seno de 880 Hz, 0.07 s, ganancia 0.10 |

`AudioContext` se crea **en el primer gesto del usuario**, nunca antes. Sin
autoplay fallará y no se oirá nada. Un `masterGain` a 0.6, y un conmutador de silencio
con la tecla `M`.

Las frecuencias, envolventes y ganancias de esta tabla **no van en `constants.js`**:
viven en `audio.js` y son parámetros de sonido, no de juego. Es la excepción
explícita a la regla de la sección 18, y solo de esta tabla.

## 16. Pantallas y flujo de juego

| Estado | Qué se ve | Cómo se sale |
|---|---|---|
| `boot` | Pantalla negra, texto "Cargando" | Automático, al terminar de construir la escena |
| `menu` | Título, "Continuar" y "Partida nueva" | Clic o `Enter` |
| `hub` | La galería con sus puertas | Caminar a una puerta y `E` |
| `playing` | La sala actual | `Esc` pausa, `Q` vuelve al hub |
| `paused` | Menú sobre la escena, escena desenfocada por CSS | `Esc` o clic |
| `dead` | Fundido a negro, contador de muertes | Automático, reinicia la sala |
| `win` | Pantalla final con tiempo total y muertes totales | `Enter` al hub |

`new game` **no pide confirmación**: no hay nada que perder, el guardado solo contiene
progreso y se reinicia en una línea. Evita un diálogo de confirmación que solo añade
un caso de estado.

### 16.1 Tabla de teclas

| Tecla | Acción | Disponible en |
|---|---|---|
| `W` `A` `S` `D` / flechas | Mover (respecto a la cámara) | `playing` |
| `Espacio` | Saltar una capa | `playing` |
| `Z` | Deshacer el último movimiento | `playing` |
| `R` | Reiniciar la sala actual | `playing` |
| `E` | Entrar en la puerta | `hub` |
| `Q` | Volver al hub | `playing` |
| `Esc` | Pausa | `playing` |
| `M` | Silenciar audio | todos |
| `Enter` | Confirmar | `menu`, `win` |

Cada tecla tiene **una** acción y **un** contexto. Si necesitas una tecla en dos
contextos, es otra tecla. No hay atajos ocultos, ni dobles asignaciones, ni
configuración de teclas.

### 16.2 HUD

Solo dos elementos, siempre visibles en `playing`: el nombre de la sala, arriba a la
izquierda, y el contador de muertes, arriba a la derecha. Nada más. El HUD no muestra
la solución, ni el estado de las cajas, ni un minimapa: la información tiene que estar
en el mundo.

## 17. Persistencia

Una única clave en `localStorage`, con este esquema exacto:

```
sokoban-3d.save.v1
{
  "unlocked": 3,
  "solved": ["p1", "c1"],
  "deaths": 7,
  "totalDeaths": 12,
  "startedAt": "2026-09-30T00:00:00.000Z"
}
```

- `unlocked`: entero 1 a 10, la última sala desbloqueada.
- `solved`: array de `id` resueltos, sin duplicados.
- `deaths`: muertes de la sesión actual, se reinicia con `new game`.
- `totalDeaths`: muertes acumuladas desde siempre.
- `startedAt`: ISO 8601 del momento en que empezó la partida. El tiempo total de la
  pantalla `win` es `Date.now() - startedAt`, formateado en minutos y segundos.

**No se guarda la partida a medias.** Al entrar en una sala se empieza desde el
principio de esa sala. Si el jugador cierra la pestaña, pierde el progreso de esa sala
y nada más. Esto es una decisión de diseño, no una carencia: guardar el estado
intermedio de una animación de empujón es una fuente de errores enorme y no aporta nada
en un juego de 15 minutos.

`totalDeaths` y `startedAt` sobreviven a `new game`. Todo lo demás se borra.

## 18. Estructura de archivos

Árbol exacto. Ningún archivo fuera de esta lista, ningún archivo que falte.

```
index.html
src/main.js
src/core/constants.js
src/core/loop.js
src/core/input.js
src/core/save.js
src/core/state.js
src/world/grid.js
src/world/levels.js
src/world/room.js
src/entities/player.js
src/entities/stalker.js
src/render/scene.js
src/render/camera.js
src/ui/ui.js
src/audio/audio.js
tools/check-levels.mjs
```

| Archivo | Responsabilidad | No contiene |
|---|---|---|
| `index.html` | Importmap, lienzo, contenedores del HUD, `<script type="module">` | Lógica de juego |
| `src/core/constants.js` | **Solo** el objeto `T` de la tabla 3, exportado | Nada más |
| `src/core/loop.js` | Bucle de requestAnimationFrame, acumulador de paso fijo, `dt` acotado | Cualquier regla del juego |
| `src/core/input.js` | Teclado, ratón, pointer lock, buffer de entrada, dirección derivada de cámara | Geometría |
| `src/core/save.js` | Lectura y escritura de `localStorage`, esquema de la sección 17 | Cualquier otra cosa |
| `src/core/state.js` | Máquina de estados de pantallas de la sección 16 | Three.js |
| `src/world/grid.js` | Clase `Grid`, consultas de tiles, nada más | Three.js, DOM |
| `src/world/levels.js` | **Solo el array `LEVELS`**. Cero imports | Three.js, DOM, lógica |
| `src/world/room.js` | Construye y destruye una sala: geometría, cajas, salida, `buildHub()` | Bucle, entrada |
| `src/entities/player.js` | Posición en rejilla, resolución de pasos, pila de deshacer | Render |
| `src/entities/stalker.js` | Máquina de estados, BFS, capturas | Render |
| `src/render/scene.js` | Escena, luces, niebla, materiales, geometría, `dispose()` | Reglas del juego |
| `src/render/camera.js` | Cámara en tercera persona, oclusión, pin, marcas de rejilla | Reglas del juego |
| `src/ui/ui.js` | HUD, pantallas, pausa, transiciones | Three.js, reglas |
| `src/audio/audio.js` | Los 9 sonidos de la sección 15 | Three.js |
| `tools/check-levels.mjs` | Verificador de salas, corre en Node, cero dependencias | Imports del juego salvo `levels.js` |

Tres restricciones que no se negocian:

- `levels.js` **no importa nada**. Es la condición para que el verificador corra.
- `constants.js` **solo** contiene la tabla 3. Ningún número **de juego** fuera de
  ahí: ninguna duración, distancia, velocidad, umbral ni probabilidad. Si necesitas
  uno que no está en la tabla 3, es que falta una fila, y lo primero que haces es
  añadirla.
- **Excepción, y solo una:** `scene.js` y `audio.js` fijan en su propio interior los
  números de las tablas 14.2 y 15 —tamaño de primitivas, opacidades, frecuencias,
  ganancias—, porque son parámetros visuales y de sonido que no afectan al juego. No
  se mueven a `constants.js` y no se cuentan como números mágicos. Cualquier otro
  archivo que necesite un número que no sea visual ni sonoro, lo busca en `T` o
  rompe la regla.

### 18.1 Cómo se ejecuta

Sin dependencias de JavaScript, así que no hay `npm install` en el juego. La
dependencia de Node es solo para el verificador, y solo para desarrollo.

```
# Ver las 10 salas (obligatorio antes de dar el juego por terminado)
node tools/check-levels.mjs

# Ejecutar el juego
python -m http.server 8000
# y abrir http://localhost:8000
```

Se necesita un servidor estático porque el juego usa módulos ES, y los módulos ES no
se cargan desde `file://`. Un `python -m http.server` vale. No propongas Vite, ni
Parcel, ni Rollup, ni un `package.json` para el juego.

El importmap, literal y completo:

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js"
  }
}
</script>
```

Solo se mapea `three`, y **no se mapea `three/addons/`**. No uses addons: la cámara,
el oclusor y las marcas de rejilla se escriben a mano. Y no es que esté prohibido
importarlos, es que el prefijo ni siquiera resuelve, así que el error salta al
cargarlo y no se te va a pasar por alto.

**La versión `0.186.1` aparece dos veces en el proyecto:** en el importmap de
`index.html` y en el comentario de cabecera de `constants.js`. Es la única
duplicación admitida, porque el importmap es HTML estático y no puede importar un
módulo de JavaScript. Las dos copias tienen que coincidir. Si alguna vez cambias la
versión, cámbiala en los dos sitios o el juego arrancará con un `constants.js` que
describe una versión que ya no es la que se descarga.

## 19. Verificador de salas

`tools/check-levels.mjs` es Node puro, sin dependencias, y es **la puerta de calidad
del proyecto**. Si el verificador falla, el juego no está terminado, por mucho que
funcione.

Ejecuta estas comprobaciones, en este orden, y para cada sala:

1. Todas las capas tienen las mismas dimensiones, y hay al menos dos capas.
2. Todos los símbolos están en la tabla 4.
3. L0 solo contiene `#` y `.`.
4. L2 y superiores solo contienen `#` y `.`.
5. Hay exactamente un `P` y al menos un `E`, ambos en L1, y ninguna capa contiene
   ningún otro `P` ni `E`.
6. **El número de cajas es igual a la suma de `G` más `X`**, no igual a cada uno por
   separado. En salas `chase` los tres son 0.
7. `type` es `puzzle` o `chase`. Las salas `puzzle` tienen `stalkerStart` y
   `stalkerTrigger` a `null`, y al menos una caja. Las salas `chase` tienen ambos como
   arrays de pares `[x, z]` de L1, no nulos, y ninguna caja ni ninguna ranura. Las
   claves `solution`, `stalkerStart` y `stalkerTrigger` existen siempre, aunque valgan
   `''` o `null`.
8. El nodo inicial no está dentro de un `#` ni de una `X`, y `E` no está dentro de un
   `#`. El `P` y la `E` están apoyados: la celda de debajo de cada uno es sólida en L0.
   Si no lo están, el jugador aparecería cayendo o atravesando el suelo.
9. Ningún `C`, `G` ni `X` está en una celda de pozo, es decir, sobre un `.` de L0.
10. **Resolubilidad.** BFS sobre el espacio de estados, donde el estado es
    `(celdaJugador, [celdasDeCajaOrdenadas])`, siendo `celdaJugador` una terna
    `(x, y, z)`. El estado tiene que llevar la **capa** del jugador, no solo su fila:
    una sala con L2 tiene más estados, y una búsqueda que lo ignorara daría por
    irresoluble una sala que sí se puede resolver subiendo. Se generan las 4
    direcciones y el salto, aplicando la resolución de la sección 6.2, la caída de la
    6.3, el salto de la 6.4 y las reglas de la sección 7, **sin ninguna simplificación**:
    si una acción es inválida en el juego, es inválida en la búsqueda. Los estados van
    a un `Set`. Si se superan `MAX_PUZZLE_STATES`, abortas esa sala y la marcas
    `TOO COMPLEX`, que es un resultado honesto y distinto de irresoluble.
11. La sala está resuelta si algún estado alcanzable cumple la definición de la
    sección 8: al menos una caja, y todas sobre `G` o `X`.
12. El string `solution` de la sección 9, si existe, se reproduce desde el estado
    inicial jugando con el mismo resolutor, y debe terminar en **algún** estado
    resuelto. No exijas que coincida con el de la BFS: si hay varias soluciones,
    cualquiera vale.
13. **La sala se puede terminar.** Con el mismo resolutor, comprueba que desde el
    estado inicial se puede alcanzar la celda `E` sin morir por caída. En las salas
    `puzzle` la comprobación se hace **desde un estado ya resuelto**, con la `E`
    desbloqueada, y tiene que ser verdad desde todos los estados resueltos alcanzables,
    no solo desde el primero que encuentres.

    Esta es la comprobación que más bugs atrapa, y la razón de existir es una sala
    concreta: una sala puede tener los datos perfectos, ser resoluble, y ser
    **injugable** porque la única ruta a la salida obliga a empujar una caja ya
    colocada y al final queda enquistada en el hueco. Nada de lo demás lo detecta.
    Si la 13 falla, el problema no está en las cajas: está en el pasillo de salida, y
    hay que mover la `E` o limpiar la fila de salida.
14. Para las salas `chase`, comprueba que `stalkerStart` y todas las celdas de
    `stalkerTrigger` están dentro de los límites, que ninguna está dentro de un `#` ni
    de una `X`, que ninguna está sobre un `.` de L0, y que `stalkerStart` no es la
    misma celda que el `P` del jugador: si arrancaran juntos, la sala mataría en el
    primer segundo.

Salida esperada, una línea por sala, y **código de salida 0 solo si las 10 pasan**:

```
p1  puzzle  2 cajas  2 ranuras  SOLVABLE  312 estados  solucion 14 pasos
p2  puzzle  2 cajas  2 ranuras  SOLVABLE  745 estados  solucion 18 pasos
c1  chase   0 cajas  sin empujon  ruta P-E 7 pasos  disparador en (2,1)
...
OK: 10 salas validas
```

Los números concretos de estados dependen de cada sala: lo que importa es el formato,
que el recuento salga y que las 10 líneas terminen en `SOLVABLE` o en `ruta P-E`.

Un fallo debe nombrar la sala, la comprobación y el detalle. Nada de
`console.log` genéricos.

## 20. Tareas

Hazlas en orden. No passes a la siguiente hasta que la anterior cumpla su criterio.

**T0 - Andamiaje.** `index.html` con el importmap, `constants.js` con la tabla 3
completa, `loop.js` con paso fijo y `dt` acotado, escena con las dos luces y la
niebla, un cubo que gira.
*Se acepta cuando* la página carga sin errores en consola, se ve el cubo a 60 fps, y
`constants.js` no contiene ningún número fuera de la tabla 3. La versión `0.186.1`
aparece en el importmap y en el comentario de `constants.js`, y las dos coinciden.

**T1 - Rejilla.** `grid.js` con la clase y las 10 consultas de la sección 5, más un
`levels.js` de una sola sala que contenga a la `p1` de la sección 9.1, que se
sustituirá por las 10 reales en T4.
*Se acepta cuando* `tools/check-levels.mjs` pasa las comprobaciones 1 a 9 sobre esa
sala. La 10 y siguientes no se pueden escribir todavía: dependen del resolutor de T2 y
T3. Que no estén no es un fallo, y que el script se queje de ellas sí lo sería:
márcalas como `PENDIENTE` y no las ejecutes.

**T2 - Jugador.** `input.js` con la dirección derivada de cámara y la histéresis,
`player.js` con las tres reglas de la sección 6.
*Se acepta cuando* en una sala vacía puedes caminar en las 4 direcciones, subir un
bloque de L1 con escalón automático, subir el segundo peldaño de una escalera de dos
bloques con escalón y luego salto, bajar de un bloque caminando y cayendo, caer por un
pozo hasta morir, y el buffer de entrada no pierde pulsaciones rápidas. Y la dirección
no cambia de eje al girar la cámara un grado alrededor de una diagonal.

Comprueba también el caso que parece un bug y no lo es: si saltas y la celda de
destino no está apoyada, el salto **no se ejecuta**. Nada de flotar, nada de estado
en el aire. Si te sale flotando, tienes mal implementada la regla 6.4.

**T3 - Cajas y deshacer.** `player.js` completa: empujón, condición de sala resuelta,
pila de deshacer ilimitada.
*Se acepta cuando* el empujón se comporta exactamente como la sección 7 en los seis
casos: válido; contra un `#`; **contra un `X` la caja sí entra**; contra la salida
cerrada; contra otra caja; y empujando una caja fuera de una ranura. Y `Z` deshace
movimientos con caja y sin caja, y devuelve el estado exacto.

**T4 - Salas y verificador.** `levels.js` con las 10 salas, `check-levels.mjs` completo.
*Se acepta cuando* `node tools/check-levels.mjs` sale con código 0 y las 10 salas dan
`SOLVABLE` o `ruta P-E`. **Es la puerta. Nada de lo que sigue empieza hasta que
pase.** Si alguna sala sale irresoluble, rehaces sus datos; si sale `TOO COMPLEX`,
le quitas una caja o le Reduces la simetría. No cambies el verificador para que pase.

**T5 - Perseguidor.** `stalker.js` con sus 5 estados, BFS, captura, aserción de que no
existe fuera de salas `chase`.
*Se acepta cuando* en `c1` despierta al pisar el disparador, persigue, embiste a 2
celdas, atrapa a 0.6, y si te subes encima se queda debajo sin atravesarte. Y en `p1`
no existe ningún perseguidor en la escena.

**T6 - Cámara y legibilidad.** `camera.js` con órbita propia, histéresis, clamp, los
tres requisitos de oclusión de la sección 13.1.
*Se acepta cuando* puedes girar 360° y ver siempre la sala, el pitch no pasa de los
límites, la geometría que te tapa se vuelve translúcida, el pin marca tu celda y las
marcas de rejilla se ven.

**T7 - Escena y arte.** `scene.js` con paleta, primitivas, luces y sombras según la
sección 14.
*Se acepta cuando* los colores son los de la tabla 14.1, solo la direccional proyecta
sombra, no hay ningún `PCFSoftShadowMap` en el código, y al cambiar de sala no se
acumulan geometrías: `dispose()` deja el contador de objetos igual al de antes.

**T8 - Pantallas, guardado, flujo.** `state.js`, `ui.js`, `save.js`, el hub.
*Se acepta cuando* los 7 estados de la sección 16 son alcanzables y se puede volver
atrás desde todos, el hub tiene 10 puertas con el color correcto según esté resuelta o
no, y recargar la página conserva el progreso.

**T9 - Audio y cierre.** `audio.js` con los 9 sonidos, pantalla final, y pasada de
limpieza.
*Se acepta cuando* los 9 sonidos suenan, el audio no se crea antes del primer gesto, y
`node tools/check-levels.mjs` sigue saliendo con 0.

## 21. Criterios de aceptación globales

El juego está terminado cuando **todo** esto es cierto:

- [ ] `node tools/check-levels.mjs` sale con código 0.
- [ ] Ningún número de juego (duración, distancia, velocidad, umbral, probabilidad)
      fuera de `constants.js`. Los números visuales de `scene.js` y los de sonido de
      `audio.js` sí pueden estar donde la sección 18 los autoriza, y solo ahí.
- [ ] No hay imports de Three.js en `grid.js`, `levels.js`, `save.js` ni `state.js`.
- [ ] No existe ningún archivo fuera del árbol de la sección 18.
- [ ] No hay un solo `import` de `three/addons/`.
- [ ] No aparece la cadena `PCFSoftShadowMap` en el código.
- [ ] No hay un solo archivo de imagen, modelo, textura, fuente o audio en el proyecto.
- [ ] No hay un solo número fuera de `[0-1]` en un color.
- [ ] No hay diagonales en ningún movimiento: ni del jugador, ni de las cajas, ni del
      perseguidor.
- [ ] El deshacer funciona 30 veces seguidas sin desbordar la pila.
- [ ] Cambiar de sala 20 veces seguidas no baja el framerate.
- [ ] `Escape` pausa desde cualquier sala, y reanudar devuelve el control.
- [ ] Recargar la página conserva el progreso y reproduce el mismo número de puertas
      abiertas en el hub.
- [ ] Ningún perseguidor existe en una sala de puzle.
- [ ] Con las 10 salas jugadas, `new game` devuelve al hub con una sola puerta abierta.
- [ ] La consola está limpia de errores y de advertencias de Three.js.

## 22. Prohibido

No hagas ninguna de estas cosas, aunque parezca útil:

- **Ninguna biblioteca de física.** Ni Cannon, ni Rapier, ni Ammo. La lógica es
  discreta y las colisiones son consultas de rejilla. Una física continua rompe el
  pilar 1.
- **Ninguna generación procedural de salas.** Las 10 salas se escriben a mano en
  `levels.js`. El procedural es un pilar entero de trabajo, y aquí no está.
- **Ningún sistema de inventario, objetos, llaves, monedas ni desbloqueables.**
- **Ningún diálogo, ni Cutscene, ni cinemática, ni texto narrativo.** Solo el nombre y
  la idea de cada sala.
- **Ningún sistema de combate.** El jugador no tiene forma de atacar ni de
  defenderse. La única forma de perder es morir y reiniciar la sala.
- **Ninguna red salvo el CDN de Three.js.** Sin analítica, sin fuentes remotas, sin
  imágenes remotas, sin APIs.
- **Ninguna pantalla táctil ni control táctil.** Es de escritorio, con teclado y ratón.
  Añadir controles táctiles es un sistema de entrada más, y no cabe.
- **Ninguna opción de configuración.** Sin menú de ajustes, sin elegir calidad, sin
  guardar preferencias. La única preferencia que existe es el silencio con `M`.
- **Ninguna animación de esqueleto ni de glTF.** Se mueve mallas, no personajes.
- **Ningún segundo enemigo, ni variantes, ni jefes.**
- **Ninguna tienda, ni moneda, ni puntuación, ni clasificación.**
- **Ninguna sala de bonus, ni sala secreta, ni modo difícil.**
- **No añadas sistemas para justificar el código.** Un sistema sin contenido en las 10
  salas se borra.

## 23. Criterio de entrega

Cuando termines:

1. Ejecuta `node tools/check-levels.mjs` y pega la salida completa.
2. Ejecuta la lista de la sección 21 y marca cada casilla, marcando en rojo y
   explicando cualquiera que falle.
3. Escribe `NOTES.md` con: las 5 decisiones donde tuviste que interpretar, cualquier
   lugar donde este prompt te pareció ambiguo, y el tiempo que tardaste en cada tarea.
4. No escribas un resumen de lo hecho. Si todo pasa, la salida del verificador y las
   casillas marcadas son el resumen.

--- FIN DEL PROMPT ---

## Apéndice: por qué está escrito así

**Rejilla y no físicas.** Un sokoban con colisiones continuas tiene casos límite
imposibles de depurar: cajas a medio empujar, jugador entre dos celdas, estados que
solo se dan a 60 fps en una máquina concreta. Con lógica de rejilla, el estado es un
punto del espacio discreto, y eso habilita el verificador: sin BFS, "esta sala es
resoluble" es una opinión; con BFS, es un hecho comprobable. El precio es que la
sensación de peso no sale de la física, y por eso el movimiento se interpola con
tiempos fijos y la cámara va con suavizado exponencial.

**L0 es la capa de apoyo, L1 la de juego.** La primera versión del documento trataba
a L0 como la capa donde andaba el jugador, y a la vez la definía como "solo admite
`#` y `.`" y la de las cajas. Eso es contradictorio: si L0 admite cajas, no es solo
suelo, y si es solo suelo, el jugador no puede estar en ella porque no hay nada
debajo que lo sostenga. La convención correcta es que **el jugador nunca está en L0**:
L0 es lo que lo sostiene, y su capa mínima es L1. Con esa convención, `feetY(y)` tiene
desfase y todas las reglas de apoyo se expresan en un solo sitio.

De esa convención salió un problema secundario: si todas las capas deben medir lo mismo,
escribir el suelo de una sala de cinco filas son cinco filas idénticas, y olvidarse de
una deja al jugador sin nada debajo en silencio. Por eso L0 admite escribirse como un
string suelto que se repite, y por eso el verificador comprueba las dimensiones antes
de mirar nada más.

**El modelo de movimiento de tres reglas.** Este fue el agujero más grave del diseño
inicial, y lo costó encontrar. La primera versión decía solo "el salto sube una capa",
y eso hace el juego **injugable por dos razones distintas**. La primera: un bloque de
una celda de alto es inescalable, porque la celda de encima del bloque queda sin
soporte y el jugador caería. La segunda, más sutil: saltar a una celda sin apoyo
dejaba al jugador flotando, porque la regla de caída lo devolvía abajo en el mismo
instante y el salto no producía ningún efecto observable. La solución fue hacer que
el salto solo se resuelva hacia celdas **ya apoyadas**. Con eso, escalón, salto y caída
cubren todos los casos y no existe ningún estado en el aire, que es exactamente lo que
permite aplicar la caída sin excepciones después de cada acción.

La consecuencia aceptada es que no se suben dos alturas de una vez: hace falta una
escalera de bloques. Es mejor diseño, porque la altura se lee en el nivel y no en la
pulsación.

**Sin salto horizontal.** Un puzle de rejilla gana coherencia cuando el hueco se cruza
por arriba y no con un timing de precisión. Si el salto no cruza, entonces el
perseguidor de la sección 12 solo necesita recorrer una capa, y por eso subir por
debajo de él funciona sin escribir una sola línea extra.

**El perseguidor solo en salas de huida.** Es la regla que más contradicciones evitó.
Si el perseguidor coexistiera con las cajas, la lógica del puzle, determinista por
diseño, tendría que competir con una IA que se mueve por tiempo, no por turnos. La
separación hace que cada sistema se pueda probar por separado. Sale de la tabla 10: 6
puzles y 4 huidas, cero salas mixtas.

**Tres contradicciones que solo aparecieron al auditar el prompt ya escrito.** La
primera era la salida de las salas de huida: la tabla de tiles decía que un `E` bloquea
mientras `solved === false`, y al mismo tiempo se decía que las salas de huida nunca
se resuelven. Juntas, las cuatro salas de huida tenían la salida convertida en muro.
La solución no es una excepción dispersa: es un booleano `exitLocked` que se calcula en
un solo sitio.

La segunda era el orden de los casos de la resolución de un paso: el escalón automático
se evaluaba antes que el empujón, y como una caja es sólida, el jugador se subía
encima de la caja en vez de empujarla en cualquier sala de tres capas. Una sala de dos
capas no lo sufría, que es la clase de bug que sobrevive hasta que alguien escribe la
sala difícil.

La tercera era la ruta de salida de la sala de ejemplo: el texto describía un camino
que empujaba la caja ya colocada y la metía en el hueco de la salida, dejando la sala
irresoluble de forma irreversible. Los datos de la sala eran válidos y la sala era
resoluble, y aun así no se podía terminar. Por eso la comprobación 13 del verificador
no es un extra: es la única que distingue "los datos cuadran" de "se puede terminar".

**La ranura `X` no es sólida.** La tabla 4 tiene dos columnas de bloqueo, y eso no es
capricho: `X` es el único tile asimétrico, un hueco del tamaño de una caja. La primera
versión lo trataba como sólido, y con esa regla ninguna caja podía entrar nunca en un
`X`, con lo que las salas 9 y 10 eran literalmente imposibles de resolver. La asimetría
está escrita de forma que un agente no la pueda reinterpretar por error.

**Tope de 5 cajas.** Un puzle de sokoban de 5 cajas es un rato de juego; uno de 12 es
trabajo. Fijar el tope en la especificación evita que la dificultad se suba sola, que es
lo que pasa cuando el nivel lo diseña quien no va a jugarlo.

**Sin deshacer no hay sokoban.** Empujar mal es el error más frecuente del género. Con
lógica de rejilla la pila de deshacer es lo más barato del proyecto, y sin ella el
puzle se vuelve hostil en los primeros cinco minutos.

**La cámara escribe oclusión, no colisión.** Una losa de 0.14 de grosor deja ver
dentro de la sala casi siempre. Un raycast de colisión de cámara, con su nearest point
y su retroceso, es un sistema entero con sus propios fallos. El desvanecido de lo que
tapa al jugador resuelve el mismo problema en veinte líneas, y de paso añade el pin de
posición, que es lo que hace legible un puzle 3D.

**El importmap mapea solo `three`.** Mapear `three/addons/` es inofensivo, pero deja
una puerta abierta a `OrbitControls`, que es el addon más tentador del ecosistema y el
que más fácilmente contradice la cámara propia. No mapearlo convierte la prohibición
en un error de resolución de módulo en vez de en una discusión.

**Nada de `PCFSoftShadowMap`.** En r186, la versión pineada aquí, pasó a estar obsoleta.
El detalle que importa y que no es evidente: la constante **sigue exportándose**, así que
el código compila sin quejarse, y lo que hace el renderer es interceptarla, avisar por
consola y degradarla a `PCFShadowMap`. Es el peor tipo de deprecación, la que parece
un bug propio. Fijar `PCFShadowMap` a mano, que además es el valor por defecto, lo
evita.

**Todo número en una tabla.** El prompt sustituye a la intuición por datos: cambiar la
sensación del juego es editar las filas de la tabla 3, no ir buscando `0.16` por todo
el código. Y con la tabla 4, la notación de niveles no admite interpretación, porque
el validador la impone.

## Ver también

* [Juegos 3D (MOC)](./_index.md)
* [Desarrollo de sistemas (MOC)](../_index.md)
* [Plantillas de proyecto](../plantillas-proyecto/_index.md)
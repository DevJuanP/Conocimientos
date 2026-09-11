---
title: Comando goto - saltos rápidos entre rutas favoritas
area: desarrollo
tags: [desarrollo, devops]
created: 2026-09-11
updated: 2026-09-11
related: ["./_index.md", "./comando-ship.md"]
---

# Comando `goto` - saltos rápidos entre rutas favoritas

Función de bash que muestra un menú numerado de rutas favoritas y hace `cd` a la
elegida. Nació para no teclear rutas largas en el celular (Termux + proot-distro
ubuntu), por ejemplo saltar al vault de Obsidian con un solo `goto`.

## Uso diario

```bash
goto              # menú interactivo, eliges número
goto --list       # ver rutas (alias: -l, list, ls)
goto obsidian     # salto directo por nombre
goto obsi         # vale prefijo único
goto 2            # salto por número de la lista
goto --help       # ayuda
```

Ejemplo real:

```text
$ goto --list
 1) obsidian     -> /sdcard/Repos/Conocimientos
 2) gatitos      -> /sdcard/Repos/gatitos
 3) demo         -> /root/demo
 4) repos        -> /sdcard/Repos

$ goto obsidian
$ pwd
/sdcard/Repos/Conocimientos
```

Hay autocompletado con `Tab` para nombres y flags.

## Dónde están guardadas las rutas

Archivo `~/.goto_bookmarks` (en este equipo: `/root/.goto_bookmarks` dentro del
contenedor ubuntu). Formato una entrada por línea, `nombre|ruta`:

```text
obsidian|/sdcard/Repos/Conocimientos
gatitos|/sdcard/Repos/gatitos
demo|/root/demo
repos|/sdcard/Repos
```

Reglas del formato:

* El nombre no puede tener `|` ni espacios. Usa `kebab-case` (`mi-proyecto`).
* Líneas vacías y las que empiezan con `#` se ignoran (sirven de comentarios).
* La ruta debe existir como directorio al momento de agregarla y de saltar.

La variable `GOTO_BOOKMARKS` permite cambiar la ubicación del archivo. Por defecto
apunta a `$HOME/.goto_bookmarks`.

## Cómo agregar más rutas

Tres vías, todas escriben en el mismo archivo:

### 1. Con subcomando (recomendado)

```bash
goto --add trabajo /sdcard/Repos/trabajo
goto --add notas /sdcard/Notas
```

Valida que el directorio exista, convierte rutas relativas a absolutas y rechaza
nombres duplicados. Para borrar:

```bash
goto --remove trabajo   # alias: --rm, --del, rm, remove
```

### 2. Editando el archivo a mano

```bash
goto --edit             # abre ~/.goto_bookmarks con nano (o $EDITOR)
```

O directo: `nano ~/.goto_bookmarks` y agrega una línea `nombre|ruta`.

### 3. Añadiendo a mano con echo

```bash
echo "fotos|/sdcard/DCIM" >> ~/.goto_bookmarks
```

Después verifica con `goto --list`.

## Cómo se creó

### Por qué tiene que ser función y no script

`cd` solo afecta al proceso que lo ejecuta. Un script o binario corre en un
proceso hijo y su `cd` se pierde al terminar. Por eso `goto` es una **función de
bash cargada en la shell**, no un programa con npm/node.

### Archivos creados

| Archivo | Qué es |
|---|---|
| `~/.bash_goto` | La función `goto()` + ayudantes `_goto_lookup`, `_goto_names` y autocompletado |
| `~/.goto_bookmarks` | Las 4 rutas iniciales (ver arriba) |
| `~/.bashrc` (al final) | Línea `[ -f ~/.bash_goto ] && source ~/.bash_goto` para cargarla en cada terminal |

### Comportamiento de la función

* Sin argumentos: lee el archivo a dos arreglos (`names`, `paths`), imprime el
  menú numerado, lee con `read -rp "#? "` y hace `cd` al elegido.
* Con nombre: busca coincidencia exacta primero (`_goto_lookup`); si no hay,
  acepta prefijo único (`goto obsi` → `obsidian`). Si el prefijo coincide con
  varios, avisa y lista candidatos en vez de adivinar.
* Con número: salta a la N-ésima entrada válida (ignora comentarios/vacías).
* Antes de cada `cd` verifica `[ -d "$dest" ]`; si la ruta se borró, avisa y no
  se mueve.
* `--add` exige 3 argumentos, valida directorio y duplicados. `--remove` filtra
  con `grep -v` a un `.tmp` y lo renombra.

### Dos bugs que se corrigieron al probar

1. **Ruta impresa pegada al `pwd`**: la primera versión llamaba a
   `_goto_lookup "$1"` solo para obtener su código de retorno, pero esa función
   imprime la ruta con `printf '%s'` (sin salto de línea) y ensuciaba la salida.
   Fix: `_goto_lookup "$1" >/dev/null` en la llamada de chequeo.
2. **Login anidado de proot-distro**: el `~/.bashrc` terminaba con
   `proot-distro login ubuntu --work-dir /sdcard/Repos` sin condición. Dentro del
   contenedor ubuntu eso intentaba entrar a ubuntu otra vez y `bash -i` fallaba.
   Fix: envolverlo en `if ! grep -qi '^NAME=.*Ubuntu' /etc/os-release`, así solo
   auto-entra desde el host Termux, no desde dentro de ubuntu.

### Verificación que se hizo

```bash
source ~/.bash_goto
goto --list
goto obsidian && pwd     # -> /sdcard/Repos/Conocimientos
goto 2 && pwd            # -> /sdcard/Repos/gatitos
printf "1\n" | (source ~/.bash_goto; cd /root/demo; goto; pwd)
goto --add tmp /tmp && goto tmp && pwd && goto --remove tmp
bash -i -c 'type goto; goto --list'   # carga limpia en shell nueva
```

### Reinstalación en otro equipo o celular

1. Copia el [código fuente](#código-fuente-completo) a `~/.bash_goto`.
2. Crea `~/.goto_bookmarks` con tus rutas (`nombre|ruta` por línea).
3. Agrega a `~/.bashrc`: `[ -f ~/.bash_goto ] && source ~/.bash_goto`.
4. Recarga: `source ~/.bashrc`, luego `goto --list`.

## Código fuente completo

Tal cual quedó en `~/.bash_goto` el 2026-09-11:

```bash
# ~/.bash_goto - comando `goto` para saltar entre rutas favoritas
# Archivo de rutas: ~/.goto_bookmarks con formato nombre|ruta por línea
# Se carga desde ~/.bashrc con: [ -f ~/.bash_goto ] && source ~/.bash_goto

export GOTO_BOOKMARKS="${GOTO_BOOKMARKS:-$HOME/.goto_bookmarks}"

_goto_names() {
    [ -f "$GOTO_BOOKMARKS" ] || return 0
    grep -v '^[[:space:]]*#' "$GOTO_BOOKMARKS" 2>/dev/null | grep -v '^[[:space:]]*$' | cut -d'|' -f1
}

_goto_lookup() {
    # $1 = nombre buscado, imprime la ruta o nada. Exacto primero, luego prefijo.
    local want="$1" line name path
    [ -f "$GOTO_BOOKMARKS" ] || return 1
    # 1. coincidencia exacta
    while IFS='|' read -r name path _rest; do
        case "$name" in ''|\#*) continue ;; esac
        # trim espacios
        name="$(echo "$name" | xargs)"; path="$(echo "$path" | xargs)"
        if [ "$name" = "$want" ]; then
            printf '%s' "$path"
            return 0
        fi
    done < "$GOTO_BOOKMARKS"
    # 2. prefijo (ej: goto obsi -> obsidian)
    local matches=0 found=""
    while IFS='|' read -r name path _rest; do
        case "$name" in ''|\#*) continue ;; esac
        name="$(echo "$name" | xargs)"; path="$(echo "$path" | xargs)"
        case "$name" in "$want"*) matches=$((matches+1)); found="$path";; esac
    done < "$GOTO_BOOKMARKS"
    if [ "$matches" -eq 1 ]; then
        printf '%s' "$found"
        return 0
    elif [ "$matches" -gt 1 ]; then
        return 2
    fi
    return 1
}

goto() {
    local bm="${GOTO_BOOKMARKS:-$HOME/.goto_bookmarks}"

    case "${1:-}" in
        -h|--help|help)
            cat <<'EOF'
Uso: goto [nombre|número] [opciones]

  goto                Muestra menú numerado y salta a la ruta elegida
  goto <nombre>       Salta directo (acepta prefijo único, ej: goto obsi)
  goto <número>       Salta a la entrada N de la lista
  goto --list, -l     Lista bookmarks
  goto --add <nombre> <ruta>   Agrega (crea) un bookmark
  goto --remove <nombre>, --rm <nombre>  Elimina un bookmark
  goto --edit         Abre ~/.goto_bookmarks con nano (o $EDITOR)
  goto --help, -h     Esta ayuda

Config: ~/.goto_bookmarks  formato:  nombre|ruta
EOF
            return 0
            ;;
        -l|--list|list|ls)
            if [ ! -f "$bm" ]; then echo "goto: no existe $bm (usa: goto --add <nombre> <ruta>)"; return 1; fi
            local i=0 name path
            while IFS='|' read -r name path _rest; do
                case "$name" in ''|\#*) continue ;; esac
                name="$(echo "$name" | xargs)"; path="$(echo "$path" | xargs)"
                [ -z "$name" ] && continue
                i=$((i+1))
                printf '%2d) %-12s -> %s\n' "$i" "$name" "$path"
            done < "$bm"
            [ "$i" -eq 0 ] && echo "goto: sin bookmarks en $bm"
            return 0
            ;;
        --add|-a|add)
            if [ $# -ne 3 ]; then echo "Uso: goto --add <nombre> <ruta>"; return 1; fi
            local name="$2" path="$3"
            case "$name" in *'|'*|*' '*) echo "goto: nombre no puede tener '|' ni espacios"; return 1;; esac
            if [ ! -d "$path" ]; then echo "goto: la ruta no existe: $path"; return 1; fi
            # a absoluta si es relativa
            case "$path" in /*) ;; *) path="$(cd "$path" 2>/dev/null && pwd || echo "$path")";; esac
            touch "$bm"
            if grep -q "^${name}|" "$bm" 2>/dev/null; then echo "goto: '$name' ya existe (usa --remove primero)"; return 1; fi
            echo "${name}|${path}" >> "$bm"
            echo "goto: agregado '$name' -> $path"
            return 0
            ;;
        --remove|--rm|--del|rm|remove)
            if [ $# -ne 2 ]; then echo "Uso: goto --remove <nombre>"; return 1; fi
            if ! grep -q "^$2|" "$bm" 2>/dev/null; then echo "goto: no existe '$2'"; return 1; fi
            grep -v "^$2|" "$bm" > "${bm}.tmp" && mv "${bm}.tmp" "$bm"
            echo "goto: eliminado '$2'"
            return 0
            ;;
        --edit|edit)
            "${EDITOR:-nano}" "$bm"
            return 0
            ;;
        --*|help)
            echo "goto: opción desconocida '$1' (usa: goto --help)"; return 1
            ;;
    esac

    if [ ! -f "$bm" ]; then echo "goto: no existe $bm (usa: goto --add <nombre> <ruta>)"; return 1; fi

    # Con argumento: número o nombre -> salto directo
    if [ $# -ge 1 ]; then
        local dest=""
        # ¿es número? salta a la N-ésima entrada válida
        if [[ "$1" =~ ^[0-9]+$ ]]; then
            dest="$(awk -F'|' '!/^[[:space:]]*(#|$)/{n++; if(n=='"$1"') print $2}' "$bm" | xargs)"
            if [ -z "$dest" ]; then echo "goto: número fuera de rango (usa: goto --list)"; return 1; fi
        else
            _goto_lookup "$1" >/dev/null
            local rc=$?
            if [ $rc -eq 2 ]; then
                echo "goto: '$1' es ambiguo, coincide con varios:"
                grep "^$1" "$bm" | sed 's/^/  /'
                return 1
            elif [ $rc -ne 0 ]; then
                echo "goto: no existe '$1' (usa: goto --list)"
                return 1
            fi
            dest="$(_goto_lookup "$1")"
        fi
        # trim
        dest="$(echo "$dest" | xargs)"
        if [ ! -d "$dest" ]; then echo "goto: la ruta ya no existe: $dest"; return 1; fi
        cd "$dest" || return 1
        return 0
    fi

    # Sin argumento: menú interactivo
    local names=() paths=() name path
    while IFS='|' read -r name path _rest; do
        case "$name" in ''|\#*) continue ;; esac
        name="$(echo "$name" | xargs)"; path="$(echo "$path" | xargs)"
        [ -z "$name" ] && continue
        names+=("$name"); paths+=("$path")
    done < "$bm"

    if [ "${#names[@]}" -eq 0 ]; then echo "goto: sin bookmarks en $bm"; return 1; fi

    echo "Elige destino:"
    local i
    for i in "${!names[@]}"; do
        printf '  %2d) %-12s -> %s\n' "$((i+1))" "${names[$i]}" "${paths[$i]}"
    done

    local choice
    read -rp "#? " choice
    [[ "$choice" =~ ^[0-9]+$ ]] || { echo "goto: cancelado"; return 1; }
    if [ "$choice" -lt 1 ] || [ "$choice" -gt "${#names[@]}" ]; then echo "goto: número fuera de rango"; return 1; fi
    local dest="${paths[$((choice-1))]}"
    if [ ! -d "$dest" ]; then echo "goto: la ruta ya no existe: $dest"; return 1; fi
    cd "$dest" || return 1
}

# Autocompletado: nombres + flags
_goto_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local opts="--list --add --remove --edit --help -l -h"
    local names
    names="$(_goto_names 2>/dev/null | tr '\n' ' ')"
    COMPREPLY=($(compgen -W "$opts $names" -- "$cur"))
}
complete -F _goto_completion goto 2>/dev/null || true
```

Y el enganche al final de `~/.bashrc`:

```bash
# goto - saltos rápidos entre rutas favoritas
[ -f ~/.bash_goto ] && source ~/.bash_goto

# Solo auto-entrar a ubuntu si NO ya estamos dentro de ubuntu
# (evita login anidado cuando este .bashrc es el del contenedor)
if ! grep -qi '^NAME=.*Ubuntu' /etc/os-release 2>/dev/null; then
  proot-distro login ubuntu --work-dir /sdcard/Repos
fi
```

## Ver también

* [DevOps (MOC)](_index.md)
* [Comando `/ship` de OpenCode - referencia completa](comando-ship.md)

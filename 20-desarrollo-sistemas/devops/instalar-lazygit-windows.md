---
title: Instalar lazygit en Windows (Git Bash, sin instalador)
area: desarrollo
tags: [desarrollo, devops]
created: 2026-10-23
updated: 2026-10-23
related: ["./_index.md", "./ramas-git-trabajo-colaborativo.md", "./automatizar-git-add-commit-push.md"]
---

# Instalar lazygit en Windows (Git Bash, sin instalador)

Lazygit es una interfaz de terminal para Git: staging por archivo o por línea,
commits, ramas, rebase interactivo y resolución de conflictos sin escribir comandos.
En Windows se instala como **un único `.exe`**: no hay instalador ni dependencias,
solo descargar el zip oficial y dejarlo en el `PATH`.

Pasos verificados en este equipo el 2026-10-23 (Windows, Git Bash).

## Versión y descarga

* Última versión al momento de escribir: **v0.66.2** (publicada 2026-10-16).
* Asset para este equipo: `lazygit_0.66.2_windows_x86_64.zip` (~7,5 MB).
* SHA-256 oficial del zip: `8b1e2194c2d8ac660f0a132cb4384e9d2fe1405217a144e280df16383c18d45c`
  (coincide con el digest que publica la API de GitHub).

Requisitos previos, todos ya presentes en una instalación normal de Git para Windows:
arquitectura `x86_64`, `curl`, `unzip` y `HOME` apuntando a `C:\Users\<usuario>`.

La doc oficial llama a este método **"Binary Releases"** y es el recomendado para
Windows: no requiere Go ni ningún gestor de paquetes.

## Pasos

### 1. Abrir Git Bash

Buscar "Git Bash" en el menú inicio. Debe salir un prompt tipo
`usuario@MAQUINA MINGW64 ~`.

### 2. Descargar y descomprimir

Pegar entero en la terminal:

```bash
mkdir -p ~/bin && curl -Lo /tmp/lg.zip https://github.com/jesseduffield/lazygit/releases/download/v0.66.2/lazygit_0.66.2_windows_x86_64.zip && unzip -o /tmp/lg.zip -d ~/bin
```

Qué hace cada parte:

* `mkdir -p ~/bin` → crea `C:\Users\juan2\bin` si no existe.
* `curl -Lo /tmp/lg.zip ...` → descarga el zip oficial.
* `unzip -o ... -d ~/bin` → extrae `lazygit.exe` dentro de esa carpeta.

Debe terminar mostrando algo como `inflating: /c/Users/juan2/bin/lazygit.exe`.

### 3. Comprobar el archivo

```bash
ls -l ~/bin
```

Debe aparecer `lazygit.exe`. Verificación opcional de la descarga:

```bash
sha256sum ~/bin/lazygit.exe
```

### 4. Añadir la carpeta al PATH

```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
```

Añade una línea al final de `~/.bashrc`, **sin borrar nada** de lo que ya hay ahí.
En este equipo `~/.bash_profile` ya hace `source ~/.bashrc`, así que la línea se
carga sola al abrir Git Bash.

### 5. Recargar la shell

Cerrar y volver a abrir Git Bash, o en la misma ventana:

```bash
source ~/.bashrc
```

Bash lee el `PATH` al arrancar; sin recargar, el comando sigue sin existir.

### 6. Verificar

```bash
lazygit --version
```

Salida esperada: `commit=..., build date=..., version=0.66.2`.
Si dice `command not found`, revisar que el paso 4 quedó aplicado:

```bash
tail -3 ~/.bashrc
```

## Uso

```bash
cd "/d/Cibertec/6to ciclo/DAW II/final/docs/Aplicacion-Web-Hotel-2"
lazygit
```

* `q` → salir.
* `?` → atajos del panel actual.
* Los paneles se navegan con flechas o `1`–`5`; `space` hace stage/checkout de lo
  seleccionado y `c` abre el commit.

## Por qué funciona así

Un `.exe` suelto en `~/bin` funciona porque Git Bash usa el formato POSIX
(`/c/Users/...`), pero el binario es nativo de Windows: no necesita Wine ni
traducción. El zip de release trae solo el ejecutable (y la licencia), sin DLLs
externas, por eso "descomprimir y añadir al PATH" es la instalación completa.

## Repetir en otro equipo

1. Comprobar arquitectura (`x86_64`, `arm64` o `32-bit`) y elegir el asset correcto.
2. Repetir los pasos 2 a 5 (`~/bin` + línea en `~/.bashrc`).
3. Verificar con `lazygit --version`.

Para actualizar más adelante, basta con repetir el paso 2: `unzip -o` sobrescribe el
`.exe` anterior y el `PATH` ya está configurado.

## Ver también

* [DevOps (MOC)](_index.md)
* [Ramas Git en trabajo colaborativo](ramas-git-trabajo-colaborativo.md)
* [Automatizar git add, commit y push en una acción](automatizar-git-add-commit-push.md)

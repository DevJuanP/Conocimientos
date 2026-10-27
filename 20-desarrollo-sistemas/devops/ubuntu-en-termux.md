---
title: Ubuntu en Termux - entrar y salir del contenedor
area: desarrollo
tags: [desarrollo, devops]
created: 2026-10-27
updated: 2026-10-27
related: ["./_index.md", "./actualizar-node-lts-windows-winget.md"]
---

# Ubuntu en Termux - entrar y salir del contenedor

En el celular, dentro de Termux, se puede tener una Ubuntu completa (sin root) para
correr Node y OpenCode. `exit` **no borra nada**: solo cierra la sesión del contenedor
y devuelve al prompt de Termux. Para volver a entrar se usa el comando con el que se
instaló.

## Si se instaló con proot-distro

Es el método recomendado hoy (`pkg install proot-distro`).

```bash
proot-distro login ubuntu
```

Alias corto, equivalente:

```bash
pd sh ubuntu
```

Otras variantes útiles de los mismos comandos:

```bash
proot-distro list          # contenedores instalados (alias: pd ls)
proot-distro login ubuntu -- /bin/ls /etc   # ejecutar una orden y salir
proot-distro ps            # sesiones activas
proot-distro kill ubuntu   # cerrar todas las sesiones de ese contenedor
```

## Si se instaló con el script ubuntu-in-termux

Es el método antiguo (clona un repo y arranca con un script). El script de arranque se
llama `startubuntu.sh`:

```bash
cd ~/ubuntu-in-termux
./startubuntu.sh
```

Si no recuerdas por dónde entraste: `proot-distro list` dice si existe un contenedor
gestionado por proot-distro. Si no aparece ninguno, es el método del script.

## Qué pasa al salir con exit

* **El sistema de archivos se conserva.** Paquetes instalados, `~/.bashrc`, proyectos,
  `node_modules`, la configuración de OpenCode: todo sigue ahí en el próximo login.
* **Los procesos mueren.** Cualquier cosa que estuviera corriendo dentro (un servidor
  de desarrollo, `opencode`, un `npm run dev`) se detiene al cerrar la sesión. Hay que
  volver a lanzarla al reentrar.
* **`exit` no es `reset`.** `proot-distro reset ubuntu` reinstala el contenedor desde
  cero y sí pierde todo. `proot-distro remove ubuntu` además lo borra.

## Comprobar que Node y OpenCode siguen instalados

Ya dentro de Ubuntu:

```bash
node --version
opencode --version
```

Si responden, la instalación sobrevivió al `exit`. Si no, se perdió el `PATH` de esa
shell: revisar `~/.bashrc` (por ejemplo la línea que agrega `~/.local/bin` o el
`nvm`), no reinstalar.

## Ver también

* [DevOps (MOC)](_index.md)
* [Actualizar Node.js LTS en Windows con winget](actualizar-node-lts-windows-winget.md)

## Fuentes

* [termux/proot-distro — README (login, list, ps, kill, reset)](https://github.com/termux/proot-distro) — consultado: 2026-10-27
* [MFDGaming/ubuntu-in-termux — pasos de instalación y startubuntu.sh](https://github.com/MFDGaming/ubuntu-in-termux) — consultado: 2026-10-27

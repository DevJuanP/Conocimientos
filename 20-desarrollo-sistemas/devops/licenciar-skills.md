---
title: Licenciar skills de agente
area: desarrollo
tags: [desarrollo, devops]
created: 2026-09-07
updated: 2026-09-07
related: ["./publicar-skills.md", "./_index.md"]
---

# Licenciar skills de agente

Cómo lograr que todo el mundo pueda usar tus skills y que tú sigas siendo reconocido como autor y propietario.

## Idea clave

Eres propietario por defecto al crear la obra (Convenio de Berna). Publicar no cede la propiedad: solo otorgas un permiso de uso mediante una **licencia**. Sin archivo de licencia, nadie puede usar tu skill con seguridad jurídica.

## La licencia no se solicita

No hay trámite ni oficina obligatoria. Es solo un archivo de texto `LICENSE` en la raíz del repo. Al incluirlo, el permiso ya vale. El registro oficial es opcional y solo sirve como prueba extra de autoría y fecha en un juicio.

## Registro oficial (opcional, con costo)

Sí, registrar cuesta en ambos países. El derecho nace al crear la obra (en Perú: D. Leg. 822, art. 170, registro declarativo); el registro solo genera presunción de titularidad.

**Perú (INDECOPI, Dirección de Derecho de Autor):**

* Una skill de texto/instrucciones calza como **obra literaria**: S/ 90.10 por la plataforma virtual SEL, S/ 238.10 presencial (código 203000704 / 203000703).
* Si tu skill incluye software como tal: **registro de software** S/ 357.70 por SEL (código 203000707).
* Se paga en el Banco de la Nación vía págalo.pe, trámite en la plataforma SEL con casilla electrónica. Plazo máximo: 120 días hábiles.
* Fuente y trámite: [Registrar una obra en el Indecopi](https://www.gob.pe/83358-registrar-una-obra-en-el-indecopi). Verifica el TUPA vigente antes de pagar, las tasas se actualizan.

**EE.UU. (U.S. Copyright Office):**

* Registro electrónico: **$45** (Single, un solo autor y una obra) o **$65** (Standard). En papel: **$125**.
* Ojo: la oficina propuso subir tasas en 2026 (Standard a $85), aún en proceso; confirma en [copyright.gov/about/fees](https://www.copyright.gov/about/fees.html).
* Solo compensa si vas a litigar en EE.UU.: allá el registro es requisito para demandar.

**Recomendación práctica:** para skills, no registres cada una; quédate con commits firmados + tags + releases (gratis) y registra solo si una skill genera ingresos o disputa real.

## MIT vs Apache-2.0

| Criterio                              | MIT                             | Apache-2.0                  |
| ------------------------------------- | ------------------------------- | --------------------------- |
| Uso por cualquiera, incluso comercial | Sí                              | Sí                          |
| Exige mantener tu nombre              | Sí                              | Sí                          |
| Obliga a avisar qué se cambió         | No                              | Sí                          |
| Protección de patentes                | No                              | Sí                          |
| Longitud                              | ~20 líneas                      | ~200 líneas                 |
| Uso típico                            | Skills, npm, proyectos pequeños | Proyectos grandes, empresas |

**Recomendación:** MIT para skills. Es la más usada en `skills.sh`, npm y GitHub para cosas pequeñas: corta, permisiva y solo exige conservar tu nombre.

## Dónde declarar autoría (4 lugares)

1. **`LICENSE`** en la raíz con tu nombre y año.
2. **`SKILL.md`**: campo `license` + `metadata.author` + pie con copyright y URL canónica.
3. **`package.json`** (si publicas a npm): campos `author`, `repository` y `license`.
4. **`README.md`**: autor visible arriba + comando canónico `npx skills add TU-USUARIO/mi-skill`.

Ejemplo de frontmatter con autoría:

```markdown
---
name: mi-skill
description: Qué hace Y cuándo usarlo. Ej: Genera changelogs desde PRs. Usa cuando...
license: MIT
metadata:
  author: TU-USUARIO
  repository: https://github.com/TU-USUARIO/mi-skill
  version: 0.1.0
---
```

Y al final del cuerpo del `SKILL.md`:

```text
© 2026 TU-USUARIO. Licencia MIT. Repo canónico: https://github.com/TU-USUARIO/mi-skill.
```

## Prueba de autoría (contra copias)

En una disputa gana quien prueba fecha. Checklist:

* Commits y releases públicos con fecha (`gh skill publish --tag v0.1.0`).
* Commits firmados (GPG o SSH signing en GitHub).
* Publicación a npm con provenance: `npm publish --provenance --access public`.
* Conservar borradores fechados (los commits de tu repo de conocimientos valen como antecedente).

## Si alguien te copia sin crédito

1. Contacto privado con evidencia (tu commit anterior al suyo).
2. Reporte en la plataforma: DMCA takedown en GitHub, reporte en skills.sh / ClawHub.
3. Solo si hay dinero de por medio: registro oficial + abogado. Casi todo se resuelve en el paso 2.

## Ejemplo completo de licencia MIT

Archivo `LICENSE` tal cual va en el repo. Solo cambia la línea de `Copyright`:

```text
MIT License

Copyright (c) 2026 TU-USUARIO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Ver también

* [Publicar skills de agente](publicar-skills.md)
* [DevOps (MOC)](_index.md)

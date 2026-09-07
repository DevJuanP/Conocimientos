"""Valida enlaces relativos y frontmatter de las notas Markdown.

Uso:
    python tools/check-links.py
    python tools/check-links.py --root .
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
LINK_RE = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)]+)\)")
FENCED_CODE_RE = re.compile(r"```.*?```", re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
REQUIRED_FIELDS = ["title", "area", "tags", "created", "updated"]
SKIP_FILES = {"README.md"}
# Las plantillas contienen enlaces placeholder a propósito; no se validan.
SKIP_DIRS = {"99-inbox"}
SKIP_LINK_CHECK_DIRS = {"00-meta/plantillas"}
VALID_AREAS = {"instituto", "desarrollo", "electronica", "ciencias", "cursos-extras", "meta"}


def parse_frontmatter(text: str) -> dict | None:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    data: dict = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip()
    return data


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Raíz del repo de conocimientos")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    md_files = [p for p in root.rglob("*.md") if ".git" not in p.parts and "site" not in p.parts]
    errors: list[str] = []

    for path in sorted(md_files):
        rel = path.relative_to(root)
        text = path.read_text(encoding="utf-8")

        # 1. Frontmatter (salvo README, _index e inbox sin procesar)
        if path.name not in SKIP_FILES and path.name != "_index.md" and not any(d in path.parts for d in SKIP_DIRS):
            fm = parse_frontmatter(text)
            if fm is None:
                errors.append(f"{rel}: falta frontmatter --- ... ---")
            else:
                for field in REQUIRED_FIELDS:
                    if field not in fm or not fm[field]:
                        errors.append(f"{rel}: falta campo '{field}' en frontmatter")
                if "area" in fm and fm["area"] not in VALID_AREAS:
                    errors.append(f"{rel}: area inválida '{fm['area']}' (usa {sorted(VALID_AREAS)})")

        # 2. Enlaces relativos (ignora bloques/código inline y plantillas con placeholders)
        if any(str(rel).replace("\\", "/").startswith(d) for d in SKIP_LINK_CHECK_DIRS):
            continue
        prose = FENCED_CODE_RE.sub("", text)
        prose = INLINE_CODE_RE.sub("", prose)
        for _, target in LINK_RE.findall(prose):
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            target_path = target.split("#")[0].strip()
            if not target_path:
                continue
            resolved = (path.parent / target_path).resolve()
            try:
                resolved.relative_to(root)
            except ValueError:
                errors.append(f"{rel}: enlace fuera del repo -> {target}")
                continue
            if not resolved.exists():
                errors.append(f"{rel}: enlace roto -> {target}")

    if errors:
        print(f"FAIL: {len(errors)} problema(s) en {len(md_files)} archivos:\n")
        for e in errors:
            print(f"  - {e}")
        return 1

    print(f"OK: {len(md_files)} archivos, 0 enlaces rotos, frontmatter válido.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

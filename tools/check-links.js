#!/usr/bin/env node
/**
 * Valida enlaces relativos y frontmatter de las notas Markdown.
 *
 * Uso:
 *   node tools/check-links.js
 *   node tools/check-links.js --root .
 *
 * Sin dependencias. Requiere Node >= 18.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n/;
const LINK_RE = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
const FENCED_CODE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const REQUIRED_FIELDS = ['title', 'area', 'tags', 'created', 'updated'];
const SKIP_FILES = new Set(['README.md', 'AGENTS.md']);
const SKIP_DIRS = new Set(['99-inbox']); // frontmatter no exigible (borradores)
// Las plantillas contienen enlaces placeholder a propósito; no se validan.
const SKIP_LINK_CHECK_PREFIXES = ['00-meta/plantillas'];
const VALID_AREAS = new Set(['instituto', 'desarrollo', 'electronica', 'ciencias', 'cursos-extras', 'meta']);

function parseArgs() {
  const args = process.argv.slice(2);
  let root = '.';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && args[i + 1]) {
      root = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Uso: node tools/check-links.js [--root .]');
      process.exit(0);
    }
  }
  return { root: path.resolve(root) };
}

/** Lista recursiva de *.md excluyendo .git, site y carpetas de config (.\*). */
function collectMdFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'site' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMdFiles(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function parseFrontmatter(text) {
  const m = FRONTMATTER_RE.exec(text);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i <= 0) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return data;
}

function main() {
  const { root } = parseArgs();
  const mdFiles = collectMdFiles(root).sort();
  const errors = [];

  for (const file of mdFiles) {
    const rel = path.relative(root, file);
    const relPosix = rel.split(path.sep).join('/');
    const parts = rel.split(path.sep);
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'); // normaliza CRLF (Windows)
    const base = path.basename(file);

    // 1. Frontmatter (salvo README, _index e inbox sin procesar)
    const needsFrontmatter =
      !SKIP_FILES.has(base) && base !== '_index.md' && !parts.some((p) => SKIP_DIRS.has(p));
    if (needsFrontmatter) {
      const fm = parseFrontmatter(text);
      if (!fm) {
        errors.push(`${rel}: falta frontmatter --- ... ---`);
      } else {
        for (const field of REQUIRED_FIELDS) {
          if (!fm[field]) errors.push(`${rel}: falta campo '${field}' en frontmatter`);
        }
        if (fm.area && !VALID_AREAS.has(fm.area)) {
          errors.push(`${rel}: area inválida '${fm.area}' (usa ${[...VALID_AREAS].sort().join(', ')})`);
        }
      }
    }

    // 2. Enlaces relativos (ignora bloques/código inline y plantillas con placeholders)
    if (SKIP_LINK_CHECK_PREFIXES.some((prefix) => relPosix.startsWith(prefix))) continue;
    const prose = text.replace(FENCED_CODE_RE, '').replace(INLINE_CODE_RE, '');
    for (const match of prose.matchAll(LINK_RE)) {
      const target = match[2];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const targetPath = target.split('#')[0].trim();
      if (!targetPath) continue;
      const resolved = path.resolve(path.dirname(file), targetPath);
      const outside = path.relative(root, resolved).split(path.sep)[0] === '..';
      if (outside) {
        errors.push(`${rel}: enlace fuera del repo -> ${target}`);
        continue;
      }
      if (!fs.existsSync(resolved)) {
        errors.push(`${rel}: enlace roto -> ${target}`);
      }
    }
  }

  if (errors.length > 0) {
    console.log(`FAIL: ${errors.length} problema(s) en ${mdFiles.length} archivos:\n`);
    for (const e of errors) console.log(`  - ${e}`);
    process.exit(1);
  }

  console.log(`OK: ${mdFiles.length} archivos, 0 enlaces rotos, frontmatter válido.`);
}

main();

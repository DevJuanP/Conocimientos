#!/usr/bin/env node
/**
 * Valida las URLs citadas dentro de las secciones `## Fuentes` de las notas.
 *
 * Uso:
 *   node tools/check-sources.js
 *   node tools/check-sources.js --root .
 *
 * Sin dependencias. Requiere Node >= 18 (fetch nativo).
 *
 * Criterios:
 *   - 2xx / 3xx           -> OK
 *   - 403 / 405 / 429     -> aviso "no verificable" (no falla la validación)
 *   - 404 / 410 / red     -> error
 *   - Sección vacía       -> error
 */
'use strict';

const fs = require('fs');
const path = require('path');

const LINK_RE = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
const FENCED_CODE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const SOURCES_HEADING_RE = /^##\s+Fuentes\s*$/im;
const NEXT_HEADING_RE = /^##\s+/m;
const SKIP_DIRS = new Set(['99-inbox', 'site']);
const TIMEOUT_MS = 10000;
// 403/405/429: el servidor respondió, pero bloquea peticiones de máquina.
const UNVERIFIABLE_STATUS = new Set([403, 405, 429]);

function parseArgs() {
  const args = process.argv.slice(2);
  let root = '.';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && args[i + 1]) {
      root = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Uso: node tools/check-sources.js [--root .]');
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

/** Devuelve el contenido de la sección `## Fuentes` o null si no existe. */
function extractSourcesSection(text) {
  const heading = SOURCES_HEADING_RE.exec(text);
  if (!heading) return null;
  const rest = text.slice(heading.index + heading[0].length);
  const next = NEXT_HEADING_RE.exec(rest);
  return next ? rest.slice(0, next.index) : rest;
}

/** Extrae URLs http(s) de un bloque de texto. */
function extractUrls(section) {
  const urls = [];
  for (const match of section.matchAll(LINK_RE)) {
    const raw = match[2].trim();
    if (!/^https?:\/\//i.test(raw)) continue;
    const url = raw.replace(/\s+".*"$/, ''); // descarta título opcional: (url "titulo")
    if (!urls.includes(url)) urls.push(url);
  }
  return urls;
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'conocimientos-check-sources/1.0',
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      },
    });
    if (res.ok || (res.status >= 300 && res.status < 400)) return { status: 'ok', code: res.status };
    if (UNVERIFIABLE_STATUS.has(res.status)) return { status: 'warn', code: res.status };
    return { status: 'error', code: res.status };
  } catch (err) {
    const timedOut = controller.signal.aborted;
    return { status: 'error', kind: timedOut ? 'timeout' : (err.cause && err.cause.code) || err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const { root } = parseArgs();
  const mdFiles = collectMdFiles(root).sort();
  const errors = [];
  const warnings = [];
  const pending = [];

  for (const file of mdFiles) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    const parts = path.relative(root, file).split(path.sep);
    if (parts.some((p) => SKIP_DIRS.has(p))) continue;

    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    // Ignora bloques de código: ahí suele haber ejemplos con URLs placeholder.
    const prose = text.replace(FENCED_CODE_RE, '').replace(INLINE_CODE_RE, '');
    const section = extractSourcesSection(prose);
    if (section === null) continue; // nota sin fuentes citadas: válido

    const urls = extractUrls(section);
    if (urls.length === 0) {
      errors.push(`${rel}: sección '## Fuentes' vacía (sin enlaces http(s))`);
      continue;
    }
    for (const url of urls) pending.push({ rel, url });
  }

  const results = await Promise.all(pending.map((item) => checkUrl(item.url)));

  results.forEach((result, i) => {
    const { rel, url } = pending[i];
    if (result.status === 'ok') return;
    if (result.status === 'warn') {
      warnings.push(`${rel}: no verificable (HTTP ${result.code}) -> ${url}`);
      return;
    }
    const detail = result.code ? `HTTP ${result.code}` : result.kind;
    errors.push(`${rel}: enlace muerto (${detail}) -> ${url}`);
  });

  for (const w of warnings) console.log(`  aviso: ${w}`);

  if (errors.length > 0) {
    console.log(`FAIL: ${errors.length} problema(s) en ${pending.length} URL(s) revisada(s):\n`);
    for (const e of errors) console.log(`  - ${e}`);
    // process.exit() tras fetch aborta libuv en Windows (Node 24): se usa exitCode.
    process.exitCode = 1;
    return;
  }

  const suffix = warnings.length > 0 ? `, ${warnings.length} no verificable(s)` : '';
  console.log(`OK: ${mdFiles.length} archivos, ${pending.length} URL(s) de fuentes válidas${suffix}.`);
}

main();

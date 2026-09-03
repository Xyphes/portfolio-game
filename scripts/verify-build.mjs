import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('..', import.meta.url)
const dist = new URL('dist/', root)
const assets = new URL('assets/', dist)
const assetsPath = fileURLToPath(assets)

const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', dist), 'utf8'))
assert(manifest.id === '/', 'manifest id must be /')
assert(manifest.scope === '/', 'manifest scope must be /')
assert(manifest.display === 'standalone', 'manifest must use standalone display')
assert(manifest.lang === 'fr', 'manifest default language must be fr')

const worker = await readFile(new URL('sw.js', dist), 'utf8')
for (const requiredEntry of [
  'index.html',
  'CV-Somkhit-Willy-2026-FR-ENG.pdf',
  'Lettre-recommandation-Julien-Mullet-FR-EN.pdf',
  'adventure-engine',
  'adventure-art',
]) {
  assert(worker.includes(requiredEntry), `service worker is missing ${requiredEntry}`)
}

const precacheStart = worker.indexOf('precacheAndRoute([')
const precacheEnd = worker.indexOf('],{})', precacheStart)
assert(precacheStart >= 0 && precacheEnd > precacheStart, 'precache manifest was not found')
const precacheManifest = worker.slice(precacheStart, precacheEnd)
assert(!precacheManifest.includes('phaser.esm'), 'Phaser must not be part of the initial precache')
assert(!precacheManifest.includes('assets/adventure/'), 'adventure art must not be part of the initial precache')

const assetNames = await readdir(assets)
const initialBundle = singleMatch(assetNames, /^index-.*\.js$/, 'initial application bundle')
const classicBundle = singleMatch(assetNames, /^ClassicPage-.*\.js$/, 'classic route bundle')
const adventureBundle = singleMatch(assetNames, /^AdventurePage-.*\.js$/, 'adventure route bundle')
const phaserBundle = singleMatch(assetNames, /^phaser\.esm-.*\.js$/, 'Phaser bundle')
const initialBytes = (await stat(join(assetsPath, initialBundle))).size

assert(initialBytes < 300 * 1024, 'initial application bundle exceeds the 300 KiB release budget')
assert(!(await readFile(join(assetsPath, classicBundle), 'utf8')).includes('phaser.esm'), 'classic route references Phaser')

console.log(JSON.stringify({
  manifest: 'valid',
  serviceWorker: 'valid',
  initialBundleKiB: Math.round(initialBytes / 1024),
  routeBundles: [classicBundle, adventureBundle],
  deferredEngine: phaserBundle,
}, null, 2))

function singleMatch(files, pattern, label) {
  const matches = files.filter((file) => pattern.test(file))
  assert(matches.length === 1, `expected one ${label}, found ${matches.length}`)
  return matches[0]
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { parseCSV, parseCMS, cmsItems, cmsItem, CMS_URL } from '../../src/cms/parseCMS.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const read = name => fs.readFileSync(path.join(dir, name), 'utf8')
const json = name => JSON.parse(read(name))
const columns = ['tipo', 'id', 'campo', 'valor', 'mostrar', 'orden', 'ayuda']
const key = row => row.slice(0, 3).join(' + ')
function index(rows) {
  assert.deepEqual(rows[0], columns)
  const map = new Map()
  rows.slice(1).forEach((row, i) => {
    assert.equal(row.length, 7)
    assert.ok(!map.has(key(row)), `Duplicate ${key(row)}`)
    map.set(key(row), { row, number: i + 2 })
  })
  return map
}
const http = json('http-evidence.json')
const sources = {}
for (const name of ['qa', 'original']) {
  const csv = read(`${name}-published.csv`)
  const rows = parseCSV(csv)
  const native = json(`${name}-native.json`)
  assert.deepEqual(rows, native.values, `${name}: live native and published data differ`)
  assert.equal(http.sources[name].status, 200)
  assert.match(http.sources[name].contentType, /^text\/csv/)
  assert.equal(crypto.createHash('sha256').update(csv).digest('hex'), http.sources[name].sha256)
  const cms = parseCMS(csv)
  assert.equal(cms.status, 'ready')
  assert.deepEqual(cms.issues, [])
  const services = cmsItems(cms, 'servicio').filter(x => x.visible_en_servicios?.toLocaleUpperCase('es') !== 'NO').map(x => x.id)
  const prices = cmsItems(cms, 'precio').map(x => ({ id: x.id, featured: x.destacada, price: x.precio || cms.config[`precio_${x.id}`] }))
  assert.deepEqual(services, ['cremacion', 'traslado', 'flores', 'cementerios', 'personalizada'])
  assert.deepEqual(prices.map(x => x.id), ['cremacion', 'traslado'])
  assert.deepEqual(prices.filter(x => x.featured === 'SI').map(x => x.id), ['cremacion'])
  assert.equal(prices[0].price, '$580.000')
  sources[name] = { rows, map: index(rows), summary: { records: rows.length - 1, issues: cms.issues, services, prices, hero: cmsItem(cms, 'seccion', 'hero') } }
}
assert.equal(CMS_URL, http.sources.qa.url, 'CMS source was changed')
const differences = []
for (const [k, entry] of sources.original.map) {
  const approved = sources.qa.map.get(k)
  if (!approved) { differences.push({ key: k, kind: 'only_original', row: entry.number }); continue }
  for (let i = 3; i < 7; i++) if (entry.row[i] !== approved.row[i]) differences.push({ key: k, cell: `WEB_CMS!${String.fromCharCode(65 + i)}${entry.number}`, column: columns[i], current: entry.row[i], approved: approved.row[i] })
}
for (const [k, entry] of sources.qa.map) if (!sources.original.map.has(k)) differences.push({ key: k, kind: 'only_qa', row: entry.number })
assert.deepEqual(differences, [], 'Unplanned differences: stop, do not build an update')
assert.deepEqual(sources.original.summary.hero, sources.qa.summary.hero)
const critical = []
for (const [k, entry] of sources.original.map) {
  const [type, id, field] = entry.row
  const selected = (type === 'config' && field === 'precio_cremacion') ||
    (type === 'seccion' && id === 'hero') ||
    (type === 'servicio' && id === 'velatorio') ||
    (type === 'servicio' && field === 'visible_en_servicios') || type === 'precio'
  if (!selected) continue
  for (const i of [3, 4]) critical.push({ key: k, cell: `WEB_CMS!${String.fromCharCode(65 + i)}${entry.number}`, column: columns[i], current: entry.row[i], approved: sources.qa.map.get(k).row[i], action: 'NO_CHANGE' })
}
const result = { dataStatus: 'PASS', overallStatus: http.sources.legacy.status === 401 ? 'BLOCKED_LEGACY_ENDPOINT' : 'REVIEW_LEGACY_ENDPOINT', reason: 'Legacy endpoint from main is not the WEB_CMS endpoint; no writes or CMS URL changes are authorized.', checkpoint: 'e8ec30b899ed5d18e8a396e05b6c12623a22d1f4', matchedKeys: sources.original.map.size, differences, requiredCellUpdates: [], qa: sources.qa.summary, original: sources.original.summary, criticalCells: critical }
fs.writeFileSync(path.join(dir, 'comparison.json'), JSON.stringify(result, null, 2) + '\n')
const escape = value => JSON.stringify(value).replaceAll('|', '\\|')
fs.writeFileSync(path.join(dir, 'cell-table.md'), '# Exact cell table (snapshot)\n\nRequired updates: 0. All listed cells are NO_CHANGE. JSON strings retain whitespace/newlines.\n\n| Key tipo + id + campo | Cell | Column | Current | Approved | Action |\n| --- | --- | --- | --- | --- | --- |\n' + critical.map(x => `| ${x.key} | ${x.cell} | ${x.column} | ${escape(x.current)} | ${escape(x.approved)} | ${x.action} |`).join('\n') + '\n')
console.log(JSON.stringify({ dataStatus: result.dataStatus, overallStatus: result.overallStatus, matchedKeys: result.matchedKeys, differences: differences.length, requiredCellUpdates: 0, criticalCells: critical.length, services: result.original.services, prices: result.original.prices, hero: result.original.hero }, null, 2))

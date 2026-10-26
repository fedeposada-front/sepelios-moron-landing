import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { parseCSV } from '../../src/cms/parseCMS.js'

const fixturePath = fileURLToPath(new URL('../../public/cms-e2e.csv', import.meta.url))
const evidenceDirectory = fileURLToPath(new URL('../../docs/cms-layout-evidence/', import.meta.url))
const defaultServiceIds = ['cremacion', 'velatorio', 'traslado', 'flores', 'cementerios', 'personalizada']
const defaultPriceIds = ['cremacion', 'velatorio', 'traslado']
const viewports = [
  { name: 'desktop', width: 1280, height: 900, columns: 3 },
  { name: 'tablet', width: 768, height: 1024, columns: 2 },
  { name: 'mobile', width: 390, height: 844, columns: 1 },
]

function serializeCSV(rows) {
  return rows.map(row => row.map(value => {
    const cell = String(value ?? '')
    return /[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell
  }).join(',')).join('\n')
}

function createCollectionFixture(count) {
  const rows = parseCSV(fs.readFileSync(fixturePath, 'utf8'))
  const otherRows = rows.filter(row => !['servicio', 'precio'].includes(row[0]))
  const collectionRows = []

  defaultServiceIds.forEach((id, order) => {
    collectionRows.push(['servicio', id, 'titulo', '', 'NO', String(order), 'Layout QA'])
  })
  defaultPriceIds.forEach((id, order) => {
    collectionRows.push(['precio', id, 'titulo', '', 'NO', String(order), 'Layout QA'])
  })

  for (let index = 0; index < count; index += 1) {
    const order = String(index)
    const label = String(index + 1).padStart(2, '0')
    collectionRows.push(['servicio', `layout_servicio_${label}`, 'titulo', `Servicio QA ${label}`, 'SI', order, 'Layout QA'])
    collectionRows.push(['precio', `layout_precio_${label}`, 'titulo', `Precio QA ${label}`, 'SI', order, 'Layout QA'])
  }

  return serializeCSV([...otherRows, ...collectionRows])
}

async function expectCenteredRows(page, selector, count, columns) {
  const collection = page.locator(selector)
  await expect(collection.locator(':scope > *')).toHaveCount(count)
  await collection.scrollIntoViewIfNeeded()

  const layout = await collection.evaluate(element => {
    const container = element.getBoundingClientRect()
    const cards = [...element.children].map(card => {
      const rect = card.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, right: rect.right }
    })
    return {
      container: { x: container.x, width: container.width, right: container.right },
      cards,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }
  })

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth)
  expect(layout.cards.every(card => card.x >= layout.container.x - 1 && card.right <= layout.container.right + 1)).toBe(true)
  expect(Math.max(...layout.cards.map(card => card.width)) - Math.min(...layout.cards.map(card => card.width))).toBeLessThan(1)

  const rows = []
  for (const card of layout.cards) {
    let row = rows.find(candidate => Math.abs(candidate.y - card.y) < 2)
    if (!row) {
      row = { y: card.y, cards: [] }
      rows.push(row)
    }
    row.cards.push(card)
  }

  expect(rows.map(row => row.cards.length)).toEqual(
    Array.from({ length: Math.ceil(count / columns) }, (_, index) => Math.min(columns, count - index * columns)),
  )
  for (const row of rows) {
    const rowCenter = row.cards.reduce((sum, card) => sum + card.x + card.width / 2, 0) / row.cards.length
    const containerCenter = layout.container.x + layout.container.width / 2
    expect(Math.abs(rowCenter - containerCenter)).toBeLessThan(1)
  }
}

test('servicios y precios quedan centrados para 1–6 elementos en desktop, tablet y móvil', async ({ page }) => {
  test.setTimeout(180_000)
  fs.mkdirSync(evidenceDirectory, { recursive: true })

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    for (let count = 1; count <= 6; count += 1) {
      await page.route('**/cms-e2e.csv', route => route.fulfill({
        status: 200,
        contentType: 'text/csv; charset=utf-8',
        body: createCollectionFixture(count),
      }))
      await page.goto('/')
      await expect(page.locator('#servicios .card h3')).toHaveText(
        Array.from({ length: count }, (_, index) => `Servicio QA ${String(index + 1).padStart(2, '0')}`),
      )
      await expect(page.locator('#precios .price-card__name')).toHaveText(
        Array.from({ length: count }, (_, index) => `Precio QA ${String(index + 1).padStart(2, '0')}`),
      )

      await expectCenteredRows(page, '#servicios .services-grid', count, viewport.columns)
      await expectCenteredRows(page, '#precios .pricing-grid', count, viewport.columns)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

      await page.locator('#servicios').screenshot({
        path: path.join(evidenceDirectory, `services-${count}-${viewport.name}.png`),
        animations: 'disabled',
      })
      await page.locator('#precios').screenshot({
        path: path.join(evidenceDirectory, `prices-${count}-${viewport.name}.png`),
        animations: 'disabled',
      })
      await page.unroute('**/cms-e2e.csv')
    }
  }
})

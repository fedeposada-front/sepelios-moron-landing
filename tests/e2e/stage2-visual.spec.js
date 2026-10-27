import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const phase = process.env.STAGE2_CAPTURE_PHASE || 'after'
const evidence = fileURLToPath(new URL(`../../docs/stage2-evidence/${phase}/`, import.meta.url))
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]
const header = 'tipo,id,campo,valor,mostrar,orden,ayuda'
const qa = `${header}
config,site,precio_cremacion,$580.000,SI,0,QA
servicio,velatorio,mostrar,NO,SI,1,QA
precio,cremacion,destacada,SI,SI,0,QA
precio,velatorio,mostrar,NO,SI,1,QA`

async function openCSV(page, body = qa) {
  await page.route('**/cms-e2e.csv', route => route.fulfill({ status: 200, contentType: 'text/csv; charset=utf-8', body }))
  await page.goto('/')
  await expect(page.locator('#servicios .card')).toHaveCount(5)
  await page.evaluate(() => document.fonts.ready)
  fs.mkdirSync(evidence, { recursive: true })
}

async function viewport(page, value) {
  await page.setViewportSize({ width: value.width, height: value.height })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
}

test('stage2 navigation keeps original desktop and mobile labels', async ({ page }) => {
  await openCSV(page)
  for (const size of viewports) {
    await viewport(page, size)
    await page.locator('.header').screenshot({ path: path.join(evidence, `header-${size.name}.png`), animations: 'disabled' })
    if (size.name !== 'desktop') {
      await page.locator('.burger').click()
      await page.screenshot({ path: path.join(evidence, `menu-${size.name}.png`), animations: 'disabled' })
      await expect(page.locator('.mobile-menu nav a')).toHaveText(['Servicios', 'Instalaciones', 'C\u00f3mo trabajamos', 'Cobertura', 'Precios', 'Preguntas frecuentes', 'Contacto'])
      await page.keyboard.press('Escape')
      await expect(page.locator('.burger')).toBeFocused()
    } else {
      await expect.soft(page.locator('.nav a')).toHaveText(['Servicios', 'Instalaciones', 'Cobertura', 'Preguntas', 'Contacto'])
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('stage2 WhatsApp keeps short floating label and CMS destinations', async ({ page }) => {
  await openCSV(page)
  for (const size of viewports) {
    await viewport(page, size)
    const button = size.name === 'mobile' ? page.locator('.mobile-bar') : page.locator('.fab')
    await button.screenshot({ path: path.join(evidence, `whatsapp-${size.name}.png`), animations: 'disabled' })
    if (size.name === 'mobile') {
      await expect(page.locator('.fab')).toBeHidden()
      await expect(page.locator('.mobile-bar .btn')).toHaveText('Contactar por WhatsApp')
      await expect(page.locator('.mobile-bar .call')).toHaveAttribute('href', 'tel:+5491154133407')
    } else {
      await expect.soft(page.locator('.fab__label')).toHaveText('WhatsApp')
      await expect(page.locator('.fab')).toHaveAttribute('href', /wa\.me\/5491154133407/)
    }
  }
})

test('stage2 Footer preserves original service slots and QA visibility', async ({ page }) => {
  await openCSV(page)
  for (const size of viewports) {
    await viewport(page, size)
    await page.locator('.footer').scrollIntoViewIfNeeded()
    await page.locator('.footer').screenshot({ path: path.join(evidence, `footer-${size.name}.png`), animations: 'disabled' })
    await expect.soft(page.locator('.footer__top > div:nth-child(2) li a')).toHaveText(['Cremaciones', 'Traslados', 'Servicios florales', 'Precios'])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('stage2 custom CMS labels and hidden sections remain effective', async ({ page }) => {
  await openCSV(page, `${qa}
seccion,preguntas,nav_label,Consultas QA,SI,7,QA
config,site,header_whatsapp_label,Asistencia QA,SI,0,QA
config,site,whatsapp_numero,5491123456789,SI,0,QA
servicio,traslado,titulo,Traslado editable QA,SI,2,QA
seccion,precios,mostrar,NO,SI,6,QA
seccion,instalaciones,nav_visible,NO,SI,3,QA`)
  await expect(page.locator('.nav a[href="#preguntas"]')).toHaveText('Consultas QA')
  await expect(page.locator('.nav a[href="#instalaciones"]')).toHaveCount(0)
  await expect(page.locator('.fab')).toHaveAttribute('aria-label', 'Asistencia QA')
  await expect(page.locator('.fab')).toHaveAttribute('href', /wa\.me\/5491123456789/)
  await expect(page.locator('.footer__top > div:nth-child(2) li a')).toHaveText(['Cremaciones', 'Traslado editable QA', 'Servicios florales'])
  await expect(page.locator('#precios')).toHaveCount(0)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.mobile-bar .btn')).toHaveText('Asistencia QA')
  await page.locator('.burger').click()
  await expect(page.locator('.mobile-menu nav a[href="#preguntas"]')).toHaveText('Consultas QA')
  await expect(page.locator('.mobile-menu nav a[href="#instalaciones"]')).toHaveCount(0)
})

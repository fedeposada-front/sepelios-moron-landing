import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const evidenceDirectory = fileURLToPath(new URL('../../docs/cms-e2e-evidence/', import.meta.url))

async function openFixture(page) {
  await page.goto('/')
  await expect(page.locator('.hero h1')).toContainText('DESTACADO QA')
  await expect(page.locator('.header__inner .brand__name')).toContainText('Sepelios Morón QA')
}

test('CSV independiente controla textos, destacado, colecciones, precios, orden, visibilidad e imágenes', async ({ page }) => {
  await openFixture(page)

  await expect(page.locator('.hero h1 em')).toHaveText('DESTACADO QA')
  await expect(page.locator('.hero__sub')).toHaveText('Descripción editable de hero QA')
  await expect(page.locator('.hero__media img')).toHaveAttribute('src', '/assets/office-interior.png')
  await expect(page.locator('.hero__media img')).toHaveAttribute('alt', 'Imagen principal de prueba')
  await expect.poll(() => page.locator('.hero__media img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByRole('link', { name: 'CTA de prueba QA' })).toHaveAttribute('href', /wa\.me\/5491123456789/)
  await expect(page.getByRole('link', { name: 'CTA de prueba QA' })).toHaveAttribute('href', /Mensaje%20desde%20CSV%20de%20prueba/)

  await expect(page.locator('#servicios h2')).toHaveText('Servicios QA actualizados')
  await expect(page.locator('#servicios .card h3')).toHaveText([
    'Servicio ordenado primero QA',
    'Servicio ordenado segundo QA',
  ])
  await expect(page.getByText('Servicio oculto QA')).toHaveCount(0)
  await expect(page.locator('#confianza .trust-item h3')).toHaveText([
    'Primera tarjeta confianza QA',
    'Segunda tarjeta confianza QA',
  ])
  await expect(page.locator('#instalaciones img').first()).toHaveAttribute('alt', 'Alt foto QA')
  await expect(page.locator('#instalaciones img').first()).toHaveAttribute('src', '/assets/office-interior.png')

  await expect(page.locator('#proceso h2')).toHaveText('Proceso QA actualizado')
  await expect(page.locator('#proceso .step h3')).toHaveText('Paso único QA')
  await expect(page.locator('#cobertura h2')).toHaveText('Cobertura QA actualizada')
  await expect(page.locator('#cobertura .zone')).toHaveText(['Morón QA', 'Castelar QA'])
  await expect(page.locator('#cobertura .coverage__note')).toHaveText('Nota de cobertura QA')

  await expect(page.locator('#precios h2')).toHaveText('Precios QA actualizados')
  await expect(page.locator('.price-card')).toHaveCount(2)
  await expect(page.locator('.price-card .price-card__name')).toHaveText([
    'Cremación QA',
    'Velatorio QA destacado',
  ])
  await expect(page.locator('.price-card').first()).toContainText('$123.456 QA')
  await expect(page.locator('.price-card.is-featured')).toContainText('Velatorio QA destacado')
  await expect(page.getByText('Traslado oculto QA')).toHaveCount(0)

  await expect(page.locator('#preguntas h2')).toHaveText('Preguntas QA actualizadas')
  await page.getByRole('button', { name: '¿Pregunta editable QA?' }).click()
  await expect(page.getByText('Respuesta editable QA')).toBeVisible()
  await expect(page.getByText('Pregunta oculta QA')).toHaveCount(0)

  await expect(page.locator('#contacto h2')).toHaveText('Contacto QA actualizado')
  await expect(page.locator('#contacto .contact-label').first()).toHaveText('Dirección de prueba')
  await expect(page.locator('#contacto .contact-lines a[href^="tel:"]').first()).toHaveAttribute('href', 'tel:+5491123456789')
  await expect(page.locator('#contacto iframe')).toHaveAttribute('title', 'Mapa QA aislado')
  await expect(page.getByRole('link', { name: 'Contactar QA' })).toHaveAttribute('href', /Mensaje%20contacto%20QA/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Descripción SEO dinámica QA')
  await expect(page).toHaveTitle('SEO dinámico QA')
  await expect(page.locator('.nav a[href="#hero"]')).toHaveCount(0)
  await expect(page.locator('.nav a[href="#proceso"]')).toHaveCount(0)

  fs.mkdirSync(evidenceDirectory, { recursive: true })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(evidenceDirectory, 'desktop.png'), animations: 'disabled' })
})

test('los cambios del CSV mantienen layout y navegación en tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await openFixture(page)
  await expect(page.locator('#servicios h2')).toHaveText('Servicios QA actualizados')
  await expect(page.locator('.price-card.is-featured')).toContainText('Velatorio QA destacado')
  fs.mkdirSync(evidenceDirectory, { recursive: true })
  await page.screenshot({ path: path.join(evidenceDirectory, 'tablet.png'), animations: 'disabled' })
})

test('los cambios del CSV mantienen layout y navegación en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openFixture(page)
  await expect(page.locator('.mobile-bar')).toBeVisible()
  await expect(page.locator('.mobile-bar a[href^="tel:"]')).toHaveAttribute('href', 'tel:+5491123456789')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await expect(page.getByRole('dialog', { name: 'Navegación móvil' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Navegación móvil' }).locator('a[href="#proceso"]')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Navegación móvil' })).toHaveCount(0)
  fs.mkdirSync(evidenceDirectory, { recursive: true })
  await page.screenshot({ path: path.join(evidenceDirectory, 'mobile.png'), animations: 'disabled' })
})

test('CSV inaccesible o malformado activa los fallbacks y registra error', async ({ page }) => {
  await page.route('**/cms-e2e.csv', route => route.fulfill({ status: 503, body: 'Service unavailable' }))
  await page.goto('/')
  await expect(page.locator('.header__inner .brand__name')).toContainText('Sepelios Morón')
  await expect(page.locator('.hero h1')).toContainText('Atención fúnebre las 24 horas en Morón')

  await page.unrouteAll()
  await page.route('**/cms-e2e.csv', route => route.fulfill({
    status: 200,
    contentType: 'text/csv',
    body: 'clave,valor\nmarca,contenido incompleto',
  }))
  await page.reload()
  await expect(page.locator('.header__inner .brand__name')).toContainText('Sepelios Morón')
  await expect(page.locator('.hero h1')).toContainText('Atención fúnebre las 24 horas en Morón')
})

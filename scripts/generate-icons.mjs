#!/usr/bin/env node
// Gera os PNG icons do Movibank a partir do M path do logo SVG.
// Uso: node scripts/generate-icons.mjs
// Requer @resvg/resvg-js (instalar em /tmp/icon-test ou local; ver README).

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve resvg-js — procura primeiro em node_modules local, senão /tmp/icon-test.
async function loadResvg() {
  try {
    return (await import('@resvg/resvg-js')).Resvg
  } catch {
    return (await import('/tmp/icon-test/node_modules/@resvg/resvg-js/index.js')).Resvg
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../assets/images')

const M_PATH =
  'M29.55,26.4l-12.54,20.09c-1.39,2.16,1.57,4.45,3.33,2.57l7.42-7.91c1.1-1.17,3.04-.77,3.59.73l4.45,12.31c.74,2.04,3.47,2.44,4.77.69l13.7-15.71c1.3-1.34,2.94-.95,3.09.89l.58,7.26c.03.34.14.78.32,1.07,1.05,1.77,5.05,1.82,5.04-1.29l.05-22.5c-.01-3.4-3.32-3.93-5.05-1.84l-15.21,18.29c-1.62,1.67-3.19,1.39-3.97-.43l-5.71-13.89c-.69-1.6-2.9-1.78-3.84-.31Z'

const YELLOW = '#F4B400'
const DARK = '#111827'

// M bbox aproximado no viewBox original 228x74: x=15, y=15, w=55, h=43
const MW = 55
const MH = 43
const MX0 = 15
const MY0 = 15

function svgWithMark({ bg, fg, inset }) {
  // inset = % do canvas 100x100 que o M ocupa
  const scale = Math.min(inset / MW, inset / MH)
  const tx = (100 - MW * scale) / 2 - MX0 * scale
  const ty = (100 - MH * scale) / 2 - MY0 * scale
  const bgRect = bg ? `<rect width="100" height="100" fill="${bg}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  ${bgRect}
  <g transform="translate(${tx.toFixed(4)},${ty.toFixed(4)}) scale(${scale.toFixed(6)})">
    <path d="${M_PATH}" fill="${fg}"/>
  </g>
</svg>`
}

function svgSolid({ bg }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${bg}"/>
</svg>`
}

async function render(svg, outPath, size) {
  const { Resvg } = await import('@resvg/resvg-js').catch(async () => ({
    Resvg: (await import('/tmp/icon-test/node_modules/@resvg/resvg-js/index.js')).Resvg,
  }))
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  writeFileSync(outPath, png)
  console.log(`  ✔ ${outPath.split('/').pop()} (${size}px)`)
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  console.log('→ Renderizando ícones…')

  await render(svgWithMark({ bg: DARK, fg: YELLOW, inset: 60 }), `${OUT}/icon.png`, 1024)
  await render(svgWithMark({ bg: null, fg: YELLOW, inset: 44 }), `${OUT}/android-icon-foreground.png`, 1024)
  await render(svgSolid({ bg: DARK }), `${OUT}/android-icon-background.png`, 1024)
  await render(svgWithMark({ bg: null, fg: '#000000', inset: 44 }), `${OUT}/android-icon-monochrome.png`, 1024)
  await render(svgWithMark({ bg: DARK, fg: YELLOW, inset: 50 }), `${OUT}/splash-icon.png`, 512)
  await render(svgWithMark({ bg: DARK, fg: YELLOW, inset: 60 }), `${OUT}/favicon.png`, 48)

  console.log('✔ Ícones gerados em', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

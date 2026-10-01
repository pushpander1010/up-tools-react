import QRCode from 'qrcode'

// Error correction levels
export const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low (L)', recovery: '~7%', desc: 'Best for simple text & maximum data capacity' },
  { value: 'M', label: 'Medium (M)', recovery: '~15%', desc: 'Balanced default for most applications' },
  { value: 'Q', label: 'Quartile (Q)', recovery: '~25%', desc: 'High redundancy for rough environments' },
  { value: 'H', label: 'High (H)', recovery: '~30%', desc: 'Recommended when adding a center logo' },
]

// Standard resolution presets
export const SIZE_PRESETS = [
  { size: 512, label: '512 px', tag: 'Web / Social' },
  { size: 1024, label: '1024 px', tag: 'High-Res Print' },
  { size: 2048, label: '2048 px', tag: 'Ultra 4K Print' },
]

// Quiet zone margin presets
export const MARGIN_PRESETS = [
  { margin: 1, label: 'Compact', value: 1 },
  { margin: 2, label: 'Minimal', value: 2 },
  { margin: 4, label: 'Standard', value: 4 },
  { margin: 6, label: 'Spacious', value: 6 },
]

// Curated high-contrast color palettes
export const COLOR_PALETTES = [
  { name: 'Classic Dark', fg: '#000000', bg: '#ffffff' },
  { name: 'Midnight Slate', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Indigo Tech', fg: '#4338ca', bg: '#ffffff' },
  { name: 'Emerald Forest', fg: '#047857', bg: '#ffffff' },
  { name: 'UPI Teal', fg: '#0d9488', bg: '#ffffff' },
  { name: 'Ruby Crimson', fg: '#9f1239', bg: '#fff1f2' },
  { name: 'Dark Mode', fg: '#f8fafc', bg: '#0f172a' },
  { name: 'Cyber Neon', fg: '#00ff88', bg: '#090d16' },
]

/**
 * Calculates WCAG 2.1 relative luminance
 */
function getRelativeLuminance(hex) {
  const cleanHex = hex.replace('#', '')
  const fullHex = cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex
  const r = parseInt(fullHex.substring(0, 2), 16) / 255
  const g = parseInt(fullHex.substring(2, 4), 16) / 255
  const b = parseInt(fullHex.substring(4, 6), 16) / 255
  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

/**
 * Calculates contrast ratio and produces diagnostic info
 */
export function calculateContrast(fgHex, bgHex) {
  try {
    const l1 = getRelativeLuminance(fgHex)
    const l2 = getRelativeLuminance(bgHex)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    const ratio = (lighter + 0.05) / (darker + 0.05)
    const isInverted = l1 > l2 // Foreground is lighter than background

    let rating = 'good'
    let message = 'Excellent contrast. Should scan reliably on all mobile cameras.'

    if (ratio < 2.5) {
      rating = 'critical'
      message = 'Critical: Very low contrast. Cameras and barcode readers will likely fail to scan.'
    } else if (ratio < 4.0) {
      rating = 'warning'
      message = 'Warning: Low contrast. May fail in low lighting or on older smartphones.'
    } else if (isInverted) {
      rating = 'notice'
      message = 'Notice: Inverted colors (light on dark). Modern phones scan fine, but some older dedicated hardware scanners struggle.'
    }

    return {
      ratio: Number(ratio.toFixed(2)),
      rating,
      message,
      isInverted,
      isLowContrast: ratio < 3.0,
    }
  } catch {
    return {
      ratio: 21,
      rating: 'good',
      message: 'Standard contrast',
      isInverted: false,
      isLowContrast: false,
    }
  }
}

/**
 * Loads an image from a data URL or object URL into an HTMLImageElement
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Renders a QR code onto an offscreen canvas at full size, optionally overlaying a centered logo
 */
export async function generateQrCanvas({
  text,
  size = 1024,
  errorCorrectionLevel = 'M',
  margin = 4,
  fgColor = '#000000',
  bgColor = '#ffffff',
  logoDataUrl = null,
}) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  // Force at least 'Q' error correction if a logo overlay is present
  const effectiveEC = logoDataUrl && (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M')
    ? 'H'
    : errorCorrectionLevel

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin,
    errorCorrectionLevel: effectiveEC,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  })

  // Draw logo overlay if provided
  if (logoDataUrl) {
    try {
      const logoImg = await loadImage(logoDataUrl)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Sized ~20% of the QR code
        const logoSize = Math.round(size * 0.20)
        const x = Math.round((size - logoSize) / 2)
        const y = Math.round((size - logoSize) / 2)
        const pad = Math.max(4, Math.round(logoSize * 0.12))
        const radius = Math.round(logoSize * 0.18)

        // Draw protective backing badge with background color
        ctx.save()
        ctx.fillStyle = bgColor
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
        ctx.shadowBlur = Math.round(size * 0.015)
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = Math.round(size * 0.005)

        // Rounded rect backing
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, radius + pad)
        } else {
          ctx.rect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2)
        }
        ctx.fill()
        ctx.restore()

        // Clip and draw the logo image
        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, logoSize, logoSize, radius)
        } else {
          ctx.rect(x, y, logoSize, logoSize)
        }
        ctx.clip()
        ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        ctx.restore()
      }
    } catch (err) {
      console.warn('Failed to overlay logo onto QR canvas:', err)
    }
  }

  return canvas
}

/**
 * Generates an SVG string representation of the QR code, with embedded logo support
 */
export async function generateQrSvgString({
  text,
  errorCorrectionLevel = 'M',
  margin = 4,
  fgColor = '#000000',
  bgColor = '#ffffff',
  logoDataUrl = null,
}) {
  const effectiveEC = logoDataUrl && (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M')
    ? 'H'
    : errorCorrectionLevel

  const svg = await QRCode.toString(text, {
    type: 'svg',
    margin,
    errorCorrectionLevel: effectiveEC,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  })

  if (!logoDataUrl) return svg

  // Inject logo overlay in SVG coordinates
  const vbMatch = svg.match(/viewBox=["']0 0 (\d+) (\d+)["']/)
  if (!vbMatch) return svg

  const vbWidth = parseInt(vbMatch[1], 10)
  const vbHeight = parseInt(vbMatch[2], 10)

  const logoDim = +(vbWidth * 0.20).toFixed(2)
  const pad = +(logoDim * 0.12).toFixed(2)
  const x = +((vbWidth - logoDim) / 2).toFixed(2)
  const y = +((vbHeight - logoDim) / 2).toFixed(2)
  const r = +(logoDim * 0.16).toFixed(2)

  const logoElements = `
  <rect x="${(x - pad).toFixed(2)}" y="${(y - pad).toFixed(2)}" width="${(logoDim + pad * 2).toFixed(2)}" height="${(logoDim + pad * 2).toFixed(2)}" rx="${(r + pad).toFixed(2)}" fill="${bgColor}" />
  <image href="${logoDataUrl}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${logoDim.toFixed(2)}" height="${logoDim.toFixed(2)}" preserveAspectRatio="xMidYMid meet" />
`

  return svg.replace('</svg>', `${logoElements}</svg>`)
}

/**
 * Downloads a Blob as a file in the browser
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Downloads an SVG string as a .svg file
 */
export function downloadSvgString(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, filename)
}

/**
 * Copies a canvas as a PNG directly to the system clipboard
 */
export async function copyCanvasToClipboard(canvas) {
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (blob && navigator.clipboard && typeof navigator.clipboard.write === 'function') {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      return { success: true, mode: 'image' }
    }
  } catch (err) {
    console.warn('Clipboard image write failed, attempting dataURL fallback:', err)
  }

  // Fallback: copy data URL
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(canvas.toDataURL('image/png'))
      return { success: true, mode: 'dataUrl' }
    }
  } catch {}

  return { success: false }
}

/**
 * Copies plain text to clipboard
 */
export async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Legacy fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      document.body.removeChild(textarea)
      return false
    }
  }
  return false
}

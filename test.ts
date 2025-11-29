const html = await page.content()
const sizeBytes = Buffer.byteLength(html, 'utf8')
const sizeMB = sizeBytes / (1024 * 1024)
console.log(`HTML size: ${sizeMB.toFixed(2)} MB`)
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generatePdfFromHtml, generatePdfFromUrl } from './generatePdf';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load sample HTML from external file
function loadSampleHtml(): string {
  const htmlPath = resolve(__dirname, 'sample-report.html');
  return readFileSync(htmlPath, 'utf-8');
}

async function testHtmlPdf() {
  console.log('=== Test 1: Generate PDF from HTML ===\n');

  try {
    const sampleHtml = loadSampleHtml();
    console.log(`Loaded HTML from: ${resolve(__dirname, 'sample-report.html')}`);

    const pdf = await generatePdfFromHtml(sampleHtml, {
      verbose: true,
      format: 'A4',
      printBackground: true,
    });

    const outputPath = resolve(__dirname, 'test-output-html.pdf');
    writeFileSync(outputPath, pdf);
    console.log(`\n✅ PDF saved to: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ Failed to generate PDF from HTML:', error);
  }
}

async function testUrlPdf(url: string) {
  console.log(`=== Test 2: Generate PDF from URL ===\n`);
  console.log(`URL: ${url}\n`);

  try {
    const pdf = await generatePdfFromUrl(url, {
      verbose: true,
      format: 'A4',
      printBackground: true,
      waitForReady: true, // Wait for __PDF_READY flag
    });

    const outputPath = resolve(__dirname, 'test-output-url.pdf');
    writeFileSync(outputPath, pdf);
    console.log(`\n✅ PDF saved to: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ Failed to generate PDF from URL:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--html') || args.length === 0) {
    await testHtmlPdf();
  }

  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url');
    const url = args[urlIndex + 1] || 'http://localhost:8080/report/1';
    await testUrlPdf(url);
  }

  if (args.includes('--help')) {
    console.log(`
Usage: npx tsx scripts/test-pdf-generation.ts [options]

Options:
  --html          Generate PDF from sample HTML (default if no options)
  --url [URL]     Generate PDF from URL (default: http://localhost:8080/report/1)
  --help          Show this help message

Files:
  sample-report.html    The HTML template used for testing (open in browser to compare)
  test-output-html.pdf  Generated PDF from HTML
  test-output-url.pdf   Generated PDF from URL

Examples:
  npx tsx scripts/test-pdf-generation.ts
  npx tsx scripts/test-pdf-generation.ts --html
  npx tsx scripts/test-pdf-generation.ts --url http://localhost:8080/report/1
  npx tsx scripts/test-pdf-generation.ts --html --url http://localhost:8080/report/2

To compare visual output:
  1. Open scripts/sample-report.html in your browser
  2. Run: npx tsx scripts/test-pdf-generation.ts --html
  3. Open scripts/test-output-html.pdf to compare
    `);
  }
}

main().catch(console.error);

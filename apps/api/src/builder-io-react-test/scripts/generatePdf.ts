import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';

export interface PdfGenerationOptions {
  /** URL to navigate to and capture as PDF */
  url?: string;
  /** Raw HTML content to render (alternative to URL) */
  html?: string;
  /** Viewport width in pixels */
  viewportWidth?: number;
  /** Viewport height in pixels */
  viewportHeight?: number;
  /** PDF format (A4, Letter, etc.) */
  format?: 'A4' | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'A0' | 'A1' | 'A2' | 'A3' | 'A5' | 'A6';
  /** Print background colors and images */
  printBackground?: boolean;
  /** Page margins */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** Wait for this selector before generating PDF */
  waitForSelector?: string;
  /** Wait for window.__PDF_READY to be true */
  waitForReady?: boolean;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Enable verbose logging */
  verbose?: boolean;
}

const defaultOptions: PdfGenerationOptions = {
  viewportWidth: 1200,
  viewportHeight: 800,
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20mm',
    right: '20mm',
    bottom: '20mm',
    left: '20mm',
  },
  waitForReady: false,
  timeout: 30000,
  verbose: false,
};

/**
 * Generate a PDF from a URL or HTML content using Puppeteer
 */
export async function generatePdf(options: PdfGenerationOptions): Promise<Buffer> {
  const opts = { ...defaultOptions, ...options };

  if (!opts.url && !opts.html) {
    throw new Error('Either url or html must be provided');
  }

  let browser: Browser | null = null;

  try {
    if (opts.verbose) {
      console.log('Launching Puppeteer...');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page: Page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: opts.viewportWidth!,
      height: opts.viewportHeight!,
    });

    // Log console messages if verbose
    if (opts.verbose) {
      page.on('console', (msg) => console.log('Page console:', msg.text()));
      page.on('pageerror', (error) => console.log('Page error:', error.message));
    }

    // Navigate to URL or set HTML content
    if (opts.url) {
      if (opts.verbose) {
        console.log(`Navigating to: ${opts.url}`);
      }
      await page.goto(opts.url, {
        waitUntil: 'networkidle0',
        timeout: opts.timeout,
      });
    } else if (opts.html) {
      if (opts.verbose) {
        console.log('Setting HTML content...');
      }
      await page.setContent(opts.html, {
        waitUntil: 'networkidle0',
        timeout: opts.timeout,
      });
    }

    // Wait for specific selector if provided
    if (opts.waitForSelector) {
      if (opts.verbose) {
        console.log(`Waiting for selector: ${opts.waitForSelector}`);
      }
      await page.waitForSelector(opts.waitForSelector, { timeout: opts.timeout });
    }

    // Wait for __PDF_READY flag if enabled
    if (opts.waitForReady) {
      if (opts.verbose) {
        console.log('Waiting for window.__PDF_READY...');
      }
      await page.waitForFunction(
        () => (window as unknown as { __PDF_READY?: boolean }).__PDF_READY === true,
        { timeout: opts.timeout }
      );
    }

    if (opts.verbose) {
      console.log('Generating PDF...');
    }

    // Generate PDF
    const pdfOptions: PDFOptions = {
      format: opts.format,
      printBackground: opts.printBackground,
      margin: opts.margin,
    };

    const pdf = await page.pdf(pdfOptions);

    await browser.close();
    browser = null;

    if (opts.verbose) {
      console.log(`PDF generated successfully (${pdf.length} bytes)`);
    }

    return Buffer.from(pdf);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

/**
 * Generate a PDF from a URL
 */
export async function generatePdfFromUrl(
  url: string,
  options?: Omit<PdfGenerationOptions, 'url' | 'html'>
): Promise<Buffer> {
  return generatePdf({ ...options, url });
}

/**
 * Generate a PDF from HTML content
 */
export async function generatePdfFromHtml(
  html: string,
  options?: Omit<PdfGenerationOptions, 'url' | 'html'>
): Promise<Buffer> {
  return generatePdf({ ...options, html });
}

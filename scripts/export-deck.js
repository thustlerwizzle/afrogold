/* eslint-disable */
// Export deck/PITCH_DECK.md to deck/PITCH_DECK.pdf using Puppeteer + Marked
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

async function main() {
  const mdPath = path.resolve(__dirname, '..', 'deck', 'PITCH_DECK.md');
  const outPdf = path.resolve(__dirname, '..', 'deck', 'PITCH_DECK.pdf');
  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0;
      margin: 0;
    }
    .page {
      width: 100%;
      min-height: 100vh;
      padding: 60px 80px;
      background: white;
      margin: 0;
      page-break-after: always;
    }
    .page:last-child { page-break-after: auto; }
    h1 { 
      font-size: 48px; 
      color: #1a202c; 
      margin-bottom: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    h2 { 
      font-size: 36px; 
      color: #2d3748; 
      margin: 40px 0 20px 0;
      border-bottom: 3px solid #667eea;
      padding-bottom: 8px;
    }
    h3 { 
      font-size: 28px; 
      color: #4a5568; 
      margin: 32px 0 16px 0;
    }
    p, li { 
      font-size: 18px; 
      line-height: 1.8; 
      color: #2d3748;
      margin-bottom: 12px;
    }
    ul { 
      margin: 20px 0 20px 30px; 
      list-style: none;
    }
    ul li:before { 
      content: "▸ "; 
      color: #667eea; 
      font-weight: bold; 
      margin-right: 8px;
    }
    strong { color: #1a202c; font-weight: 600; }
    hr { 
      border: none; 
      height: 2px; 
      background: linear-gradient(90deg, transparent, #667eea, transparent);
      margin: 40px 0; 
    }
    .page-break { page-break-after: always; }
    .highlight-box {
      background: linear-gradient(135deg, #f6f8ff 0%, #eef2ff 100%);
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 24px 0;
      border-radius: 8px;
    }
    code { background: #f7fafc; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
  `;
  const md = fs.readFileSync(mdPath, 'utf8');
  let htmlContent = marked.parse(md);
  // Wrap each section (separated by <hr>) in its own page div
  const sections = htmlContent.split('<hr>');
  const wrappedSections = sections.map((s, i) => `<div class="page">${s}</div>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8" /><style>${css}</style></head><body>${wrappedSections}</body></html>`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPdf, format: 'A4', printBackground: true });
  await browser.close();
  console.log('Exported:', outPdf);
}

main().catch((e) => { console.error(e); process.exit(1); });

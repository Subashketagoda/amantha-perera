const fs = require('fs');
const path = require('path');

const mode = process.argv.includes('--lint') ? 'lint' : 'build';
console.log(`Running project ${mode}...`);

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ [${mode.toUpperCase()}] ERROR: ${message}`);
    errors++;
  } else {
    console.log(`✓ ${message}`);
  }
}

// 1. Check index.html exists
assert(fs.existsSync('index.html'), 'index.html exists');

const html = fs.readFileSync('index.html', 'utf8');

// Title
const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
assert(titleMatch && titleMatch[1].trim() === 'Amantha Perera | Marketer, Founder, Creator &amp; Performer',
  'Title tag is "Amantha Perera | Marketer, Founder, Creator & Performer"');

// Meta description
const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
assert(descMatch && descMatch[1].includes('Amantha Perera is a Sri Lankan marketer'),
  'Meta description is present and properly formatted');

// Canonical
const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
assert(canonMatch && canonMatch[1] === 'https://notamanthaperera.online/',
  'Canonical URL is exactly "https://notamanthaperera.online/"');

// Robots
const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
assert(robotsMatch && robotsMatch[1].includes('index, follow'),
  'Robots meta tag allows indexing and following');

// Single H1
const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
assert(h1Count === 1, `Exactly 1 H1 tag found on page (found ${h1Count})`);

// JSON-LD schemas
const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
assert(Boolean(jsonLdMatch), 'JSON-LD structured data is present');
if (jsonLdMatch) {
  try {
    const data = JSON.parse(jsonLdMatch[1]);
    const types = (data['@graph'] || [data]).map(x => x['@type']);
    assert(types.includes('Person'), 'JSON-LD contains Person schema');
    assert(types.includes('WebSite'), 'JSON-LD contains WebSite schema');
    assert(types.includes('WebPage'), 'JSON-LD contains WebPage schema');
    assert(types.includes('BreadcrumbList'), 'JSON-LD contains BreadcrumbList schema');
  } catch (err) {
    assert(false, `JSON-LD parse failed: ${err.message}`);
  }
}

// robots.txt and sitemap.xml
assert(fs.existsSync('robots.txt'), 'robots.txt exists in root');
assert(fs.existsSync('sitemap.xml'), 'sitemap.xml exists in root');
assert(fs.existsSync('site.webmanifest'), 'site.webmanifest exists in root');

if (errors > 0) {
  console.error(`\n${mode.toUpperCase()} failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\n🎉 ${mode.toUpperCase()} passed with 0 errors.`);
}

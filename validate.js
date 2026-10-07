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

// Canonical (Exactly one canonical tag)
const allCanonMatches = [...html.matchAll(/<link\s+rel=["']canonical["'][^>]*>/gi)];
assert(allCanonMatches.length === 1, `Exactly 1 canonical tag found on page (found ${allCanonMatches.length})`);
const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
assert(canonMatch && canonMatch[1] === 'https://notamanthaperera.online/',
  'Canonical URL is exactly "https://notamanthaperera.online/"');

// Open Graph URL
const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
assert(ogUrlMatch && ogUrlMatch[1] === 'https://notamanthaperera.online/',
  'Open Graph URL is exactly "https://notamanthaperera.online/"');

// Internal links audit (no http:// or www.notamanthaperera.online internal links)
const badInternalLinks = [...html.matchAll(/href=["'](http:\/\/notamanthaperera\.online[^"']*|https?:\/\/www\.notamanthaperera\.online[^"']*)["']/gi)];
assert(badInternalLinks.length === 0, `No redirecting internal links found in index.html (found ${badInternalLinks.length})`);

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
    const items = data['@graph'] || [data];
    const types = items.map(x => x['@type']);
    assert(types.includes('Person'), 'JSON-LD contains Person schema');
    assert(types.includes('WebSite'), 'JSON-LD contains WebSite schema');
    assert(types.includes('WebPage'), 'JSON-LD contains WebPage schema');
    assert(types.includes('BreadcrumbList'), 'JSON-LD contains BreadcrumbList schema');

    // Ensure all internal URLs in JSON-LD use canonical https://notamanthaperera.online/
    const jsonStr = JSON.stringify(data);
    assert(!jsonStr.includes('http://notamanthaperera.online') && !jsonStr.includes('www.notamanthaperera.online'),
      'JSON-LD does not contain HTTP or WWW domain URLs');
  } catch (err) {
    assert(false, `JSON-LD parse failed: ${err.message}`);
  }
}

// robots.txt and sitemap.xml
assert(fs.existsSync('robots.txt'), 'robots.txt exists in root');
if (fs.existsSync('robots.txt')) {
  const robotsTxt = fs.readFileSync('robots.txt', 'utf8');
  assert(robotsTxt.includes('Allow: /'), 'robots.txt allows root path');
  assert(robotsTxt.includes('Sitemap: https://notamanthaperera.online/sitemap.xml'), 'robots.txt points to canonical sitemap');
}

assert(fs.existsSync('sitemap.xml'), 'sitemap.xml exists in root');
if (fs.existsSync('sitemap.xml')) {
  const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
  assert(sitemapXml.includes('<loc>https://notamanthaperera.online/</loc>'), 'sitemap.xml includes canonical homepage');
  assert(!sitemapXml.includes('http://notamanthaperera.online') && !sitemapXml.includes('www.notamanthaperera.online'),
    'sitemap.xml does not contain non-canonical HTTP or WWW URLs');
  
  // Validate that all image files in sitemap exist
  const sitemapImages = [...sitemapXml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(m => m[1]);
  let missingSitemapImages = 0;
  for (const imgUrl of sitemapImages) {
    const localFile = imgUrl.replace('https://notamanthaperera.online/', '');
    if (!fs.existsSync(localFile)) {
      missingSitemapImages++;
    }
  }
  assert(missingSitemapImages === 0, `All sitemap images exist locally (missing: ${missingSitemapImages})`);
}

assert(fs.existsSync('site.webmanifest'), 'site.webmanifest exists in root');


if (errors > 0) {
  console.error(`\n${mode.toUpperCase()} failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\n🎉 ${mode.toUpperCase()} passed with 0 errors.`);
}

/* Ishlatish:  node scripts/set-domain.js https://sizning-saytingiz.uz
   index.html, robots.txt va sitemap.xml ichidagi domen manzilini almashtiradi. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let domain = (process.argv[2] || '').trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(:\d+)?$/i.test(domain)) {
  console.error('Xato: domenni to\'liq yozing, masalan: node scripts/set-domain.js https://menucraft.uz');
  process.exit(1);
}
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const m = html.match(/<link rel="canonical" href="(https?:\/\/[^"]+?)\/">/);
if (!m) { console.error('index.html ichida canonical topilmadi'); process.exit(1); }
const old = m[1];
const today = new Date().toISOString().slice(0, 10);
for (const f of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const p = path.join(root, f);
  let t = fs.readFileSync(p, 'utf8').split(old).join(domain);
  if (f === 'sitemap.xml') t = t.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${today}</lastmod>`);
  fs.writeFileSync(p, t);
  console.log('Yangilandi:', f);
}
console.log(`Domen: ${old}  ->  ${domain}`);

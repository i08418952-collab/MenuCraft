# MenuCraft: onlayn menyu + PDF + QR (VS Code uchun)

Login yo'q, server kerak emas. Hamma narsa brauzerda ishlaydi, ma'lumotlar brauzerning o'zida saqlanadi.

## 1. VS Code'da ishga tushirish

**Live Server (eng oson)**
1. Papkani VS Code'da oching (File → Open Folder).
2. Taklif qilingan **Live Server** kengaytmasini o'rnating.
3. `index.html` ustida o'ng tugma → **Open with Live Server**.

**Terminal orqali** (Node.js 18+ kerak): `npm start`, keyin http://localhost:5500 oching.

Birinchi ochilganda internet kerak (QR kutubxonasi va shriftlar CDN'dan yuklanadi).

## 2. Fayllar

| Fayl | Vazifasi |
|---|---|
| `index.html` | sahifa, SEO teglari, tavsif va FAQ matni |
| `css/style.css` | barcha dizayn |
| `js/app.js` | asosiy dastur |
| `js/qr-loader.js` | QR kutubxonasini yuklash |
| `robots.txt`, `sitemap.xml` | Google uchun |
| `manifest.webmanifest`, `favicon.svg`, `icons/`, `og-image.png` | ikonka va ulashish rasmi |
| `scripts/set-domain.js` | domen manzilini bir buyruqda almashtirish |

## 3. Internetga joylash va Google'ga chiqarish

Google'ga kod "yuklanmaydi". Siz saytni internetga joylaysiz, keyin Search Console orqali sayt egasi ekaningizni tasdiqlaysiz va Google'ga saytingiz borligini bildirasiz.

### 1-qadam. Hostingga joylang (bepul variantlar)
- **Netlify Drop**: app.netlify.com/drop sahifasiga butun papkani sudrab tashlang. Tayyor manzil beriladi.
- **Cloudflare Pages** yoki **GitHub Pages**: papkani repozitoriyaga yuklab, Pages'ni yoqing.
- Yaxshisi: o'z domeningiz bo'lsin (masalan `menucraft.uz` yoki `.com`). Domenni hosting sozlamalarida ulaysiz.

### 2-qadam. Domenni kodga yozing
Saytingiz manzili aniq bo'lgach, terminalda:
```bash
npm run domain -- https://sizning-saytingiz.uz
```
Bu `index.html`, `robots.txt` va `sitemap.xml` dagi `https://YOUR-DOMAIN.COM` ni haqiqiy manzilga almashtiradi. Keyin papkani hostingga qayta yuklang.
(Node.js yo'q bo'lsa, shu uch faylda `https://YOUR-DOMAIN.COM` ni qo'lda almashtiring.)

### 3-qadam. Search Console'da saytni qo'shing
1. https://search.google.com/search-console ga Google akkaunt bilan kiring.
2. **Add property** → **URL prefix** → saytingiz manzilini yozing (`https://sizning-saytingiz.uz/`).
3. Tasdiqlash usuli sifatida **HTML tag** ni tanlang. Google `<meta name="google-site-verification" content="XXXX">` beradi.
4. `index.html` ichida shu qator izohda turibdi. `<!--` va `-->` ni olib tashlab, `KODNI_SHU_YERGA` o'rniga Google bergan kodni qo'ying.
5. Faylni hostingga qayta yuklang, Search Console'da **Verify** ni bosing.

(Yoki **Domain** turida DNS TXT yozuvi bilan ham tasdiqlash mumkin. Domen sozlamalarida Google bergan TXT yozuvini qo'shasiz.)

### 4-qadam. Sitemap yuboring
Search Console → **Sitemaps** → `sitemap.xml` yozing → **Submit**.

### 5-qadam. Indekslashni so'rang
Search Console yuqoridagi qidiruvga bosh sahifa manzilini kiriting (**URL inspection**) → **Request indexing**.

Google odatda bir necha kundan bir necha haftagacha vaqt oladi. Natijani **Pages** bo'limida ko'rasiz.

### Yandex (O'zbekiston uchun foydali)
https://webmaster.yandex.com ga saytni qo'shing. `index.html` da `yandex-verification` qatori ham tayyor turibdi. Xuddi shunday tasdiqlang va `sitemap.xml` ni yuboring.

## 4. Qidiruvda yaxshiroq chiqish uchun maslahatlar
- Sahifada tayyor SEO matni bor: sarlavhalar, tavsif, FAQ va structured data (FAQ, WebApplication). Matnlarni o'zingizga moslab o'zgartiring (`index.html` dagi `<section class="seo">`).
- O'z domeningiz va HTTPS bo'lsin (Netlify, Cloudflare va GitHub Pages buni o'zi beradi).
- Boshqa saytlardan havolalar (Telegram kanal, Instagram, biznes katalogi) qidiruvdagi o'rningizni yaxshilaydi.
- Aniq natija va tezlikni Google kafolatlamaydi. Yangi sayt ko'rinishi uchun vaqt kerak.

## 5. Eslatma: QR telefonda ishlashi uchun
Kompyuterdagi (localhost yoki fayl) sahifaning QR kodi telefonda ochilmaydi. Sayt internetga joylangach, o'sha manzilda ochib QR ni yuklab oling. Yoki Eksport bo'limidagi "Menyu havolasi" ga tayyor sayt manzilini yozing.

## 6. PDF olish
Eksport → "PDF yuklab olish" → chop etish oynasida printer o'rniga **"PDF sifatida saqlash"** ni tanlang.

## 7. Sozlash
Shablonlar: `TEMPLATES`, ikonkalar: `ICONS`, qog'oz o'lchamlari: `SIZES` (`js/app.js` boshida).

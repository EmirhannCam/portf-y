# İşletme Adı – Dijital Çözümler Sitesi

Modern, aydınlık ve responsive tek sayfa site. Hizmetler: web tasarım, logo tasarım, dijital medya, mobil uygulama, drone çekimi.

## Başlangıç
- `index.html` dosyasını tarayıcıda açın.
- Geliştirme için canlı yenileme isterseniz basit bir HTTP sunucu kullanabilirsiniz.

```bash
# Python 3
python -m http.server 8080
# veya Node.js
npx serve . -p 8080 --single
```

## İçerik
- `index.html`: SEO etiketleri, bölümler (Hero, Hizmetler, Portfolyo, Hakkımızda, İletişim)
- `assets/css/styles.css`: Modern açık tema, responsive grid, animasyonlar
- `assets/js/main.js`: Menü, yumuşak kaydırma, portfolyo filtreleri, form statüsü
- `assets/icons/favicon.svg`: Favicon
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`: SEO ve PWA varlıkları

## SEO İpuçları
- `index.html` içindeki `<title>`, `description`, `canonical` ve başlıklarda kendi marka adınızı ve şehir/niş bilgilerinizi kullanın.
- Görsellere açıklayıcı `alt` ve `aria-label` ekleyin.
- Kendi domaininize yayınladığınızda `sitemap.xml` ve `robots.txt` içindeki URL'leri güncelleyin.

## Yayınlama
### Netlify
1. Bu klasörü Netlify'a sürükleyip bırakın veya Git deposu bağlayın.
2. Build komutu gerekmez, publish directory kök klasör olsun.

### GitHub Pages
1. Dosyaları bir depoya gönderin.
2. Settings → Pages → Deploy from branch → `main`/`root` seçin.

## Özelleştirme
- Renk ve tipografi için `:root` değişkenlerini düzenleyin.
- Portfolyo ögeleri için `assets/js/main.js` içindeki `portfolioItems` listesini güncelleyin.


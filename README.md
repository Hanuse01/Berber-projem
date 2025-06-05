# Berber Randevu Sistemi

Bu proje, Next.js 14, Prisma, Tailwind CSS ve TypeScript kullanılarak geliştirilmiş modern bir berber randevu yönetim sistemidir. Müşterilerin online randevu alabilmesi, berberlerin randevuları yönetebilmesi ve admin paneli üzerinden sistem yönetimi yapılabilmesini sağlar.

## Özellikler

- 🔐 Kullanıcı kimlik doğrulama ve yetkilendirme
- 📅 Online randevu sistemi
- 💇‍♂️ Hizmet yönetimi
- 👥 Müşteri ve berber profilleri
- 📱 Responsive tasarım
- 🔄 Gerçek zamanlı randevu durumu güncellemeleri
- 📊 Admin paneli

## Gereksinimler

- Node.js (18.x veya daha yüksek)
- npm veya yarn
- SQLite veritabanı

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [proje-url]
cd berber-randevu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `.env` dosyası oluşturun ve gerekli ortam değişkenlerini ekleyin:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Veritabanı migrasyonlarını çalıştırın:
```bash
npx prisma migrate dev
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamaya erişebilirsiniz.

## Veritabanı Yönetimi

- Veritabanı şemasını güncellemek için:
```bash
npx prisma migrate dev --name <degisiklik_adi>
```

- Prisma istemcisini güncellemek için:
```bash
npx prisma generate
```

- Veritabanını sıfırlamak için:
```bash
npx prisma migrate reset
```

- Veritabanı durumunu kontrol etmek için:
```bash
npx prisma migrate status
```

## Üretim için Derleme

```bash
npm run build
# veya
yarn build
```

Derlenen uygulamayı çalıştırmak için:
```bash
npm start
# veya
yarn start
```

## Proje Yapısı

- `app/`: Next.js App Router yapısı
  - `api/`: API route'ları
  - `components/`: UI bileşenleri
  - `lib/`: Yardımcı fonksiyonlar
- `prisma/`: Prisma şeması ve migrasyonlar
- `public/`: Statik dosyalar
- `src/`: Kaynak kodları
  - `components/`: Yeniden kullanılabilir bileşenler
  - `lib/`: Yardımcı fonksiyonlar ve Prisma istemcisi
  - `types/`: TypeScript tip tanımlamaları

## Teknolojiler

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [SQLite](https://www.sqlite.org/)

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Admin Giriş Bilgileri

Admin rolüne sahip örnek bir kullanıcı hesabı proje testi için kullanılacaktır:

- E-posta: tosunoglukerim@gmail.com
- Şifre: Kerim123

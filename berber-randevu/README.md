# Berberim - Randevu ve Yönetim Sistemi

Bu proje, Next.js, Prisma ve Tailwind CSS kullanılarak geliştirilmiş bir berber randevu ve yönetim sistemidir. Kullanıcılar randevu alabilir, adminler hizmet ve kullanıcı yönetimi yapabilir, kullanıcılar arası mesajlaşma mümkündür.

## Özellikler
- Kayıt olma, giriş yapma, profil yönetimi
- Rol tabanlı erişim (Admin, Kullanıcı, Berber)
- Admin paneli: kullanıcı, randevu ve hizmet yönetimi
- Kullanıcılar arası mesajlaşma
- Randevu alma ve iptal etme
- Hizmet ekleme, silme (admin)

## Kullanılan Teknolojiler
- **Next.js** (App Router, API Routes)
- **Prisma ORM** (veritabanı işlemleri)
- **SQLite** (geliştirme veritabanı)
- **Tailwind CSS** (arayüz tasarımı)
- **JWT** ile kimlik doğrulama

## Kurulum
1. Depoyu klonlayın:
   ```bash
   git clone <repo-url>
   cd berber-randevu
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. .env dosyasını oluşturun ve şu satırı ekleyin:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="gizliAnahtar"
   ```
4. Veritabanı migrasyonunu çalıştırın:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Admin Giriş Bilgileri (örnek)
```
E-posta: admin@example.com
Şifre: admin123
```
> Not: Kendi admin hesabınızı veritabanına ekleyebilir veya kayıt olduktan sonra rolünüzü admin olarak güncelleyebilirsiniz.

## Proje Yapısı
- `/src/app` : Sayfalar ve API route'ları
- `/prisma/schema.prisma` : Veritabanı şeması
- `/src/lib/prisma.ts` : Prisma client

## Kısa Kullanım
- Kayıt olun, giriş yapın.
- Profil sayfanızdan bilgilerinizi güncelleyebilirsiniz.
- Randevu alabilir, mevcut randevularınızı görebilir ve iptal edebilirsiniz.
- Mesajlar sayfasından diğer kullanıcılara mesaj gönderebilirsiniz.
- Admin panelinden kullanıcı, randevu ve hizmet yönetimi yapabilirsiniz.

## Lisans
MIT

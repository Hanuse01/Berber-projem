# Berberim - Randevu ve Yönetim Sistemi

## Proje Konusu ve Amacı
Bu proje, berberler için modern bir randevu ve yönetim sistemi sunmayı amaçlamaktadır. Kullanıcılar kolayca randevu alabilir, adminler hizmet ve kullanıcı yönetimi yapabilir, kullanıcılar arası mesajlaşma ile iletişim sağlanabilir. Amaç, hem müşteri hem de işletme tarafında dijitalleşmiş, kolay kullanılabilir ve güvenli bir platform sunmaktır.

## Planlama ve Geliştirme Süreci
- Proje, Next.js App Router mimarisiyle başlatıldı.
- Veritabanı şeması Prisma ile tasarlandı ve SQLite üzerinde geliştirildi.
- Öncelikle kullanıcı yönetimi, kimlik doğrulama ve rol tabanlı erişim altyapısı kuruldu.
- Ardından admin paneli, randevu ve hizmet yönetimi, mesajlaşma sistemi modülleri geliştirildi.
- Son aşamada arayüz iyileştirmeleri, hata yönetimi ve kod temizliği yapıldı.

## Modüller ve İşlevleri
- **Kullanıcı Yönetimi:** Kayıt, giriş, profil güncelleme, rol tabanlı erişim.
- **Admin Paneli:** Kullanıcı, randevu ve hizmet yönetimi; admin özel işlemler.
- **Randevu Sistemi:** Kullanıcılar hizmet seçip randevu alabilir, adminler randevuları onaylayabilir/iptal edebilir.
- **Mesajlaşma Sistemi:** Kullanıcılar arası metin tabanlı mesajlaşma.
- **Hizmet Yönetimi:** Adminler hizmet ekleyip silebilir.

## Kodlama Yapısı
- **Teknolojiler:** Next.js, Prisma ORM, SQLite, Tailwind CSS, JWT
- **Klasör Yapısı:**
  - `/src/app` : Sayfalar ve API route'ları
  - `/prisma/schema.prisma` : Veritabanı şeması
  - `/src/lib/prisma.ts` : Prisma client
- **Kod Kalitesi:** Fonksiyonel bileşenler, açıklayıcı yorumlar, hata yönetimi ve kullanıcı dostu bildirimler kullanıldı.

## Kazanımlar ve Değerlendirme
- Modern web teknolojileriyle tam işlevsel bir CRUD uygulaması geliştirildi.
- Rol tabanlı erişim, güvenli kimlik doğrulama ve kullanıcı deneyimi ön planda tutuldu.
- Proje sürecinde Next.js App Router, Prisma ORM ve Tailwind CSS ile ileri düzey pratik kazanıldı.
- Karşılaşılan zorluklar: JWT ile güvenli oturum yönetimi, rol/middleware kurgusu, kullanıcı dostu hata yönetimi.

## Bileşenlerin Genel İşleyişi (Teknik Özet)
- **Kayıt/Giriş:** Kullanıcılar kayıt olur, giriş yapar ve JWT tabanlı oturum açılır.
- **Profil:** Kullanıcı bilgileri güncellenebilir, şifre değiştirilebilir.
- **Randevu:** Kullanıcılar hizmet seçip tarih belirterek randevu alır, adminler randevuları yönetir.
- **Mesajlaşma:** Tüm kullanıcılar birbirine mesaj gönderebilir, gelen/giden mesajlar listelenir.
- **Admin Paneli:** Sadece adminler erişebilir, kullanıcı/rol/randevu/hizmet yönetimi yapılır.

## Sonuç
Proje, berberler için dijitalleşmiş, güvenli ve kullanıcı dostu bir randevu yönetim sistemi sunmaktadır. Kod kalitesi, modüler yapı ve kullanıcı deneyimi ön planda tutulmuştur.

---

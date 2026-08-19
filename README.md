# NextAI

Nsosyal'daki gönderileri arayıp AI ile özetleyen bir arama arayüzü.
Nsosyal'ın kendi API'si henüz herkese açık olmadığı için, gönderi arama şu an
gerçek ama geçici bir alternatif olarak halka açık bir Mastodon sunucusuna
(`mastodon.social`, hashtag zaman tüneli) bağlanıyor — Nsosyal Mastodon uyumlu
olduğu için mimari aynı kalacak, ileride sadece API adresi değişecek. Özet
çıkarma kısmı henüz yapay zeka kullanmıyor, basit bir yer tutucu metin
üretiyor (`src/services/postService.ts`).

## Kurulum

```bash
npm install
npm run dev
```

## Nasıl çalışıyor

- Ana sayfada bir konu/anahtar kelime ve zaman aralığı seçip aranıyor
- Arama, girilen kelimeyi hashtag'e çevirip Mastodon'un genel zaman
  tünelinden gerçek gönderileri çekiyor (kimlik doğrulama gerekmiyor)
- Arama iki aşamalı bir yükleme durumundan geçiyor (gönderiler toplanıyor →
  özet oluşturuluyor); ilk aşama gerçek ağ isteği, ikinci aşama şimdilik
  yapay bir gecikmeyle simüle ediliyor
- Sonuç sayfasında özet metni, içindeki `[1]` `[2]` gibi referans
  numaraları tıklanabilir ve altındaki kaynak kartına gidiyor
- Gönderi bulunamazsa veya istek başarısız olursa buna göre bir mesaj
  gösteriliyor
- Her arama `localStorage`'a kaydediliyor, Geçmiş sayfasından tekrar
  çalıştırılabiliyor

## Klasör yapısı

```
src/
  components/   tekil UI parçaları (SearchBar, SourceCard, vb.)
  pages/        route'lara bağlı sayfalar (Home, Results, History)
  services/     gönderi servisi + arama geçmişi
  types.ts      ortak tip tanımları
```

## Tasarım

Renk paleti ve genel görünüm Nsosyal'ın kendi arayüzünden alındı (koyu
tema varsayılan, `#1D4ED8` vurgu rengi). Sağ üstteki buton ile açık temaya
geçilebiliyor, tercih tarayıcıda saklanıyor.

# NextAI

Nsosyal'daki gönderileri arayıp AI ile özetleyen bir arama arayüzü. Şu an için
backend yok, tüm veriler `src/data` altındaki mock JSON dosyalarından geliyor
ve `src/services/mockDataService.ts` gerçek bir API çağrısı gibi davranıyor.

## Kurulum

```bash
npm install
npm run dev
```

## Nasıl çalışıyor

- Ana sayfada bir konu/anahtar kelime ve zaman aralığı seçip aranıyor
- Arama iki aşamalı bir yükleme durumundan geçiyor (gönderiler toplanıyor →
  özet oluşturuluyor), gerçekte ikisi de `mockDataService` içinde
  `setTimeout` ile simüle ediliyor
- Sonuç sayfasında özet metni, içindeki `[1]` `[2]` gibi referans
  numaraları tıklanabilir ve altındaki kaynak kartına gidiyor
- Her arama `localStorage`'a kaydediliyor, Geçmiş sayfasından tekrar
  çalıştırılabiliyor

## Klasör yapısı

```
src/
  components/   tekil UI parçaları (SearchBar, SourceCard, vb.)
  pages/        route'lara bağlı sayfalar (Home, Results, History)
  services/     mock veri servisi + arama geçmişi
  data/         mock gönderiler ve örnek özet
  types.ts      ortak tip tanımları
```

## Tasarım

Renk paleti ve genel görünüm Nsosyal'ın kendi arayüzünden alındı (koyu
tema varsayılan, `#1D4ED8` vurgu rengi). Sağ üstteki buton ile açık temaya
geçilebiliyor, tercih tarayıcıda saklanıyor.

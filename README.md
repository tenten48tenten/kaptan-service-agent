# Kaptan Hizmet Otomasyon Ajanı (Kaptan Service Agent)

Bu proje, Muğla ve genelinde boya-badana, güvenlik kamerası kurulumu ve bilgisayar arızaları alanında hizmet veren firmanız için müşteri bulan, onlarla konuşup taleplerini toplayan ve size yönlendiren bir yapay zeka ajanı sistemidir.

## Sistem Mimarisi

1. **Müşteri Arama Modülü (Lead Hunter):**
   - Belirlenen platformlardan (Google Maps, sosyal medya vb.) potansiyel müşteri ve işletme bilgilerini tarar.
2. **Yapay Zeka Müşteri Temsilcisi (AI Chatbot):**
   - WhatsApp, Telegram veya Web Chat üzerinden müşteriyi karşılar.
   - İhtiyaç duyulan hizmeti (Boyama, Kamera, PC tamiri) ve detayları öğrenir.
3. **Yönlendirme Modülü (Lead Forwarder):**
   - Toplanan bilgileri özetleyerek doğrudan yöneticinin (Kaptan) telefonuna/e-postasına iletir.

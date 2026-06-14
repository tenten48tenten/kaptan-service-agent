/**
 * KAPTAN HİZMETLERİ - WHATSAPP BOTU (ÜCRETSİZ SÜRÜM)
 * 
 * Bu script, telefonunuzdaki WhatsApp Web QR kodunu taratarak çalışır.
 * Müşterilerden gelen mesajları yakalar, onları Türkçe/İngilizce/Rusça dilinde karşılar,
 * taleplerini toplar ve telefonunuza Telegram üzerinden rapor olarak gönderir.
 * 
 * Kurulum için terminalde çalıştırılacak komutlar:
 * > npm install whatsapp-web.js qrcode-terminal dotenv
 * > node whatsapp-bot.js
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const leadsRepo = require('./leads-repo');

// Telegram için fetch fonksiyonu
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

// Müşteri oturum durumlarını (State) hafızada tutan nesne
const sessions = {};

// Yapay Zeka Ajanının Dil Sözlüğü
const botLexicon = {
    tr: {
        welcome: "Merhaba! Kaptan Hizmetlerine hoş geldiniz. ⚓\nEv boyama (badana), güvenlik kamerası kurulumu veya bilgisayar arızaları konusunda profesyonel destek sunuyoruz.\n\nSize yardımcı olabilmem için lütfen *Adınızı ve Soyadınızı* yazabilir misiniz?",
        prompt_service: "Teşekkürler. Hangi hizmetimizle ilgileniyorsunuz?\n\n1- *Boya Badana*\n2- *Güvenlik Kamerası*\n3- *Bilgisayar Tamiri*\n\n(Lütfen numara yazın veya belirtin)",
        prompt_location: "Harika. Hangi ilçedesiniz? (Fethiye / Göcek / Dalaman / Ortaca vb.)",
        prompt_phone: "Son olarak, size ulaşabileceğimiz güncel telefon numaranızı yazabilir misiniz?",
        success: "Tüm bilgilerinizi aldım. Kaptan en kısa sürede sizinle iletişime geçecektir. Teşekkür ederiz! 🙏"
    },
    en: {
        welcome: "Hello! Welcome to Kaptan Services. ⚓\nWe offer professional support for house painting, security camera installations, and computer repairs in Muğla region.\n\nTo assist you, could you please tell me your *Name and Surname*?",
        prompt_service: "Thank you. Which service are you interested in?\n\n1- *Painting & Whitewashing*\n2- *Security Cameras (CCTV)*\n3- *Computer Repair*\n\n(Please reply with number or service name)",
        prompt_location: "Great. Where are you located? (Fethiye / Göcek / Dalaman / Ortaca etc.)",
        prompt_phone: "Lastly, could you please provide your phone number so we can reach you?",
        success: "I have recorded all your details. Kaptan will contact you shortly. Thank you! 🙏"
    },
    ru: {
        welcome: "Здравствуйте! Добро пожаловать в Kaptan Services. ⚓\nМы предлагаем профессиональные услуги по покраске домов, установке камер видеонаблюдения и ремонту компьютеров.\n\nЧтобы я мог помочь вам, укажите ваше *Имя и Фамилию*?",
        prompt_service: "Спасибо. Какая услуга вас интересует?\n\n1- *Покраска и побелка*\n2- *Камеры безопасности*\n3- *Ремонт компьютеров*\n\n(Пожалуйста, ответьте цифрой или названием услуги)",
        prompt_location: "Отлично. Где вы находитесь? (Фетхие / Гёджек / Даламан / Ортаджа и т.д.)",
        prompt_phone: "Укажите, пожалуйста, ваш номер телефона для связи?",
        success: "Я записал все ваши данные. Kaptan свяжется с вами в ближайшее время. Спасибо! 🙏"
    }
};

// Gelen mesajın dilini tahmin eden basit fonksiyon (Gelişmiş AI entegrasyonu da yapılabilir)
function detectLanguage(text) {
    const lower = text.toLowerCase();
    const ruKeywords = ['привет', 'здравствуйте', 'ремонт', 'камер', 'покрас'];
    const enKeywords = ['hello', 'hi', 'paint', 'cctv', 'camera', 'repair', 'computer', 'setup'];
    
    for (let word of ruKeywords) {
        if (lower.includes(word)) return 'ru';
    }
    for (let word of enKeywords) {
        if (lower.includes(word)) return 'en';
    }
    return 'tr'; // Varsayılan olarak Türkçe
}

// Leads will be saved to leads.json and sent via the scheduled reports in server.js

// WhatsApp İstemcisi Kurulumu
const client = new Client({
    authStrategy: new LocalAuth(), // Giriş bilgilerini saklar, her seferinde QR kod istemez
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const fs = require('fs');

// QR Kod Oluşturma
client.on('qr', (qr) => {
    console.log('TELEFONUNUZDAN WHATSAPP WEB QR KODUNU TARAYIN:');
    qrcode.generate(qr, { small: true });

    // Save QR to HTML on user's Desktop
    const desktopPath = 'C:\\Users\\leveno\\Desktop\\Kaptan_WhatsApp_QR.html';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qr)}`;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Kaptan WhatsApp QR Kodu</title>
    <meta charset="utf-8">
    <style>
        body { background: #0f172a; color: #f8fafc; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: #1e293b; padding: 35px; border-radius: 24px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); }
        h2 { color: #06b6d4; margin-bottom: 8px; font-weight: bold; }
        p { color: #94a3b8; margin-bottom: 25px; font-size: 14px; }
        img { border: 12px solid white; border-radius: 12px; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    </style>
</head>
<body>
    <div class="card">
        <h2>⚓ KAPTAN WHATSAPP BOTU</h2>
        <p>Telefonunuzdan WhatsApp > Bağlı Cihazlar > Cihaz Bağla kısmından taratın.</p>
        <img src="${qrImageUrl}" alt="WhatsApp QR Code" />
    </div>
</body>
</html>
    `;
    
    try {
        fs.writeFileSync(desktopPath, htmlContent, 'utf8');
        console.log('\n======================================================');
        console.log('TEMİZ QR KOD DOSYASI MASAÜSTÜNÜZDE OLUŞTURULDU!');
        console.log('Lütfen Masaüstündeki "Kaptan_WhatsApp_QR.html" dosyasına çift tıklayıp açarak taratın.');
        console.log('======================================================\n');
    } catch (err) {
        console.error('Masaüstüne QR dosyası yazılamadı:', err.message);
    }
});

// Bağlantı Başarılı Olduğunda
client.on('ready', () => {
    console.log('Kaptan WhatsApp Botu Başarıyla Hazır ve Çalışıyor!');
});

// Mesaj Geldiğinde
client.on('message', async (msg) => {
    // Sadece kişisel sohbetlerden gelen mesajları kabul et (grupları engelle)
    if (msg.from.includes('@g.us')) return;

    const sender = msg.from;
    const text = msg.body.trim();

    // Yeni oturum veya sıfırlama isteği
    if (!sessions[sender] || text.toLowerCase() === 'reset' || text.toLowerCase() === 'iptal') {
        const detected = detectLanguage(text);
        sessions[sender] = {
            step: 'welcome',
            lang: detected,
            name: '',
            service: '',
            location: '',
            phone: sender.split('@')[0] // Varsayılan telefon numarası
        };
        await msg.reply(botLexicon[detected].welcome);
        sessions[sender].step = 'ask_name';
        return;
    }

    const session = sessions[sender];
    const lang = session.lang;

    if (session.step === 'ask_name') {
        session.name = text;
        session.step = 'ask_service';
        await msg.reply(botLexicon[lang].prompt_service);
    } 
    else if (session.step === 'ask_service') {
        session.service = text;
        session.step = 'ask_location';
        await msg.reply(botLexicon[lang].prompt_location);
    } 
    else if (session.step === 'ask_location') {
        session.location = text;
        session.step = 'ask_phone';
        await msg.reply(botLexicon[lang].prompt_phone);
    } 
    else if (session.step === 'ask_phone') {
        session.phone = text;
        session.step = 'completed';
        await msg.reply(botLexicon[lang].success);
        
        // Save lead locally to leads.json
        leadsRepo.saveLead({
            name: session.name,
            service: session.service,
            location: session.location,
            phone: session.phone,
            source: 'WhatsApp'
        });
        
        // Oturumu sıfırla
        delete sessions[sender];
    }
});

// Botu Başlat
client.initialize();

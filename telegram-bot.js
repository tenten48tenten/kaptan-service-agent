const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
require('dotenv').config();
const indeedHunter = require('./indeed-hunter');
const socialHunter = require('./social-hunter');

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!telegramToken || !geminiApiKey) {
    console.error("Hata: TELEGRAM_BOT_TOKEN veya GEMINI_API_KEY .env dosyasında eksik!");
    process.exit(1);
}

// Gemini İstemcisi Başlatma
const ai = new GoogleGenerativeAI(geminiApiKey);

// Botun Çalışma Kişiliği ve Talimatları
const systemInstruction = `
Sen Kaptan Hizmetleri firmasının sahibi ve uzman teknik destek elemanı olan Kaptan'sın.
Fethiye, Göcek, Dalaman ve Ortaca bölgelerinde İç/Dış Cephe Boya (Jotun boya ile), Güvenlik Kamerası (CCTV kurulumları) ve Bilgisayar/Laptop Tamiri (Wi-Fi sinyal güçlendirme) işleri yapıyorsun.
Sorulan sorulara samimi, yardımsever, tecrübeli ve profesyonel bir usta (Kaptan) edasıyla cevap ver.
Kısa ve net ol. Müşterilerin dertlerine pratik çözümler sun.
Gerektiğinde müşterilerden randevu veya teklif için iletişim bilgilerini iste.
`;

let offset = 0;

async function getUpdates() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/getUpdates?offset=${offset}&timeout=30`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                offset = update.update_id + 1;
                if (update.message && update.message.text) {
                    await handleMessage(update.message);
                }
            }
        }
    } catch (err) {
        console.error("Updates alınırken hata oluştu:", err.message);
    }
    setTimeout(getUpdates, 1000);
}

async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;
    
    // Sizin kendi chat_id bildirimleriniz ile botla konuşan diğer kişileri ayırt etmek için
    console.log(`Telegram Botuna Gelen Mesaj [ChatID: ${chatId}]: ${text}`);

    if (text.startsWith('/start')) {
        await sendTelegramMessage(chatId, "⚓ Merhaba Kaptan! Ben hazır ve nazırım. 7/24 buradayım. Bana dilediğin soruyu sorabilirsin, müşterilere de aynı samimiyetle cevap vereceğim.");
        return;
    }

    if (text.startsWith('/sosyal') || text.startsWith('/taramayap')) {
        await sendTelegramMessage(chatId, "⚓ Sosyal medya ve platformlar taranıyor, lütfen bekleyin...");
        try {
            const [jobs, socialLeads] = await Promise.all([
                indeedHunter.getFethiyeJobs().catch(err => {
                    console.error('Indeed hunter error:', err);
                    return [];
                }),
                socialHunter.getSocialLeads().catch(err => {
                    console.error('Social hunter error:', err);
                    return [];
                })
            ]);

            let reply = `⚓ *ANLIK TARAMA SONUÇLARI*\n`;
            reply += `📅 *Saat:* ${new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}\n`;
            reply += `──────────────────\n\n`;

            reply += `📱 *SOSYAL MEDYA & HİZMET TALEPLERİ*\n`;
            reply += `──────────────────\n`;
            if (socialLeads.length === 0) {
                reply += `📭 Fethiye'de yeni sosyal medya talebi bulunamadı.\n`;
                reply += `──────────────────\n\n`;
            } else {
                const displayLeads = socialLeads.slice(0, 10);
                displayLeads.forEach((lead, index) => {
                    reply += `${index + 1}️⃣ *Platform:* ${lead.platform}\n`;
                    reply += `📌 *Başlık:* ${lead.title}\n`;
                    reply += `🔗 [Bağlantı Git](${lead.url})\n`;
                    if (lead.snippet) {
                        reply += `📝 *Detay:* _${lead.snippet}_\n`;
                    }
                    reply += `──────────────────\n`;
                });
                if (socialLeads.length > 10) {
                    reply += `➕ ve ${socialLeads.length - 10} diğer talep daha bulundu.\n`;
                    reply += `──────────────────\n`;
                }
                reply += `\n`;
            }

            reply += `🔍 *İNDEED İŞ İLANLARI (FETHİYE)*\n`;
            reply += `──────────────────\n`;
            if (jobs.length === 0) {
                reply += `📭 Fethiye'de yeni iş ilanı bulunamadı.\n`;
                reply += `──────────────────`;
            } else {
                jobs.forEach((job, index) => {
                    reply += `${index + 1}️⃣ *İlan:* ${job.title}\n`;
                    reply += `🔗 [Detayları Gör](${job.url})\n`;
                    if (job.snippet) {
                        reply += `📝 *Özet:* _${job.snippet}_\n`;
                    }
                    reply += `──────────────────\n`;
                });
            }

            await sendTelegramMessage(chatId, reply);
        } catch (err) {
            await sendTelegramMessage(chatId, `❌ Tarama sırasında bir hata oluştu: ${err.message}`);
        }
        return;
    }

    try {
        const model = ai.getGenerativeModel({
            model: "gemini-3.5-flash",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent(text);
        const reply = result.response.text();
        await sendTelegramMessage(chatId, reply);
    } catch (err) {
        console.error("Gemini yanıt oluştururken hata:", err.message);
        
        // Rule-based Fallback Response
        const lower = text.toLowerCase();
        let reply = "";
        
        if (lower.includes("boya") || lower.includes("badana") || lower.includes("paint")) {
            reply = "⚓ Kaptan Hizmetleri: Fethiye, Göcek, Dalaman ve Ortaca bölgelerinde Jotun kalitesinde profesyonel iç/dış cephe boya badana işleri yapıyoruz. Detaylı bilgi için telefon numaranızı yazabilirsiniz!";
        } else if (lower.includes("kamera") || lower.includes("cctv") || lower.includes("alarm") || lower.includes("güvenlik")) {
            reply = "⚓ Kaptan Hizmetleri: Ev ve iş yerleriniz için 7/24 mobilden izlenebilir HD güvenlik kamerası ve alarm sistemleri kuruyoruz. Bilgi almak için numaranızı bırakabilirsiniz.";
        } else if (lower.includes("bilgisayar") || lower.includes("tamir") || lower.includes("pc") || lower.includes("wifi") || lower.includes("laptop")) {
            reply = "⚓ Kaptan Hizmetleri: Laptop/PC arızaları, format/yazılım ve büyük villalar için Wi-Fi sinyal güçlendirme hizmeti sunuyoruz. Telefon numaranızı bırakırsanız Kaptan sizi hemen arayacaktır.";
        } else if (lower.includes("konum") || lower.includes("nerede") || lower.includes("adres") || lower.includes("fethiye") || lower.includes("göcek") || lower.includes("dalaman") || lower.includes("ortaca")) {
            reply = "⚓ Kaptan Hizmetleri olarak Fethiye, Göcek, Dalaman ve Ortaca bölgelerinde gezici teknik ekibimizle yerinde hizmet sunmaktayız.";
        } else {
            reply = "⚓ Kaptan Hizmetleri'ne hoş geldiniz! Şu an yapay zeka asistanı çevrimdışı ancak size yardımcı olmak isteriz. Ev boyama, güvenlik kamerası veya bilgisayar tamiri işleriniz için telefon numaranızı yazın, Kaptan sizi hemen arasın!";
        }
        
        await sendTelegramMessage(chatId, reply);
    }
}

async function sendTelegramMessage(chatId, text) {
    try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });
    } catch (err) {
        console.error("Mesaj gönderilirken hata:", err.message);
    }
}

console.log("⚓ Kaptan Telegram Yapay Zeka Ajanı Başlatılıyor...");
getUpdates();

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const leadsRepo = require('./leads-repo');
const indeedHunter = require('./indeed-hunter');
const socialHunter = require('./social-hunter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static front-end files
app.use(express.static(path.join(__dirname)));

// API Endpoint to receive leads from the chatbot
app.post('/api/leads', async (req, res) => {
    const { name, service, location, phone, initialQuery, source } = req.body;
    
    console.log('--- NEW LEAD RECEIVED ---');
    console.log(`Name: ${name}`);
    console.log(`Service: ${service}`);
    console.log(`Location: ${location}`);
    console.log(`Phone: ${phone}`);
    console.log(`Initial Query: ${initialQuery}`);
    console.log(`Source: ${source || 'Web'}`);
    console.log('-------------------------');

    // Save lead locally
    leadsRepo.saveLead({
        name,
        service,
        location,
        phone,
        initialQuery,
        source: source || 'Web'
    });

    res.status(200).json({ success: true, message: 'Lead saved successfully!' });
});

// Function to generate and send scheduled summary report to Telegram
async function sendScheduledReport() {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_SOHBET_ID;

    if (!telegramToken || !telegramChatId) {
        console.log('[Zamanlayıcı] Telegram ayarları .env dosyasında eksik. Rapor gönderilemedi.');
        return false;
    }

    // Gelen yeni talepleri, Indeed ilanlarını ve sosyal medya fırsatlarını eşzamanlı olarak al
    const [leads, jobs, socialLeads] = await Promise.all([
        leadsRepo.getUnreportedLeads(),
        indeedHunter.getFethiyeJobs().catch(err => {
            console.error('[Zamanlayıcı] Indeed ilanları alınırken hata oluştu:', err.message);
            return [];
        }),
        socialHunter.getSocialLeads().catch(err => {
            console.error('[Zamanlayıcı] Sosyal medya taranırken hata oluştu:', err.message);
            return [];
        })
    ]);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    let message = `⚓ *KAPTAN GÜNLÜK ÖZET RAPORU*\n`;
    message += `📅 *Tarih/Saat:* ${formattedDate} ${formattedTime}\n`;
    message += `──────────────────\n\n`;

    // 1. Müşteri Talepleri Bölümü
    message += `👥 *YENİ MÜŞTERİ TALEPLERİ*\n`;
    message += `──────────────────\n`;
    if (leads.length === 0) {
        message += `📭 Bu dönemde yeni müşteri talebi bulunmamaktadır.\n`;
        message += `──────────────────\n\n`;
    } else {
        message += `Toplam Yeni Talep: ${leads.length} adet\n\n`;
        leads.forEach((lead, index) => {
            message += `${index + 1}️⃣ *Müşteri:* ${lead.name}\n`;
            message += `🛠️ *Hizmet:* ${lead.service}\n`;
            message += `📍 *Konum:* ${lead.location}\n`;
            message += `📞 *Telefon:* ${lead.phone}\n`;
            message += `🌐 *Kaynak:* ${lead.source}\n`;
            if (lead.initialQuery) {
                message += `💬 *Mesaj:* "${lead.initialQuery}"\n`;
            }
            message += `──────────────────\n`;
        });
        message += `\n`;
    }

    // 2. Indeed İş İlanları Bölümü
    message += `🔍 *İNDEED İŞ İLANLARI (FETHİYE)*\n`;
    message += `──────────────────\n`;
    if (jobs.length === 0) {
        message += `📭 Fethiye'de yeni boya veya kamera ilanı bulunamadı.\n`;
        message += `──────────────────\n\n`;
    } else {
        jobs.forEach((job, index) => {
            message += `${index + 1}️⃣ *İlan:* ${job.title}\n`;
            message += `🔗 [Detayları Gör](${job.url})\n`;
            if (job.snippet) {
                message += `📝 *Özet:* _${job.snippet}_\n`;
            }
            message += `──────────────────\n`;
        });
        message += `\n`;
    }

    // 3. Sosyal Medya & Platform Talepleri Bölümü
    message += `📱 *SOSYAL MEDYA & HİZMET TALEPLERİ*\n`;
    message += `──────────────────\n`;
    if (socialLeads.length === 0) {
        message += `📭 Fethiye'de yeni boya/tadilat sosyal medya talebi bulunamadı.\n`;
        message += `──────────────────`;
    } else {
        const displayLeads = socialLeads.slice(0, 10);
        displayLeads.forEach((lead, index) => {
            message += `${index + 1}️⃣ *Platform:* ${lead.platform}\n`;
            message += `📌 *Başlık:* ${lead.title}\n`;
            message += `🔗 [Bağlantı Git](${lead.url})\n`;
            if (lead.snippet) {
                message += `📝 *Mesaj/Detay:* _${lead.snippet}_\n`;
            }
            message += `──────────────────\n`;
        });
        if (socialLeads.length > 10) {
            message += `➕ ve ${socialLeads.length - 10} diğer talep daha bulundu.\n`;
            message += `──────────────────`;
        }
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message.trim(),
                parse_mode: 'Markdown'
            })
        });
        const data = await response.json();
        if (data.ok) {
            console.log('[Zamanlayıcı] Özet rapor Telegram\'a başarıyla gönderildi.');
            if (leads.length > 0) {
                const leadIds = leads.map(l => l.id);
                leadsRepo.markLeadsAsReported(leadIds);
            }
            return true;
        } else {
            console.error('[Zamanlayıcı] Telegram API hatası:', data.description);
            return false;
        }
    } catch (err) {
        console.error('[Zamanlayıcı] Rapor gönderilirken hata oluştu:', err.message);
        return false;
    }
}

// Route to manually trigger the summary report for testing
app.get('/api/trigger-report', async (req, res) => {
    try {
        const sent = await sendScheduledReport();
        if (sent) {
            res.status(200).json({ success: true, message: 'Özet rapor başarıyla gönderildi!' });
        } else {
            res.status(500).json({ success: false, message: 'Rapor gönderilirken hata oluştu.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to manually trigger social media crawling
app.get('/api/trigger-social', async (req, res) => {
    try {
        const results = await socialHunter.getSocialLeads();
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Scheduler loop checking for 10:00 and 18:00 local time
let lastReportTime = '';
function startScheduler() {
    console.log("⚓ Kaptan Zamanlayıcı Başlatıldı (Rapor Saatleri: 10:00 ve 18:00)");
    
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        const timeString = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${hours}:${minutes}`;
        
        if (((hours === 10 && minutes === 0) || (hours === 18 && minutes === 0)) && lastReportTime !== timeString) {
            lastReportTime = timeString;
            console.log(`[Zamanlayıcı] Saat ${hours}:00 - Rapor gönderiliyor...`);
            sendScheduledReport();
        }
    }, 30000); // Her 30 saniyede bir kontrol et
}

// Test endpoint to verify Telegram notifications
app.get('/api/test-telegram', async (req, res) => {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_SOHBET_ID;

    if (!telegramToken || !telegramChatId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Telegram credentials are not set in .env file! Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.' 
        });
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: '🔔 *KAPTAN BİLDİRİM TESTİ*\n\nTelegram bağlantınız başarıyla kurulmuştur! Yeni müşteri talepleri buraya düşecektir.',
                parse_mode: 'Markdown'
            })
        });
        const data = await response.json();
        if (data.ok) {
            return res.status(200).json({ success: true, message: 'Test message sent successfully to your Telegram!' });
        } else {
            return res.status(500).json({ success: false, message: `Telegram API error: ${data.description}` });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: `Connection failed: ${err.message}` });
    }
});

// Fallback to serving index.html for undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Kaptan Service Server running on port ${PORT}`);
    startScheduler();
});

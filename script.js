// ===== CONFIG =====
const PHONE_NUMBER = '0552 478 52 73';
const PHONE_HREF  = 'tel:+905524785273';
const WA_HREF     = 'https://wa.me/905524785273';

// Set all phone links on page
function applyPhoneLinks() {
    document.querySelectorAll('[id*="phone"]').forEach(el => {
        if (el.tagName === 'A') el.href = PHONE_HREF;
        else el.textContent = PHONE_NUMBER;
    });
    document.querySelectorAll('[id*="call"]').forEach(el => {
        if (el.tagName === 'A') el.href = PHONE_HREF;
    });
    document.querySelectorAll('[id*="wa"]').forEach(el => {
        if (el.tagName === 'A') el.href = WA_HREF;
    });
    // Explicit targets
    const pn = document.getElementById('top-phone-number');
    if (pn) pn.textContent = PHONE_NUMBER;
    const hn = document.getElementById('hero-phone-number');
    if (hn) hn.textContent = PHONE_NUMBER;
    const cn = document.getElementById('cta-phone-number');
    if (cn) cn.textContent = PHONE_NUMBER;
}

// ===== TRANSLATIONS =====
const translations = {
    tr: {
        meta_title: "Fethiye Teknik Servis | CCTV Kamera Kurulum & Bilgisayar Servisi",
        meta_desc: "Fethiye, Göcek, Dalaman ve Ortaca'da güvenlik kamerası kurulumu ve bilgisayar teknik servis hizmetleri. Hızlı ve garantili çözümler.",
        meta_keywords: "fethiye güvenlik kamerası, fethiye bilgisayar tamiri, fethiye cctv, dalaman kamera kurulum, fethiye teknik servis",
        logo_accent: "TEKNİK SERVİS",
        nav_contact: "Hemen Ara",
        hero_tagline: "⭐ Güvenilir & Hızlı Teknik Hizmet — Fethiye",
        hero_title: "Fethiye'de <span class='gradient-text'>Güvenlik Kamerası</span><br>& Bilgisayar Teknik Servisi",
        hero_desc: "Güvenlik kamerası kurulumu, bilgisayar arızaları ve ağ sorunlarınız için uzman ekibimizle yanınızdayız. Hızlı müdahale, garantili işçilik.",
        hero_cta: "Teklif Al",
        hero_secondary: "Hizmetlerimiz",
        call_now_label: "Hemen Arayın",
        whatsapp_btn: "WhatsApp'ta Yaz",
        service_camera_title: "Güvenlik Kamerası",
        service_camera_desc: "HD CCTV, IP kamera, uzaktan mobil izleme kurulumu.",
        service_pc_title: "Bilgisayar Tamiri",
        service_pc_desc: "Yazılım, donanım ve ağ/Wi-Fi sorunlarına hızlı çözüm.",
        service_net_title: "Ağ & Wi-Fi Kurulum",
        service_net_desc: "Villa ve işyerleri için güçlü Mesh Wi-Fi altyapısı.",
        services_header_title: "Hizmetlerimiz",
        services_header_subtitle: "Fethiye, Göcek, Dalaman, Ortaca ve Muğla genelinde sunduğumuz profesyonel teknik hizmetler",
        detail_camera_title: "Güvenlik Kamerası & CCTV",
        detail_camera_desc: "Evinizi ve iş yerinizi cep telefonunuzdan 7/24 izleyin. IP kamera, analog HD ve kablosuz çözümlerimizle huzur bulun.",
        detail_camera_item1: "Uzaktan mobilden canlı izleme kurulumu",
        detail_camera_item2: "Gece görüşlü ve hareket sensörlü kameralar",
        detail_camera_item3: "Yıllık bakım ve arıza giderme desteği",
        detail_pc_title: "Bilgisayar & Ağ Teknolojileri",
        detail_pc_desc: "Yavaşlayan bilgisayarlar, çöken sistemler, Wi-Fi çekim problemleri veya veri kurtarma ihtiyaçlarınız için hızlı servis.",
        detail_pc_item1: "Windows / MacOS kurulumu ve virüs temizleme",
        detail_pc_item2: "Büyük villalar için Wi-Fi sinyal güçlendirme (Mesh)",
        detail_pc_item3: "Donanım yükseltme (SSD ve RAM montajı)",
        detail_paint_title: "İç & Dış Cephe Boyama",
        detail_paint_desc: "Villalarınız ve evleriniz için en kaliteli markalarla (Jotun, Filli Boya) temiz işçilik sunuyoruz.",
        detail_paint_item1: "Detaylı yüzey hazırlığı ve astar",
        detail_paint_item2: "Rutubet ve çatlak onarımı",
        detail_paint_item3: "Bahçe duvarı ve dış cephe boyama",
        card_call_btn: "Bilgi Al",
        why_us_title: "Neden Biz?",
        why_time_title: "Hızlı Müdahale",
        why_time_desc: "Fethiye, Göcek, Dalaman ve Ortaca genelinde arızalarınıza en kısa sürede dönüş sağlıyoruz.",
        why_quality_title: "Garantili İşçilik",
        why_quality_desc: "Kullandığımız malzemeler ve yaptığımız tüm kurulumlar firmamızın garantisi altındadır.",
        why_lang_title: "Çok Dilli Destek",
        why_lang_desc: "İngilizce, Rusça ve Türkçe konuşuyoruz. Yabancı müşterilerimizle doğrudan kendi dillerinde anlaşıyoruz.",
        cta_title: "Hemen İletişime Geçin",
        cta_desc: "Sorunuz mu var? Teklif mi almak istiyorsunuz? Sizi arayalım.",
        footer_sub: "Fethiye, Göcek, Dalaman, Ortaca ve Muğla Çevresi Teknik Servis",
        bot_status: "Çevrimiçi (Destek)",
        chat_welcome_meta: "Fethiye Teknik Servis AI bağlandı.",
        chat_welcome: "Merhaba! Fethiye Teknik Servis'e hoş geldiniz 👋 Güvenlik kamerası kurulumu veya bilgisayar arızaları konusunda destek sunuyoruz. Nasıl yardımcı olabilirim?",
        chat_placeholder: "Mesajınızı yazın...",
        chat_lead_success: "Harika! Bilgilerinizi kaydettim. En kısa sürede sizi arayacağız. Teşekkürler!",
        prompt_name: "Adınızı ve soyadınızı öğrenebilir miyim?",
        prompt_service: "Hangi hizmetimizle ilgileniyorsunuz? (Kamera / Bilgisayar / Boya)",
        prompt_location: "Neredesiniz? (Fethiye / Göcek / Dalaman / Ortaca / Diğer)",
        prompt_phone: "Size ulaşabileceğimiz telefon numaranızı yazar mısınız?",
        fab_call: "Ara",
        fab_chat: "Teklif",
        locations_title: "Hizmet Bölgelerimiz",
        locations_subtitle: "Fethiye ve çevre ilçelerdeki tüm mahalle ve beldelere hızlı servis sağlıyoruz",
        loc_cat1_title: "Fethiye Merkez & Mahalleleri",
        loc_cat2_title: "Fethiye Çevresi & Turistik Bölgeler",
        loc_cat3_title: "Çevre İlçeler & Beldeler",
    },
    en: {
        meta_title: "Fethiye Tech Service | CCTV Camera Installation & Computer Service",
        meta_desc: "Professional CCTV security camera installation and computer technical support in Fethiye, Göcek, Dalaman & Ortaca. Fast, reliable solutions.",
        meta_keywords: "fethiye cctv, fethiye computer repair, fethiye security camera, dalaman cctv installation",
        logo_accent: "TECH SERVICE",
        nav_contact: "Call Now",
        hero_tagline: "⭐ Trusted & Fast Tech Services — Fethiye",
        hero_title: "<span class='gradient-text'>Security Cameras</span><br>& Computer Service in Fethiye",
        hero_desc: "Expert team for security camera setup, computer repair, and network issues. Fast response, guaranteed workmanship.",
        hero_cta: "Get a Quote",
        hero_secondary: "Our Services",
        call_now_label: "Call Now",
        whatsapp_btn: "WhatsApp Us",
        service_camera_title: "Security Cameras",
        service_camera_desc: "HD CCTV, IP cameras, remote mobile monitoring.",
        service_pc_title: "Computer Repair",
        service_pc_desc: "Software, hardware, and Wi-Fi issues resolved fast.",
        service_net_title: "Network & Wi-Fi",
        service_net_desc: "Strong Mesh Wi-Fi infrastructure for villas & offices.",
        services_header_title: "Our Services",
        services_header_subtitle: "Professional tech services across Fethiye, Göcek, Dalaman, Ortaca & Muğla",
        detail_camera_title: "Security Cameras & CCTV",
        detail_camera_desc: "Monitor your home or workplace 24/7 from your phone. IP, HD analog, and wireless solutions.",
        detail_camera_item1: "Live remote mobile view setup",
        detail_camera_item2: "Night-vision and motion-detection cameras",
        detail_camera_item3: "Annual maintenance and repair support",
        detail_pc_title: "Computer & Network Tech",
        detail_pc_desc: "Quick service for slow computers, crashes, Wi-Fi issues, or data recovery.",
        detail_pc_item1: "Windows / MacOS installation & virus removal",
        detail_pc_item2: "Wi-Fi signal boosting (Mesh) for large villas",
        detail_pc_item3: "Hardware upgrades (SSD & RAM installation)",
        detail_paint_title: "Interior & Exterior Painting",
        detail_paint_desc: "Top-quality painting for your villas using premium brands (Jotun). Clean, careful work guaranteed.",
        detail_paint_item1: "Surface preparation and priming",
        detail_paint_item2: "Damp and crack repair",
        detail_paint_item3: "Garden walls and facade painting",
        card_call_btn: "Get Info",
        why_us_title: "Why Choose Us?",
        why_time_title: "Fast Response",
        why_time_desc: "Quick replies and on-site visits across Fethiye, Göcek, Dalaman & Ortaca.",
        why_quality_title: "Guaranteed Work",
        why_quality_desc: "All installations and repairs are backed by our company warranty.",
        why_lang_title: "Multilingual",
        why_lang_desc: "We speak English, Russian, and Turkish — communicating with clients in their own language.",
        cta_title: "Contact Us Now",
        cta_desc: "Have a question or need a quote? We'll call you back.",
        footer_sub: "Authorized Tech Service Provider — Fethiye, Göcek, Dalaman, Ortaca & Muğla",
        bot_status: "Online (Support)",
        chat_welcome_meta: "Fethiye Tech Service AI connected.",
        chat_welcome: "Hello! Welcome to Fethiye Tech Service 👋 We help with security cameras, computer repair, and network setup. How can I help you?",
        chat_placeholder: "Type your message...",
        chat_lead_success: "Great! I've saved your details. We'll call you as soon as possible. Thank you!",
        prompt_name: "Could you tell me your name?",
        prompt_service: "Which service interests you? (Camera / Computer / Painting)",
        prompt_location: "Where are you? (Fethiye / Göcek / Dalaman / Ortaca / Other)",
        prompt_phone: "Please share your phone number so we can reach you.",
        fab_call: "Call",
        fab_chat: "Quote",
        locations_title: "Service Areas",
        locations_subtitle: "We provide fast service to all neighborhoods and districts in Fethiye and surrounding areas",
        loc_cat1_title: "Fethiye Center & Neighborhoods",
        loc_cat2_title: "Around Fethiye & Tourist Areas",
        loc_cat3_title: "Surrounding Towns & Districts",
    },
    ru: {
        meta_title: "Фетхие Teknik Servis | Установка CCTV камер & Ремонт компьютеров",
        meta_desc: "Профессиональная установка камер видеонаблюдения и ремонт компьютеров в Фетхие, Гёджек, Даламан и Ортаджа.",
        meta_keywords: "видеонаблюдение фетхие, ремонт компьютеров фетхие, камеры фетхие, cctv даламан",
        logo_accent: "TECH SERVICE",
        nav_contact: "Позвонить",
        hero_tagline: "⭐ Надежный и быстрый техсервис — Фетхие",
        hero_title: "<span class='gradient-text'>Камеры безопасности</span><br>и ремонт ПК в Фетхие",
        hero_desc: "Установка камер, ремонт компьютеров и настройка сети. Быстрый выезд, гарантия качества.",
        hero_cta: "Получить смету",
        hero_secondary: "Наши услуги",
        call_now_label: "Позвонить",
        whatsapp_btn: "Написать в WhatsApp",
        service_camera_title: "Камеры безопасности",
        service_camera_desc: "HD CCTV, IP-камеры, удалённый мониторинг.",
        service_pc_title: "Ремонт ПК",
        service_pc_desc: "Устранение неполадок ПО, железа и Wi-Fi.",
        service_net_title: "Сеть & Wi-Fi",
        service_net_desc: "Мощная Mesh Wi-Fi инфраструктура для вилл и офисов.",
        services_header_title: "Наши услуги",
        services_header_subtitle: "Профессиональный техсервис в Фетхие, Гёджек, Даламан, Ортаджа и регионе Мугла",
        detail_camera_title: "Камеры наблюдения & CCTV",
        detail_camera_desc: "Следите за домом 24/7 с телефона. IP, HD аналоговые и беспроводные камеры.",
        detail_camera_item1: "Настройка удалённого просмотра на телефоне",
        detail_camera_item2: "Камеры с ночным видением и датчиками движения",
        detail_camera_item3: "Ежегодное обслуживание и ремонт",
        detail_pc_title: "Компьютеры & Сети",
        detail_pc_desc: "Медленный ПК, сбои системы, Wi-Fi или потеря данных — поможем быстро.",
        detail_pc_item1: "Установка Windows / MacOS, удаление вирусов",
        detail_pc_item2: "Усиление Wi-Fi (Mesh) для больших вилл",
        detail_pc_item3: "Замена SSD и RAM",
        detail_paint_title: "Покраска фасадов и интерьеров",
        detail_paint_desc: "Качественная покраска вилл и домов с брендами Jotun. Бережная работа.",
        detail_paint_item1: "Подготовка поверхности и грунтовка",
        detail_paint_item2: "Устранение сырости и трещин",
        detail_paint_item3: "Покраска садовых стен и фасадов",
        card_call_btn: "Узнать",
        why_us_title: "Почему мы?",
        why_time_title: "Быстрый ответ",
        why_time_desc: "Быстрый выезд и ответ на запросы в Фетхие, Гёджек, Даламан и Ортаджа.",
        why_quality_title: "Гарантия качества",
        why_quality_desc: "Все наши работы и установки — под гарантией компании.",
        why_lang_title: "Многоязычность",
        why_lang_desc: "Говорим на английском, русском и турецком языках.",
        cta_title: "Свяжитесь с нами",
        cta_desc: "Есть вопрос или нужна смета? Мы перезвоним.",
        footer_sub: "Техсервис в Фетхие, Гёджек, Даламан, Ортаджа и регионе Мугла",
        bot_status: "В сети (Поддержка)",
        chat_welcome_meta: "AI-агент Fethiye Teknik Servis подключён.",
        chat_welcome: "Здравствуйте! Добро пожаловать в Fethiye Teknik Servis 👋 Помогаем с камерами, ремонтом ПК и настройкой сети. Чем могу помочь?",
        chat_placeholder: "Введите сообщение...",
        chat_lead_success: "Отлично! Данные записаны. Мы свяжемся с вами в ближайшее время. Спасибо!",
        prompt_name: "Как вас зовут?",
        prompt_service: "Какая услуга вас интересует? (Камеры / Компьютер / Покраска)",
        prompt_location: "Где вы находитесь? (Фетхие / Гёджек / Даламан / Ортаджа / Другое)",
        prompt_phone: "Укажите ваш номер телефона.",
        fab_call: "Звонить",
        fab_chat: "Смета",
        locations_title: "Зоны обслуживания",
        locations_subtitle: "Мы предоставляем быстрое обслуживание во всех районах Фетхие и окрестностях",
        loc_cat1_title: "Центр Фетхие и районы",
        loc_cat2_title: "Окрестности Фетхие и туристические зоны",
        loc_cat3_title: "Соседние города и районы",
    }
};

let currentLang = 'tr';

// ===== LANGUAGE SWITCH =====
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setLanguage(btn.getAttribute('data-lang'));
    });
});

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const t = translations[lang];
    document.title = t.meta_title;
    document.getElementById('meta-title') && (document.getElementById('meta-title').innerText = t.meta_title);
    document.getElementById('meta-desc') && document.getElementById('meta-desc').setAttribute('content', t.meta_desc);
    document.getElementById('meta-keywords') && document.getElementById('meta-keywords').setAttribute('content', t.meta_keywords);

    const logoEl = document.getElementById('logo-text');
    if (logoEl) logoEl.innerHTML = `<i class="fa-solid fa-anchor logo-icon"></i> FETHİYE <span class="accent-text">${t.logo_accent}</span>`;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.innerHTML = t.hero_title;
    const heroDesc = document.getElementById('hero-desc');
    if (heroDesc) heroDesc.innerText = t.hero_desc;

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && chatMessages.children.length <= 2) {
        chatMessages.innerHTML = `
            <div class="message system-msg"><span>${t.chat_welcome_meta}</span></div>
            <div class="message bot-msg"><p>${t.chat_welcome}</p></div>
        `;
    }
}

// ===== CHAT WIDGET =====
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');

// All triggers that open the chat
document.querySelectorAll('.start-chat-trigger').forEach(el => {
    el.addEventListener('click', () => { if (chatWindow) chatWindow.classList.add('open'); });
});
if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

// ===== CHATBOT FLOW =====
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

let leadForm = { name: '', service: '', location: '', phone: '' };
let step = 'welcome';

if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
if (chatSend) chatSend.addEventListener('click', sendMessage);

function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isUser ? 'user-msg' : 'bot-msg');
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const el = document.createElement('div');
    el.classList.add('message', 'bot-msg', 'typing-indicator');
    el.innerHTML = `<p><i class="fa-solid fa-circle-notch fa-spin"></i> ...</p>`;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
}

function sendMessage() {
    const text = (chatInput.value || '').trim();
    if (!text) return;
    appendMessage(text, true);
    chatInput.value = '';
    const indicator = showTypingIndicator();
    setTimeout(() => { indicator.remove(); processBotResponse(text); }, 900);
}

function processBotResponse(userInput) {
    const t = translations[currentLang];
    if (step === 'welcome') { leadForm.initialQuery = userInput; step = 'ask_name'; appendMessage(t.prompt_name); }
    else if (step === 'ask_name') { leadForm.name = userInput; step = 'ask_service'; appendMessage(t.prompt_service); }
    else if (step === 'ask_service') { leadForm.service = userInput; step = 'ask_location'; appendMessage(t.prompt_location); }
    else if (step === 'ask_location') { leadForm.location = userInput; step = 'ask_phone'; appendMessage(t.prompt_phone); }
    else if (step === 'ask_phone') { leadForm.phone = userInput; step = 'success'; appendMessage(t.chat_lead_success); sendLeadToBackend(leadForm); }
    else { appendMessage(t.chat_lead_success); }
}

function sendLeadToBackend(leadData) {
    fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadData, source: 'Web' })
    }).catch(err => console.error('Lead save error:', err));
}

// ===== INIT =====
applyPhoneLinks();
setLanguage('tr');

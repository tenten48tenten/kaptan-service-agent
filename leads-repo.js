const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.json');

// Initialize leads.json if it doesn't exist
function initLeadsFile() {
    if (!fs.existsSync(LEADS_FILE)) {
        fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
}

// Save a new lead to leads.json
function saveLead(leadData) {
    try {
        initLeadsFile();
        const data = fs.readFileSync(LEADS_FILE, 'utf8');
        const leads = JSON.parse(data || '[]');
        
        const newLead = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: leadData.name || 'Belirtilmedi',
            service: leadData.service || 'Belirtilmedi',
            location: leadData.location || 'Belirtilmedi',
            phone: leadData.phone || 'Belirtilmedi',
            initialQuery: leadData.initialQuery || '',
            source: leadData.source || 'Web',
            timestamp: new Date().toISOString(),
            reported: false
        };
        
        leads.push(newLead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
        console.log(`[leads-repo] Lead başarıyla kaydedildi: ${newLead.name} (${newLead.source})`);
        return newLead;
    } catch (err) {
        console.error('[leads-repo] Lead kaydedilirken hata oluştu:', err.message);
        return null;
    }
}

// Get all leads that haven't been sent in a report yet
function getUnreportedLeads() {
    try {
        initLeadsFile();
        const data = fs.readFileSync(LEADS_FILE, 'utf8');
        const leads = JSON.parse(data || '[]');
        return leads.filter(lead => !lead.reported);
    } catch (err) {
        console.error('[leads-repo] Raporlanmamış leadler alınırken hata oluştu:', err.message);
        return [];
    }
}

// Mark a list of lead IDs as reported
function markLeadsAsReported(leadIds) {
    try {
        initLeadsFile();
        const data = fs.readFileSync(LEADS_FILE, 'utf8');
        const leads = JSON.parse(data || '[]');
        
        const updatedLeads = leads.map(lead => {
            if (leadIds.includes(lead.id)) {
                return { ...lead, reported: true };
            }
            return lead;
        });
        
        fs.writeFileSync(LEADS_FILE, JSON.stringify(updatedLeads, null, 2), 'utf8');
        console.log(`[leads-repo] ${leadIds.length} adet lead raporlandı olarak işaretlendi.`);
        return true;
    } catch (err) {
        console.error('[leads-repo] Lead durumları güncellenirken hata oluştu:', err.message);
        return false;
    }
}

module.exports = {
    saveLead,
    getUnreportedLeads,
    markLeadsAsReported
};

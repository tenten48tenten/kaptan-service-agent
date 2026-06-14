const URL = require('url').URL;
const fetch = require('node-fetch');

// Helper to strip HTML tags
function cleanHtml(text) {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

async function searchDDG(site, queryTerm) {
    const query = `site:${site} Fethiye ${queryTerm}`;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    console.log(`[Social Hunter] Aranıyor: "${query}"`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8'
            },
            timeout: 8000
        });
        
        if (!response.ok) {
            console.error(`[Social Hunter] DDG araması başarısız (${site}): ${response.statusText}`);
            return [];
        }
        
        const html = await response.text();
        const results = [];
        
        const resultRegex = /<div class="[^"]*result__body[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
        let match;
        
        while ((match = resultRegex.exec(html)) !== null) {
            const body = match[1];
            
            // Extract URL
            const urlMatch = /<a class="[^"]*result__url[^"]*" href="([^"]*)"/i.exec(body);
            if (!urlMatch) continue;
            
            let rawUrl = urlMatch[1];
            if (rawUrl.startsWith('//')) {
                rawUrl = 'https:' + rawUrl;
            }
            
            // Extract title
            const titleMatch = /<a class="[^"]*result__url[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(body);
            const title = titleMatch ? cleanHtml(titleMatch[1]) : 'Sosyal Medya Paylaşımı';
            
            // Extract snippet
            const snippetMatch = /<a class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(body);
            const snippet = snippetMatch ? cleanHtml(snippetMatch[1]) : '';
            
            // Resolve direct URL from DDG redirect url
            let targetUrl = rawUrl;
            try {
                const parsedUrl = new URL(rawUrl);
                const uddg = parsedUrl.searchParams.get('uddg');
                if (uddg) {
                    targetUrl = decodeURIComponent(uddg);
                }
            } catch (e) {
                // Keep raw URL if URL parsing fails
            }
            
            // Validate that it belongs to the target site and matches Fethiye context
            const lowerSnippet = snippet.toLowerCase();
            const lowerTitle = title.toLowerCase();
            const isRelevant = lowerSnippet.includes('boya') || 
                               lowerSnippet.includes('badana') || 
                               lowerSnippet.includes('boyacı') || 
                               lowerSnippet.includes('usta') ||
                               lowerSnippet.includes('tadilat') ||
                               lowerSnippet.includes('temizlik') ||
                               lowerTitle.includes('boya') ||
                               lowerTitle.includes('badana') ||
                               lowerTitle.includes('boyacı');
            
            if (targetUrl.includes(site) && isRelevant) {
                results.push({
                    title: title,
                    url: targetUrl,
                    snippet: snippet.length > 180 ? snippet.substring(0, 177) + '...' : snippet,
                    platform: getPlatformName(site)
                });
            }
        }
        
        return results;
    } catch (err) {
        console.error(`[Social Hunter] Hata oluştu (${site} - ${queryTerm}):`, err.message);
        return [];
    }
}

function getPlatformName(site) {
    if (site.includes('facebook.com')) return 'Facebook';
    if (site.includes('armut.com')) return 'Armut';
    if (site.includes('x.com') || site.includes('twitter.com')) return 'X (Twitter)';
    if (site.includes('instagram.com')) return 'Instagram';
    if (site.includes('sahibinden.com')) return 'Sahibinden';
    return 'Web Platformu';
}

async function getSocialLeads() {
    console.log('[Social Hunter] Sosyal medya ve hizmet platformları taraması başladı...');
    
    // Run multiple searches in parallel
    const searchPromises = [
        searchDDG('facebook.com', 'boyacı'),
        searchDDG('facebook.com', 'boya badana'),
        searchDDG('armut.com', 'boyacı'),
        searchDDG('armut.com', 'boya badana'),
        searchDDG('x.com', 'boyacı'),
        searchDDG('instagram.com', 'boyacı')
    ];
    
    const allResults = await Promise.all(searchPromises);
    
    // Flatten the array of arrays
    const flatResults = allResults.reduce((acc, val) => acc.concat(val), []);
    
    // Deduplicate by URL
    const uniqueLeads = [];
    const seenUrls = new Set();
    
    for (const lead of flatResults) {
        if (!seenUrls.has(lead.url)) {
            seenUrls.add(lead.url);
            uniqueLeads.push(lead);
        }
    }
    
    console.log(`[Social Hunter] Tarama tamamlandı. Toplam ${uniqueLeads.length} benzersiz talep/ilan bulundu.`);
    return uniqueLeads;
}

module.exports = {
    getSocialLeads
};

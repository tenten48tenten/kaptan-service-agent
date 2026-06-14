const URL = require('url').URL;

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

// Scrape jobs from Indeed via DuckDuckGo HTML interface
async function searchIndeedJobs(keyword) {
    const query = `site:tr.indeed.com Fethiye ${keyword}`;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    console.log(`[Indeed Hunter] İlanlar aranıyor: "${query}"`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            console.error(`[Indeed Hunter] DDG araması başarısız oldu: ${response.statusText}`);
            return [];
        }
        
        const html = await response.text();
        const results = [];
        
        // Simple regex-based HTML parsing for DDG HTML result bodies
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
            const title = titleMatch ? cleanHtml(titleMatch[1]) : 'İş İlanı';
            
            // Extract snippet
            const snippetMatch = /<a class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(body);
            const snippet = snippetMatch ? cleanHtml(snippetMatch[1]) : '';
            
            // Resolve direct Indeed URL from DDG redirect url
            let indeedUrl = rawUrl;
            try {
                const parsedUrl = new URL(rawUrl);
                const uddg = parsedUrl.searchParams.get('uddg');
                if (uddg) {
                    indeedUrl = decodeURIComponent(uddg);
                }
            } catch (e) {
                // Keep raw URL if URL parsing fails
            }
            
            // Filter to ensure it's an actual Indeed job link and matches Fethiye
            if (indeedUrl.includes('indeed.com') && 
                (indeedUrl.includes('/viewjob') || indeedUrl.includes('/rc/clk') || indeedUrl.includes('/jobs')) &&
                (title.toLowerCase().includes(keyword.toLowerCase()) || snippet.toLowerCase().includes(keyword.toLowerCase()) || snippet.toLowerCase().includes('fethiye'))) {
                
                results.push({
                    title,
                    url: indeedUrl,
                    snippet: snippet.length > 150 ? snippet.substring(0, 147) + '...' : snippet
                });
            }
        }
        
        console.log(`[Indeed Hunter] "${keyword}" için ${results.length} adet ilan bulundu.`);
        return results;
    } catch (err) {
        console.error(`[Indeed Hunter] İlanlar aranırken hata oluştu (${keyword}):`, err.message);
        return [];
    }
}

// Main fetch function to get all target jobs
async function getFethiyeJobs() {
    console.log('[Indeed Hunter] Fethiye Boya ve Kamera iş ilanları taraması başladı...');
    
    const [paintJobs, cameraJobs] = await Promise.all([
        searchIndeedJobs('boya'),
        searchIndeedJobs('kamera')
    ]);
    
    // Merge and deduplicate by URL
    const allJobs = [...paintJobs, ...cameraJobs];
    const uniqueJobs = [];
    const seenUrls = new Set();
    
    for (const job of allJobs) {
        if (!seenUrls.has(job.url)) {
            seenUrls.add(job.url);
            uniqueJobs.push(job);
        }
    }
    
    return uniqueJobs;
}

module.exports = {
    getFethiyeJobs
};

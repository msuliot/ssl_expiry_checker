const dns = require('dns').promises;

async function queryDNS(domain) {
    console.log(`Querying DNS records for: ${domain}`);
    
    // Try to fetch CNAME records
    try {
        const cnameRecords = await dns.resolveCname(domain);
        console.log(`CNAME records for ${domain}:`, cnameRecords);
    } catch (error) {
        console.log(`Error fetching CNAME records for ${domain}: ${error.code}`);
        // If CNAME query fails, try A records
        if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
            try {
                const aRecords = await dns.resolve4(domain);
                console.log(`A records for ${domain}:`, aRecords);
            } catch (error) {
                console.error(`Also failed to fetch A records for ${domain}: ${error.code}`);
            }
        }
    }
}

// Replace 'www.example.com' with the domain you're interested in
queryDNS('www.openai.com');

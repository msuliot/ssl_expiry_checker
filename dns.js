const dns = require('dns').promises;

async function queryDNS(domain, types) {
    for (let type of types) {
        try {
            let records;
            switch (type) {
                case 'A':
                    records = await dns.resolve4(domain);
                    break;
                case 'AAAA':
                    records = await dns.resolve6(domain);
                    break;
                case 'MX':
                    records = await dns.resolveMx(domain);
                    break;
                case 'TXT':
                    records = await dns.resolveTxt(domain);
                    break;
                case 'NS':
                    records = await dns.resolveNs(domain);
                    break;
                case 'CNAME':
                    // CNAME queries are typically done on subdomains
                    records = await dns.resolveCname(`www.${domain}`);
                    // records = await dns.resolveCname(domain);
                    break;
                case 'PTR':
                    // PTR records are not typically queried against a domain
                    console.log('PTR record queries require an IP address, skipping.');
                    continue;
                case 'SRV':
                    // SRV records require a service and protocol, skipping for generic queries
                    console.log('SRV record queries require specific service and protocol, skipping.');
                    continue;
                case 'SOA':
                    records = await dns.resolveSoa(domain);
                    break;
                default:
                    console.log(`Unsupported DNS record type: ${type}`);
                    continue;
            }
            console.log(`${type} records for ${domain}:`, records);
        } catch (error) {
            console.error(`Error fetching ${type} records for ${domain}:`, error.message);
        }
    }
}


const domain = 'openai.com'; // Replace this with any domain
const types = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'PTR', 'SRV', 'SOA'];

queryDNS(domain, types).then(() => console.log('DNS query completed.'));

const fs = require('fs').promises;
const https = require('https');
const fs1 = require('fs');
const days = parseInt(process.argv[2], 10) || 60;

function checkSslExpiry(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: 443,
      method: 'GET',
      agent: new https.Agent({ rejectUnauthorized: true }),
      checkServerIdentity: () => undefined, 
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (!cert) {
        reject(new Error('Certificate was not found'));
      } else {
        const expiryDate = new Date(cert.valid_to).toISOString(); 
        // Issuer details
        const issuerDetails = {
          country: cert.issuer.C,
          state: cert.issuer.ST,
          locality: cert.issuer.L,
          organization: cert.issuer.O,
          organizationalUnit: cert.issuer.OU,
          commonName: cert.issuer.CN,
        };
        // Subject details
        const subjectDetails = {
          country: cert.subject.C,
          state: cert.subject.ST,
          locality: cert.subject.L,
          organization: cert.subject.O,
          organizationalUnit: cert.subject.OU,
          commonName: cert.subject.CN,
        };
        resolve({ 
          hostname, 
          expiryDate, 
          issuerDetails, 
          subjectDetails 
        });
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}



async function filterExpiringDomains(days) {
  fs1.readFile('results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const results = JSON.parse(data);

    const today = new Date();
    const daysFromNow = new Date(today.setDate(today.getDate() + days));

    const filteredResults = results.filter(result => {
      const expiryDate = new Date(result.expiryDate);
      return expiryDate < daysFromNow;
    });

    console.log(filteredResults);
  });
}

async function loadHostnamesAndCheck() {
  try {
    const hostnamesData = await fs.readFile('hostnames.json', 'utf8');
    const hostnames = JSON.parse(hostnamesData);
    const results = await Promise.all(hostnames.map(hostname => checkSslExpiry(hostname)));

    await fs.writeFile('results.json', JSON.stringify(results, null, 2));
    console.log('Results have been saved to results.json');
    console.log(`Checking for domains expiring within ${days} days...`);
    filterExpiringDomains(days);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

loadHostnamesAndCheck();
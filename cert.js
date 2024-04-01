const fs = require('fs').promises;
const https = require('https');

function checkSslExpiry(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: 443,
      method: 'GET',
      agent: new https.Agent({ rejectUnauthorized: true }),
      checkServerIdentity: () => undefined, // Do not verify the hostname
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (!cert) {
        reject(new Error('Certificate was not found'));
      } else {
        const expiryDate = new Date(cert.valid_to).toISOString(); // ISO format for JSON compatibility
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
        }); // Include detailed issuer and subject information in the result
      }
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}


async function loadHostnamesAndCheck() {
  try {
    const hostnamesData = await fs.readFile('hostnames.json', 'utf8');
    const hostnames = JSON.parse(hostnamesData);
    const results = await Promise.all(hostnames.map(hostname => checkSslExpiry(hostname)));

    await fs.writeFile('results.json', JSON.stringify(results, null, 2));
    console.log('Results have been saved to results.json');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

loadHostnamesAndCheck();
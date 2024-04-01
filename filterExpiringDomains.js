const fs = require('fs');
const days = parseInt(process.argv[2], 10) || 60;

async function filterExpiringDomains(days) {
  fs.readFile('results.json', 'utf8', (err, data) => {
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

filterExpiringDomains(days);

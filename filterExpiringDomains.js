const fs = require('fs');

async function filterExpiringDomains(days) {
  // Asynchronously read the file
  fs.readFile('results.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the JSON data
    const results = JSON.parse(data);

    // Get today's date and calculate the date 60 days from now
    const today = new Date();
    const daysFromNow = new Date(today.setDate(today.getDate() + days)); // 60 days from now

    // Filter the results for expiryDates less than 60 days from now
    const filteredResults = results.filter(result => {
      const expiryDate = new Date(result.expiryDate);
      return expiryDate < daysFromNow;
    });

    // Log or process the filtered results
    console.log(filteredResults);
  });
}

// Call the function to filter and process domains expiring within 60 days
const days = 60;
filterExpiringDomains(days);

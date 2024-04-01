# SSL Expiry Checker

## Overview

SSL Expiry Checker is a Node.js application designed to check the SSL certificate expiry dates of a list of hostnames and filter out those expiring within a specified number of days. It's particularly useful for system administrators and developers who manage multiple domains and need to ensure their SSL certificates are always up to date to maintain website security and avoid service interruptions.

## Features

- **Check SSL Certificates**: Automatically retrieves SSL certificate details for each hostname.
- **Filter by Expiry Date**: Filters out domains with SSL certificates expiring within a specified timeframe.
- **Flexible Timeframe**: Users can define the number of days to check for upcoming SSL certificate expirations.

## Prerequisites

Before you begin, ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).


## Usage
Prepare a JSON file named hostnames.json in the root of the project directory. This file should contain an array of hostnames you wish to check, for example:
json
``` JSON
[
  "google.com",
  "example.com"
]
```

Run the script, optionally specifying the number of days to check for SSL certificate expiry. If no days are specified, the default is 60 days:
```bash
node index.js [number_of_days]
```

For example, to check for certificates expiring within the next 45 days, run:
```bash
node index.js 45
```

The script will generate a results.json file in the root of the project directory, containing details of the domains with expiring SSL certificates within the specified timeframe.
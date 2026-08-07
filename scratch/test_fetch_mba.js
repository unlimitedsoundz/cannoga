const http = require('http');

http.get('http://localhost:3000/studies/mba', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Contains slashes in titles/IDs?:', data.includes('\\"\\"') || data.includes('&quot;\\&quot;'));
        console.log('Contains ECTS?:', data.includes('ECTS'));
        
        // Extract sections or title HTML
        const overviewIdx = data.indexOf('Programme Overview');
        if (overviewIdx !== -1) {
            console.log('\n--- Overview Snippet ---');
            console.log(data.substring(overviewIdx - 100, overviewIdx + 300));
        }

        const ectsIdx = data.indexOf('ECTS');
        if (ectsIdx !== -1) {
            console.log('\n--- ECTS Snippet ---');
            console.log(data.substring(ectsIdx - 50, ectsIdx + 100));
        }
    });
}).on('error', (err) => {
    console.error('Error fetching page:', err.message);
});

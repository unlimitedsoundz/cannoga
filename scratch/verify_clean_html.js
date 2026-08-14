const http = require('http');

http.get('http://localhost:3000/studies/mba', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Contains escaped quotes (\\")?:', data.includes('\\"'));
        console.log('Contains extra backslashes (\\\\)?:', data.includes('\\\\'));
        
        // Print sections rendered HTML
        const overviewPos = data.indexOf('Programme Overview');
        console.log('\n--- Rendered HTML sample ---');
        console.log(data.substring(overviewPos - 50, overviewPos + 400));
    });
});

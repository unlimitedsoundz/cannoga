const http = require('http');

http.get('http://localhost:3000/studies/mba', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Strip script tags
        const bodyOnly = data.replace(/<script[\s\S]*?<\/script>/gi, '');
        console.log('Body HTML (without scripts) contains \\"?', bodyOnly.includes('\\"'));
        console.log('Body HTML (without scripts) contains \\\\?', bodyOnly.includes('\\\\'));
    });
});

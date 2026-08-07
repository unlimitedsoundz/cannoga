const http = require('http');

http.get('http://localhost:3000/studies/bba', (res) => {
    console.log('BBA Status code:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.log('Error output (sample):', data.substring(0, 500));
        } else {
            console.log('Success BBA! ECTS included:', data.includes('ECTS'));
        }
    });
});

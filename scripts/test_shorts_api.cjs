const http = require('http');

async function testShorts() {
    for (const page of [1, 2, 3]) {
        console.log(`\n--- Fetching Shorts Page ${page} ---`);
        try {
            const res = await fetch(`http://localhost:3000/api/shorts/?page=${page}&limit=4`);
            if (res.ok) {
                const data = await res.json();
                console.log(`Page: ${data.page}, Total: ${data.total}, hasMore: ${data.hasMore}`);
                console.log(`Shorts returned (${data.shorts.length}):`, data.shorts.map(s => `[${s.id}] ${s.title}`));
            } else {
                console.error(`HTTP error: ${res.status}`);
            }
        } catch (e) {
            console.error('Request failed:', e.message);
        }
    }
}

testShorts();

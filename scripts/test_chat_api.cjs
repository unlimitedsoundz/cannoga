const http = require('http');

async function testChat() {
    const questions = [
        "What is the tuition deposit amount?",
        "Tell me about living in Ottawa and housing",
        "Can I work in Canada and get a PGWP?",
        "How do I apply and get a PAL?"
    ];

    for (const q of questions) {
        console.log(`\n========================================`);
        console.log(`TEST QUERY: "${q}"`);
        console.log(`========================================`);

        try {
            const res = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery: q })
            });

            if (!res.ok) {
                console.error(`HTTP error: ${res.status}`);
                continue;
            }

            const data = await res.json();
            console.log(`Topic: ${data.topic}`);
            console.log(`Response:\n${data.reply}`);
        } catch (e) {
            console.error('Request failed:', e.message);
        }
    }
}

testChat();

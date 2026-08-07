function cleanValue(val) {
    if (typeof val !== 'string') return val;
    let str = val;
    
    // Iteratively JSON.parse if the string is wrapped in quotes or double escaped JSON
    let prev = '';
    while (str !== prev && typeof str === 'string') {
        prev = str;
        // Trim whitespace
        str = str.trim();
        
        // If string starts and ends with quotes, try parsing as JSON or stripping outer quotes
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith('\\"') && str.endsWith('\\"'))) {
            try {
                const parsed = JSON.parse(str);
                if (typeof parsed === 'string') {
                    str = parsed;
                    continue;
                }
            } catch (e) {
                // Manually strip escaped outer quotes
                str = str.replace(/^(\\"|")+|(\\"|")+$/g, '');
            }
        }
        
        // Replace escaped quotes and slashes
        str = str.replace(/\\"/g, '"');
        str = str.replace(/\\\\/g, '\\');
        str = str.replace(/\\n/g, '\n');
        str = str.replace(/\\r/g, '\r');
        str = str.replace(/\\t/g, '\t');
        
        // Strip any remaining excessive leading/trailing quotes/slashes
        str = str.replace(/^"+|"+$/g, '');
        str = str.replace(/^\\+|\\+$/g, '');
    }
    
    return str.trim();
}

// Test cases from DB
const testId = "\"\\\"\\\\\\\"overview\\\\\\\"\\\"\"";
const testTitle = "\"\\\"\\\\\\\"Programme Overview\\\\\\\"\\\"\"";
const testContent = "\"\\\"\\\\\\\"\n                    <p class=\\\\\\\"mb-4\\\\\\\">The Master of Business Administration (MBA) at Cannoga College offers a rigorous and future-oriented curriculum designed to equip students with the technical skills and theoretical foundation needed to lead in the modern technological landscape.</p>\n                    <p>Our approach combines intensive classroom learning with hands-on laboratory work and industry-integrated projects, ensuring that graduates are prepared for high-impact careers in global markets.</p>\n                \\\\\\\"\\\"\"";

console.log('Cleaned ID:', JSON.stringify(cleanValue(testId)));
console.log('Cleaned Title:', JSON.stringify(cleanValue(testTitle)));
console.log('Cleaned Content:\n', cleanValue(testContent));

export function generateTransactionReference(): string {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selected: number[] = [];
    
    while (selected.length < 9 && digits.length > 0) {
        const idx = Math.floor(Math.random() * digits.length);
        selected.push(digits[idx]);
        digits.splice(idx, 1);
    }
    
    return `CAN${selected.join('')}`;
}

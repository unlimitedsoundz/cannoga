export function generateTransactionReference(): string {
    const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `CAN${random}`;
}

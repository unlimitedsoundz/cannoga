
console.log("Checking env vars...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "DECANED" : "UNDECANED");
if (process.env.DATABASE_URL) {
    console.log("Length:", process.env.DATABASE_URL.length);
    console.log("Start:", process.env.DATABASE_URL.substring(0, 20));
}
console.log("DIRECT_URL:", process.env.DIRECT_URL ? "DECANED" : "UNDECANED");

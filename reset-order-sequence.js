
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    try {
        // Reset the auto-increment sequence for Order.orderNumber
        const result = await prisma.$executeRaw`ALTER SEQUENCE "Order_orderNumber_seq" RESTART WITH 1234;`;

        console.log("Successfully reset Order_orderNumber_seq to 1234");
        console.log("Result:", result);
    } catch (e) {
        console.error("Error adjusting sequence:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

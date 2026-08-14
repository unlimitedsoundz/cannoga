import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const updates = [
        { slug: 'arts', imageUrl: '/images/school-arts.png' },
        { slug: 'business', imageUrl: '/images/school-business.png' },
        { slug: 'technology', imageUrl: '/images/school-technology.png' },
        { slug: 'science', imageUrl: '/images/school-science.png' },
    ];

    for (const update of updates) {
        try {
            const result = await prisma.school.update({
                where: { slug: update.slug },
                data: { imageUrl: update.imageUrl },
            });
            console.log(`Updated ${update.slug}: ${result.imageUrl}`);
        } catch (e) {
            console.error(`Failed to update ${update.slug}:`, e);

            // Fallback: try by name if slug fails or is slightly different
            const names = {
                arts: 'School of Arts & Design',
                business: 'School of Business',
                technology: 'School of Technology',
                science: 'School of Science',
            };

            try {
                const result = await prisma.school.updateMany({
                    where: { name: { contains: (names as any)[update.slug] } },
                    data: { imageUrl: update.imageUrl },
                });
                console.log(`Fallback update by name for ${update.slug}: ${result.count}`);
            } catch (e2) {
                console.error(`Fallback failed for ${update.slug}`);
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let updated = 0;

  for (const u of users) {
    if (u.user_id.endsWith(' ') || u.user_id.startsWith(' ') || u.name.endsWith(' ') || u.name.startsWith(' ')) {
      await prisma.user.update({
        where: { id: u.id },
        data: {
          user_id: u.user_id.trim(),
          name: u.name.trim()
        }
      });
      console.log(`Trimmed user: '${u.user_id}' -> '${u.user_id.trim()}'`);
      updated++;
    }
  }

  console.log(`Finished trimming. ${updated} users updated.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

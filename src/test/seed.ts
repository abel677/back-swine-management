import { Database } from '../config/database';

async function execute() {
  await Database.connect();
  const prisma = Database.getClient();
  try {
    const currentDate = new Date();
    await prisma.role.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          name: 'SUPER ADMIN',
          createdAt: currentDate,
          updatedAt: currentDate
        },
        {
          id: crypto.randomUUID(),
          name: 'OWNER',
          createdAt: currentDate,
          updatedAt: currentDate
        },
        {
          id: crypto.randomUUID(),
          name: 'EMPLOYEE',
          createdAt: currentDate,
          updatedAt: currentDate
        },
      ],
    });
    console.log('✅ Seed ejecutado con éxito.');
  } catch (error) {
    console.error(`❌ Error al ejecutar Seed: ${error}`);
  } finally {
    prisma.$disconnect();
  }
}
execute();

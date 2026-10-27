import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs'; // <-- Добавили импорт

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Создаем ивент (как было раньше)
  const event = await prisma.event.create({
    data: {
      title: 'Мой первый ИТ-ивент',
      description: 'Это тестовое описание ивента, созданное для проверки работы сайта. Здесь будет много интересного!',
      startsAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      location: 'Онлайн (ссылка придет на почту)',
      registrationOpen: true,
    },
  });
  console.log('\n✅ Создан тестовый ивент с ID:', event.id, '\n');

  // 2. Создаем Админа
  const passwordHash = await bcrypt.hash('admin123', 10); // Хешируем пароль
  
  const admin = await prisma.admin.create({
    data: {
      login: 'admin',
      passwordHash: passwordHash,
    },
  });
  console.log('✅ Создан админ. Логин: admin, Пароль: admin123\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
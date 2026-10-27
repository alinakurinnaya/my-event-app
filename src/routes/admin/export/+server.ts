import { error } from '@sveltejs/kit';
import prisma from '../../../lib/server/db';

export const GET = async ({ cookies }) => {
    // 1. Проверяем, что админ авторизован
    const session = cookies.get('admin_session');
    if (!session) {
        throw error(401, 'Неавторизованный доступ');
    }

    // 2. Получаем ивент и всех его участников
    const event = await prisma.event.findFirst();
    if (!event) throw error(404, 'Ивент не найден');

    const participants = await prisma.participant.findMany({
        where: { eventId: event.id },
        orderBy: { name: 'asc' }
    });

    // 3. Функция для безопасного экранирования данных
    const escapeCsv = (val: string | null | undefined) => {
        if (!val) return '';
        let str = val.toString();
        // Защита от CSV-инъекций (если начинается с =, +, -, @)
        if (/^[=+\-@]/.test(str)) {
            str = "'" + str;
        }
        // Если есть точка с запятой, кавычки или перенос строки — оборачиваем в кавычки
        if (str.includes(';') || str.includes('"') || str.includes('\n')) {
            str = '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };

    // 4. Переводим статусы на русский язык
    const getStatusText = (status: string) => {
        if (status === 'attended') return 'Пришел';
        if (status === 'not_attended') return 'Не пришел';
        return 'Ожидает';
    };

    // 5. Формируем CSV-файл
    // ВАЖНО: Добавляем BOM-символ \uFEFF в начало, чтобы Excel правильно прочитал кириллицу!
    let csv = '\uFEFF';
    csv += 'Имя;Email;Телефон;Дата записи (UTC);Статус;Комментарий\n';

    for (const p of participants) {
        csv += [
            escapeCsv(p.name),
            escapeCsv(p.email),
            escapeCsv(p.phone),
            p.createdAt.toISOString(), // Время в UTC с суффиксом Z (как в ТЗ)
            escapeCsv(getStatusText(p.attendanceStatus)),
            escapeCsv(p.comment)
        ].join(';') + '\n'; // Разделитель — точка с запятой
    }

    // 6. Формируем имя файла: event_participants_YYYY-MM-DD.csv
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `event_participants_${dateStr}.csv`;

    // 7. Отдаем файл в браузер
    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
};
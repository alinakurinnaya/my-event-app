import { fail, redirect } from '@sveltejs/kit';
import prisma from '../../../lib/server/db';

export const load = async () => {
    const event = await prisma.event.findFirst();
    if (!event) throw new Error('Ивент не найден');
    const participants = await prisma.participant.findMany({
        where: { eventId: event.id },
        orderBy: { name: 'asc' }
    });
    return { event, participants };
};

export const actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();
        if (id) await prisma.participant.delete({ where: { id } });
        return { success: true };
    },
        // Добавление участника вручную
    addParticipant: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString().trim();
        const email = data.get('email')?.toString().trim();
        const phone = data.get('phone')?.toString().trim();
        const comment = data.get('comment')?.toString().trim();

        const errors: Record<string, string> = {};
        if (!name) errors.name = 'Укажите имя';
        if (!email) {
            errors.email = 'Укажите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Некорректный email';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, { addErrors: errors, addData: { name, email, phone, comment } });
        }

        try {
            const event = await prisma.event.findFirst();
            if (!event) throw new Error('Ивент не найден');

            await prisma.participant.create({
                data: {
                    eventId: event.id,
                    name: name as string,
                    email: email as string,
                    phone: phone || null,
                    comment: comment || null,
                }
            });
            return { addSuccess: true };
        } catch (e: any) {
            if (e.code === 'P2002') {
                return fail(409, { 
                    addErrors: { email: 'Участник с таким email уже существует' }, 
                    addData: { name, email, phone, comment } 
                });
            }
            return fail(500, { addErrors: { general: 'Ошибка при добавлении' } });
        }
    },
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id')?.toString();
        const status = data.get('status')?.toString();
        if (id && status) {
            await prisma.participant.update({
                where: { id },
                data: { attendanceStatus: status }
            });
        }
        return { success: true };
    },
    logout: async ({ cookies }) => {
        cookies.delete('admin_session', { path: '/' });
        throw redirect(302, '/admin/login');
    }
};
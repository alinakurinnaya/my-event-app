import { error, fail } from '@sveltejs/kit';
import prisma from '../../../lib/server/db';

export const load = async ({ params }) => {
    const event = await prisma.event.findUnique({ where: { id: params.id } });
    if (!event) throw error(404, 'Ивент не найден');
    return { event };
};

export const actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString().trim();
        const email = data.get('email')?.toString().trim();
        const phone = data.get('phone')?.toString().trim();
        const comment = data.get('comment')?.toString().trim();

        const errors: Record<string, string> = {};
        if (!name) errors.name = 'Пожалуйста, укажите имя';
        if (!email) {
            errors.email = 'Пожалуйста, укажите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Введите корректный email';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, { errors, name, email, phone, comment });
        }

        try {
            await prisma.participant.create({
                data: {
                    eventId: params.id,
                    name: name as string,
                    email: email as string,
                    phone: phone || null,
                    comment: comment || null,
                }
            });
            return { success: true, name, email };
        } catch (e: any) {
            if (e.code === 'P2002') {
                return fail(409, { errors: { email: 'Похоже, вы уже записались на этот ивент' }, name, email, phone, comment });
            }
            console.error(e);
            return fail(500, { errors: { general: 'Не удалось записаться. Попробуйте ещё раз' } });
        }
    }
};
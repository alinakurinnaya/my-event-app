import { fail, redirect } from '@sveltejs/kit';
import prisma from '../../../lib/server/db';
import bcrypt from 'bcryptjs';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const login = data.get('login')?.toString();
        const password = data.get('password')?.toString();

        if (!login || !password) {
            return fail(400, { error: 'Заполните все поля' });
        }

        // Ищем админа в базе
        const admin = await prisma.admin.findUnique({
            where: { login }
        });

        // Если админ не найден или пароль не совпадает
        if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
            return fail(401, { error: 'Неверный логин или пароль' });
        }

        // Всё верно! Ставим "печать" (cookie) в браузер, что мы вошли
        cookies.set('admin_session', admin.id, {
            path: '/',
            httpOnly: true, // Защита от кражи через JS
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // Живет 1 день
        });

        // Перенаправляем в админку со списком участников
        throw redirect(302, '/admin/participants');
    }
};
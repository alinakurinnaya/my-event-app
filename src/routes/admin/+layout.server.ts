import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
    const session = cookies.get('admin_session');

    // Если печати нет, и мы не на странице логина — выкидываем на логин
    if (!session && url.pathname !== '/admin/login') {
        throw redirect(302, '/admin/login');
    }

    return {};
};
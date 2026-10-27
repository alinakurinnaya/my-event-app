<script lang="ts">
    import { enhance } from '$app/forms';
    
    let { data, form } = $props();
    const event = data.event;

    const formattedDate = event.startsAt 
        ? new Date(event.startsAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Дата не указана';
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div class="space-y-2 mb-6 text-gray-600">
                    <p>📅 <strong>Дата:</strong> {formattedDate}</p>
                    <p>📍 <strong>Место:</strong> {event.location}</p>
                </div>

                <div class="prose max-w-none mb-8 text-gray-800">
                    <p>{event.description}</p>
                </div>

                <div class="mt-8 border-t pt-8">
                    {#if !event.registrationOpen}
                        <button disabled class="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                            Запись закрыта
                        </button>
                    {:else if form?.success}
                        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 class="text-lg font-medium text-green-800 mb-2">Вы записаны на ивент!</h3>
                            <ul class="list-disc list-inside text-green-700">
                                <li>Имя: {form.name}</li>
                                <li>Email: {form.email}</li>
                                <li>Ивент: {event.title}</li>
                            </ul>
                        </div>
                    {:else}
                        <h3 class="text-xl font-bold mb-4">Записаться на ивент</h3>
                        {#if form?.errors?.general}
                            <div class="mb-4 text-red-600 bg-red-50 p-3 rounded">{form.errors.general}</div>
                        {/if}

                        <form method="POST" use:enhance class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                                <input type="text" name="name" value={form?.name || ''} class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
                                {#if form?.errors?.name}<span class="text-red-500 text-sm">{form.errors.name}</span>{/if}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" name="email" value={form?.email || ''} class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
                                {#if form?.errors?.email}<span class="text-red-500 text-sm">{form.errors.email}</span>{/if}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Телефон (необязательно)</label>
                                <input type="text" name="phone" value={form?.phone || ''} class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Комментарий (необязательно)</label>
                                <textarea name="comment" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500">{form?.comment || ''}</textarea>
                            </div>
                            <button type="submit" class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Отправить заявку
                            </button>
                        </form>
                    {/if}
                </div>
            </div>
        </div>
        <div class="mt-8 text-center">
            <a href="/admin/login" class="text-sm text-gray-400 hover:text-gray-600">Вход для администратора</a>
        </div>
    </div>
</div>
<script lang="ts">
    import { enhance } from '$app/forms';
    
    let { data, form } = $props();
    
    // Используем $derived для правильного обновления таблицы в Svelte 5
    let event = $derived(data.event);
    let participants = $derived(data.participants);

    let showAddForm = $state(false);

    function formatDate(dateString: string) {
        const d = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
</script>

<div class="min-h-screen bg-gray-50 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        <!-- Шапка админки -->
        <div class="p-6 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center bg-gray-100 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Участники ивента</h1>
                <p class="text-gray-600 text-sm">{event.title}</p>
            </div>
            
            <div class="flex flex-wrap gap-3">
                <!-- Кнопка Экспорта CSV -->
                <a href="/admin/export" class="px-4 py-2 bg-green-100 text-green-700 font-medium rounded hover:bg-green-200 transition">
                    Экспорт CSV
                </a>

                <!-- Кнопка вызова формы добавления -->
                <button onclick={() => showAddForm = !showAddForm} class="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition">
                    {showAddForm ? 'Отменить' : '+ Добавить'}
                </button>

                <!-- Ссылка на публичную страницу -->
                <a href="/event/{event.id}" target="_blank" class="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition">
                    Посмотреть сайт ↗
                </a>
                
                <!-- Кнопка выхода -->
                <form method="POST" action="?/logout">
                    <button class="px-4 py-2 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 transition">
                        Выйти
                    </button>
                </form>
            </div>
        </div>

        <!-- Форма добавления участника вручную -->
        {#if showAddForm}
            <div class="p-6 bg-blue-50 border-b border-blue-100">
                <h3 class="text-lg font-bold mb-4 text-blue-900">Добавить участника вручную</h3>
                
                {#if form?.addErrors?.general}
                    <div class="mb-4 text-red-600 bg-red-50 p-2 rounded text-sm">{form.addErrors.general}</div>
                {/if}

                <form method="POST" action="?/addParticipant" use:enhance={() => {
                    return async ({ result, update }) => {
                        await update();
                        if (result.type === 'success') {
                            showAddForm = false;
                        }
                    }
                }} class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                        <input type="text" name="name" value={form?.addData?.name || ''} class="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                        {#if form?.addErrors?.name}<span class="text-red-500 text-xs">{form.addErrors.name}</span>{/if}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" value={form?.addData?.email || ''} class="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                        {#if form?.addErrors?.email}<span class="text-red-500 text-xs">{form.addErrors.email}</span>{/if}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                        <input type="text" name="phone" value={form?.addData?.phone || ''} class="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                        <input type="text" name="comment" value={form?.addData?.comment || ''} class="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div class="md:col-span-2">
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        {/if}

        <!-- Таблица участников -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50 text-gray-600 text-sm border-b">
                        <th class="p-4 font-medium">№</th>
                        <th class="p-4 font-medium">Имя</th>
                        <th class="p-4 font-medium">Email</th>
                        <th class="p-4 font-medium">Телефон</th>
                        <th class="p-4 font-medium">Дата записи</th>
                        <th class="p-4 font-medium">Статус</th>
                        <th class="p-4 font-medium">Комментарий</th>
                        <th class="p-4 font-medium text-right">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {#if participants.length === 0}
                        <tr>
                            <td colspan="8" class="p-8 text-center text-gray-500">
                                Пока никто не записался
                            </td>
                        </tr>
                    {/if}

                    {#each participants as participant, index}
                        <tr class="border-b hover:bg-gray-50 transition-colors">
                            <td class="p-4 text-gray-500">{index + 1}</td>
                            <td class="p-4 font-medium">{participant.name}</td>
                            <td class="p-4">{participant.email}</td>
                            <td class="p-4 text-gray-500">{participant.phone || '—'}</td>
                            <td class="p-4 text-sm text-gray-500">{formatDate(participant.createdAt)}</td>
                            
                            <!-- Смена статуса -->
                            <td class="p-4">
                                <form method="POST" action="?/updateStatus" use:enhance>
                                    <input type="hidden" name="id" value={participant.id} />
                                    <select name="status" 
                                            onchange={(e) => e.currentTarget.form?.requestSubmit()} 
                                            class="border rounded px-2 py-1 text-sm bg-white focus:ring-blue-500 focus:border-blue-500">
                                        <option value="pending" selected={participant.attendanceStatus === 'pending'}>Ожидает</option>
                                        <option value="attended" selected={participant.attendanceStatus === 'attended'}>Пришел</option>
                                        <option value="not_attended" selected={participant.attendanceStatus === 'not_attended'}>Не пришел</option>
                                    </select>
                                </form>
                            </td>

                            <!-- Комментарий -->
                            <td class="p-4 text-gray-500 max-w-xs truncate" title={participant.comment || ''}>
                                {participant.comment || '—'}
                            </td>
                            
                            <!-- Удаление -->
                            <td class="p-4 text-right">
                                <form method="POST" action="?/delete" use:enhance 
                                      onsubmit={(e) => { if(!confirm('Удалить участника?')) e.preventDefault(); }}>
                                    <input type="hidden" name="id" value={participant.id} />
                                    <button class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">
                                        Удалить
                                    </button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
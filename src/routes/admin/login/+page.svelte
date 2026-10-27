<script lang="ts">
    let { form } = $props();
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Вход в админку</h2>

        {#if form?.error}
            <div class="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {form.error}
            </div>
        {/if}

        <form method="POST" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Логин</label>
                <input type="text" name="login" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input type="password" name="password" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
            </div>

            <button type="submit" class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Войти
            </button>
        </form>
    </div>
</div>
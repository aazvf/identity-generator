<script setup>
const props = defineProps({ title: String });
</script>


<template>
    <div
        href="#"
        class="block p-6 w-full mb-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
        <h5
            v-if="title"
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >{{ title }}</h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
            <slot />
        </p>
    </div>
</template>
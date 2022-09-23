<template>
    <NuxtLayout>
        <div class="min-h-screen bg-emerald-50 text-yellow-900 font-mono">
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import "./assets/css/tailwind.css";
useNuxtApp().$localstorage().restore();
</script>


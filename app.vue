<template>
    <div class="min-h-screen bg-emerald-50 text-yellow-900 font-mono">
        <navigate :identities="identities" :active="active_identity" />

        <div v-if="active_identity">
            <identity :identity="active_identity" :key="'person' + identity_index">
                <identity-inbox :person="active_identity" />
            </identity>

            <identity-delete :index="active_index" />
        </div>
    </div>
</template>


<script lang="ts" setup>
import "./assets/css/tailwind.css";

const identities = useIdentities();
const identity_index = useIdentityIndex();
const active_index = computed(() =>
    typeof identities.value[identity_index.value] === "object"
        ? identity_index.value
        : 0
);
const active_identity = computed(() => identities.value[active_index.value]);

useNuxtApp().$localstorage().restore();
</script>


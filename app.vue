<template>
    <div class="min-h-screen bg-emerald-50 text-yellow-900 font-mono">
        <div class="w-full flex flex-wrap space-between select-none border-b border-purple-200">
            <div
                class="border px-5 py-3 leading-32 border-purple-200 text-purple-800 cursor-pointer transition-opacity"
                :class="creating_identity ? 'opacity-0' : identities.length === 0 ? 'bg-emerald-100' : ''"
                v-on:click="newIdentity"
            >New Identity</div>
            <div
                class="flex-auto text-center border px-5 py-3 border-purple-200 text-purple-800 cursor-pointer"
                :class="active_identity.username === identity.username ? 'bg-yellow-200 italic border-purple-300 shadow-md' : 'text-slate-500'"
                v-for="(identity) in identities"
                :key="identity.username"
                v-on:click="active_identity_index = identities.findIndex((p) => p.username === identity.username)"
            >{{ identity.name }}</div>
        </div>

        <person
            v-if="active_identity"
            :person="active_identity"
            :key="'person' + active_identity_index"
        >
            <email v-if="active_identity" :person="active_identity" />
        </person>
        <div class="mt-52 text-center select-none" v-if="identities.length > 0">
            <div class="text-center text-sm text-emerald-700 mb-1 italic">{{ delete_message }}</div>
            <div
                class="border rounded-b p-2 cursor-pointer font-bold bg-red-100 border-red-200 text-red-900"
                :class="deleting ? 'text-blue-200 bg-slate-100' : ''"
                v-on:click="deleteActive"
            >Delete Identity (🪦 {{ active_identity?.name }})</div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import "./assets/css/tailwind.css";

const app = useNuxtApp();
const identities = useIdentities();
const active_identity_index = ref(0);

const active_index = computed(() =>
    typeof identities.value[active_identity_index.value] === "object"
        ? active_identity_index.value
        : 0
);

const deleting = ref(false);
const delete_message = ref("");

const active_identity = computed(() => identities.value[active_index.value]);

onMounted(() => {
    app.$localstorage()
        .restore()
        .then(() => {
            if (
                typeof identities.value[active_identity_index.value] !==
                "object"
            ) {
                newIdentity();
            }
        });
});

const creating_identity = ref(false);

const newIdentity = () => {
    if (creating_identity.value) {
        return;
    }
    creating_identity.value = true;
    setTimeout(() => (creating_identity.value = false), 3000);
    identities.value.push(app.$identity().person());
    active_identity_index.value = identities.value.length - 1;
    app.$localstorage().save();
};

const deleteActive = () => {
    if (deleting.value) {
        return;
    }
    delete_message.value = "Success! Deleted " + active_identity.value.name;
    setTimeout(() => {
        delete_message.value = "";
    }, 3000);
    deleting.value = true;
    setTimeout(() => {
        deleting.value = false;
    }, 1500);
    identities.value.splice(active_identity_index.value, 1);
    active_identity_index.value = Math.max(0, active_identity_index.value - 1);
    app.$localstorage().save();
};
</script>


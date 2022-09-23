<script setup>
const props = defineProps({ identity: Object });

const {
    first_name,
    name: full_name,
    avatar,
    jobTitle,
    employer,
    birthdate,
    phone,
    bio,
    password,
    password_secure,
    password_secure2,
    password_secure3,
    email,
    username,
    address: { address, city, postcode },
} = props.identity;

const person_title = full_name + " @" + username;
const saving = ref(false);
const app = useNuxtApp();
const save_person = () => {
    app.$localstorage().save();
    saving.value = true;
    setTimeout(() => (saving.value = false), 2000);
};
</script>
    

<template>
    <div>
        <div class="p-6 break-words">
            <card :title="person_title">
                <div class="flex flex-col sm:flex-row pt-2">
                    <div class="select-none">
                        <img :src="avatar" alt="avatar" class="rounded-full shadow-lg w-48 mx-auto" />
                    </div>

                    <div class="p-6">
                        <div class="font-bold">{{ identity.email }}</div>
                        <div class="font-bold tracking-widest text-lg">{{ password_secure }}</div>
                        <div class="mt-2 italic">Extra passwords:</div>
                        <div>{{ password }}</div>
                        <div>{{ password_secure2 }}</div>
                        <div>{{ password_secure3 }}</div>
                    </div>
                </div>
            </card>
            <div class="italic text-sm px-6 mb-6 text-xs text-center text-purple-500">{{ bio }}</div>

            <card :title="'Email inbox - ' + identity.email">
                <slot />
            </card>

            <card title="Notes" class="relative">
                <textarea
                    v-on:blur="save_person"
                    v-model="identity.notes"
                    id="message"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="website, reason, etc"
                ></textarea>
                <div
                    class="absolute right-8 bottom-8 border border-slate-100 bg-slate-50 text-yellow-600 text-xs italic"
                    v-if="saving"
                >Saved!</div>
            </card>

            <div class="flex gap-6 flex-col md:flex-row">
                <card :title="'About ' + first_name">
                    <div class="mt-3">{{ jobTitle }} at {{ employer }}</div>
                    <div class="my-1">birthdate: {{ birthdate }}</div>

                    <div class="border-b my-4"></div>
                    <div class="mt-1">{{ address }}, {{ city }}</div>
                    <div>{{ postcode }}</div>
                    <div class="my-2">phone: {{ phone }}</div>
                </card>
            </div>
        </div>
    </div>
</template>
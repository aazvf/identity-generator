<script setup>
const props = defineProps({ person: Object });

const {
    name: full_name,
    avatar,
    jobTitle,
    employer,
    birthdate,
    phone,
    bio,
    bio_phrase,
    password,
    password_secure,
    email,
    username,
    address: { address, city, postcode },
    bank: { issuer, number, cvv },
} = props.person;

const person_title = full_name + " @" + username + " (" + birthdate + ")";
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
        <!-- <div>{{ person }}</div> -->

        <div class="p-6">
            <card :title="person_title">
                <div class="flex pt-2">
                    <div class="select-none">
                        <img :src="avatar" alt="avatar" class="rounded-full shadow-lg" />
                    </div>

                    <div class="p-6">
                        <div>{{ person.email }}</div>
                        <div>{{ password }}</div>
                        <div>{{ password_secure }}</div>
                    </div>
                </div>
            </card>
            <div class="italic text-sm px-6 mb-12 text-xs text-center">{{ bio }}</div>

            <card :title="'Email inbox - ' + person.email">
                <slot />
            </card>

            <card title="Notes" class="relative">
                <textarea
                    v-on:blur="save_person"
                    v-model="person.notes"
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

            <div class="flex gap-6">
                <card title="Additional info">
                    <div>{{ jobTitle }} at {{ employer }}</div>

                    <div class="mt-3">{{ address }}, {{ city }}, {{ postcode }}</div>
                    <div>{{ phone }}</div>
                </card>
                <card title="Bank">
                    <div>{{ issuer }}</div>
                    <div>{{ number }}</div>
                    <div>{{ cvv }}</div>
                </card>
            </div>
        </div>
    </div>
</template>
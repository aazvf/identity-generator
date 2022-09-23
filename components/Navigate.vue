<script setup>
const props = defineProps({
    identities: Array,
    active_identity: Object,
});

const identity_index = useIdentityIndex();
const creating_identity = ref(false);

const newIdentity = () => {
    if (creating_identity.value) {
        return;
    }
    creating_identity.value = true;
    setTimeout(() => (creating_identity.value = false), 3000);
    useNuxtApp().$localstorage().newIdentity();
};
</script>
    
    
    <template>
    <div class="w-full flex flex-wrap space-between select-none border-b border-purple-200">
        <div
            class="border px-5 py-3 leading-32 border-purple-200 text-purple-800 cursor-pointer transition-opacity"
            :class="creating_identity ? 'opacity-0' : identities.length === 0 ? 'bg-emerald-100' : ''"
            v-on:click="newIdentity"
        >New identity</div>
        <div
            class="flex-auto text-center border px-5 py-3 border-purple-200 text-purple-800 cursor-pointer"
            v-for="(identity, index) in identities"
            :key="identity.username"
            :class="identity_index === index ? 'bg-yellow-200 italic border-purple-300 shadow-md' : 'text-slate-500'"
            v-on:click="identity_index = index"
        >{{ identity.name }}</div>
    </div>
</template>
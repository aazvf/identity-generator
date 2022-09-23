<script setup>
const props = defineProps({
    index: Number,
    person: Object,
});

const deleting = ref(false);
const delete_message = ref("");

const deleteActive = () => {
    if (deleting.value) {
        return;
    }
    delete_message.value = "Success! Deleted " + props.person.name;
    setTimeout(() => {
        delete_message.value = "";
    }, 3000);
    deleting.value = true;
    setTimeout(() => {
        deleting.value = false;
    }, 1500);

    app.$identity().removeIdentity(props.index);
};
</script>
    
    
    <template>
    <div class="mt-52 select-none text-right h-1 relative">
        <div
            class="text-right text-sm text-emerald-700 mb-1 italic absolute right-3 -top-8"
        >{{ delete_message }}</div>
        <div
            class="inline-block ml-auto mr-2 border rounded-b p-2 cursor-pointer font-bold bg-red-100 border-red-200 text-red-900"
            :class="deleting ? 'text-blue-200 bg-slate-100' : ''"
            v-on:click="deleteActive"
        >Delete Identity (🪦 {{ person?.name }})</div>
    </div>
</template>
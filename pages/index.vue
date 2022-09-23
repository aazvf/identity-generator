<template>
    <div>
        <navigate :identities="identities" :active="active_identity" />

        <div v-if="active_identity">
            <identity :identity="active_identity" :key="'person' + identity_index">
                <identity-inbox :person="active_identity" />
            </identity>

            <div class="text-center pt-52">
                <a href="/export" class="underline italic">export</a>
            </div>

            <identity-delete :index="active_index" />
        </div>
    </div>
</template>


<script lang="ts" setup>
const identities = useIdentities();
const identity_index = useIdentityIndex();
const active_index = computed(() =>
    typeof identities.value[identity_index.value] === "object"
        ? identity_index.value
        : 0
);
const active_identity = computed(() => identities.value[active_index.value]);
</script>


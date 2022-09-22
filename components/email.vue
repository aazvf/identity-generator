<script setup>
import Mailjs from "../mailjs/index";
const props = defineProps({
    person: Object,
});
// https://github.com/cemalgnlts/Mailjs/blob/master/src/index.ts

const client = new Mailjs();

const domain = useMailDomain();
const app = useNuxtApp();

onMounted(() => {
    if (!props.person.mailjs.registered) {
        register();
    }
});

if (domain.value.length === 0) {
    client.getDomains().then((response) => {
        console.log(response);
        domain.value = response.data[0].domain;
        props.person.email = props.person.username + "@" + domain.value;
        app.$localstorage().save();
        register();
    });
}

const check_mail = () => {
    if (!props.person.mailjs.registered) {
        register();
        return;
    }
    checking.value = true;

    if (!props.person.mailjs.token || !props.person.mailjs.id) {
        login().then(get_messages);
    } else {
        client.id = props.person.mailjs.id;
        client.token = props.person.mailjs.token;
        get_messages();
    }
};

const register = () => {
    if (props.person.email.length < 1) {
        return;
    }
    return client
        .register(props.person.email, props.person.password)
        .then((response) => {
            props.person.mailjs.registered = true;
            app.$localstorage().save();
            console.log(response);
            console.log("registered");
        });
};

const login = () => {
    if (props.person.email.length < 1) {
        return;
    }
    return client
        .login(props.person.email, props.person.password)
        .then((response) => {
            console.log(response);
            client.id = response.data.id;
            client.token = response.data.token;
            props.person.mailjs.id = response.data.id;
            props.person.mailjs.token = response.data.token;
            app.$localstorage().save();
        });
};

const get_messages = () => {
    checked.value = false;

    return client.getMessages().then((response) => {
        console.log(response);
        props.person.mailjs.messages = response.data;
        checking.value = false;
        checked.value = true;
        app.$localstorage().save();
    });
};

const get_message = (id) => {
    if (
        client.id !== props.person.mailjs.id ||
        client.token !== props.person.mailjs.token
    ) {
        client.id = props.person.mailjs.id;
        client.token = props.person.mailjs.token;
    }
    client.getMessage(id).then((response) => {
        console.log(response);
        props.person.mailjs.messages.find((m) => m.id === id).text =
            response.data.text;
        props.person.mailjs.messages.find((m) => m.id === id).html =
            response.data.html;
        app.$localstorage().save();
    });
};

const checking = ref(false);
const checked = ref(false);
</script>


<template>
    <div class="relative">
        <div class="pb-3">
            <div
                v-for="(message, index) in person.mailjs.messages"
                :key="index"
                class="w-full border border-blue-300 rounded bg-blue-50 text-blue-900 p-5"
            >
                <div class="font-bold text-lg mb-1">{{ message.subject }}</div>
                <div
                    class="italic border-b pb-3 mb-3"
                >{{ message.createdAt }} - {{ message.from.address }}</div>

                <div v-if="message.text">
                    <div v-if="message.html" v-html="message.html"></div>
                </div>
                <div v-else>
                    <div class="text-sm">{{ message.intro }}</div>
                    <div
                        class="italic underline text-xs"
                        v-on:click="get_message(message.id)"
                    >Read full email</div>
                </div>
            </div>
        </div>
        <div v-if="person.mailjs.messages.length === 0">
            <div v-if="!person.mailjs.registered">Registering disposable inbox ... please wait.</div>
            <div v-else>
                Inbox ready!
                <span
                    v-if="checked && person.mailjs.messages.length === 0"
                >no emails yet...</span>
            </div>
        </div>
        <div
            v-if="person.mailjs.registered"
            class="border rounded shadow border-emerald-200 bg-emerald-50 text-emerald-900 py-1 px-3 inline-block mt-3 hover:bg-emerald-100"
        >
            <div v-if="checking">Checking email inbox... please wait.</div>
            <div v-else v-on:click="check_mail" class="cursor-pointer">Check for emails now</div>
        </div>
        <a
            class="absolute -bottom-4 -right-2 border py-0.5 px-2 border-slate-400 text-slate-400 bg-slate-50 rounded text-xs hover:bg-slate-200"
            target="_blank"
            href="https://mail.tm/en/"
            rel="noopener noreferer"
        >View inbox @ mail.tm</a>
    </div>
</template>
<script setup>
import Mailjs from "../mailjs/index";
const props = defineProps({
    person: Object,
});
// https://github.com/cemalgnlts/Mailjs/blob/master/src/index.ts

const client = new Mailjs();

const domain = useMailDomain();
const app = useNuxtApp();

if (domain.value.length === 0) {
    client.getDomains().then((response) => {
        console.log("hadsfasdf asdf das ");
        console.log(response);
        domain.value = response.data[0].domain;
        props.person.email = props.person.username + "@" + domain.value;

        app.$localstorage().save();
    });
}

const check_mail = () => {
    checking.value = true;
    if (!props.person.mailjs.token || !props.person.mailjs.id) {
        console.log("registering");
        return register().then(() => {
            setTimeout(() => login().then(get_messages), 1000);
        });
    } else {
        console.log("login");
        login().then(get_messages);
    }
};

const register = () => {
    if (props.person.email.length < 1) {
        return;
    }
    return client
        .register(props.person.email, props.person.password)
        .then((response) => {
            console.log(response);
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
    return client.getMessages().then((response) => {
        console.log(response);
        props.person.mailjs.messages = response.data;
        checking.value = false;
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
</script>


<template>
    <div>
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
        <div v-if="checking">Checking email inbox... please wait.</div>
        <div v-else v-on:click="check_mail" class="pointer-cursor underline">Check for emails</div>
    </div>
</template>
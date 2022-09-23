<script setup>
import Mailjs from "/mailjs/index";

const props = defineProps({
    person: Object,
});

const client = new Mailjs();
const domain = useMailDomain();
const app = useNuxtApp();

const checking = ref(false); // is it currently checking for messages
const checked = ref(false); // has it already checked for messages

// Register the email account on mount if not already
onMounted(() => {
    if (!props.person.mailjs.registered) {
        register();
    }
});

// If we haven't got the mailjs domain list yet, then get it and register a new email address
if (domain.value.length === 0) {
    client.getDomains().then((response) => {
        domain.value = response.data[0].domain;
        console.log(props.person.email.length);
        if (props.person.email.length < 2) {
            props.person.email = props.person.username + "@" + domain.value;
            app.$localstorage().save();
        }
        if (!props.person.mailjs.registered) {
            register();
        }
    });
}

// login if not already and check for new messages.
const check_mail = () => {
    if (!props.person.mailjs.registered) {
        register();
        return;
    }
    checking.value = true;

    if (!props.person.mailjs.token || !props.person.mailjs.id) {
        console.log("login");
        login().then(get_messages);
    } else {
        console.log("login from cache");
        client.id = props.person.mailjs.id;
        client.token = props.person.mailjs.token;
        get_messages();
    }
};

// register our generated email/password combo with mailjs to start accepting emails.
const register = () => {
    if (props.person.email.length < 1) {
        return;
    }
    return client
        .register(props.person.email, props.person.password)
        .then((response) => {
            console.log(response);
            props.person.mailjs.registered = true;
            props.person.mailjs.id = response.data.id;
            app.$localstorage().save();
        });
};

// login after registering with our email/password combo to get an id/token for future
const login = () => {
    if (props.person.email.length < 1) {
        return;
    }
    client.id = props.person.mailjs.id;
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

// get messages for our currently logged in account.
const get_messages = () => {
    checked.value = false;
    return client.getMessages().then((response) => {
        props.person.mailjs.messages = response.data;
        checking.value = false;
        checked.value = true;
        app.$localstorage().save();
    });
};

// get the full email body for a specific email
const get_message = (id, html = false) => {
    if (
        client.id !== props.person.mailjs.id ||
        client.token !== props.person.mailjs.token
    ) {
        client.id = props.person.mailjs.id;
        client.token = props.person.mailjs.token;
    }
    client.getMessage(id).then((response) => {
        props.person.mailjs.messages.find((m) => m.id === id).body = html
            ? response.data.html
            : response.data.text;
        app.$localstorage().save();
    });
};
</script>
    
    
    <template>
    <div class="relative">
        <div class="pb-3">
            {{ person.mailjs.registered }}
            <div
                v-for="(message, index) in person.mailjs.messages"
                :key="index"
                class="w-full border border-blue-300 rounded bg-blue-50 text-blue-900 p-5 mt-5"
            >
                <div class="font-bold text-lg mb-1">{{ message.subject }}</div>
                <div
                    class="italic border-b pb-3 mb-3"
                >{{ message.createdAt }} - {{ message.from.address }}</div>

                <div v-if="message.body" v-html="message.body"></div>
                <div v-else>
                    <div class="text-sm mb-4 pt-2 text-md">{{ message.intro }}</div>

                    <div class="text-xs border-t pt-4">
                        <span
                            class="italic underline cursor-pointer"
                            v-on:click="get_message(message.id)"
                        >read full text</span>
                        or
                        <span
                            class="italic underline cursor-pointer"
                            v-on:click="get_message(message.id, true)"
                        >full html & images</span>
                    </div>
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
            class="absolute -bottom-4 -right-2 py-0.5 px-2 text-slate-400 bg-slate-50 rounded text-xs hover:bg-slate-200"
            target="_blank"
            href="https://mail.tm/en/"
            rel="noopener noreferer"
        >powered by mail.tm</a>
    </div>
</template>
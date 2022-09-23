import localforage from "localforage";

const storage_key = "identities";

class Storage {
    constructor() {
        this.identities = useIdentities();
    }

    // Save identities to storage except email body content.
    save() {
        const payload = JSON.parse(JSON.stringify(this.identities.value)).map((i) => {
            i.mailjs.messages = i.mailjs.messages.map((m) => {
                m.body = "";
                return m;
            });
            return i;
        });

        localforage.setItem(storage_key, JSON.stringify(payload));
    }

    // Restore identities from storage or create a new one
    restore() {
        return localforage.getItem(storage_key).then((stored) => {
            if (stored) {
                this.identities.value = JSON.parse(stored);
            } else {
                useNuxtApp().$identity().newIdentity();
            }
        });
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            localstorage: () => new Storage(),
        },
    };
});

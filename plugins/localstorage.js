import localforage from "localforage";

const storage_key = "identities";

class Storage {
    constructor() {
        this.identities = useIdentities();
    }

    save() {
        console.log("saved!");
        localforage.setItem(storage_key, JSON.stringify(this.identities.value));
    }

    restore() {
        return localforage.getItem(storage_key).then((stored) => {
            console.log(stored);
            if (stored) {
                console.log("restoring");
                this.identities.value = JSON.parse(stored);
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

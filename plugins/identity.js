// import { faker } from "@faker-js/faker/locale/en_GB";
import { faker } from "@faker-js/faker/locale/en_IE";

class Identity {
    constructor() {
        this.domain = useMailDomain();
    }
    person() {
        const datetime = faker.date.birthdate({ min: 24, max: 44, mode: "age" });

        const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][datetime.getMonth()];

        const birthdate = datetime.getDate() + " " + month + " " + datetime.getFullYear();

        const person = {
            notes: "",
            first_name: faker.name.firstName("male"),
            last_name: faker.name.lastName("male"),
            avatar: faker.image.avatar(),
            jobTitle: faker.name.jobTitle(),
            employer: faker.company.name(),
            birthdate: birthdate,
            phone: faker.phone.number(),
            bio:
                faker.hacker.adjective() +
                " " +
                faker.hacker.noun() +
                "s are " +
                faker.hacker.ingverb() +
                " my " +
                faker.hacker.adjective() +
                " " +
                faker.hacker.noun() +
                "... I'll " +
                faker.hacker.verb() +
                " their " +
                faker.hacker.adjective() +
                " " +
                faker.hacker.noun() +
                "! ",

            bio_phrase: faker.hacker.phrase(),
            password: faker.internet.password(20, true),
            password_secure: faker.internet.password(20, false, /[A-Za-z0-9!\$]/),
            email: "",
            mailjs: { id: "", token: "", messages: [] },
        };
        person.name = person.first_name + " " + person.last_name;
        person.username = faker.internet.userName(person.first_name, person.last_name).toLowerCase() + faker.random.numeric(2);
        if (this.domain.value.length > 0) {
            person.email = person.username + "@" + this.domain.value;
        }
        // person.email = faker.internet.email(person.first_name, person.last_name);
        person.address = this.address();
        person.bank = this.bank();
        person.car = this.car();
        return person;
    }

    address() {
        return {
            address: faker.address.streetAddress(true),
            city: faker.address.cityName(),
            postcode: faker.address.zipCode(),
        };
    }

    bank() {
        return {
            issuer: faker.finance.creditCardIssuer(),
            number: faker.finance.creditCardNumber(),
            cvv: faker.finance.creditCardCVV(),
        };
    }

    car() {
        return {
            name: faker.vehicle.vehicle(),
            reg: faker.vehicle.vrm(),
        };
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            identity: () => new Identity(),
        },
    };
});

export default class Email {
    private value: string;

    constructor (email: string) {
        if (!this.validateEmail(email)) throw new Error("Invalid email");
        this.value = email;
    }

    validateEmail (email: string) {
        return email.match(/^(.+)@(.+)$/);
    }

    getValue () {
        return this.value;
    }

}

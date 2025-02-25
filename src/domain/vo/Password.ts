export default class Password {
    private value: string;

    constructor (password: string) {
        if (!this.validatePassword(password)) throw new Error("Invalid password");
        this.value = password;
    }

    validatePassword (password: string) {
        return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    }

    getValue () {
        return this.value;
    }

}

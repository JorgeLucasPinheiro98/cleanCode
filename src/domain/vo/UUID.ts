import crypto from "crypto";

export default class UUID {
    private value: string;

    constructor (uuid: string) {
        if (!this.validateUUID(uuid)) throw new Error("Invalid UUID");
        this.value = uuid;
    }

    static create () {
        return new UUID(crypto.randomUUID());
    }

    validateUUID (uuid: string) {
        return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }

    getValue () {
        return this.value;
    }

}

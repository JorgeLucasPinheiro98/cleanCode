export default class CarPlate {
    private value: string;

    constructor (carPlate: string) {
        if (!this.validateCarPlate(carPlate))  throw new Error("Invalid car plate");
        this.value = carPlate;
    }

    validateCarPlate (carPlate: string) {
        return carPlate.match(/[A-Z]{3}[0-9]{4}/);
    }

    getValue () {
        return this.value;
    }

}

import Name from "./vo/Name";
import Email from "./vo/Email";
import Cpf from "./vo/Cpf";
import CarPlate from "./vo/CarPlate";
import Password from "./vo/Password";
import UUID from "./vo/UUID";

// Aggregate composto por a Entity Account e os VOs UUID, Name, Email, Cpf, carPlate, Password
// Todo aggregate tem um Aggregate Root <AR>, e é a Entity que "lidera" o aggregate
// Entity (porque tem identidade e pode sofrer mutação de estado)
export default class Account {
    // VO (carrega um ou mais valores, é imutável)
    private accountId: UUID;
    // VO (carrega um ou mais valores, é imutável)
    private name: Name;
    // VO (carrega um ou mais valores, é imutável)
    private email: Email;
    // VO (carrega um ou mais valores, é imutável)
    private cpf: Cpf;
    // VO (carrega um ou mais valores, é imutável)
    private carPlate?: CarPlate;
    // VO (carrega um ou mais valores, é imutável)
    private password: Password;

    constructor (
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        password: string,
        carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean 
    ) {
        this.accountId = new UUID(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new Cpf(cpf);
        if (isDriver) this.carPlate = new CarPlate(carPlate);
        this.password = new Password(password);
    }

    static create (
        name: string,
        email: string,
        cpf: string,
        password: string,
        carPlate: string,
        isPassenger: boolean,
        isDriver: boolean
    ) {
        const accountId = UUID.create().getValue();
        return new Account(accountId, name, email, cpf, password, carPlate, isPassenger, isDriver);
    }

    getName() {
        return this.name.getValue();
    }

    setName (name: string) {
        this.name = new Name(name);
    }

    getEmail () {
        return this.email.getValue();
    }

    getCpf () {
        return this.cpf.getValue();
    }

    getCarPlate () {
        return this.carPlate?.getValue();
    }

    getPassword () {
        return this.password.getValue();
    }

    getAccountId () {
        return this.accountId.getValue();
    }
}

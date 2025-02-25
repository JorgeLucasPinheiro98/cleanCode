import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class ORM {
    @inject("databaseConnection")
    connection!: DatabaseConnection;
    
    async save (model: Model) {
        const columns = model.columns.map(column => column.column).join(",");
        const params = model.columns.map((column, index) => `$${index + 1}`).join(",");
        const values = model.columns.map(column => model[column.property]);
        const query = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`;
        await this.connection.query(query, values);
    }

    async get (model: any, field: string, value: any) {
        const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
        const [data] = await this.connection.query(query, [value]);
        if (!data) return;
        const obj = new model();
        for (const column of model.prototype.columns) {
            obj[column.property] = data[column.column];
        }
        return obj;
    }
}

export class Model {
    schema!: string;
    table!: string;
    columns!: { column: string, property: string }[]
    [property: string]: any;
}

@model("ccca", "account")
export class AccountModel extends Model {
    @column("account_id")
    accountId!: string;
    @column("name")
    name!: string;
    @column("email")
    email!: string;
    @column("cpf")
    cpf!: string;
    @column("password")
    password!: string;
    @column("car_plate")
    carPlate!: string;
    @column("is_passenger")
    isPassenger!: boolean;
    @column("is_driver")
    isDriver!: boolean;

    constructor (accountId: string, name: string, email: string, cpf: string, password: string, carPlate: string, isPassenger: boolean = false, isDriver: boolean = false) {
        super();
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.carPlate = carPlate;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
    }
}

export function model (schema: string, table: string) {
    return function (target: any) {
        target.prototype.schema = schema;
        target.prototype.table = table;
    }
}

export function column (column: string) {
    return function (target: any, propertyKey: string) {
        target.columns = target.columns || [];
        target.columns.push({ column, property: propertyKey });
    }
}

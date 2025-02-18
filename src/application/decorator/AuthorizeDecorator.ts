export default class AuthorizeDecorator {

    constructor (readonly usecase: any) {
    }

    async execute (input: any): Promise<any> {
        console.log("verify authorization");
        return this.usecase.execute(input);
    }
}
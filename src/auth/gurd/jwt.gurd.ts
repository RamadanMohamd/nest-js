import { AuthGuard } from "@nestjs/passport";

export class JwtGurd extends  AuthGuard('jwt') {
    constructor(){
        super()
    }
}
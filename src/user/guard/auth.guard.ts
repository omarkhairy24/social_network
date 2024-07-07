
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { User } from "../user.entity";
import { InjectModel } from "@nestjs/sequelize";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(User) private repo:typeof User,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:'jwtsecret'
        });
    }

    async validate(payload:any){
        const {sub} = payload;
        
        const user:User = await this.repo.findByPk(sub)
        if(!user) throw new UnauthorizedException();
        if(this.checkPasswordChanged(user,payload)) throw new UnauthorizedException('invalid token');
        return user;
    }

    private checkPasswordChanged(user:User,payload:any){
        if(user.passwordChangedAt){
            const PCT = user.passwordChangedAt.getTime() / 1000;
            return payload.iat < PCT
        }
        return false;
    }
}
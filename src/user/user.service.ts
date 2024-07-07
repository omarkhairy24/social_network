import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/user/user.entity";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private repo:typeof User){}

    create(name:string,username:string,email:string,password:string){
        return this.repo.create({name,username,email,password})
    }

    findByIds(id:string[]){
        return this.repo.findAll({where:{id}})
    }

    findAll(){
        return this.repo.findAll()
    }

    find(email:string){
        return this.repo.findOne({where:{email}})
    }

    findOne(username:string){
        return this.repo.findOne({where:{username}})
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    async remove(id:string){
        const user = await this.repo.findByPk(id)
        if(!user){
            throw new NotFoundException('user not found')
        }
        
        return user.destroy()
    }
}
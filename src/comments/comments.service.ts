import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comments } from "./comments.entity";
import * as fs from 'fs';
import { join } from "path";


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comments) private repo:typeof Comments
    ){}

    findAll(postId:string){
        return this.repo.findAll({where:{postId}})
    }

    findAllByIds(postIds:string[]){
        return this.repo.findAll({where:{postId:postIds}})
    }

    findOne(id:string){
        return this.repo.findOne({where:{id}})
    }

    create(postId:string,userId:string,comment:string,image:string){
        return this.repo.create({postId,userId,comment,image})
    }

    async remove(id:string,userId:string){
        const comment = await this.repo.findByPk(id)
        if(!comment) throw new NotFoundException();

        if(comment.userId !== userId) throw new NotAcceptableException();

        if(comment.image){
            fs.unlinkSync(join(`/home/omar/Desktop/social-network/uploads/${comment.image}`))
        }

        await comment.destroy();
        return true
    }
}
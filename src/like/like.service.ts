import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Like } from "./like.entity";

@Injectable()
export class LikeService {
    constructor(
        @InjectModel(Like) private repo: typeof Like
    ){}

    findAll(postId:string){
        return this.repo.findAll({where:{postId}})
    }

    findAllByIds(postId:string[]){
        return this.repo.findAll({where:{postId}})
    }

    async create(postId:string,userId:string){
        const like = await this.repo.findOne({where:{postId,userId}})
        if(like) throw new BadRequestException('already liked');
        return this.repo.create({postId,userId})
    }

    

    async remove(postId:string,userId:string){
        const like = await this.repo.findOne({where:{postId,userId}})
        if(!like) throw new NotFoundException();

        if (like.userId !== userId) throw new NotAcceptableException();

        await like.destroy();

        return true
    }
}
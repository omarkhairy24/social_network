import { Posts } from "./post.entity";
import { InjectModel } from "@nestjs/sequelize";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PostsService{

    constructor(@InjectModel(Posts) private repo:typeof Posts){}

    async create(header:string,description:string,userId:string,images:string[]){
        return this.repo.create({header , description , userId ,images})
    }

    findAll(){
        return this.repo.findAll();
    }

    findAllById(postId:string){
        return this.repo.findAll({where:{postId}})
    }

    findByUserIds(userIds: string[]){
        return this.repo.findAll({where:{userId: userIds}});
    }

    findOne(id:string){
        return this.repo.findByPk(id)
    }

    async updateOne(id:string,data:Partial<Posts>){
        const post = await this.repo.findByPk(id)
        if(!post) throw new NotFoundException();
        post.set(data)
        await post.save()
        return post
    }

    async deletePost(id:string){
        const post = await this.repo.findByPk(id)
        if (!post) throw new NotFoundException();
        return post.destroy();
    }
}
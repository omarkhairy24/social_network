import { Injectable } from "@nestjs/common";
import { Follow } from "./follow.entity";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/user/user.entity";

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follow) private repo:typeof Follow
    ){}

    findFollowers(id){
        return this.repo.findAll({where:{followingId:id}})
    }

    findFollowing(id){
        return this.repo.findAll({where:{followerId:id}})
    }

    findOne(followerId,followingId){
        return this.repo.findOne({where:{followerId,followingId}})
    }

    followUser(followerId,followingId){
        return this.repo.create({followerId , followingId})
    }

    unFollowUser(followerId,followingId){
        return this.repo.destroy({where:{followerId , followingId}})
    }
}
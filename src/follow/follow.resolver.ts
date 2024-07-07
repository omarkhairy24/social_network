import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FollowService } from "./follow.service";
import { Follow } from "./follow.entity";
import { BadRequestException, NotFoundException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guard/GqlAuthGuard";


@Resolver()
export class FollowResolver{
    constructor(
        private followService : FollowService
    ){}

    @Query(()=>[Follow])
    @UseGuards(JwtAuthGuard)
    async getFollowers(
        @Context('req') req
    ){
        return this.followService.findFollowers(req.user.id)
    }

    @Mutation(()=>Follow ,{name:'follow'})
    @UseGuards(JwtAuthGuard)
    async follow(
        @Context('req') req,
        @Args({name:'userId',nullable:false}) userId:string
    ){
        const follow = await this.followService.findOne(req.user.id,userId)
        if(follow) throw new BadRequestException('you already follows this user');
        return await this.followService.followUser(req.user.id,userId);
    }

    @Mutation(()=>String ,{name:'unfollow'})
    @UseGuards(JwtAuthGuard)
    async unfollow(
        @Context('req') req,
        @Args({name:'userId',nullable:false}) userId:string
    ){
        const follow = await this.followService.findOne(req.user.id,userId)
        if(!follow) throw new NotFoundException();
        await this.followService.unFollowUser(req.user.id,userId);
        return 'done'
    }
}
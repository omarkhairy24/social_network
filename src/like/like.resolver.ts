import { Args, Mutation, Resolver,Query, Context, ResolveField, Parent } from "@nestjs/graphql";
import { LikeService } from "./like.service";
import { Like } from "./like.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guard/GqlAuthGuard";
import { Dataloader } from "src/dataloader.service";
import { User } from "src/user/user.entity";
import { Posts } from "src/posts/post.entity";
import { PostsService } from "src/posts/post.service";

@Resolver(()=>Like)
export class LikeResolver {
    constructor(
        private likeservice:LikeService,
        private dataLoader:Dataloader
    ){}

    @ResolveField('users',()=>User)
    async user(@Parent() like:Like){
        const {userId} = like
        return this.dataLoader.userLoader.load(userId)
    }

    @Query(()=>[Like])
    async getLikes(
        @Args({name:'postId'}) postId:string
    ){
        return await this.likeservice.findAll(postId)
    }

    @Mutation(()=>Like)
    @UseGuards(JwtAuthGuard)
    async addLike(
        @Args('postId') postId:string,
        @Context('req') req
    ){
        return this.likeservice.create(postId,req.user.id)
    }

    @Mutation(()=> String)
    @UseGuards(JwtAuthGuard)
    async removeLike(
        @Args('postId') postId:string,
        @Context('req') req
    ){
        return this.likeservice.remove(postId,req.user.id)
    }
}
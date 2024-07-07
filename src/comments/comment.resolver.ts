import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Comments } from "./comments.entity";
import { CommentService } from "./comments.service";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { join } from "path";
import { createWriteStream } from "fs";
import { BadRequestException, NotAcceptableException, NotFoundException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guard/GqlAuthGuard";
import * as fs from 'fs';
import { User } from "src/user/user.entity";
import { Dataloader } from "src/dataloader.service";

@Resolver(()=>Comments)
export class CommentResolver{

    constructor(
        private commentService:CommentService,
        private dataLoader:Dataloader
    ){}

    async uploadPhoto(file: FileUpload){
        let { createReadStream, filename } = file;
        filename = `${Date.now()}-${filename}`;
        const path = join('uploads', filename);
        const stream = createReadStream();
        const out = createWriteStream(path);
        stream.pipe(out);
        await new Promise((resolve, reject) => {
          out.on('finish', resolve);
          out.on('error', reject);
        });
        return filename
      }

    @Query(()=>[Comments])
    async getComments(
        @Args('postId') postId:string
    ){
        return this.commentService.findAll(postId)
    }

    @Query(()=>Comments)
    async getComment(
        @Args('id') id:string
    ){
        return this.commentService.findOne(id)
    }

    @ResolveField('user',()=>User)
    async user(@Parent() comment:Comments){
        const {userId} = comment
        return this.dataLoader.userLoader.load(userId)
    }

    @Mutation(() => Comments)
    @UseGuards(JwtAuthGuard)
    async addComment(
        @Args('postId') postId:string,
        @Args({name:'comment',nullable:true}) comment:string,
        @Args({name:'file',type:() => GraphQLUpload,nullable:true}) file:FileUpload,
        @Context('req') req
    ){
        let image
        if(file){
            image = await this.uploadPhoto(file)
        }

        if(!comment && !file) throw new BadRequestException('you must add comment or photo');

        const cmnt = await this.commentService.create(postId,req.user.id,comment,image)
        return cmnt
    }

    @Mutation(() => Comments)
    @UseGuards(JwtAuthGuard)
    async editComment(
        @Args('id') id:string,
        @Args({name:'comment',nullable:true}) comment:string,
        @Args({name:'file',type:() => GraphQLUpload,nullable:true}) file:FileUpload,
        @Context('req') req
    ){
        const cmnt = await this.commentService.findOne(id)
        if(!cmnt) throw new NotFoundException();
        if(cmnt.userId !== req.user.id) throw new NotAcceptableException();

        cmnt.set({
            comment
        })

        if(file){
            if(cmnt.image){
                fs.unlinkSync(join(`/home/omar/Desktop/social-network/uploads/${cmnt.image}`))
            }

            cmnt.image = await this.uploadPhoto(file)
        }

        await cmnt.save()

        return cmnt
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deleteComment(
        @Args('id') id:string,
        @Context('req') req
    ){
        return await this.commentService.remove(id,req.user.id)
    }
}
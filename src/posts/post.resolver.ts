import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Posts } from "./post.entity";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { join } from "path";
import { createWriteStream } from "fs";
import { NotAcceptableException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user/guard/GqlAuthGuard";
import { PostsService } from "./post.service";
import * as fs from 'fs';
import { Dataloader } from "src/dataloader.service";
import { User } from "src/user/user.entity";
import { Like } from "src/like/like.entity";
import { Comments } from "src/comments/comments.entity";

@Resolver(()=>Posts)
export class PostResolver{
    constructor(
        private postService:PostsService,
        private dataLoader:Dataloader
    ){}
    private async uploadImages(files){
            const imageUrls = [];
            for (const file of files) {
                let { createReadStream, filename } = await file;
                filename = `${Date.now()}-${filename}`;
                const path = join('uploads', filename);
                const stream = createReadStream();
                const out = createWriteStream(path);
                stream.pipe(out);
                await new Promise((resolve, reject) => {
                    out.on('finish', resolve);
                    out.on('error', reject);
                });
                imageUrls.push(filename);
            }
            return imageUrls
    }

    @Query(()=>[Posts])
    async getPosts(){
        return this.postService.findAll();
    }

    @Query(()=>Posts)
    async getPost(
        @Args({name:'id'}) id:string
    ):Promise<Posts>{
        return this.postService.findOne(id);
    }

    @ResolveField('user',() => User)
    async user(@Parent() post: Posts) {
        const { userId } = post;
        return this.dataLoader.userLoader.load(userId);
    }

    @ResolveField('likes' , ()=>[Like])
    async likes(@Parent() post:Posts){
        return this.dataLoader.likeLoader.load(post.id)
    }

    @ResolveField('comments',()=>[Comments])
    async comments(post:Posts){
        return this.dataLoader.commentLoader.load(post.id)
    }

    @Mutation(() => Posts,{name:'addPost'})
    @UseGuards(JwtAuthGuard)
    async addPost(
        @Args({ name: 'header', type: () => String }) header: string,
        @Args({ name: 'description', type: () => String }) description: string,
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable:true }) files: FileUpload[],
        @Context('req') req
    ): Promise<Posts> {
        try {
            const imageUrls = await this.uploadImages(files);
            const post = await this.postService.create(header,description,req.user.id,imageUrls)
            await post.save()
            return post;
        } catch (error) {
            console.log(error);
        }
    }

    @Mutation(()=>Posts , {name:'updatePost'})
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Args({name:'id'}) id:string,
        @Args({ name: 'header', type: () => String,nullable:true }) header: string,
        @Args({ name: 'description', type: () => String ,nullable:true }) description: string,
        @Args({ name: 'files', type: () => [GraphQLUpload],nullable:true }) files: FileUpload[],
        @Args({name:'oldImages',type:()=> [String] ,nullable:true}) oldImages:string[],
        @Context('req') req
    ):Promise<Posts>{
        let post = await this.postService.findOne(id)
        if (post.userId !== req.user.id) throw new NotAcceptableException();

        let allImages = []
        if(!oldImages && post.images.length > 0 ){
            post.images.forEach(image =>{
                fs.unlinkSync(join(`/home/omar/Desktop/social-network/uploads/${image}`))
            })
        }
        if(Array.isArray(oldImages)){ allImages.push(...oldImages) } else { allImages.push(oldImages) };
        if(files){
            let imageUrls = await this.uploadImages(files)
            allImages.push(...imageUrls)
        }

        return await this.postService.updateOne(id,{
            header,
            description,
            images:allImages
        })
    }

    @Mutation(()=>Boolean ,{name:'deletePost'})
    @UseGuards(JwtAuthGuard)
    async deletePost(
        @Args({name:'id'}) id:string,
        @Context('req') req
    ){
        const post = await this.postService.findOne(id)
        if(post.userId !== req.user.id) throw new NotAcceptableException();
        post.images.forEach(image =>{
            fs.unlinkSync(join(`/home/omar/Desktop/social-network/uploads/${image}`))
        })
        await this.postService.deletePost(id)

        return true
    }
}
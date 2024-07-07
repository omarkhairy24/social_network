import { Args, Mutation, Resolver,Query, Context, ResolveField, Parent } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { UsersService } from "./user.service";
import { Dataloader } from "src/dataloader.service";
import { Posts } from "src/posts/post.entity";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { join } from "path";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guard/GqlAuthGuard";
import { UpdateInfo } from "./dto/updateInfo.dto";
import { createWriteStream } from "fs";
import * as fs from 'fs';

@Resolver(()=>User)
export class UserResolver {
    constructor(
        private userService:UsersService,
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

    @Query(() => User,{name:'getUser'})
    async getUser(
        @Args('username') username:string
    ){
        return await this.userService.findOne(username)
    }

    @ResolveField('followers',()=>[User])
    async followers(@Parent() user: User) {
      return await this.dataLoader.followerLoader.load(user.id);
    }

    @ResolveField('following',()=>[User])
    async follownig(@Parent() user: User) {
      return await this.dataLoader.followingLoader.load(user.id);

    }

    @ResolveField('posts',()=>[Posts])
    async posts(@Parent() user:User){
      return await this.dataLoader.postLoader.load(user.id)
    }

    @Mutation(()=>User)
    @UseGuards(JwtAuthGuard)
    async updateUserInfo(
      @Args({name:'input' , type:()=>UpdateInfo}) input:UpdateInfo,
      @Args({name:'file' , type:() =>GraphQLUpload , nullable:true}) file:FileUpload,
      @Context('req') req
    ){
      const user = await this.userService.findOneById(req.user.id);
      user.set(input)
      if(file){
        if(user.image){
          fs.unlinkSync(join(`/home/omar/Desktop/social-network/uploads/${user.image}`))
        }
        let imageUpload = await this.uploadPhoto(file)
        user.image = imageUpload
      }
      await user.save()
      return user
    }
}
import { Args, Mutation, Resolver,Query, Context, ResolveField, Parent } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import {  signupInput } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException, UseGuards } from "@nestjs/common";
import { LoginResponse, loginInput } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./guard/GqlAuthGuard";
import { UpdatePass } from "./dto/updatePass.dto";
import { UsersService } from "./user.service";
import { Posts } from "src/posts/post.entity";
import { Dataloader } from "src/dataloader.service";

@Resolver(()=>User)
export class authResolver {
    constructor(private userService:UsersService , private jwtService:JwtService,private postLoader:Dataloader){}

    @ResolveField('posts',() => [Posts])
    async posts(@Parent() user: User) {
        return this.postLoader.postLoader.load(user.id);
    }

    @Query(() => [User])
    async Users():Promise<User[]> {
        return this.userService.findAll()
    }
    
    @Mutation(()=>User ,{name:'signup'})
    async signup(@Args('input',{type:()=>signupInput}) input:signupInput){
        const checkEmail = await this.userService.find(input.email)
        if(checkEmail) throw new BadRequestException('this email already in use');

        const checkUsername = await this.userService.findOne(input.username)
        if(checkUsername) throw new BadRequestException('this username is already in use');
        
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(input.password , salt);

        const user = await this.userService.create(input.name,input.username,input.email,hash)
        return user
    }

    @Mutation(()=>LoginResponse ,{name:'login'})
    async login(@Args('input',{type:()=> loginInput}) input:loginInput){
        const user = await this.userService.find(input.email)
        if(!user) throw new BadRequestException('email or password not correct');

        const correctPassword = await bcrypt.compare(input.password , user.password);
        if(!correctPassword) throw new BadRequestException('email or password not correct');

        const payload = {sub:user.id , username:user.username}

        let accessToken = this.jwtService.sign(payload)

        return {accessToken,user}
    }

    @Mutation(() => User ,{name:'updatePassword'})
    @UseGuards(JwtAuthGuard)
    async updatePassword(@Args('input' , {type :()=>UpdatePass}) input:UpdatePass ,@Context('req') req){
        const user = await this.userService.findOneById(req.user.id)
        if(!user) throw new NotFoundException('user not found');

        const compare = await bcrypt.compare(input.currentPassword , user.password);
        if(!compare) throw new BadRequestException('your current password is not correct');

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(input.newPassword,salt);

        user.password = hashedPass

        await user.save();

        return user;
    }

    @Mutation(()=>Boolean,{name:'deleteUser'})
    @UseGuards(JwtAuthGuard)
    async deleteUser (@Context('req') req):Promise<boolean>{
        await this.userService.remove(req.user.id)
        return true
    }

}
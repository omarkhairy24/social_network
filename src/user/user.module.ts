import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { authResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/auth.guard';
import { UsersService } from './user.service';
import { Dataloader } from 'src/dataloader.service';
import { PostsModule } from 'src/posts/posts.module';
import { UserResolver } from './user.resolver';
import { FollowModule } from 'src/follow/follow.module';
import { LikeModule } from 'src/like/like.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports:[
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            global:true,
            secret:'jwtsecret',
            signOptions:{expiresIn:'90d'}
        }),
        forwardRef(()=>PostsModule),
        forwardRef(()=>FollowModule),
        forwardRef(()=> LikeModule),
        forwardRef(()=>CommentsModule)

    ],
    providers:[authResolver,UserResolver,JwtStrategy,UsersService,Dataloader],
    exports:[JwtStrategy,JwtModule,UsersService]
})
export class UserModule {}

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from './like.entity';
import { UserModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/posts.module';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { Dataloader } from 'src/dataloader.service';
import { FollowModule } from 'src/follow/follow.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Like]),
        forwardRef(()=>UserModule),
        forwardRef(()=>PostsModule),
        forwardRef(()=>FollowModule),
        forwardRef(()=>CommentsModule)
    ],
    providers:[LikeService,LikeResolver,Dataloader],
    exports:[LikeService]
})
export class LikeModule {}

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { Dataloader } from 'src/dataloader.service';
import { UserModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/posts.module';
import { LikeModule } from 'src/like/like.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Follow]),
        forwardRef(()=>UserModule),
        forwardRef(()=>PostsModule),
        forwardRef(()=>LikeModule),
        forwardRef(()=>CommentsModule)
    ],
    providers:[FollowResolver,FollowService,Dataloader],
    exports:[FollowService]
})
export class FollowModule {}

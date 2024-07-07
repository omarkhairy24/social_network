import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comments } from './comments.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comments.service';
import { UserModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/posts.module';
import { Dataloader } from 'src/dataloader.service';
import { FollowModule } from 'src/follow/follow.module';
import { LikeModule } from 'src/like/like.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Comments]),
        forwardRef(()=>UserModule),
        forwardRef(()=>PostsModule),
        forwardRef(()=>FollowModule),
        forwardRef(()=>LikeModule)

    ],
    providers:[CommentResolver,CommentService,Dataloader],
    exports:[CommentService]
})
export class CommentsModule {}

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Posts } from './post.entity';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './post.resolver';
import { PostsService } from './post.service';
import { Dataloader } from 'src/dataloader.service';
import { FollowModule } from 'src/follow/follow.module';
import { LikeModule } from 'src/like/like.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
    imports:[
        SequelizeModule.forFeature([Posts]),
        forwardRef(()=>UserModule),
        forwardRef(()=>FollowModule),
        forwardRef(()=>LikeModule),
        forwardRef(()=>CommentsModule)
    ],
    providers:[PostResolver,PostsService,Dataloader],
    exports:[PostsService]
})
export class PostsModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { graphqlUploadExpress } from 'graphql-upload-ts/dist/graphqlUploadExpress';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      path:'/graphql',
      autoSchemaFile:join(process.cwd(), 'src/schema.gql'),
      playground:true,
      context:({req,res}) => ({
        req,
        res
      })
    }),
    SequelizeModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return{
          dialect:config.get<string>('DB_TYPE') as Dialect,
          host: config.get<string>('host'),
          port: config.get<number>('port'),
          username:config.get<string>('username') ,
          password: config.get<string>('password'),
          autoLoadModels:true,
          storage:config.get<string>('DB_NAME'),
          database:config.get<string>('DB_NAME'),
          synchronize:false
        }
      }
    }),
    UserModule, 
    PostsModule, 
    FollowModule, LikeModule, CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
      .forRoutes('graphql');
  }
}
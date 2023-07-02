import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { Discussion, DiscussionSchema } from './discussions.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]), UsersModule],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
  exports:[DiscussionsService]
})
export class DiscussionsModule {}

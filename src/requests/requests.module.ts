import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request, RequestSchema } from './requests.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),UsersModule, ContactsModule],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}

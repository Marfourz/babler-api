import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './contacts.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports:[MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])]
})
export class ContactsModule {}

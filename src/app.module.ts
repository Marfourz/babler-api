import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { RequestsModule } from './requests/requests.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { ParticipantsModule } from './participants/participants.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost/blabber-db'),UsersModule, ContactsModule, MessagesModule, RequestsModule, DiscussionsModule, ParticipantsModule, AuthModule,
  ConfigModule.forRoot(),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60s' },
  }),
  
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../users/users.schema";

export type ContactDocument = HydratedDocument<Request>;

@Schema({
    timestamps: true
})
export class Contact{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
    user1: User

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'User'})
    user2:User

    @Prop()
    blockedUser1:Boolean

    @Prop()
    blockedUser2:Boolean
}


export const ContactSchema = SchemaFactory.createForClass(Contact)
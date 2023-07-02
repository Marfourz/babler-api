import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../users/users.schema";
import { Discussion } from "../discussions/discussions.schema";

export type MessageDocument = HydratedDocument<Message>;

@Schema({
    timestamps: true
})
export class Message{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
    sender: User

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'Discussion'})
    receiveDiscussion: Discussion

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'Message'})
    responseToMsg: Message

    @Prop()
    text: string

    @Prop(raw([
        {    
            user : Array<{
                type : mongoose.Schema.Types.ObjectId,
                ref: User
            }> ,
            emoji:String
        }
    ]
       
    ))
    reactions: Array<any>

    @Prop()
    file: string
}


export const MessageSchema = SchemaFactory.createForClass( Message)
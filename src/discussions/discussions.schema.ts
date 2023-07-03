import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { User } from "../users/users.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { DiscussionType } from "./discussions.types";

export type DiscussionDocument = HydratedDocument<Discussion>;
@Schema({
    timestamps: true
})
export class Discussion{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
    sender: User

    @Prop({enum : DiscussionType})
    tag: string

    @Prop()
    name: string

    @Prop()
    description: string

    @Prop(raw([
        {    
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref: User
            } ,
            isAdmin : {type: Boolean, default: false},
            hasNewNotif : {type: Boolean, default: false},
            isArchivedChat : {type: Boolean, default: false},
            addedAt: Date
        }
    ]
       
    ))
    participants : Record<string, any>

    @Prop(raw({
        sender: {
            type : mongoose.Schema.Types.ObjectId,
            ref: User
        },
        receiverDiscussion: {
            type : mongoose.Schema.Types.ObjectId,
            ref: User
        },
        text: String,
        file: String
    }))
    lastMessage : Record<string, any>



}


export const DiscussionSchema = SchemaFactory.createForClass(Discussion)
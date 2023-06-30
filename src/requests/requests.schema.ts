import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "../users/users.schema";

export type RequestDocument = HydratedDocument<Request>;

@Schema({
    timestamps : true
})
export class Request{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
    sender: User

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'User'})
    receiver:User

    @Prop({default: false})
    accepted: Boolean

}


export const RequestSchema = SchemaFactory.createForClass(Request)
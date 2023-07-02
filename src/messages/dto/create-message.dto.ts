import { IsNotEmpty } from "class-validator"


export class CreateMessageDto {

    @IsNotEmpty()
    discussionId : string

    @IsNotEmpty()
    text:string

    responseToMessageId:string

}
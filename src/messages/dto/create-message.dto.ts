import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"



export class CreateMessageDto {

    @ApiProperty()
    @IsNotEmpty()
    discussionId : string

    @ApiProperty()
    @IsNotEmpty()
    text:string

    @ApiProperty()
    responseToMessageId:string

}
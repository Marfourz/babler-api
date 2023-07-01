import { IsEnum, IsNotEmpty } from "class-validator"



export class CreateDiscussionDto {

    @IsNotEmpty()
    @IsEnum(["GROUP","PRIVATE"])
    tag : string

    name : string

    description : string

    participants : Array<string>

    userId : string

}

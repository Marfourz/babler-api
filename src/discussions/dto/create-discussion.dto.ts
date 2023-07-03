import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"



export class CreateDiscussionDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(["GROUP","PRIVATE"])
    tag : string

    @ApiProperty()
    name : string

    @ApiProperty()
    description : string

    @ApiProperty()
    participants : Array<string>

    @ApiProperty()
    userId : string

}

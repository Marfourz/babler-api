import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty} from 'class-validator'


export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    email:string

    @ApiProperty()
    @IsNotEmpty()
    username:string

    @ApiProperty()
    @IsNotEmpty()
    firstname:string

    @ApiProperty()
    @IsNotEmpty()
    lastname:string

    @ApiProperty()
    @IsNotEmpty()
    password:string
}

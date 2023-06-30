import { IsNotEmpty } from "class-validator";



export class CreateRequestDto {
    @IsNotEmpty()
    receiverId : string
}

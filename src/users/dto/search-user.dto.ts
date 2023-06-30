import { IsNotEmpty} from 'class-validator'


export class SearchUserDto {

    search : string
    limit : number

    skip : number
}

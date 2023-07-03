import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscussionDto } from './create-discussion.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DiscussionAction } from '../discussions.types';

export class UpdateDiscussionDto extends PartialType(CreateDiscussionDto) {
    @IsNotEmpty()
    @IsEnum(["UNARCHIVED","ARCHIVED","DEFINE_ADMINS_GROUP","ADD_USERS_GROUP","LEAVE_GROUP"])
    action: DiscussionAction

    isArchived: boolean
    adminUsers: Array<string>
    addUsers: Array<string>
}

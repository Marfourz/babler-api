import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { DiscussionType } from './discussions.types';
import { Discussion, DiscussionDocument } from './discussions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    private userService: UsersService,
  ) {}

  async create(createDiscussionDto: CreateDiscussionDto, userId: string) {
    if (createDiscussionDto.tag == DiscussionType.PRIVATE) {
      if (createDiscussionDto.userId == userId)
        throw new BadRequestException('You can chat with yourself');

      const oldDiscussion = await this.discussionModel.findOne({
        tag: DiscussionType.PRIVATE,
        $and: [
          {
            'participants.user': createDiscussionDto.userId,
          },
          {
            'participants.user': userId,
          },
        ],
      });

      if (oldDiscussion)
        throw new BadRequestException('This discussion already exist');
      if (userId == createDiscussionDto.userId)
        throw new BadRequestException('You can chat with yourself');

      const discussion = this.discussionModel.create({
        tag: DiscussionType.PRIVATE,
        participants: [
          {
            user: userId,
            isAdmin: true,
            addedAt: Date.now(),
          },
          {
            user: createDiscussionDto.userId,
            isAdmin: true,
            addedAt: Date.now(),
          },
        ],
      });

      return discussion;
    } else if (createDiscussionDto.tag == DiscussionType.GROUP) {
      if (createDiscussionDto.participants.length < 2)
        throw new BadRequestException(
          'Discussion group must have at least 2 participants',
        );

      for (let i = 0; i < createDiscussionDto.participants.length; ++i) {
        let participant = await this.userService.findOne(
          createDiscussionDto.participants[i],
        );
        if (!participant) throw new NotFoundException('User not found');
      }

      const participants = await createDiscussionDto.participants.map(
        (participant) => {
          return {
            user: participant,
            isAdmin: participant == userId,
            hasNewNotif: true,
            addedAt: Date.now(),
          };
        },
      );

      const discussion = this.discussionModel.create({
        tag: DiscussionType.GROUP,
        participants: participants,
        description: createDiscussionDto.description,
        name: createDiscussionDto.name,
      });

      return discussion;
    }
  }

  findAll() {
    return `This action returns all discussions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussion`;
  }

  update(id: number, updateDiscussionDto: UpdateDiscussionDto) {
    return `This action updates a #${id} discussion`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussion`;
  }
}

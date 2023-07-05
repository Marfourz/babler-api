import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { DiscussionAction, DiscussionType } from './discussions.types';
import { Discussion, DiscussionDocument } from './discussions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { FindDiscussionDto } from './dto/find-discussion.dto';

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


      let actualUserInList = false  

      for (let i = 0; i < createDiscussionDto.participants.length; ++i) {
        if(createDiscussionDto.participants[i] == userId)
          actualUserInList = true
        let participant = await this.userService.findOne(
          createDiscussionDto.participants[i],
        );
        if (!participant) throw new NotFoundException('User not found');
      }

      if(!actualUserInList)
        throw new UnauthorizedException("You must in users list")

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

  findAll(params : FindDiscussionDto, userId : string) {

    const filters = {}

    if(params.tag)
      filters['tag'] = params.tag

    return this.discussionModel.find({...filters, 'participants.user': userId})
  }

  findOne(id: string) {
    return this.discussionModel.findById(id).populate('user1').populate('user2')
  }

  async userIsAdminInDiscussion(disccussion : DiscussionDocument, userId){
    console.log("discussion", disccussion)
    const participant = disccussion.participants.find((value)=>value.user == userId)
    return participant.isAdmin
  }

  async update(id: string, updateDiscussionDto: UpdateDiscussionDto,userId:string) {
    const disccussion = await this.discussionModel.findById(id)
    
   
    if([ DiscussionAction.ARCHIVED, DiscussionAction.UNARCHIVED].includes(updateDiscussionDto.action)){
      const participantIndex = disccussion.participants.findIndex((value)=>value.user == userId)
      disccussion.participants[participantIndex].isArchivedChat = updateDiscussionDto.isArchived
      return disccussion.save()
    } 

    else if(updateDiscussionDto.action == DiscussionAction.DEFINE_ADMINS_GROUP){
      
      if(!this.userIsAdminInDiscussion(disccussion,userId))
        throw new UnauthorizedException("You not admin in group")
      
      for(let i= 0; i<disccussion.participants.length ; ++i){
        let participant = disccussion.participants[i].user
       
        if(updateDiscussionDto.adminUsers.find((value)=>value == participant))
          disccussion.participants[i].isAdmin = true
      }
      return disccussion.save()
    }

    else if(updateDiscussionDto.action == DiscussionAction.ADD_USERS_GROUP){
      if(!this.userIsAdminInDiscussion(disccussion,userId))
        throw new UnauthorizedException("You not admin in group")

      updateDiscussionDto.addUsers.map((value)=>{
        const participant = disccussion.participants.find((part)=>part.user == value) 
        if(!participant){
          disccussion.participants.push({
            user : value ,
            isAdmin : false,
            hasNewNotif : true,
            isArchivedChat : false,
          })
        }
      })

      return disccussion.save()
      
    }

    else if(updateDiscussionDto.action == DiscussionAction.LEAVE_GROUP){
      const participantIndex = disccussion.participants.findIndex((value)=>value.user == userId)
     
      if(participantIndex == -1)
        throw new BadRequestException('You not in this discussion')
      
      disccussion.participants = disccussion.participants.filter((value)=>{
        return value.user != userId
      })
    
      return disccussion.save()
    }

    else
      return await this.discussionModel.findByIdAndUpdate({_id:id}, updateDiscussionDto,{new: true})
    
  }

  async remove(id: string, userId : string) {
      const discussion = await this.discussionModel.findById(id)
      if(!discussion)
        throw new NotFoundException('Discussion not found')
      const user  = discussion.participants.find((value)=>value.user == userId)
      if(!user)
        throw new BadRequestException('You can not delete this discussion')
      return this.discussionModel.deleteOne({_id: id})
  }
}

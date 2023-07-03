import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './messages.schema';
import { Model } from 'mongoose';
import { DiscussionsService } from '../discussions/discussions.service';

@Injectable()
export class MessagesService {

  constructor(@InjectModel(Message.name) private messageModel : Model<Message>, private discussionService : DiscussionsService){}

  async create(createMessageDto: CreateMessageDto, userId : string) {
    let discussion
    try{
       discussion = await this.discussionService.findOne(createMessageDto.discussionId).populate('participants.user')
    }
    catch(error){
      console.log(error)
      throw new BadRequestException('Discussion not exist')
    }

    console.log(discussion.participants[0].user)
    
    const userInDiscussion = discussion.participants.find((participant)=>{
      return participant.user == userId
    })

    if(!userInDiscussion)
      throw new UnauthorizedException('You dont have permission to send message in this discussion')

    if(createMessageDto.responseToMessageId){
      const oldMessage = await this.messageModel.findById(createMessageDto.responseToMessageId)
      if(!oldMessage)
        throw new BadRequestException('Old message not exist')
    }
      
    return this.messageModel.create({
      receiveDiscussion : createMessageDto.discussionId,
        sender: userId,
        text: createMessageDto.text,
        responseToMsg : createMessageDto.responseToMessageId
    }) 
  }

  findAll(disccussionId: string) {
    return this.messageModel.find({
      receiveDiscussion : disccussionId
    })
  }

  async saveFileInMessage(fileUrl : string, messageId){
    const message = await this.messageModel.findById(messageId)

    if(!messageId)
      throw new NotFoundException
    
    message.file = fileUrl

    return message.save()
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

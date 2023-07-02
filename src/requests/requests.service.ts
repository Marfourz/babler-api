import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestDocument } from './requests.schema';
import { User, UserDocument } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { FindRequestDto } from './dto/find-request.dto';
import { Contact, ContactDocument } from '../contacts/contacts.schema';
import { Request } from './requests.schema';

@Injectable()
export class RequestsService {

  constructor(@InjectModel(Request.name) private requestModel: Model<RequestDocument>,
              @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
              private userService : UsersService){

  }

  async create(createRequestDto: CreateRequestDto, sender: UserDocument) {

    const receiver = await this.userService.findOne(createRequestDto.receiverId)

    if(sender.id == receiver.id)
      throw new BadRequestException("You can not send request to yourself");
    
    const request = await this.requestModel.findOne({
      $or:[{
        receiver : receiver.id,
        sender : sender.id
      }, {
        receiver: sender.id,
        sender: receiver.id
      }
      ]
    })
  
    if(request){
      if(request.sender == sender.id)
        throw new BadRequestException("You have already send request to this receiver")
      else
        throw new BadRequestException("This receiver is already send to you a request")
    }

    return this.requestModel.create({
      receiver : receiver.id,
      sender: sender.id
    })  
    
  } 

  async findAll(filters?: FindRequestDto) {

    const requestParams = {}
    if(filters.receiverId)
      requestParams["receiver"] = filters.receiverId
    if(filters.senderId)
      requestParams["sender"] = filters.senderId
    try{
      return await this.requestModel.find(requestParams)
    }
    catch(error){
      throw new BadRequestException("Invalid params")
    }

   
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto,userId : any) {
    try{
      
      const request = await this.requestModel.findById(id)

      
      if(request.sender != userId && request.receiver != userId)
        throw new UnauthorizedException("Impossible to make this action")

      if(updateRequestDto.accepted){
        
        if(request.receiver != userId){
          console.log('show request', request,request.receiver,userId,request.receiver != userId )
          throw new UnauthorizedException("Impossible to make this action")
        }
          
        const contact = this.contactModel.create({
          user1 : userId,
          user2 : request.sender
        })
      }

      return this.requestModel.findOneAndUpdate({_id:id},updateRequestDto,{lean:true,new:true})

    }
    catch(error){
      throw error
    }

    
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}

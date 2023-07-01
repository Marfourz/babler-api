import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './contacts.schema';
import { RequestDocument } from '../requests/requests.schema';
import { Model } from 'mongoose';

@Injectable()
export class ContactsService {


  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument> ){
    
  }

  create(createContactDto: CreateContactDto) {
   
  }

  findAll() {
    return this.contactModel.find()
  }

  findByUser(userId : string){
    return this.contactModel.find({
      $or:[
        {
          user1: userId
        },
        {
          user2: userId
        }
      ]
    }).populate('user1').populate('user2')
  }

  async findOne(id: string) {
  
      console.log("ontact", id)
      const contact =  await this.contactModel.findById(id).populate('user1').populate('user2')

      if(!contact)
        throw new NotFoundException
      return contact
    
    
  }

  async update(id: string, updateContactDto: UpdateContactDto,userId:string) {
    const contact = await this.contactModel.findById(id) as any
    if(contact.user1 != userId && contact.user2 != userId)
        throw new UnauthorizedException()
    return this.contactModel.findOneAndUpdate({_id:id},updateContactDto,{new:true, lean:true})
  }

  async remove(id: string,userId:string) {
    const contact = await this.contactModel.findById(id) as any
    if(!contact)
      throw new NotFoundException
    else{
      if(contact.user1 != userId && contact.user2 != userId)
        throw new UnauthorizedException()
      return this.contactModel.deleteOne({_id:id})
    }
   
    
  }
}

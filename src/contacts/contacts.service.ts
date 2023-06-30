import { Injectable, NotFoundException } from '@nestjs/common';
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
    try{
       await this.contactModel.findById(id)
    }
    catch(error){
      throw new NotFoundException
    }
    
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  async remove(id: string,userId:string) {
    const contact = await this.contactModel.findById(id)
    console.log("ee", contact);
    
    // if(contact.user1 != contact.user2 )

    // return this.contactModel.deleteOne({_id:id})
  }
}

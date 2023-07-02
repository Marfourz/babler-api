import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // findAll(@Req() req) {
    
  // }

  @Get()
  @UseGuards(AuthGuard)
  findByUser(@Req() req : any){
    return this.contactsService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.contactsService.findOne(id);
   
    
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto,@Req() req : any) {
    return this.contactsService.update(id, updateContactDto,req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string,@Req() req : any ) {
    return this.contactsService.remove(id, req.user.id);
  }
}

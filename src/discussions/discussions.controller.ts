import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, Query } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindDiscussionDto } from './dto/find-discussion.dto';

@Controller('discussions')
@UseGuards(AuthGuard)
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDiscussionDto: CreateDiscussionDto, @Req() req : any) {
    
    return this.discussionsService.create(createDiscussionDto, req.user.id);
    
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() params : FindDiscussionDto, @Req() req) {
    
    return this.discussionsService.findAll(params, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const discussion = await this.discussionsService.findOne(id);
    if(!discussion)
      throw new NotFoundException
    return discussion
  }

  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscussionDto: UpdateDiscussionDto,@Req() req : any) {
    return this.discussionsService.update(id, updateDiscussionDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.discussionsService.remove(id,req.user.id);
  }
}

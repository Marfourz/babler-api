import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FindRequestDto } from './dto/find-request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req,@Body() createRequestDto: CreateRequestDto) {
    const user = req.user
    return this.requestsService.create(createRequestDto,user);
  }

  @Get()
  findAll(@Query() params : FindRequestDto) {
    return this.requestsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }


  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto, @Req() req : any) {
    return this.requestsService.update(id, updateRequestDto,req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}

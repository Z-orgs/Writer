import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubCommentService } from './sub.comment.service';
import { CreateSubCommentDto } from './dto/create-sub.comment.dto';
import { UpdateSubCommentDto } from './dto/update-sub.comment.dto';

@Controller('sub.comment')
export class SubCommentController {
  constructor(private readonly subCommentService: SubCommentService) {}

  @Post()
  create(@Body() createSubCommentDto: CreateSubCommentDto) {
    return this.subCommentService.create(createSubCommentDto);
  }

  @Get()
  findAll() {
    return this.subCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubCommentDto: UpdateSubCommentDto) {
    return this.subCommentService.update(+id, updateSubCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCommentService.remove(+id);
  }
}

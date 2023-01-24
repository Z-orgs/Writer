import { Injectable } from '@nestjs/common';
import { CreateSubCommentDto } from './dto/create-sub.comment.dto';
import { UpdateSubCommentDto } from './dto/update-sub.comment.dto';

@Injectable()
export class SubCommentService {
  create(createSubCommentDto: CreateSubCommentDto) {
    return 'This action adds a new subComment';
  }

  findAll() {
    return `This action returns all subComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subComment`;
  }

  update(id: number, updateSubCommentDto: UpdateSubCommentDto) {
    return `This action updates a #${id} subComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} subComment`;
  }
}

import { Controller, Get } from '@nestjs/common';
import { TagsService } from '../services/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  getAllTags() {
    return this.tagsService.findAllTags();
  }
}

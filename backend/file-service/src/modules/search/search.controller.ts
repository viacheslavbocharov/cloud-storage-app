import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Req() req,
    @Query('query') query: string,
    @Query('isDeleted') isDeleted: string,
  ) {
    const ownerId = req.user?.sub;

    if (!query || query.length < 3) {
      throw new BadRequestException('Search query must be at least 3 characters long');
    }

    return this.searchService.search(ownerId, query, isDeleted === 'true');
  }
}

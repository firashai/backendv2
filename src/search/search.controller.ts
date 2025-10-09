import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { GlobalSearchDto } from './dto/global-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  globalSearch(@Query() searchDto: any) {
    // Handle both 'q' and 'query' parameters for backward compatibility
    const query = searchDto.query || searchDto.q;
    const filters = searchDto.filters || searchDto.type;
    const limit = searchDto.limit || 20;
    const offset = searchDto.offset || 0;

    console.log('Search request:', { query, filters, limit, offset });

    return this.searchService.globalSearch({ query, filters, limit, offset });
  }

  @Get('journalists')
  searchJournalists(@Query() query: any) {
    const searchQuery = query.query || query.q;
    const { limit = 20, offset = 0 } = query;
    return this.searchService.searchJournalists(searchQuery, limit, offset);
  }

  @Get('companies')
  searchCompanies(@Query() query: any) {
    const searchQuery = query.query || query.q;
    const { limit = 20, offset = 0 } = query;
    return this.searchService.searchCompanies(searchQuery, limit, offset);
  }

  @Get('jobs')
  searchJobs(@Query() query: any) {
    const searchQuery = query.query || query.q;
    const { limit = 20, offset = 0 } = query;
    return this.searchService.searchJobs(searchQuery, limit, offset);
  }

  @Get('media')
  searchMedia(@Query() query: any) {
    const searchQuery = query.query || query.q;
    const { limit = 20, offset = 0 } = query;
    return this.searchService.searchMedia(searchQuery, limit, offset);
  }
}

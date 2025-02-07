import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics') // Grouping in Swagger UI
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':urlId')
  @ApiOperation({ summary: 'Get analytics for a specific URL' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiParam({ name: 'urlId', required: true, example: 'abc123', description: 'Shortened URL ID' })
  async getAnalytics(@Param('urlId') urlId: string) {
    return this.analyticsService.getAnalytics(urlId);
  }
}

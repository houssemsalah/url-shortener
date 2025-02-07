import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UrlService } from './url.service';

@ApiTags('URL Shortener')  // Grouping for Swagger
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({ status: 201, description: 'URL successfully shortened' })
  @ApiResponse({ status: 400, description: 'Invalid URL format' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string', example: 'https://example.com' } } } })
  async shortenUrl(@Body('url') url: string) {
    const shortUrl = await this.urlService.createShortUrl(url);
    return { shortUrl };
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to original URL' })
  @ApiResponse({ status: 404, description: 'Short ID not found' })
  @ApiParam({ name: 'shortId', required: true, example: 'abc123', description: 'Shortened URL ID' })
  async redirectToUrl(
    @Param('shortId') shortId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.urlService.redirectToOriginalUrl(shortId, req, res);
  }

  @Get('analytics/:shortId')
  @ApiOperation({ summary: 'Get analytics for a shortened URL' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Short ID not found' })
  @ApiParam({ name: 'shortId', required: true, example: 'abc123', description: 'Shortened URL ID' })
  async getUrlAnalytics(@Param('shortId') shortId: string) {
    return this.urlService.getUrlAnalytics(shortId);
  }

  @Get('url/histories')
  @ApiOperation({ summary: 'Get all shortened URLs history' })
  @ApiResponse({ status: 200, description: 'List of all shortened URLs' })
  async getAllUrlHistories() {
    return this.urlService.getAllUrlHistories();
  }
}

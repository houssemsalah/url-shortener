import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Url, UrlDocument } from './schemas/url.schema';

import { v4 as uuidv4 } from 'uuid';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async createShortUrl(originalUrl: string): Promise<string> {
    try {
      const shortId = uuidv4();
      const baseUrl = this.configService.get<string>('BASE_URL');
      
      const url = new this.urlModel({
        originalUrl,
        shortId,
        clicks: 0,
      });
      
      await url.save();
      return `${baseUrl}/${shortId}`;
    } catch (error) {
      console.error(`Error creating short URL: ${(error as Error).message}`, error);
      throw new InternalServerErrorException('Failed to create a short URL');
    }
  }

  async redirectToOriginalUrl(shortId: string, req: Request, res: Response): Promise<void> {
    try {
      const url = await this.urlModel.findOne({ shortId }).exec();
      if (!url) {
        throw new NotFoundException(`No URL found for short ID: ${shortId}`);
      }

      // Track analytics before redirecting
      await this.analyticsService.trackVisit(shortId, req);
      await this.incrementClicks(shortId);

      res.redirect(url.originalUrl);
    } catch (error) {
      console.error(`Error redirecting URL: ${(error as Error).message}`, error);
      throw new InternalServerErrorException('Failed to redirect');
    }
  }

  async getUrlAnalytics(shortId: string) {
    try {
      const url = await this.urlModel.findOne({ shortId }).exec();
      if (!url) {
        throw new NotFoundException(`No URL found for short ID: ${shortId}`);
      }

      const analytics = await this.analyticsService.getAnalytics(shortId);
      console.log(analytics)
      return {
        originalUrl: url.originalUrl,
        shortUrl: `${this.configService.get<string>('BASE_URL')}/${url.shortId}`,
        totalClicks: url.clicks,
        ...analytics
      };
    } catch (error) {
      console.error(`Error fetching analytics: ${(error as Error).message}`, error);
      throw new InternalServerErrorException('Failed to fetch analytics');
    }
  }

  private async incrementClicks(shortId: string): Promise<void> {
    try {
      const result = await this.urlModel.updateOne(
        { shortId },
        {
          $inc: { clicks: 1 },
          $set: { lastAccessed: new Date() }
        }
      ).exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException(`No URL found for short ID: ${shortId}`);
      }
    } catch (error) {
      console.error(`Error incrementing clicks: ${(error as Error).message}`, error);
      throw new InternalServerErrorException('Failed to update click count');
    }
  }

  async getAllUrlHistories(): Promise<UrlDocument[]> {
    try {
      const urls = await this.urlModel.find().exec();
      if (!urls) {
        throw new NotFoundException('No URL histories found');
      }
      return urls;
    } catch (error) {
      console.error(`Error fetching URL histories: ${(error as Error).message}`, error);
      throw new InternalServerErrorException('Failed to fetch URL histories');
    }
  }
}
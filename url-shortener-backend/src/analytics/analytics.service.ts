import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Analytics, AnalyticsDocument } from './schemas/analytics.schema';
import * as geoip from 'geoip-lite';
import * as useragent from 'express-useragent';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private readonly analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async trackVisit(urlId: string, req: Request): Promise<void> {
    const ip = req.ip;
    const geo = geoip.lookup(ip) || { country: 'Unknown', city: 'Unknown' };
    if (!geo) {
      geo.country = 'Unknown';
      geo.city = 'Unknown';
    }
    const ua = useragent.parse(req.headers['user-agent']);

    const analytics = new this.analyticsModel({
      urlId,
      ipAddress: ip,
      country: geo?.country,
      city: geo?.city,
      deviceType: ua.isMobile ? 'mobile' : ua.isTablet ? 'tablet' : 'desktop',
      browser: ua.browser,
      operatingSystem: ua.os,
      referrer: req.headers.referer || 'direct',
      timestamp: new Date()
    });

    await analytics.save();
  }

  async getAnalytics(urlId: string): Promise<{
    totalVisits: number;
    locations: Record<string, number>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
    referrers: Record<string, number>;
    timeStats: Record<number, number>;
  }> {
    const analytics = await this.analyticsModel.find({ urlId }).exec();
    
    return {
      totalVisits: analytics.length,
      locations: this.aggregateLocationStats(analytics),
      devices: this.aggregateDeviceStats(analytics),
      browsers: this.aggregateBrowserStats(analytics),
      referrers: this.aggregateReferrerStats(analytics),
      timeStats: this.aggregateTimeStats(analytics)
    };
  }

  private aggregateLocationStats(analytics: AnalyticsDocument[]): Record<string, number> {
    return analytics.reduce((acc: Record<string, number>, curr) => {
      const key = `${curr.country || 'Unknown'}:${curr.city || 'Unknown'}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  private aggregateDeviceStats(analytics: AnalyticsDocument[]): Record<string, number> {
    return analytics.reduce((acc: Record<string, number>, curr) => {
      acc[curr.deviceType] = (acc[curr.deviceType] || 0) + 1;
      return acc;
    }, {});
  }

  private aggregateBrowserStats(analytics: AnalyticsDocument[]): Record<string, number> {
    return analytics.reduce((acc: Record<string, number>, curr) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1;
      return acc;
    }, {});
  }

  private aggregateReferrerStats(analytics: AnalyticsDocument[]): Record<string, number> {
    return analytics.reduce((acc: Record<string, number>, curr) => {
      acc[curr.referrer] = (acc[curr.referrer] || 0) + 1;
      return acc;
    }, {});
  }

  private aggregateTimeStats(analytics: AnalyticsDocument[]): Record<number, number> {
    return analytics.reduce((acc: Record<number, number>, curr) => {
      const hour = new Date(curr.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
  }
}
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Url } from './schemas/url.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AnalyticsService } from '../analytics/analytics.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Response } from 'express';

jest.mock('../analytics/analytics.service');
jest.mock('@nestjs/config');
jest.mock('@nestjs/mongoose');

describe('UrlService', () => {
  let service: UrlService;
  let urlModel: Model<Url>;
  let configService: ConfigService;
  let analyticsService: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost'),
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            trackVisit: jest.fn(),
            getAnalytics: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlModel = module.get<Model<Url>>(getModelToken(Url.name));
    configService = module.get<ConfigService>(ConfigService);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should create a short URL successfully', async () => {
      const originalUrl = 'http://example.com';
      const shortUrl = 'http://localhost/short-id';
      const mockUrl = { create: jest.fn().mockResolvedValue(true) };
      urlModel.create = mockUrl.create;
      const result = await service.createShortUrl(originalUrl);
      expect(result).toBe(shortUrl);
      expect(urlModel.create).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const originalUrl = 'http://example.com';
      urlModel.create = jest.fn().mockRejectedValue(new Error('Create failed'));
      await expect(service.createShortUrl(originalUrl)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortId = 'short-id';
      const mockUrl = { originalUrl: 'http://original-url.com' };
      urlModel.findOne = jest.fn().mockResolvedValue(mockUrl);
      analyticsService.trackVisit = jest.fn().mockResolvedValue(true);
      const res = { 
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(),
        links: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
        jsonp: jest.fn().mockReturnThis(),
        sendFile: jest.fn().mockReturnThis(),
        download: jest.fn().mockReturnThis(),
        contentType: jest.fn().mockReturnThis(),
        attachment: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        format: jest.fn().mockReturnThis(),
        vary: jest.fn().mockReturnThis(),
        append: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
        location: jest.fn().mockReturnThis(),
        locals: {},
      } as unknown as Response;
      await service.redirectToOriginalUrl(shortId, {} as any, res);
      expect(res.redirect).toHaveBeenCalledWith(mockUrl.originalUrl);
    });

    it('should throw NotFoundException if short URL is not found', async () => {
      const shortId = 'nonexistent-id';
      urlModel.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.redirectToOriginalUrl(shortId, {} as any, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const shortId = 'short-id';
      urlModel.findOne = jest.fn().mockRejectedValue(new Error('Find failed'));
      await expect(service.redirectToOriginalUrl(shortId, {} as any, {} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return URL analytics', async () => {
      const shortId = 'short-id';
      const mockUrl = { originalUrl: 'http://original-url.com', shortId: shortId, clicks: 10 };
      urlModel.findOne = jest.fn().mockResolvedValue(mockUrl);
      analyticsService.getAnalytics = jest.fn().mockResolvedValue({ visits: 100 });
      const result = await service.getUrlAnalytics(shortId);
      expect(result).toEqual({
        originalUrl: 'http://original-url.com',
        shortUrl: 'http://localhost/short-id',
        totalClicks: 10,
        visits: 100,
      });
    });

    it('should throw NotFoundException if URL is not found', async () => {
      const shortId = 'nonexistent-id';
      urlModel.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.getUrlAnalytics(shortId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if analytics fetching fails', async () => {
      const shortId = 'short-id';
      urlModel.findOne = jest.fn().mockResolvedValue({ originalUrl: 'http://example.com' });
      analyticsService.getAnalytics = jest.fn().mockRejectedValue(new Error('Fetch failed'));
      await expect(service.getUrlAnalytics(shortId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getAllUrlHistories', () => {
    it('should return all URL histories', async () => {
      const mockUrls = [{ originalUrl: 'http://example.com', shortId: 'short-id', clicks: 5 }];
      urlModel.find = jest.fn().mockResolvedValue(mockUrls);
      const result = await service.getAllUrlHistories();
      expect(result).toEqual(mockUrls);
    });

    it('should throw InternalServerErrorException if no URLs are found', async () => {
      urlModel.find = jest.fn().mockResolvedValue([]);
      await expect(service.getAllUrlHistories()).rejects.toThrow(InternalServerErrorException);
    });
  });
});

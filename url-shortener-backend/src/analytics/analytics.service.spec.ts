import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getModelToken } from '@nestjs/mongoose';
import { Analytics } from './schemas/analytics.schema';
import * as geoip from 'geoip-lite';
import * as useragent from 'express-useragent';
import { Request } from 'express';

// Mock dependencies
jest.mock('geoip-lite');
jest.mock('express-useragent');

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let model;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken(Analytics.name),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    model = module.get(getModelToken(Analytics.name));
  });

  describe('trackVisit', () => {
    it('should save analytics data for a visit', async () => {
      const mockRequest = {
        headers: {
          'user-agent': 'Mozilla/5.0',
          referer: 'https://example.com',
        },
        get: jest.fn().mockReturnValue(''),
        header: jest.fn().mockReturnValue(''),
        accepts: jest.fn().mockReturnValue(''),
        acceptsCharsets: jest.fn().mockReturnValue(''),
        acceptsEncodings: jest.fn().mockReturnValue(''),
        acceptsLanguages: jest.fn().mockReturnValue(''),
        range: jest.fn().mockReturnValue(''),
        param: jest.fn().mockReturnValue(''),
        is: jest.fn().mockReturnValue(''),
        protocol: 'http',
        secure: false,
        ip: '192.168.0.1',
        ips: ['192.168.0.1'],
        subdomains: [],
        path: '',
        hostname: '',
        host: '',
        fresh: false,
        stale: true,
        xhr: false,
        body: {},
        cookies: {},
        method: 'GET',
        params: {},
        query: {},
        route: {},
        signedCookies: {},
        originalUrl: '',
        url: '',
        baseUrl: '',
        app: {},
      } as unknown as Request;

      geoip.lookup.mockReturnValue({ country: 'US', city: 'New York' });
      useragent.parse.mockReturnValue({ isMobile: false, isTablet: false, browser: 'Chrome', os: 'Windows' });

      const saveSpy = jest.spyOn(model, 'save').mockResolvedValue(undefined);

      await service.trackVisit('abc123', mockRequest);

      expect(saveSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
        urlId: 'abc123',
        ipAddress: '192.168.0.1',
        country: 'US',
        city: 'New York',
        deviceType: 'desktop',
        browser: 'Chrome',
        operatingSystem: 'Windows',
        referrer: 'https://example.com',
      }));
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics data aggregated by location, device, browser, and referrer', async () => {
      const mockAnalyticsData = [
        { country: 'US', city: 'New York', deviceType: 'desktop', browser: 'Chrome', referrer: 'https://example.com', createdAt: new Date() },
        { country: 'US', city: 'New York', deviceType: 'desktop', browser: 'Firefox', referrer: 'https://google.com', createdAt: new Date() },
      ];

      jest.spyOn(model, 'find').mockResolvedValue(mockAnalyticsData as any);

      const result = await service.getAnalytics('abc123');

      expect(result.totalVisits).toBe(2);
      expect(result.locations['US:New York']).toBe(2);
      expect(result.devices.desktop).toBe(2);
      expect(result.browsers.Chrome).toBe(1);
      expect(result.referrers['https://example.com']).toBe(1);
      expect(result.timeStats).toBeDefined();
    });
  });
});

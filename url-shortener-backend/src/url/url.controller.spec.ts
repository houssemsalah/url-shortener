import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlDocument } from './schemas/url.schema';

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            createShortUrl: jest.fn(),
            redirectToOriginalUrl: jest.fn(),
            getUrlAnalytics: jest.fn(),
            getAllUrlHistories: jest.fn(),
          },
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(urlController).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should return a shortened URL', async () => {
      const url = 'https://example.com';
      const shortUrl = 'https://short.ly/abc123';
      jest.spyOn(urlService, 'createShortUrl').mockResolvedValue(shortUrl);

      const result = await urlController.shortenUrl(url);
      expect(result).toEqual({ shortUrl });
      expect(urlService.createShortUrl).toHaveBeenCalledWith(url);
    });
  });

  describe('redirectToUrl', () => {
    it('should call the redirectToOriginalUrl method', async () => {
      const shortId = 'abc123';
      const req: any = {};
      const res: any = { redirect: jest.fn() };

      await urlController.redirectToUrl(shortId, req, res);

      expect(urlService.redirectToOriginalUrl).toHaveBeenCalledWith(shortId, req, res);
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return analytics for a shortened URL', async () => {
      const shortId = 'abc123';
    const analyticsData = {
      totalVisits: 10,
      locations: {
        'United States': 5,
        'Canada': 3,
        'Germany': 2,
      },
      devices: {
        desktop: 6,
        mobile: 4,
      },
      browsers: {
        Chrome: 7,
        Firefox: 2,
        Safari: 1,
      },
      referrers: {
        'https://google.com': 4,
        'https://facebook.com': 3,
        'https://twitter.com': 3,
      },
      timeStats: {
        '2023-01-01': 2,
        '2023-01-02': 3,
        '2023-01-03': 5,
      },
      originalUrl: 'https://example.com',
      shortUrl: 'https://short.ly/abc123',
      totalClicks: 10,
    };
      jest.spyOn(urlService, 'getUrlAnalytics').mockResolvedValue(analyticsData);

      const result = await urlController.getUrlAnalytics(shortId);
      expect(result).toEqual(analyticsData);
      expect(urlService.getUrlAnalytics).toHaveBeenCalledWith(shortId);
    });
  });

  describe('getAllUrlHistories', () => {
    it('should return all URL histories', async () => {
      const histories = [
        { _id: '1', originalUrl: 'https://example.com', shortId: 'abc123', clicks: 0 } as UrlDocument,
      ];
      jest.spyOn(urlService, 'getAllUrlHistories').mockResolvedValue(histories);

      const result = await urlController.getAllUrlHistories();
      expect(result).toEqual(histories);
      expect(urlService.getAllUrlHistories).toHaveBeenCalled();
    });
  });
});

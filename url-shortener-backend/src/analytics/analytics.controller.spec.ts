import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Mock the AnalyticsService
const mockAnalyticsService = {
  getAnalytics: jest.fn(),
};

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getAnalytics', () => {
    it('should return analytics for a specific URL', async () => {
      const mockAnalyticsResponse = {
        totalVisits: 10,
        locations: { 'Unknown:Unknown': 10 },
        devices: { desktop: 10 },
        browsers: { Chrome: 10 },
        referrers: { direct: 10 },
        timeStats: { 12: 10 },
      };

      mockAnalyticsService.getAnalytics.mockResolvedValue(mockAnalyticsResponse);

      const result = await controller.getAnalytics('abc123');

      expect(result).toEqual(mockAnalyticsResponse);
      expect(service.getAnalytics).toHaveBeenCalledWith('abc123');
    });

    it('should return 404 if URL not found', async () => {
      mockAnalyticsService.getAnalytics.mockResolvedValue(null);

      try {
        await controller.getAnalytics('nonexistent-url');
      } catch (e) {
        expect(e.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(e.response.message).toBe('URL not found');
      }
    });
  });
});

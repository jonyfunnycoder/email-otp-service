import { Test } from '@nestjs/testing';
import { IUserStore, StoreService } from './store.service';

describe('StoreService', () => {
  let storeService: StoreService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [StoreService],
    }).compile();

    storeService = moduleRef.get<StoreService>(StoreService);
  });

  describe('setData', () => {
    const otpData: IUserStore = {
      email: 'testing@@dso.org.sg',
      otp: 123456,
      sentTime: new Date(),
      limit: 0,
    };

    it('should store data in local store and with email as key', async () => {
      const mockData = {
        [otpData.email]: otpData,
      };

      expect(storeService.setData(mockData)).toStrictEqual(mockData);
    });
  });

  describe('getData', () => {
    const otpData: IUserStore = {
      email: 'testing@@dso.org.sg',
      otp: 123456,
      sentTime: new Date(),
      limit: 0,
    };

    it('should get store data from local store and with email as key', async () => {
      const mockData = {
        [otpData.email]: otpData,
      };

      storeService.setData(mockData);
      expect(storeService.getData(otpData.email).email).toBe(otpData.email);
      expect(storeService.getData(otpData.email).otp).toBe(otpData.otp);
    });
  });
});

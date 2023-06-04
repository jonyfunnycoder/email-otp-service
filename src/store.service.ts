import { Injectable } from '@nestjs/common';

export interface IUserStore {
  email: string;
  otp: number;
  sentTime: Date;
  limit: 0;
}

export interface IUserStoreMap {
  [Key: string]: IUserStore;
}

@Injectable()
export class StoreService {
  UsersStoreMap: IUserStoreMap = {};

  setData(data: IUserStoreMap): IUserStoreMap {
    this.UsersStoreMap = {
      ...this.UsersStoreMap,
      ...data,
    };
    return this.UsersStoreMap;
  }

  getData(email: string): IUserStore {
    return this.UsersStoreMap[email];
  }
}

import { DataSource } from 'typeorm';

export const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: process.env.db_dilect as unknown as 'mysql',
        host: process.env.db_host,
        port: parseInt(process.env.db_port) as unknown as number,
        username: process.env.db_username,
        password: process.env.db_password,
        database: process.env.db_database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];

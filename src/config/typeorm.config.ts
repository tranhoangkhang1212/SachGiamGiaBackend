import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';

const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
  subscribers: [],
  cli: {
    migrationsDir: __dirname + '/../database/migrations',
  },
};

export = typeOrmConfig;

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: process.env.DB_USER_ID,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'], // entity 내 모든 파일
  migrations: [],
  subscribers: [],
});

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Series } from './entities/Series';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [Series],
    migrations: [],
    subscribers: [],
});

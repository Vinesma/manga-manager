import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: ['query', 'error'],
    entities: ['src/entities/*.ts'],
    migrations: [],
    subscribers: [],
});

export default dataSource;

import { DataSource } from 'typeorm';
import { Logger } from '../logger';

export default class Database {
    dataSource = new DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: true,
        logging: ['query', 'error'],
        entities: ['src/entities/*.ts'],
        migrations: [],
        subscribers: [],
    });
    private readonly logger = new Logger(Database.name);

    async init() {
        try {
            await this.dataSource.initialize();
            this.logger.info('Data source initialized successfully.');
        } catch (error) {
            throw error;
        }
    }

    async close() {
        await this.dataSource.destroy();
        this.logger.info('Data source connection destroyed.');
    }
}

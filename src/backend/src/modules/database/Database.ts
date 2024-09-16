import { entities } from '../../../src/entities';
import { DataSource } from 'typeorm';

export default class Database {
    dataSource = new DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
    });
    private logContext = `[${Database.name}]`;

    async init() {
        try {
            await this.dataSource.initialize();
            console.log(this.logContext, 'Data source initialized successfully.');
        } catch (error) {
            throw error;
        }
    }

    async close() {
        await this.dataSource.destroy();
        console.log(this.logContext, 'Data source connection destroyed.');
    }
}

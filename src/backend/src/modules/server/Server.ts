import express from 'express';
import { Server as HttpServer } from 'http';
import { Database } from '../database';
import { Logger } from '../logger';
import { Series } from '../../entities/Series';

export default class Server {
    private readonly app = express();
    private readonly database = new Database();
    private readonly port: number;
    private readonly logger = new Logger(Server.name);
    private server?: HttpServer;

    constructor(PORT: number) {
        this.port = PORT;
    }

    private initProcessEvents() {
        process.on('SIGINT', () => this.stop('SIGINT received: shutting down...'));
        process.on('SIGTERM', () => this.stop('SIGTERM received: shutting down...'));
    }

    private logSystemInfo() {
        this.logger.info('Node version:', process.version);
        this.logger.info('Platform:', process.platform);
        this.logger.info('Arch:', process.arch);
    }

    async start() {
        try {
            this.logger.info('Server startup...');

            this.initProcessEvents();
            this.logSystemInfo();

            await this.database.init();

            this.app.use(express.json());

            this.server = this.app.listen(this.port, () => {
                this.logger.info('Running on port:', this.port);

                (async () => {
                    const seriesRepository = this.database.dataSource.getRepository(Series);

                    const allSeries = await seriesRepository.find();
                    this.logger.info('All series in DB', allSeries);
                })();
            });
        } catch (error) {
            this.logger.fatal(error);
            this.stop('Stopped due to error.', { error: true });
        }
    }

    async stop(message: string, options?: { error?: boolean }) {
        const exitStatus = options?.error ? 1 : 0;

        this.logger.info(message);
        await this.database.close();

        if (!this.server) {
            this.logger.warn('No running server to stop!');
            process.exitCode = exitStatus;
            throw Error('Server did not start.');
        }

        this.server.close(() => {
            this.logger.info('HTTP server closed.');
            process.exitCode = exitStatus;
        });
    }
}

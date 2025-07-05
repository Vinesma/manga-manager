import express from 'express';
import { Server as HttpServer } from 'http';
import { Database } from '../database';
import { Logger } from '../logger';
import { SeriesScanner, BookScanner } from '../scanners';
import { Parser } from '../rss/Parser';
import { ApiRouter } from '../../routers';
import cookieParser from 'cookie-parser';

export default class Server {
    private readonly app = express();
    private readonly database = Database;
    private readonly port: number;
    private readonly logger = new Logger(Server.name);
    private server?: HttpServer;

    private apiRouter = new ApiRouter();
    private seriesScanner: SeriesScanner;
    private bookScanner: BookScanner;
    private seriesBookParser: Parser;

    constructor() {
        this.port = parseInt(process.env.PORT || '', 10) || 5000;
    }

    private initProcessEvents() {
        process.on('SIGINT', () => this.stop('\nSIGINT received: shutting down...'));
        process.on('SIGTERM', () => this.stop('\nSIGTERM received: shutting down...'));
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

            await this.database.initialize();

            this.app.use(express.json());
            this.app.use(cookieParser());

            this.app.use('/api', this.apiRouter.router);

            this.server = this.app.listen(this.port, () => {
                this.logger.info('Running on port:', this.port);
            });
        } catch (error) {
            this.logger.fatal(error);
            this.stop('Stopped due to error.', { error: true });
        }
    }

    async stop(message: string, options?: { error?: boolean }) {
        const exitStatus = options?.error ? 1 : 0;

        this.logger.info(message);
        await this.database.destroy();

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

import express from 'express';
import { Server as HttpServer } from 'http';
import { Database } from '../database';
import { Series } from '../../entities/Series';

export default class Server {
    private readonly app = express();
    private readonly database = new Database();
    private readonly port: number;
    private server?: HttpServer;
    private logContext = `[${Server.name}]`;

    constructor(PORT: number) {
        this.port = PORT;
    }

    private initProcessEvents() {
        process.on('SIGINT', () => this.stop('SIGINT received: shutting down...'));
        process.on('SIGTERM', () => this.stop('SIGTERM received: shutting down...'));
    }

    private logSystemInfo() {
        console.log(this.logContext, 'Node version:', process.version);
        console.log(this.logContext, 'Platform:', process.platform);
        console.log(this.logContext, 'Arch:', process.arch);
    }

    async start() {
        try {
            console.log(this.logContext, 'Server startup...');

            this.initProcessEvents();
            this.logSystemInfo();

            await this.database.init();

            this.app.use(express.json());

            this.server = this.app.listen(this.port, () => {
                console.log(this.logContext, 'Running on port:', this.port);

                (async () => {
                    const seriesRepository = this.database.dataSource.getRepository(Series);

                    const allSeries = await seriesRepository.find();
                    console.log(this.logContext, 'All series in DB', allSeries);
                })();
            });
        } catch (error) {
            console.error(this.logContext, error);
            this.stop('Stopped due to error.', { error: true });
        }
    }

    async stop(message: string, options?: { error?: boolean }) {
        const exitStatus = options?.error ? 1 : 0;

        console.log('\n%s', this.logContext, message);
        await this.database.close();

        if (!this.server) {
            console.log(this.logContext, 'No running server to stop.');
            process.exit(exitStatus);
        }

        this.server.close(() => {
            console.log(this.logContext, 'HTTP server closed.');
            process.exit(exitStatus);
        });
    }
}

import express from 'express';
import { Server as HttpServer } from 'http';
import { Database } from '../database';
import { Logger } from '../logger';
import { SeriesScanner, BookScanner } from '../scanners';
import { Parser } from '../rss/Parser';
import { BookRepository, RootPathRepository, SeriesRepository } from '../repositories';

export default class Server {
    private readonly app = express();
    private readonly database = new Database();
    private readonly port: number;
    private readonly logger = new Logger(Server.name);
    private server?: HttpServer;

    private seriesScanner: SeriesScanner;
    private bookScanner: BookScanner;
    private seriesBookParser: Parser;

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
                    const rootPathRepository = new RootPathRepository(this.database.dataSource);
                    const seriesRepository = new SeriesRepository(this.database.dataSource);
                    // const seriesAlternateTitleRepository =
                    //     this.database.dataSource.getRepository(SeriesAlternateTitle);
                    const bookRepository = new BookRepository(this.database.dataSource);

                    this.seriesBookParser = new Parser();
                    this.bookScanner = new BookScanner(bookRepository, this.seriesBookParser);
                    this.seriesScanner = new SeriesScanner(seriesRepository, this.bookScanner);

                    const rootPaths = await rootPathRepository.listAll({
                        relations: { series: true },
                    });
                    await this.seriesScanner.scanRootPath(rootPaths[0], rootPaths[0].series);

                    // const testRootPath = rootPathRepository.create({
                    //     path: '/home/vinesma/Documents/Manga/ForTesting',
                    //     series: [],
                    // });
                    // const series = await this.seriesScanner.scanRootPath(
                    //     testRootPath,
                    //     testRootPath.series
                    // );
                    // testRootPath.series = series;
                    // rootPathRepository.save(testRootPath);

                    await rootPathRepository.listAll({ relations: { series: true } }, true);
                    await seriesRepository.listAll({ relations: { books: true } }, true);
                    await bookRepository.listAll(undefined, true);
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

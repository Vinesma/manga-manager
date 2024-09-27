import fs from 'node:fs';
import path from 'node:path';
import { Logger } from '../logger';
import { RootPath, Series } from '../../entities';
import { BookScanner } from '.';
import { SeriesRepository } from '../repositories';

export default class SeriesScanner {
    private readonly seriesRepository;
    private readonly bookScanner;
    private readonly logger = new Logger(SeriesScanner.name);

    constructor(seriesRepository: SeriesRepository, bookScanner: BookScanner) {
        this.seriesRepository = seriesRepository;
        this.bookScanner = bookScanner;
    }

    private async seriesFromDirectory(
        rootPath: RootPath,
        directory: string,
        expectedSeriesDirectories: string[]
    ) {
        if (expectedSeriesDirectories.includes(directory)) {
            this.logger.debug('Series already exists for directory:', directory, 'skipping...');
            return;
        }

        const books = await this.bookScanner.booksFromDirectory(directory, rootPath.path);

        const series = this.seriesRepository.create({
            title: directory,
            directory,
            monitored: false,
            alternateTitles: [],
            books: books,
        });

        return series;
    }

    private async seriesFromDirectories(
        rootPath: RootPath,
        directories: string[],
        expectedSeries: Series[]
    ) {
        const expectedSeriesDirectories = expectedSeries.map((series) => series.directory);
        let series = [];

        for (const directory of directories) {
            const newSeries = await this.seriesFromDirectory(
                rootPath,
                directory,
                expectedSeriesDirectories
            );
            if (newSeries) {
                series.push(newSeries);
            }
        }

        await this.seriesRepository.save(series);

        return series;
    }

    async scanRootPath(rootPath: RootPath, expectedSeries: Series[]) {
        try {
            this.logger.info('Scanning root path at:', rootPath.path);

            const files = fs.readdirSync(rootPath.path);
            const directories = files.filter((file) => {
                const directoryPath = path.join(rootPath.path, file);
                return fs.statSync(directoryPath).isDirectory();
            });

            this.logger.debug('All files:', files);
            this.logger.debug('Directories (Series) found:', directories);

            this.logger.info(
                'Finished scanning directory at:',
                rootPath.path,
                'Found',
                directories.length,
                'Series'
            );

            const series = await this.seriesFromDirectories(rootPath, directories, expectedSeries);
            return series;
        } catch (error) {
            this.logger.error(error);
        }
    }
}

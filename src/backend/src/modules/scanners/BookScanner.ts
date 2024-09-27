import fs from 'node:fs';
import path from 'node:path';
import { Logger } from '../logger';
import { Parser } from '../rss/Parser';
import { BookRepository } from '../repositories';

export default class BookScanner {
    private readonly logger = new Logger(BookScanner.name);
    private readonly bookRepository;
    private readonly seriesBookParser;

    static SUPPORTED_FORMATS = ['.pdf', '.cbz'];

    constructor(bookRepository: BookRepository, seriesBookParser: Parser) {
        this.bookRepository = bookRepository;
        this.seriesBookParser = seriesBookParser;
    }

    private async bookFromFile(filename: string) {
        try {
            const extension = path.extname(filename);
            const title = path.basename(filename, extension);

            const volumeParse = this.seriesBookParser.extractVolumeInformation(title);
            const chapterParse = this.seriesBookParser.extractChapterInformation(title);

            const parsedVolume = volumeParse?.volumeFrom ?? 1;
            const parsedChapter = chapterParse?.chapterFrom ?? 1;

            const book = this.bookRepository.create({
                filename,
                title,
                volume: Number(parsedVolume),
                chapter: Number(parsedChapter),
                monitored: false,
            });

            await this.bookRepository.save(book);

            return book;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async booksFromDirectory(directory: string, absPath: string) {
        try {
            this.logger.info('Scanning for books at:', directory);

            const files = fs.readdirSync(path.join(absPath, directory));
            const bookFiles = files.filter((file) => {
                const dirPath = path.join(absPath, directory, file);
                return (
                    fs.statSync(dirPath).isFile() &&
                    BookScanner.SUPPORTED_FORMATS.some((extension) => file.endsWith(extension))
                );
            });

            this.logger.debug('All directory files:', files);
            this.logger.debug('Books found:', bookFiles);

            const books = await Promise.all(
                bookFiles.map(async (bookFile) => await this.bookFromFile(bookFile))
            );

            this.logger.info(
                'Finished scanning for books at:',
                directory,
                'Found',
                books.length,
                'Books'
            );

            return books;
        } catch (error) {
            this.logger.error(error);
        }
    }
}

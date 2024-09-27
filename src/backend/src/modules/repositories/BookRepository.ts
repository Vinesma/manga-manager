import { DataSource } from 'typeorm';
import { Book } from '../../entities';
import { BaseRepository } from './BaseRepository';
import { Logger } from '../logger';

export class BookRepository extends BaseRepository<Book> {
    constructor(dataSource: DataSource) {
        super(dataSource, dataSource.getRepository(Book), new Logger(BookRepository.name));
    }
}

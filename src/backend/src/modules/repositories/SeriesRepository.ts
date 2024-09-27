import { DataSource } from 'typeorm';
import { Series } from '../../entities';
import { BaseRepository } from './BaseRepository';
import { Logger } from '../logger';

export class SeriesRepository extends BaseRepository<Series> {
    constructor(dataSource: DataSource) {
        super(dataSource, dataSource.getRepository(Series), new Logger(SeriesRepository.name));
    }
}

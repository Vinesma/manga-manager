import { DataSource } from 'typeorm';
import { RootPath } from '../../entities';
import { Logger } from '../logger';
import { BaseRepository, TListAllOptions } from './BaseRepository';

export class RootPathRepository extends BaseRepository<RootPath> {
    constructor(dataSource: DataSource) {
        super(dataSource, dataSource.getRepository(RootPath), new Logger(RootPathRepository.name));
    }

    async listAll(options?: TListAllOptions<RootPath>, log?: boolean) {
        const allRootPaths = await super.listAll(options);

        if (log) {
            this.logger.info('All RootPaths:', allRootPaths);

            this.logger.info(
                'All Series from all RootPaths:',
                allRootPaths.map((rootPath) => rootPath.series)
            );
        }

        return allRootPaths;
    }
}

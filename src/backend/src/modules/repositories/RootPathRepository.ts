import { DataSource } from 'typeorm';
import { RootPath } from '../../entities';
import { Logger } from '../logger';
import { RepositoryMethods } from './RepositoryMethods';

export class RootPathRepository {
    private readonly repositoryMethods;

    constructor(dataSource: DataSource) {
        this.repositoryMethods = new RepositoryMethods(
            dataSource.getRepository(RootPath),
            new Logger(RootPathRepository.name)
        );
    }

    async listAll(options?: Parameters<typeof this.repositoryMethods.listAll>[0], log?: boolean) {
        const allRootPaths = await this.repositoryMethods.listAll(options);

        if (log) {
            this.repositoryMethods.logger.info('All RootPaths:', allRootPaths);

            this.repositoryMethods.logger.info(
                'All Series from all RootPaths:',
                allRootPaths.map((rootPath) => rootPath.series)
            );
        }

        return allRootPaths;
    }
}

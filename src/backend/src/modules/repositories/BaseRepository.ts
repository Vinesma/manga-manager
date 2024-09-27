import { DataSource, DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { Logger } from '../logger';

export type TListAllOptions<EntityObject> = FindManyOptions<EntityObject>;

export class BaseRepository<EntityObject> {
    protected readonly dataSource;
    protected readonly repository;
    protected readonly logger;

    constructor(dataSource: DataSource, repository: Repository<EntityObject>, logger: Logger) {
        this.dataSource = dataSource;
        this.repository = repository;
        this.logger = logger;
    }

    public async listAll(options?: TListAllOptions<EntityObject>, log?: boolean) {
        const allSavedEntities = await this.repository.find(options);

        if (log) {
            this.logger.info('Entities found:', allSavedEntities);
        }

        return allSavedEntities;
    }

    public create(entity: DeepPartial<EntityObject>) {
        const unsavedEntity = this.repository.create(entity);
        return unsavedEntity;
    }

    public async save(entity: EntityObject | EntityObject[]) {
        try {
            if (Array.isArray(entity)) {
                await this.repository.save(entity);
            } else {
                await this.repository.save(entity);
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}

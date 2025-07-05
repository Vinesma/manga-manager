import { LogLevel } from '../../config/constants';
import { DataSource, LogLevel as TypeORMLogLevel } from 'typeorm';

const level = parseInt(process.env.LOG_LEVEL || '', 10) || LogLevel.TRACE;

const databaseLogLevels: Record<number, TypeORMLogLevel[]> = {
    [LogLevel.TRACE]: ['query', 'schema', 'error', 'warn', 'info', 'log', 'migration'],
    [LogLevel.DEBUG]: ['query', 'schema', 'error', 'warn', 'info', 'log', 'migration'],
    [LogLevel.INFO]: ['query', 'error', 'warn', 'info'],
    [LogLevel.WARN]: ['error', 'warn'],
    [LogLevel.ERROR]: ['error', 'warn'],
    [LogLevel.FATAL]: ['error'],
};

const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging:
        process.env.NODE_ENV === 'production'
            ? databaseLogLevels[LogLevel.WARN]
            : databaseLogLevels[level],
    entities: ['src/entities/*.ts'],
    migrations: [],
    subscribers: [],
});

export default dataSource;

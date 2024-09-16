import { LogLevel } from '../../config/constants';

type TLogLevelKeys = keyof typeof LogLevel;

export default class Logger {
    private logLevel = LogLevel.INFO;
    private sourceContext: string = Logger.name;

    constructor(sourceContext: string) {
        this.sourceContext = `[${sourceContext}]`;
    }

    static StreamWriters: Record<TLogLevelKeys, (message?: unknown, ...params: unknown[]) => void> =
        {
            TRACE: console.trace,
            DEBUG: console.debug,
            INFO: console.info,
            WARN: console.warn,
            ERROR: console.error,
            FATAL: console.error,
        };

    private log(levelName: TLogLevelKeys, ...args: unknown[]) {
        const level = LogLevel[levelName];

        if (level < this.logLevel) {
            return;
        }

        const write = Logger.StreamWriters[levelName];
        write(levelName, this.sourceContext, ...args);
    }

    trace(...args: unknown[]) {
        this.log('TRACE', ...args);
    }

    debug(...args: unknown[]) {
        this.log('DEBUG', ...args);
    }

    info(...args: unknown[]) {
        this.log('INFO', ...args);
    }

    warn(...args: unknown[]) {
        this.log('WARN', ...args);
    }

    error(...args: unknown[]) {
        this.log('ERROR', ...args);
    }

    fatal(...args: unknown[]) {
        this.log('FATAL', ...args);
    }
}

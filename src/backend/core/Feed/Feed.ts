import Parser, { ParserOptions } from 'rss-parser';

export default class Feed<T = { [key: string]: any }, U = { [key: string]: any }> {
    private parser;

    constructor(options?: ParserOptions<T, U>) {
        this.parser = new Parser(options);
    }

    parse(url: string) {
        return this.parser.parseURL(url);
    }
}

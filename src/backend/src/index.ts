import 'dotenv/config';
import 'reflect-metadata';
import { Feed } from './modules/rss/Feed';
import { Server } from './modules/server';

const server = new Server();
server.start();

const feed = new Feed({
    customFields: {
        item: [
            ['nyaa:seeders', 'seeders'],
            ['nyaa:leechers', 'leechers'],
            ['nyaa:size', 'size'],
        ],
    },
});

async function testParse() {
    let result = await feed.parse('https://nyaa.si/?page=rss&c=3_1&f=0');

    console.log(result);
}

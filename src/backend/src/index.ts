import { Feed } from './modules/rss/Feed';
import { Server } from './modules/server';
import { DEFAULT } from './config/constants';
import 'reflect-metadata';

const PORT = Number(process.env.PORT) || DEFAULT.PORT;

const server = new Server(PORT);
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

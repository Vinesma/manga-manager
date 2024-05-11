import express from 'express';
import { Feed } from './core/Feed';

const app = express();
const feed = new Feed({
    customFields: {
        item: [
            ['nyaa:seeders', 'seeders'],
            ['nyaa:leechers', 'leechers'],
            ['nyaa:size', 'size'],
        ],
    },
});
const PORT = process.env.PORT || 7569;

app.use(express.json());

async function testParse() {
    let result = await feed.parse('https://nyaa.si/?page=rss&c=3_1&f=0');

    console.log(result);
}

const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);

    testParse();
});

process.on('SIGTERM', () => {
    console.debug('SIGTERM received: shutting down server.');
    server.close(() => {
        console.debug('HTTP server closed.');
    });
});

import express from 'express';
import 'reflect-metadata';
import { Feed } from './modules/rss/Feed';
import { AppDataSource } from './data-source';
import { Series } from './entities/Series';

const PORT = process.env.PORT || 7569;

AppDataSource.initialize()
    .then(async () => {
        console.log('Data source initialized successfully.');

        const app = express();

        app.use(express.json());

        const server = app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);

            // (async () => {
            //     const seriesRepository = AppDataSource.getRepository(Series);
            //     const allSeries = await seriesRepository.find();
            //     console.log('All series in DB', allSeries);
            // })();
        });

        const shutdown = (message: string) => {
            console.log('\n%s', message);
            server.close(async () => {
                await AppDataSource.destroy();
                console.log('HTTP server closed.');
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT received: shutting down...'));
        process.on('SIGTERM', () => shutdown('SIGTERM received: shutting down...'));
    })
    .catch((error) => console.error(error));

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

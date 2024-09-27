import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
    ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import type { Book } from './Book';
import type { SeriesAlternateTitle } from './SeriesAlternateTitle';
import type { RootPath } from './RootPath';

@Entity()
export class Series {
    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    title: string;

    @Column()
    directory: string;

    @Column()
    monitored: boolean;

    @ManyToOne('RootPath', (rootPath: RootPath) => rootPath.series)
    rootPath: RootPath;

    @OneToMany(
        'SeriesAlternateTitle',
        (alternateTitle: SeriesAlternateTitle) => alternateTitle.series
    )
    alternateTitles: SeriesAlternateTitle[];

    @OneToMany('Book', (book: Book) => book.series)
    books: Book[];
}

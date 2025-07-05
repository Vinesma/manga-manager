import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    BeforeInsert,
} from 'typeorm';
import type { Book } from './Book';
import type { SeriesAlternateTitle } from './SeriesAlternateTitle';
import type { RootPath } from './RootPath';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Series {
    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uuid: string;

    @Column()
    title: string;

    @Column()
    directory: string;

    @Column()
    monitored: boolean;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @VersionColumn()
    tableVersion: number;

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

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    BeforeInsert,
} from 'typeorm';
import type { Series } from './Series';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Book {
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
    filename: string;

    @Column()
    volume: number;

    @Column()
    chapter: number;

    @Column()
    monitored: boolean;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @VersionColumn()
    tableVersion: number;

    @ManyToOne('Series', (series: Series) => series.books)
    series: Series;
}

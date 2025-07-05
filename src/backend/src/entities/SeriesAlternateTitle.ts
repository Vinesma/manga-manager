import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    BeforeInsert,
} from 'typeorm';
import type { Series } from './Series';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class SeriesAlternateTitle {
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

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @VersionColumn()
    tableVersion: number;

    @ManyToOne('Series', (series: Series) => series.alternateTitles)
    series: Series;
}

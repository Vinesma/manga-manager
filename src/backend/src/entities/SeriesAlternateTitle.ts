import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import type { Series } from './Series';

@Entity()
export class SeriesAlternateTitle {
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

    @ManyToOne('Series', (series: Series) => series.alternateTitles)
    series: Series;
}

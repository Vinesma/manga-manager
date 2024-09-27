import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import type { Series } from './Series';

@Entity()
export class RootPath {
    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column({
        unique: true,
    })
    path: string;

    @OneToMany('Series', (series: Series) => series.rootPath)
    series: Series[];
}

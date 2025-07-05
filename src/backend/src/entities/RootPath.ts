import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    BeforeInsert,
} from 'typeorm';
import type { Series } from './Series';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RootPath {
    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uuid: string;

    @Column({
        unique: true,
    })
    path: string;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @VersionColumn()
    tableVersion: number;

    @OneToMany('Series', (series: Series) => series.rootPath)
    series: Series[];
}

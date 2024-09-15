import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Series {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    alternateTitles: string;

    @Column()
    rootPath: string;

    @Column()
    monitored: boolean;
}

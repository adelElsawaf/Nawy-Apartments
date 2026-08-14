import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { Project } from '../../project/project.entity';
import { ApartmentType } from '../enums/apartment-type.enum';
import { FinishingStatus } from '../enums/finishing-status.enum';
import type { ApartmentImage } from './apartment-image.entity';

@Entity('apartments')
@Unique(['unitNumber', 'project'])
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'unit_name', length: 120 })
  unitName: string;

  @Column({ name: 'unit_number', length: 50 })
  unitNumber: string;

  @Column({ type: 'enum', enum: ApartmentType })
  type: ApartmentType;

  @ManyToOne('Project', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project: Project | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  price: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  area: string;

  @Column({ type: 'int' })
  rooms: number;

  @Column({ type: 'int' })
  bedrooms: number;


  @Column({ type: 'int' })
  bathrooms: number;

  @Column({ type: 'int', nullable: true })
  floor: number | null;

  @Column({
    name: 'finishing_status',
    type: 'enum',
    enum: FinishingStatus,
  })
  finishingStatus: FinishingStatus;

  @OneToMany('ApartmentImage', 'apartment', { cascade: ['insert'] })
  images: ApartmentImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

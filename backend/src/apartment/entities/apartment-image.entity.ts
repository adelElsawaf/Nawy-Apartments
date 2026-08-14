import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApartmentImageType } from '../enums/apartment-image-type.enum';
import type { Apartment } from './apartment.entity';

@Entity('apartment_images')
export class ApartmentImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Apartment', 'images', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @Column({ length: 500 })
  path: string;

  @Column({ type: 'enum', enum: ApartmentImageType })
  type: ApartmentImageType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

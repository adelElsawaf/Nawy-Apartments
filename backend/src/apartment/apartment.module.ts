import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { ApartmentImage } from './entities/apartment-image.entity';
import { Apartment } from './entities/apartment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apartment, ApartmentImage]),
    ProjectModule,
  ],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [TypeOrmModule, ApartmentService],
})
export class ApartmentModule {}

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';
import { StorageService } from './storage.service';

@Module({
  imports: [MulterModule.register(multerOptions)],
  providers: [StorageService],
  exports: [MulterModule, StorageService],
})
export class StorageModule {}

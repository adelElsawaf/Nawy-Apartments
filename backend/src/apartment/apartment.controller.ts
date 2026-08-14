import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentRequestDto } from './dto/request/create-apartment-request.dto';
import { GetAllRequestDto } from './dto/request/get-all-request.dto';
import { ApartmentResponseDto } from './dto/response/apartment-response.dto';
import { GetAllResponseDto } from './dto/response/get-all-response.dto';

@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateApartmentRequestDto,
  ): Promise<ApartmentResponseDto> {
    return this.apartmentService.create(dto);
  }

  @Get()
  getAll(@Query() query: GetAllRequestDto): Promise<GetAllResponseDto> {
    return this.apartmentService.getAll(query);
  }

  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApartmentResponseDto> {
    return this.apartmentService.getById(id);
  }
}

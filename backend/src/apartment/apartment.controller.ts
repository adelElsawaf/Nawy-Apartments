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
import { ApiCreateApartment } from './documentation/apis/create-apartment.api';
import { ApiGetAllApartments } from './documentation/apis/get-all-apartments.api';
import { ApiGetApartmentById } from './documentation/apis/get-apartment-by-id.api';
import { ApiApartmentController } from './documentation/controllers/apartment.controller.documentation';
import { ApiApartmentDtos } from './documentation/dtos/apartment.dtos.documentation';
import { CreateApartmentRequestDto } from './dto/request/create-apartment-request.dto';
import { GetAllRequestDto } from './dto/request/get-all-request.dto';
import { ApartmentResponseDto } from './dto/response/apartment-response.dto';
import { GetAllResponseDto } from './dto/response/get-all-response.dto';

@ApiApartmentController()
@ApiApartmentDtos()
@Controller('apartments')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateApartment()
  create(
    @Body() dto: CreateApartmentRequestDto,
  ): Promise<ApartmentResponseDto> {
    return this.apartmentService.create(dto);
  }

  @Get()
  @ApiGetAllApartments()
  getAll(@Query() query: GetAllRequestDto): Promise<GetAllResponseDto> {
    return this.apartmentService.getAll(query);
  }

  @Get(':id')
  @ApiGetApartmentById()
  getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApartmentResponseDto> {
    return this.apartmentService.getById(id);
  }
}

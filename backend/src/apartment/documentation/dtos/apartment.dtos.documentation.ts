import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateApartmentImageRequestDto } from '../../dto/request/create-apartment-image-request.dto';
import { CreateApartmentRequestDto } from '../../dto/request/create-apartment-request.dto';
import { GetAllRequestDto } from '../../dto/request/get-all-request.dto';
import { ApartmentImageResponseDto } from '../../dto/response/apartment-image-response.dto';
import { ApartmentResponseDto } from '../../dto/response/apartment-response.dto';
import { GetAllItemResponseDto } from '../../dto/response/get-all-item-response.dto';
import { GetAllResponseDto } from '../../dto/response/get-all-response.dto';

export function ApiApartmentDtos() {
  return applyDecorators(
    ApiExtraModels(
      CreateApartmentRequestDto,
      CreateApartmentImageRequestDto,
      GetAllRequestDto,
      ApartmentResponseDto,
      ApartmentImageResponseDto,
      GetAllItemResponseDto,
      GetAllResponseDto,
    ),
  );
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty()
  @IsIn(['man', 'woman', 'other'])
  gender: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

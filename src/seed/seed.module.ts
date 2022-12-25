import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService, ProductsService],
  imports: [ProductsModule, AuthModule],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { BasketModule } from './basket/basket.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, ProductsModule, BasketModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

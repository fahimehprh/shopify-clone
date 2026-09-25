import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddBasketItemDto } from './dto/add-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { RemoveBasketItemDto } from './dto/remove-basket-item.dto';

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Get(':userId')
    findByUser(@Param('userId') userId: string) {
        return this.basketService.findByUser(userId);
    }

    @Post(':userId/add-item')
    addItem(@Param('userId') userId: string, @Body() addBasketItemDto: AddBasketItemDto) {
        return this.basketService.addItem(userId, addBasketItemDto);
    }

    @Post(':userId/update-item')
    updateItem(
        @Param('userId') userId: string,
        @Body() updateBasketItemDto: UpdateBasketItemDto
    ) {
        return this.basketService.updateItem(userId, updateBasketItemDto);
    }

    @Post(':userId/remove-item')
    removeItem(
        @Param('userId') userId: string,
        @Body() removeBasketItemDto: RemoveBasketItemDto
    ) {
        return this.basketService.removeItem(userId, removeBasketItemDto);
    }
}

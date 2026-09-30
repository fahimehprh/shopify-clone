import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddBasketItemDto } from './dto/add-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { RemoveBasketItemDto } from './dto/remove-basket-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findByUser(@Req() req) {
        return this.basketService.findByUser(req.user.id);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('add-item')
    addItem(@Req () req, @Body() addBasketItemDto: AddBasketItemDto) {
        return this.basketService.addItem(req.user.id, addBasketItemDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('update-item')
    updateItem(
        @Req() req,
        @Body() updateBasketItemDto: UpdateBasketItemDto
    ) {
        return this.basketService.updateItem(req.user.id, updateBasketItemDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('remove-item')
    removeItem(
        @Req() req,
        @Body() removeBasketItemDto: RemoveBasketItemDto
    ) {
        return this.basketService.removeItem(req.user.id, removeBasketItemDto);
    }
}

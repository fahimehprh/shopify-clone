import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BasketStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { AddBasketItemDto } from './dto/add-basket-item.dto';
import { UpdateBasketItemDto } from './dto/update-basket-item.dto';
import { RemoveBasketItemDto } from './dto/remove-basket-item.dto';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreatePendingBasket(userId: string) {
    const existing = await this.prisma.basket.findFirst({
      where: { userId, status: BasketStatus.PENDING },
    });
    if (existing) return existing;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    return this.prisma.basket.create({
      data: { userId, status: BasketStatus.PENDING },
    });
  }

  async findByUser(userId: string) {
    const basket = await this.getOrCreatePendingBasket(userId);
    return this.prisma.basket.findUnique({
      where: { id: basket.id },
      include: { items: { include: { product: true } } },
    });
  }

  async addItem(userId: string, dto: AddBasketItemDto) {
    const basket = await this.getOrCreatePendingBasket(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException(`Product ${dto.productId} not found`);

    const existing = await this.prisma.basketItem.findFirst({
      where: { basketId: basket.id, productId: dto.productId },
    });

    const newQuantity = (existing?.quantity ?? 0) + dto.quantity;
    if (newQuantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} of "${product.name}" in stock`,
      );
    }

    if (existing) {
      return this.prisma.basketItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    }

    return this.prisma.basketItem.create({
      data: { basketId: basket.id, productId: dto.productId, quantity: dto.quantity },
      include: { product: true },
    });
  }

  async updateItem(userId: string, dto: UpdateBasketItemDto) {
    const item = await this.findItemOrThrow(userId, dto.productId);

    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (product && dto.quantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} of "${product.name}" in stock`,
      );
    }

    return this.prisma.basketItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: string, dto: RemoveBasketItemDto) {
    const item = await this.findItemOrThrow(userId, dto.productId);
    await this.prisma.basketItem.delete({ where: { id: item.id } });
  }

  private async findItemOrThrow(userId: string, productId: string) {
    const basket = await this.getOrCreatePendingBasket(userId);
    const item = await this.prisma.basketItem.findFirst({
      where: { basketId: basket.id, productId: productId },
    });
    if (!item) throw new NotFoundException(`Product ${productId} is not in the basket`);
    return item;
  }
}

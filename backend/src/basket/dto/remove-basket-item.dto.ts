import { IsUUID } from 'class-validator';

export class RemoveBasketItemDto {
  @IsUUID()
  productId: string;
}

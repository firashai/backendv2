import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { PurchaseStatus, PaymentMethod } from '../entities/media-purchase.entity';

export class PurchaseMediaContentDto {
  @IsString()
  mediaContentId: string;

  @IsString()
  buyerId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

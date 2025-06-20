import { Util } from '../../../../utils/utils';
import { Product } from '../../../product/domain/entities/product.entity';

export interface PigProductProps {
  pigId: string;
  product: Product;
  quantity: number;
  price: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

type CreatePigProduct = Omit<PigProductProps, 'createdAt' | 'updatedAt'>;

export class PigProduct {
  constructor(
    public readonly id: string,
    private readonly props: PigProductProps,
  ) {}

  static create(props: CreatePigProduct) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new PigProduct(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }
  static fromPrimitives(data: { id: string } & PigProductProps): PigProduct {
    return new PigProduct(data.id, {
      ...data,
    });
  }

  private updateTimeStamps() {
    this.props.updatedAt = Util.now();
  }

  saveDate(date: Date) {
    this.props.date = date;
    this.updateTimeStamps();
  }
  savePrice(price: number) {
    this.props.price = price;
    this.updateTimeStamps();
  }

  saveQuantity(quantity: number) {
    this.props.quantity = quantity;
    this.updateTimeStamps();
  }

  saveProduct(product: Product) {
    this.props.product = product;
    this.updateTimeStamps();
  }

  get date() {
    return this.props.date;
  }
  get price() {
    return this.props.price;
  }
  get quantity() {
    return this.props.quantity;
  }
  get product() {
    return this.props.product;
  }

  get pigId() {
    return this.props.pigId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}

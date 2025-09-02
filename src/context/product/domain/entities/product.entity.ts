import { Util } from '../../../../utils/utils';
import { Category } from '../../../category/domain/entities/category.entity';
import { Farm } from '../../../farm/domain/entities/farm.entity';

interface ProductProps {
  farmId: string;
  category: Category;
  name: string;
  description?: string;
  price: number;
  unitMeasurement: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateProduct = Omit<ProductProps, 'createdAt' | 'updatedAt'>;

export class Product {
  private constructor(
    public readonly id: string,
    private readonly props: ProductProps,
  ) {}

  static create(props: CreateProduct) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Product(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static mapToDomain(data: { id: string } & ProductProps) {
    return new Product(data.id, data);
  }

  private updateTimeStamps() {
    this.props.updatedAt = new Date();
  }

  savePrice(price: number) {
    this.props.price = price;
    this.updateTimeStamps();
  }

  saveUnitMeasurement(unitMeasurement: string) {
    this.props.unitMeasurement = unitMeasurement;
    this.updateTimeStamps();
  }
  
  saveDescription(description: string) {
    this.props.description = description;
    this.updateTimeStamps();
  }

  saveName(name: string) {
    this.props.name = name;
    this.updateTimeStamps();
  }

  saveCategory(category: Category) {
    this.props.category = category;
    this.updateTimeStamps();
  }

  saveFarm(farm: Farm) {
    this.props.farmId = farm.id;
    this.updateTimeStamps();
  }

  get farmId() {
    return this.props.farmId;
  }

  get category() {
    return this.props.category;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }
  get unitMeasurement() {
    return this.props.unitMeasurement;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}

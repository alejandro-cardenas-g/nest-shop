import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', {
    nullable: false,
  })
  url: string;

  @Column('uuid', {
    nullable: false,
    name: 'product_id',
  })
  productId: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}

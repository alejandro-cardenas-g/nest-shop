import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './productImage.entity';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    example: '68d76558-987f-4828-a043-841c6928854d',
    description: 'Product Id',
    uniqueItems: true,
    type: 'uuid v4 string',
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    example: 'Blue Shirt',
    description: 'Product Title',
    uniqueItems: true,
    nullable: false,
  })
  @Column('character varying', {
    unique: true,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    example: 20000,
    description: 'Product Price',
    uniqueItems: false,
    nullable: false,
  })
  @Column('float4', {
    nullable: false,
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Esta camiseta es azul',
    description: 'Product description',
    uniqueItems: false,
    nullable: false,
  })
  @Column('character varying', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'camisa-azul',
    description: 'Product Slug - for SEO',
    uniqueItems: true,
    nullable: false,
  })
  @Column('character varying', {
    unique: true,
    nullable: false,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Quantity',
    nullable: false,
  })
  @Column('int', {
    nullable: false,
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['X', 'XXL', 'M'],
    description: 'Product sizes',
    nullable: false,
    isArray: true,
  })
  @Column('character varying', {
    array: true,
    nullable: false,
  })
  sizes: string[];

  @ApiProperty({
    example: 'woman',
    description: 'Product gender',
    nullable: false,
  })
  @Column('character varying', {
    nullable: false,
  })
  gender: string;

  @ApiProperty({
    example: ['camisas', 'colores primarios'],
    description: 'Product tags - for Searching',
    nullable: false,
    isArray: true,
  })
  @Column('character varying', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @Column('uuid', {
    nullable: false,
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdated() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}

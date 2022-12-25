import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('character varying', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('character varying', {
    nullable: false,
    name: 'full_name',
  })
  fullName: string;

  @Column('bool', {
    nullable: false,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @Column('character varying', {
    nullable: false,
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeInsert()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

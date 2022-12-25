import { Injectable } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repositiory';
import { Product } from '../products/entities';
import { ProductsService } from '../products/products.service';
import { initialDataProducts } from './data/product.data';
import { User } from 'src/auth/entities/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly userRepository: UserRepository,
  ) {}

  async runSeedProducts() {
    await this.insertNewProducts();
    return { status: 'ok' };
  }

  private async deleteTable() {
    await this.productsService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUser() {
    const { users: seedUsers } = initialDataProducts;
    const users: User[] = [];
    for (const seedUser of seedUsers) {
      users.push(
        this.userRepository.create({
          ...seedUser,
          password: hashSync(seedUser.password, 10),
        }),
      );
    }
    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  private async insertNewProducts() {
    await this.deleteTable();
    const { products } = initialDataProducts;
    const returnedUser = await this.insertUser();
    const insertPromises = products.map((product) =>
      this.productsService.create(product, returnedUser),
    );
    await Promise.all(insertPromises);
    return true;
  }
}

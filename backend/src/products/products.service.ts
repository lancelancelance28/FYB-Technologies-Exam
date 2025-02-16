import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(name: string, price: number, description?: string) {
    const product = this.productRepository.create({ name, price, description });
    return this.productRepository.save(product);
  }

  async getAllProducts(page: number = 1, limit: number = 10) {
    const [products, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    };
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(
    id: number,
    updateData: Partial<Product>,
  ): Promise<Product> {
    const product = await this.productRepository.preload({ id, ...updateData });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: `Product with ID ${id} deleted successfully` };
  }
}

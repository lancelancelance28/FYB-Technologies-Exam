import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ) {
    return this.productsService.createProduct(name, price, description);
  }

  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.getAllProducts(page, limit);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProductById(Number(id));
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string, // Change to string, then convert
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.updateProduct(Number(id), updateData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }
}

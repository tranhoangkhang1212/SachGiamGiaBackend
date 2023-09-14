import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from '@common/services/base.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @InjectRepository(Product)
    private userRepository: Repository<Product>,
  ) {
    super();
    this._entity = Product;
    this._model = this.userRepository;
  }
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }
}

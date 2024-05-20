import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/configs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy) { }

  @Post()
  // @UseGuards(AuthGuard
  create(@Body() createProductDto: CreateProductDto) {
    return this.productClient.send({ cmd: 'create-product' }, createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'get-products' }, paginationDto);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productClient.send({ cmd: 'get-product' }, { id }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
    // try {
    //   return await firstValueFrom(
    //     this.productClient.send({ cmd: 'get-product' }, { id })
    //   );

    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productClient.send({ cmd: 'update-product' }, { id, ...updateProductDto }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number,) {
    return this.productClient.send({ cmd: 'delete-product' }, { id }).pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    )
  }

}

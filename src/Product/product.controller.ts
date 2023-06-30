import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../tempdata/product.entity';
import { typecon  } from 'src/tempdata/table.entitiy';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // แผนที่
  @Get('lat_lng_VDC')
  async findAlllat_lng_VDC(): Promise<typecon[]> {
    return this.productService.findAlllat_lng_VDC();
  } 
  @Get('lat_lng_VDP')
  async findAlllat_lng_VDP(): Promise<typecon[]> {
    return this.productService.findAlllat_lng_VDP();
  } 
  
  // ที่ตั้งตามภูมิภาค Donut chartjs
  @Get('region')
  async findAllregion(): Promise<typecon[]> {
    return this.productService.findAllregion();
  } 

  // กราฟเขียวจัดอันดับ service ของตู้
  @Get('Service_VDC')
  async findAllService_VDC(): Promise<typecon[]> {
    return this.productService.findAllService_VDC();
  } 
  @Get('Service_VDP')
  async findAllService_VDP(): Promise<typecon[]> {
    return this.productService.findAllService_VDP();
  } 

  // หน้าแยกของแต่ละ entity
  @Get('vdc')
  async findAllVDC(): Promise<typecon[]> {
    return this.productService.findAllVDC();
  }
  @Get('vdp')
  async findAllVDP(): Promise<typecon[]> {
    return this.productService.findAllVDP();
  }
}
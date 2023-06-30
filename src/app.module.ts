import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '13.228.241.9',
      port: 5432,
      username: 'postgres',
      password: 'i2SFYxw9N9qzCiu1',
      database: 'datamart',
      synchronize: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ProductModule,TransactionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
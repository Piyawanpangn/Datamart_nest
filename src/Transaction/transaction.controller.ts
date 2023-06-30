import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../tempdata/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get('custom')
  async findAllWithSelect(): Promise<Transaction[]> {
    return this.transactionService.findAllWithSelect();
  }
}
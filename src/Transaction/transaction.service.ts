import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../tempdata/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    console.log();
    return this.transactionRepository.find();
  }

  async findAllWithSelect(): Promise<Transaction[]> {
    const query = `SELECT device, entity FROM tempdata.transaction`;
    // console.log('transaction query =>', query);
    return this.transactionRepository.query(query);
  }
}
